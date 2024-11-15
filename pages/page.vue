<template>
  <view class="container">
    <!-- 获取数据前加载状态 -->
    <uni-load-more status="loading" iconType="circle" v-if="isLoading"></uni-load-more>
    
    <view class="page-container" v-if="!isLoading && !errorMessage">
      <view class="page-title">
        {{page.title}}
      </view>
      <view class="page-content">
        <!-- {{page_content}} -->
        <!-- v-html="page.content" -->
        <rich-text :nodes="page.content"></rich-text>
      </view>
    </view>
    
    <view class="page-error-info" v-if="errorMessage">
      {{errorMessage}}
    </view>
  </view>
</template>

<script>
  import { mapState } from 'pinia';
  import { mainStore } from '@/store/main.js';
  
  import util from '@/common/util.js';
  import htmlParser from '@/common/html-parser';
  import helper from '@/common/helper';
  import config from "@/common/config.js"
  
  export default {
    data() {
      return {
        isLoading:true,
        errorMessage:'',
        page:{
          title:"",
          content:"",
        }
      };
    },
    computed: {
      ...mapState(mainStore, ['isDarkMode'])
    },
    onShow() {
    },
    onLoad(e){
      var that = this;
      (async function(){
        if(!e.id){
          uni.showToast({ title:'参数缺失', icon:'none'});
          return;
        }
        try{
          var res = await uni.request({
            url:config.api.url + '/wp-json/wp/v2/pages/' + e.id,
            method:'get'
          });
          if(res.statusCode == 200){
            that.page.title = res.data.title.rendered;
            
            res.data.content.rendered = util.formatRichText(res.data.content.rendered);
            res.data.new_content = htmlParser(res.data.content.rendered);
            that.page.content = res.data.new_content;
            
            that.page.created_at = util.friendlyTime( Math.floor( Date.parse(res.data.date)/1000) );
            
            that.isLoading = false;
            
            uni.setNavigationBarTitle({
              title: that.page.title
            });
          } else if(res.statusCode == 404){
            that.isLoading = false;
            that.errorMessage = res.data.error ? res.data.error : "没有找到页面";
          }else{
            that.isLoading = false;
            that.errorMessage = res.data.error ? res.data.error : "发生错误";
          }
        }catch(e){
          uni.showToast({ title:'错误：'+e.message, icon:'none'});
        }
      })();
    }
  }
</script>

<style lang="scss">
.page-container{
  margin: 0rpx auto;
  padding: 10px 0;
  width: 700rpx;
}

.page-container .page-title{
  font-size: 35rpx;
  color: var(--rt-text-color);
}
.page-container .page-content{
  margin-top: 60rpx;
  overflow: hidden;
  padding-bottom: 50rpx;
  font-size: 30rpx;
  color: var(--rt-text-color);
  line-height: 55rpx;
}

.page-error-info{
  margin: 50rpx auto;
  text-align: center;
  font-size: var(--rt-font-size-base);
  color:var(--rt-text-color-grey);
}
</style>
