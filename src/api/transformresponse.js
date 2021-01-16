import axios from "axios";

var isNode = require('detect-node');

export const transformResponse = (instance) => {
  instance.interceptors.request.use((config) => {
    console.log("TransformResponse.Interceptors.Request ", config);

    //test if no connection
    if (!isNode && navigator && navigator.onLine == false)
      return Promise.reject({ __transformResponse__noConnection: true });

    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      console.log("TransformResponse.Interceptors.Response.Success ", response);

      //successfull call => transform the success response;
      return {
        ...response,
        succeeded: true,
        isResponseReceived: true,
        isNoConnection: false,
        isCanceled: false,
        isTimedOut: false,
        isBusinessLogicError: false,
        isConcurrencyError: false,
      };
    },
    (err) => {
      console.log("TransformResponse.Interceptors.Response.Error ");//, err);
      let errorResultObject = err;

      //transform err
      if (axios.isCancel(err))
        errorResultObject = {
          ...err,
          succeeded: false,
          isResponseReceived: false,
          isNoConnection: false,
          isCanceled: true,
          isTimedOut: false,
          isBusinessLogicError: false,
          isConcurrencyError: false,
        };
      else if (err.response)
        errorResultObject = {
          ...err,
          succeeded: false,
          isResponseReceived: true,
          isNoConnection: false,
          isCanceled: false,
          isTimedOut: false,
          isBusinessLogicError: err.response.data
            ? Boolean(err.response.data.isBusinessLogicError)
            : false,
          isConcurrencyError:
            err.response.data &&
            (err.response.data.code >= 1 || err.response.data.code <= 4),
          updateUpdateConcurrencyError:
            err.response.data && err.response.data.code == 1,
          updateDeleteConcurrencyError:
            err.response.data && err.response.data.code == 2,
          deleteUpdateConcurrencyError:
            err.response.data && err.response.data.code == 3,
          deleteDeleteConcurrencyError:
            err.response.data && err.response.data.code == 4,
          status: err.response.status,
          statusText: err.response.statusText,
          headers: err.response.headers,
          data: err.response.data,
          config: err.response.config,
          request: err.response.request,
        };
      else if (err.request) {
        if (err.code == "ECONNABORTED")
          //i will handle timeout problem here and not in proinns.request because timeout might have been caught by a previous request layer
          //such as waitndRetry in which case proinns.request doesn't run and we move directly to proinns.response
          errorResultObject = {
            ...err,
            succeeded: false,
            isResponseReceived: false,
            isNoConnection: false,
            isCanceled: false,
            isTimedOut: true,
            isBusinessLogicError: false,
            isConcurrencyError: false,
          };
        else
          errorResultObject = {
            ...err,
            succeeded: false,
            isResponseReceived: false,
            isNoConnection: false,
            isCanceled: false,
            isTimedOut: false,
            isBusinessLogicError: false,
            isConcurrencyError: false,
          };
      } else if (
        navigator &&
        (err.__transformResponse__noConnection || !navigator.onLine)
      ) {
        //being here => proinns.request has directed me here and thus we have err doesn't contain request as it only contains __transformResponse__noConnection
        //so the above elseif is false when no connection and i don't get into it no connection
        //cleaning
        if (err.__transformResponse__noConnection)
          delete err.__transformResponse__noConnection;

        errorResultObject = {
          ...err,
          succeeded: false,
          isResponseReceived: false,
          isNoConnection: true,
          isCanceled: false,
          isTimedOut: false,
          isBusinessLogicError: false,
          isConcurrencyError: false,
        };
      } else
        errorResultObject = {
          ...err,
          succeeded: false,
          isResponseReceived: false,
          isNoConnection: false,
          isCanceled: false,
          isTimedOut: false,
          isBusinessLogicError: false,
          isConcurrencyError: false,
        };

      return Promise.reject(errorResultObject); //or throw errorResultObject
    }
  );
};
