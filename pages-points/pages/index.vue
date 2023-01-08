<template>
  <view class="page">
    <!-- 带背景的透明导航栏 -->
    <NavbarRoundImg
      title="我的积分"
      isBack
      :bgImg="bgImg"
      :backgroundColor="backgroundColor"
    ></NavbarRoundImg>

    <!-- 用户 -->
    <UserInfo :userInfo="userInfo" :isSign="isSign" @sign="sign"></UserInfo>

    <!-- 签到模块 -->
    <!-- <Sign></Sign> -->

    <!-- 福利中心 -->
    <!-- 		<view class="active">
			<TitleOperate title="福利中心" padding="28rpx 24rpx"></TitleOperate>
			<view class="inner">
				<view class="item"><u-image width="100%" height="220rpx" mode="widthFix" src="@/pages-points/static/active-1.png"></u-image></view>
				<view class="item"><u-image width="100%" height="220rpx" mode="widthFix" src="@/pages-points/static/active-2.png"></u-image></view>
			</view>
		</view> -->

    <!-- 做任务赚积分 -->
    <!-- 		<view class="task">
			<TitleOperate title="做任务赚积分" padding="28rpx 24rpx" showMore moreLabel="更多任务"></TitleOperate>
			<Task :list="taskList"></Task>
		</view> -->

    <!-- 积分购物 -->
    <!-- 		<view class="shopping">
			<TitleOperate title="积分购物" padding="28rpx 24rpx"></TitleOperate>
			<view class="list"><PointsGoodsCard style="width: calc(50% - 7rpx);" :data="item" v-for="(item, index) in goodsData" :key="index"></PointsGoodsCard></view>
		</view> -->

    <!-- 优惠卷兑换 -->
    <view class="discounts">
      <TitleOperate
        title="优惠卷兑换 (有效期90天)"
        padding="28rpx 24rpx"
      ></TitleOperate>
      <view class="list">
        <PointsDiscountsCard
          :data="item"
          v-for="(item, index) in discountsData"
          :key="index"
          @exchangeDiscount="exchangeDiscount"
        ></PointsDiscountsCard>
      </view>
    </view>
  </view>
</template>

<script>
import { pointsGoodsData } from "@/static/test-data.js";
import NavbarRoundImg from "@/components/navbar/navbar-round-img.vue";
import UserInfo from "@/pages-points/components/user-info.vue";
import Sign from "@/pages-points/components/sign";
import Task from "@/pages-points/components/task";
import PointsGoodsCard from "@/pages-points/components/points-goods-card";
import PointsDiscountsCard from "@/pages-points/components/points-discount-card";
import TitleOperate from "@/components/title-operate.vue";
import dayjs from "dayjs";

