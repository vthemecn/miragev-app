<template>
	<view class="container" :class="{'dark-mode':store.isDarkMode}">
		<view class="header">
      <!-- 未登录 -->
			<view class="user-info"
        v-if="store.user && !store.user.ID"
        @click="$helper.goto('/pages/user/login')">
				<view class="avatar-container">
					<image src="../../static/images/avatar.jpg" mode="aspectFill"></image>
				</view>
				<view class="avatar-text">请登录</view>
			</view>
      <!-- 已经登录 -->
			<view class="user-info" v-if="store.user && store.user.ID">
				<view class="avatar-container" v-if="store.user.avatar" >
					<image :src="store.user.avatar" mode="aspectFill"></image>
				</view>
        <view class="avatar-container" v-if="!store.user.avatar">
        	<image src="../../static/images/avatar.jpg" mode="aspectFill"></image>
        </view>
				<view class="avatar-text">{{store.user.nickname}}</view>
			</view>
		</view>
    
    <!--
    <view class="option-widget">
      <view class="option-item" @click="safeOption()">
        <view class="left">
          <image src="../../static/images/fav.png" mode=""></image>
          <text>个人资料</text>
        </view>
        <view class="right">
          <text class="iconfont">&#xe748;</text>
        </view>
      </view>
      <view class="option-item" @click="safeOption()">
        <view class="left">
          <image src="../../static/images/fav.png" mode=""></image>
          <text>账号与安全</text>
        </view>
        <view class="right">
          <text class="iconfont">&#xe748;</text>
        </view>
      </view>
      <view class="option-item" @click="safeOption()">
        <view class="left">
          <image src="../../static/images/fav.png" mode=""></image>
          <text>设置</text>
        </view>
        <view class="right">
          <text class="iconfont">&#xe748;</text>
        </view>
      </view>
    </view>
    -->
    
    <view class="option-widget">
      <view class="option-item" @click="clearCache()">
        <view class="left">
          <image src="../../static/images/fav.png" mode=""></image>
          <text>清理缓存</text>
        </view>
        <view class="right">
          <view class="right-text">{{state.cache}}</view>
          <text class="iconfont">&#xe748;</text>
        </view>
      </view>
      <view class="option-item" @click="$helper.goto('/pages/page?id=7')">
        <view class="left">
          <image src="../../static/images/fav.png" mode=""></image>
          <text>关于</text>
        </view>
        <view class="right">
          <text class="iconfont">&#xe748;</text>
        </view>
      </view>
    </view>
	
	</view>
</template>

<script setup>
  import { reactive, computed } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { mainStore } from '@/store/main.js';
  
  import util from '../../common/util';
  import helper from '../../common/helper';
  import config from '../../common/config';
  
  const store = mainStore();
  const state = reactive({
    cache:'520kb'
  });
  
  onShow(()=>{
  });
  
  // 清理缓存
  function clearCache(){
    state.cache = '';
    uni.showToast({ title:'成功清除缓存', icon:'none' });
  }
  
  // 账号与安全
  function safeOption(){
    uni.showToast({
      title:'开发中...',
      icon:'none'
    });
  }
  

</script>

<style lang="scss">
.header {
	overflow: hidden;
	.user-info{
		width: 100%;
		height: 200rpx;
		display: flex;
		flex-direction:column;
		justify-content: center;
		align-items: center;
    // margin-top: 20rpx;
    padding: 70px 0px 10px 0px;
		.avatar-container{
			width: 150rpx;
			height: 150rpx;
			z-index: 9;
			image{
				width: 150rpx;
				height: 150rpx;
        border-radius: 50%;
        overflow: hidden;
        // border: 1rpx solid var(--rt-border-color);
        box-shadow: 0 0 3rpx 0rpx var(--rt-shadow-color);
				z-index: 9;
			}
		}
		.avatar-text{
			margin-top:18rpx;
			font-size: 26rpx;
			color: var(--rt-text-color);
		}
	}
}


// 页面第一个view如果不带有这个带有高度的div ，会出现滚动条
// 2022.02.05
.option-blank{
  width: 650rpx;
  height: 1rpx;
  margin: 0rpx auto 0px auto;
}

.option-widget{
  width: 650rpx;
  margin: 30rpx auto;
  border-radius: var(--rt-border-radius);
  box-shadow: 0 0 5rpx var(--rt-shadow-color);
  background-color: var(--rt-bg-color-card);
  min-height: 100rpx;
  .option-item{
    width: 100%;
    height: 100rpx;
    display: flex;
    justify-content: space-between;
    position: relative;
    font-size: var(--rt-font-size-base);
    color: var(--rt-text-color);
    &::after{
      content: "";
      width: 630rpx;
      height: 0rpx;
      border-bottom: 1rpx solid var(--rt-border-color);
      position: absolute;
      right: 0rpx;
      bottom: 0rpx;
    }
    &:last-child{
      &::after{
        display: none;
      }
    }
    .left{
      height: 100rpx;
      display: flex;
      align-items: center;
      image{
        width: 50rpx;
        height: 50rpx;
        margin-left: 20rpx;
        // display: none;
      }
      text{
        margin-left: 20rpx;
      }
    }
    .right{
      height: 100rpx;
      display: flex;
      align-items: center;
      .iconfont{
        font-size: 40rpx;
      }
      .switch{
        transform:scale(0.7);
      }
    }
    
  }  
}


</style>
