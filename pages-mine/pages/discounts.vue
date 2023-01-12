<template>
  <view class="page">
    <Navbar title="优惠券"></Navbar>
    <view class="list">
      <view
        class="item"
        v-for="(item, index) in discountsList"
        :key="item.coupon_id"
        @click="changeDiscount(item, index)"
      >
        <view class="left">
          <view class="discount">
            <text>￥</text>
            <text>{{ item.discount }}</text>
          </view>
          <view class="standard">满{{ item.threshold }}可用</view>
        </view>
        <view class="right">
          <view class="title">{{ item.coupon_name }}</view>
          <view class="date">有效期至 {{ item.endDate }}</view>
        </view>
        <view class="select" v-if="selectIndex == index"></view>
      </view>
	  
    </view>
	
	<NoData height="50vh" v-if="discountsList.length === 0"></NoData>
  </view>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      userInfo: {},
      selectIndex: 0,
      discountsList: [],
      payment: 0,
    };
  },
  onLoad(ops) {
    this.initUser();
    console.log(ops);
    if (ops.payment) this.payment = ops.payment * 1;
  },
  onShow() {
    this.selectIndex = getApp().globalData.discountIndex;

    this.initCouponsList();
  },
  methods: {
    initUser() {
      this.userInfo = uni.getStorageSync("userInfo");
    },
    initCouponsList() {
      const that = this;

      this.$u.api
        .getCouponList()
        .then((res) => {
          const list = [];
          res.map((item) => {
            list.push({
              ...item,
              endDate:
                dayjs(item.endDate).format().slice(0, 10) +
                " " +
                dayjs(item.endDate).format().slice(11, 19),
            });
          });
          that.discountsList = list;
          getApp().globalData.discountsList = list;
        })
        .catch((err) => {
          uni.showToast({
            title: "查找优惠券失败",
          });
        });
    },
    changeDiscount(item, index) {
      // 非支付页面过来选择优惠券，不允许点击事件
      if (this.payment === 0) return;

      // 到达阈值才能选择此优惠券
      if (this.payment < this.discountsList[index].threshold) {
        uni.showToast({
          title: "您的总金额未达到优惠券最低门槛",
          icon: "none",
        });
        return;
      }

      this.selectIndex = index;
      getApp().globalData.discountIndex = index;
      console.log(getApp().globalData.discountIndex);

      // 选择完后自动返回付款页面
      uni.navigateBack({
        delta: 1,
        animationDuration: 500,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  margin: 30rpx;
  .item {
    width: 100%;
    height: 174rpx;
    background-image: url("https://cxj.zhangjiancong.top/images/cxj/mine/discounts-bg.png");
    background-size: cover;
    margin-bottom: 30rpx;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    padding-bottom: 34rpx;
    position: relative;

    .left {
      margin-right: 60rpx;
      margin-left: 50rpx;
      .discount {
        text:nth-child(1) {
          font-size: 22rpx;
          color: $app-theme-text-money-color;
        }
        text:nth-child(2) {
          font-size: 64rpx;
          color: $app-theme-text-money-color;
        }
      }
      .standard {
        font-size: 20rpx;
        color: $app-theme-card-gray-color;
      }
    }
    .right {
      .title {
        font-size: 32rpx;
        color: $app-theme-text-black-color;
        margin-bottom: 32rpx;
      }
      .date {
        font-size: 20rpx;
        color: $app-theme-card-gray-color;
      }
    }

    .select {
      height: 60rpx;
      width: 60rpx;
      background-image: url("https://cxj.zhangjiancong.top/images/cxj/mine/discounts-select.png");
      background-size: cover;
      position: absolute;
      top: 4rpx;
      right: 4rpx;
      z-index: $app-zIndex-absolute;
    }
  }
}
</style>