export default {
  components: {
    NavbarRoundImg,
    UserInfo,
    Sign,
    Task,
    PointsGoodsCard,
    PointsDiscountsCard,
    TitleOperate,
  },
  data() {
    return {
      themeColor: this.$appTheme.appThemeColor,
      bgImg: require("@/pages-points/static/bg.png"),
      backgroundColor: "rgba(0,0,0,0)",
      // 测试数据
      goodsData: pointsGoodsData,
      // 任务列表
      taskList: [
        {
          icon: require("@/pages-points/static/sign-3.png"),
          title: "累计签到3天",
          desc: "连续累计签到3天额外获得20积分",
          isOver: true,
          pointsNum: 20,
        },
        {
          icon: require("@/pages-points/static/sign-7.png"),
          title: "累计签到7天",
          desc: "连续累计签到7天额外获得50积分",
          isOver: false,
          pointsNum: 50,
        },
        {
          icon: require("@/pages-points/static/publish.png"),
          title: "发布帖子",
          desc: "发布帖子, 获得20积分",
          isOver: false,
          pointsNum: 20,
        },
        {
          icon: require("@/pages-points/static/collection.png"),
          title: "收藏帖子",
          desc: "收藏帖子, 获得10积分",
          isOver: true,
          pointsNum: 10,
        },
        {
          icon: require("@/pages-points/static/over-order.png"),
          title: "完成订单",
          desc: "完成下单, 获得100积分",
          isOver: false,
          pointsNum: 100,
        },
      ],
      // 优惠卷列表
      discountsData: [
        {
          title: "购物专享券",
          endDate: "2022.10.12",
          use: "全部商品",
          standard: 199,
          discounts: 25,
          points: 50,
          bgImgType: "yellow",
        },
        {
          title: "品类专享券",
          endDate: "2022.10.12",
          use: "全部商品",
          standard: 299,
          discounts: 30,
          points: 150,
          bgImgType: "blue",
        },
      ],
      userInfo: {},
      isSign: 0,
    };
  },
  onPageScroll(e) {
    if (e.scrollTop > 10) {
      this.backgroundColor = "";
    } else {
      this.backgroundColor = "rgba(0,0,0,0)";
    }
  },
  onLoad(options) {
    this.initUser();
    this.initSign();
  },
  methods: {
    initUser() {
      this.userInfo = uni.getStorageSync("userInfo");
    },
    // 查询签到状态
    async initSign() {
      const res = await this.$u.api.getUserSign();

      if (res.isSign === 0) this.isSign = 0;
      else this.isSign = 1;
    },
    async sign() {
      const that = this;
      this.$u.api
        .setUserSign({
          sign_time: getApp().globalData.getNowTime(dayjs().format()),
          point: this.userInfo.point,
        })
        .then((res) => {
          uni.showToast({
            title: "签到成功",
          });

          that.isSign = 1;
          that.userInfo.point = that.userInfo.point + 10;
          uni.setStorageSync("userInfo", that.userInfo);
        });
    },
    // 兑换优惠券
    async exchangeDiscount(item) {
      console.log("要兑换的优惠券", item);
      const that = this;
      const endDate = dayjs().add(90, "day").format();

      uni.showModal({
        title: "提示",
        content: "是否兑换该优惠券？",
        confirmColor: this.themeColor,
        success: function (res) {
          if (res.confirm) {
            // 积分足够才可以兑换
            if (that.userInfo.point >= item.points) {
              let task1 = that.$u.api
                .setCoupon({
                  coupon_name: item.title,
                  endDate: endDate.slice(0, 10) + " " + endDate.slice(11, 19),
                  threshold: item.standard,
                  discount: item.discounts,
                })
                .then();

              let task2 = that.$u.api
                .updateUserPoint({
                  point: that.userInfo.point - item.points,
                })
                .then();

              Promise.all([task1, task2])
                .then((res) => {
                  uni.showToast({
                    title: "恭喜你，兑换成功",
                    icon: "success",
                  });

                  uni.setStorageSync("userInfo", {
                    ...that.userInfo,
                    point: that.userInfo.point - item.points,
                  });
                  that.initUser();
                })
                .catch((err) => {
                  uni.showToast({
                    title: "兑换失败",
                    icon: "error",
                  });
                  console.error(err);
                });
            } else {
              uni.showToast({
                title: "您的积分不足",
                icon: "error",
              });
            }
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 100rpx;
}

.active {
  margin: 24rpx;
  box-shadow: $app-theme-shadow;
  border-radius: 16rpx;
  background-color: $app-theme-bg-color;
  position: relative;
  z-index: $app-zIndex-normal;

  .inner {
    display: flex;
    justify-content: space-between;

    .item {
      width: 50%;
    }
  }
}

.task {
  box-shadow: $app-theme-shadow;
  border-radius: 16rpx;
  margin: 0 24rpx;
  background-color: $app-theme-bg-color;
  position: relative;
  z-index: $app-zIndex-normal;
}

.shopping {
  box-shadow: $app-theme-shadow;
  border-radius: 16rpx;
  margin: 24rpx;
  background-color: $app-theme-bg-color;
  position: relative;
  z-index: $app-zIndex-normal;

  .list {
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
  }
}

.discounts {
  box-shadow: $app-theme-shadow;
  border-radius: 16rpx;
  margin: 0 24rpx;
  background-color: $app-theme-bg-color;
  position: relative;
  z-index: $app-zIndex-normal;

  .list {
    padding: 0rpx 32rpx 24rpx 32rpx;
  }
}
</style>
