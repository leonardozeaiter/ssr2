import { initHomePageStarted } from "../redux/actions";

const pageInit = (req, store) => {
    return store.dispatch(initHomePageStarted());
};

export { pageInit };