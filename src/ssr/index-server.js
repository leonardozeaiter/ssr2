import "@babel/polyfill";

import proxy from "express-http-proxy";
import { renderer } from "./helpers/renderer"; 
import { Routes } from "../routing/routes";
import { matchRoutes } from "react-router-config";
import { reduxRedirect, disposeAllPages } from "../redux/actions";
import { createServerStore } from "../redux/createserverstore";
import { isNonEmptyObject } from "../utils/utils";

const express = require("express");
const url = require("url");

//create the express app
const app = express();

//set the port on which to listen for requests
//read the port from env. and if not specified let it be 3000 OR app.set("port", process.env.PORT || 1337);//for azure
app.set("port", process.env.PORT || 3000); 

//establish proxy setup required for authentication using cookies
//when the client makes an Api request, it's sent to this server who'll proxy it to the Api server with cookie (if exists) being automatically forwarded
//when the Api call is made from the server (from pageInit()), our code needs to grab the cookies (if any) from request and forward to Api server
const apiProxy = proxy("http://localhost:5000/api", {
  //const apiProxy = proxy("https://weatherapideploy-123.azurewebsites.net/api", {
  proxyReqPathResolver: (req) => url.parse(req.baseUrl).path,
});

app.use("/api/*", apiProxy);

//serve static files from root/public; if we want to make other folders public, we can add additional calls to app.use() as below
//app.use() binds the attached middleware
app.use(express.static("public")); //overload: app.use(express.static("public", { fallthrough: false }));


//dynamically executes the pageInit() of the page corresponding to the current route (if any)
const handlePageInit =  (moduleName, req, store) =>
{
    //we assume that the method name will be pageInit(req, store)
    return import("../pagehandlers/" + moduleName).then(m=>m.pageInit(req,store));//or if exported as default => call m.default(req, store)
};


