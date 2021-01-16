import { ACTIONTYPES } from "../actiontypes";
import { PAGES_KEYS } from "../../pages/pageskeys";
import { defaultStore } from "../defaultstore";

export const homePageReducer = (state={}, action) =>{
    if (action.type === ACTIONTYPES.INIT_HOMEPAGE_STARTED)
       return {...state, disposed: false};
    else if ((action.type === ACTIONTYPES.DISPOSE_PAGE && action.pageKey === PAGES_KEYS.HOME) || (action.type === ACTIONTYPES.DISPOSE_OTHER_PAGES && action.pageKey !== PAGES_KEYS.HOME) || action.type === ACTIONTYPES.DISPOSE_ALL_PAGES)
        return {...defaultStore["pages"]["homePage"]};   
    else
        return state;
};