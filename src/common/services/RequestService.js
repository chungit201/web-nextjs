import axiosServices from "./AxiosService";
import Utils from "../utils";


const sendRequest = (url, method, data, config = {}) => {
  return new Promise(async (resolve, reject) => {
    const URL = method.toUpperCase() === 'GET' ? url + Utils.getParams(data) : url;
    const DATA = method.toUpperCase() === 'GET' ? {} : data;
    axiosServices({
      url: URL,
      method: method.toUpperCase(),
      data: DATA,
      headers: config
    }).then(res => resolve(res)).catch(err => reject(err));
  })
}

export default sendRequest;