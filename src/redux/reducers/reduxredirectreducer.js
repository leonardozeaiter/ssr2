import { ACTIONTYPES } from "../actiontypes";

const reduxRedirectReducer = (state={}, action) => {
    if (action.type === ACTIONTYPES.REDUX_REDIRECT)
        return { ...action.payload };
    else if (action.type === ACTIONTYPES.REDUX_REDIRECT_CLEAR)
        return {};
    else
        return state;
};

export { reduxRedirectReducer };