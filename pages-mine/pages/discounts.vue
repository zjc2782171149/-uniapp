<template>
	<view class="page">
		<Navbar title="优惠卷"></Navbar>
		<view class="list">
			<view class="item" v-for="(item, index) in discountsList" :key="item.coupon_id" @click="changeDiscount(item, index)">
				<view class="left">
					<view class="discount">
						<text>￥</text>
						<text>{{ item.discount }}</text>
					</view>
					<view class="standard">满{{ item.threshold }}可用</view>
				</view>
				<view class="right">
					<view class="title">{{ item.coupon_name }}</view>
					<view class="date">有效期至 {{ item.endDate }}</view>
				</view>
				<view class="select" v-if="selectIndex == index"></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectIndex: 0,
			discountsList: []
		};
	},
	onShow() {
		this.selectIndex = getApp().globalData.discountIndex;
		
		const that = this;
		this.$u.api.getCouponList({
			user_id: uni.getStorageSync("user_id")
		}).then(res => {
			that.discountsList = res;
			getApp().globalData.discountsList = res;
			
		}).catch(err => {
			uni.showToast({
				title: "查找优惠券失败"
			})
		})
	},
	methods: {
		changeDiscount(item, index) {
			this.selectIndex = index;
			getApp().globalData.discountIndex = index;
			console.log(getApp().globalData.discountIndex);
			// 选择完后自动返回付款页面
			uni.navigateBack({
				delta: 1,
				animationDuration: 500
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.list {
	margin: 30rpx;
	.item {
		width: 100%;
		height: 174rpx;
		background-image: url('@/pages-mine/static/discounts-bg.png');
		background-size: cover;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
		padding-bottom: 34rpx;
		position: relative;

		.left {
			margin-right: 60rpx;
			margin-left: 50rpx;
			.discount {
				text:nth-child(1) {
					font-size: 22rpx;
					color: $app-theme-text-money-color;
				}
				text:nth-child(2) {
					font-size: 64rpx;
					color: $app-theme-text-money-color;
				}
			}
			.standard {
				font-size: 20rpx;
				color: $app-theme-card-gray-color;
			}
		}
		.right {
			.title {
				font-size: 32rpx;
				color: $app-theme-text-black-color;
				margin-bottom: 32rpx;
			}
			.date {
				font-size: 20rpx;
				color: $app-theme-card-gray-color;
			}
		}

		.select {
			height: 60rpx;
			width: 60rpx;
			background-image: url('@/pages-mine/static/discounts-select.png');
			background-size: cover;
			position: absolute;
			top: 4rpx;
			right: 4rpx;
			z-index: $app-zIndex-absolute;
		}
	}
}
</style>
