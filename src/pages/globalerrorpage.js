import React, {useState, useEffect} from "react";
import { Redirect } from "react-router-dom";
import { PAGES_KEYS } from "./pageskeys";

const GlobalErrorPage = props => {
    const [error, setError] = useState(null);//code: int, title: string, message: string, refreshUrl: string

    useEffect(
        ()=>{
            if(props.location && props.location.state){
                setError({
                    code: props.location.state.code, title: props.location.state.title, message: props.location.state.message,
                    refreshUrl: props.location.state.refreshUrl
                });
            }
            else if (props.staticContext && props.staticContext.state){
                setError({
                    code: props.staticContext.state.code, title: props.staticContext.state.title, message: props.staticContext.state.message,
                    refreshUrl: props.staticContext.state.refreshUrl
                });
            }                
        }, [props.location, props.staticContext]);

    let _error = null;

    if(props.location && props.location.state)
       _error ={
        code: props.location.state.code, title: props.location.state.title, message: props.location.state.message,
        refreshUrl: props.location.state.refreshUrl
    };
    else if (props.staticContext && props.staticContext.state){
        _error = {
            code: props.staticContext.state.code, title: props.staticContext.state.title, message: props.staticContext.state.message,
            refreshUrl: props.staticContext.state.refreshUrl
        };
    }    
    else
        _error = error;

    if(!_error)
        return <Redirect to={{pathname: "/", state:{pageKey: PAGES_KEYS.HOME, clientRedirect: false}}} />            
    else
        return (
            <div className="errorPage">
                { _error.title && <h1>{_error.title}</h1> }
                { _error.message && <p>{_error.message}</p> }
            </div>
        );
};

export default GlobalErrorPage;