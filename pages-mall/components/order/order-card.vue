<template>
	<view class="slot" @click.stop="goOrderInfo">
		<!-- 商品卡片 -->
		<OrderGoodsCard :data="data" showBorderBottom>
			<view class="status-slot">
				<text v-if="data.status == 0">待付款</text>
				<text v-if="data.status == 1">待发货</text>
				<text v-if="data.status == 2">待收货</text>
				<text v-if="data.status == 3">待评价</text>
				<text v-if="data.status == 4 && data.isAffter === 0">退款中</text>
				<text v-if="data.status == 4 && data.isAffter === 1">已完成退款</text>
				<text v-if="data.status == 5">已完成</text>
			</view>
		</OrderGoodsCard>
		<!-- 待付款 -->
		<view class="operate" v-if="data.status == 0">
			<u-button type="default" style="margin-right: 24rpx;" size="small" shape="circle" @click="cancelOrderNow()">取消订单</u-button>
			<u-button type="gold" size="small" shape="circle" @click="goPay()" >去付款</u-button>
		</view>
		<!-- 待发货 -->
		<view class="operate" v-if="data.status == 1">
			<u-button type="default" size="small" shape="circle" @click="showRemindAgain('提醒')" v-if="data.isRemind === 1">提醒发货</u-button>
			<u-button type="gold" size="small" shape="circle" @click="pushDeliveryNow()" v-if="data.isRemind === 0">提醒发货</u-button>
		</view>
		<!-- 待收货 -->
		<view class="operate" v-if="data.status == 2">
			<u-button type="default" style="margin-right: 24rpx;" size="small" shape="circle" @click="applyAfterSales()">申请售后</u-button>
			<u-button type="gold" size="small" shape="circle" @click="confirmReceiptNow()">确认收货</u-button>
		</view>
		<!-- 待评价 -->
		<view class="operate" v-if="data.status == 3">
			<u-button type="default" style="margin-right: 24rpx;" size="small" shape="circle" @click="deleteOrderNow()">删除记录</u-button>
			<u-button type="default" style="margin-right: 24rpx;" size="small" shape="circle" @click="applyAfterSales()">申请售后</u-button>
			<u-button type="default" size="small" shape="circle" @click="showRemindAgain('评价')" v-if="data.isEvaluate === 1">去评价</u-button>
			<u-button type="gold" size="small" shape="circle" @click="goEvaluate()" v-if="data.isEvaluate === 0">去评价</u-button>
		</view>
		<!-- 待评价 -->
		<view class="operate" v-if="data.status == 4">
			<u-button type="default" style="margin-right: 24rpx;" size="small" shape="circle" @click="deleteOrderNow()">删除记录</u-button>
			<u-button type="gold" size="small" shape="circle" @click="goOrderInfo()">查看详情</u-button>
		</view>
		<!-- 已完成 -->
		<view class="operate" v-if="data.status == 5">
			<u-button type="default" style="margin-right: 24rpx;" size="small" shape="circle" @click="deleteOrderNow()">删除记录</u-button>
			<u-button type="gold" size="small" shape="circle" @click="goOrderInfo()">查看详情</u-button>
		</view>
	</view>
</template>

