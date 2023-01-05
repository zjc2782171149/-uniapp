<template>
	<view class="slot">
		<view class="left">
			<u-avatar size="118" :src="userInfo.icon ? userInfo.icon : '../../../static/user/1.png'"></u-avatar>
			<view class="info">
				<view class="username">{{ userInfo.nickname || '未知用户' }}</view>
				<view class="points">
					<u-image width="32rpx" height="32rpx" src="@/pages-points/static/points.png" mode="widthFix">
					</u-image>
					<text>{{ userInfo.point }}</text>
				</view>
			</view>
		</view>
		<view class="right">
			<u-button type="gold" size="small" shape="circle" @click="sign" :disabled="isSign === 1">
				<u-icon name="plus"></u-icon>
				<text>每日签到</text>
			</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'user-info',
		props: {
			// 数据源
			userInfo: {
				type: Object,
				default: () => {
					return {};
				}
			},
			isSign: {
				type: Number,
				default: 0
			},
		},
		methods: {
			sign() {
				console.log("签到")
				this.$emit('sign');
			}
		}
	};
</script>

<style lang="scss" scoped>
	.slot {
		color: $app-theme-text-white-color;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 48rpx;
		position: relative;
		z-index: $app-zIndex-normal;

		.left {
			display: flex;
			align-items: center;

			.info {
				margin-left: 24rpx;
				display: flex;
				align-content: space-between;
				flex-wrap: wrap;

				.username {
					font-size: 32rpx;
					width: 100%;
					color: $app-theme-text-white-color;
					margin-bottom: 16rpx;
				}

				.points {
					padding: 10rpx 22rpx;
					background: $app-theme-light-color;
					border-radius: 4px;
					border: 1px solid $app-theme-color;
					display: flex;
					align-items: center;
					border-radius: 12rpx;

					text {
						margin-left: 8rpx;
						font-size: 32rpx;
						font-weight: bold;
						color: $app-theme-text-white-color;
					}
				}
			}
		}

		.right {
			display: flex;
			align-items: center;
		}
	}
</style>
