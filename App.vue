<script>
  import helper from '@/common/helper.js';
  
	export default {
		onLaunch: function() {
      helper.initStoreFromStorage();
      // console.log('App onLaunch');
		},
		onShow: function() {
      // console.log('App onShow');
		},
		onHide: function() {
      // console.log('App onHide');
		},
    onThemeChange: function(){
      console.log('onThemechange: ', uni.getSystemInfoSync);
    }
	}
</script>

<style lang="scss">
/*每个页面公共css */
// @import './common/css/style.scss';
// page{
//   background-color: green;
// }
</style>
