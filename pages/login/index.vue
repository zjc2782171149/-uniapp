<template>
	<view class="page">
		<!-- 自定义头部 navbar -->
		<u-navbar back-icon-name="arrow-left" title=" " :custom-back="navbarBack"
			:background="{ backgroundColor: 'rgba(0,0,0,0)' }" :border-bottom="false" :is-back="pageStatus != 'home'">
		</u-navbar>

		<!-- logo -->
		<view class="logo-wrap" v-if="
        pageStatus == 'home' ||
        pageStatus == 'getWxRole' ||
        pageStatus == 'loginByCode'
      ">
			<image class="logo" src="https://cxj.zhangjiancong.top/images/cxj/logo/logo.png"></image>
			<view class="app-name">欢迎使用 茶小橘</view>
		</view>

		<!-- 默认登录页面显示 -->
		<view style="width: 100%" v-if="pageStatus == 'home'">
			<view class="text-area" @click="getWxLoginRole(1)">微信用户一键登录</view>
			<!-- 
					<u-button :custom-style="customStyle" open-type="getUserInfo" @getuserinfo="getUserInfoByWx">
		个人信息</u-button> -->

			<view class="login" @click="loginByCode">手机号登录/注册</view>
		</view>

		<!-- 微信授权登录，获取用户信息 -->
		<view style="width: 100%" v-if="pageStatus == 'getWxRole'">
			<view class="info">为提供优质服务,需要获取你的以下信息 :</view>
			<view class="public">
				<view class="public-dot"></view>
				<view class="public-text">你的公开信息(头像、昵称等)</view>
			</view>
			<view class="text-enter" @click="getWxLoginRole(1)">授权进入</view>
		</view>


		<!-- 手机号验证码登录 -->
		<view class="loginSmsCode" v-if="pageStatus == 'loginByCode'">
			<u-form :model="loginCodeForm" ref="loginCodeForm">
				<u-form-item :border-bottom="true">
					<u-input v-model="loginCodeForm.phone" placeholder="请输入手机号"
						placeholder-style="color: #ccc; fontSize: 30rpx" />
				</u-form-item>
				<u-form-item :border-bottom="true">
					<view style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
						<u-input style="width: 60%" v-model="loginCodeForm.smsCode" placeholder="请输入验证码"
							placeholder-style="color: #ccc; fontSize: 30rpx" />
						<view class="smscode" @click="getCode" v-if="!codeOPS.isGetting">
							{{ codeOPS.getted ? "重新获取验证码" : "获取验证码" }}
						</view>
						<view class="smscode" v-else>{{ codeOPS.countDownTime }}s</view>
					</view>
				</u-form-item>
			</u-form>
			<view style="padding-top: 64rpx">
				<u-button :disabled="!loginCodeForm.phone || !loginCodeForm.smsCode" type="gold" shape="circle"
					@click="getWxLoginRole(0)">登录</u-button>
			</view>
		</view>

		<!-- 协议勾选 -->
		<view class="agree" v-if="
        pageStatus == 'home' ||
        pageStatus == 'getWxRole' ||
        pageStatus == 'loginByCode'
      ">
			<view class="agree_img" @click="changeAgreeFlag" v-show="!agree_flag">
				<image src="https://cxj.zhangjiancong.top/images/cxj/operate/check.png"></image>
			</view>
			<view class="agree_img" @click="changeAgreeFlag" v-show="agree_flag">
				<image src="https://cxj.zhangjiancong.top/images/cxj/operate/checked.png"></image>
			</view>
			<view class="agree_text">
				登录代表您已同意
				<span>《用户服务协议》《隐私权政策》</span>
			</view>
		</view>
	</view>
</template>

