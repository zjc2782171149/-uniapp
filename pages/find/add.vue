<template>
	<view class="page">
		<!-- 一般导航栏 -->
		<Navbar :title="title"></Navbar>
		<!-- 表单 -->
		<view class="form">
			<view class="content">
				<u-input v-model="value" height="200" type="textarea" placeholder="请填写内容(最多50个字)"
					maxlength="50" :border="true" border-color="#ddc387" :focus="true"></u-input>
			</view>
			<view v-if="title === '每日喝茶记录'" class="pics">
				<!-- 图片上传 -->
				<u-upload :deleteConfirmBtnColor="appThemeColor" width="180" height="180" max-count="1"
					:max-size="1024 * 1024 * 10" :action="uploadUrl" :auto-upload="true" @on-success="uploadPicSuccess">
				</u-upload>
			</view>

		</view>
		<!-- 按钮 -->
		<view class="btn">
			<u-button type="gold" shape="circle" @click="submit"><text>提交</text></u-button>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs';

	export default {
		data() {
			return {
				title: '每日喝茶记录',
				value: '',
				// 主题色
				appThemeColor: this.$appTheme.appThemeColor,
				appThemeTextGrayColor: this.$appTheme.appThemeTextGrayColor,
				// 上传地址
				uploadUrl: 'http://47.106.83.74:3002/upload',
				img: ''

			};
		},
		onLoad(options) {
			if (options.type === 'dailyRecord') this.title = '每日喝茶记录';
			if (options.type === 'question') this.title = '问题发布';
		},
		onShow() {

		},
		methods: {
			// 上传图片成功
			uploadPicSuccess(data) {
				if (data.code === 200) {
					this.img = data.url;
				} else {
					uni.showToast({
						title: '图片上传失败',
						icon: 'error'
					})
				}

			},

			// 新增每日喝茶记录 or 问题
			submit() {
				if (this.value.length < 10) {
					uni.showToast({
						title: '得至少输出10个文字',
						icon: 'none'
					})
					return;
				}

				if (this.title === "每日喝茶记录") {
					// 有图片
					this.$u.api.setArticleMes({
						user_id: uni.getStorageSync("user_id"),
						content: this.value,
						publish_time: getApp().globalData.getNowTime(dayjs().format()),
						view_num: 0,
						type: 2,
						img: this.img
					}).then(res => {
						uni.showToast({
							title: '记录成功',
							icon: 'success'
						});

						setTimeout(() => {
							uni.switchTab({
								url: '/pages/find/index'
							})
						}, 1000);


					})
				} else {
					// 没图片
					this.$u.api.setArticleMes({
						user_id: uni.getStorageSync("user_id"),
						content: this.value,
						publish_time: getApp().globalData.getNowTime(dayjs().format()),
						view_num: 0,
						type: 0,
					}).then(res => {
						uni.showToast({
							title: '问题发布成功',
							icon: 'success'
						});

						setTimeout(() => {
							uni.switchTab({
								url: '/pages/find/index'
							})
						}, 1000);
					})

				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.page {
		padding: 24rpx 30rpx;
		background-color: $app-theme-bg-color;
	}

	.card {
		.form {}

		.pics {
			padding-bottom: 30rpx;
			border-bottom: 1rpx solid $app-theme-border-color;
			// 视觉对齐
			margin-left: -12rpx;
		}
	}

	.satellite {
		margin-top: 24rpx;

		.item {
			border-top: 1px solid $app-theme-border-color;
			padding: 24rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				view {
					padding-left: 24rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: $app-theme-text-gray-color;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					width: 80vw;
				}
			}
		}
	}

	.btn {
		padding: 60rpx 0rpx;
	}
	
</style>
