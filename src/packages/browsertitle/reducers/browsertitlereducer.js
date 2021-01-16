import { ACTIONTYPES } from "../actiontypes";
import { defaultStore } from "../../../redux/defaultstore";

export const browserTitleReducer = (state={}, action) => {
    if (action.type === ACTIONTYPES.BROWSER_TITLE_SET)
        return { ...state, title: action.title };
    else if (action.type === ACTIONTYPES.BROWSER_TITLE_CLEAR)
        return { ...state, title: defaultStore.browserTitle.title };
    else
        return state;
};