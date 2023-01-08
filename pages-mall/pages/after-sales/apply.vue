<template>
  <view class="page">
    <Navbar title="申请售后" :backFunction="goBack"></Navbar>
    <!-- 商品卡片 -->
    <view class="goods"
      ><OrderGoodsCard :data="orderInfo"></OrderGoodsCard
    ></view>
    <!-- 操作项 -->
    <SelectItem
      v-if="backType == 'home'"
      :ops="selectOps"
      @change="changBackType"
    ></SelectItem>
    <!-- 仅退款 -->
    <BackMoney
      :orderInfo="orderInfo"
      v-if="backType == 'money'"
      @subitAffterSale="subitAffterSale"
    ></BackMoney>
    <!-- 退货退款 -->
    <!-- <BackAll v-if="backType == 'all'"></BackAll> -->
    <BackMoney
      :orderInfo="orderInfo"
      v-if="backType == 'all'"
      @subitAffterSale="subitAffterSale"
    ></BackMoney>
    <!-- 换货 -->
    <BackGoods
      :orderInfo="orderInfo"
      v-if="backType == 'goods'"
      @subitAffterSale="subitAffterSale"
    ></BackGoods>
  </view>
</template>

<script>
// 组件
import OrderGoodsCard from "@/pages-mall/components/order/order-goods-card.vue";
import SelectItem from "@/pages-mall/components/after-sales/select-item.vue";
import BackMoney from "@/pages-mall/components/after-sales/back-money.vue";
import BackAll from "@/pages-mall/components/after-sales/back-all.vue";
import BackGoods from "@/pages-mall/components/after-sales/back-goods.vue";
export default {
  components: {
    OrderGoodsCard,
    SelectItem,
    BackMoney,
    BackAll,
    BackGoods,
  },
  data() {
    return {
      // 选择的售后类型
      backType: "home",
      // 详情
      orderInfo: {},
      // 售后类型的配置项
      selectOps: [
        {
          title: "仅退款",
          desc: "未收到货(包含未签收),或与卖家协商同意前提下",
          icon: require("@/pages-mall/static/select-item-1.png"),
          type: "money",
        },
        {
          title: "退货退款",
          desc: "已收到货(包含未签收),或与卖家协商同意前提下",
          icon: require("@/pages-mall/static/select-item-2.png"),
          type: "all",
        },
        {
          title: "换货",
          desc: "已收到货,需要更换收到的货物",
          icon: require("@/pages-mall/static/select-item-3.png"),
          type: "goods",
        },
      ],
    };
  },
  onLoad() {
    this.orderInfo = uni.getStorageSync("orderInfo");
  },

  methods: {
    // 提交售后
    subitAffterSale(item) {
      console.log("售后", item);

      this.$u.api
        .updateOrderAffterSale({
          order_id: this.orderInfo.order_id,
          affterSale: {
            ...item,
            isAffter: 0,
            affterReason: item.reason,
            affterReasonDetail: item.desc,
          },
        })
        .then((res) => {
          if (res.affectedRows === 1) {
            uni.showToast({
              title: "提交售后成功",
              icon: "success",
            });

            setTimeout(() => {
              uni.navigateTo({
                url: "/pages-mall/pages/order/list",
              });
            }, 1000);
          }
        });
    },
    // 导航栏返回自定义函数
    goBack() {
      if (this.backType == "home") {
        uni.navigateBack({
          delta: 1,
        });
      } else {
        this.backType = "home";
      }
    },

    // 选择售后类型
    changBackType(e) {
      this.backType = e.item.type;
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  padding: 30rpx;
}
.goods {
  border-radius: 16rpx;
  box-shadow: $app-theme-shadow;
  padding: 30rpx;
  margin-bottom: 24rpx;
  background-color: $app-theme-bg-color;
}
</style>
