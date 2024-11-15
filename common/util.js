import config from "@/common/config.js"

// 友好时间类型转换
function friendlyDate(timestamp) {
	var formats = {
		'year': '%n% 年前',
		'month': '%n% 月前',
		'day': '%n% 天前',
		'hour': '%n% 小时前',
		'minute': '%n% 分钟前',
		'second': '%n% 秒前',
	};

	var now = Date.now();
	var seconds = Math.floor((now - timestamp) / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	var months = Math.floor(days / 30);
	var years = Math.floor(months / 12);

	var diffType = '';
	var diffValue = 0;
	if (years > 0) {
		diffType = 'year';
		diffValue = years;
	} else {
		if (months > 0) {
			diffType = 'month';
			diffValue = months;
		} else {
			if (days > 0) {
				diffType = 'day';
				diffValue = days;
			} else {
				if (hours > 0) {
					diffType = 'hour';
					diffValue = hours;
				} else {
					if (minutes > 0) {
						diffType = 'minute';
						diffValue = minutes;
					} else {
						diffType = 'second';
						diffValue = seconds === 0 ? (seconds = 1) : seconds;
					}
				}
			}
		}
	}
	return formats[diffType].replace('%n%', diffValue);
}



function setLocalStorage(key, val){
	uni.setStorageSync(key,val);
	return;
}

function getLocalStorage(key){
	return uni.getStorageSync(key);
}

/**
 * 加密手机号码中间的数字
 * @param {stirng} mobile 手机号码
 */
function getFilterMobile(mobile){
	if(mobile == ""){
		return "***********";
	}
	let mobileString = mobile.substring(0,3);
	mobileString += "*****";
	mobileString += mobile.slice(8,11);
	return mobileString;
}

/**
 * object转化成url拼接样式
 * @param obj 需要转化的参数
 */
function objToUrl(obj) {
	let arr = [];
	for (let i in obj) {
		if (obj.hasOwnProperty(i)) {
			arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
		}
	}
	return arr.join("&");
}

/**
 * url转化成object拼接样式
 * @param url 需要转化的参数
 */
function urlToObj(url){
	let string = url.split('&');
	let res = {};
	for (let i = 0; i < string.length; i++) {
		let str = string[i].split('=');
		if (str[0] != '') {
			res[str[0]] = str[1];
		}
	}
	return res;
}

// 获取图片地址
function getImageUrl(url){
	if(url.substr(0,4) == "http" ){
    return url;
  }
  if(url.length > 20){
		return config.RES_URL+ '/uploads/images/' + url;
	}
	return "/static/images/no-pic.jpg";
}

// 将数字转换成金额显示
function toMoney(num){
	if(num == ''){
		num = 0;
	}
	num = parseFloat(num)
	num = num.toFixed(2);
	num = num.toLocaleString();
	return num;//返回的是字符串23,245.12保留2位小数
}


//时间戳转换 201906082350
function friendlyTime(stamp){
  var date = new Date(stamp*1000);//如果date为10位不需要乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes());
  // var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y+M+D+h+m;
}

//时间戳转换 201906082350
function dataTimeFormat(stamp) {
  var date = new Date(stamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes();
  // var s = date.getSeconds();
  return M + D + h + m
}


/**
*
* @param fn {Function}   实际要执行的函数
* @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
*
* @return {Function}     返回一个“去弹跳”了的函数
*/
function debounce(fn, delay, context) {
  var timer
  return function () {
    // var context = this;
    var args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

function throttle(method, context) {
  clearTimeout(method.tId);
  method.tId = setTimeout(function(){
    method.call(context);
  },1000);
}


/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.img标签添加style属性：max-width:100%;height:auto
 * 3.修改所有style里的width属性为max-width:100%
 * 4.去掉<br/>标签
 * @param html
 * @returns {void|string|*}
 */
function formatRichText(html) { //控制小程序中图片大小
  let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
    match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
    match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
    match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
    return match;
  });
  newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
    match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
    return match;
  });
  newContent = newContent.replace(/<br[^>]*\/>/gi, '');
  newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"');
  
  newContent = newContent.replace("↵",'');
  newContent = newContent.replace(/figure/g,'div');
  newContent = newContent.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p');
  newContent = newContent.replace(/<p>/ig, '<p style="margin-bottom:30px">');
  return newContent;
}


/**
 * 删除所有 HTML 标签
 * @param {Object} str
 */
function delHtml(str){
  if(!str){
    return "";
  }
  return str.replace(/<[^>]+>/g,"");  //正则去掉所有的html标记
}


/**
 * 删除字符换中的 HTML 标签
 * @param {string} str HTML 字符串
 * @returns 
 */
function delHtmlTag(str) {
  if (typeof str != 'string') { return ''; }
  str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
  str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
  str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
  str = str.replace(/&nbsp;/ig, ' ');//去掉&nbsp;
  str = str.replace(/&gt;/ig, ' '); //去掉 >
  str = str.replace(/&lt;/ig, ' '); //去掉 <
  return str.replace(/<[^>]+>/g, "");
}

/**
 * HTML 编码：特殊字符转换成 html 实体
 * 参考《白帽子讲 Web 安全》 3.3.3，为了对抗 XXS，至少转换一下字符。
 * @param {string} str 
 * @returns string
 */
function htmlEncode(str) {
  str = "" + str;

  str = str.replace(/&/g, "&amp;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#x27;"); //&apos;不推荐
  str = str.replace(/\//g, "&#x2F;"); //反斜线可能会闭合一些HTML entity

  return str;
}

// HTML 解码：html 实体转特殊字符
function htmlDecode(str) {
  str = "" + str;

  str = str.replace(/&amp;/g, "&");
  str = str.replace(/&lt;/g, "<");
  str = str.replace(/&gt;/g, ">");
  str = str.replace(/&quot;/g, '"');
  str = str.replace(/&apos;/g, "'");
  str = str.replace(/&#x27;/g, "'");
  str = str.replace(/&#x2F;/g, "/");

  return str;
}

export default {
  friendlyDate,
  setLocalStorage,
  getLocalStorage,
  getFilterMobile,
  objToUrl,
  urlToObj,
  getImageUrl,
  toMoney,
  friendlyTime,
  dataTimeFormat,
  debounce,
  throttle,
  formatRichText,
  delHtml,
  delHtmlTag,
  htmlEncode,
  htmlDecode
};
