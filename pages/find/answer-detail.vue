<template>
	<view class="page">
		<!-- 一般导航栏 -->
		<Navbar :title="type === 0 ? '问答详情' : '官方科普'"></Navbar>

		<view class="inner">
			<!-- 用户 -->
			<CommuntiyAvatar @report="report" :data="article" operateType="report" :showTag="type === 1">
			</CommuntiyAvatar>
			<!-- 商品标题 -->
			<view class="content">
				<u-parse :html="article.content"></u-parse>
			</view>

			<image v-if="showDelete" @click="deleteArticle" class="cell-icon" src="https://cxj.zhangjiancong.top/images/cxj/delete.png"></image>
		</view>
		
		
		<!-- 评论区 -->
		<TitleOperate v-if="type === 0" :title="'回答（' + evaluateLength + '）'" titleSize="32rpx"></TitleOperate>
		<view v-if="type === 0" class="evaluate-list">
			<PostEvaluateCard @report="report" :border="evaluateLength - 1 !== index"
				v-for="(item, index) in evaluateList" :key="index" :data="item" :index="index"
				@deleteEvaluate="deleteEvaluate"></PostEvaluateCard>
		</view>
		<!-- 操作 -->
		<view v-if="type === 0" class="fixed-btn">
			<view class="evaluate">
				<u-input v-model="value" placeholder="这一刻的想法"></u-input>
			</view>
			<u-button shape="circle" size="small" type="gold" @click="submitEvaluate" :ripple="true">
				发表回答</u-button>
		</view>
		<!-- 举报 -->
		<SelectReason ref="SelectReason" title="举报" :ops="reasonOps"></SelectReason>

		<u-modal v-model="showHelp" title="删除确认" :title-style="{ color: themeColor }" :mask-close-able="true"
			:confirm-color="themeColor" show-cancel-button='true' @cancel="cancel" @confirm="confirm">
			<view class="slot-content">
				<div class="title">你确认要删除该篇内容吗？</div>
			</view>
		</u-modal>
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
		components: {
			CommuntiyAvatar,
			TitleOperate,
			PostEvaluateCard,
			SelectReason
		},
		data() {
			return {
				// 底部安全高度
				safeAreaHeight: app.globalData.safeAreaHeight,
				themeColor: this.$appTheme.appThemeColor,
				// 文章内容
				article: {},
				// 评论数据
				evaluateList: [],
				evaluateLength: 0,
				// 举报原因
				currentReasonIndex: 0,
				reasonOps: [{
						label: '广告骚扰',
						value: '0'
					},
					{
						label: '色情低俗',
						value: '1'
					},
					{
						label: '政治宗教',
						value: '2'
					},
					{
						label: '虚假欺骗',
						value: '3'
					},
					{
						label: '侵权(肖像、诽谤、抄袭、冒用)',
						value: '4'
					},
					{
						label: '其他',
						value: '5'
					}
				],
				value: "",
				type: 0,
				showHelp: false,
				showDelete: false
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
				const {
					item,
					index
				} = obj;
				uni.showModal({
					title: '提示',
					content: '是否确认删除评论？',
					success: function(res) {
						if (res.confirm) {
							// TODO 接口
							that.$u.api.deleteArticleEvaluate({
								evaluate_id: item.evaluate_id
							}).then(res => {
								uni.showToast({
									title: "删除评论成功",
									icon: "success"
								});

								that.evaluateList.splice(index, 1);
								that.evaluateLength--;

							})
						}
					}
				});
			},

			// 发表评论
			async submitEvaluate() {
				// if (this.value.length < 10) {
				// 	uni.showToast({
				// 		title: "评论内容不能少于10个字",
				// 		icon: "none"
				// 	});
				// 	return;
				// }
				// console.log("发表者", uni.getStorageSync("userInfo"));
				const that = this;
				const evaluate = {
					article_id: this.article.article_id,
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
				
				// const userData = await uni.getStorage('userInfo');
				console.log("用户数据", uni.getStorageSync('userInfo'));
				console.log("该问题数据", article);
				if(uni.getStorageSync('userInfo').user_id === article.user_id) {
					this.showDelete = true;
				}

			},
			// 初始化文章评论信息
			async initArticleEvaluate(article_id) {
				const evaluateList = await this.$u.api.getArticleEvaluate({
					article_id: article_id
				});

				let task = evaluateList.map(item => {
					return this.$u.api.getUserMesSome({
						user_id: item.user_id
					}).then();

				})

				Promise.all(task).then(res => {
					this.evaluateList = res.map((item, index) => {
						return {
							...evaluateList[index],
							...item, // 文章作者部分个人信息
							publish_time: dayjs(evaluateList[index].publish_time).fromNow()
						}
					});
					this.evaluateLength = this.evaluateList.length;
					
				})

			},
			deleteArticle() {
				console.log("删除")
				this.showHelp = true;
			},
			cancel() {
				
			},
			// 删除文章
			confirm() {
				const that = this;
				console.log(this.article);
				
				this.$u.api.deleteArticle({
					article_id: that.article.article_id
				}).then(res => {
					uni.showToast({
						title: "删除文章成功",
						icon: "success"
					});
					
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1000)
								
						
				})
			}

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
		bottom: 15rpx;
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
	
	.cell-icon {
		width: 50rpx;
		height: 50rpx;
	}
	
	.slot-content {
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.community {
		width: 300rpx;
		height: 300rpx;
		background-image: url(https://cxj.zhangjiancong.top/images/cxj/community.jpg);
		background-size: cover;
	}
	
	.title {
		margin: 16rpx 0;
		font-size: 14px;
	}
</style>
