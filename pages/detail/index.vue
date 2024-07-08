<template>
	<view class="container">
		<NavbarRoundImg title="记录详情" isBack bgImg="" backgroundColor="rgb(221, 195, 135)"></NavbarRoundImg>
		<view class="page">

			<!-- 删除 -->
			<div class="delete">
				<u-icon name="trash-fill" color="rgb(167, 125, 80)" size="40" @click="isDelete"></u-icon>
			</div>


			<div class="title">
				{{ detail.title ? detail.title : detail.signTime.slice(0, 4) + "年" + detail.signTime.slice(5, 7) + "月" + detail.signTime.slice(8, 10) + "日" }}
			</div>


			<div class="top">
				<div class="left">
					<div class="avatar">
						<u-avatar :src="detail.icon || 'https://eggplantrabbit.zhangjiancong.top/images/eggplantrabbit/avatar.jpg'">
						</u-avatar>
					</div>
					<div class="nickname">{{ detail.nickname}}</div>
				</div>

				<div class="publish_time">{{ detail.signTime }}</div>
			</div>


			<div class="main">
				<div class="content">
					<u-parse :html="detail.content"></u-parse>
				</div>
			</div>

			<div class="picture">
				<image v-for="(itemm, indexx) in detail.pictureList" :src="itemm.url" mode="aspectFill">
				</image>
			</div>
			
			<div class="comments">
				<!-- 评论区 -->
				<TitleOperate :title="'回答（' + evaluateLength + '）'" titleSize="32rpx"></TitleOperate>
				<view class="evaluate-list">
					<PostEvaluateCard @report="report" :border="evaluateLength - 1 !== index"
						v-for="(item, index) in commentList" :key="index" :data="item" :index="index"
						@deleteEvaluate="deleteEvaluate"></PostEvaluateCard>
				</view>
				<!-- 操作 -->
				<view class="fixed-btn">
					<view class="evaluate">
						<u-input v-model="commentValue" placeholder="这一刻的想法"></u-input>
					</view>
					<u-button shape="circle" size="small" type="green" @click="submitEvaluate" :ripple="true">
						发表回答</u-button>
				</view>
			
				<div class="comment-blank"></div>
			</div>

			<u-modal v-model="showModal" content="你确定要删除该记录吗？" :show-cancel-button="true"
				confirm-color="rgb(228, 197, 152)" @confirm="confirmDeleteDetail"></u-modal>

			<!-- 顶部消息提示 -->
			<u-top-tips ref="uTips"></u-top-tips>
		</view>


	</view>
</template>

<script>
	import NavbarRoundImg from "@/components/navbar/navbar-round-img.vue";
	import TitleOperate from '@/components/title-operate.vue';
	import PostEvaluateCard from './components/post-evaluate-card.vue';
	
	import dayjs from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime";
	import updateLocale from "dayjs/plugin/updateLocale";
	import "dayjs/locale/zh-cn";


	dayjs.extend(relativeTime);
	dayjs.extend(updateLocale);
	dayjs.locale("zh-cn");

	export default {
		components: {
			NavbarRoundImg,
			TitleOperate,
			PostEvaluateCard
		},
		data() {
			return {
				commentValue: "",
				commentList: [],
				evaluateList: [],
				evaluateLength: 0,
				showModal: false,
				detailID: 0,
				type: '',
				bgImg: 'https://cxj.zhangjiancong.top/images/cxj/bg-detail.jpg',
				token: '',
				detail: {
					avatar: 'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
					nickname: '帅气茄子',
					signTime: '2023-12-30 09:12:29',
					content: '<p>主要内容主要内容容主要内容主要内容容容534523主要内容主要内容主要内容容容主要内容主要内容主要内容容容主要内容容主要内容</p><p>主要内容主要内容容主要内容主要内容容容534523主要内容主要内容主要内容容容主要内容主要内容主要内容容容主要内容容主要内容</p><p>主要内容主要内容容主要内容主要内容容容534523主要内容主要内容主要内容容容主要内容主要内容主要内容容容主要内容容主要内容</p>',
					pictureList: ['https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
						'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp',
						'https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp'
					]
				}
			}
		},

		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log("传进来的数据", option); //打印出上个页面传递的参数。
			this.detailID = Number(option.id);
			this.type = option.type;
			
			
		},

		onShow() {
			// 处理首页需要渲染的数据
			this.initRecord();
			this.initComment();
		},
		methods: {
			submitEvaluate() {
				const that = this;
				
				this.$u.api.setStoryComment({ story_id: this.detailID, content: this.commentValue, publish_time: dayjs().format() }).then(res => {
					console.log(res);
					uni.showToast({
						title: '评论成功',
						icon: "success"
					})
					that.initComment();
				})
			},
			
			initComment() {
				const that = this;
				
				this.$u.api.getStoryComment({ story_id: this.detailID }).then(res => {
					console.log(res);
					that.commentList = res.map(item => {
							return {
								...item,
								publish_time: dayjs(item.publish_time).format("YYYY-MM-DD HH:mm:ss"),
							}
						});
					that.evaluateLength = that.commentList.length;
				})
			},
			
			// 删除确认框
			isDelete() {
				console.log("aaaaaaaa");
				this.showModal = true;
				console.log(this.showModal);
			},

			// 删除该记录
			confirmDeleteDetail() {
				let that = this;

				if (this.type === 'story') {
					// 拾柒故事记录
					this.$u.api.deleteStory({
						id: this.detailID
					}).then(res => {
						console.log("删除结果", res);
						this.$refs.uTips.show({
							title: '删除记录成功',
							type: 'success',
							duration: '2000'
						})
					
						setTimeout(() => {
							// uni.switchTab({
							// 	url: '/pages/mine/index'
							// });
							uni.navigateBack({});
						}, 2000);
					
					})
				} else {
					// 每日打卡记录
					this.$u.api.deleteUserSign({
						id: this.detailID
					}).then(res => {
						console.log("删除结果", res);
						this.$refs.uTips.show({
							title: '删除记录成功',
							type: 'success',
							duration: '2000'
						})

						setTimeout(() => {
							// uni.switchTab({
							// 	url: '/pages/mine/index'
							// });
							uni.navigateBack({});
						}, 2000);

					})
				}




			},

			// 每日打卡信息
			initRecord() {
				let that = this;

				if (this.type === 'story') {
					// 拾柒故事记录
					this.$u.api.getStory().then(res => {
						console.log(res);
						let recordList = res.map(item => {
							return {
								...item,
								signTime: dayjs(item.signTime).format("YYYY-MM-DD HH:mm:ss"),
								pictureList: JSON.parse(item.pictureList)
							}
						})
						that.detail = recordList.find(item => item.id === that.detailID);
						console.log("该故事", that.detail);
					})
				} else {
					// 每日打卡记录
					this.$u.api.getUserSign().then(res => {
						console.log(res);
						let recordList = res.map(item => {
							return {
								...item,
								signTime: dayjs(item.signTime).format("YYYY-MM-DD HH:mm:ss"),
								pictureList: JSON.parse(item.pictureList)
							}
						})
						that.detail = recordList.find(item => item.id === that.detailID);
						// console.log(that.detail);

					})
				}

			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
