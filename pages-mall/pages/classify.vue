<template>
	<view class="page">
		<!-- 自定义导航栏-->
		<Navbar title="商品分类"></Navbar>

		<view class="inner">
			<!-- 侧栏 -->
			<view class="aside">
				<view class="item acea-row row-center-wrapper" :class="index === sideIndex ? 'on' : ''"
					v-for="(item, index) in classifyList" :key="index" @click="changeSide(index)">
					{{ item.goodsType }}
				</view>
			</view>
			<!-- 主内容 -->
			<scroll-view class="conter" scroll-y="true">
				<view v-for="(item, index) in classifyList" :key="index">
					<view class="item" v-if="index === sideIndex">
						<view class="title">{{ item.goodsType }}</view>
						<view class="list">
							<view class="item" v-for="(child, childIndex) in item.children" :key="childIndex"
								@click="goGoodsList(child)">
								<u-image height="120rpx" width="120rpx" :src="child.pics"></u-image>
								<view class="name">{{ child.title }}</view>
							</view>
						</view>
						<NoData height="50vh" v-if="item.children.length == 0"></NoData>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				// 分类数据
				classifyList: [],
				// 分类索引
				sideIndex: 0,
				// 传参id
				queryClassifyId: '',
				typeArr: [{
						goodsType: 'moral',
						index: 0
					},
					{
						goodsType: 'culture',
						index: 1
					},
					{
						goodsType: 'tool',
						index: 2
					},
					{
						goodsType: 'clothes',
						index: 3
					}
				]
			};
		},
		onLoad(options) {
			if (options.id) {
				this.queryClassifyId = options.id;
			}
			this.getClassifyList(options.goodsType);
		},
		methods: {
			// 查询分类列表
			async getClassifyList(goodsType) {
				const list = await this.$u.api.getGoodsAll();

				let classifyList = [{
						goodsType: '茶品',
						children: []
					},
					{
						goodsType: '茶文化',
						children: []
					},
					{
						goodsType: '茶具',
						children: []
					},
					{
						goodsType: '茶服',
						children: []
					}
				];

				list.map(item => {
					if (item.goodsType === 'moral') {
						classifyList[0].children.push(item)
					} else if (item.goodsType === 'culture') {
						classifyList[1].children.push(item)
					} else if (item.goodsType === 'tool') {
						classifyList[2].children.push(item)
					} else {
						classifyList[3].children.push(item)
					}
				})

				this.classifyList = classifyList;
				
				if (goodsType === 'moral') {
					this.changeSide(0);
				} else if (goodsType === 'culture') {
					this.changeSide(1);
				} else if (goodsType === 'tool') {
					this.changeSide(2);
				} else {
					this.changeSide(3);
				}

			},

			// 切换分类
			changeSide(index) {
				this.sideIndex = index;
			},

			// 跳转商品列表页
			goGoodsList(child) {
				uni.navigateTo({
					url: '/pages-mall/pages/goods/detail?id=' + child.good_id
				})

			}
		}
	};
</script>

<style lang="scss" scoped>
	.page {
		background: $app-theme-bg-color;

		.inner {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;

			.aside {
				width: 196rpx;
				background: $app-theme-bg-gray-color;
				height: 100%;

				.item {
					height: 100rpx;
					line-height: 100rpx;
					text-align: center;
					font-size: 32rpx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: $app-theme-text-black-color;
					transition: all 0.3s ease-in-out;

					&.on {
						color: $app-theme-color;
						position: relative;
						background-color: $app-theme-bg-color;
						transition: all 0.3s ease-in-out;

						&::before {
							position: absolute;
							top: 50%;
							left: 0;
							transform: translate(0, -50%);
							content: '';
							height: 30rpx;
							width: 8rpx;
							background-color: $app-theme-color;
						}
					}
				}
			}

			.conter {
				padding: 30rpx 40rpx 30rpx 40rpx;

				.item {
					.title {
						font-size: 30rpx;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;
						color: $app-theme-text-black-color;
						padding: 30rpx 0;
					}

					.list {
						display: flex;
						justify-content: flex-start;
						align-items: flex-start;
						flex-wrap: wrap;

						.item {
							width: 120rpx;
							margin-bottom: 30rpx;
							margin-right: 56rpx;

							&:nth-child(3n) {
								margin-right: 0;
							}

							.picture {}

							.name {
								width: 120rpx;
								font-size: 24rpx;
								font-family: PingFang-SC-Regular, PingFang-SC;
								font-weight: 400;
								color: $app-theme-text-gray-color;
								text-align: center;
								margin-top: 12rpx;

								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
								-o-text-overflow: ellipsis;
							}
						}
					}
				}
			}
		}
	}
</style>
