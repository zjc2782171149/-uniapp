<template>
  <div class="slot">
    <!-- 每日喝茶记录 -->
    <u-cell-group>
      <div class="cell" v-for="(item, index) in data" :key="item.article_id">
        <u-cell-item :arrow="false" class="cell-item">
          <div slot="title" class="cell-main">
            <div class="cell-author">
              <image class="cell-icon" :src="item.icon"></image>

              <div class="cell-nickname">{{ item.nickname }}</div>
              <div class="cell-rank">{{ item.publish_time }}</div>
            </div>

            <div :class="['cell-profile', item.img ? 'profile_max' : '']">
              {{ item.content }}
            </div>
          </div>

          <div class="cell-image">
            <u-image
              v-if="item.img"
              width="210rpx"
              height="150rpx"
              :src="item.img"
              border-radius="20rpx"
            ></u-image>
          </div>
        </u-cell-item>
      </div>
    </u-cell-group>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: [],
    },
    type: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      appThemeColor: this.$appTheme.appThemeColor,
    };
  },
  methods: {
    turnArticleDetail(item) {
      uni.navigateTo({
        url:
          "/pages/find/answer-detail?id=" +
          item.article_id +
          "&index=" +
          this.type,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cell {
  border-top: 12rpx solid rgb(221, 195, 135);
  padding-bottom: 10rpx;

  .cell-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cell-main {
    padding: 0 10rpx 0 20rpx;
    letter-spacing: 5rpx;
    .cell-title {
      color: #000;
      font-weight: 600;
      font-size: 35rpx;
    }

    .cell-author {
      display: flex;
      margin: 10rpx 0;
      color: rgb(147, 147, 147);

      .cell-icon {
        width: 50rpx;
        height: 50rpx;
        background-size: 100% 100%;
        border-radius: 50%;
      }

      .cell-nickname {
        margin: 0 15rpx;
        font-weight: 600;
      }

      .cell-rank {
        font-size: 16rpx;
        margin: 5rpx 0 0 10rpx;
      }
    }

    .cell-content,
    .cell-profile {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 4; // 显示2行
      -webkit-box-orient: vertical;
      word-break: break-all;
    }

    .cell-content {
      font-weight: 600;
      line-height: 37rpx;
    }

    .cell-profile {
      line-height: 40rpx;

      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 4; // 显示2行
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
  }

  .cell-image {
    position: absolute;
    right: 25rpx;
    top: 50%;
    margin-top: -75rpx;
    width: 210rpx;
    height: 150rpx;
    border-radius: 20rpx;
  }
}

.daily-tea {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 34rpx;
  // color: rgb(252, 162, 66);
  font-weight: 600;
  margin: 0 0 20rpx 0;
}
.profile_max {
  max-width: 400rpx;
}
</style>
