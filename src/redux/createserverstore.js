import { createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import { allReducers } from "../redux/reducers/index";
import { defaultStore } from "./defaultstore";
import { AxiosInstance } from "../api/axiosinstance";

export const createServerStore = (req) =>{
   const axiosInstance = new AxiosInstance(
    {
      //baseURL: "https://weatherapideploy-123.azurewebsites.net/api",
      baseURL: "http://localhost:5000/api",
      timeout: 30000,
      headers: { cookie: req.get("cookie") || "" },//required in order to forward the received browser cookie
    },
    true //transformResponse=true
  );
   const store = createStore(
       allReducers,
       {...defaultStore},
       applyMiddleware(thunk.withExtraArgument({selfAxiosInstance: axiosInstance.instance})) 
   );

   axiosInstance.store = store;

   return store;
};