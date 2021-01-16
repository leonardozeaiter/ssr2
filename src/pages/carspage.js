import React, {useEffect, useState} from "react";
import { connect  } from "react-redux";
import { disposePage } from "../redux/actions";
import { PAGES_KEYS } from "./pageskeys";
import { Redirect } from "react-router-dom";
import { initCarsPageStarted } from "../redux/actions";

const CarsDisplayer = props => {
    return (
        <ul>
            {
                props.data.map((car, index) => <li key={index}>{car.model}</li>)
            }
        </ul>
    )
};

let CarsPage = props => {
    let {loading, loaded, error, data, disposed, dispatch, ...other} = props;

    useEffect(()=>{
        if (disposed)
            dispatch(initCarsPageStarted());

        return () => {
            console.log("CARS PAGE UNMOUNTED")
            props.dispatch(disposePage(props.key));
        };
    }, []);


    //note below when we have error that staticContext is NOT forwarded by default to the child components so we did it manually
    return (
        <>
            {
                loaded && <CarsDisplayer data={data} />
            }
            {
                loading && <h1>Loading...</h1>
            }
            {
                // error && 
                // <>
                //     {
                //         error.title && <h2 style={{color:"red"}}>{error.title}</h2>
                //     }
                //     {
                //         error.message && <p>{error.message}</p>
                //     }
                // </>
                error && <Redirect to={{pathname: "/error", search:"", 
                            state: {
                                pageKey: PAGES_KEYS.ERROR, clientRedirect: false, 
                                title: error.title, message: error.message} }} />
            }
        </>
    );
};

CarsPage = connect(state => ({...state.pages.carsPage}))(CarsPage);

export default CarsPage;