<script>
import { orderOperate } from '@/pages-mall/mixins/order-operate.js';
import OrderGoodsCard from '@/pages-mall/components/order/order-goods-card.vue';
export default {
	name: 'order-card',
	// 工单操作方法混入
	mixins: [orderOperate],
	components: {
		OrderGoodsCard
	},
	props: {
		// 数据源
		data: {
			type: Object,
			default: () => {
				return {};
			}
		},
		this: {
			type: Object,
			default: () => {
				return {};
			}
		},
	},
	data() {
		return {

		};
	},
	methods: {
		// 删除记录
		deleteOrderNow() {
			const that = this;
			
			uni.showModal({
				title: '提示',
				content: '是否删除当前订单？',
				confirmColor: this.appThemeColor,
				success: function(res) {
					if (res.confirm) {
						// TODO 接口
						that.deleteOrder(that.data.user_id, that.data.order_id, "删除");
					}
				}
			});
		},
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
								
								that.$emit("updateOrderList", 2);
						
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
		// 取消订单
		cancelOrderNow() {
			const that = this;
			uni.showModal({
				title: '提示',
				content: '是否取消当前订单？',
				confirmColor: this.appThemeColor,
				success: function(res) {
					if (res.confirm) {
						that.deleteOrder(that.data.user_id, that.data.order_id, "取消");
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
							
							that.$emit("updateOrderList", 1);
							
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
		showRemindAgain(text) {
			uni.showToast({
				title: `您已${text}，无需再次${text}`,
				icon: "none"
			})
		},
		// 删除相应订单的消息
		async deleteOrder(user_id, order_id, text) {
			// 删除订单
			let task1 = await this.deleteOrderList({
				user_id: user_id,
				order_id: order_id
			});
			
			// 删除订单信息——购买地址
			let task2 = await this.deleteOrderAddress({
				user_id: user_id,
				order_id: order_id
			});
			
			// 删除订单信息——订单基本信息
			let task3 = await this.deleteOrderMes({
				user_id: user_id,
				order_id: order_id
			});
			
			// 删除订单信息——购买物品清单
			let task4 = await this.deleteOrderGoodsList({
				user_id: user_id,
				order_id: order_id
			});
			
			Promise.all([task1, task2, task3, task4]).then(res => {
				uni.showToast({
					title: `订单${text}成功`
				})
				uni.setStorageSync('orderInfo', null);
				// 提交订单成功2s才跳转
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages-mall/pages/order/list'
					});
				}, 2000);
			}).catch(err =>{
				uni.showToast({
					title: `订单${text}失败`,
					icon: "error"
				})
				console.log("失败原因", err);
			})
		},
		// 删除该用户订单
		deleteOrderList(req) {
			return this.$u.api.deleteOrderList({
				user_id: req.user_id,
				order_id: req.order_id
			});
		},
		// 删除该用户的 相关订单的地址信息 
		deleteOrderAddress(req) {
			return this.$u.api.deleteOrderAddress({
				user_id: req.user_id,
				order_id: req.order_id
			});
		},
		// 删除该用户的 相关订单的基本信息
		deleteOrderMes(req) {
			return this.$u.api.deleteOrderMes({
				user_id: req.user_id,
				order_id: req.order_id
			});
		},
		// 删除订单id去获取订单的地址信息
		deleteOrderGoodsList(req) {
			return this.$u.api.deleteOrderGoodsList({
				user_id: req.user_id,
				order_id: req.order_id
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.slot {
	background-color: $app-theme-bg-color;
	border-radius: 16rpx;
	box-shadow: $app-theme-shadow;
	padding: 30rpx;
	margin-bottom: 30rpx;
	.goods {
		display: flex;
		align-items: center;
		align-content: space-between;
		padding-bottom: 26rpx;
		border-bottom: 1rpx solid $app-theme-border-color;
		margin-bottom: 32rpx;
		.pic {
			margin-right: 24rpx;
		}
		.info {
			width: 280rpx;
			margin-right: 20rpx;
			.title {
				width: 100%;
				display: -webkit-box;
				overflow: hidden;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				font-size: 28rpx;
				font-weight: 400;
				color: $app-theme-text-black-color;
				margin-bottom: 14rpx;
			}
			.desc {
				display: flex;
				justify-content: flex-start;
				align-items: flex-end;
				margin-bottom: 18rpx;
				.item {
					margin-right: 24rpx;
					text:nth-child(1) {
						font-size: 24rpx;
						color: $app-theme-card-gray-color;
						margin-right: 8rpx;
					}
					text:nth-child(2) {
						font-size: 24rpx;
						color: $app-theme-card-gray-deep-color;
					}
				}
			}
			.price {
				text:nth-child(1) {
					font-size: 16rpx;
					color: $app-theme-text-black-color;
				}
				text:nth-child(2) {
					font-size: 28rpx;
					color: $app-theme-text-black-color;
				}
			}
		}
		.status {
			width: 120rpx;
			.status-label {
				width: 100%;
				text-align: right;
				font-size: 28rpx;
				color: $app-theme-color;
				margin-bottom: 100rpx;
			}
			.num {
				width: 100%;
				text-align: right;
				text:nth-child(1) {
					font-size: 24rpx;
					color: $app-theme-text-gray-white-color;
					vertical-align: bottom;
				}
				text:nth-child(2) {
					font-size: 28rpx;
					color: $app-theme-text-gray-white-color;
					vertical-align: bottom;
				}
			}
		}
	}
}
.operate {
	display: flex;
	justify-content: flex-end;
}
</style>
