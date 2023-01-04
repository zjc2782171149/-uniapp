<template>
	<view class="container">
		<navbar-common></navbar-common>
		
		<div class="swiper">
			<swiper class="banner-swiper" circular indicator-dots="true" indicator-color="rgb(244, 246, 252)" indicator-active-color="rgb(228, 197, 152)" 
			autoplay :interval="2000" :duration="500">
				<swiper-item class="banner-swiper-item" v-for="(item, index) in swipers" :key="item.act_id"
				@click="$u.route({ url: '/pages/actDetail/index', params: { url: item.url } })">
					<u-image width="100%" height="100%" :src="item.pics" :fade="true" duration="450">
						<view slot="error" style="font-size: 24rpx;">加载失败</view>
					</u-image>
					<div class="text-swiper">{{item.title}}</div>
					<div class="grey"></div>
				</swiper-item>
			</swiper>
		</div>
		
		<div class="new">
			<div class="new-up">·新品上市·</div>
		</div>
		
		<div class="new-items">
			<div class="new-item" v-for="(item, index) in new_up" :key="item.good_id"
			@click="$u.route({ url: '/pages-mall/pages/goods/detail', params: { id: item.good_id } })">
				<u-image width="100%" height="100%" :src="item.pics" :fade="true" duration="450">
					<view slot="error" style="font-size: 24rpx;">加载失败</view>
				</u-image>
				<div class="text">{{ item.title.slice(0, 9) }}</div>
				<div class="grey"></div>
			</div>
		</div>
		
		<div class="new like">
			<div class="new-up">·活动推荐·</div>
		</div>
		
		<!-- 横向滚动列表 -->
		<colmun-act :list="horizontalScrollNavList"></colmun-act>
		
		<div class="blank"></div>
		
	</view>
</template>

<script>
	import { RandomNum } from '@/utils/random.js';
	import ColmunAct from '@/components/colmun-act.vue';

	export default {
		components: { ColmunAct },
		
		data() {
			return {
				swipers: [],
				new_up: [],
				
				// 横向滚动列表
				horizontalScrollNavList: [],
			}
		},
		onLoad() {
			this.initActList();
		},
		onShow() {
			
		},
		methods: {
			// 初始化活动列表
			async initActList() {
				const actList = await this.$u.api.getActsAll();
				const swiperList = await this.$u.api.getSwipersAll();
				const newUpList = await this.$u.api.getGoodsAll();
				
				// 从活动列表中随机选3个到活动推荐
				let sum = 3, randomArr = [];
				while(true) {
					if(sum === 0)
						break;
						
					let i = RandomNum(0, actList.length);
					if(randomArr.findIndex(item => item === i) === -1) {
						randomArr.push(i);
						this.horizontalScrollNavList.push(actList[i]);
						sum--;
					}
				}
				console.log(randomArr);
				
				this.new_up = newUpList;
				this.swipers = swiperList;
			},
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
