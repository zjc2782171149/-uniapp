<template>
  <view class="slot">
    <view class="inner">
      <view class="price">
        <text>￥</text>
        <text>{{ nowTotalPrice }}</text>
      </view>
      <view class="right"
        ><u-button type="error" @click="goPayResult">提交订单</u-button></view
      >
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";

export default {
  props: {
    nowTotalPrice: {
      type: Number,
      default: 0,
    },
    addressInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    coupon_id: {
      type: Number,
      default: -1,
    },
  },
  methods: {
    async goPayResult() {
      if (!uni.getStorageSync("userInfo").user_id) {
        uni.showToast({
          title: "请先登录",
          icon: "error",
        });
        return;
      }

      const order_id =
        dayjs().valueOf() + uni.getStorageSync("userInfo").user_id;
      const create_time = getApp().globalData.getNowTime(dayjs().format());

      const orderInfo = {
        goods: getApp().globalData.goodsListSelected,
        status: 0,
        order_id: order_id,
        create_time: create_time,
        order_type: 1,
        pay_way: "暂未支付",
        payment: this.nowTotalPrice,
        end_time: getApp().globalData.getNowTime(
          dayjs().add(15, "minute").format()
        ),
        addressInfo: {
          ...this.addressInfo,
          from: "广州市天河区天山街道天山路171号",
        },
        coupon_id:
          getApp().globalData.discountIndex === -1
            ? -1
            : getApp().globalData.discountsList[
                getApp().globalData.discountIndex
              ].coupon_id,
      };

      uni.setStorageSync("orderInfo", orderInfo);
      console.log("新建订单", orderInfo);

      // 新建订单
      let task1 = await this.setOrderList({
        order_id: order_id,
      });

      // 新建订单信息——购买地址
      let task2 = await this.setOrderAddress({
        order_id: order_id,
        address_info: {
          ...this.addressInfo,
          from: "广州市天河区天山街道天山路171号",
        },
      });

      // 新建订单信息——订单基本信息
      let task3 = await this.setOrderMes({
        order_id: order_id,
        order_mes: {
          status: 0,
          create_time: create_time,
          order_type: 1,
          pay_way: "暂未支付",
          payment: this.nowTotalPrice,
          end_time: getApp().globalData.getNowTime(
            dayjs().add(15, "minute").format()
          ),
          isRemind: 0,
          coupon_id:
            getApp().globalData.discountIndex === -1
              ? -1
              : getApp().globalData.discountsList[
                  getApp().globalData.discountIndex
                ].coupon_id,
          isEvaluate: 0
        },
      });

      // 新建订单信息——购买物品清单
      let task4 = await this.setOrderGoodsList({
        order_id: order_id,
        goods: getApp().globalData.goodsListSelected,
      });

      Promise.all([task1, task2, task3, task4])
        .then((res) => {
          uni.showToast({
            title: "提交订单成功",
            icon: "success",
          });
          // 提交订单成功0.5s才跳转
          setTimeout(() => {
            uni.navigateTo({
              url: "/pages-mall/pages/order/pay",
            });
          }, 500);
        })
        .catch((err) => {
          uni.showToast({
            title: "支付失败",
            icon: "error",
          });
          console.log("失败原因", err);
        });
    },
    // 新建该用户订单
    setOrderList(req) {
      return this.$u.api.setOrderList({
        order_id: req.order_id,
      });
    },
    // 新建该用户的 相关订单的地址信息
    setOrderAddress(req) {
      return this.$u.api.setOrderAddress({
        order_id: req.order_id,
        address_info: req.address_info,
      });
    },
    // 新建该用户的 相关订单的基本信息
    setOrderMes(req) {
      return this.$u.api.setOrderMes({
        order_id: req.order_id,
        order_mes: req.order_mes,
      });
    },
    // 根据订单id去获取订单的地址信息
    setOrderGoodsList(req) {
      return this.$u.api.setOrderGoodsList({
        order_id: req.order_id,
        goods: req.goods,
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
  background-color: $app-theme-bg-color;
  min-height: 100rpx;
  box-shadow: $app-theme-shadow;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  .inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .price {
      padding-left: 30rpx;
      text:nth-child(1) {
        font-size: 24rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: $app-theme-text-money-color;
      }
      text:nth-child(2) {
        font-size: 36rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: $app-theme-text-money-color;
      }
    }
    .right {
      display: flex;
      align-items: center;
      /deep/button {
        height: 100%;
        line-height: 100rpx;
        border-radius: 0 !important;
      }
    }
  }
}
</style>
