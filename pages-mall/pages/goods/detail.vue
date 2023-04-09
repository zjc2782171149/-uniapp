<template>
	<view class="page">
		<!-- 一般导航栏 -->
		<Navbar title="商品详情"></Navbar>

		<div class="main" v-if="!loading">
			<!-- 商品图片 -->
			<ImgSwiper :list="sliderImageArr"></ImgSwiper>
			<!-- 商品信息 -->
			<GoodsInfo :data="goodsDetail" :goodsType="goodsType"></GoodsInfo>
			<!-- 选择项 -->
			<GoodsSelect :selectedSku="selectedSku" :selectedAddress="selectedAddress" @openSku="openSkuPopup">
			</GoodsSelect>
			<!-- 评价 -->
			<TitleOperate :title="'商品评价（' + evaluateLength + '条）'" showMore moreLabel=" " :backgroundColor="bgColor"
				titleSize="32rpx" align="center" @clickMore="turnToEvaluateList"></TitleOperate>
			<view class="evaluate-list">
				<EvaluateCard :data="evaluate" v-for="(evaluate, evaluateIndex) in evaluateData.slice(-5)"
					:key="evaluateIndex" :showBorderBottom="evaluateIndex !== evaluateLength - 1"></EvaluateCard>
			</view>
			<!-- 精选晒单
		<TitleOperate :title="'精选晒单（' + topicData.length + '条）'" :backgroundColor="bgColor" titleSize="32rpx" align="center"></TitleOperate>
		<view class="topci-list">
			瀑布流组件 
			<u-waterfall ref="topicWaterFall" v-model="topicData" marginLeft="7rpx" marginRight="7rpx">
				<template v-slot:left="{ leftList }">
					<PostCardSimple v-for="(item, index) in leftList" :key="index" :data="item"></PostCardSimple>
				</template>
				<template v-slot:right="{ rightList }">
					<PostCardSimple v-for="(item, index) in rightList" :key="index" :data="item"></PostCardSimple>
				</template>
			</u-waterfall>
			<view class="view-more"><u-button size="medium" shape="circle" plain @click="$u.route('/pages-community/pages/post/list')">查看全部</u-button></view>
		</view>-->

			<!-- 商品详情 -->
			<TitleOperate title="商品详情" :backgroundColor="bgColor" titleSize="32rpx" align="center"></TitleOperate>
			<view class="details-html" v-html="goodsDetail.html"></view>

			<!-- 相关商品 
		<TitleOperate title="相关商品" :backgroundColor="bgColor" titleSize="32rpx" align="center"></TitleOperate>
		<view class="goods-list">
			<!-- 瀑布流组件 
			<u-waterfall ref="goodsWaterFall" v-model="goodsData" marginLeft="7rpx" marginRight="7rpx">
				<template v-slot:left="{ leftList }">
					<CardGoods v-for="(item, index) in leftList" :key="index" :data="item"></CardGoods>
				</template>
				<template v-slot:right="{ rightList }">
					<CardGoods v-for="(item, index) in rightList" :key="index" :data="item"></CardGoods>
				</template>
			</u-waterfall>
		</view>-->

			<!-- 底部操作按钮 -->
			<GoodsOperate :data="goodsDetail" :isCollection="isCollection" @addShoppingCart="addShoppingCart"
				@buyNow="buyNow" @getGoodInfo="getGoodInfo"></GoodsOperate>
			<!-- 选择sku -->
			<GoodsSelectSku ref="GoodsSelectSku" @addShoppingCart="addShoppingCart" @buyNow="buyNow"
				@change="changeSku">
			</GoodsSelectSku>
		</div>


		<div class="loading">
			<u-loading :show="loading" size="50"></u-loading>
		</div>
		
		<u-modal v-model="showHelp" title="购买提示" :title-style="{ color: themeColor }" :mask-close-able="true"
			:confirm-color="themeColor">
			<view class="slot-content">
				<div class="community"></div>
				<div class="title">请扫描二维码关注官方公众号，在后台回复“化橘红茶”，加入微信社群购买。</div>
				<!-- 请扫描二维码关注官方公众号，在后台回复“化橘红茶”，加入微信社群购买。 -->
			</view>
		</u-modal>

	</view>
</template>

