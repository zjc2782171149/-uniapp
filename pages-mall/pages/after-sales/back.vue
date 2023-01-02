<template>
	<view class="page">
		<!-- 一般导航栏 -->
		<Navbar title="退款详情"></Navbar>
		<!-- 退款状态 -->
		<BackStatus :data="orderInfo"></BackStatus>
		<!-- 退款信息 -->
		<view class="back-info">
			<view class="item">
				<view class="label">退款金额</view>
				<view class="value">￥{{ orderInfo.payment }}</view>
			</view>
			<view class="item">
				<view class="label">退回至{{ orderInfo.pay_way }}账户</view>
				<view class="value">￥{{ orderInfo.payment }}</view>
			</view>
		</view>
		<!-- 退款节点 -->
		<view class="back-points"><u-steps style="width: 100%;" :list="backDotList" mode="dot" :current="backDotCurrent"></u-steps></view>
		<!-- 退款商品及订单信息 -->
		<view class="back-order-info">
			<TitleOperate title="退款信息" titleSize="30rpx"></TitleOperate>
			<view class="inner">
				<OrderGoodsCard :data="orderInfo" showBorderBottom></OrderGoodsCard>
				<LineInfoOperate :ops="backInfoOps"></LineInfoOperate>
			</view>
		</view>
		<!-- 电话 -->
		<view class="phone">
			<u-icon name="phone-fill" :color="appThemeColor"></u-icon>
			<text>售后电话</text>
		</view>
	</view>
</template>

<script>
import BackStatus from '@/pages-mall/components/after-sales/back-status.vue';
import OrderGoodsCard from '@/pages-mall/components/order/order-goods-card.vue';
import TitleOperate from '@/components/title-operate.vue';
import LineInfoOperate from '@/pages-mall/components/line-info-operate.vue';
export default {
	components: {
		BackStatus,
		OrderGoodsCard,
		TitleOperate,
		LineInfoOperate
	},
	data() {
		return {
			appThemeColor:this.$appTheme.appThemeColor,
			// 订单详情
			orderInfo: {},
			// 退款节点
			backDotCurrent: 0,
			backDotList: [{ name: '买家申请' }, { name: '商家同意' }, { name: '退款成功' }],
			// 退款信息配置项
			backInfoOps: [
				{ label: '退款原因', value: '不喜欢', operate: 'copy' },
				{ label: '退款金额', value: '￥180.00', operate: '' },
				{ label: '申请件数', value: '1', operate: '' },
				{ label: '申请时间', value: '2021-01-11 14:19:56', operate: '' },
				{ label: '退款编号', value: 'Wl0070672207892', operate: '' }
			]
		};
	},
	onLoad() {
		this.orderInfo = uni.getStorageSync('orderInfo');
		
		this.backInfoOps[0].value = this.orderInfo.affterReasonDetail  ? this.orderInfo.affterReason : this.orderInfo.affterReasonDetail;
		this.backInfoOps[1].value = this.orderInfo.payment;
		
		let totalSum = 0;
		this.orderInfo.goods.map(item => {
			totalSum += item.num
		})
		this.backInfoOps[2].value = totalSum;
		
		this.backInfoOps[3].value = this.orderInfo.create_time.slice(0, 10) + " " + this.orderInfo.create_time.slice(11, 19);
		this.backInfoOps[4].value = this.orderInfo.order_id;
		
		this.backDotCurrent = this.orderInfo.isAffter === 0 ? 0 : 2;
	}
};
</script>

<style lang="scss" scoped>
.back-info {
	padding: 0 30rpx;
	background-color: $app-theme-bg-color;
	margin-bottom: 24rpx;
	.item {
		padding-top: 28rpx;
		padding-bottom: 28rpx;
		border-bottom: 1rpx solid $app-theme-border-color;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.label {
			font-size: 30rpx;
			color: $app-theme-text-black-color;
		}
		.value {
			font-size: 30rpx;
			color: $app-theme-text-black-color;
		}
	}
}

.back-points {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 60rpx 30rpx;
	background-color: $app-theme-bg-color;
	margin-bottom: 24rpx;
}

.back-order-info {
	background-color: $app-theme-bg-color;
	.inner {
		padding: 0 30rpx;
	}
}
.phone {
	padding: 30rpx;
	background-color: $app-theme-bg-color;
	text-align: center;
	font-size: 28rpx;
	color: $app-theme-text-gray-color;
	text{
		margin-left: 8rpx;
	}
}
</style>
