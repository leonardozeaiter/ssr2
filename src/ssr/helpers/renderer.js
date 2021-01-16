import React, {Suspense} from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { Provider } from "react-redux";
import { Routes } from "../../routing/routes";
import serialize from  "serialize-javascript";
import path from "path";
import { ChunkExtractor } from '@loadable/server'

//create a reference to the absolute path of the client generated loadable-stats
const statsFile = path.resolve(__dirname, '../public/loadable-stats.json');

const renderer = (url, req, store, context) => {
    console.log("RENDERER() IS EXECUTING ...", url);

    // We create an extractor from the statsFile - must be here inside renderer
    const extractor = new ChunkExtractor({ 
        statsFile, 
        publicPath: "/",
        entrypoints: ['main'],
    });

    const jsx = extractor.collectChunks(
        <Provider store={store}>            
            <StaticRouter location={url} context={context} >
                <div>
                    {
                        renderRoutes(Routes)
                    }
                </div>
            </StaticRouter>
        </Provider>
    );

    //get the <script> entries that you need to add before </body>
    const scriptTags = extractor.getScriptTags();

    //get the link tags: <link rel="preload" ...> for your scripts which orders the browser to load them as soon as possible before 
    //page has fully rendered leading to a performance boost     
    const linkTags = extractor.getLinkTags();                          

    const content = renderToString(jsx);

    const html = `
        <html>
            <head>
                ${linkTags}
            </head>
            <body>
                <div id="root">${content}</div>                
                ${scriptTags}
                <script>window.INITIAL_STATE=${serialize(store.getState())}</script>
            </body>
        </html>
        `;

    return html;
};

export {renderer};

