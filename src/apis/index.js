import uri from "./uri";
import axios from "axios";

const prefix = "";

let timer = null;

let reqs = {
  getStore: (isAdmin) => {
    const user = JSON.parse(localStorage.getItem("sekiro-USER") || "{}");
    if (isAdmin) {
      return user;
    }
    const userMock = JSON.parse(localStorage.getItem("sekiro-USER-MOCK") || "{}");
    return userMock.mock ? userMock : user;
  },
  setStore: (user, key) => {
    const userMock = JSON.parse(localStorage.getItem("sekiro-USER-MOCK") || "{}");
    key = key || (userMock.mock ? "sekiro-USER-MOCK" : "sekiro-USER");
    localStorage.setItem(key, JSON.stringify(user));
  }
};


function doRequest(request) {
  let user = reqs.getStore();
  return new Promise((resolve) => {
    let newHeaders = request.headers ? request.headers : {};
    axios({
      ...request,
      headers: {
        ...newHeaders,
        sekiroToken: user.loginToken
      }

    })
      .then((response) => {
        if (response.data.status === -1 && response.data.message.indexOf("请") >= 0
          && response.data.message.indexOf("登录") > 0) {
          localStorage.removeItem("Thanos-USER");
          timer && clearTimeout(timer);
          timer = setTimeout(() => {
            window.location.href = "/#/sign-in";
          }, 100);
          return;
        }
        resolve(response.data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status !== 200 && request.url.indexOf("yint-stub") > 0) {
            // 因体插桩代码，在源码售卖场景下接口正常会404，此时把状态打入下层业务
            resolve(error.response);
            return;
          }
          resolve(error.response?.data);
        }
      });
  });
}

function doGet(uri, params = "", route = false) {
  if (route) {
    uri += params ? ("/" + params) : "";
  } else {
    // 组装参数
    let p = [];
    for (let i of Object.keys({ ...params })) {
      if (params[i] == null) {
        continue;
      }
      let key = encodeURIComponent(i);
      let value = encodeURIComponent(params[i]);
      p.push(`${key}=${value}`);
    }
    if (p.length > 0) {
      uri += "?" + p.join("&");
    }
  }
  return doRequest({
    method: "get",
    url: prefix + uri
  });
}

function doPost(uri, data, query) {
  let postForm = function() {
    let p = [];
    for (let i of Object.keys({ ...data })) {
      if (data[i] != null) {
        let key = encodeURIComponent(i);
        let value = encodeURIComponent(data[i]);
        p.push(`${key}=${value}`);
      }
    }
    return p;
  };

  return doRequest({
    method: "post",
    url: prefix + uri,
    data: query ? postForm().join("&") : data
  });
}

function doForm(uri, data) {
  let form = new FormData();
  for (let i of Object.keys({ ...data })) {
    if (data[i] != null) {
      form.append(i, data[i]);
    }
  }
  return doRequest({
    method: "post",
    url: prefix + uri,
    data: form
  });
}

for (let i of Object.keys(uri)) {
  const [url, method, query] = uri[i].split(" ");
  if (method === "post") {
    reqs[i] = (body) => doPost(url, body, query);
  } else if (method === "form") {
    reqs[i] = (body) => doForm(url, body);
  } else {
    reqs[i] = (params) => doGet(url, params, query);
  }
}

export default reqs;
