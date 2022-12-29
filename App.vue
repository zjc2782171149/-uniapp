<script>
	import dayjs from 'dayjs'
	
	export default {
		globalData: {
			// 胶囊距上距离
			menuTop: 0,
			// 导航栏高度
			navBarHeight: 0,
			// 胶囊距右方间距（方保持左、右间距一致）
			menuRight: 0,
			// 胶囊距底部间距（保持底部间距一致）
			menuBotton: 0,
			// 胶囊高度（自定义内容可与胶囊高度保证一致）
			menuHeight: 0,
			// 状态栏高度
			statusBarHeight: 0,
			// 安全距离
			safeAreaHeight: 0,
			// 胶囊宽度
			menuWidth: 0,
			// 已选择的地址占地址列表中的索引
			addressIndex: 0,
			// 用户地址列表
			addressList: [{
					isHome: true,
					province: '山东省',
					city: '青岛市',
					area: '李沧区',
					street: '浮山路街道',
					address: '华南农业大学创客空间',
					name: '李李',
					phone: '187****7234'
				},
				{
					isHome: true,
					province: '山东省',
					city: '青岛市',
					area: '李沧区',
					street: '浮山路街道',
					address: '大马路路60号就金茂悦10号楼1单元',
					name: '李李',
					phone: '187****7234'
				}
			],
			// 购物车列表
			goodsList: [
				{ good_id: 1, name: "戴森吹风机家用负离子护发专用大功率不伤发 家用负离子护发电吹风 HD08", num: 2, sku: 'HD08-普鲁士蓝防翘系列', price: '378', checked: true, pics: "https://smoothbucket.oss-cn-shenzhen.aliyuncs.com/hzhj/goods/5.png" },
				{ good_id: 2, name: '化州红橘', num: 5, sku: '尊贵装', price: '10000', checked: false, pics: "https://smoothbucket.oss-cn-shenzhen.aliyuncs.com/hzhj/goods/11.png" }
			],
			// 选中商品的购物车列表
			goodsListSelected: [],
			// 优惠券
			discountIndex: -1,
			discountsList: [],
			// 获取裁剪后的规则时间
			getNowTime: function(time) {
				return time.slice(0, 10) + " " + time.slice(11, 19);
			}
		},
		onLaunch(options) {
			const that = this;
			// 获取系统信息
			const systemInfo = uni.getSystemInfoSync();
			// 胶囊按钮位置信息
			const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
			// 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
			console.log(systemInfo);
			// that.globalData.menuTop = menuButtonInfo.top - systemInfo.statusBarHeight;
			// that.globalData.menuWidth = menuButtonInfo.width;
			// that.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height +
			// 	systemInfo.statusBarHeight;
			// that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
			// that.globalData.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
			// that.globalData.menuHeight = menuButtonInfo.height;
			// that.globalData.statusBarHeight = systemInfo.statusBarHeight;
			// that.globalData.safeAreaHeight = systemInfo.safeAreaInsets.bottom;
		}
	};
</script>

<style lang="scss">
	// ===
	// === 注意：此处导入的css，会作用于全部.vue文件，请适量导入
	// ===

	@import 'uview-ui/index.scss';

	/* 解决小程序和app滚动条的问题 */
	/* #ifdef MP-WEIXIN || APP-PLUS */
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}

	/* #endif */

	/* 解决H5 的问题 */
	/* #ifdef H5 */
	uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}

	/* #endif */

	page {
		background-color: $bg-color-white;
		height: 100%;
		font-size: $font-size-base;
		color: $text-color-base;
		font-family: "SourceHanSansCN";
	}
</style>
