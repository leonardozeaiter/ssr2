import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { allReducers } from "./reducers/index";
import { AxiosInstance } from "../api/axiosinstance";

const axiosInstance = new AxiosInstance(
    {
      baseURL: "/api",
      timeout: 30000,
      withCredentials: true,
    },
    true
  );

export const createClientStore = initialState => {
    const store = createStore(allReducers, initialState, applyMiddleware(thunk.withExtraArgument({selfAxiosInstance: axiosInstance.instance})));

    axiosInstance.store = store;

    return store;
};