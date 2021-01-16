import { ACTIONTYPES } from "../actiontypes";

export const setBrowserTitle = (title) => {
   return { type: ACTIONTYPES.BROWSER_TITLE_SET, title };
};

export const clearBrowserTitle = () => ({ type: ACTIONTYPES.BROWSER_TITLE_CLEAR });