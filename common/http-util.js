/**
 * request 的 config 参考文档：https://uniapp.dcloud.io/api/request/request
 */

import apican from './apican/apican.js';
import config from './config.js';

apican.config.baseURL = process.env.NODE_ENV == 'development' ? config.api.url : config.api.url;
apican.config.withCredentials = false;
apican.config.header['Content-Type'] = 'application/json';
apican.config.header['ACCEPT'] = 'application/json';

apican.interceptors.request= (config) => {
  // console.log("config: ", config);
  apican.config.header['Authorization'] = uni.getStorageSync('token') ? 'Bearer ' + uni.getStorageSync('token') : '';
}

apican.interceptors.response= (response) => {
  // console.log('./common/request.js 响应拦截器 response：', response);
  if (typeof response !== 'object') {
    console.log('服务端异常！')
    return response;
  }

  
  if(response.statusCode == 404){
    uni.showToast({
      title: response.data ? response.data.message : '404',
      duration: 2000,
      icon:'none'
    });
  } else if(response.statusCode == 408){
    // console.log('服务端异常！ 408')
    uni.showToast({
      title: "网络连接超时",
      duration: 2000,
      icon:'none'
    });
  } else if(response.statusCode == 500){
    uni.showToast({
      title: response.data.code ? "服务器内部错误" : response.data.error,
      duration: 2000,
      icon:'none'
    });
  } else if(response.statusCode > 300){
    uni.showToast({
      title: response.data.error ? response.data.error : "服务器内部错误",
      duration: 2000,
      icon:'none'
    });
  }
  
  return response;
}
 
export default apican;
