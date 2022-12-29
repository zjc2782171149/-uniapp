<template>
	<view class="slot">
		<Navbar title="活动详情" :background="{ backgroundColor: 'transparent' }"></Navbar>
		<view class="web">
			<web-view :src="url">
			</web-view>
		</view>

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
		onShow() {
			//获取页面栈
			const pages = getCurrentPages();
			//获取路由参数
			const curPage = pages[pages.length - 1];
			var page = pages[pages.length - 1];
			console.log(page);
			this.url = page.options.url ?? "";

		},
		methods: {

		}
	};
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
