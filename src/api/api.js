import axios from 'axios';

// Set Api Domain
const baseDomain = 'http://localhost:8088';
const baseURL = `${baseDomain}/api/clips`;

// Bolierplate for all api calls
function apiRequest(method, url, params, timeout, data ) {
  return axios({
    method,
    url: `${baseURL}${url}`,
    params,
    timeout,
    data
  });
}

export function get(url, params={}, timeout=0, data={}){
  return apiRequest('get',url,params,timeout,data);
}
export function post(url, params={}, timeout=0, data={}){
  return apiRequest('get', url, params, timeout,data)
}


