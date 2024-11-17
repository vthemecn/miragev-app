<template>
	<view class="tabs">
    <view class="status_bar">
      <view class="top_view"></view>
      <!--  #ifdef  MP-WEIXIN -->
        <view class="top_view"></view> 
      <!--  #endif -->
    </view>
    
		<view class="tab-button-widget">
		  <view class="btn-c" :class="{ active: state.tabIndex==0 }" @click="changeIndex('0')">最新</view>
		  <view class="btn-c" :class="{ active: state.tabIndex==1 }" @click="changeIndex('1')">推荐</view>
		</view>
    
    <swiper :current="state.tabIndex" class="swiper-box" style="flex: 1;" :duration="300" @change="onTabChange">
      <swiper-item class="swiper-item">
        <scroll-view class="scroll-v list" 
          enableBackToTop="true" 
          scroll-y
          @scrolltolower="loadMore(index1)">
          <article-item
            v-for="(article,index) in state.articleList"
            :key="article.id"
            :item="article" 
            @tap="$helper.goto('/pages/articles/article?id='+article.id)">
          </article-item>
          <view class="loading-status">
            <uni-load-more status="loading" iconType="circle" v-if="state.isLoading"></uni-load-more>
            <view class="no-more" v-if="state.noMore == true">已经到底了</view>
          </view>
        </scroll-view>
      </swiper-item>
      <swiper-item class="swiper-item">
        <view class="hot-counter">
          <hot-item v-for="(item,index) in state.hotList" :item="item" 
            @tap="$helper.goto('/pages/articles/article?id='+item.id)">
          </hot-item>
        </view>
      </swiper-item>
    </swiper>
	</view>
</template>

<script setup>
import {
  onLoad,
  onShow,
  onPullDownRefresh,
  onReachBottom,
} from '@dcloudio/uni-app';

import { reactive } from 'vue';
import { mainStore } from '@/store/main.js';

import util from '@/common/util.js';
import config from '@/common/config.js';
import helper from '@/common/helper.js';
import httpUtil from '@/common/http-util.js';
 
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
import articleItem from '@/components/article-item.vue';
import hotItem from '@/components/hot-item.vue';
  
const state = reactive({
    tabIndex: 0,
    articleList:[],
    categories:[],
    perPage:6,
    pageNo:1,
    isLoading:false,
    noMore:false,
    hotList:[]
  });
  
function changeIndex(index){
  state.tabIndex = index;
}

onLoad(async (e)=>{
  if(e.id){
    state.categories.push(...e.id.split(','));
  }
  await load();
  await loadHot();
});
  
onShow(async ()=>{});

async function loadHot(){
  var hotObject = {id:9, title:'hot'};
  var url = '/wp-json/wp/v2/posts?tags=' + hotObject.id;
  
  try{
    var res = await httpUtil.request({ url, method:'get' });
    if(res.statusCode == 200){
      console.log('res ', res);
      var orderCounter = 1;
      let arr = res.data.map(item => {
        let temp = {};
        temp.order_id = orderCounter++;
        temp.id = item.id;
        temp.title = item.title.rendered;
        return temp;
      });
      state.hotList = arr;
    }
  } catch (e) {
    uni.toast({title: "获取推荐列表异常 " + e.message});
  }
}
  
// onPullDownRefresh(()=>{});

// onReachBottom(async ()=>{
//   load();
// });
async function refresh (){
  state.articleList = [];
  state.pageNo = 1;
  state.noMore = false;
  load();
  
  uni.stopPullDownRefresh({
    success(){
      console.log("onPullDownRefresh");
    },
    fail(e){
      console.log('下拉刷新失败: ', e);
    }
  });
}

