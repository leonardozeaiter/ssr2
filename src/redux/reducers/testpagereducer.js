import { ACTIONTYPES } from "../actiontypes";

export const testPageReducer = (state={}, action) =>{
    if (action.type === ACTIONTYPES.INIT_TESTPAGE_STARTED)
       return {...state, disposed: false};
    else
        return state;
};