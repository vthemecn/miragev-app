/**
 * 常用状态
 */

import { defineStore } from 'pinia';

// 第一个参数是应用程序中 store 的唯一 id，是必要的，
// Pinia 使用它来将 store 连接到 devtools
export const mainStore = defineStore('mainStoreId', {
  state: () => {
    return {
      count: 0,
      isDarkMode:false,
      user:{},
    }
  },
  // 也可以定义为
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
  },
})

