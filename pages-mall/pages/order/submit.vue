<template>
	<view class="page">
		<Navbar title="提交订单"></Navbar>
		<!-- 收货地址 -->
		<view class="address">
			<AddressCard v-if="haveAddress" :data="addressInfo"></AddressCard>
			<u-cell-group v-else>
				<u-cell-item @click="go" icon="plus-circle" title="暂无地址，请前往添加"></u-cell-item>
			</u-cell-group>
		</view>
		<!-- 商品列表 -->
		<view class="goods">
			<SubmitGoodsCard v-for="(goods, index) in goodsList" :key="index" :data="goods"
				:showBorderBottom="index !== goodsList.length - 1"></SubmitGoodsCard>
		</view>
		<!-- 优惠信息 -->
		<SubmitDiscounts :currentTotalPrice="currentTotalPrice" :reduction="reduction" :freight="freight"
			:discountSelected="discountSelected" :nowTotalPrice="nowTotalPrice"></SubmitDiscounts>
		<!-- 底部按钮 -->
		<SubmitOperate :nowTotalPrice="nowTotalPrice" :addressInfo="addressInfo" :haveAddress="haveAddress"></SubmitOperate>
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
			},
			haveAddress() {
				// 防止因 undefined or null 而报错
				if(!this.addressInfo) {
					return 0;
				} else {
					return Object.keys(this.addressInfo).length;
				}
			}
		},
		onShow() {
			const that = this;

			// 如果是付款页面返回来 提交订单 页面，则不允许重复提交而跳转
			// console.log("上一路由", uni.getStorageSync("previousRoute"));
			if (uni.getStorageSync("previousRoute") !== "pages-mall/pages/shopping-cart" && uni.getStorageSync(
					"previousRoute") !== "pages-mall/pages/goods/detail") {
				uni.navigateTo({
					url: '/pages/mine-new/index'
				});
				return;
			}

			this.goodsList = getApp().globalData.goodsListSelected; // 商品列表
			console.log("即将提交的订单", this.goodsList);
			this.addressInfo = getApp().globalData.addressList[getApp().globalData.addressIndex]; // 已选择的地址

			// 说明选择了优惠券
			if (getApp().globalData.discountIndex >= 0) {
				this.discountSelected = getApp().globalData.discountsList[getApp().globalData.discountIndex].discount;
				console.log("可减免价格", this.discountSelected);
			}
		},
		methods: {
			handleChangeNowPrice(value) {

			},
			go() {
				uni.navigateTo({
					url: '/pages-mine/pages/address/list?isSelect=true&isBack=true'
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	.page {
		padding-bottom: 140rpx;
	}

	.address {
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
