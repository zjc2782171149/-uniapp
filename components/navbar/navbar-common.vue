<template>
	<div class="slot">
		<div class="left" @click="goLeft" :style="{ backgroundImage: `url(${leftIcon})`}"></div>
		<view class="search-box" @click="goSearchPage">
			<view class="search-input" @tap="showSearch=true">
				<image src="/static/home/search-icon.png" class="search-icon"></image>
				<view>搜索</view>
			</view>
		</view>
		<div class="right" @click="goRight" :style="{ backgroundImage: `url(${rightIcon})`}"></div>
	</div>
</template>

<script>
	export default {
		name: 'navbar-common',
		props: {
			// 左侧图标
			leftIcon: {
				type: String,
				default: "/static/home/menu.png"
			},
			// 左側图标要跳转的链接
			leftLink: {
				type: String,
				default: "/pages/search"
			},
			// 右侧图标
			rightIcon: {
				type: String,
				default: "/static/home/cart.png"
			},
			// 右側图标要跳转的链接
			rightLink: {
				type: String,
				default: "/pages-mall/pages/shopping-cart"
			},

		},
		data() {
			return {
				search: "/pages/search"
			};
		},
		
		methods: {
			// 左侧图标点击事件默认去购物车
			goLeft() {
				const leftLink = this.leftLink;
				
				uni.navigateTo({
					url: leftLink
				});
			},
			// 右侧图标点击事件默认去购物车
			goRight() {
				const rightLink = this.rightLink;
				
				uni.navigateTo({
					url: rightLink
				});
			},
			// 右侧图标点击事件默认去搜索页面
			goSearchPage() {
				const search = this.search;
				
				uni.navigateTo({
					url: search
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	.slot {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 150rpx;
		padding: 0rpx;
		margin-top: 130rpx;
		margin-bottom: 10rpx;
		
		.left {
			width: 55rpx;
			height: 43rpx;
			background-size: 100% 100%;
			margin-top: 15rpx;
		}
		
		.search-box {
			flex: 0.9;
			height: 100rpx;
			padding: 20rpx 40rpx;
			margin: 0 -10rpx;
			display: flex;
		
			.search-input {
				height: 75rpx;
				width: 100%;
				background-color: #f7f7f7;
				border-radius: 50rem;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding-left: 30rpx;
				
				font-size: 15px;
				color: rgb(218, 189, 123);
				
				border-width: 3px;
				border-color: rgb(119, 119, 119);
				border-style: solid;
				border-radius: 40px;
				z-index: 31;

				.search-icon {
					width: 34rpx;
					height: 34rpx;
					margin-right: 10rpx;
					
				}
			}
		}
		
		.right {
			width: 56rpx;
			height: 50rpx;
			background-size: 100% 100%;
			margin-top: 20rpx;
			margin-left: -10rpx;
		}
	}
</style>
