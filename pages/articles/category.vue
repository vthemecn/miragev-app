<template>
  <view class="container" :class="{'dark-mode':store.isDarkMode}">
    <view class="list-container">
      <view v-for="(article,index) in state.articleList" :key="article.id">
        <article-item :item="article"  @tap="$helper.goto('/pages/articles/article?id='+article.id)"></article-item>
      </view>
      
      <view class="loading-status">
        <uni-load-more status="loading" iconType="circle" v-if="state.isLoading"></uni-load-more>
        <view class="no-more" v-if="state.noMore == true">已经到底了</view>
      </view>
    </view>
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
  
  const state = reactive({
    articleList:[],
    categories:[],
    perPage:4,
    pageNo:1,
    isLoading:false,
    noMore:false
  });
  const store = mainStore();

  onLoad(async (e)=>{
    if(e.id){
      state.categories.push(...e.id.split(','));
    }
    load();
  });
  
  onShow(async ()=>{ });
  
  onPullDownRefresh(async ()=>{
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
  });
 
  onReachBottom(async ()=>{
    load();
  });
  
  async function load(){
    if(state.noMore) return;
    state.isLoading = true;
    
    var url = '/wp-json/wp/v2/posts?page=' + state.pageNo +'&per_page=' + state.perPage;
    if(state.categories.length){ url = url + "&categories=" + state.categories.toString(); }
    url += "&_embed";
    
    try{
      var res = await httpUtil.request({ url, method:'get' });
      if(res.statusCode == 200){
        let arr = res.data.map((item, index)=>{
          let temp = {};
          temp.id = item.id;
          temp.title = item.title.rendered;
          temp.description = util.delHtmlTag(item.excerpt.rendered);
          temp.created_at = util.friendlyTime(new Date(item.date).getTime() / 1000);
          temp.hit_counter = '';
          temp.user = item.user;
          temp.user.avatar = temp.user.avatar ? temp.user.avatar : '/static/images/avatar.jpg';
          temp.thumbnail = item._embedded['wp:featuredmedia']
                            ? item._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url 
                            : '';
          return temp;
        });
        
        state.articleList.push(...arr);
        if(res.header['x-wp-totalpages'] > state.pageNo){
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
  

</script>

<style lang="scss">
.list-container{
  width:720rpx;
  margin: 0px auto;
  .loading-status{
    height: 100rpx;
    width: 100%;
    // display: flex;
    // justify-content: center;
    .no-more{
      font-size: 28rpx;
      text-align: center;
      height: 100rpx;
      line-height: 100rpx;
      color: rgb(119, 119, 119);
    }
  }
}
</style>
