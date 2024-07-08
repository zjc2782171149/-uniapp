<template>
	<view class="container">

		<NavbarRoundImg title="茄兔友谊小屋" :isBack="false" :bgImg="bgImg" backgroundColor="rgb(221, 195, 135)">
		</NavbarRoundImg>

		<div class="top">
			<div class="swiper">
				<u-swiper :list="list" :effect3d="true"></u-swiper>
			</div>
		</div>



		<div class="new">
			<div class="new-up">·故事回忆·</div>
		</div>
		
		
		<div class="record" @scroll="scroll">
			<div class="sign-record-per" v-for="(item, index) in showArticleList" :key="item.id" @click="goRecordDetail(item.id)">
				<div class="avatar">
					<u-avatar :src="item.icon">
					</u-avatar>
				</div>
				<div class="main">
					<div class="nickname">{{ item.nickname }}</div>
					<div class="publish_time">{{ item.signTime }}</div>
					<div class="content">
						<u-parse :html="item.content"></u-parse>
					</div>
					<div class="picture">
						<image v-for="(itemm, indexx) in item.pictureList" :src="itemm.url" mode="aspectFill">
						</image>
					</div>
		
				</div>
			</div>
		</div>
		
		<div class="create-icon" @click="goCreate">
			<u-icon name="plus" color="white" size="28"></u-icon>
			<!-- <div class="text">新增</div> -->
		</div>


	</view>
</template>

<script>
	import NavbarRoundImg from "@/components/navbar/navbar-round-img.vue";

	import dayjs from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime";
	import updateLocale from "dayjs/plugin/updateLocale";
	import "dayjs/locale/zh-cn";

	dayjs.extend(relativeTime);
	dayjs.extend(updateLocale);
	dayjs.locale("zh-cn");

	export default {
		components: {
			NavbarRoundImg
		},

		data() {
			return {
				userInfo: {},
				swipers: [],
				list: [{
						image: 'https://eggplantrabbit.zhangjiancong.top/images/eggplantrabbit/1.jpg',
						title: '蒹葭苍苍，白露为霜。所谓伊人，在水一方'
					},
					{
						image: 'https://eggplantrabbit.zhangjiancong.top/images/eggplantrabbit/2.jpg',
						title: '溯洄从之，道阻且长。溯游从之，宛在水中央'
					},
					{
						image: 'https://eggplantrabbit.zhangjiancong.top/images/eggplantrabbit/3.jpg',
						title: '蒹葭萋萋，白露未晞。所谓伊人，在水之湄'
					}
				],
				value: '',
				// 上传地址
				uploadUrl: 'https://eggplantrabbit.zhangjiancong.top/api/eggplantrabbit/upload',
				// uploadUrl: 'http://localhost:3002/api/upload',
				// uploadUrl: 'http://cxj.zhangjiancong.top/api/cxj/upload',
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
				// bgImg: "http://cxj.zhangjiancong.top/images/cxj/mine/bg.webp",
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
				showArticleList: [],
				type: 0,
				totalRecord: 0,
				appThemeColor: this.$appTheme.appThemeColor,

			}
		},
		onLoad() {

		},
		onShow() {
			this.initRecord();
			this.initUser();
		},
		methods: {
			async initUser() {
				// const res
				const res = await this.$u.api.getUserMes()
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
			
			// 进入记录详情
			goRecordDetail(id) {
				console.log("aaaaaaa", id);
				//在起始页面跳转到test.vue页面并传递参数
				//作用场景，需要提供固定传参状态的页面，一般和动态参数一起使用
				uni.navigateTo({
					url: `/pages/detail/index?id=${id}&type=story`
				});
			},
			
			// 每日打卡信息
			initRecord() {
				let that = this;
			
				this.$u.api.getStory().then(res => {
					console.log(res);
					that.showArticleList = res.map(item => {
						console.log(item.pictureList)
						return {
							...item,
							signTime: dayjs(item.signTime).format("YYYY-MM-DD"),
							pictureList: JSON.parse(item.pictureList)
						}
					})
					
					that.showArticleList = that.showArticleList.reverse();
	
					console.log("展示的", that.showArticleList);
			
				})
			},
			
			// 新增故事回忆
			goCreate() {
				uni.navigateTo({
					url: '/pages/home/create'
				});
			}
			
			

		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
