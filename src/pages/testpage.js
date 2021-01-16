import React, { useEffect } from "react";
import { PAGES_KEYS } from "./pageskeys";
import { reduxRedirect } from "../redux/actions";
import { connect } from "react-redux";

let TestPage = props =>{
   useEffect(()=>{
     let t = new Date();
     //if (t.getSeconds() %2 == 0)
         //props.dispatch(createGlobalError(404, "Not Found!", "The page that you specified does not exist..."));
   });

    return (
        <div>
          <br />
          <br/>
          <input type="button" value="Redirect" onClick={()=>props.dispatch(reduxRedirect("/notfound", PAGES_KEYS.NOTFOUND, true))} />
        </div> 
    );
};

TestPage = connect(null)(TestPage);

export default TestPage;