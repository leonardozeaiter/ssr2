import React from "react";
import { NavLink } from "react-router-dom";

const NotFoundPage = props => {
    if (props.staticContext)
        props.staticContext.notFound = true;

    return (
        <div>
            <h1>Page Not Found</h1>
            <br/>
            <NavLink to="/">Home</NavLink>
        </div>
    );
};

export default NotFoundPage;

