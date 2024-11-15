<template>
  <view class="container">
    <uni-load-more status="loading" iconType="circle" v-if="isLoading"></uni-load-more>
    
    <view class="article-container" v-if="article">
      <view class="article-title">
        {{article.title}}
      </view>
      <view class="article-meta">
        <view class="meta-widget">
          <text class="iconfont">&#xe76d;</text>{{article.created_at}}
        </view>
      </view>
      <view class="article-content">
        <!-- {{page_content}} -->
        <!-- v-html="article.content" -->
        <rich-text :nodes="article.content"></rich-text>
      </view>
    </view>
    
    <view class="article-error-info" v-if="errorMessage">
      {{errorMessage}}
    </view>

  </view>
</template>

<script>
  
  import { onShow, onShareAppMessage } from "@dcloudio/uni-app";
  
  import htmlParser from '@/common/html-parser';
  import helper from '@/common/helper';
  import util from '@/common/util.js';
  import httpUtil from '@/common/http-util.js';
  
  export default {
    data() {
      return {
        isLoading:true,
        article:null,
        errorMessage:''
      };
    },
    onShow() {
      // #ifdef MP-WEIXIN
      // 微信分享到朋友圈
      wx.showShareMenu({
         withShareTicket: true,
         menus: ['shareAppMessage', 'shareTimeline']
      });
      // #endif
    },
    onLoad(e){
      var that = this;
      var id = e.id;
      (async function(){
        var url = '/wp-json/wp/v2/posts/' + id;
        var res = await httpUtil.request({url, method:"GET"});
        if(res ? res.statusCode == 200 : false){
          that.article = {};
          that.article.id = res.data.id;
          that.article.title = res.data.title.rendered;
          
          res.data.content.rendered = util.formatRichText(res.data.content.rendered);
          res.data.new_content = htmlParser(res.data.content.rendered);
          that.article.content = res.data.new_content;
          
          that.article.created_at = util.friendlyTime( Math.floor( Date.parse(res.data.date)/1000) );
          
          that.isLoading = false;
          
          uni.setNavigationBarTitle({
            title: that.article.title
          });
        }else{
          that.isLoading = false;
          that.errorMessage = res.data ? res.data.message : "发生错误";
        }

      })();
    },
    /**
     * 页面分享
     */
    onShareAppMessage(res) {
      if (res.from === 'button') {// 来自页面内分享按钮
        console.log(res.target)
      }
      return {
        title: this.article.title,
        path: '/pages/articles/article?id='+this.article.id
      }
    }
  }
</script>

<style lang="scss">
.article-container{
  margin: 0rpx auto;
  padding: 10px 0;
  width: 700rpx;
}

.article-container .article-title{
  font-size: var(--rt-font-size-lg);
  color: var(--rt-text-color);
}
.article-container .article-meta{
  margin-top: 40rpx;
  display: flex;
  color: var(--rt-text-color-grey);
  font-size: var(--rt-font-size-sm);
}
.article-container .article-meta .meta-widget{
  display: flex;
  align-items: center;
}
.article-container .article-meta .meta-widget .iconfont{
  transform: scale(1.3);
  margin-right: 6rpx;
}
.article-container .article-content{
  margin-top: 60rpx;
  overflow: hidden;
  padding-bottom: 50rpx;
  font-size: var(--rt-font-size-base);
  color: var(--rt-text-color);
  line-height: 55rpx;
}

.article-error-info{
  margin: 50rpx auto;
  text-align: center;
  font-size: 15rpx;
}
</style>
