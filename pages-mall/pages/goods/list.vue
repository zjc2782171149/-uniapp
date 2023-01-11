<template>
	<view class="page">
		<!-- 带搜索框的一般导航栏 -->
		<u-navbar title="商品列表" placeholder="搜索商品、品牌"></u-navbar>

		<view class="search-slot">
			<u-search :focus="true" placeholder="搜索全部订单" :showAction="false" shape="round" v-model="searchValue" bg-color="#F4F5F8"
				@custom="search" @search="search" @clear="clear" @change="change">
			</u-search>
		</view>

		<!-- 商品列表 -->
		<view class="list" v-if="showList.length !== 0">
			<!-- 瀑布流组件 -->
			<u-waterfall ref="topicWaterFall" v-model="showList" marginLeft="7rpx" marginRight="7rpx">
				<template v-slot:left="{ leftList }">
					<CardGoods v-for="(item, index) in leftList" :key="index" :data="item"
						:showOldMoney="item.oldMoney"></CardGoods>
				</template>
				<template v-slot:right="{ rightList }">
					<CardGoods v-for="(item, index) in rightList" :key="index" :data="item"
						:showOldMoney="item.oldMoney"></CardGoods>
				</template>
			</u-waterfall>
		</view>
		
		<NoData height="50vh" v-if="showList.length === 0"></NoData>
		
	</view>
</template>

<script>
	// 组件
	import CardGoods from "@/pages/mall/components/card.vue";

	export default {
		components: {
			CardGoods,

		},
		data() {
			return {
				goodsList: [],
				showList: [],
				searchValue: '',
			};
		},
		onLoad() {
			this.initList();
		},
		methods: {
			change() {
				if(this.searchValue === '') {
					this.showList = this.goodsList;
				}
			},
			initList() {
				this.$u.api.getGoodsAll().then(res => {
					this.goodsList = this.showList = res;
				})
			},
			search() {
				console.log("搜索", this.searchValue)
				const that = this;

				let arr = [];
				this.showList = [];
				this.goodsList.map((item) => {
					// 订单中物品列表有搜索框文字，加入
					if(item.title.includes(that.searchValue)) {
						arr.push(item);
					}
				});
				console.log(arr);
				this.showList = arr;

			},
			clear() {
				this.searchValue = '';

			},
		}
	};
</script>

<style lang="scss" scoped>
	.list {
		padding: 30rpx;
	}

	.search-slot {
		// padding-left: 50rpx;
		width: 90%;
		margin: 20rpx 0 20rpx 30rpx;
	}
</style>
