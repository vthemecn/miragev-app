<template>
  <view class="article-item">
    <view class="item-header">
      <view class="author">
        <image :src="item.user.avatar" mode="aspectFill"></image>
        <text>{{ item.user.nickname }}</text>
      </view>
    </view>
    <view class="item-body">
      <view class="item-title">{{ item.title }}</view>
      <view class="item-description">
        <view class="item-text">{{ item.description }}</view>
        <image v-if="item.thumbnail" :src="item.thumbnail" mode="aspectFill"></image>
      </view>
    </view>
    <view class="item-footer">
      <view class="f-item">
        <text class="iconfont">&#xe752;</text><text>{{ item.hit_counter }}</text>
      </view>
      <view class="f-item" v-if='item.like_counter'>
        <text class="iconfont">&#xe663;</text> <text>{{ item.like_counter }}</text>
      </view>
      <view class="f-item" v-if='item.commet_counter'>
        <text class="iconfont">&#xe8a6;</text> <text>{{ item.commet_counter }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
  const props = defineProps(['item'])
</script>

<style>
.article-item {
  display: flex;
  flex-direction: column;
  padding: 20rpx 20rpx;
  margin: 20rpx 0;
  box-shadow: 0 0 10rpx var(--rt-shadow-color);
  box-sizing: border-box;
  border-radius: 10rpx;
  /* outline: 1rpx solid green; */
}
.item-header{}

.author {
  display: flex;
  align-items: center;
  font-size: var(--rt-font-size-sm);
  color:var(--rt-text-color-grey);
}
.author image{
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.item-body {
  display: flex;
  flex-direction: column;
  margin-top: 20rpx;
}
.item-body .item-title {
  font-size: var(--rt-font-size-base);
}
.item-body .item-description {
  display: flex;
  margin-top: 10rpx;
}
.item-body .item-description .item-text{
  font-size: var(--rt-font-size-sm);
  color:var(--rt-text-color-grey);
  line-height: 48rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.item-body .item-description image {
  flex-shrink: 0;
  width: 200rpx;
  height: 150rpx;
  margin-left: 20rpx;
  border-radius: 10rpx;
}

.item-footer{
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
  color: var(--rt-text-color-grey);
}
.item-footer .f-item {
  display: flex;
  font-size: 27rpx;
  align-items: center;
}
.item-footer .f-item .iconfont{
  display: inline-block;
  transform: scale(1.5);
  margin-right: 10rpx;
}
</style>