//handle any request; app.get() handles GET requests; since we'll execute here only as a response to a browser request (i.e. when the user types a url and visits it
//or clicks refresh) => it'll always be a GET. Requests that are POST can be done of course but those are sent to our API server not here.
app.get("*", async (req, res) => {
    //if we're accessing a static file (path contains .) and the above didn't handle it => file doesn't exists => return 404 in order not to return NotFoundPage
    //we could remove this block and return the <NotFound/> with 404 and everything works fine; however, the performance will be lower because we'll build the
    //store and render the <NotFound /> component although we know from the beginning that it's 404; however, if we wish to do so, we can, and if our site
    //refers to ./p1.jpg which does not exist => the <img/> will appear broken and the request to ./p1.jpg will be text/html and 404 whereas it'll be here 
    //plain/text + 404; for the UI it'll be exactly the same; however, if you check the request to ./p1.jpg (if you remove the below if block), you'll find that
    //it has a response whose content is the parsed html of <NotFound /> so we have extra work and response and we don't need it => keep the below if block
    if (req.path.indexOf(".") >= 0) {
        res.sendStatus(404);
        return;
    }
    
    //create a variable to hold the content to be returned to the user
    let content = "";

    //create an empty object to hold StaticRouter context
    let context = {};

    //create the store with initial values defined in defaultStore.js 
    const store = createServerStore(req);

    const proceedWithRequest = (url, context={}) => {
        //check the applicable paths and for each one having a pageInit(), execute it and store its result as a promise; we assume pageInit always returns a promise
        //the second parameter to matchRoutes() must be a url without query string nor hash otherwise, the path will never match => below we removed the ? and # portionss
        let promises = matchRoutes(Routes, url.split(/[?#]/)[0]).map(entry => {
            //remember that there'll always be 2 matching routes for any path: that of the App and that of the page component inside it
            return entry.route.pageInit ? handlePageInit(entry.route.pageInit, req, store) : null;
        });

        //i am here => all the pageInits() have resolved no matter whether successfully or with errors, in both cases, it's the job of each pageInit and the component
        //to update the store based on whether the pageInit failed or succeeded
        Promise.allSettled(promises).then(result => {
            //check if pageInit() caused a redirect; this will be a dynamic redirect but could be client or server
            let state = store.getState();

            console.log("STORE AFTER pageInit() >> ");//, store.getState());
            
            if(state.reduxRedirect && state.reduxRedirect.path && state.reduxRedirect.path != url)
            {                
                //pageInit caused a dynamic redirect - the third condition above is necessary if we redirected to p1 which redirected to p2
                if(state.reduxRedirect.clientRedirect)
                {
                    //client dynamic redirect
                    console.log("A CLIENT DYNAMIC REDIRECT OCCURED...");
                    res.redirect(
                        state.reduxRedirect.path,
                        state.reduxRedirect.statusCode == 301 ? 301 : 302
                        );
            
                    return;
                }
                else{
                    //server dynamic redirect - also includes when pageInit() dispatches global error dynamically
                    console.log("A SERVER DYNAMIC REDIRECT OCCURED...");

                    //dispose all the pages because we're now as we are starting a new request for a new page
                    store.dispatch(disposeAllPages());

                    //since it's a dynamic redirect => state.reduxRedirect.state contains the user data; so if we might get redirected to a page Px, we need
                    //to handle both the static redirect where state is set in <Redirect /> and caught inside Px as props.location.state and Px needs also
                    //to test state.reduxRedirect.state that will contain the state data if dynamic redirect occured
                    proceedWithRequest(state.reduxRedirect.path, isNonEmptyObject(state.reduxRedirect.state) ? {state: {...state.reduxRedirect.state}} : {});

                    return;
                }
            }

            //my store is up-to-date => create the content; keep in my mind 2 things: 1st that req.path does NOT include the query string whereas req.url does
            //second we need to pass url to renderer because although in the first render, url=req.url, if redirect occurs, url will become that of the new route
            content = renderer(url, req, store, context);

            console.log("RENDERER() GENERATED >> ")
            //if the rendered page has set context to contain props.staticContext.notFound=true => return 404
            if (context.notFound === true)
            {
                res.statusCode = 404;
                res.send(content);
                return;
            }
            
            //test if we have static redirect (i.e. if context.url) - this could be client or server
            //if context.url exists => the rendered component returned <Redirect /> and context.url is the full path including query string and hash
            if (context.url)
            {
                //i am here => static redirect - can be client or server
                if (context.location && context.location.state && context.location.state.clientRedirect === true)
                {
                    //client redirect
                    console.log("A CLIENT STATIC REDIRECT OCCURED...");
                    res.redirect(
                        context.location.state && context.location.state.statusCode == 301
                        ? 301
                        : 302,
                        context.url
                    );
            
                    return;
                }
                else
                {
                    //server redirect
                    console.log("A SERVER STATIC REDIRECT OCCURED...");
                    store.dispatch(disposeAllPages());

                    let {clientRedirect, pageKey, statusCode, ...otherState} = context.location.state;
                    
                    store.dispatch(
                        reduxRedirect(
                        { 
                            path: context.url, pageKey: context.location.state.pageKey, dynamic: false,
                            replace: Boolean(context.action.toLowerCase() === "replace"), clientRedirect: false,
                            statusCode: context.location.state && context.location.state.statusCode == 301 ? 301: 302,
                            state: isNonEmptyObject(otherState) ? {...otherState} : undefined
                        })
                    );

                    //i will preserve any state passed to <Redirect /> and pass them inside context.state so that the component can access that state on the server
                    //using props.staticContext.state; on the client, the state is accessed using props.location.state
                    if (context.location && context.location.state)
                    {
                        if (isNonEmptyObject(otherState))
                        {
                            proceedWithRequest(context.url, {state: {...otherState}});
                            return;
                        }                    
                    }

                    proceedWithRequest(context.url);
                    return;
                }
            }
            else{
                console.log("NORMALLY RETURN THE RENDERED COMPONENT CONTENT");
                res.send(content);
                return;
            }                    
        });
    };

    proceedWithRequest(req.url, {});
});

//start listening on the defined port
app.listen(app.get("port"), () => {
    console.log(`SSR App Listening @ http://localhost:${app.get("port")}`);
});
