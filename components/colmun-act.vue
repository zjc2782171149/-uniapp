<template>
  <view class="slot">
   <view
      class="item"
      v-for="(item, index) in list"
      :key="item.act_id"
      @click="
        $u.route({ url: '/pages/actDetail/index', params: { url: item.url } })
      "
    >
      <view class="title">
        <image
          src="https://cxj.zhangjiancong.top/images/cxj/bg/bg-community.png"
        ></image>
        <text>{{ item.title }}</text>
      </view>
      <view class="info">
        <image
          src="https://cxj.zhangjiancong.top/images/cxj/bg/bg-user.png"
        ></image>
        <view class="num">
          <text>{{ item.num }}</text>
          <text>人参与</text>
        </view>
      </view>
      <u-image
        class="bg"
        width="587.5rpx"
        height="250rpx"
        :src="item.pics"
      ></u-image>
    </view>
	
	<NoData height="35vh" type="good" v-if="list.length === 0"></NoData>
	
  </view>
</template>

<script>
export default {
  name: "colmun-act",
  props: {
    // 列表
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.slot {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  width: 100%;

  .scroll {
    width: 100%;
    white-space: nowrap;
  }

  .item {
    width: 587.5rpx; // 2.35:1
    height: 250rpx;
    position: relative;
    border-radius: 12rpx;
    overflow: hidden;
    margin-bottom: 50rpx;

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 12rpx;
      overflow: hidden;
      z-index: 19;
    }

    .title {
      width: calc(100% - 48rpx);
      position: absolute;
      left: 24rpx;
      top: 24rpx;
      z-index: 39;
	  text-shadow: 1px 3px 3px #513c3c;

      image {
        vertical-align: middle;
        padding-right: 4rpx;
        width: 32rpx;
        height: 32rpx;
      }

      text {
        vertical-align: middle;
        font-size: 28rpx;
        font-weight: 500;
        color: #ffffff;
        line-height: 44rpx;
        white-space: pre-wrap;
      }
    }

    .info {
      display: flex;
      align-items: center;
      position: absolute;
      left: 24rpx;
      bottom: 24rpx;
      z-index: 39;
      image {
        width: 26rpx;
        height: 24rpx;
        margin-right: 8rpx;
        vertical-align: middle;
      }

      .num {
        vertical-align: middle;
        font-size: 20rpx;
        font-weight: 500;
        color: #ffffff;
        line-height: 44rpx;
		text-shadow: 1px 3px 3px #513c3c;

        text:nth-child(1) {
          vertical-align: middle;
          font-weight: bold;
          color: #f6f6f6;
          font-size: 28rpx;
          line-height: 2;
        }

        text:nth-child(2) {
          vertical-align: bottom;
          font-weight: bold;
          color: #f6f6f6;
          font-size: 20rpx;
          line-height: 2.6;
        }
      }
    }
  }
}
</style>
