<template>
	<u-modal v-model="show" :cancel-text="userInfo.phone === '' ? '完善手机号' : '完善个人信息'" confirm-text="开始使用" confirm-color="rgb(167, 125, 80)"
		title="欢迎来到茶小橘" :show-cancel-button="true" @confirm="confirm" @cancel="toPersonal"
	>
		<view class="u-update-content">
			<rich-text :nodes="content"></rich-text>
		</view>
		<div class="center">
			<text>更多精彩内容等着你来探索！</text>
		</div>
	</u-modal>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				// 传递给uni-app"rich-text"组件的内容，可以使用"<br>"进行换行
				content: `
					茶小橘化橘红茶为一款面向社区电商场景的微信小程序，涵盖商品、订单、用户、社区和积分商城等内容。<br>
					更多精彩内容等着你来探索
					<br>
					
				`,
				userInfo: {}
			}
		},
		onShow() {
			this.show = true;
			this.userInfo = uni.getStorageSync('userInfo');
		},
		methods: {
			confirm() {
				uni.reLaunch({
					url: '/pages/home/index'
				});
			},
			toPersonal() {
				uni.navigateTo({
					url: '/pages-mine/pages/mine'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.u-full-content {
		background-color: #00C777;
	}
	
	.u-update-content {
		font-size: 26rpx;
		color: $u-content-color;
		line-height: 1.7;
		padding: 30rpx;
	}
	
	.center {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 40rpx 0;
		color: $app-theme-light-color;
	}
</style>