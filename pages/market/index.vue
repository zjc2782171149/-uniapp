<template>
  <view class="container">
    <navbar-common></navbar-common>

    <div class="new">
      <div class="new-up">·产品分类·</div>
    </div>

    <div class="types">
      <div
        class="type"
        v-for="(item, index) in types"
        :key="index"
        @click="
          $u.route({
            url: '/pages-mall/pages/classify',
            params: { goodsType: item.goodsType },
          })
        "
      >
        <div class="img" :style="{ backgroundImage: `url(${item.src})` }"></div>
        <div class="title">{{ item.title }}</div>
      </div>
    </div>

    <div class="new">
      <div class="new-up recommend">·为你推荐·</div>
    </div>

    <div class="commoditys">
      <div class="inner-container">
        <!-- 瀑布流组件 -->
        <u-waterfall
          ref="topicWaterFall"
          v-model="recommendGoodsList"
          marginLeft="10rpx"
          marginRight="10rpx"
        >
          <template v-slot:left="{ leftList }">
            <CardGoods
              v-for="(item, index) in leftList"
              :key="index"
              :data="item"
            ></CardGoods>
          </template>
          <template v-slot:right="{ rightList }">
            <CardGoods
              v-for="(item, index) in rightList"
              :key="index"
              :data="item"
            ></CardGoods>
          </template>
        </u-waterfall>
      </div>
    </div>

    <div class="blank"></div>
  </view>
</template>

<script>
import CardGoods from "@/pages/mall/components/card.vue";

import dayjs from "dayjs";

export default {
  components: {
    CardGoods,
  },
  data() {
    return {
      types: [
        {
          src: "https://cxj.zhangjiancong.top/images/cxj/market/types.png",
          title: "茶品",
          goodsType: "moral",
        },
        {
          src: "https://cxj.zhangjiancong.top/images/cxj/market/cultures.png",
          title: "茶文化",
          goodsType: "culture",
        },
        {
          src: "https://cxj.zhangjiancong.top/images/cxj/market/tools.png",
          title: "茶具",
          goodsType: "tool",
        },
        {
          src: "https://cxj.zhangjiancong.top/images/cxj/market/clothes.png",
          title: "茶服",
          goodsType: "clothes",
        },
      ],
      // 推荐商品列表
      recommendGoodsList: [],
    };
  },
  onLoad() {
    this.initUser();
    this.getRecommendGoods();
  },
  onShow() {
    // 处理首页需要渲染的数据
    // this.loadPageData(false);
  },
  methods: {
    async initUser() {
      this.userInfo = await this.$u.api.getUserMes();
      uni.setStorageSync("userInfo", this.userInfo);
    },

    // 加载推荐商品
    async getRecommendGoods() {
      const newUpList = await this.$u.api.getGoodsAll();
      this.recommendGoodsList = newUpList;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
