import { PAGES_KEYS } from "../pages/pageskeys";

export const defaultStore = {
    reduxRedirect: {}, //{ path, pageKey, dynamic, replace, clientRedirect, statusCode, state }
    browserTitle: { title: "Proinns" },

    pages:{
        homePage: { key: PAGES_KEYS.HOME, disposed: true },
        carsPage: { key: PAGES_KEYS.CARS, loading: false, loaded: false, error: null, data: null, disposed: true },
        tasksPage: { key: PAGES_KEYS.TASKS, loading: false, loaded: false, error: null, data: null, disposed: true },
        taskPage: { key: PAGES_KEYS.TASK, loading: false, loaded: false, error: null, data: null, disposed: true, id: undefined },
        testPage: { key: PAGES_KEYS.TEST, disposed: true }
    }   
};