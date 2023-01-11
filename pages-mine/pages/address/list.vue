<template>
	<view class="page">
		<!-- 自定义头部 -->
		<u-navbar back-icon-name="arrow-leftward" title="收货地址">
		</u-navbar>
		

		<view class="list">
			<AddressCard v-for="(item, index) in list" :isBack="Boolean(isBack)" :key="index" :data="item" :showEdit="!isSelect"
			:showBorderBottom="index !== list.length - 1" :addressIndex="index"></AddressCard>
		</view>
		<view class="btn" v-if="!isSelect">
			<u-button type="gold" shape="circle" @click="$u.route({ url: '/pages-mine/pages/address/add-or-update?type=add' })">
				<u-icon name="plus"></u-icon>
				<text>新建收货地址</text>
			</u-button>
		</view>
	</view>
</template>

<script>
import AddressCard from '@/pages/mine/components/address-card.vue';
export default {
	components: {
		AddressCard
	},
	data() {
		return {
			isSelect: false,
			isBack: false,
			list: []
		};
	},
	onLoad(ops) {
		if (ops.isSelect) {
			this.isSelect = ops.isSelect;
			this.isBack = ops.isBack;
		}
		
	},
	onShow() {
		this.initAddress();
	},
	methods: {
		selectAddress(index) {

		},
		initAddress() {
			this.$u.api.getUserAddress().then(res => {
				this.list = res;
				getApp().globalData.addressList = res;
			}).catch(err => {
				console.error(err);
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	background-color: $app-theme-bg-color;
}
.list {
	padding: 0 30rpx;
}
.btn {
	position: absolute;
	bottom: 40rpx;
	left: 0;
	padding: 30rpx;
	width: 100%;
	text {
		margin-left: 8rpx;
	}
}
</style>
