import { initCarsPageStarted } from "../redux/actions";

const pageInit = (req, store) => {
    return store.dispatch(initCarsPageStarted());
};

export { pageInit };