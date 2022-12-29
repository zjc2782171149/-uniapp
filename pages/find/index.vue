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
						<div class="month">4月/</div>
						<div class="year">2022年</div>
					</div>
					<div class="record">点击记录</div>
				</div>
				<div class="bottom">
					<div class="eachday" v-for="(item, index) in calendar" :key="index">
						<div :class="['name', item.isRecord ? 'color-gold' : '']">{{item.name}}</div>
						<div :class="['number', item.isRecord ? 'border-gold color-gold' : 'border-grey']">
							{{item.number}}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="new">
			<div class="new-up">·资讯广场·</div>
		</div>

		<div class="tabs">
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change" bar-height="12" bar-width="100"
				active-color="#dabd7b" gutter="20" inactive-color="grey" f-size="20" fontSize="30" letterSpacing="7"
				>
			</u-tabs>
		</div>

		<u-cell-group>
			<div class="cell" v-for="(item, index) in record" :key="index">
				<u-cell-item :arrow="false">
					<div slot="title" class="cell-main">
						<div class="cell-title">{{ item.title }}</div>
						<div class="cell-author">
							<div class="cell-icon" :style="{ backgroundImage: `url(${item.icon})`}"></div>
							<div class="cell-nickname">{{ item.nickname }}</div>
							<div class="cell-rank">{{ item.rank }}</div>
						</div>
						<div class="cell-profile">{{ item.profile }}</div>
					</div>

					<div slot="right-icon" class="cell-image" :style="{ backgroundImage: `url(${item.image})`}"></div>
				</u-cell-item>

			</div>
		</u-cell-group>
		
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
	
	export default {
		components: {
			GroupPage,
			FollowPage,
			AddBtnFixed,
			AddPopup
		},
		data() {
			return {
				calendar: [{
						name: "日",
						number: 3,
						isRecord: true
					},
					{
						name: "一",
						number: 4,
						isRecord: false
					},
					{
						name: "二",
						number: 5,
						isRecord: false
					},
					{
						name: "三",
						number: 6,
						isRecord: false
					},
					{
						name: "四",
						number: 7,
						isRecord: false
					},
					{
						name: "五",
						number: 8,
						isRecord: true
					},
					{
						name: "六",
						number: 9,
						isRecord: true
					}
				],
				list: [{
					name: '回答'
				}, {
					name: '科普'
				}, {
					name: '记录',
					// count: 5
				}],
				current: 0,
				record: [{
						title: "能空腹喝化州橘红吗？",
						icon: "/static/find/icon.png",
						nickname: "芋泥波波",
						rank: "资深茶叶审评师",
						profile: "化橘红怎样吃比较好，空腹喝是否可以_有时候，我们很想快点好起来，但是又怕乱吃不好，我们来学习下小知识：空腹可以喝化州橘红，主要地，类似中药材或者茶叶，健康是很重要的",
						image: "/static/find/tea.png"
					},
					{
						title: "能空腹喝化州橘红吗？",
						icon: "/static/find/icon.png",
						nickname: "芋泥波波",
						rank: "资深茶叶审评师",
						profile: "化橘红怎样吃比较好，空腹喝是否可以_有时候，我们很想快点好起来，但是又怕乱吃不好，我们来学习下小知识：空腹可以喝化州橘红，主要地，类似中药材或者茶叶，健康是很重要的",
						image: "/static/find/tea.png"
					},
					{
						title: "能空腹喝化州橘红吗？",
						icon: "/static/find/icon.png",
						nickname: "芋泥波波",
						rank: "资深茶叶审评师",
						profile: "化橘红怎样吃比较好，空腹喝是否可以_有时候，我们很想快点好起来，但是又怕乱吃不好，我们来学习下小知识：空腹可以喝化州橘红，主要地，类似中药材或者茶叶，健康是很重要的",
						image: "/static/find/tea.png"
					},
					{
						title: "能空腹喝化州橘红吗？",
						icon: "/static/find/icon.png",
						nickname: "芋泥波波",
						rank: "资深茶叶审评师",
						profile: "化橘红怎样吃比较好，空腹喝是否可以_有时候，我们很想快点好起来，但是又怕乱吃不好，我们来学习下小知识：空腹可以喝化州橘红，主要地，类似中药材或者茶叶，健康是很重要的",
						image: "/static/find/tea.png"
					}
				],
				// 在切换到关注的时候不显示搜索框
				showSearch: true,
				// 新建按钮配置项
				addOps: [
					{
						label: '创建圈子',
						icon: require('../../static/operate/publish-community.png'),
						url: '/pages-community/pages/community/add-or-update?type=add',
						type: 'page'
					},
					{ label: '发布帖子', icon: require('../../static/operate/create-community.png'), url: '/pages-community/pages/post/add', type: 'page' }
				]
			}
		},
		methods: {
			change(index) {
				this.current = index;
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
