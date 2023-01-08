<template>
  <view class="slot">
    <view class="left">
      <view class="item">
        <u-icon size="36" name="server-fill"></u-icon>
        <text>客服</text>
      </view>
      <view class="item" @click="changeCollect" v-if="isCollection === 1">
        <u-icon size="36" name="star-fill"></u-icon>
        <text>已收藏</text>
      </view>
      <view class="item" @click="changeCollect" v-else>
        <u-icon size="36" name="star"></u-icon>
        <text>收藏</text>
      </view>
      <view class="item" @click="goShoppingCart">
        <u-icon size="36" name="shopping-cart"></u-icon>
        <text>购物车</text>
      </view>
    </view>

    <view class="right">
      <u-button
        style="width: 210rpx; border-radius: 40rpx 0 0 40rpx"
        size="medium"
        :ripple="true"
        type="warning"
        @click="addShoppingCart"
        >加入购物车</u-button
      >
      <u-button
        style="width: 210rpx; border-radius: 0 40rpx 40rpx 0"
        size="medium"
        :ripple="true"
        type="error"
        @click="buyNow"
        >立即购买</u-button
      >
    </view>
  </view>
</template>

<script>
export default {
  name: "goods-operate",
  props: {
    // 数据源
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isCollection: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  methods: {
    // 改变收藏状态
    changeCollect() {
      console.log("原收藏状态：", this.isCollection);
      // 如果是已收藏状态，就变为未收藏
      if (this.isCollection === 1) {
        this.$u.api
          .setUserCollect({
            good_id: this.data.good_id,
            isCollection: 0,
          })
          .then((res) => {
            // console.log(res[0]);
            uni.showToast({
              title: "取消收藏成功",
              icon: "success",
            });
          })
          .catch((err) => {
            console.error(err);
            uni.showToast({
              title: "取消收藏失败",
              icon: "error",
            });
          });
      } else {
        // 如果是未收藏状态，就变为已收藏
        this.$u.api
          .setUserCollect({
            good_id: this.data.good_id,
            isCollection: 1,
          })
          .then((res) => {
            // console.log(res[0]);
            uni.showToast({
              title: "收藏成功",
              icon: "success",
            });
          })
          .catch((err) => {
            console.error(err);
            uni.showToast({
              title: "收藏失败",
              icon: "error",
            });
          });
      }

      this.$emit("getGoodInfo", this.data.good_id);
    },
    // 加入购物车
    addShoppingCart() {
      this.$emit("addShoppingCart");
    },

    // 立即购买
    buyNow() {
      this.$emit("buyNow");
    },

    // 去购物车
    goShoppingCart() {
      uni.navigateTo({
        url: "/pages-mall/pages/shopping-cart",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.slot {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 100rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $app-theme-bg-color;
  z-index: $app-zIndex-fixed;
  box-shadow: $app-theme-shadow;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  .left {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item {
      color: $app-theme-text-black-color;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      text {
        padding-top: 4rpx;
        text-align: center;
        width: 100%;
        font-size: 20rpx;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    margin-right: 20rpx;
    // /deep/ button {
    // 	height: 100%;
    // 	line-height: 100rpx;
    // 	border-radius: 12rpx;
    // 	&::after {
    // 		border: initial;
    // 	}
    // }
  }
}
</style>
