<template>
	<view class="container">
		<navbar-common></navbar-common>

		<div class="new">
			<div class="new-up">·产品分类·</div>
		</div>

		<div class="types">
			<div class="type" v-for="(item, index) in types" :key="index"
			@click="$u.route({ url: '/pages-mall/pages/classify', params: { goodsType: item.goodsType } })">
				<div class="img" :style="{ backgroundImage: `url(${item.src})`}"></div>
				<div class="title">{{ item.title }}</div>
			</div>
		</div>

		<div class="new">
			<div class="new-up recommend">·为你推荐·</div>
		</div>

		<div class="commoditys">
			<div class="inner-container">
				<!-- 瀑布流组件 -->
				<u-waterfall ref="topicWaterFall" v-model="recommendGoodsList" marginLeft="10rpx" marginRight="10rpx">
					<template v-slot:left="{ leftList }">
						<CardGoods v-for="(item, index) in leftList" :key="index" :data="item"></CardGoods>
					</template>
					<template v-slot:right="{ rightList }">
						<CardGoods v-for="(item, index) in rightList" :key="index" :data="item"></CardGoods>
					</template>
				</u-waterfall>
			</div>
		</div>

		<div class="blank"></div>



	</view>
</template>

<script>
	import CardGoods from '@/pages/mall/components/card.vue';
	// 导入假数据
	import {
		goodsList
	} from '@/static/test-data.js';

	export default {
		components: {
			CardGoods
		},
		data() {
			return {
				types: [{
						src: "/static/market/types.png",
						title: "茶品",
						goodsType: "moral"
					},
					{
						src: "/static/market/cultures.png",
						title: "茶文化",
						goodsType: "culture"
					},
					{
						src: "/static/market/tools.png",
						title: "茶具",
						goodsType: "tool"
					},
					{
						src: "/static/market/clothes.png",
						title: "茶服",
						goodsType: "clothes"
					},
				],
				// 推荐商品列表
				recommendGoodsList: [{
						img: "/static/market/1.png",
						title: 'Beats Studio3 Wireless头戴式无线蓝牙耳机',
						money: '1998',
						num: '13042',
						id: 38,
						checked: true,
					},
					{
						img: '/static/market/3.png',
						title: '戴森吹风机家用负离子护发专用大功率不伤发',
						money: '2290',
						num: '1518',
						id: 38,
						checked: false,
					},
					{
						img: '/static/market/2.png',
						title: '戴森吹风机家用负离子护发专用大功率不伤发',
						money: '2290',
						num: '1518',
						id: 38,
						checked: false,
					},
					{
						img: '/static/market/4.png',
						title: '戴森吹风机家用负离子护发专用大功率不伤发',
						money: '2290',
						num: '1518',
						id: 38,
						checked: false,
					}
				],
			}
		},
		onShow() {
			// 处理首页需要渲染的数据
			// this.loadPageData(false);
		},
		methods: {
			// 首页需要渲染的数据
			// loadPageData(isAll = true) {
			// 	setTimeout(() => {
			// 		this.getRecommendGoods();
			// 	}, 0);
			// },

			// 加载推荐商品
			// getRecommendGoods() {
			// 	this.$nextTick(() => {
			// 		console.log(JSON.parse(JSON.stringify(goodsList)));
			// 		this.recommendGoodsList = JSON.parse(JSON.stringify(goodsList));
			// 	});
			// },
		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
