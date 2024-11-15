<template>
  <view class="hot-item">
    <view class="hot-order">{{item.order_id}}</view>
    <view class="hot-body">
      <view class="hot-title">{{item.title}}</view>
      <view class="hot-description">{{item.description}}</view>
    </view>
  </view>
</template>

<script setup>
  const props = defineProps(['item'])
</script>

<style>
.hot-item{
  box-sizing: border-box;
  margin: 0rpx 0 20rpx;
  padding: 10rpx 10rpx 10rpx 0;
  display: flex;
  border-radius: 10rpx;
}
.hot-order{
  min-width: 45rpx;
  height: 45rpx;
  line-height: 45rpx;
  text-align: center;
  font-weight: 900;
  margin-right: 10rpx;
  /* flex-shrink:0; */
  flex: 0 0 auto;
  color:var(--rt-text-color-grey);
}
.hot-title{
  color: var(--rt-text-color);
}


</style>