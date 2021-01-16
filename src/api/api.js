import { defaultErrorHandler } from "./defaulterrorhandler";

export const api = async ({instance, url, method="GET", data=undefined, headers={}, timeout=undefined, errorHandleConfig, dispatch}={}) => {
    return instance({
        //if a default instance prop value is specified (ex. timeout: 30000) and we set that property below to undefined (ex. timeout: undefined)
        //in the request, timeout will be be 30000 not undefined; if below timeout is 10000 (i.e different than undefined) => it overrides the default
        url,
        method,
        data,
        headers: { ...instance.defaults.headers, ...headers },
        timeout //if not passed => use that of the instance.defaults
    })
    .catch(err => {
        //destructuring is required for errorHandleConfig otherwise error if errorHandleConfig is undefined
        return Promise.reject(defaultErrorHandler(err, dispatch, errorHandleConfig));
    });
};