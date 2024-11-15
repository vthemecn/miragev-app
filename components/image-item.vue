<template>
  <view class="item-container" @tap="goDetail()">
    <!-- @click.native="goDetail(item.id -->
    <view class="item-header">
      <image v-if="item.thumbnail" :src="item.thumbnail" mode="aspectFill"></image>
      <image v-else src="../../static/images/default.jpg" mode="aspectFill"></image>
    </view>
    <view class="item-title">
      {{item.post_title ? item.post_title : "" }}
    </view>
  </view>
</template>

<script setup>
  const props = defineProps(['item']);

  function goDetail(){
    console.log('item ', props.item);
    uni.navigateTo({ url:'/pages/audios/audio?id=' + props.item.ID });
  }
</script>

<style lang="scss">
  .item-container{
    width: 210rpx;
    margin-bottom: 20rpx;
    .item-header{
      width: 210rpx;
      height: 210rpx;
      border-radius: 13rpx;
      overflow: hidden;
      position: relative;
      image{
        width: 210rpx;
        height: 210rpx;
      }
    }
    .item-title{
      font-size: 25rpx;
      color: #393939;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
</style>
