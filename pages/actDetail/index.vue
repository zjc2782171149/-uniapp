<template>
	<view class="slot">
		<Navbar title="活动详情"></Navbar>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				url: ""
			};
		},
		onLoad(ops) {
			if (ops.url) {
				this.url = ops.url;
			}
		},
		onShow() {

		},
		onReady() {
			setTimeout(() => {
				uni.setNavigationBarTitle({
					title: '活动详情'
				})
			}, 1000)
		},
		methods: {

		}
	};
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