async function load(){
  if(state.noMore) return;
  state.isLoading = true;
  
  var url = '/wp-json/wp/v2/posts?page=' + state.pageNo +'&per_page=' + state.perPage;
  if(state.categories.length){ url = url + "&categories=" + state.categories.toString(); }
  url += "&_embed";
  
  try{
    var res = await httpUtil.request({ url, method:'get' });
    console.log(res);
    if(res.statusCode == 200){
      let arr = res.data.map((item, index)=>{
        let temp = {};
        temp.id = item.id;
        temp.title = item.title.rendered;
        temp.description = util.delHtmlTag(item.excerpt.rendered);
        temp.created_at = util.friendlyTime(new Date(item.date).getTime() / 1000);
        temp.hit_counter = item.meta.hit_counter ? item.meta.hit_counter : 0;
        temp.like_counter = item.meta.like_counter ? item.meta.like_counter : 0;
        temp.commet_counter = item.meta.commet_counter ? item.meta.commet_counter : 0;
        temp.user = item.user;
        temp.user.avatar = temp.user.avatar ? temp.user.avatar : '/static/images/avatar.jpg';
        
        if(item._embedded['wp:featuredmedia']){
          console.log("item._embedded['wp:featuredmedia']", item._embedded['wp:featuredmedia'][0]); 
          temp.thumbnail = item._embedded['wp:featuredmedia'][0].source_url;
        } else {
          temp.thumbnail = '/static/images/default.jpg';
        }

        return temp;
      });

      state.articleList.push(...arr);
      let totalPage = res.header['x-wp-totalpages'] ? res.header['x-wp-totalpages'] : res.header['X-WP-TotalPages'];
      if(totalPage > state.pageNo){
        state.pageNo++;
      } else {
        state.noMore = true;
      }
      
      state.isLoading = false;
    }
  }catch(e){
    console.log('error: ', e);
    return [];
  }
}


function loadMore(){
  console.log('loadMore....', 'state.isLoading', state.isLoading, state.noMore);
  if(state.isLoading) return;
  load();
}


function onTabChange(e){
  state.tabIndex = e.detail.current;
}

async function refreshList(){
  // (async ()=>{
  //   state.triggered = true;
  //   load();
  //   state.triggered = false;
  // })();
  state.articleList = [];
  state.pageNo = 1;
  state.noMore = false;
  load();
  
  state.triggered = true;
}

</script>

<style>
page {
  width: 100%;
  min-height: 100%;
  display: flex;
}

.tabs {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.tab-button-widget {
  width: 750rpx;
  height: 100rpx;
  display: flex;
  align-items:flex-end;
  justify-content: flex-start;
  flex-direction: row;
  background-color:var(--rt-bg-color-card);
  /* position: absolute; */
  padding-top: var(--status-bar-height);
  padding-bottom: 15rpx;
  box-sizing: border-box;
/*  top: 0;
  left: 0; */
  z-index: 1;
}

.tab-button-widget .btn-c{
  display: inline-block;
  padding: 5rpx 0;
  margin: 20rpx 30rpx 0 15rpx;
  position: relative;
  font-size: var(--rt-font-size-sm);
}
.tab-button-widget .btn-c.active{ 
  font-size: var(--rt-font-size-base);
}
.tab-button-widget .btn-c.active::after{
  content: "";
  display: block;
  width: 100%;
  height: 8rpx;
  border-radius: 4rpx;
  background-color: var(--rt-color-primary);
  position: absolute;
  bottom: -2rpx;
}
.swiper-box {
  flex: 1;
  /* padding-top: 100rpx; */
}
.swiper-item {
  display: flex;
  flex: 1;
  flex-direction: row;
}
.scroll-v {
  display: flex;
  flex: 1;
  /* #ifndef MP-ALIPAY */
  flex-direction: column;
  /* #endif */
  width: 750rpx;
  width:100%;
}
.scroll-v.list .article-item{
  margin: 15rpx 15rpx;
}
.loading-status{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 110rpx;
  padding-bottom: 20rpx;
  font-size: var(--rt-font-size-sm);
  color: var(--rt-text-color-grey);
}
.hot-counter{
  padding: 15rpx 15rpx;
}
</style>