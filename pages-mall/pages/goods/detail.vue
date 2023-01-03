<template>
	<view class="page">
		<!-- 一般导航栏 -->
		<Navbar title="商品详情"></Navbar>
		<!-- 商品图片 -->
		<ImgSwiper :list="goodsDetail.sliderImageArr"></ImgSwiper>
		<!-- 商品信息 -->
		<GoodsInfo :data="goodsDetail" :goodsType="goodsType"></GoodsInfo>
		<!-- 选择项 -->
		<GoodsSelect :selectedSku="selectedSku" :selectedAddress="selectedAddress" @openSku="openSkuPopup"></GoodsSelect>
		<!-- 评价 -->
		<TitleOperate
			:title="'商品评价（' + evaluateData.length + '条）'"
			showMore
			moreLabel=" "
			:backgroundColor="bgColor"
			titleSize="32rpx"
			align="center"
			@clickMore="turnToEvaluateList"
		></TitleOperate>
		<view class="evaluate-list">
			<EvaluateCard
				:data="evaluate"
				v-for="(evaluate, evaluateIndex) in evaluateData"
				:key="evaluateIndex"
				:showBorderBottom="evaluateIndex != evaluateData.length - 1"
			></EvaluateCard>
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
		<GoodsOperate :data="goodsDetail" :isCollection="goodsDetail.isCollection" @addShoppingCart="addShoppingCart" @buyNow="buyNow" @getGoodInfo="getGoodInfo"></GoodsOperate>
		<!-- 选择sku -->
		<GoodsSelectSku ref="GoodsSelectSku" @addShoppingCart="addShoppingCart" @buyNow="buyNow" @change="changeSku"></GoodsSelectSku>
	</view>
</template>

<script>
import TitleOperate from '@/components/title-operate.vue';
import ImgSwiper from '@/components/img-swiper.vue';
import GoodsInfo from '@/pages-mall/components/goods/goods-info.vue';
import GoodsSelect from '@/pages-mall/components/goods/goods-select.vue';
import GoodsOperate from '@/pages-mall/components/goods/goods-operate.vue';
import GoodsSelectSku from '@/pages-mall/components/goods/goods-select-sku.vue';
import EvaluateCard from '@/pages-mall/components/evaluate-card.vue';
import PostCardSimple from '@/pages/community/components/post-card-simple.vue';
import CardGoods from '@/pages/mall/components/card.vue';
import { topicList, goodsList } from '@/static/test-data.js';
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
		CardGoods
	},
	data() {
		return {
			// 商品类型，normal、points
			goodsType: 'normal',
			// 假数据
			goodsDetail: {},
			evaluateData: [],
			// evaluateData: [],
			// 精选晒单
			topicData: topicList,
			// 相关商品
			goodsData: goodsList,
			// 背景色
			bgColor: this.$appTheme.appThemeBgColor,
			// 已选择sku
			selectedSku: { label: '', value: 0, price: 1234 },
			// 已选择地址
			selectedAddress: ''
		};
	},
	onLoad(ops) {
		if (ops.goodsType) this.goodsType = ops.goodsType;
		
		this.getGoodInfo(ops.id * 1);
		
	},
	onShow() {
		// 已选择地址
		console.log("已选择地址", getApp().globalData.addressList[getApp().globalData.addressIndex].address);
		this.selectedAddress = getApp().globalData.addressList[getApp().globalData.addressIndex].address;
	
	},
	methods: {
		// 跳转至评论列表
		turnToEvaluateList() {
			uni.setStorageSync("evaluateData", this.evaluateData);
			uni.navigateTo({
				url: '/pages-mall/pages/evaluate/list'
			})

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
			this.openSkuPopup();
		},
		
		getGoodInfo(id) {
			console.log("商品编号为：", id);
			const that = this;
			// 商品基本信息
			this.$u.api.getGood({ id: id }).then(res => {
				// console.log(res[0]);
				that.goodsDetail = res[0];
			})
			
			// 获取商品规格
			this.$u.api.getGoodSpec({ id: id }).then(res => {
				// console.log(res);
				const arr = res.map((item, index) => {
					return {
						label: item.label,
						price: item.price,
						value: index + ''
					}
				})
				that.goodsDetail.skuData = arr;
			})
			
			// 获取商品轮播图
			this.$u.api.getGoodSwiper({ id: id }).then(res => {
				// console.log(res);
				let arr = [];
				res.forEach(item => {
					arr.push(item.url);
				})
				that.goodsDetail.sliderImageArr = arr;
			})
			
			
			// 获取商品评论
			this.$u.api.getGoodEvaluate({ id: id }).then(res => {
				// console.log(res);
				let task1 = res.map(item => {
					return that.$u.api.getUserMes({
						user_id: item.user_id
					}).then();
				})
				
				// 通过用户id拿到用户昵称
				let nicknameArr = [];
				Promise.all(task1).then(res2 => {
					// console.log(res2);
					nicknameArr = res2.map(item => item[0]);
					
					that.evaluateData = res.map((item, index) => {
						return {
							...item,
							create_time: item.create_time.slice(0, 10),
							nickname: nicknameArr[index].nickname,
							icon: nicknameArr[index].icon
						}
					})
				});
				

			})
			
			// 商品是否被收藏
			this.$u.api.getUserCollect({ 
				user_id: uni.getStorageSync("user_id"),
				good_id: id
			}).then(res => {
				// console.log(res[0]);
				if(res.length) {
					that.goodsDetail.isCollection = 1;
				} else {
					that.goodsDetail.isCollection = 0;
				}
				console.log("收藏状态", that.goodsDetail.isCollection);
			}).catch(err => {
				console.error(err);
				that.goodsDetail.isCollection = 0;
			})
			
			
		}
	}
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
</style>
