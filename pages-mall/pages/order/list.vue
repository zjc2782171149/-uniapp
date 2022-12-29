<template>
	<view class="page" style="padding-top: 0vh;">
		<view>
			<u-navbar back-text="返回" title="我的订单" :background="{ backgroundColor: 'rgb(221, 195, 135)' }">
			</u-navbar>
		</view>


		<view class="search-slot">
			<u-search placeholder="搜索全部订单" :showAction="false" shape="square" borderRadius="0rpx" bg-color="#F4F5F8">
			</u-search>
		</view>

		<div class="tabs">
			<u-tabs :list="tabOps" :is-scroll="false" :current="tabIndex" @change="change" bar-height="12"
				bar-width="80" active-color="#dabd7b" gutter="10" inactive-color="grey" fontSize="30" letterSpacing="7">
			</u-tabs>
		</div>


		<!-- 列表 -->
		<view class="list">
			<OrderCard v-for="(item, index) in showList" :key="index" :data="item" @updateOrderList="getOrderList(1)"></OrderCard>
			<NoData height="60vh" type="order" v-if="showList.length === 0"></NoData>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	// 组件
	import OrderCard from '@/pages-mall/components/order/order-card.vue';

	export default {
		components: {
			OrderCard
		},
		data() {
			return {
				orderList: [],
				showList: [],
				// 当前tab
				tabIndex: 0,
				tabOps: [{
						name: '待付款',
						value: 0
					},
					{
						name: '待发货',
						value: 1
					},
					{
						name: '待收货',
						value: 2
					},
					{
						name: '待评价',
						value: 3
					},
					{
						name: '退款',
						value: 4
					}
				],
			};
		},
		onLoad(ops) {
			this.getOrderList(0);
			
		},
		onShow() {

		},
		methods: {
			// 切换tab
			change(index) {
				this.tabIndex = index;
				const tab = this.tabOps[index];
				let arr = [];
				this.orderList.map(item => {
					// 是该tab状态的订单才加入数组
					if (item.status === tab.value) {
						arr.push(item);
					}
				})
				this.showList = arr;
			},

			// 初始化订单列表
			async getOrderList(selectTabIndex) {
				let orderList = [];
				// orderListDetail = [];
				const that = this;

				// 获取我的订单列表
				const res1 = await this.$u.api.getOrderList({
					user_id: 1
				});
				res1.map(item => {
					orderList.push({
						order_id: item.order_id
					})
				})

				// 根据订单id去获取订单的地址信息
				let task1 = orderList.map(item => {
					return that.getOrderAddress(item).then();
				});
				task1 = await Promise.all(task1);
				task1 = task1.map(item => item[0]);
				orderList.map((item, index) => {
					orderList[index] = {
						...orderList[index],
						...task1[index]
					}
				})
				// console.log(orderList);


				// 根据订单id去获取订单的基本信息
				task1 = orderList.map(item => {
					return that.getOrderMes(item).then();
				});
				task1 = await Promise.all(task1);
				task1 = task1.map(item => item[0]);
				orderList.map((item, index) => {
					orderList[index] = {
						...orderList[index],
						...task1[index],
						create_time: getApp().globalData.getNowTime(dayjs(task1[index].create_time).format()),
						end_time: getApp().globalData.getNowTime(dayjs(task1[index].end_time).format())
					}
				})
				// console.log(orderList);


				// 根据订单id去获取订单所购买的物品信息
				task1 = orderList.map(item => {
					return that.getOrderGoodsList(item).then();
				});
				task1 = await Promise.all(task1);
				orderList.map((item, index) => {
					orderList[index] = {
						...orderList[index],
						goods: task1[index]
					}
				})
				console.log(orderList);

				this.orderList = orderList;

				this.change(selectTabIndex);

			},
			// 根据订单id去获取订单的地址信息
			getOrderAddress(item) {
				return this.$u.api.getOrderAddress({
					user_id: 1,
					order_id: item.order_id
				});
			},
			// 根据订单id去获取订单的基本信息
			async getOrderMes(item) {
				return this.$u.api.getOrderMes({
					user_id: 1,
					order_id: item.order_id
				});
			},
			// 根据订单id去获取订单的基本信息
			async getOrderGoodsList(item) {
				return this.$u.api.getOrderGoodsList({
					user_id: 1,
					order_id: item.order_id
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	.list {
		margin-top: 30rpx;
		padding: 0 30rpx;
	}

	.navbar {
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 899;
		overflow: hidden;
	}

	.inner {
		width: 100%;
		height: 100%;
		background-color: $app-theme-bg-color;
	}

	.navbar-slot {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.navbar-title {
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: $app-theme-text-black-color;
		}
	}

	.tab-slot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 20rpx;

		.tab {
			font-size: 26rpx;
			font-weight: 400;
			color: $app-theme-navbar-tab-color;

			&.active {
				color: $app-theme-navbar-tab-color-active;
				position: relative;

				&::before {
					content: '';
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 20rpx;
					height: 4rpx;
					background: $app-theme-navbar-tab-color-active;
					border-radius: 2rpx;
				}
			}
		}
	}

	.search-slot {
		margin: 20rpx 0;
	}
</style>
