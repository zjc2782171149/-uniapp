<template>
	<view class="slot">
		<view class="line">
			<view class="labe">商品金额</view>
			<view class="value">
				<text>￥</text>
				<text>{{ currentTotalPrice }}</text>
			</view>
		</view>
		
		
		
		<view class="line">
			
			<view class="labe">运费</view>
			<view class="value"  v-if="freight === 0">
				<text>￥</text>
				<text>0.00</text>
			</view>
			
			<view class="value money" v-if="freight !== 0">
				<text>+</text>
				<text>￥</text>
				<text>{{ freight }}.00</text>
			</view>
			
		</view>
		
		
		<view class="line">
			<view class="labe">立减</view>
			
			<view class="value" v-if="reduction === 0">
				<text>￥</text>
				<text>0.00</text>
			</view>
			
			<view class="value money" v-if="reduction !== 0">
				<text>-</text>
				<text>￥</text>
				<text>{{ reduction }}.00</text>
			</view>
			
		</view>
		
		
		
		<view class="line">
			<view class="labe">优惠券</view>
			<view class="value gray" @click="goDiscountsPage">
				
				<text v-if="discountSelected === 0">无可用</text>
				
				<view class="value money" v-if="discountSelected !== 0">
					<text>-</text>
					<text>￥</text>
					<text>{{ discountSelected }}.00</text>
				</view>
				
				<view class="more"><u-icon size="20" name="arrow-right"></u-icon></view>
			</view>
		</view>
		<view class="total">
			<text>合计：</text>
			<text>￥</text>
			<text>{{ nowTotalPrice }}</text>
		</view>
	</view>
</template>

<script>
export default {
	props:{
		currentTotalPrice:{
			type: Number,
			default: 0
		},
		discountSelected:{
			type: Number,
			default: 0
		},
		reduction:{
			type: Number,
			default: 0
		},
		freight:{
			type: Number,
			default: 0
		},
		nowTotalPrice:{
			type: Number,
			default: 0
		},
	},
	data() {
		return {

		};
	},
	computed: {

	},
	methods: {
		goDiscountsPage() {
			uni.navigateTo({
				url: '/pages-mine/pages/discounts?payment=' + this.currentTotalPrice
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.slot {
	padding: 30rpx 30rpx 0 30rpx;
	background-color: $app-theme-bg-color;
	margin-top: 24rpx;
}
.line {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
	.label {
		font-size: 28rpx;
		color: $app-theme-text-black-color;
	}
	.value {
		padding-right: 24rpx;
		font-size: 28rpx;
		color: $app-theme-text-black-color;
		&.money {
			color: $app-theme-text-money-color;
		}
		&.gray {
			color: $app-theme-card-gray-color;
			position: relative;
			.more {
				position: absolute;
				right: -16rpx;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
}
.total {
	border-top: 1rpx solid $app-theme-border-color;
	padding: 26rpx 0;
	text-align: right;
	text:nth-child(1) {
		font-size: 28rpx;
		color: $app-theme-text-black-color;
	}
	text:nth-child(2) {
		font-size: 20rpx;
		color: $app-theme-text-money-color;
	}
	text:nth-child(3) {
		font-size: 28rpx;
		color: $app-theme-text-money-color;
	}
}
</style>
