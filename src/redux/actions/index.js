import axios from "axios";
import { ACTIONTYPES } from "../actiontypes";
import { PAGES_KEYS } from "../../pages/pageskeys";
import { setBrowserTitle } from "../../packages/browsertitle/actions";
import { api } from "../../api/api";

export const reduxRedirect = ({path, pageKey, dynamic=true, replace=true, clientRedirect=false, statusCode=302, state=undefined}={}) => ({
    type: ACTIONTYPES.REDUX_REDIRECT, 
    payload:{
        path, pageKey, dynamic, replace, clientRedirect, statusCode, state
    }
});

export const clearReduxRedirect = () => ({
    type: ACTIONTYPES.REDUX_REDIRECT_CLEAR
  });

export const disposePage = (pageKey) => ({type: ACTIONTYPES.DISPOSE_PAGE, pageKey});

export const disposeOtherPages = (pageKey) => ({ type: ACTIONTYPES.DISPOSE_OTHER_PAGES, pageKey});

export const disposeAllPages = () => ({type:ACTIONTYPES.DISPOSE_ALL_PAGES});


export const initHomePageStarted = () => async (dispatch, getState) => {
    dispatch({ type: ACTIONTYPES.INIT_HOMEPAGE_STARTED });
    dispatch(setBrowserTitle("Proinns - Home"));

    return Promise.resolve({});
};


export const initCarsPageStarted = () => async (dispatch, getState, extra) =>{
    dispatch({type: ACTIONTYPES.INIT_CARSPAGE_STARTED});
    dispatch(setBrowserTitle("Proinns - Cars"));

    return new Promise((resolve, reject) => {
         api({instance: extra.selfAxiosInstance, url: "/getcars", timeout: 12000, dispatch,
         errorHandleConfig:{
             isOtherError: (err, dispatch)=>{
                 dispatch(initCarsPageFailed({title: "OTHER ERROR", message: "An other error occured..."}));
             }
         }
        })
         .then(res => {
            dispatch(initCarsPageSucceeded(res.data.data));
            resolve(res);
         })
          .catch(err =>{
            //if we exclude the below => in index-server.js, Promise.allSettled() will remain blocked waiting a res or a rej
            reject(err);
          });
    });
};

export const initCarsPageSucceeded = (data) => ({type: ACTIONTYPES.INIT_CARSPAGE_SUCCEEDED, data: data});

export const initCarsPageFailed = (error) => ({type: ACTIONTYPES.INIT_CARSPAGE_FAILED, error });


export const initTasksPageStarted = () => async (dispatch, getState, extra) =>{
    dispatch({type: ACTIONTYPES.INIT_TASKSPAGE_STARTED});
    
    dispatch(setBrowserTitle("Proinns - Tasks"));

    return new Promise((resolve, reject) => {
        extra.selfAxiosInstance.get("/gettasks")
         .then(res => {
            dispatch(initTasksPageSucceeded(res.data.data));
            resolve(res);
         })
         .catch(err =>{
            dispatch(initTasksPageFailed({message: err.response.data.data.message}));
            reject(err);
         })
    });
};

export const initTasksPageSucceeded = (data) => ({type: ACTIONTYPES.INIT_TASKSPAGE_SUCCEEDED, data: data});

export const initTasksPageFailed = (error) => ({type: ACTIONTYPES.INIT_TASKSPAGE_FAILED, error });


export const initTaskPageStarted = (id) => async (dispatch, getState, extra) =>{
    dispatch({type: ACTIONTYPES.INIT_TASKPAGE_STARTED, id});

    dispatch(setBrowserTitle("Proinns - Task"));
    
    return new Promise((resolve, reject) => {
        extra.selfAxiosInstance.get(`/gettask/${id}`)
         .then(res => {
            dispatch(initTaskPageSucceeded(id, res.data.data));
            resolve(res);
         })
         .catch(err =>{
            dispatch(initTaskPageFailed(id, {message: err.response.data.data.message}));
            reject(err);
         })
    });
};

export const initTaskPageSucceeded = (id, data) => ({type: ACTIONTYPES.INIT_TASKPAGE_SUCCEEDED, id, data });

export const initTaskPageFailed = (id, error) => ({type: ACTIONTYPES.INIT_TASKPAGE_FAILED, id, error });


