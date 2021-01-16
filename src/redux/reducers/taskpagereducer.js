import { ACTIONTYPES } from "../actiontypes";
import { PAGES_KEYS } from "../../pages/pageskeys";
import { defaultStore } from "../defaultstore";

export const taskPageReducer = (state={}, action) =>{
    if (action.type === ACTIONTYPES.INIT_TASKPAGE_STARTED)
        return {...state, loading: true, loaded: false, error: null, data: null, initOnServer: true, disposed: false, id: action.id};
    else if (action.type === ACTIONTYPES.INIT_TASKPAGE_SUCCEEDED)
        return {...state, loading: false, loaded: true, error: null, data: action.data, id: action.id};
    else if (action.type === ACTIONTYPES.INIT_TASKPAGE_FAILED)
        return {...state, loading: false, loaded: false, error: action.error, data: null, id: action.id};
    else if ((action.type === ACTIONTYPES.DESTROY_PAGE && action.pageKey === PAGES_KEYS.TASK) || (action.type === ACTIONTYPES.DESTROY_OTHER_PAGES && action.pageKey !== PAGES_KEYS.TASK) || action.type === ACTIONTYPES.DESTROY_ALL_PAGES)
        return {...defaultStore["pages"]["taskPage"]};     
    else
        return state;
};