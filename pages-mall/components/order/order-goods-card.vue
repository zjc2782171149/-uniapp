<template>
	<view class="container">
		<view class="slot" :class="{ showBorderBottom }" v-for="(item, index) in data.goods" :key="index">
			<view class="pic">
				<u-image width="180rpx" height="180rpx" :src="item.pics"></u-image>
			</view>
			<view class="info">
				<view class="title">{{ item.title }}</view>
				<view class="desc">
					<view class="sku item">
						<text>规格</text>
						<text>{{ item.sku }}</text>
					</view>
					<!-- 		<view class="express item">
					<text>运费</text>
					<text>{{ item.express || '包邮' }}</text>
				</view> -->
				</view>
				<view class="price">
					<text>￥</text>
					<text>{{ item.price }}</text>
				</view>
			</view>
			<view class="status">
				<view class="status-label">
					<slot></slot>
				</view>
				<view class="num">
					<text>×</text>
					<text>{{ item.num }}</text>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: 'goods-card',
		props: {
			// 数据源
			data: {
				type: Object,
				default: () => {
					return {};
				}
			},
			// 是否显示下边框
			showBorderBottom: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {};
		},
		methods: {}
	};
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		align-content: center;
	}
	
	.slot {
		display: flex;
		align-items: center;
		align-content: space-between;
		background-color: $app-theme-bg-color;

		&.showBorderBottom {
			margin-bottom: 30rpx;
			padding-bottom: 24rpx;
			border-bottom: 1rpx solid $app-theme-border-color;
		}

		.pic {
			margin-right: 24rpx;
			border-radius: 16rpx;
			overflow: hidden;
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
				height: 28rpx;
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
</style>
