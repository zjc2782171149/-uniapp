<template>
  <view class="page">
    <Navbar title="确认支付"></Navbar>

    <!-- 金额展示 -->
    <view class="money-show">
      <view class="desc">实付金额</view>
      <view class="money">
        <text>￥</text>
        <text>{{ payment }}.00</text>
      </view>
      <view class="time" v-if="timestamp <= 900">
        <view class="surplus_time">支付剩余时间</view>
        <u-count-down :timestamp="timestamp" @end="end"></u-count-down>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="pay-type">
      <view class="title">选择支付方式 (长按可保存到相册)</view>

      <u-grid :col="1" :border="false">
        <u-grid-item>
          <u-image
            width="300rpx"
            height="300rpx"
            src="https://cxj.zhangjiancong.top/images/cxj/pay/wxpay.jpg"
          ></u-image>
          <view class="grid-text">微信支付</view>
        </u-grid-item>
        <u-grid-item>
          <u-image
            width="300rpx"
            height="300rpx"
            src="https://cxj.zhangjiancong.top/images/cxj/pay/alipay.jpg"
          ></u-image>
          <view class="grid-text">支付宝支付</view>
        </u-grid-item>
      </u-grid>

      <!--      <u-radio-group v-model="payType" :wrap="true">
        <view class="item" @click="payType = '微信'">
          <view class="left">
            <view class="logo">
              <image src="https://cxj.zhangjiancong.top/images/cxj/pay/wxpay.jpg" mode=""></image>
            </view>
            <view class="name">微信</view>
          </view>

          <view class="check">
            <u-radio
              shape="circle"
              :active-color="appThemeColor"
              icon-size="16"
              name="微信"
            ></u-radio>
          </view>
        </view>

        <view class="item" @click="payType = '支付宝'">
          <view class="left">
            <view class="logo">
              <image src="https://cxj.zhangjiancong.top/images/cxj/pay/alipay.jpg" mode=""></image>
            </view>
            <view class="name">支付宝</view>
          </view>
          <view class="check">
            <u-radio
              shape="circle"
              :active-color="appThemeColor"
              icon-size="16"
              name="支付宝"
            ></u-radio>
          </view>
        </view>
      </u-radio-group> -->
    </view>

    <!-- 支付 -->
    <view class="btn">
      <u-button type="gold" shape="circle" @click="goPayResult">
        <!-- <text v-if="payType === '微信'">微信支付</text> -->
        <!-- <text v-if="payType === '支付宝'">支付宝支付</text> -->
        <text>我已支付</text>
        <!-- <text>￥{{ payment }}.00</text> -->
      </u-button>
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { isExceedTime } from "../../../utils/relativeTime.js";

