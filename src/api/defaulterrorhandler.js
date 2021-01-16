import { reduxRedirect } from "../redux/actions";
import { PAGES_KEYS} from "../pages/pageskeys";

const OTHER_ERROR = "An unknown error occured!";

const _isNoConnection = (err, dispatch) => {
    console.log("NO CONNECTION");
};

const _isTimedOut = (err, dispatch) => {
    console.log("CONNECTION TIMED OUT");
};

const _isCanceled = (err, dispatch) => {
    console.log("REQUEST CANCELED");
};

const _isUnAuthenticated = (err, dispatch) => {
    dispatch(reduxRedirect({path:"/", pageKey: PAGES_KEYS.HOME}));
};

const _isUnAuthorized = (err, dispatch) => {
    dispatch(reduxRedirect({path:"/unauthorized", pageKey: PAGES_KEYS.UNAUTHORIZED}));
};

const _isBusinessLogicError = (err, dispatch) => {
    console.log("BUSINESS LOGIC ERROR");
    isOtherError(err, dispatch);
};

const _isOtherError = (err, dispatch) => {
    console.log("OTHER ERROR");
    dispatch(reduxRedirect({path: "/error", pageKey: PAGES_KEYS.ERROR, dynamic: true, state: { message: OTHER_ERROR}}));
};

export const defaultErrorHandler = (err, dispatch, {
    isNoConnection=_isNoConnection, isTimedOut= _isTimedOut, isCanceled= _isCanceled, isUnAuthenticated= _isUnAuthenticated, 
    isUnAuthorized= _isUnAuthorized, isBusinessLogicError= _isBusinessLogicError, isOtherError=_isOtherError}={}) => {
    if (err.isNoConnection){
        isNoConnection(err, dispatch);
    }
    else if (err.isTimedOut){
        isTimedOut(err, dispatch);
    }
    else if (err.isCanceled){
        isCanceled(err, dispatch);
    }
    else if (err.isResponseReceived){            
        if(err.response.status == 401)
        {
            isUnAuthenticated(err, dispatch);
        }
        else if(err.response.status == 403)
        {
            isUnAuthorized(err, dispatch);   
        }
        else if(err.isBusinessLogicError)
        {
            isBusinessLogicError(err, dispatch);
        }
        else 
        {
            isOtherError(err, dispatch);
        }
    } 
    else{
        isOtherError(err, dispatch);
    }

    return err;
};