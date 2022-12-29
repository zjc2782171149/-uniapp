<template>
	<view class="page">
		<Navbar title="提交订单"></Navbar>
		<!-- 收货地址 -->
		<view class="address">
			<AddressCard :data="addressInfo"></AddressCard>
		</view>
		<!-- 商品列表 -->
		<view class="goods">
			<SubmitGoodsCard v-for="(goods, index) in goodsList" :key="index" :data="goods" :showBorderBottom="index != goodsList.length - 1"></SubmitGoodsCard>
		</view>
		<!-- 优惠信息 -->
		<SubmitDiscounts :currentTotalPrice="currentTotalPrice" :reduction="reduction" :freight="freight" :discountSelected="discountSelected"
		 :nowTotalPrice="nowTotalPrice"></SubmitDiscounts>
		<!-- 底部按钮 -->
		<SubmitOperate :nowTotalPrice="nowTotalPrice" :addressInfo="addressInfo"
		></SubmitOperate>
	</view>
</template>

<script>
import SubmitDiscounts from '@/pages-mall/components/order/submit-discounts.vue';
import SubmitGoodsCard from '@/pages-mall/components/order/submit-goods-card.vue';
import SubmitOperate from '@/pages-mall/components/order/submit-operate.vue';
import AddressCard from '@/pages/mine/components/address-card.vue';
export default {
	components: {
		AddressCard,
		SubmitDiscounts,
		SubmitGoodsCard,
		SubmitOperate
	},
	data() {
		return {
			addressInfo: {}, // 已选择的地址信息
			goodsList: [], // 要购买的商品列表
			discountSelected: 0, // 优惠券信息
			reduction: 0, // 减价
			freight: 0 // 运费
		};
	},
	computed: {
		currentTotalPrice() {
			// 统计原总价
			let sum = 0;
			this.goodsList.map(item => {
				sum += Number(item.price) * item.num;
			});
			return sum;
		},
		nowTotalPrice() {
			return this.currentTotalPrice + this.freight - this.reduction - this.discountSelected;
		}
	},
	onShow() {
		this.goodsList = getApp().globalData.goodsListSelected; // 商品列表
		this.addressInfo = getApp().globalData.addressList[getApp().globalData.addressIndex]; // 已选择的地址
		
		// 说明选择了优惠券
		if(getApp().globalData.discountIndex >= 0) {
			this.discountSelected = getApp().globalData.discountsList[getApp().globalData.discountIndex].discounts;
			console.log("可减免价格", this.discountSelected);
		}
	},
	methods: {
		handleChangeNowPrice(value) {

		}
	}
};
</script>
<style lang="scss" scoped>
.page {
	padding-bottom: 140rpx;
}
.address{
	margin-top: 24rpx;
	padding: 0 30rpx;
	background-color: $app-theme-bg-color;
}
.goods {
	margin-top: 24rpx;
	background-color: $app-theme-bg-color;
	padding: 0 30rpx;
}
</style>
