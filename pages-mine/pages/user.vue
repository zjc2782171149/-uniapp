<template>
  <view class="page">
    <!-- 带背景的透明导航栏 -->
    <NavbarRoundImg
      title="我的数据"
      isBack
      :bgImg="bgImg"
      :backgroundColor="backgroundColor"
    ></NavbarRoundImg>
    <!-- 信息 -->
    <view class="info">
      <view class="avatar">
        <u-avatar size="132" :src="userInfo.icon"></u-avatar>
      </view>
      <view class="name">{{ userInfo.nickname }}</view>
      <view class="num">
        <!-- 				<view class="follow">
					<text>提问数</text>
					<text>20</text>
				</view> -->
        <view class="fans">
          <text>累计记录天数</text>
          <text>{{ totalRecord }}</text>
        </view>
      </view>
      <view class="desc">{{ userInfo.grade }}</view>
      <view class="operate">
        <!-- 				<u-button type="gold" size="small" shape="circle">
					<u-icon name="plus"></u-icon>
					<text>签到</text>
				</u-button> -->
      </view>
    </view>
    <!-- tab -->
    <view class="tabs">
      <Tabs
        itemWidth="200"
        :listData="tabsOps"
        fontSize="34"
        @change="tabsChange"
      ></Tabs>
    </view>
    <!-- 主页 -->
    <view class="item" v-if="currentTab == 0">
      <view class="card">
        <TitleOperate title="基本信息" padding="0"></TitleOperate>
        <view class="line">性别：{{ userInfo.gender }}</view>
        <view class="line">地区：{{ userInfo.province }}</view>
        <view class="line"
          >个人简介：{{
            userInfo.personal_signature || "这个人很懒,没留下什么"
          }}</view
        >
        <view class="line"
          >生日：{{ userInfo.birthday || "生日当然要保密啦" }}</view
        >
      </view>
    </view>
    <view class="item" v-if="currentTab == 1">
      <!--提问卡片-->
      <!-- 回答 -->
      <QuestionList :data="showArticleList"></QuestionList>
    </view>
    <view class="item" v-if="currentTab == 2">
      <!-- 记录卡片 -->
      <RecordList :data="showArticleList"></RecordList>
    </view>
  </view>
</template>

<script>
import Tabs from "@/components/tabs.vue";
import NavbarRoundImg from "@/components/navbar/navbar-round-img.vue";
import TitleOperate from "@/components/title-operate.vue";
import QuestionList from "../components/question-list.vue";
import RecordList from "../components/record-list.vue";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/zh-cn";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.locale("zh-cn");

export default {
  components: {
    Tabs,
    NavbarRoundImg,
    TitleOperate,
    QuestionList,
    RecordList,
  },
  data() {
    return {
      bgImg: "https://cxj.zhangjiancong.top/images/cxj/mine/bg.webp",
      backgroundColor: "rgba(0,0,0,0)",
      // tabs
      currentTab: 0,
      tabsOps: [
        {
          text: "主页",
        },
        {
          text: "提问",
        },
        {
          text: "记录",
        },
      ],
      userInfo: {},
      articleList: [],
      showArticleList: [],
      type: 0,
      totalRecord: 0,
    };
  },
  onLoad(options) {},
  onShow() {
    this.initUser();
    this.initArticleList();
  },
  onPageScroll(e) {
    if (e.scrollTop > 10) {
      this.backgroundColor = "";
    } else {
      this.backgroundColor = "rgba(0,0,0,0)";
    }
  },
  methods: {
    async initUser() {
      const info = uni.getStorageSync("userInfo");
      console.log(info);
      this.userInfo = {
        ...info,
        birthday: dayjs(info.birthday).format().slice(0, 10),
        province: info.province.slice(0, info.province.length - 1),
      };
    },
    // 切换 tab 回调
    tabsChange(e) {
      this.currentTab = e;

      if (e === 0) return;
      else if (e === 1) this.type = 0;
      else if (e === 2) this.type = 2;

      const that = this;
      const user_id = this.userInfo.user_id;
      this.showArticleList = [];
      this.articleList.map((item) => {
        if (item.type === this.type) {
          that.showArticleList.push({
            ...item,
            publish_time: dayjs(item.publish_time).fromNow(),
          });
        }
      });
    },
    async initArticleList() {
      const res = await this.$u.api.getArticleAll();

	  const res2 = res.map((item, index) => {
	    return {
	      ...item,
	      publish_time: getApp().globalData.getNowTime(
	        dayjs(item.publish_time).format()
	      ),
	    };
	  });
      this.articleList = res2.reverse(); // 反转，最新发的在前面

      this.totalRecord = 0;
      this.articleList.map((item) => {
        if (item.type === 2) this.totalRecord++;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
  position: relative;
  // background-color: $app-theme-bg-color;
  background-color: $app-theme-bg-color;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 180rpx 30rpx 30rpx 30rpx;
  border-radius: 16rpx;
  box-shadow: $app-theme-shadow;
  padding-bottom: 5rpx;

  .avatar {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 6rpx solid $app-theme-bg-color;
    border-radius: 50%;
    overflow: hidden;
  }

  .name {
    padding-top: 100rpx;
    font-size: 40rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: $app-theme-text-black-color;
    width: 100%;
    text-align: center;
  }

  .num {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20rpx;

    .follow,
    .fans {
      text:nth-child(1) {
        font-size: 25rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: $app-theme-text-black-color;
        margin-right: 4rpx;
      }

      text:nth-child(2) {
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
        color: $app-theme-color;
      }
    }

    .follow {
      margin-right: 60rpx;
    }
  }

  .desc {
    padding-top: 20rpx;
    width: 100%;
    text-align: center;
    font-size: 22rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $app-theme-card-gray-deep-color;
  }

  .operate {
    padding: 40rpx 0;
  }
}

.tabs {
  display: flex;
  align-items: center;
  justify-content: center;
}

.item {
  padding: 30rpx;
}

.card {
  margin-bottom: 30rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: $app-theme-shadow;
  background-color: $app-theme-bg-color;
  overflow: hidden;

  .line {
    margin-top: 26rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $app-theme-navbar-tab-color;
  }
}
</style>
