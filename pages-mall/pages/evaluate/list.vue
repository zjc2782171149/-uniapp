<template>
	<view class="page">
		<Navbar title="评价列表"></Navbar>
		<view class="evaluate-list">
			<EvaluateCard
				:data="evaluate"
				v-for="(evaluate, evaluateIndex) in evaluateData"
				:key="evaluateIndex"
				:showBorderBottom="evaluateIndex != evaluateData.length - 1"
			></EvaluateCard>
		</view>
	</view>
</template>

<script>
import EvaluateCard from '@/pages-mall/components/evaluate-card.vue';
export default {
	components: {
		EvaluateCard
	},
	data() {
		return {
			evaluateData: []
		};
	},
	onShow() {
		this.evaluateData = uni.getStorageSync("evaluateData");
	},
};
</script>

<style lang="scss" scoped>
.evaluate-list {
	background-color: $app-theme-bg-color;
	padding: 0 30rpx 0rpx 30rpx;
}
</style>
