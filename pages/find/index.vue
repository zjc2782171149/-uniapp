<template>
	<view class="container">
		<navbar-common></navbar-common>


		<div class="new">
			<div class="new-up">·喝茶日历·</div>
		</div>

		<div class="calendar">
			<div class="calendar_out">
				<div class="top">
					<div class="date">
						<div class="month">{{ month }}月/</div>
						<div class="year">{{ year }}年</div>
					</div>
					<div class="record" @click="recordDailyTea">点击记录</div>
				</div>
				<div class="bottom">
					<div class="eachday" v-for="(item, index) in calendar" :key="index">
						<div :class="['name', item.isRecord ? 'color-gold' : '']">{{item.day}}</div>
						<div :class="['number', item.isRecord ? 'border-gold color-gold' : 'border-grey']">
							{{item.date}}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="new">
			<div class="new-up">·资讯广场·</div>
		</div>

		<div class="tabs">
			<u-tabs :list="list" :is-scroll="false" :current="type" @change="change" bar-height="12" bar-width="100"
				active-color="#dabd7b" gutter="20" inactive-color="grey" f-size="20" fontSize="30" letterSpacing="7">
			</u-tabs>
		</div>

		<!-- 回答 -->
		<QuestionList v-if="type === 0" :data="showArticleList" :type="type"></QuestionList>
<!-- 		<u-cell-group v-if="type === 0">
			<div class="cell" v-for="(item, index) in showArticleList" :key="item.article_id">
				<u-cell-item :arrow="false" @click="turnArticleDetail(item)">
					<div slot="title" class="cell-main">
						<div class="cell-author">
							<div class="cell-icon" :style="{ backgroundImage: `url(${item.icon})`}"></div>
							<div class="cell-nickname">{{ item.nickname }}</div>
							<div class="cell-rank">{{ item.rank }}</div>
						</div>
						<div class="cell-content">
							{{ item.content }}
						</div>
					</div>

				</u-cell-item>

			</div>
		</u-cell-group> -->


		<!-- 官方科普 -->
		<u-cell-group v-if="type === 1">
			<div class="cell" v-for="(item, index) in showArticleList" :key="item.article_id">
				<u-cell-item :arrow="false" @click="turnArticleDetail(item)">
					<div slot="title" class="cell-main">
						<div class="cell-title">{{ item.title }}</div>
						<div class="cell-author">
							<div class="cell-icon" :style="{ backgroundImage: `url(${item.icon})`}"></div>
							<div class="cell-nickname">{{ item.nickname }}</div>
							<div class="cell-rank">{{ item.rank }}</div>
						</div>
						<div class="cell-profile">
							<u-parse :html="item.desc"></u-parse>
						</div>
					</div>

					<div slot="right-icon" class="cell-image" :style="{ backgroundImage: `url(${item.img})`}"></div>
				</u-cell-item>

			</div>
		</u-cell-group>

		<!-- 每日喝茶记录 -->
		<div class="daily-tea" v-if="type === 2">
			<text>您已连续记录喝茶{{ consistentRecordDay }}天啦</text>
		</div>
		<RecordList v-if="type === 2" :data="showArticleList" :type="type"></RecordList>


		<div class="blank"></div>

		<!-- 添加按钮 -->
		<AddBtnFixed @click="add"></AddBtnFixed>
		<!-- 新增弹窗 -->
		<AddPopup ref="AddPopup" @close="closeAddPopup" :ops="addOps"></AddPopup>

	</view>
</template>

