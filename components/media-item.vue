<template>
  <view class="media-item">
    <view class="media-left">
      <image v-if="item.thumbnail" :src="item.thumbnail" mode="aspectFill"></image>
      <image v-else src="../../static/images/default.jpg" mode="aspectFill"></image>
    </view>
    <view class="media-right">
      <view class="media-title">
        {{item.title ? item.title : "无标题"}}
      </view>
      <view class="media-author">
        <!-- <text>FM11213344</text> -->
        <text>{{item.user.nickname}}</text>
      </view>
      <view class="media-meta">
        <view class="media-meta-item">
          <text class="iconfont">&#xe76d;</text>
          <text>{{item.created_at}}</text>
        </view>
        <!-- 点击 -->
        <view class="media-meta-item">
          <text class="iconfont">&#xe66d;</text>
          <text>{{item.hit_counter}}</text>
        </view>
        <!-- 评论 -->
        <view class="media-meta-item">
          <text class="iconfont">&#xe642;</text>
          <text>{{item.comment_counter}}</text>
        </view>
      </view>
    </view>
  </view>
</template>


<script>
export default {
  props:['item'],
  computed:{
    itemImage(){
      return item.thumbnail ? item.thumbnail : '';
    }
  }, 
  methods:{
    
  }
}
</script>


<style lang="scss">
.media-item{
  width: 100%;
  padding: 20rpx 0;
  font-size: 26rpx;
  border-bottom: 1rpx solid var(--rt-shadow-color);
  display: flex;
  .media-left{
    width: 200rpx;
    height: 115rpx;
    border-radius: 10rpx;
    overflow: hidden;
    image{
      width: 100%;
      height: 100%;
    }
  }
  
  .media-right{
    font-size: 18rpx;
    padding-left: 30rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .media-title{
      font-size: 28rpx;
      color: var(--rt-text-color);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      width: 520rpx;
    }
    .media-author{
      color: #676767;
      text{
        margin-right: 30rpx;
      }
    }
    .media-meta{
      display: flex;
      .media-meta-item{
        color: #222322;
        font-size: 20rpx;
        height: 30rpx;
        line-height: 30rpx;
        margin-right: 30rpx;
        .iconfont{
          font-size: 25rpx;
          top: 1rpx;
          position: relative;
          margin-right: 8rpx;
        }
        
      }
    }
  }
  
  

}

</style>



