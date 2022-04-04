import Axios from "axios";

const API = Axios.create({
  baseURL: "https://3.106.142.227/v1/",
  timeout: 30000,
})

const exceptionHandler = e => {
  let responseContent = {};
  if (e.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (e.response.data.errors) {
      responseContent = {
        status: e.response.status,
        message: e.response.data.message,
        data: e.response.data.data,
        error: e.response.data.errors,
      };
    } else {
      responseContent = {
        status: e.response.status,
        message: e.response.data.message,
        data: e.response.data.data,
      };
    }
  } else if (e.request) {
    // The request was made but no response was received
    // `e.request` is an instance of XMLHttpRequest in the
    // browser and an instance of
    // http.ClientRequest in node.js
    responseContent = {
      status: 503,
      message: "Service Unavailable",
      data: "",
    };
    //return responseContent;
    //console.log(e.request);
  } else {
    //500 Interval Server Error
    // Something happened in setting up the request that triggered an Error
    //console.log('Error', e.message);
    responseContent = {
      status: 500,
      message: e.message,
      data: "",
    };
  }
  return responseContent;
};

export const putRecord =  async (relativeUri, data) => {
  let responseContent = {
    status: "",
    message: "",
    data: "",
  };

  try {
    let response = await API.put(relativeUri, data)
      .then(reponse => {
        responseContent = {
          status: reponse.status,
          data: reponse.data,
        };
        return responseContent;
      })
      .catch(e => {
        return exceptionHandler(e);
      });
    return response;
  } catch (e) {
    return exceptionHandler(e);
  }
}

export const postRecord = async (relativeUri, data) => {
  let responseContent = {
    status: "",
    message: "",
    data: "",
  };
  try {
    let response = await API.post(relativeUri, data)
      .then(response => {
        responseContent = {
          status: response.status,
          data: response.data,
        };

        return responseContent;
      })
      .catch(e => {
        return exceptionHandler(e);
      });
    return response;
  } catch (e) {
    return exceptionHandler(e);
  }
};

export const getRecord = async relativeUri => {
  let responseContent = {
    status: "",
    message: "",
    data: "",
  };
  try {
    let response = await API.get(relativeUri)
      .then(response => {
        responseContent = {
          status: response.status,
          data: response.data,
        };
        return responseContent;
      })
      .catch(e => {
        return exceptionHandler(e);
      });
    return response;
  } catch (e) {
    return exceptionHandler(e);
  }
};

export const deleteRecord = async (relativeUri, data) => {
  let responseContent = {
    status: "",
    message: "",
    data: "",
  };

  try {
    let response = await API.delete(relativeUri, data)
      .then(reponse => {
        responseContent = {
          status: reponse.status,
          data: reponse.data,
        };
        return responseContent;
      })
      .catch(e => {
        return exceptionHandler(e);
      });
    return response;
  } catch (e) {
    return exceptionHandler(e);
  }
}