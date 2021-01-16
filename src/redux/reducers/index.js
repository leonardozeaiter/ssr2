import { combineReducers } from "redux";
import { reduxRedirectReducer } from "./reduxredirectreducer";
import { browserTitleReducer } from "../../packages/browsertitle/reducers/browsertitlereducer";
import { homePageReducer} from "./homepagereducer";
import { carsPageReducer } from "./carspagereducer";
import { tasksPageReducer } from "./taskspagereducer";
import { taskPageReducer} from "./taskpagereducer";
import {testPageReducer} from "./testpagereducer";

export const allReducers = combineReducers({
    reduxRedirect: reduxRedirectReducer,
    browserTitle: browserTitleReducer,

    pages: combineReducers({
        homePage: homePageReducer,
        carsPage: carsPageReducer,
        tasksPage: tasksPageReducer,
        taskPage: taskPageReducer,
        testPage: testPageReducer
      }),
});