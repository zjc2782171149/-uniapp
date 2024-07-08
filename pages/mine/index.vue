<template>
	<view class="container">
		<view class="page">
			<!-- 带背景的透明导航栏 -->
			<NavbarRoundImg title="打卡记录" :isBack="false" :bgImg="bgImg" backgroundColor="rgb(221, 195, 135)">
			</NavbarRoundImg>

			<!-- 信息 -->
			<view class="info">
				<view class="avatar">
					<u-avatar size="132"
						:src="userInfo.icon">
					</u-avatar>
				</view>
				<view class="name">{{ '茄兔的小家' }}</view>

				<u-button @click="dailySign" class="buttonclass" type="success" size="medium" shape="circle">今日打卡
				</u-button>

				<view class="num">
					<view class="fans">
						<text>累计记录次数</text>
						<text>{{ totalRecord }}</text>
					</view>
				</view>
				<!-- <view class="desc">{{ 111 }}</view> -->
				<view class="operate">
				</view>
			</view>
			<!-- tab -->
			<view class="tabs">
				<Tabs itemWidth="200" :listData="tabsOps" fontSize="34" @change="tabsChange"></Tabs>
			</view>
			<!-- 主页 -->
			<view class="item" v-if="currentTab == 1">
				<view class="card">
					<TitleOperate title="基本信息" padding="0"></TitleOperate>
					<view class="line">性别：{{ userInfo.gender }}</view>
					<view class="line">地区：公主城堡</view>
					<view class="line">个人简介：这个人很懒,没留下什么 </view>
					<view class="line">生日：生日当然要保密啦</view>

				</view>
			</view>


			<view class="item" v-if="currentTab == 2">
				<!--提问卡片-->
				<!-- 回答 -->
				<QuestionList :data="showArticleList"></QuestionList>
				<NoData height="50vh" v-if="showArticleList.length === 0"></NoData>
			</view>


			<view class="item" v-if="currentTab == 0">
				<!-- 记录卡片 -->
				<!-- <RecordList :data="showArticleList"></RecordList> -->
				<div class="record" @scroll="scroll">
					<div class="sign-record-per" v-for="(item, index) in showArticleList" :key="item.id"
						@click="goRecordDetail(item.id)">
						<div class="avatar">
							<u-avatar src="https://eggplantrabbit.zhangjiancong.top/images/eggplantrabbit/avatar.jpg">
							</u-avatar>
						</div>

						<div class="main">
							<div class="nickname">{{ userInfo.nickname }}</div>
							<div class="publish_time">{{ item.signTime }}</div>
							<div class="content">
								<u-parse :html="item.content"></u-parse>
							</div>
							
							<div class="picture">
								<div class="image" v-for="(itemm, indexx) in item.pictureList">
									<image :src="itemm.url" mode="aspectFill">
									</image>
								</div>

							</div>

						</div>
					</div>
				</div>
				<NoData height="50vh" v-if="showArticleList.length === 0"></NoData>
			</view>
		</view>

		<u-toast ref="uToast" />

		<u-modal z-index="1000" v-model="show" :title-style="{color: 'blue'}" confirm-text="打卡"
			:show-cancel-button="true" @confirm="submit">
			<view class="slot-content">
				你当前距离老母猫的老窝 {{long}} 米
			</view>

			<u-input v-model="value" type="textarea" :border="true" :auto-height="true" height="100"
				class="inputarea" />

			<!-- 图片上传 -->
			<u-upload :deleteConfirmBtnColor="appThemeColor" width="180" height="180" max-count="3"
				:file-list="fileList" :max-size="1024 * 1024 * 10" :action="uploadUrl" :auto-upload="true"
				@on-uploaded="uploadPicSuccess" :header="{ 'Authorization': 'Bearer ' + token }">
			</u-upload>


			<!-- <u-upload @on-uploaded="onUploaded" :action="uploadUrl" :file-list="fileList" max-count="4"></u-upload> -->
		</u-modal>



	</view>
</template>

