import axios from "axios";
import { api } from "./api";
//import { refreshToken, logout } from "../../client/redux/actions";
import { transformResponse } from "./transformresponse";

export class AxiosInstance {
  constructor(config = null, transformResp = true) {
    if (config) 
    {
      this.instance = axios.create(config);
      this.store = {};

      let _this = this;

      this.instance.interceptors.response.use(
        (response) => {
          console.log("Proinns.interceptors.response.success ");//, response);

          return response;
        },
        (err) => {
          console.log("Proinns.Interceptors.Response.Error ");
          //console.log(err);

          let prevConfig = err.config;

          //reject normally unless the error is 401 which we'll handle below
          //N.B. the condition below included || !isBrowser; not sure why so i removed it
          if (!err.response || err.response.status != 401)
            return Promise.reject(err);

          console.log("401 RECEIVED && response exists");
          console.log(err.response);
          //I am here => 401 && err.response exists
          //handle refresh token if TokenExpired or AuthChanged
          if (err.response.data && err.response.data.data && (err.response.data.data.tokenExpired == true || err.response.data.data.authChanged == true))
          {
            prevConfig.url = prevConfig.url.substr(4);

            console.log(
              "***Token Expired || Auth Changed*** REFRESHING>>> ",
              prevConfig
            );

            let {
              tokenExpired,
              authChanged,
              ...other
            } = err.response.data.data;

            _this.store.dispatch(refreshToken(other));

            return _this.instance(prevConfig);
          } 
          else if (prevConfig && prevConfig.data && JSON.parse(prevConfig.data).logoutIfUnAuthorized == true && _this.store.currentUser.isAuthenticated) 
          {
            _store.dispatch(logout());
          }

          return Promise.reject(err);
        }
      );

      //apply transform response
      if (transformResp == true) transformResponse(_this.instance);
    }
  }
}
