import React from "react";
import { NavLink } from "react-router-dom";

const UnAuthorizedPage = props =>{    
    return (
        <div>
            <h2>You are NOT authorized to access the resource</h2>
            <NavLink to="/">Home</NavLink>
        </div>
    )
};

export default UnAuthorizedPage;