import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { initHomePageStarted, disposePage } from "../redux/actions";

import ("./homepage.scss");

let HomePage = props =>{    
    useEffect(() => {
        //componentDidMount() - does NOT run on the server
        if(props.disposed)
           props.dispatch(initHomePageStarted());

        return () => {
            props.dispatch(disposePage(props.key));
        }
    }, []);
    return (
        <div className="home-page">
            <h2>Hello from home...</h2>
            <p>Test home page</p>
            <NavLink to="/test">Test</NavLink>&nbsp;<NavLink to="/cars">Cars</NavLink>
        </div>
    )
};

HomePage = connect(state => ({...state.pages.homePage}))(HomePage);

export default HomePage;