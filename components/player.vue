<template>
  <!-- 进度条 -->
  <view class="audio-wrapper">
    <view class="audio-number">{{state.currentTimeText}}</view>
    <slider class="audio-slider"
      block-size="15"
      activeColor="#3e92ff"
      backgroundColor="#6c6c6c"
      block-color="#007aff"
      :value="state.current" 
      :max="state.duration" 
      @changing="sliderChanging"
      @change="sliderChange">
    </slider>
    <view class="audio-number">{{state.durationTimeText}}</view>
  </view>
  
  <!-- 播放器 -->
  <view class="audio-control-container">
    <view class="iconfont normal-icon" @click="prev">&#xe749;</view>
    <view class="audio-control-switch" @click="operation($player)">
      <view class="iconfont" :class="{audioLoading:state.loading}">
        {{state.loading ? '&#xe895;' : (state.paused?'&#xe87c;':'&#xe87a;')}}
      </view>
    </view>
    <view class="iconfont normal-icon" @click="next">&#xe748;</view>
  </view>
</template>


<script setup>
import { watch, ref, reactive, getCurrentInstance } from 'vue';
import { mainStore } from '@/store/main.js';
import { onLoad, onUnload, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

import config from '@/common/config.js';
import util from '@/common/util.js';
import httpUtil from '@/common/http-util.js';
import helper from '@/common/helper.js';

const state = reactive({
  player: undefined,
  currentTimeText: '00:00', //当前播放时间
  durationTimeText: '00:00', //总时长
  current: 0, //slider当前进度
  loading: false, //是否处于读取状态
  paused: true, //是否处于暂停状态
  seek: false , //是否处于拖动状态
  duration: 100, //当前音频的长度（单位：s）
  autoplay:true , //自动播放
  audioId:0, //音频ID
  audioSrc:'' ,//音频SRC
  timer:null
});
const store = mainStore();

const props = defineProps(['audioId','audioSrc','control','continue','isPlayerEmpty']);

let player = null;

const {proxy} = getCurrentInstance();

const emit = defineEmits(['play-failed'])

onLoad((e)=>{
  if(proxy.$audio.player == null){
    proxy.$audio.player = uni.createInnerAudioContext();
  }

  state.timer = setInterval(()=>{
    // 初始化进度条状态
    if (state.seek) return;
    state.current = proxy.$audio.player.currentTime;
    state.duration = proxy.$audio.player.duration;
    state.paused   = proxy.$audio.player.paused;
    state.currentTimeText = proxy.$audio.player.currentTime>0 ? formatSeconds(proxy.$audio.player.currentTime) : '00:00';
    state.durationTimeText = proxy.$audio.player.duration>0 ? formatSeconds(proxy.$audio.player.duration) : '00:00';
  },500);
});


onUnload(()=>{
  clearInterval(state.timer)
});

watch(() => props.audioSrc,  (newSrc, oldSrc) => {
  console.log('watch');
  if(newSrc != oldSrc){
    proxy.$audio.player.src = newSrc;
    audioInit();
    // setTimeout(()=>{ if(!proxy.$audio.player.duration){ emit('play-failed'); }}, 5000);
  }
});

// watch(() => state.current,  (newSrc, oldSrc) => {
//   // console.log('state.current watch');
//   state.currentTimeText = formatSeconds(proxy.$audio.player.currentTime);
// });

function audioInit(){
  console.log("=====");
  console.log("=====");
  console.log("=====");
  console.log('audioInit');
  proxy.$audio.player.autoplay = true;
  proxy.$audio.player.volume = 1;
  
  // 播放器设置
  proxy.$audio.player.offPlay();
  proxy.$audio.player.offError();
  proxy.$audio.player.offCanplay();
  proxy.$audio.player.offWaiting();
  proxy.$audio.player.offTimeUpdate();

  proxy.$audio.player.onPlay(() => {
    state.paused = false;
  });
  
  proxy.$audio.player.onError((res) => {
    emit('play-failed');
    let errArr = [
      { code:'10001',	msg:'系统错误'},
      { code:'10002',	msg:'网络错误'},
      { code:'10003',	msg:'文件错误'},
      { code:'10004',	msg:'格式错误'},
      { code:'-1',	msg:'未知错误'},
      { code:'-99',	msg:'-99 MediaError'}
    ];
    let err = errArr.filter((item,index)=>{
      return item.code == res.errCode;
    });
    uni.showToast({ title:err[0].msg, icon:'none' });
    if(err.length == 0){
      uni.showToast({ title:JSON.stringify(res), icon:'none' });
    }
  });
  
  proxy.$audio.player.onCanplay((res) => {
    console.log('onCanplay');
    // 初始化进度条状态
    state.current = proxy.$audio.player.currentTime;
    state.currentTimeText = proxy.$audio.player.currentTime>0 ? formatSeconds(proxy.$audio.player.currentTime) : '00:00';
    state.durationTimeText = proxy.$audio.player.duration>0 ? formatSeconds(proxy.$audio.player.duration) : '00:00';
    
    // proxy.$audio.player.play();
  });
  
  proxy.$audio.player.onWaiting((res) => {
    console.log('onWaiting');
  });
  
  // proxy.$audio.player.onTimeUpdate((res) => {
  //   //音频进度更新事件 拖动的时候不更新时间，不然slider会跳动
  //   if (!state.seek) { updateSlider(state); }
  // });
}

function updateSlider(state){
  // console.log('onTimeUpdate', state.current );
  state.current  = proxy.$audio.player.currentTime;
  state.duration = proxy.$audio.player.duration;
  state.paused   = proxy.$audio.player.paused;
}

// 播放按钮
function operation(player){
  console.log('点击了播放按钮', proxy.$audio.player.paused);
  if(proxy.$audio.player.paused == true){
    state.paused = false;
    proxy.$audio.player.play();
  } else {
    state.paused = true;
    proxy.$audio.player.pause();
  }
}


// 完成一次点击或者拖动后触发
function sliderChange(e){
  console.log('sliderChange', e);
  proxy.$audio.player.seek(e.detail.value);
  state.current= e.detail.value;
  state.seek = false;
}

// 拖动过程中触发
function sliderChanging(e){
  console.log('sliderChanging', e);
  state.seek = true;
  state.currentTimeText = formatSeconds(e.detail.value);
}

function retry(){}
function prev(){}
function next(){}

function formatSeconds(value) {
  console.log('parseInt(value) ', value);
  let result = parseInt(value);
  let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
  let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
  let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
     
  let res = '';
  if(h !== '00') res += `${h}:`;
  res += `${m}:`;
  res += `${s}`;
  return res;
}

</script>



<style lang='scss'>
	.audio-wrapper {
		display: flex;
		align-items: center;
    padding: 50rpx 10px 0 10px;
    .audio-number {
    	font-size: 24rpx;
    	line-height: 1;
    	color: var(--rt-text-color);
    }
    .audio-slider {
    	flex: 1;
    	margin: 0 20rpx;
    }
	}
  
  .audio-control-container{
    margin-top: 50rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .normal-icon{
      font-size: 45rpx;
      color: var(--rt-text-color);
    }
    .audio-control-switch {
    	height:100rpx;
      width: 100rpx;
      border-radius: 50rpx;
      box-shadow: 0 0 20rpx var(--rt-shadow-color);
    	margin: 0 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .audioLoading {
    	animation: loading 2s;
    	animation-iteration-count: infinite;
    	animation-timing-function: linear;
    }
  }
  
	@keyframes loading {
		to { transform: rotate(360deg); }
	}
</style>
