import App from './App';
import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';

import httpUtil from './common/http-util.js';
import * as helper from '@/common/helper';

import './common/css/style.scss';

export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  
  app.config.globalProperties.$httpUtil = httpUtil;
  app.config.globalProperties.$helper = helper;
  // app.config.globalProperties.$player = uni.createInnerAudioContext();
  app.config.globalProperties.$audio = {id:0, src:'', player:undefined};
  
  return {
    app,
    Pinia
  }
}
