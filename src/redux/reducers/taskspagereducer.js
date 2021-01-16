import { ACTIONTYPES } from "../actiontypes";
import { PAGES_KEYS } from "../../pages/pageskeys";
import { defaultStore } from "../defaultstore";

export const tasksPageReducer = (state={}, action) =>{
    if (action.type === ACTIONTYPES.INIT_TASKSPAGE_STARTED)
        return {...state, loading: true, loaded: false, error: null, data: null, initOnServer: true, disposed: false};
    else if (action.type === ACTIONTYPES.INIT_TASKSPAGE_SUCCEEDED)
        return {...state, loading: false, loaded: true, error: null, data: action.data};
    else if (action.type === ACTIONTYPES.INIT_TASKSPAGE_FAILED)
        return {...state, loading: false, loaded: false, error: action.error, data: null};
    else if ((action.type === ACTIONTYPES.DESTROY_PAGE && action.pageKey === PAGES_KEYS.TASKS) || (action.type === ACTIONTYPES.DESTROY_OTHER_PAGES && action.pageKey !== PAGES_KEYS.TASKS) || action.type === ACTIONTYPES.DESTROY_ALL_PAGES)
        return {...defaultStore["pages"]["tasksPage"]};     
    else
        return state;
};