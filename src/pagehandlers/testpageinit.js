import { reduxRedirect } from "../redux/actions";
import { PAGES_KEYS } from "../pages/pageskeys";

const pageInit = (req, store) =>{
   console.log("DAMN")
   return store.dispatch(reduxRedirect("/nf", PAGES_KEYS.NOTFOUND, true, false));
};

export {pageInit};