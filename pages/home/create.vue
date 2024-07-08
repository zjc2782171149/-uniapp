<template>
	<div class="container">
		<NavbarRoundImg title="新增故事回忆" isBack :bgImg="bgImg" backgroundColor="rgb(221, 195, 135)">
		</NavbarRoundImg>

		<div class="text">标题</div>
		<u-input v-model="title" type="textarea" :border="true" :auto-height="true" height="100" class="title" />

		<div class="text">正文</div>
		<div class="">第一段</div>
		<u-input v-model="p1" type="textarea" :border="true" :auto-height="true" height="100" class="content"
			maxlength="500" />
		<div class="">第二段</div>
		<u-input v-model="p2" type="textarea" :border="true" :auto-height="true" height="100" class="content"
			maxlength="500" />
		<div class="">第三段</div>
		<u-input v-model="p3" type="textarea" :border="true" :auto-height="true" height="100" class="content"
			maxlength="500" />

		<!-- 图片上传 -->
		<div class="text">图片</div>
		<u-upload :deleteConfirmBtnColor="appThemeColor" width="180" height="180" max-count="3" :file-list="fileList"
			:max-size="1024 * 1024 * 10" :action="uploadUrl" :auto-upload="true" @on-uploaded="uploadPicSuccess"
			:header="{ 'Authorization': 'Bearer ' + token }">
		</u-upload>

		<div class="submit">
			<u-button :custom-style="customStyle" type="primary" shape="square" :ripple="true" @click="submit">提交
			</u-button>
		</div>
		
		<!-- 顶部消息提示 -->
		<u-top-tips ref="uTips"></u-top-tips>

	</div>
</template>

<script>
	import Tabs from "@/components/tabs.vue";
	import NavbarRoundImg from "@/components/navbar/navbar-round-img.vue";
	import TitleOperate from "@/components/title-operate.vue";

	import dayjs from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime";
	import updateLocale from "dayjs/plugin/updateLocale";
	import "dayjs/locale/zh-cn";

	// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
	// import {

	// } from 'vue-baidu-map'

	dayjs.extend(relativeTime);
	dayjs.extend(updateLocale);
	dayjs.locale("zh-cn");

	export default {
		components: {
			NavbarRoundImg
		},


		data() {
			return {
				customStyle: {
					marginTop: '20px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
					backgroundColor: 'rgb(228, 197, 152)'
				},
				title: '',
				// content: '',
				p1: '',
				p2: '',
				p3: '',
				// 上传地址
				uploadUrl: 'https://eggplantrabbit.zhangjiancong.top/api/eggplantrabbit/upload',
				// uploadUrl: 'http://localhost:3002/api/upload',
				// uploadUrl: 'https://cxj.zhangjiancong.top/api/cxj/upload',
				img: '',
				token: "eggplantrabbit",
				zoom: 15,
				// action: 'http://www.example.com/upload',
				fileList: [],
				show: false,
				// bgImg: "https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp",
				bgImg: "",
				backgroundColor: "rgba(0,0,0,0)",
				appThemeColor: this.$appTheme.appThemeColor,
			}
		},
		onLoad(options) {
			// uni.setStorageSync("user_id", 1)
		},
		onShow() {
			// 处理首页需要渲染的数据
			// this.loadPageData(false);
			// this.initUser();
			// this.onPageScroll();	
			let that = this;

		},
		methods: {
			// 上传图片成功
			uploadPicSuccess(res) {
				console.log(res);
				this.fileList = res;

				uni.showToast({
					title: "图片上传成功",
					icon: 'success'
				});

			},

			submit() {
				let fileList = this.fileList.map(item => {
					return {
						url: item.response.data.url
					}
				})
				console.log(JSON.stringify(fileList));
				// return;
				
				let content = `<p>${this.p1}</p><p>${this.p2}</p><p>${this.p3}</p>`

				const obj = {
					title: this.title,
					content: content,
					signTime: dayjs().format(),
					pictureList: JSON.stringify(fileList)
				};
				console.log("提交信息", obj);

				let that = this;

				this.$u.api.setStory(obj).then(res => {
					console.log('新增故事成功', res);

					this.$refs.uTips.show({
						title: '新增故事成功',
						type: 'success',
						duration: '2000'
					})

					setTimeout(() => {
						uni.switchTab({
							url: '/pages/home/index'
						});
					}, 2000);
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;

		padding: 40rpx 30rpx;
	}

	.text {
		font-size: 30rpx;
		font-weight: 600;
		margin: 0 0 10rpx 0;
	}

	.title {
		margin: 0 0 50rpx 0;
	}

	.content {
		margin: 0 0 50rpx 0;
	}
</style>
