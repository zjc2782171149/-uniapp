<template>
	<view class="container">
		<navbar-common></navbar-common>
		
		<div class="swiper">
			<swiper class="banner-swiper" circular indicator-dots="true" indicator-color="rgb(244, 246, 252)" indicator-active-color="rgb(228, 197, 152)" 
			autoplay :interval="2000" :duration="500">
				<swiper-item class="banner-swiper-item" v-for="(item, index) in swipers" :key="index"
				@click="$u.route({ url: '/pages/actDetail/index', params: { url: item.url } })">
					<image :src="item.src" mode="widthFix"></image>
					<div class="text-swiper">{{item.title}}</div>
					<div class="grey"></div>
				</swiper-item>
			</swiper>
		</div>
		
		<div class="new">
			<div class="new-up">·新品上市·</div>
		</div>
		
		<div class="new-items">
			<div class="new-item" v-for="(item, index) in new_up" :key="index"
			@click="$u.route({ url: '/pages-mall/pages/goods/detail', params: { id: item.id } })">
				<image :src="item.src" mode="widthFix"></image>
				<div class="text">{{item.title}}</div>
				<div class="grey"></div>
			</div>
		</div>
		
		<div class="new like">
			<div class="new-up">·活动推荐·</div>
		</div>
		
		<!-- 横向滚动列表 -->
		<colmun-act :list="horizontalScrollNavList"></colmun-act>
		

		
	</view>
</template>

<script>
	import ColmunAct from '@/components/colmun-act.vue';
	// 导入假数据
	import { horizontalScrollNavList } from '@/static/test-data.js';
	export default {
		components: { ColmunAct },
		
		data() {
			return {
				swipers: [
					{
						src: "https://go.cdn.heytea.com/storage/ad/2020/05/21/bfd57914d80d4671b19f5d0ccc176cd5.jpg",
						title: "化州橘红茶，何方神圣？"
					},
					{
						src: "https://go.cdn.heytea.com/storage/ad/2020/05/24/49f9b50738dd47878cf1ab54c2eee2e0.jpg",
						title: "化州橘红yyds"
					},
					{
						src: "https://go.cdn.heytea.com/storage/ad/2020/05/01/e1c6915022c849fd9492377021aef454.jpg",
						title: "好想喝化州橘红，你想吗"
					},
					{
						src: "https://go.cdn.heytea.com/storage/ad/2020/05/01/e1c6915022c849fd9492377021aef454.jpg",
						title: "好"
					}
				],
				new_up: [
					{
						id: 1,
						goodsType: "normal",
						src: "https://go.cdn.heytea.com/storage/ad/2020/05/21/bfd57914d80d4671b19f5d0ccc176cd5.jpg",
						title: "商品标题1"
					},
					{
						id: 2,
						goodsType: "normal",
						src: "https://go.cdn.heytea.com/storage/ad/2020/05/24/49f9b50738dd47878cf1ab54c2eee2e0.jpg",
						title: "商品标题2"
					},
					{
						id: 3,
						goodsType: "normal",
						src: "https://go.cdn.heytea.com/storage/ad/2020/05/01/e1c6915022c849fd9492377021aef454.jpg",
						title: "商品标题3"
					},
					{
						id: 4,
						goodsType: "normal",
						src: "https://go.cdn.heytea.com/storage/ad/2020/05/01/e1c6915022c849fd9492377021aef454.jpg",
						title: "商品标题4"
					}
				],
				
				// 横向滚动列表
				horizontalScrollNavList: horizontalScrollNavList,
			}
		},
		onShow() {
			console.log("活动列表", this.horizontalScrollNavList);
			

		},
		methods: {
			// 去购物粗
			goCommodityDetail() {
				uni.navigateTo({
					url: '/pages-mall/pages/goods/detail'
				});
			},

		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