<script>
	import FunUniappTheme from "@/theme.scss";
	import {
		checkTelephone
	} from "@/utils/phone.js";

	export default {
		data() {
			return {
				// 页面状态，默认为 home
				// getWxRole：获取微信权限页，loginByWx：微信授权登录页
				// loginByCode：手机号+验证码登录页，loginByPwd：手机号+密码登录
				// forgetPwd：找回密码页面，resetPwd，重置密码页面
				pageStatus: "home",
				// 协议是否勾选
				agree_flag: false,
				// 微信授权的用户信息
				wxLoginUserInfo: {},
				// openid
				openId: "",
				// 系统内用户信息
				userInfo: {},
				// 手机号验证码登录表单
				loginCodeForm: {
					phone: null,
					smsCode: null,
				},
				// 表单验证
				loginCodeFormRules: {
					phone: [{
							required: true,
							message: "请输入手机号",
							trigger: ["change", "blur"],
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: "手机号码不正确",
							trigger: ["change", "blur"],
						},
					],
					smsCode: [{
						required: true,
						message: "请输入验证码",
						trigger: ["change", "blur"],
					}, ],
				},
				// 获取验证码倒计时
				codeOPS: {
					countDownTime: 60,
					isGetting: false,
					getted: false,
					timer: null,
				},
				customStyle: {
					width: "100%",
					height: "96rpx",
					background: "rgb(167, 125, 80)",
					fontWeight: "400",
					borderRadius: "56rpx",
					color: "#ffffff",
					lineHeight: "16px",
					fontSize: "32rpx",
					textAlign: "center",
					lineHeight: "96rpx",
				},
			};
		},
		onLoad() {
			// console.log(FunUniappTheme);
			uni.removeStorageSync("IS_LOGIN");
			uni.removeStorageSync("token");
			uni.removeStorageSync("userInfo");
		},
		onReady() {
			if (this.pageStatus == "loginByCode") {
				this.$refs.loginCodeForm.setRules(this.loginCodeFormRules);
			}
		},
		methods: {
			// 勾选/取消用于协议
			changeAgreeFlag() {
				this.agree_flag = !this.agree_flag;
			},

			// 微信登录
			loginByWx() {
				if (!this.agree_flag) {
					uni.showToast({
						icon: "none",
						title: "请先阅读并勾选协议",
					});
					return;
				}
				this.pageStatus = "getWxRole";
			},

			// 自定义navbar的返回方法
			navbarBack() {
				if (
					this.pageStatus == "getWxRole" ||
					this.pageStatus == "loginByWx" ||
					this.pageStatus == "loginByCode"
				) {
					this.pageStatus = "home";
				} else if (
					this.pageStatus == "forgetPwd" ||
					this.pageStatus == "resetPwd"
				) {
					this.pageStatus = "loginByPwd";
				} else if (this.pageStatus == "loginByPwd") {
					this.pageStatus = "loginByCode";
				}
			},

			// 微信授权
			getWxLoginRole(flag) {
				if (!this.agree_flag) {
					uni.showToast({
						icon: "none",
						title: "请先阅读并勾选协议",
					});
					return;
				}

				// 如果是一键登录，那就清空输入的手机号
				const that = this;
				if (flag === 1) {
					this.loginCodeForm = {
						phone: null,
						smsCode: null,
					};
					uni.showModal({
						title: '提示',
						content: '是否授权用户信息？',
						confirmColor: that.$appTheme.appThemeColor,
						success: function(res) {
							if (res.confirm) {
								// 一进来小程序，直接登录，如果登录返回的code给后端检查到不是首次登录那就直接去主页，否则就先弹出 “首次进入” 的提示再去首页
								that.getWxCode((code) => {
									that.getOpenId(code, (res) => {});
								});

							}
						}
					});
				} else {
					// 手机号验证码，那就直接登录
					this.getWxCode((code) => {
						that.getOpenId(code, (res) => {});
					});
				}


			},

			// 基于uni的获取code方法
			getWxCode(callBack) {
				uni.login({
					provider: "weixin",
					onlyAuthorize: true,
					success: (loginRes) => {
						callBack(loginRes.code);
					},
					fail(e) {},
				});
			},

			// 获取openId
			getOpenId(code, callBack) {
				this.$u.api
					.getOpenId({
						code: code, // openid
						phone: this.loginCodeForm.phone,
						smsCode: this.loginCodeForm.smsCode, // 验证码
					})
					.then((res) => {
						console.log(res);
						if (res.message === "验证码错误") {
							uni.showToast({
								title: "验证码错误",
								icon: "error",
							});
						} else {
							uni.setStorageSync("token", res.token);
							uni.setStorageSync("userInfo", res.userInfo);
							uni.setStorageSync("IS_LOGIN", true);
							uni.showToast({
								title: res.message,
								icon: "success",
								mask: true
							});

							setTimeout(function() {
								// 第一次登录，跳转到欢迎的页面
								if (res.message === "注册成功") {
									uni.reLaunch({
										url: "/pages/first/index",
									});
								} else {
									uni.reLaunch({
										url: "/pages/home/index",
									});
								}
							}, 1000);

						}
					});
			},

			// 获取个人信息
			getUserInfoByWx(e) {
				console.log("用户加密数据", e.detail);
				let that = this;

				uni.login({
					provider: "weixin",
					onlyAuthorize: true,
					success: (loginRes) => {
						this.$u.api
							.getAuth({
								encryptedData: e.detail.encryptedData,
								iv: e.detail.iv,
								code: loginRes.code,
							})
							.then((res) => {
								console.log(res);
							});
					},
					fail(e) {},
				});

				// const p = this.getSetting();
				// p.then(isAuth => {
				// 	console.log("是否授权", isAuth);
				// 	if(isAuth) {
				// 		uni.getUserProfile({
				// 			desc: '获取你的昵称、头像',
				// 			success: function(data) {
				// 				const authInfo = JSON.parse(data.detail.reawData);
				// 				console.log("用户加密数据", authInfo);
				// 				that.$u.api.getAuth({
				// 					...authInfo
				// 				}).then(res => {

				// 				})
				// 				// uni.setStorageSync({
				// 				// 	key: 'APP_WX_USERINFO',
				// 				// 	data: data
				// 				// });
				// 				// that.wxLoginUserInfo = data;
				// 				// that.pageStatus = 'loginByWx';
				// 				// callBack();
				// 			},
				// 			fail: function(error) {}
				// 		});
				// 	}
				// })
			},

			// 获取用户当前设置，是否授权
			getSetting() {
				return new Promise((resolve, reject) => {
					uni.getSetting({
						success(res) {
							if (res.authSetting["scope.userInfo"]) {
								console.log("存在");
								resolve(true);
							} else {
								console.log("不存在");
								resolve(false);
							}
						},
					});
				}).catch((err) => {
					console.error(err);
				});
			},

			// 获取手机号回调
			decryptPhoneNumber(e) {
				console.log("手机号回调", e);
				// uni.showModal({
				// 	title: '提示',
				// 	content: '由于没有企业认证，无法获取手机号，开发模式先暂时放开登录入口',
				// 	complete: () => {
				// 		uni.setStorageSync('IS_LOGIN', true);
				// 		uni.reLaunch({
				// 			url: '/pages/home/index'
				// 		});
				// 	}
				// });
			},

			// 手机号+验证码登录
			loginByCode() {
				this.pageStatus = "loginByCode";
			},

			// 获取验证码
			getCode() {
				if (!checkTelephone(this.loginCodeForm.phone)) {
					uni.showToast({
						icon: "none",
						title: "请输入正确的手机号",
					});
					return;
				}

				uni.showLoading({
					title: "正在获取验证码",
				});

				this.$u.api
					.getPhoneCode(this.loginCodeForm.phone)
					.then((res) => {
						if (res.message === "发送成功") {
							uni.showToast({
								title: res.message,
								icon: "success",
							});

							this.codeOPS.isGetting = true;
							this.codeOPS.getted = true;
							this.codeOPS.timer = setInterval(() => {
								if (
									this.codeOPS.countDownTime > 0 &&
									this.codeOPS.countDownTime <= 60
								) {
									this.codeOPS.countDownTime--;
								} else {
									this.resetCountDown(false);
								}
							}, 1000);
						} else {
							uni.showToast({
								title: res.message,
								icon: "none",
							});
						}

						uni.hideLoading();
					})
					.catch((err) => {
						console.error(err);
						uni.hideLoading();
					});
			},

			// 倒计时初始化
			resetCountDown(isInit) {
				clearInterval(this.codeOPS.timer);
				this.codeOPS = {
					countDownTime: 60,
					isGetting: false,
					getted: isInit ? false : true,
					timer: null,
				};
				this.$forceUpdate();
			},

			// 手机号登录方法，分为验证码和密码两种
			login(type) {
				this.$u.api
					.getOpenId({
						phone: this.loginCodeForm.phone,
						smsCode: this.loginCodeForm.smsCode,
					})
					.then((res) => {
						console.log(res);
						uni.setStorageSync("token", res.token);
						uni.setStorageSync("userInfo", res.userInfo);
						uni.setStorageSync("IS_LOGIN", true);

						// 第一次登录，跳转到欢迎的页面
						if (res.message === "注册成功") {
							uni.reLaunch({
								url: "/pages/first/index",
							});
						} else {
							uni.reLaunch({
								url: "/pages/home/index",
							});
						}
					})
					.catch((err) => {
						console.error(err);
					});

				// if (type == 'code') {
				// 	this.$refs.loginCodeForm.validate(valid => {
				// 		if (valid) {

				// 		}
				// 	});
				// }
			},
		},
	};
