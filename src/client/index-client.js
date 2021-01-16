import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { Provider } from "react-redux";
import { Routes } from "../routing/routes";
import { createClientStore } from "../redux/createclientstore";
import { loadableReady } from '@loadable/component';

//create client store
const store = createClientStore(window.INITIAL_STATE);

//if a redirect occured on the server, change the url of the browser for the <BrowserRouter /> to use it
if (store.getState().reduxRedirect && store.getState().reduxRedirect.path) {
    var path = store.getState().reduxRedirect.path;
    var replace = store.getState().reduxRedirect.replace;

    window.history.replaceState({}, document.title, path);
    
    //although we can uncomment, i prefer that first render from server to always be replace if there's a redirect so that if i am in p0 and i request p1
    //which redirects me to p2, p2 to replace p1 (not push) so that if the user clicks back, he gets back to p0
    //if (replace === true) 
        //window.history.replaceState({}, document.title, path);
    //else 
        //window.history.pushState({}, document.title, path);
}

loadableReady(() => {
    console.log("READY TO HYDRATE")
    const root = document.getElementById('root');
    
    ReactDOM.hydrate(
        <Provider store={store}>
            <BrowserRouter>
                <div>
                    {
                        renderRoutes(Routes)
                    }
                </div>
            </BrowserRouter>
        </Provider>, 
        root);
});