<script>
	import TitleOperate from "@/components/title-operate.vue";
	import ImgSwiper from "@/components/img-swiper.vue";
	import GoodsInfo from "@/pages-mall/components/goods/goods-info.vue";
	import GoodsSelect from "@/pages-mall/components/goods/goods-select.vue";
	import GoodsOperate from "@/pages-mall/components/goods/goods-operate.vue";
	import GoodsSelectSku from "@/pages-mall/components/goods/goods-select-sku.vue";
	import EvaluateCard from "@/pages-mall/components/evaluate-card.vue";
	import PostCardSimple from "@/pages/community/components/post-card-simple.vue";
	import CardGoods from "@/pages/mall/components/card.vue";

	import dayjs from "dayjs";

	export default {
		components: {
			TitleOperate,
			ImgSwiper,
			GoodsInfo,
			GoodsSelect,
			GoodsOperate,
			GoodsSelectSku,
			EvaluateCard,
			PostCardSimple,
			CardGoods,
		},
		data() {
			return {
				// 商品类型
				goodsType: "",
				goodsDetail: {},
				isCollection: 0,
				evaluateData: [],
				evaluateLength: 0,
				sliderImageArr: [],

				// 背景色
				bgColor: this.$appTheme.appThemeBgColor,
				themeColor: this.$appTheme.appThemeColor,
				// 已选择sku
				selectedSku: {
					label: "",
					value: 0,
					price: 1234,
				},
				// 已选择地址
				selectedAddress: "",

				loading: true, // 是否显示骨架屏组件
				showHelp: false // 展示购买引导
			};
		},
		onLoad(ops) {
			if (ops.goodsType) this.goodsType = ops.goodsType;

			this.getGoodInfo(ops.id * 1);
			this.initAddress();
		},
		onShow() {
			this.initAddress();
		},
		methods: {
			// 跳转至评论列表
			turnToEvaluateList() {
				uni.setStorageSync("evaluateData", this.evaluateData);
				uni.navigateTo({
					url: "/pages-mall/pages/evaluate/list",
				});
			},

			// 打开选择sku的弹窗
			openSkuPopup() {
				this.$refs.GoodsSelectSku.open(this.goodsDetail, this.selectedSku);
			},

			// 切换sku
			changeSku(e) {
				this.selectedSku.label = e.label;
				this.selectedSku.value = e.value;
				this.selectedSku.price = e.price;

				this.goodsDetail.price = e.price;
			},

			// 加入购物车
			addShoppingCart() {
				this.openSkuPopup();
			},

			// 立即购买
			buyNow() {
				// this.openSkuPopup();
				this.showHelp = true;
			},

			async initAddress() {
				getApp().globalData.addressList = await this.$u.api.getUserAddress();
				// 已选择地址
				// console.log(
				// 	getApp().globalData.addressIndex,
				// 	getApp().globalData.addressList
				// );
				this.selectedAddress =
					getApp().globalData.addressList[getApp().globalData.addressIndex] ? getApp().globalData
					.addressList[getApp().globalData.addressIndex].street : "";
			},

			async getGoodInfo(id) {
				console.log("商品编号为：", id);
				const that = this;

				let task1 = this.$u.api.getGood({
					id: id
				}).then();
				let task2 = this.$u.api.getGoodSpec({
					id: id
				}).then();
				let task3 = this.$u.api.getGoodSwiper({
					id: id
				}).then();
				let task4 = this.$u.api.getGoodEvaluate({
					id: id
				}).then();
				let task5 = this.$u.api.getUserCollect({
					good_id: id
				}).then();

				const res = await Promise.all([task1, task2, task3, task4, task5]);

				// 商品基本信息
				this.goodsDetail = res[0][0];

				// 获取商品规格
				this.goodsDetail.skuData = res[1].map((item, index) => {
					return {
						label: item.label,
						price: item.price,
						value: index + "",
					};
				});
				// 默认选中第一个商品规格
				this.selectedSku = {
					...this.goodsDetail.skuData[0],
					value: '0'
				}

				// 获取商品轮播图
				this.sliderImageArr = res[2].map((item) => item.url);

				// 获取商品评论
				this.evaluateData = res[3].map((item, index) => {
					return {
						...item,
						create_time: dayjs(item.create_time).format().slice(0, 10),
					};
				});
				this.evaluateLength = that.evaluateData.length;

				// 商品是否被收藏
				this.isCollection = res[4].length > 0 ? 1 : 0;

				this.loading = false;

			},
		},
	};
</script>

<style lang="scss" scoped>
	.evaluate-list,
	.topci-list,
	.goods-list {
		background-color: $app-theme-bg-color;
		padding: 0 30rpx 30rpx 30rpx;
		margin-bottom: 16rpx;
	}

	.details-html {
		background-color: $app-theme-bg-color;
		padding: 0 30rpx 30rpx 30rpx;
		margin-bottom: 100rpx;
	}

	.view-more {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 24rpx;
	}
	
	.loading {
		width: 100vw;
		height: 80vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.slot-content {
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.community {
		width: 300rpx;
		height: 300rpx;
		background-image: url(https://cxj.zhangjiancong.top/images/cxj/community.jpg);
		background-size: cover;
	}
	
	.title {
		margin: 16rpx 0;
		font-size: 14px;
	}
</style>
