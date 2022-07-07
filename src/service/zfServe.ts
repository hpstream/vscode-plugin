import axios from "axios";
import {authentication, window} from "vscode";
// const baseURL = "http://daily.zhufengpeixun.com";
// const baseURL = "http://dailytest.zhufengpeixun.com";
const baseURL = "http://127.0.0.1:7001/";

export const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use((value) => {
  console.log("请求参数", value);
  return value;
});

instance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.data ? response.data : {};
    }
    console.log(response.status);
    return {};
  },
  (err) => {
    console.log("报错", err);
    window.showErrorMessage(err);
  }
);
