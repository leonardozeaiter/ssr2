import React, { useEffect } from "react";
import { renderRoutes } from "react-router-config";
import { connect } from "react-redux";
import { clearReduxRedirect } from "../redux/actions";

let App = props => {
    let { dispatch, reduxRedirect, browserTitle, ...other } = props;

    useEffect(() => {
      //runs only on client every time even in the first render
      //browser title
      if(browserTitle.title != document.title)
         document.title = browserTitle.title;
         
      //whenever app renders, if there's a pending redirect, push/replace then clear the reduxRedirect entry in store
      if (reduxRedirect.path) {
        if (window.location.path != reduxRedirect.path) {
          if (reduxRedirect.replace === true)
            props.history.replace(props.reduxRedirect.path, props.reduxRedirect.state);
          else props.history.push(props.reduxRedirect.path, props.reduxRedirect.state);
        }
  
        dispatch(clearReduxRedirect());
      }
    });

    return (
        <div className="app-main">
          
        {
            props.route && props.route.routes && renderRoutes(props.route.routes)
        }
        </div>
    );
};

App = { component: connect(state => ({reduxRedirect: state.reduxRedirect, browserTitle: state.browserTitle}))(App) };

export { App };