export default {
  data() {
    return {
      payType: "微信",
      appThemeColor: this.$appTheme.appThemeColor,
      payment: 0,
      timestamp: 900,
      orderInfo: {},
    };
  },
  onShow() {
    // 设置当前路由
    const pages = getCurrentPages();
    uni.setStorageSync("previousRoute", pages[pages.length - 1].route);

    this.orderInfo = uni.getStorageSync("orderInfo");
    console.log("要付款的订单信息", this.orderInfo);
    console.log("时间", isExceedTime(this.orderInfo.end_time));
    this.payment = this.orderInfo.payment;

    // 是正值，说明已经超时
    if (isExceedTime(this.orderInfo.end_time) > 0) {
      this.timestamp = 0; // 设置付款倒计时
      if (this.orderInfo.status === 0) {
        this.deleteOrder(this.orderInfo.user_id, this.orderInfo.order_id);
      }
    } else {
      this.timestamp = -isExceedTime(this.orderInfo.end_time); // 设置付款倒计时
    }
  },
  methods: {
    // 倒计时结束，即订单逾期
    end() {
      if (this.orderInfo.status === 0) {
        this.deleteOrder(this.orderInfo.user_id, this.orderInfo.order_id);
      }
    },
    goPayResult() {
      const that = this;
      // 修改过期时间为永远，因为要等待客服检验是否已付款
      this.$u.api
        .updateOrderEnd({
          order_id: this.orderInfo.order_id,
        })
        .then((res) => {
          uni.showToast({
            title: "支付完成，请发送支付相关证明到客服处",
            icon: "none",
            duration: 2000,
            mask: true,
          });

          setTimeout(() => {
            uni.navigateTo({
              url: "/pages-mall/pages/order/list",
            });
          }, 1500);
        });

      // -----------------------------下列代码，等开通微信支付再开启--------------------

      // 更新订单信息——成已支付
      // this.$u.api.updateOrderMes({
      // 	order_id: this.orderInfo.order_id,
      // 	status: 1,
      // 	pay_way: this.payType
      // }).then(res => {
      // 	if (res.affectedRows === 1) {
      // 		console.log("优惠券id", that.orderInfo.coupon_id);
      // 		if (that.orderInfo.coupon_id !== -1) {
      // 			// 删除使用的优惠券
      // 			that.$u.api.deleteCoupon({
      // 				coupon_id: that.orderInfo.coupon_id
      // 			}).then(res2 => {
      // 				if (res2.affectedRows === 1) {
      // 					uni.showToast({
      // 						title: "支付成功",
      // 						icon: "success"
      // 					});
      // 					// 支付成功1s才跳转
      // 					setTimeout(() => {
      // 						uni.redirectTo({
      // 							url: '/pages-mall/pages/order/pay-result?payment=' +
      // 								that.payment
      // 						});
      // 					}, 1000);
      // 				}
      // 			}).catch(err => {
      // 				console.error("删除优惠券失败", err);
      // 			})
      // 		} else {
      // 			// 不使用优惠券，那就直接跳转即可
      // 			if (res.affectedRows === 1) {
      // 				uni.showToast({
      // 					title: "支付成功",
      // 					icon: "success"
      // 				});
      // 				// 支付成功1s才跳转
      // 				setTimeout(() => {
      // 					uni.redirectTo({
      // 						url: '/pages-mall/pages/order/pay-result?payment=' +
      // 							that.payment
      // 					});
      // 				}, 1000);
      // 			}
      // 		}
      // 	}
      // }).catch(err => {
      // 	uni.showToast({
      // 		title: "支付失败",
      // 		icon: "error"
      // 	})
      // 	console.log("失败原因", err);
      // })
    },

    // 删除相应订单的消息
    async deleteOrder(user_id, order_id) {
      // 删除订单
      let task1 = await this.deleteOrderList({
        order_id: order_id,
      });

      // 删除订单信息——购买地址
      let task2 = await this.deleteOrderAddress({
        order_id: order_id,
      });

      // 删除订单信息——订单基本信息
      let task3 = await this.deleteOrderMes({
        order_id: order_id,
      });

      // 删除订单信息——购买物品清单
      let task4 = await this.deleteOrderGoodsList({
        order_id: order_id,
      });

      Promise.all([task1, task2, task3, task4])
        .then((res) => {
          uni.showToast({
            title: "订单因逾期而取消",
          });
          uni.setStorageSync("orderInfo", null);
          // 提交订单成功2s才跳转
          setTimeout(() => {
            uni.navigateTo({
              url: "/pages-mall/pages/order/list",
            });
          }, 2000);
        })
        .catch((err) => {
          uni.showToast({
            title: "订单取消失败",
            icon: "error",
          });
          console.log("失败原因", err);
        });
    },
    // 删除该用户订单
    deleteOrderList(req) {
      return this.$u.api.deleteOrderList({
        order_id: req.order_id,
      });
    },
    // 删除该用户的 相关订单的地址信息
    deleteOrderAddress(req) {
      return this.$u.api.deleteOrderAddress({
        order_id: req.order_id,
      });
    },
    // 删除该用户的 相关订单的基本信息
    deleteOrderMes(req) {
      return this.$u.api.deleteOrderMes({
        order_id: req.order_id,
      });
    },
    // 删除订单id去获取订单的地址信息
    deleteOrderGoodsList(req) {
      return this.$u.api.deleteOrderGoodsList({
        order_id: req.order_id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  background-color: $app-theme-bg-color;
}

.money-show {
  padding: 24rpx 0 48rpx 0;

  .desc {
    width: 100%;
    text-align: center;
    font-size: 24rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #2d2b36;
    margin-bottom: 8rpx;
  }

  .money {
    margin-bottom: 22rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    text:nth-child(1) {
      font-size: 48rpx;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #2d2b36;
    }

    text:nth-child(2) {
      font-size: 72rpx;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #2d2b36;
    }
  }

  .time {
    text-align: center;
    font-size: 24rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #2d2b36;
  }
}

.pay-type {
  padding: 0 30rpx;
  margin-top: 80rpx;

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    font-family: PingFangSCSemibold-, PingFangSCSemibold;
    font-weight: normal;
    color: #2d2b36;
    padding-bottom: 4rpx;
    margin-bottom: 10rpx;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 24rpx;
    padding-top: 26rpx;
    border-bottom: 1rpx solid #efefef;

    .left {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .logo {
        width: 64rpx;
        height: 64rpx;
        margin-right: 30rpx;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .name {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #171717;
      }
    }

    .check {
    }
  }
}

/deep/.u-icon {
  display: flex !important;
}

.btn {
  padding: 0 30rpx;
  position: absolute;
  bottom: 70rpx;
  left: 0;
  width: 100%;
}

.surplus_time {
  display: inline-block;
  margin-right: 20rpx;
}

.grid-text {
  font-size: 28rpx;
  margin-top: 10rpx;
  color: $u-type-info;
}
</style>
