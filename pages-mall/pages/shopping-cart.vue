<template>
	<view class="page">
		<!-- 自定义头部 -->
		<u-navbar back-icon-name="arrow-leftward" title="购物车">
			<view class="slot-wrap">
				<u-button type="error" shape="circle" size="mini" :ripple="true"
				@click="changeEdit">{{ deleteShow === false ? '编辑' : "完成" }}</u-button>
			</view>
		</u-navbar>

		<!-- 购物车列表 -->
		<view class="cart-list">
			<view class="item" v-for="(goods, index) in goodsList" :key="index">
				<view class="left">
					<u-checkbox shape="circle" active-color="red" icon-size="16" v-model="goods.checked"></u-checkbox>
				</view>
				<view class="right">
					<view class="img">
						<image :src="goods.pics" mode=""></image>
					</view>
					<view class="info">
						<view class="title">{{ goods.title }}</view>
						<view class="sku">{{ goods.sku }}</view>
						<view class="operate">
							<view class="price">
								<text>￥</text>
								<text>{{ goods.price }}</text>
							</view>
							<view class="num">
								<u-number-box v-model="goods.num"></u-number-box>
							</view>
						</view>
					</view>
					<div class="delete" v-show="deleteShow" @click="deleteGood(goods, index)">
						<u-icon name="trash" size="40"></u-icon>
					</div>
				</view>
			</view>
		</view>

		<!-- 推荐商品 -->
		<!-- 		<view class="recommend">
			<view class="title">推荐商品</view>
			<view class="list">
				瀑布流组件
				<u-waterfall ref="goodsWaterFall" v-model="goodsData" marginLeft="7rpx" marginRight="7rpx">
					<template v-slot:left="{ leftList }">
						<CardGoods v-for="(item, index) in leftList" :key="index" :data="item"></CardGoods>
					</template>
					<template v-slot:right="{ rightList }">
						<CardGoods v-for="(item, index) in rightList" :key="index" :data="item"></CardGoods>
					</template>
				</u-waterfall>
			</view>
		</view> -->

		<!-- 底部按钮 -->
		<view class="btn">
			<view class="inner">
				<view class="check">
					<u-checkbox shape="circle" active-color="red" icon-size="16" v-model="checkAllStauts"
						@change="checkAllGoods"></u-checkbox>
					<text>全选</text>
				</view>
				<view class="right">
					<view class="price">
						<text>合计：</text>
						<text>￥</text>
						<text>{{ totalPrice }}</text>
					</view>
					<u-button type="error" @click="goPayResult">去结算({{ goodsList.filter(item => item.checked).length }})
					</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 假数据
	import {
		goodsList
	} from '@/static/test-data.js';
	// 组件
	import CardGoods from '@/pages/mall/components/card.vue';
	export default {
		components: {
			CardGoods
		},
		data() {
			return {
				// totalPrice: 0,
				// checkAllStauts: false,
				goodsList: [],
				deleteShow: false,
				// goodsData: goodsList,
			};
		},
		computed: {
			totalPrice() {
				// 统计总价
				let sum = 0;
				this.goodsList.map(item => (item.checked ? (sum += Number(item.price) * item.num) : null));
				return sum;
			},
			checkAllStauts() {
				let check = true; // 默认全选，有一个没选中就不是全选了
				this.goodsList.map(item => {
					if (!item.checked) {
						check = false;
					}
				});
				return check;
			}
		},
		// 初始化购物车列表
		onShow() {
			const that = this;
			this.$u.api.getUserShoppingcart({
				user_id: uni.getStorageSync("user_id")
			}).then(res => {
				that.goodsList = res;
			})

			getApp().globalData.discountIndex = -1; // 重置已选择的优惠券
		},
		methods: {
			changeEdit() {
				this.deleteShow = !this.deleteShow
			},
			deleteGood(good, index) {
				const that = this;
				
				uni.showModal({
					title: '提示',
					content: '是否删除该商品？',
					confirmColor: this.appThemeColor,
					success: function(res) {
						if (res.confirm) {
							that.$u.api.deleteUserShoppingcart({
								user_id: uni.getStorageSync("user_id"),
								id_pri: good.id_pri
							}).then(res => {
								that.goodsList.splice(index, 1);
							})
				
						}
					}
				});
			},
			checkAllGoods() {
				if (this.checkAllStauts) {
					this.goodsList.forEach(item => (item.checked = false));
				} else {
					this.goodsList.forEach(item => (item.checked = true));
				}
			},
			goPayResult() {
				// 重置想要购买的商品
				const goodsBuyArr = [];
				this.goodsList.map(item => (item.checked ? goodsBuyArr.push(item) : null));
				console.log("新的购物车愿景", goodsBuyArr);
				getApp().globalData.goodsListSelected = goodsBuyArr;

				const pages = getCurrentPages();
				uni.setStorageSync("previousRoute", pages[pages.length - 1].route);
				console.log(pages[pages.length - 1].route);

				uni.navigateTo({
					url: '/pages-mall/pages/order/submit'
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.page {
		background: $app-theme-bg-gray-color;
		padding: 24rpx;
		position: relative;
	}

	/deep/.u-icon {
		display: flex !important;
	}

	.cart-list {
		.item {
			display: flex;
			align-items: center;
			background-color: $app-theme-bg-color;
			padding: 30rpx 24rpx 30rpx 24rpx;
			border-bottom: 1rpx solid $app-theme-border-color;

			.left {
				display: flex;
				align-items: center;
				width: 46rpx;
			}

			.right {
				position: relative;
				width: calc(100% - 46rpx);
				display: flex;
				align-items: center;

				.img {
					width: 160rpx;
					height: 160rpx;
					margin-right: 20rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.info {
					width: 418rpx;

					.title {
						font-size: 28rpx;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;
						color: $app-theme-text-black-color;
						padding-bottom: 16rpx;
						width: 95%;
						
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						-o-text-overflow: ellipsis;
					}

					.sku {
						font-size: 22rpx;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;
						background: $app-theme-bg-gray-color;
						border-radius: 2px;
						color: $app-theme-card-gray-deep-color;
						padding: 4rpx 16rpx;
					}

					.operate {
						padding-top: 30rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.price {
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

						.num {}
					}
				}
			
				.delete {
					position: absolute;
					top: 0;
					right: 0;
				}
				
				.delete:hover {
					cursor: pointer;
				}
			
			}
		}
	}

	.recommend {
		padding-top: 32rpx;
		padding-bottom: 120rpx;

		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
			color: $app-theme-text-black-color;
			padding-bottom: 16rpx;
			height: auto !important;
			
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			-o-text-overflow: ellipsis;
		}

		.list {}
	}

	.btn {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: $app-theme-bg-color;
		min-height: 100rpx;

		.inner {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.check {
				padding-left: 30rpx;
				display: flex;
				align-items: center;

				text {
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: $app-theme-text-black-color;
				}
			}

			.right {
				display: flex;
				align-items: center;
				

				.price {
					margin-right: 54rpx;

					text:nth-child(1) {
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: $app-theme-text-black-color;
					}

					text:nth-child(2) {
						font-size: 24rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: $app-theme-text-money-color;
					}

					text:nth-child(3) {
						font-size: 36rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: $app-theme-text-money-color;
					}
				}

				/deep/button {
					height: 100%;
					line-height: 100rpx;
					border-radius: 0 !important;
				}
			}
		}
	}

	.slot-wrap {
		position: absolute;
		right: 20rpx;
	}
</style>