<script>
	import Tabs from "@/components/tabs.vue";
	import NavbarRoundImg from "@/components/navbar/navbar-round-img.vue";
	import TitleOperate from "@/components/title-operate.vue";

	import dayjs from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime";
	import updateLocale from "dayjs/plugin/updateLocale";
	import "dayjs/locale/zh-cn";

	// import AMapLoader from "@amap/amap-jsapi-loader";
	// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
	// import {

	// } from 'vue-baidu-map'

	import RandomNum from '@/utils/random.js'

	dayjs.extend(relativeTime);
	dayjs.extend(updateLocale);
	dayjs.locale("zh-cn");

	export default {
		components: {
			NavbarRoundImg,
			Tabs,
			TitleOperate,

		},
		data() {
			return {
				userInfo: {},
				value: '',
				// 上传地址
				uploadUrl: 'https://eggplantrabbit.zhangjiancong.top/api/eggplantrabbit/upload',
				// uploadUrl: 'http://localhost:3002/api/upload',
				img: '',
				token: "eggplantrabbit",
				long: 0,
				circlePath: {
					center: {
						lng: 116.4,
						lat: 39.9
					},
					radius: 500
				},
				center: {
					lng: 0,
					lat: 0,
				},
				zoom: 15,
				// action: 'http://www.example.com/upload',
				fileList: [],
				show: false,
				content: '东临碣石，以观沧海',
				bgImg: "",
				backgroundColor: "rgba(0,0,0,0)",
				// tabs
				currentTab: 0,
				tabsOps: [{
						text: "记录",
					},
					{
						text: "主页",
					}
					// {
					// 	text: "记录",
					// },
				],
				userInfo: {},
				articleList: [],
				showArticleList: [{
					avatar: 'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
					nickname: '帅气茄子',
					signTime: '2023-12-30 09:12:29',
					content: '主要内容主要内容主要内容主要主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容',
					pictureList: ['https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
						'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
						'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp'
					]
				}, {
					avatar: 'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
					nickname: '帅气茄子',
					signTime: '2023-12-30 09:12:29',
					content: '主要内容主要内容主要内容主要主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容',
					pictureList: ['https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
						'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
						'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp'
					]
				}, {
					avatar: 'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
					nickname: '帅气茄子',
					signTime: '2023-12-30 09:12:29',
					content: '主要内容主要内容主要内容主要主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容',
					pictureList: ['https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
						'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
						'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp'
					]
				}, {
					avatar: 'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
					nickname: '帅气茄子',
					signTime: '2023-12-30 09:12:29',
					content: '主要内容主要内容主要内容主要主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容主要内容',
					pictureList: ['https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
						'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
						'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp'
					]
				}],
				type: 0,
				totalRecord: 0,
				appThemeColor: this.$appTheme.appThemeColor,


			}
		},
		onLoad(options) {
			// uni.setStorageSync("user_id", 1)
		},
		onShow() {
			let that = this;

			this.initRecord();

			// this.initLocation();

			uni.getLocation({
				// type: 'gcj02', // 标准
				geocode: true, //设置该参数为true可直接获取经纬度及城市信息，只有gcj02标准才可以用
				altitude: true,
				success: function(res) {
					console.log(res);
					that.center.lng = res.longitude;
					that.center.lat = res.latitude;

					let long = that.distanceOfTwoPoint(res.latitude, res.longitude, 22.983649, 113.09655);
					// let long = RandomNum(100, 600);
					console.log("你当前距离老母猫家 ", long, " 米");

					that.long = long;
				},
				fail: function() {
					console.log('获取地址失败，将导致部分功能不可用')
					// uni.showToast({
					// 	title: '获取地址失败，将导致部分功能不可用',
					// 	icon: 'none'
					// });
				}
			})

			// uni.request({
			// 	url: 'https://restapi.amap.com/v3/geocode/regeo',
			// 	method: 'GET',
			// 	data: {
			// 		location: res.longitude + ',' + res.latitude,
			// 		key: '07df561b7d35e9a4f651cd3192f64728', //  切记一定是web服务的，其他的不行
			// 		// radius:'1000',
			// 		// extensions:'all',
			// 		// batch:false,
			// 		// roadlevel:'0'
			// 	},
			// 	success: function(res) {
			// 		console.log("-------------------> 城市解析");
			// 		console.log(res);
			// 		console.log(res.data.regeocode.formatted_address);
			// 		// _this.geography = res.data.regeocode.formatted_address;
			// 	},
			// 	fail: function(err) {
			// 		console.log('地址解析失败' + err);
			// 	}
			// })



		},
		methods: {
			async initUser() {
				// const res
				const res = await this.$u.api.getUserMes();
				console.log('首页用户信息', res)
				if (res.status && res.status === -1) {
					uni.reLaunch({
						url: '/pages/login/index'
					});
				} else {
					this.userInfo = res;
					uni.setStorageSync('userInfo', this.userInfo)
					uni.setStorageSync('isLogin', true)
				}
			},
			
			initLocation() {
				// window._AMapSecurityConfig = {
				//   securityJsCode: "614a403c79a0afddc04a07b2b55bafa8",
				// };
				// AMapLoader.load({
				//   key: "07df561b7d35e9a4f651cd3192f64728", //申请好的 Web 端开发者 Key，首次调用 load 时必填
				//   version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
				//   plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['AMap.Scale','...','...']
				// })
				//   .then((AMap) => {
				// 	var map = new AMap.Map('container', {
				// 	  resizeEnable: true
				// 	})
				//   })
				//   .catch((e) => {
				//     console.log(e);
				//   });

				// AMapLoader.plugin('AMap.Geolocation', function() {
				// 	var geolocation = new AMap.Geolocation({
				// 		// 是否使用高精度定位，默认：true
				// 		enableHighAccuracy: true,
				// 		// 设置定位超时时间，默认：无穷大
				// 		timeout: 10000,
				// 		// 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
				// 		buttonOffset: new AMap.Pixel(10, 20),
				// 		//  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
				// 		zoomToAccuracy: true,
				// 		//  定位按钮的排放位置,  RB表示右下
				// 		buttonPosition: 'RB'
				// 	})

				// 	geolocation.getCurrentPosition()
				// 	AMap.event.addListener(geolocation, 'complete', onComplete)
				// 	AMap.event.addListener(geolocation, 'error', onError)

				//  function onComplete(data) {
				// 		// data是具体的定位信息
				// 	}

				// 	function onError(data) {
				// 		// 定位出错
				// 	}
				// })

			},

			// 进入打卡记录详情
			goRecordDetail(id) {
				console.log("aaaaaaa", id);
				uni.navigateTo({
					url: `/pages/detail/index?id=${id}&type=sign`
				});
			},

			// 每日打卡信息
			initRecord() {
				let that = this;

				this.$u.api.getUserSign().then(res => {
					console.log(res);
					that.showArticleList = res.map(item => {
						return {
							...item,
							signTime: getApp().globalData.getNowTime(item.signTime),
							pictureList: JSON.parse(item.pictureList)
						}
					})

					that.showArticleList = that.showArticleList.reverse();
					console.log(that.showArticleList);
				})
			},

			scroll(e) {
				console.log(e);
			},

			tabsChange(res) {
				this.currentTab = res;
				console.log(res);


			},

			// 上传图片成功
			uploadPicSuccess(res) {
				console.log(res);
				this.fileList = res;

				uni.showToast({
					title: "图片上传成功",
					icon: 'success'
				});

			},

			// 新增每日喝茶记录 or 问题
			submit() {
				// 打卡距离超出500m，不允许
				if(this.long >= 500) {
					uni.showToast({
						title: '打卡失败',
						icon: 'error'
					});
					return;
				}
					
				let that = this;
				// console.log("图片数据", this.fileList);

				let fileListPush = this.fileList.map((item) => {
					return item.response.data;
				})
				console.log("图片数据22222", fileListPush);

				this.fileList = [];

				// 有图片才能提交
				this.$u.api.setUserSign({
					signTime: dayjs().format(),
					content: this.value,
					pictureList: JSON.stringify(fileListPush)
				}).then(res => {
					console.log(res);
					uni.showToast({
						title: '打卡成功',
						icon: 'success'
					});
					that.initRecord();
				})

			},
			// 计算距离
			distanceOfTwoPoint(lat1, lng1, lat2, lng2) {
				const radLat1 = lat1 * Math.PI / 180.0
				const radLat2 = lat2 * Math.PI / 180.0
				const a = radLat1 - radLat2
				const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
				let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math
					.pow(Math.sin(b / 2), 2)))
				s = s * 6378.137
				s = Math.round(s * 1000)

				return s
			},

			handler({
				BMap,
				map
			}) {
				this.center.lng = 116.404
				this.center.lat = 39.915
			},


			onUploaded(lists) {
				this.filesArr = lists;
			},
			dailySign() {
				this.show = true;
				// this.showToast();
			},

			showToast() {
				this.$refs.uToast.show({
					title: '打卡成功',
					type: 'success',
					// url: '/pages/user/index'
				})
			},

			onPageScroll(e) {
				console.log(e);
				if (e.scrollTop > 10) {
					this.backgroundColor = "red";
					// this.bgImg = 
				} else {
					this.backgroundColor = "rgba(0,0,0,0)";
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';

	.record {
		// display: flex;
		width: 98%;
		// height: 500rpx;
		overflow-x: hidden;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		// padding: 0 0 40rpx 0;
		// height: 100vh
	}

	.sign-record-per {
		display: flex;
		margin: 0 0 60rpx 0;
		padding: 0 0 30rpx 0;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.avatar {
		margin-right: 20rpx;
	}

	.main {
		width: 600rpx;

		.nickname {
			margin-bottom: 10rpx;
			color: rgb(228, 197, 152);
			font-weight: 600;
			font-size: 25rpx;
		}

		.publish_time {
			margin-bottom: 20rpx;
			font-size: 18rpx;
			color: gray;
		}

		.content {	
			width: 100%;
			margin-bottom: 20rpx;
			word-wrap: break-word;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.picture {
			display: flex;

			image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 8rpx;
				margin-right: 25rpx;
			}
		}
	}




	.inputarea {
		margin: 20rpx 10rpx;
	}

	.baidu-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: scroll;

		::v-deep .anchorBL {
			display: none !important;
		}

		.map {
			width: 750rpx;
			/* #ifdef H5 */
			width: 100%;
			/* #endif */
			height: 300px;
			background-color: #f0f0f0;
		}
	}

	.buttonclass {
		margin: 20rpx 0;
		// background-color: rgb(228, 197, 152);
	}

	.customStyle {
		border-radius: 50%;
		marginTop: '20px'; // 注意驼峰命名，并且值必须用引号包括，因为这是对象
		color: 'red';
	}

	.info {
		position: relative;
		// background-color: $app-theme-bg-color;
		background-color: $app-theme-bg-color;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		margin: 180rpx 30rpx 30rpx 30rpx;
		border-radius: 16rpx;
		box-shadow: $app-theme-shadow;
		padding-bottom: 5rpx;

		.avatar {
			position: absolute;
			top: 0;
			left: 50%;
			transform: translate(-50%, -50%);
			border: 6rpx solid $app-theme-bg-color;
			border-radius: 50%;
			overflow: hidden;
		}

		.name {
			padding-top: 100rpx;
			font-size: 40rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: $app-theme-text-black-color;
			width: 100%;
			text-align: center;
		}

		.num {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-top: 20rpx;

			.follow,
			.fans {
				text:nth-child(1) {
					font-size: 25rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: $app-theme-text-black-color;
					margin-right: 4rpx;
				}

				text:nth-child(2) {
					font-size: 32rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 600;
					color: $app-theme-color;
				}
			}

			.follow {
				margin-right: 60rpx;
			}
		}

		.desc {
			padding-top: 20rpx;
			width: 100%;
			text-align: center;
			font-size: 22rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: $app-theme-card-gray-deep-color;
		}

		.operate {
			padding: 40rpx 0;
		}
	}

	.tabs {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.item {
		padding: 30rpx;
	}

	.card {
		margin-bottom: 30rpx;
		padding: 30rpx;
		border-radius: 16rpx;
		box-shadow: $app-theme-shadow;
		background-color: $app-theme-bg-color;
		overflow: hidden;

		.line {
			margin-top: 26rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: $app-theme-navbar-tab-color;
		}
	}
</style>
