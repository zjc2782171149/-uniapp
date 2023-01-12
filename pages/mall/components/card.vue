<template>
	<view class="slot"
		@click="$u.route({ url: '/pages-mall/pages/goods/detail', params: { id: data.good_id } })">
		<view class="pic">
			<u-image mode="widthFix" :src="data.pics"></u-image>
		</view>
		<view class="inner">
			<view class="title">{{ data.title }}</view>
			<view class="info">
				<div class="num">
					
					<view class="money">
						<view class="now">
							<text>￥</text>
							<text>{{ data.price }}</text>
						</view>
						<!-- 					<view class="old" v-if="showOldMoney">
						<text>￥{{ data.oldMoney }}</text>
					</view> -->
					</view>

					<view class="sale">
						<view>{{ data.sales }}+人付款</view>
						<!-- <text>{{ $replaceSale(data.num) }}+人付款</text> -->
					</view>
				</div>

				<view class="rank">
					<text>{{ data.sales >= 1000 ? '月销上千' : '好物推荐' }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 数据源
			data: {
				type: Object,
				default: () => {
					return {};
				}
			},
			// 是否显示原价
			showOldMoney: {
				type: Boolean,
				default: false
			}
		}
	};
</script>

<style lang="scss" scoped>
	.slot {
		display: inline-block;
		background-color: $app-theme-bg-color;
		overflow: hidden;
		margin-bottom: 30rpx;
		border: 1px solid rgb(255, 255, 255);
		box-shadow: 0px 10px 30px 10px rgba(0, 0, 0, 0.1);
		border-radius: 15rpx;

		.pic {
			overflow: hidden;
			width: 100%;
			background-color: $app-theme-bg-color;
		}

		.inner {
			padding: 10rpx 5rpx 15rpx 10rpx;
		}

		.title {
			width: 100%;
			word-break: break-all;
			white-space: pre-wrap;
			font-weight: 400;
			font-size: 28rpx;
			color: $app-theme-text-black-color;
			margin-bottom: 12rpx;
			// 默认单行，如果需要瀑布流则改成多行
			display: -webkit-box;
			overflow: hidden;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.info {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;

			.num {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				
				.money {
					width: 210rpx;

					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;

					.now {

						text:nth-child(1) {
							font-size: 25rpx;
							color: $app-theme-text-money-color;
						}

						text:nth-child(2) {
							font-size: 32rpx;
							color: $app-theme-text-money-color;
						}
					}
				}

				.sale {
					width: 200rpx;
					font-size: 22rpx;
					color: $app-theme-card-gray-color;
					margin-left: 5rpx;

					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}


			.rank {
				font-size: 12;
				font-weight: 500;
				font-family: "Malgun Gothic";
				color: rgb(179, 143, 106);
				transform: scale(0.8);
				// margin-top: -20rpx;
			}
		}
	}
</style>
