<template>
  <view class="r_mask">
    <view class="r_box">
      <view class="r_head">
      	用户协议及隐私条款
      </view>
      <view class="r_content">
        请认真阅读用户协议和隐私政策，点击同意即可表示您已阅读并同意全部条款
      </view>
      <button type="default" class="r_button ok" @click="$emit('ok')">同意并继续</button>
      <button type="default" class="r_button" @click="$emit('no')">不同意</button>
    </view>
  </view>
</template>

<script setup>

</script>

<style lang="scss">
.r_mask{
  position: fixed;
  z-index: 99999;
  background-color: rgba(0,0,0,0.5);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  .r_box{
    width: 550rpx;
    // overflow: hidden;
    font-size: 30rpx;
    background-color: #fff;
    border-radius: 10rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 30rpx;
    .r_head{
      text-align: center;
      line-height: 80rpx;
      font-weight: 700;
    }
    .r_content{ padding: 30rpx 0; }
    .r_button{
      width: 100%;
      height: 80rpx;
      margin-bottom: 15rpx;
    }
    .r_button.ok{
      background-color: var(--rt-color-primary);
      color: var(--rt-text-color-inverse);
    }
  }
}
</style>