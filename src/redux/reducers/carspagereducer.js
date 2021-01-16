import { ACTIONTYPES } from "../actiontypes";
import { PAGES_KEYS } from "../../pages/pageskeys";
import { defaultStore } from "../defaultstore";

export const carsPageReducer = (state={}, action) =>{
    if (action.type === ACTIONTYPES.INIT_CARSPAGE_STARTED)
        return {...state, loading: true, loaded: false, error: null, data: null, initOnServer: true, disposed: false};
    else if (action.type === ACTIONTYPES.INIT_CARSPAGE_SUCCEEDED && !state.disposed)
        return {...state, loading: false, loaded: true, error: null, data: action.data};
    else if (action.type === ACTIONTYPES.INIT_CARSPAGE_FAILED && !state.disposed)
        return {...state, loading: false, loaded: false, error: action.error, data: null};
    else if ((action.type === ACTIONTYPES.DISPOSE_PAGE && action.pageKey === PAGES_KEYS.CARS) || (action.type === ACTIONTYPES.DISPOSE_OTHER_PAGES && action.pageKey !== PAGES_KEYS.CARS) || action.type === ACTIONTYPES.DISPOSE_ALL_PAGES)
        return {...defaultStore["pages"]["carsPage"]};     
    else
        return state;
};