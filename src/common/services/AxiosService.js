import axios from 'axios';
import {env} from "../configs/EnvironmentConfig";
import Router from "next/router";
import {getData, removeData} from "./StorageService";
import {notification} from "antd";


const axiosServices = axios.create({
  baseURL: env.API_ENDPOINT_URL,
  withCredentials: true
})

// Config
const ENTRY_ROUTE = '/auth/login'
const TOKEN_PAYLOAD_KEY = 'Authorization'
const PUBLIC_REQUEST_KEY = 'public-request'
//

if (typeof window !== 'undefined') {
  axiosServices.interceptors.request.use(async (config) => {
      const access = await getData('ACCESS_TOKEN');
      if (access.token) {
        config.headers[TOKEN_PAYLOAD_KEY] = `Bearer ${access.token}`
      }

      if (!access.token) {
        typeof window !== 'undefined' && Router.replace('/auth/login').then(_ => {
        })
        await removeData("access_token")
        window.location.reload();
      }
      return config
    }, error => {
      // Do something with request error here
      notification.error({
        message: 'Error'
      })
      Promise.reject(error)
    }
  )
}

axiosServices.interceptors.response.use((res) => {
    return {data: res.data, status: res.status};
  },
  err => {
    if (err.message === 'Network Error') {
      localStorage.clear();
      return window.location.replace('/error');
    }
    const {response} = err;
    if (response) {
      const {data} = response;
      const {code, message} = data;
      let notificationParam = {
        message: ''
      }

      if ([403,400].includes(code)&& typeof window !== 'undefined') {
        notificationParam.message = message;
      }
      if (code === 404 && typeof window !== 'undefined') {
        notificationParam.message = message;
      }

      if ([401].includes(code)) {
        notificationParam.message = message;
        typeof window !== 'undefined' && Router.replace('/auth/login').then(_ => {
        })
      }
      notification.error({message: notificationParam.message})
      return Promise.reject(response)
    }
  }
)

export default axiosServices;
