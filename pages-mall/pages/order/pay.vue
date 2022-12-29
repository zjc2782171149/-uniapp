<template>
	<view class="page">
		<Navbar title="确认支付"></Navbar>

		<!-- 金额展示 -->
		<view class="money-show">
			<view class="desc">实付金额</view>
			<view class="money">
				<text>￥</text>
				<text>{{ payment }}.00</text>
			</view>
			<view class="time">
				<view class="surplus_time">支付剩余时间</view>
				<u-count-down :timestamp="timestamp" @end="end"></u-count-down>
			</view>
		</view>

		<!-- 支付方式 -->
		<view class="pay-type">
			<view class="title">选择支付方式</view>
			
			<u-radio-group v-model="payType" :wrap="true">
				<view class="item" @click="payType = '微信'">
					<view class="left">
						<view class="logo"><image src="../../static/icon-wx-pay.png" mode=""></image></view>
						<view class="name">微信</view>
					</view>

					<view class="check"><u-radio shape="circle" 
					:active-color="appThemeColor" icon-size="16" name="微信"></u-radio></view>
				</view>
				
				<view class="item" @click="payType = '支付宝'">
					<view class="left">
						<view class="logo"><image src="../../static/icon-ali-pay.png" mode=""></image></view>
						<view class="name">支付宝</view>
					</view>
					<view class="check"><u-radio shape="circle" 
					:active-color="appThemeColor" icon-size="16" name="支付宝"></u-radio></view>
				</view>
			</u-radio-group>
		</view>

		<!-- 支付 -->
		<view class="btn">
			<u-button type="gold" shape="circle" @click="goPayResult">
				<text v-show="payType === '微信'">微信支付</text>
				<text v-show="payType === '支付宝'">支付宝支付</text>
				<text>￥{{ payment }}.00</text>
			</u-button>
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { isExceedTime } from '../../../utils/relativeTime.js';

export default {
	data() {
		return {
			payType: '微信',
			appThemeColor: this.$appTheme.appThemeColor,
			payment: 0,
			timestamp: 900,
			orderInfo: {}
		};
	},
	onShow() {
		this.orderInfo = uni.getStorageSync('orderInfo');
		console.log("要付款的订单信息", this.orderInfo);
		console.log("时间", isExceedTime(this.orderInfo.end_time));
		// 是正值，说明已经超时
		if(isExceedTime(this.orderInfo.end_time) > 0) {
			this.timestamp = 0; // 设置付款倒计时
			this.deleteOrder(this.orderInfo.user_id, this.orderInfo.order_id);
		} else {
			this.timestamp = -isExceedTime(this.orderInfo.end_time); // 设置付款倒计时
		}
		
		// 设置实付金额
		let sum = 0; 
		this.orderInfo.goods.map(item =>{
			sum += item.num * item.price;
		})
		this.payment = sum;
	},
	methods: {
		// 倒计时结束，即订单逾期
		end() {
			this.deleteOrder(this.orderInfo.user_id, this.orderInfo.order_id);
		},
		goPayResult() {
			// 更新订单信息——成已支付
			this.$u.api.updateOrderMes({
				user_id: this.orderInfo.user_id,
				order_id: this.orderInfo.order_id,
				status: 1,
				pay_way: this.payType
			}).then(res => {
				if(res.affectedRows === 1) {
					uni.showToast({
						title: "支付成功",
						icon: "success"
					});
					// 支付成功1s才跳转
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages-mall/pages/order/pay-result?payment=' + this.payment
						});
					}, 1000);

				}

			}).catch(err => {
				uni.showToast({
					title: "支付失败",
					icon: "error"
				})
				console.log("失败原因", err);
			})
			
		},
		// 删除相应订单的消息
		async deleteOrder(user_id, order_id) {
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
					title: "订单因逾期而取消"
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
					title: "订单取消失败",
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
.page {
	background-color: $app-theme-bg-color;
}
.money-show {
	padding: 24rpx 0 48rpx 0;
	.desc {
		width: 100%;
		text-align: center;
		font-size: 24rpx;
		font-family: PingFang-SC-Medium, PingFang-SC;
		font-weight: 500;
		color: #2d2b36;
		margin-bottom: 8rpx;
	}
	.money {
		margin-bottom: 22rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		text:nth-child(1) {
			font-size: 48rpx;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: #2d2b36;
		}
		text:nth-child(2) {
			font-size: 72rpx;
			font-family: DINAlternate-Bold, DINAlternate;
			font-weight: bold;
			color: #2d2b36;
		}
	}
	.time {
		text-align: center;
		font-size: 24rpx;
		font-family: PingFang-SC-Medium, PingFang-SC;
		font-weight: 500;
		color: #2d2b36;
	}
}

.pay-type {
	padding: 0 30rpx;
	margin-top: 80rpx;
	.title {
		font-size: 30rpx;
		font-family: PingFangSCSemibold-, PingFangSCSemibold;
		font-weight: normal;
		color: #2d2b36;
		padding-bottom: 4rpx;
	}
	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 24rpx;
		padding-top: 26rpx;
		border-bottom: 1rpx solid #efefef;
		.left {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			.logo {
				width: 64rpx;
				height: 64rpx;
				margin-right: 30rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.name {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #171717;
			}
		}

		.check {
		}
	}
}

/deep/.u-icon {
	display: flex !important;
}

.btn {
	padding: 0 30rpx;
	position: absolute;
	bottom: 70rpx;
	left: 0;
	width: 100%;
}

.surplus_time {
	display: inline-block;
	margin-right: 20rpx;
}
</style>
