<template>
	<view class="page">
		<!-- 一般导航栏 -->
		<Navbar title="订单详情"></Navbar>
		<!-- 订单状态 -->
		<OrderStatus :type="orderInfo.status" :data="orderInfo"></OrderStatus>
		<!-- 地址 -->
		<view class="address"><AddressCard :data="addressInfo" :isGoSelect="false"></AddressCard></view>
		<!-- 商品列表 -->
		<view class="goods">
			<TitleOperate :title="'共' + goodsList.length + '件商品'" titleSize="30rpx"></TitleOperate>
			<view class="list">
				<SubmitGoodsCard v-for="(goods, index) in goodsList" :key="index" :data="goods" :showBorderBottom="index != goodsList.length - 1"></SubmitGoodsCard>
			</view>
		</view>
		<!-- 订单信息 -->
		<view class="order-info">
			<TitleOperate title="订单信息" titleSize="30rpx"></TitleOperate>
			<view class="inner"><LineInfoOperate :ops="orderInfoOps"></LineInfoOperate></view>
		</view>
		<!-- 操作按钮 -->
		<OrderOperate :data="orderInfo"></OrderOperate>
	</view>
</template>

<script>
import OrderStatus from '@/pages-mall/components/order/order-status.vue';
import AddressCard from '@/pages/mine/components/address-card.vue';
import TitleOperate from '@/components/title-operate.vue';
import SubmitGoodsCard from '@/pages-mall/components/order/submit-goods-card.vue';
import LineInfoOperate from '@/pages-mall/components/line-info-operate.vue';
import OrderOperate from '@/pages-mall/components/order/order-operate.vue';
export default {
	components: {
		OrderStatus,
		AddressCard,
		SubmitGoodsCard,
		TitleOperate,
		LineInfoOperate,
		OrderOperate
	},
	data() {
		return {
			// 订单信息
			orderInfo: {},
			// 地址信息
			addressInfo: {},
			// 商品列表
			goodsList: [],
			// 订单信息配置项
			orderInfoOps: [
				{ label: '订单编号', value: null, operate: 'copy' },
				{ label: '下单时间', value: null, operate: '' },
				{ label: '订单类型', value: null, operate: '' },
				{ label: '支付状态', value: null, operate: '' },
				{ label: '支付方式', value: null, operate: '' }
			]
		};
	},
	onLoad(ops) {
		this.orderInfo = uni.getStorageSync('orderInfo');
		
		this.orderInfoOps = [
			{ label: '订单编号', value: this.orderInfo.order_id, operate: 'copy' },
			{ label: '下单时间', value: this.orderInfo.create_time.slice(0, 10) + " " + this.orderInfo.create_time.slice(11, 19), operate: '' },
			{ label: '订单类型', value: this.orderInfo.order_type == '1' ? '普通订单' : '其他订单', operate: '' },
			{ label: '支付状态', value: this.orderInfo.status === 0 ? '未支付' : '支付完成', operate: '' },
			{ label: '支付方式', value: this.orderInfo.pay_way + "支付", operate: '' }
		];
		
		this.addressInfo = { ...this.orderInfo }; // 已选择的地址
		this.goodsList = this.orderInfo.goods;
		console.log("订单信息", this.orderInfo);
		
	}
};
</script>

<style lang="scss" scoped>
.page {
	padding-bottom: 120rpx;
}
.address {
	margin-bottom: 24rpx;
	padding: 0 30rpx;
	background-color: $app-theme-bg-color;
}
.goods,
.order-info {
	margin-bottom: 24rpx;
	background-color: $app-theme-bg-color;
	.list,
	.inner {
		padding: 0 30rpx;
	}
}
</style>
