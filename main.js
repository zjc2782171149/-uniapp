import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;

App.mpType = 'app';

// 引入全局uview-ui
import uView from 'uview-ui';
Vue.use(uView);


// 引入全局百度地图
// import BaiduMap from 'vue-baidu-map'
// Vue.use(BaiduMap, {
//   // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//   ak: '63awp4sGfORGzBfhV1BvMPz5xq3GK5Q0'



// uview-ui对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);

// 引入全局组件
import Navbar from '@/components/navbar/navbar.vue'
Vue.component('Navbar', Navbar);
import NavbarCommon from '@/components/navbar/navbar-common.vue'
Vue.component('NavbarCommon', NavbarCommon);
import NoData from '@/components/no-data.vue'
Vue.component('NoData', NoData);

// 引入全局主题变量
import appTheme from '@/theme.scss';
Vue.prototype.$appTheme = appTheme

// 引入全局工具函数
import {
	replaceSale
} from '@/utils/replace.js'
Vue.prototype.$replaceSale = replaceSale
import {
	copyByUniappApi
} from '@/utils/uniapp-api.js';
Vue.prototype.$copyByUniappApi = copyByUniappApi

// 引入vuex
import store from './store/index.js'
Vue.prototype.$store = store

const app = new Vue({
	...store,
	...App
});

// 以下内容需要在 new Vue() 之后引入注册，因为外部JS文件需要引用vue的实例，即this对象

// 基于uview-ui的http配置
import {
	installHttpConfig
} from '@/api/config.js';
Vue.use(installHttpConfig, app);

// http接口API全局
import {
	installApiModules
} from '@/api';
Vue.use(installApiModules, app);

// 生产环境下，console置空
// if (uni.getSystemInfoSync().platform !== "devtools" || process.env.NODE_ENV === 'production') {
// 	console.log = () => {};
// 	console.warn = () => {};
// 	console.error = () => {};
// }


app.$mount();