</script>

<style lang="scss" scoped>
	.page {
		padding: 0 40rpx;
		background-color: $app-theme-bg-color;
	}

	.logo-wrap {
		display: flex;
		justify-content: center;
		padding-top: 100rpx;
		padding-bottom: 240rpx;
		flex-wrap: wrap;

		.logo {
			height: 220rpx;
			width: 220rpx;
		}

		.app-name {
			width: 100%;
			padding-top: 40rpx;
			text-align: center;
			font-size: 44rpx;
			font-weight: 500;
			color: $app-theme-text-black-color;
		}
	}

	.text-area {
		width: 100%;
		height: 96rpx;
		background: $app-theme-color;
		font-weight: 400;
		border-radius: 56rpx;
		color: $app-theme-text-white-color;
		line-height: 16px;
		font-size: 32rpx;
		text-align: center;
		line-height: 96rpx;
	}

	.info {
		font-size: 28rpx;
		font-weight: 400;
		color: $app-theme-text-black-color;
		line-height: 28rpx;
		margin-top: 180rpx;
	}

	.public {
		display: flex;
		align-items: center;
		margin-top: 30rpx;

		.public-dot {
			width: 6rpx;
			height: 6rpx;
			background: #999999;
			margin-right: 10rpx;
		}

		.public-text {
			font-size: 24rpx;
			font-weight: 400;
			color: #8f92a1;
			line-height: 24rpx;
		}
	}

	.text-enter {
		width: 100%;
		margin-top: 50rpx;
		height: 96rpx;
		background: $app-theme-color;
		font-weight: 400;
		border-radius: 56rpx;
		color: #ffffff;
		line-height: 16px;
		font-size: 32rpx;
		text-align: center;
		line-height: 96rpx;
	}

	.head {
		margin-top: 70rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.back {
		width: 40rpx;
		height: 40rpx;
	}

	.login {
		text-align: center;
		font-size: 32rpx;
		font-weight: 400;
		color: $app-theme-color;
		line-height: 32rpx;
		margin-top: 48rpx;
	}

	.agree {
		position: fixed;
		left: 50%;
		transform: translate(-50%, 0);
		bottom: 66rpx;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.agree_img image {
		width: 32rpx;
		height: 32rpx;
		display: flex;
		align-items: center;
	}

	.agree_text {
		margin-left: 8rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #8f92a1;
		line-height: 24rpx;
		display: flex;
		align-items: center;

		span {
			color: $app-theme-color;
		}
	}

	.loginWx {
		width: 100%;
		padding-top: 64rpx;

		.title {
			text-align: left;
			font-size: 22px;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #171717;
			line-height: 30px;
			margin-bottom: 12rpx;
		}

		.desc {
			text-align: left;
			font-size: 14px;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #8f92a1;
			line-height: 14px;
		}

		.avatar {
			width: 160rpx;
			height: 160rpx;
			overflow: hidden;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 128rpx auto 160rpx auto;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.loginSmsCode {
		width: 100%;
	}

	.smscode {
		font-size: 28rpx;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: 400;
		color: $app-theme-color;
		line-height: 28rpx;
	}
</style>
