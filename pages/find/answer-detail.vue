<template>
	<view class="page">
		<!-- 一般导航栏 -->
		<Navbar :title="type === 0 ? '问答详情' : '官方科普'"></Navbar>

		<view class="inner">
			<!-- 用户 -->
			<CommuntiyAvatar @report="report" :data="article" operateType="report" :showTag="type === 1"></CommuntiyAvatar>
			<!-- 商品标题 -->
			<view class="content">
				<u-parse :html="article.content"></u-parse>
			</view>

		</view>
		<!-- 评论区 -->
		<TitleOperate v-if="type === 0" :title="'回答（' + evaluateList.length + '）'" titleSize="32rpx"></TitleOperate>
		<view v-if="type === 0" class="evaluate-list">
			<PostEvaluateCard @report="report" :border="evaluateList.length - 1 != index" v-for="(item, index) in evaluateList" :key="index" 
			:data="item" :index="index" @deleteEvaluate="deleteEvaluate"></PostEvaluateCard>
		</view>
		<!-- 操作 -->
		<view v-if="type === 0" class="fixed-btn">
			<view class="evaluate"><u-input v-model="value" placeholder="这一刻的想法"></u-input></view>
			<u-button shape="circle" size="small" type="gold" @click="submitEvaluate" :ripple="true">
				发表回答</u-button>
		</view>
		<!-- 举报 -->
		<SelectReason ref="SelectReason" title="举报" :ops="reasonOps"></SelectReason>

	</view>
</template>

<script>
const app = getApp();
import CommuntiyAvatar from './components/community-avatar.vue';
import PostEvaluateCard from './components/post-evaluate-card.vue';
import TitleOperate from '@/components/title-operate.vue';
import SelectReason from '@/components/select-reason.vue';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.locale('zh-cn');

export default {
	components: { CommuntiyAvatar, TitleOperate, PostEvaluateCard, SelectReason },
	data() {
		return {
			// 底部安全高度
			safeAreaHeight: app.globalData.safeAreaHeight,
			// 文章内容
			article: {},
			// 评论数据
			evaluateList: [],
			// 举报原因
			currentReasonIndex: 0,
			reasonOps: [
				{ label: '广告骚扰', value: '0' },
				{ label: '色情低俗', value: '1' },
				{ label: '政治宗教', value: '2' },
				{ label: '虚假欺骗', value: '3' },
				{ label: '侵权(肖像、诽谤、抄袭、冒用)', value: '4' },
				{ label: '其他', value: '5' }
			],
			value: "",
			type: 0
		};
	},
	onLoad(ops) {
		this.type = ops.index * 1;
		
		this.initArticle(ops.id * 1);
		
	},
	methods: {
		// 举报
		report() {
			this.$refs.SelectReason.open(this.currentReasonIndex);
		},
		
		// 删除评论
		async deleteEvaluate(obj) {
			const that = this;
			const { item, index } = obj;
			uni.showModal({
				title: '提示',
				content: '是否确认删除评论？',
				success: function(res) {
					if (res.confirm) {
						// TODO 接口
						that.$u.api.deleteArticleEvaluate({
							user_id: uni.getStorageSync("user_id"),
							article_id: item.article_id
						}).then(res => {
							uni.showToast({
								title: "删除评论成功",
								icon: "success"
							});
							
							that.evaluateList.splice(index, 1);
							
							
						})
					}
				}
			});
		},

		// 发表评论
		async submitEvaluate() {
			if(this.value.length < 10) {
				uni.showToast({
					title: "评论内容不能少于10个字",
					icon: "none"
				});
				return;
			}
			
			const that = this;
			const evaluate = {
				article_id: this.article.article_id,
				user_id: this.article.user_id,
				content: this.value,
				publish_time: getApp().globalData.getNowTime(dayjs().format())
			};
			
			this.$u.api.setArticleEvaluate(evaluate).then(res => {
				uni.showToast({
					title: "发表评论成功",
					icon: "success"
				});
				
				that.value = '';
				
				that.initArticleEvaluate(that.article.article_id);
				
			})
			
			
		},
		// 初始化文章信息
		async initArticle(article_id) {
			const article = await this.$u.api.getArticleMes({
				article_id: article_id
			});
			
			this.article = {
				...article,
				publish_time: dayjs(article.publish_time).fromNow()
			}
			
			this.initArticleEvaluate(article_id);
			
			
		},
		// 初始化文章评论信息
		async initArticleEvaluate(article_id) {
			const evaluateList = await this.$u.api.getArticleEvaluate({
				article_id: article_id
			});
			
			this.evaluateList = evaluateList.map(item => {
				return {
					...item,
					publish_time: dayjs(item.publish_time).fromNow()
				}
			})
			
		},

	}
};
</script>

<style lang="scss" scoped>
.page {
	background-color: $app-theme-bg-color;
	padding-bottom: 100rpx;
}
.inner {
	padding: 30rpx;
	border-bottom: 1px solid $app-theme-border-color;
}
.content {
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: $app-theme-text-black-color;
	margin: 24rpx 0;
}
.is-goods {
	margin-top: 24rpx;
	margin-bottom: 16rpx;
	font-size: 24rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: $app-theme-text-black-color;
}
.operate {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 8rpx;
}
.fixed-btn {
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 199;
	width: 100%;
	padding: 10rpx 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: $app-theme-bg-color;
	border-top: 1px solid $app-theme-border-color;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	.evaluate {
		width: 480rpx;
		height: 76rpx;
		background: $app-theme-bg-gray-color;
		padding-left: 24rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}
	
}
.evaluate-list {
	margin-top: -40rpx;
	padding: 30rpx;
}
</style>