<script>
	import NavbarTabSearch from '@/components/navbar/navbar-tab-search.vue';
	import AddBtnFixed from '@/components/add-btn-fixed.vue';
	import AddPopup from '@/components/add-popup.vue';
	import GroupPage from '@/components/group.vue';
	import FollowPage from '@/components/follow.vue';
	import QuestionList from '@/pages-community/components/question-list.vue';
	import RecordList from '@/pages-community/components/record-list.vue';

	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import updateLocale from 'dayjs/plugin/updateLocale';
	import isLeapYear from 'dayjs/plugin/isLeapYear';
	import 'dayjs/locale/zh-cn';
	dayjs.extend(relativeTime);
	dayjs.extend(updateLocale);
	dayjs.locale('zh-cn');
	dayjs.extend(isLeapYear);

	export default {
		components: {
			GroupPage,
			FollowPage,
			AddBtnFixed,
			AddPopup,
			QuestionList,
			RecordList
		},
		data() {
			return {
				list: [{
					name: '回答'
				}, {
					name: '科普'
				}, {
					name: '记录',
					// count: 5
				}],
				type: 0,
				articleList: [],
				showArticleList: [],
				// 在切换到关注的时候不显示搜索框
				showSearch: true,
				// 新建按钮配置项
				addOps: [{
						label: '每日喝茶记录',
						icon: require('../../static/operate/publish-community.png'),
						url: '/pages/find/add',
						type: 'dailyRecord'
					},
					{
						label: '问题发布',
						icon: require('../../static/operate/create-community.png'),
						url: '/pages/find/add',
						type: 'question'
					}
				],
				calendar: [],
				dayArr: ["日", "一", "二", "三", "四", "五", "六"],
				monthAr: [31, 31, dayjs().isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30],
				year: '',
				month: '',
				consistentRecordDay: 0
			}
		},
		onLoad() {
			this.initUser();
			
			// 喝茶日历进行初始化
			let year = dayjs().year();
			let month = dayjs().month();
			let date = dayjs().date();
			let day = dayjs().day();
			let arr = new Array(7);

			this.year = year;
			this.month = month + 1;

			for (let i = 6; i >= 0; i--) {
				arr[i] = {
					year: year, // 年
					month: month + 1, // 月
					date: date, // 日
					day: this.dayArr[day], // 星期几
					isRecord: false
				}

				if (date - 1 === 0) {
					date = this.monthAr[dayjs().month()];
					// 月份要减一
					if (month - 1 === -1) {
						month = 11;
						// 年份也要减一
						year -= 1;
					} else {
						month -= 1;
					}

				} else {
					date -= 1;
				}

				if (day - 1 === -1) {
					day = 6;
				} else {
					day -= 1;
				}


			}
			// console.log("数组为", arr);
			this.calendar = arr;

		},
		onShow() {
			this.initArticleList();

		},
		methods: {
			// 改变日历上的记录
			reloadRecord() {
				let recordArr = [];

				// 自己 发的记录
				this.articleList.map(item => {
					if (item.type === 2) {
						recordArr.push(item)
					}
				});


				let recordArr2 = recordArr.map(item => {
					return {
						year: item.publish_time.slice(0, 4) * 1,
						month: item.publish_time.slice(5, 7) * 1,
						date: item.publish_time.slice(8, 10) * 1,
					}
				})

				// console.log(recordArr2);

				this.calendar = this.calendar.map((item, index) => {
					// 如果发表的记录中，这一天有记录，那么便进行标记
					if (recordArr2.find(record => record.year === item.year && record.month === item.month &&
							record.date === item.date)) {
						return {
							...item,
							isRecord: true
						}
					} else {
						return item;
					}

				})


			},
			// 计算连续喝茶天数
			consistentRecord() {
				let recordArr = [];

				// 自己 发的记录
				this.articleList.map(item => {
					if (item.type === 2) {
						recordArr.push(item)
					}
				});


				let recordArr2 = recordArr.map(item => {
					return {
						year: item.publish_time.slice(0, 4) * 1,
						month: item.publish_time.slice(5, 7) * 1,
						date: item.publish_time.slice(8, 10) * 1,
					}
				})

				// 喝茶日历进行初始化
				let year = dayjs().year();
				let month = dayjs().month();
				let date = dayjs().date();

				let i;
				for (i = 0;; i++) {
					if(!recordArr2.find(item => item.year === year && item.month === month + 1 && item.date === date)) {
						break;
					}
					
					if (date - 1 === 0) {
						date = this.monthAr[dayjs().month()];
						// 月份要减一
						if (month - 1 === -1) {
							month = 11;
							// 年份也要减一
							year -= 1;
						} else {
							month -= 1;
						}

					} else {
						date -= 1;
					}
				}
				
				this.consistentRecordDay = i;

			},
			recordDailyTea() {
				uni.navigateTo({
					url: '/pages/find/add?type=' + "dailyRecord"
				})
			},
			async initArticleList() {
				this.articleList = await this.$u.api.getArticleAll({
					user_id: uni.getStorageSync("userInfo").user_id
				});

				const that = this;
				this.showArticleList = [];

				this.articleList.map(item => {
					if (item.type === this.type) {
						that.showArticleList.push({
							...item,
							publish_time: dayjs(item.publish_time).fromNow()
						});
					}
				});
				console.log("要展现的文章", this.showArticleList);

				// 修改日历上的喝茶记录
				this.reloadRecord();
				// 计算连续喝茶天数
				this.consistentRecord();
			},
			async initUser() {
				this.userInfo = await this.$u.api.getUserMes({
					user_id: uni.getStorageSync("user_id")
				});
				uni.setStorageSync("userInfo", this.userInfo);
			},
			turnArticleDetail(item) {
				uni.navigateTo({
					url: "/pages/find/answer-detail?id=" + item.article_id + "&index=" + this.type
				})
			},
			change(index) {
				this.type = index;

				const that = this;
				this.showArticleList = [];
				this.articleList.map(item => {
					if (item.type === this.type) {
						that.showArticleList.push({
							...item,
							publish_time: dayjs(item.publish_time).fromNow()
						});
					}
				});
				// console.log("要展现的文章", this.showArticleList);
			},

			// 添加
			add() {
				let $this = this;
				uni.hideTabBar({
					animation: true,
					complete() {
						$this.$refs.AddPopup.open();
					}
				});
			},

			// 关闭
			closeAddPopup() {
				uni.showTabBar({
					animation: true
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
