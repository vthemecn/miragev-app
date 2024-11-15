/**
 * apican.js
 */

export default {
	config: {
		baseURL: "",
		header: {},
		dataType: "json",
		responseType: "text"
	},
  /* 微信端 responseType 必须是“”或者“text”  */
  
	interceptors: {
		request: null,
		response: null
	},
  
	async request(options) {
    let _config = Object.assign({}, this.config, options);
    
    // 请求拦截
    if (this.interceptors.request) {
      this.interceptors.request(_config)
    }

    _config.url = _config.baseURL ? _config.baseURL + _config.url : _config.url;
    try{
      var responseData = await uni.request(_config);
    }catch(e){
      console.log("apican 请求异常: ", e);
      throw e;
    }
    
    // 响应拦截
    if (this.interceptors.response) {
    	responseData = this.interceptors.response(responseData)
    }
    
    return responseData;
	}
  
}
