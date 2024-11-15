<template>
  <scroll-view class="hot-counter" scroll-y="true">
    <hot-item v-for="(item,index) in state.indexList" :item="item" 
      @tap="$helper.goto('/pages/articles/article?id='+item.id)">
    </hot-item>
  </scroll-view>
</template>

<script setup>
import { onShow, onLoad, onShareAppMessage } from '@dcloudio/uni-app';

import { reactive } from 'vue';
import { mainStore } from '@/store/main.js';

import util from '@/common/util.js';
import config from '@/common/config.js';
import helper from '@/common/helper.js';
import httpUtil from '@/common/http-util.js';

import hotItem from '@/components/hot-item.vue';

const state = reactive({
  indexList:[]
});

onLoad(async (e)=>{
  await load();
});

onShow(()=>{
  // #ifdef MP-WEIXIN
  // 微信分享到朋友圈
  wx.showShareMenu({
     withShareTicket: true,
     menus: ['shareAppMessage', 'shareTimeline']
  });
  // #endif
});

async function load(){
  var hotObject = {id:12, title:'目录'};
  // var params = new URLSearchParams();
  // params.set('categories', hotObject.id);
  // params.set('per_page', 99);
  // params.set('orderby', 'id');
  // params.set('order', 'asc');
  // params.toString()
  let queryString = '';
  queryString += "categories=" + hotObject.id;
  queryString += "&per_page=" + 99;
  queryString += "&orderby=" + 'id';
  queryString += "&order=" + 'asc';
  
  var url = '/wp-json/wp/v2/posts?' + queryString;
  
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
      state.indexList = arr;
    }
  } catch (e) {
    uni.toast({title: "获取推荐列表异常 " + e.message});
  }
}

/**
 * 页面分享
 */
onShareAppMessage(res=>{
  if (res.from === 'button') {// 来自页面内分享按钮
    console.log(res.target)
  }
  return {
    title: '水浒全传 目录',
    path: '/pages/home/book'
  }
});
</script>

<style>
page {
  width: 100%;
  height: 100%;
  /* height: 770rpx; */
  display: flex;
}

.hot-counter{
  display: flex;
  flex-direction: column;
  flex:1 1 0%;
  /* flex: 1; */
  /* background-color: aquamarine; */
  width: 750rpx;
  width:100%;
}
</style>