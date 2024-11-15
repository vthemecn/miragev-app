<template>
	<view class="home-container container" :class="{'dark-mode':store.isDarkMode}">
		<!-- 顶部幻灯 -->
    <view class="header">
      <!-- #ifdef APP-PLUS -->
      <view class="status_bar">  
          <view class="top_view" :class="{color:isTopViewColor}"></view>  
      </view>  
      <!-- #endif -->
      
      <view class="swiper-skeleton" v-if="state.slider.list && state.slider.list.length == 0"></view>
      <swiper class="swiper" v-else
        :indicator-dots="state.slider.indicatorDots" 
        :autoplay="state.slider.autoplay" 
        :interval="state.slider.interval" 
        :duration="state.slider.duration">
        <swiper-item v-for="(s,index) in state.slider.list" :key="index">
           <image :src="s.image" mode="aspectFill" class="slider-img"></image>
        </swiper-item>
      </swiper>
    </view><!-- ./ header -->
  
    <!-- one -->
    <view class="my-widget" v-if="Object.keys(state.audio_categories.one).length > 0">
      <view class="widget-header">
        <view class="header-title">
          {{state.audio_categories.one.title}}
        </view>
        <view class="header-more" 
          @click="$helper.gotoNav('/pages/home/category?id=' + state.app_product.category.term_id)">
          <text>更多</text>
          <text class="iconfont">&#xe748;</text>
        </view>  
      </view>
      <view class="widget-body">
        <image-item 
          v-for="(item, index) in state.audio_categories.one.list"
          :key="index"
          :item="item" ></image-item>
      </view>
    </view>
    <!-- <imageItemSkeleton v-else></imageItemSkeleton> -->
    
    <!-- two -->
    <view class="my-widget" v-if="Object.keys(state.audio_categories.two).length > 0">
      <view class="widget-header">
        <view class="header-title">
          {{state.audio_categories.two.title}}
        </view>
        <view class="header-more" 
          @click="$helper.gotoNav('/pages/home/category?id=' + state.app_product.category.term_id)">
          <text>更多</text>
          <text class="iconfont">&#xe748;</text>
        </view>  
      </view>
      <view class="widget-body">
        <image-item 
          v-for="(item, index) in state.audio_categories.two.list"
          :key="index"
          :item="item" ></image-item>
      </view>
    </view>
    <!-- <imageItemSkeleton v-else></imageItemSkeleton> -->

    <!-- three -->
    <view class="my-widget" v-if="Object.keys(state.audio_categories.three).length > 0">
      <view class="widget-header">
        <view class="header-title">
          {{state.audio_categories.three.title}}
        </view>
        <view class="header-more" 
          @click="$helper.gotoNav('/pages/home/category?id=' + state.app_product.category.term_id)">
          <text>更多</text>
          <text class="iconfont">&#xe748;</text>
        </view>  
      </view>
      <view class="widget-body">
        <image-item 
          v-for="(item, index) in state.audio_categories.three.list"
          :key="index"
          :item="item" ></image-item>
      </view>
    </view>
    <!-- <imageItemSkeleton v-else></imageItemSkeleton> -->
	</view>
</template>

<script setup>
  import { reactive, computed } from 'vue';
  import { onShow, onLoad } from '@dcloudio/uni-app';
  import { mainStore } from '@/store/main.js';

  import util from '../../common/util.js';
  import helper from '../../common/helper';
  import httpUtil from '@/common/http-util.js';
  
  // import imageItem from "@/components/home/image-item.vue";
  // import skeleton from "@/components/skeleton/skeleton.vue";
  // import imageItemSkeleton from '@/components/skeleton/image-item-skeleton.vue'

  
  const state = reactive({
    isTopViewColor:false,
    slider:{
      list:[],
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 500,
    },
    audio_categories:{
      one:{},
      two:{},
      three:{}
    }
  });
  
  const store = mainStore();


  onLoad(()=>{
    homeInit();
  });
  
  onShow(()=>{
  });
  
  const isDarkMode = computed(()=>{
    const store = mainStore();
    return store.isDarkMode;
  });
  
  async function homeInit(){
    var res = await httpUtil.request({ url:"/wp-json/rangtuo/v1/home/index", method:"GET" });
    if(res.statusCode != 200){
      let error = res.data.error ? res.data.error : '链接服务器失败';
      uni.showToast({ title: error, icon:'none'});
      return;
    }
    state.slider.list = res.data.sliders;
    
    
    state.audio_categories.one = res.data.audio_categories.one ? res.data.audio_categories.one : {};
    state.audio_categories.two = res.data.audio_categories.two ? res.data.audio_categories.two : {};
    state.audio_categories.three = res.data.audio_categories.three ? res.data.audio_categories.three : {};
    // state.app_product = res.data.app_product;
    // state.app_product.articles = state.app_product.articles.map((item)=>{
    //   item.title = item.post_title;
    //   return item;
    // });
    
    // state.app_news = res.data.app_news;
    // state.app_news.articles = state.app_news.articles.map((item)=>{
    //   item.title = item.post_title;
    //   return item;
    // });
    
    // state.app_cases = res.data.app_cases;
    // state.app_cases.articles = state.app_cases.articles.map((item)=>{
    //   item.title = item.post_title;
    //   return item;
    // });
    
    // state.app_partner = res.data.app_partner;
    // state.app_partner.articles = state.app_partner.articles.map((item)=>{
    //   item.title = item.post_title;
    //   return item;
    // });
  }


</script>

<style lang="scss">
.header {
  position: relative;
  width: 100%;
  // margin-bottom: 90rpx;
  overflow-x: hidden;
}





.my-widget{
  width: 700rpx;
  margin: 40rpx auto 0 auto;
  .widget-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-title{
      font-size: 28rpx;
      font-weight: bold;
      color: var(--rt-text-color);
    }
    .header-more{
      font-size: 25rpx;
      color: var(--rt-text-color);
      .iconfont{
        font-size: 25rpx;
      }
    }
  }
  .widget-body{
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 30rpx;
  }
  .get-more{
    width: 255rpx;
    height: 50rpx;
    line-height: 50rpx;
    margin: 10rpx auto 0 auto;
    border-radius: 50rpx;
    border:1rpx solid #ececec;
    font-size: 22rpx;
    color: #222222;
    text-align: center;
    position: relative;
    .iconfont{
      font-size: 27rpx;
      top: 1rpx;
      left: 10rpx;
      color: #222222;
    }
  }
}
</style>
