<template>
	<u-popup v-model="show" mask mode="bottom" mask-close-able closeable border-radius="16" safe-area-inset-bottom>
		<view class="info">
			<view class="pic"><u-image :src="data.pics" width="190rpx" height="190rpx"></u-image></view>
			<view class="desc">
				<view class="price">
					<text>￥</text>
					<text>{{ selectSkuPrice || data.price }}</text>
				</view>
				<view class="select">
					<text>已选</text>
					<text>{{ selectSkuLabel }}</text>
				</view>
			</view>
		</view>
		
		
		<view class="sku">
			<view class="title">规格</view>
			<view class="list">
				<view class="item" v-for="(item, index) in data.skuData" :key="index" :class="{ select: item.value === selectSkuValue }" @click="selectSku(item, index)">
					{{ item.label }}
				</view>
			</view>
		</view>
		<view class="num">
			<view class="title">数量</view>
			<u-number-box :min="1" :max="50" v-model="num" @change="changeNum"></u-number-box>
		</view>
		<view class="operate">
			<u-button style="width: 50%;" type="warning" @click="addCartHandle" throttleTime='50'>加入购物车</u-button>
			<u-button style="width: 50%;" type="error" @click="bugNowHandle" throttleTime='50'>立即购买</u-button>
		</view>
	</u-popup>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			// 数据源
			data: {},
			// 已选择的sku
			selectSkuLabel: '',
			selectSkuValue: '-1',
			selectSkuPrice: '',
			// 数量
			num: 1
		};
	},
	methods: {
		// 打开popup
		open(data, selectSku) {
			this.data = data;
			this.selectSkuLabel = selectSku.label;
			this.selectSkuValue = selectSku.value;
			this.selectSkuPrice = selectSku.price;
			this.show = true;
		},

		// 切换sku
		selectSku(item, index) {
			this.selectSkuValue = item.value;
			this.selectSkuLabel = item.label;
			this.selectSkuPrice = item.price;
			this.$emit('change', item);
		},

		// 数量改变时
		changeNum(e) {
			console.log('当前值为: ' + e.value)
		},

		// 关闭
		close() {},

		// 加入购物车
		addCartHandle() {
			if(!this.selectSkuLabel) {
				uni.showToast({
					title: '请选择商品规格',
					icon: 'error'
				});
				return;
			}
			if(this.num < 1) {
				uni.showToast({
					title: '请至少选择一件商品',
					icon: 'error'
				});
				return;
			}
			console.log("已选择商品数据", this.data);
			
			const newGood = {
				...this.data,
				name: this.title,
				num: this.num,
				sku: this.selectSkuLabel,
				price: this.selectSkuPrice,
				checked: true
			}
			getApp().globalData.goodsList.push(newGood);
			
			uni.showToast({
				title: '添加购物车成功',
				icon: 'success'
			});
		},

		// 立即购买
		bugNowHandle() {
			uni.navigateTo({
				url: '/pages-mall/pages/order/submit'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.info {
	padding: 30rpx 30rpx 0 30rpx;
	display: flex;
	align-items: flex-end;
	.pic {
		margin-right: 30rpx;
	}
	.desc {
		.price {
			margin-bottom: 20rpx;
			text:nth-child(1) {
				font-size: 24rpx;
				color: $app-theme-text-money-color;
				vertical-align: bottom;
			}
			text:nth-child(2) {
				font-size: 36rpx;
				color: $app-theme-text-money-color;
				vertical-align: bottom;
			}
		}
		.select {
			text:nth-child(1) {
				font-size: 24rpx;
				color: $app-theme-card-gray-deep-color;
				margin-right: 20rpx;
			}
			text:nth-child(2) {
				font-size: 24rpx;
				color: $app-theme-text-black-color;
			}
		}
	}
}
.sku {
	padding: 30rpx 30rpx 0 30rpx;
	.title {
		font-size: 28rpx;
		color: $app-theme-text-black-color;
		margin-bottom: 16rpx;
	}
	.list {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.item {
			padding: 16rpx 32rpx 14rpx 32rpx;
			margin-bottom: 24rpx;
			margin-right: 20rpx;
			background-color: $app-theme-sku-gray-color;
			font-size: 24rpx;
			color: $app-theme-text-black-color;
			border: 1rpx solid $app-theme-sku-gray-color;
			&.select {
				color: $app-theme-color;
				border: 1rpx solid $app-theme-color;
				background-color: rgba($app-theme-color, 0.08);
			}
		}
	}
}
.num {
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.title {
		font-size: 28rpx;
		color: $app-theme-text-black-color;
	}
}
.operate {
	display: flex;
	align-items: center;
	/deep/button {
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 0 !important;
		&::after {
			border: initial;
		}
	}
}
</style>
