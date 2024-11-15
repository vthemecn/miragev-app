<template>
<!--  <view class="animated-background">
  </view> -->
  
<view class="item">
  <view class="skeleton-image animated-background"></view>
  <view class="skeleton-right">
    <view class="title animated-background"></view>
    <view class="description animated-background"></view>
  </view>
</view>
</template>

<script>
</script>

<style lang="scss">
  .item{
    width: 700rpx;
    height: 100rpx;
    margin: 10rpx auto;
    display: flex;
    justify-content: space-between;
    .skeleton-image{
      width: 100rpx;
      height: 100rpx;
    }
    .skeleton-right{
      width: 580rpx;
      height: 100rpx;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .title{
        width: 100%;
        height: 30rpx;
      }
      .description{
        width: 100%;
        height: 50rpx;
      }
    }
  }



  
</style>