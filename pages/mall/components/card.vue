<template>
	<view class="slot"
		@click="$u.route({ url: '/pages-mall/pages/goods/detail', params: { id: data.id, goodsType: 'normal' } })">
		<view class="pic">
			<u-image mode="widthFix" :src="data.img"></u-image>
		</view>
		<view class="inner">
			<view class="title">{{ data.title }}</view>
			<view class="info">
				<view class="money">
					<view class="now">
						<text>￥</text>
						<text>{{ data.money }}</text>
					</view>
					<!-- 					<view class="old" v-if="showOldMoney">
						<text>￥{{ data.oldMoney }}</text>
					</view> -->
				</view>

				<view class="sale">
					<view>{{ data.num }}+人付款</view>
					<!-- <text>{{ $replaceSale(data.num) }}+人付款</text> -->
				</view>

				<view class="rank">
					<text>月销上千</text>
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

			.money {
				.now {
					margin-right: -40rpx;
					
					text:nth-child(1) {
						font-size: 20rpx;
						color: $app-theme-text-money-color;
					}

					text:nth-child(2) {
						font-size: 28rpx;
						color: $app-theme-text-money-color;
					}
				}
			}

			.sale {
				display: inline-block;
				font-size: 12rpx;
				color: $app-theme-card-gray-color;
				// text-decoration-line: line-through;
				transform: scale(0.7);
				margin-right: -50rpx;
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
