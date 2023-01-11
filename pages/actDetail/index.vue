<template>
	<view class="slot">
		<Navbar title="活动详情" :background="{ backgroundColor: 'transparent' }"></Navbar>
		<web-view :src="url">
		</web-view>

	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				url: "",
				isHave: false
			};
		},
		onLoad(ops) {
			if(ops.url) {
				this.url = ops.url;
				this.isHave = true;
			} else {
				this.isHave = false;
			}
		},
		onShow() {
			
		},
		methods: {

		}
	};
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
