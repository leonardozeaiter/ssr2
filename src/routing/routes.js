import { App } from "../components/app"; 
import { PAGES_KEYS } from "../pages/pageskeys";
import loadable from '@loadable/component';

const LazyHome = loadable(props => import("../pages/homepage"));

const LazyCars = loadable(props => import("../pages/carspage"));

const LazyUnAuthorized = loadable(props => import("../pages/unauthorizedpage"));

const LazyTest = loadable(props =>import ("../pages/testpage"));

const LazyError = loadable(props => import("../pages/globalerrorpage"));

const LazyNotFound = loadable(props => import("../pages/notfoundpage"));


const Routes = [
    {
        ...App,

        routes:[
            { 
                path:"/", exact:true, pageKey: PAGES_KEYS.HOME, component: LazyHome, pageInit: "homepage"
            },
            {
                path: "/cars", exact: true, pageKey: PAGES_KEYS.CARS, component: LazyCars, pageInit: "carspage"
            },
            {
                path: "/unauthorized", exact:true, pageKey: PAGES_KEYS.UNAUTHORIZED, component: LazyUnAuthorized
            },


            {
                path: "/test", exact:true, pageKey: PAGES_KEYS.NOTFOUND, component: LazyTest, pageInit: "testpageinit"
            },

            {
                path: "/error", exact:true, pageKey: PAGES_KEYS.ERROR, component: LazyError
            },
            {
                pageKey: PAGES_KEYS.NOTFOUND, component: LazyNotFound,
            }
        ]
    }
];

export { Routes };