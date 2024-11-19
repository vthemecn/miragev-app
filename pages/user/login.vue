<template>
  <view class="page-container">
    <view class="login-title">
      <text>登录/注册</text>
      <view class="idesc default-light-color">
        未注册手机验证后自动登录
      </view>
    </view>
    
    <!-- @click="$helper.goto('/pages/about/about')" -->
    <view class="login-option-panel">
      <button
        type="default"
        class="login-option-button wechat" 
        open-type="getUserInfo"
        widthCredentials="true" 
        @getuserinfo="wxGetUserInfo()">
        <text class="iconfont">&#xe903;</text>
        <text>微信账号快速登录</text>
      </button>
      <!--<button type="default" class="login-option-button normal" @click="$helper.goto('/pages/auth/login')">
        <text class="iconfont">&#xe79e;</text>
        <text>手机号注册/登录</text>
      </button> -->
    </view>
    
    <view class="login-licence">
      <text>点击按钮表示您统一并愿意遵守</text>
      <view class="login-licence-detail">
        <text class="default-light-color" @click="$helper.goto('/pages/page?id='+state.appUsingId)">《使用协议》</text>
        <text>和</text>
        <text class="default-light-color" @click="$helper.goto('/pages/page?id='+state.appPrivacyId)">《隐私协议》</text>
      </view>
    </view>

    
  </view>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';

import config from "@/common/config.js";
import util from "../../common/util.js";  
import validators from "../../common/validators.js";
import httpUtil from '@/common/http-util.js';
  
import { mainStore } from '@/store/main.js';
 
const state = reactive({
  "appUsingId":"",
  "appPrivacyId":"",
});
const store = mainStore();

onShow(async ()=>{
  try{
    let url = '/wp-json/vtheme/v1/index';
    let res = await httpUtil.request({ url, method:'get' });
    state.appUsingId = res.data.app_using_id;
    state.appPrivacyId = res.data.app_privacy_id;
  }catch(e){
    uni.showToast({title: "异常 " + e.message});
  }
})

function wxGetUserInfo(){
  console.log("微信登录。。。");
  uni.login({
    provider: 'weixin',
    success: function (res) {
      state.msg = res.code;
      if (res.code) {
        //发起网络请求
        uni.request({
          method: 'POST',
          url: config.api.url + '/wp-json/vtheme/v1/wxapp-login',
          data: { code: res.code },
          success(res) {
            console.log("请求成功： ", res.data);
            if( res.data.errcode ){
              uni.showToast({
                title: "小程序设置错误：" + res.data.errmsg,
                icon:'none'
              });
              return;
            }
            state.msg = res.data;
            
            const store = mainStore();
            store.user = res.data.user;
            
            try {
              uni.setStorageSync('token', res.data.token);
              uni.setStorageSync('user', JSON.stringify(res.data.user));
            } catch (e) {
              uni.showToast({ title:"存储 jwt token 错误", icon:'none'});
            }
            uni.switchTab({ url:'/pages/user/index' });
          }
        });
      } else {
        uni.showToast({ title:'登录失败！' + res.errMsg, icon:'none'});
      }
    },
    fail(e) {
      uni.showToast({ title:'登录失败！' + res.errMsg, icon:'none'});
    },
    complete(e) {
      console.log('完成：', e);
    }
  });
};
  

</script>

<style lang="scss">
  page{
    background-color: #f8f8f8;
  }
  .page-container{
    overflow: hidden;
    padding: 0rpx 38rpx;
    font-size: 30rpx;
    .login-title{
      font-size: 50rpx;
      margin-top:80rpx;
      .idesc{
        font-size: 30rpx;
        margin-top:20rpx;
      }
    }
    .login-licence{
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      margin-top: 60rpx;
      .login-licence-detail{
        margin-top: 20rpx;
      }
    }
  }


.login-option-panel{
  padding: 10rpx 0rpx;
  margin-top: 150rpx;
  .login-option-button{
    width: 450rpx;
    height: 70rpx;
    line-height: 70rpx;
    border-radius: 30rpx;
    margin-bottom: 25rpx;
    font-size: 25rpx;
    color: #fff;
    &::after{
      border: none;
    }
    &.wechat{
      background-color: #00a300;
    }
    &.normal{
      background-color: #00ccff;
    }
    text.iconfont{
      position: relative;
      display:inline-block;
      transform: scale(135%);
      top: 3rpx;
      right: 5rpx;
    }
  }
}
</style>
