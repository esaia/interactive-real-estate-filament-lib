import axios from "axios";

const ajaxAxios = axios.create({
  baseURL: irePlugin.ajax_url,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-CSRF-TOKEN": irePlugin.nonce,
  },
  withCredentials: true
});

export default ajaxAxios;
