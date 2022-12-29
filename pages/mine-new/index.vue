<template>
	<view class="container">
		<navbar-common rightIcon="/static/mine/settings.png" rightLink="/pages-mine/pages/mine"></navbar-common>

		<div class="profile" @click="go('/pages-mine/pages/mine')">
			<div class="left"></div>
			<div class="right">
				<div class="nickname">Ryan</div>
				<div class="account">账号：10293847</div>
				<div class="qrcode"></div>
			</div>
			<div class="more"> > </div>
		</div>

		<div class="cells">
			<u-cell-group>
				<div class="cell" v-for="(item, index) in mains" :key="index" @click="go(item.link)">
					<u-cell-item :arrow="false">
						<div slot="title" class="cell-title">{{ item.title }}</div>
						<div slot="icon" class="cell-icon" :style="{ backgroundImage: `url(${item.src})`}"></div>
					</u-cell-item>

				</div>
			</u-cell-group>
		</div>

		<div class="cells">
			<u-cell-group>
				<div class="cell" v-for="(item, index) in others" :key="index" @click="go(item.link)">
					<u-cell-item :arrow="false">
						<div slot="title" class="cell-title">{{ item.title }}</div>
						<div slot="icon" class="cell-icon" :style="{ backgroundImage: `url(${item.src})`}"></div>
					</u-cell-item>
		
				</div>
			</u-cell-group>
		</div>
		
		<div class="logo">
			<div class="image"></div>
		</div>


	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				mains: [{
						title: "我的数据",
						src: "/static/mine/files.png",
						link: "/pages-mine/pages/user"
					},
					{
						title: "我的收藏",
						src: "/static/mine/heart.png",
						link: "/pages-mine/pages/collection"
					},
					{
						title: "我的订单",
						src: "/static/mine/paper.png",
						link: "/pages-mall/pages/order/list"
					},
					{
						title: "我的优惠",
						src: "/static/mine/price.png",
						link: "/pages-mine/pages/discounts"
					},
					{
						title: "我的积分",
						src: "/static/mine/pack.png",
						link: "/pages-points/pages/index"
					}
				],
				others: [{
						title: "帮助",
						src: "/static/mine/info.png",
						link: "/pages-mine/pages/help"
					},
					{
						title: "联系我们",
						src: "/static/mine/phone.png",
						link: "/pages-mine/pages/contact"
					}
				]
			}
		},
		onShow() {
			// 处理首页需要渲染的数据
			// this.loadPageData(false);
		},
		methods: {
			// 去往对应页面
			go(link) {
				console.log(link);
				uni.navigateTo({
					url: link
				});
			},

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
