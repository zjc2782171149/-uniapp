<template>
	<view class="slot">
		<view class="status">
			<text v-if="type == '0'">等待买家付款</text>
			<text v-if="type == '1'">等待卖家发货</text>
			<text v-if="type == '2'">运输中</text>
			
			<text v-if="type == '3' && data.isEvaluate === 0">待评价</text>
			<text v-if="type == '3' && data.isEvaluate === 1">已评价</text>
			
			<text v-if="type == '4'">退款售后</text>
			<text v-if="type == '5'">已完成</text>
		</view>
		<view class="desc">
			<text v-if="type == '0'">请在{{ data.end_time.slice(0, 10) + " " + data.end_time.slice(11, 19) }} 前完成支付</text>
			<text v-if="type == '1'">预计发货日期：{{ freight_time + ' '}}前</text>
			<text v-if="type == '2'">快件由 [{{ data.from }}] 发往 [{{ data.city + data.area + data.street }}]</text>
			
			<text v-if="type == '3' && data.isEvaluate === 0">您的订单还未评价</text>
			<text v-if="type == '3' && data.isEvaluate === 1">您的订单已评价</text>
			
			<text v-if="type == '4' && data.isAffter === 0">当前订单商家正在处理售后</text>
			<text v-if="type == '4' && data.isAffter === 1">当前订单商家已同意退款</text>
			<text v-if="type == '5'">当前订单已完成</text>
		</view>
		<view class="operate">
			<u-button size="mini" plain shape="circle" type="white" v-if="type == '2'" @click="goExpress()">查看物流</u-button>
			
			<u-button size="mini" plain shape="circle" type="white" v-if="type == '3' && data.isEvaluate === 0" @click="goEvaluate()">去评价</u-button>
			<u-button size="mini" plain shape="circle" type="white" v-if="type == '3' && data.isEvaluate === 1">已评价</u-button>
			
			<u-button size="mini" plain shape="circle" type="white" v-if="type == '4'" @click="goBackMoney()">查看退款详情</u-button>
			<u-button size="mini" plain shape="circle" type="white" v-if="type == '5'" @click="applyAfterSales()">申请售后</u-button>
		</view>
	</view>
</template>

<script>
import { orderOperate } from '@/pages-mall/mixins/order-operate.js';

export default {
	name: 'order-status',
	// 工单操作方法混入
	mixins: [orderOperate],
	props: {
		// 数据源
		data: {
			type: Object,
			default: () => {
				return {};
			}
		},
		// 类型
		type: {
			type: [String, Number],
			default: '0'
		},
		// 预计发货日期
		freight_time: {
			type: String,
			default: ''
		}
		// 付款截止日期
		// endDate: {
		// 	type: String,
		// 	default: '2022-01-11 14:19:56'
		// },
		// // 预计发货日期
		// expressDate: {
		// 	type: String,
		// 	default: '2022-01-11 14:19:56'
		// },
		// // 快递节点
		// expressAddressStart: {
		// 	type: String,
		// 	default: '广东中山转运中心'
		// },
		// expressAddressEnd: {
		// 	type: String,
		// 	default: '山东青岛转运中心'
		// }
	},
	data() {
		return {

		};
	}
};
</script>

<style lang="scss" scoped>
.slot {
	position: relative;
	padding: 30rpx;
	background-color: $app-theme-color;
	color: $app-theme-text-white-color;
	margin-bottom: 24rpx;
	.status {
		margin-bottom: 20rpx;
		font-size: 30rpx;
	}
	.desc {
		font-size: 26rpx;
	}
	.operate {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
	}
}
</style>
