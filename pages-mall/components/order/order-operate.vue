<template>
	<view class="slot">
		<view class="inner">
			<view class="price">
				<text>￥</text>
				<text>{{ data.payment }}</text>
			</view>
			<view class="right">
				<u-button shape="circle" size="small" type="error" @click="goPay" v-if="data.status == '0'">立即付款
				</u-button>
				<u-button type="default" size="small" shape="circle" @click="showRemindAgain()"
					v-if="data.status == '1' && data.isRemind === 1">提醒发货</u-button>
				<u-button type="gold" size="small" shape="circle" @click="pushDeliveryNow()"
					v-if="data.status == '1' && data.isRemind === 0">提醒发货</u-button>
				<u-button shape="circle" size="small" type="error" @click="confirmReceiptNow" v-if="data.status == '2'">
					确认收货</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		orderOperate
	} from '@/pages-mall/mixins/order-operate.js';
	export default {
		// 工单操作方法混入
		mixins: [orderOperate],
		props: {
			// 数据源
			data: {
				type: Object,
				default: () => {
					return {};
				}
			}
		},
		computed: {

		},
		data() {
			return {

			}
		},

		methods: {
			// 确认收货
			confirmReceiptNow() {
				const that = this;
			
				uni.showModal({
					title: '提示',
					content: '是否确认收货？',
					confirmColor: this.appThemeColor,
					success: function(res) {
						if (res.confirm) {
							// TODO 接口
							console.log(that.data);
							// 更新订单信息——成已支付
							that.$u.api.updateOrderReceive({
								user_id: that.data.user_id,
								order_id: that.data.order_id,
								status: 3
							}).then(res => {
								if(res.affectedRows === 1) {
									uni.showToast({
										title: "收货成功",
										icon: "success"
									});
									
									setTimeout(() => {
										uni.navigateTo({
											url: "/pages-mall/pages/order/list"
										})
									}, 1000);
							
								}
							
							}).catch(err => {
								uni.showToast({
									title: "确认失败，请稍后再试",
									icon: "error"
								})
								console.log("收货失败原因", err);
							})
						}
					}
				});
			},
			// 提醒发货
			pushDeliveryNow() {
				const that = this;

				uni.showModal({
					title: '提示',
					content: '是否对当前订单提醒发货？',
					confirmColor: this.appThemeColor,
					success: function(res) {
						if (res.confirm) {
							that.$u.api.updateOrderRemind({
								user_id: that.data.user_id,
								order_id: that.data.order_id,
								isRemind: 1,

							}).then(res => {
								uni.showToast({
									title: "提醒发货成功",
									icon: "success"
								})

								setTimeout(() => {
									uni.navigateTo({
										url: "/pages-mall/pages/order/list"
									})
								}, 1000);


							}).catch(err => {
								uni.showToast({
									title: "查找优惠券失败"
								})
							})
						}
					}
				});
			},
			// 再次点击提醒发货的警告
			showRemindAgain() {
				uni.showToast({
					title: "您已提醒，无需再次提醒",
					icon: "none"
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
	.slot {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: $app-theme-bg-color;
		min-height: 100rpx;
		box-shadow: $app-theme-shadow;
		border-top: 1px solid $app-theme-border-color;
		padding: 10rpx 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.inner {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100%;

			.price {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding-left: 30rpx;

				text:nth-child(1) {
					font-size: 24rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: $app-theme-text-money-color;
				}

				text:nth-child(2) {
					font-size: 36rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: $app-theme-text-money-color;
				}
			}

			.right {
				display: flex;
				align-items: center;
				margin-top: 10rpx;
				padding-right: 30rpx;
			}
		}
	}
</style>
