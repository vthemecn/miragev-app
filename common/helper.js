/**
 * 公共函数
 */
import { mainStore } from '@/store/main.js';

/**
 * 跳转函数
 * @param {string} url 要跳转的路径
 * @param {boolean} auth 如果为 true，检查未登录的话，跳转到登录页
 */
export function goto(url, auth=false) {
  const store = mainStore();
  if(auth==true && !store.user.ID){
    console.log('store.user.ID: ', store.user.ID);
    uni.showModal({
    	title: '提示',
    	content: '请登录',
    	success: function (res) {
    		if (res.confirm) {
    			uni.navigateTo({
    			  url:'/pages/auth/login'
    			})
    		} else if (res.cancel) {
    			console.log('用户点击取消');
    		}
    	}
    });
    return;
  }
  uni.getNetworkType({
  	success: function (res) {
  		// console.log("helper goto 网络状态检查: ", res.networkType);
      if(res.networkType == 'none'){
        url:"/pages/network.vue"
      }
      uni.navigateTo({
        url:url
      });
  	},
    fail:function(){
      console.log("失败。。。");
    }
  });
}

export function gotoNav(url) {
  console.log('url: ', url);
  uni.switchTab({
    url:url
  })
}

// 暗黑模式处理函数
export function darkModeInit(){
  // var isDarkMode = uni.getStorageSync('isDarkMode') == '1' ? true : false;
  const store = mainStore();
  var isDarkMode = store.isDarkMode;
  
  // 日间模式颜色
  var navigationBarOption = { frontColor: '#000000', backgroundColor: '#ffffff' };
  var tabBarStyleOption = { color: '#71768c', selectedColor: '#1b65ba', backgroundColor: '#FFFFFF' };
  // plus.nativeUI.setUIStyle('light'); // 系统原生界面如何适配暗黑模式
  
  // 夜间模式颜色
  if(isDarkMode == true){
    navigationBarOption = { frontColor:'#ffffff', backgroundColor: '#000000' };
    tabBarStyleOption = { color: '#7e858f', selectedColor: '#b5c0d5', backgroundColor: '#333333' };
    // plus.nativeUI.setUIStyle('dark');
  }
  
  uni.setNavigationBarColor({
    frontColor: navigationBarOption.frontColor,
    backgroundColor: navigationBarOption.backgroundColor,
    animation: {
      duration: 0,
      timingFunc: 'easeIn'
    },
    success(e){
      // console.log("设置顶部导航背景色成功",e);
    },
    fail(e) {
      // console.log('设置顶部导航失败: ', e.errMsg);
    }
  });

  uni.setTabBarStyle({
    color: tabBarStyleOption.color,
    selectedColor: tabBarStyleOption.selectedColor,
    backgroundColor: tabBarStyleOption.backgroundColor,
    borderStyle: 'black',
    success(e){
      // console.log("设置底部标签页背景色成功",e);
    },
    fail(e) {
      // console.log('设置底部标签页失败: ', e.errMsg);
    }
  });
  
  // 动态设置窗口的背景色 只支持小程序
  // #ifdef MP-WEIXIN
  uni.setBackgroundColor({
    backgroundColor:'#ff0020',
    success(e){
      console.log("设置微信背景色成功",e);
    },
    fail(e) {
      console.log('setBackgroundColor: ', e.errMsg);
    }
  });
  // #endif
}

// 页面权限检查
function pageCheckAuth(){
  const store = mainStore();
  if(!store.user.ID){
    goto('/pages/auth/login')
  }
}

// 通过 localStorage 初始化 pinia
function initStoreFromStorage(){
  try {
    const store = mainStore();
  	const userString = uni.getStorageSync('user');
    // console.log('helper: ',userString);
  	if (userString) {
      store.user = userString instanceof Object ? userString : JSON.parse(userString);
  	}
    // const isDarkMode = uni.getStorageSync('isDarkMode');
    // if (isDarkMode) {
    //   store.isDarkMode = isDarkMode == 1 ? true : false;
    // } 
  } catch (e) {
  	// console.log("没有获取到 localStoarage: ", e);
  }
}

export default {
  goto,
  gotoNav,
  darkModeInit,
  pageCheckAuth,
  initStoreFromStorage
}
