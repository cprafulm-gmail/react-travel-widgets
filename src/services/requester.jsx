import Config from "../config";
/*
var appPath = (window.location.host.toString().split(".").length === 2)
  ? appPath = "https://dxcore." + window.location.host + "/"
  : (window.location.host.toString().split(".").length > 2)
    ? appPath = "https://dxcore." + window.location.host.replace(window.location.host.toString().split(".")[0] + ".", "") + "/"
    : Config.apiUrl;
    */
var appPath = Config.apiUrl;
var appToken = Config.token;
var isAuthW = window.location.host.indexOf("localhost") === 0 ? false : Config.isAuthW;

//Auth Requester
export function authRequester(callback) {
  var token = getParameterByName('token');
  if (token && window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
    appToken = token;
    token = undefined;
    isAuthW = false;
  }
  if (token && localStorage.getItem("ssotoken") === null) {
    localStorage.setItem("ssotoken", token);
    authWithTokenRequester(token, callback);
  }
  else if (token && localStorage.getItem("ssotoken") !== null && localStorage.getItem("ssotoken") !== token) {
    localStorage.removeItem("ssotoken");
    localStorage.setItem("ssotoken", token);
    authWithTokenRequester(token, callback);
  }
  else {
    var path = appPath + (isAuthW ? "api/v1/authw" : "api/v1/authc");
    token = isAuthW ? "" : appToken;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        callback();
      }
    };
    xhttp.open(isAuthW ? "GET" : "POST", path, true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "text/plain");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send(token);
  }
}

export function authWithTokenRequester(token, cb) {
  let path = appPath + "api/v1/authc/" + encodeURI(token);
  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      if (cb) {
        cb();
      }
    }
  }
  xhttp.open("GET", path, true);
  //xhttp.setRequestHeader("X-Origin", "http://localhost:3000")
  xhttp.withCredentials = true;
  xhttp.send();
}

// API Requester
export function apiRequester(reqURL, reqOBJ, callback, reqMethod) {
  if (reqURL.indexOf("/search/location") > 0) {
    let personateId = sessionStorage.getItem("personateId");
    personateId && (reqOBJ.info = { PersonateId: personateId });
  } else {
    let personateId = sessionStorage.getItem("personateId");
    if (reqOBJ?.Info?.PersonateId) {
      personateId = reqOBJ.Info.PersonateId;
    }
    reqOBJ.info = {
      CultureCode: localStorage.getItem("lang") === null ? "en-US" : localStorage.getItem("lang"),
    };
    personateId &&
      (reqOBJ.info = {
        PersonateId: personateId,
        CultureCode: localStorage.getItem("lang") === null ? "en-US" : localStorage.getItem("lang"),
      });
  }
  //For Performance Check
  //var t1 = performance.now();
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.open(reqMethod === undefined ? "POST" : reqMethod, appPath + reqURL, true);
  xhttp.withCredentials = true;
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(reqOBJ));
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // if (JSON.parse(this.responseText).status?.code === 30) {
      //   window.location.href = window.location.origin + "/expired";
      // }
      callback(this.responseText ? JSON.parse(this.responseText) : null);
      //var t2 = performance.now();
    }
    // else if (this.readyState === 4 && this.status === 0) {
    //   window.location.href = window.location.origin + "/expired";
    // }
  };
  xhttp.onerror = function () {
    console.log(JSON.stringify({
      status: this.status, statusText: xhttp.statusText
    }));
  };
}

export function apiRequesterAsync(reqURL, reqOBJ, callback, reqMethod) {
  if (reqURL.indexOf("/search/location") > 0) {
    let personateId = sessionStorage.getItem("personateId");
    personateId && (reqOBJ.info = { PersonateId: personateId });
  } else {
    let personateId = sessionStorage.getItem("personateId");
    reqOBJ.info = {
      CultureCode: localStorage.getItem("lang") === null ? "en-US" : localStorage.getItem("lang"),
    };
    personateId &&
      (reqOBJ.info = {
        PersonateId: personateId,
        CultureCode: localStorage.getItem("lang") === null ? "en-US" : localStorage.getItem("lang"),
      });
  }
  //For Performance Check
  //var t1 = performance.now();
  //console.log("API Request Start -", reqURL);
  return new Promise(function (resolve, reject) {

    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open(reqMethod === undefined ? "POST" : reqMethod, appPath + reqURL, true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqOBJ));
    xhttp.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(callback(this.responseText ? JSON.parse(this.responseText) : null));
      } else {
        reject({
          status: this.status,
          statusText: xhttp.statusText
        });
      }
    };
    xhttp.onerror = function () {
      reject({
        status: this.status,
        statusText: xhttp.statusText
      });
    };
  });
}

//Fetch Requester
export function apiFetchRequester(reqURL, reqOBJ) {
  fetch(appPath + reqURL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(reqOBJ),
  })
    .then((res) => res.json())
    .then((response) => console.log(response))
    .catch((error) => console.error("Error:", error));
}

//Authc Service which required Auth Token
//Auth Requester
// export function authRequester(callback) {
//   var path = appPath + "api/v1/authc";
//   var token = appToken;
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//     if (this.readyState === 4 && this.status === 200) {
//       callback();
//     }
//   };
//   xhttp.open("POST", path, true);
//   xhttp.withCredentials = true;
//   xhttp.setRequestHeader("Content-Type", "text/plain");
//   xhttp.setRequestHeader("Accept", "application/json");
//   xhttp.send(token);
// }

function getParameterByName(name, url = window.location.href) {
  if (window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
    return "http://" + window.location.pathname.split('/')[1] + process.env.REACT_APP_B2CPORTALDOMAIN;
  }
  else {
    name = name.replace(/[\[\]]/g, '$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}
