<template>
	<view class="page">
		<!-- 自定义头部 navbar -->
		<u-navbar back-icon-name="arrow-left" title=" 用户登录" :custom-back="navbarBack"
			:background="{ backgroundColor: 'rgba(0,0,0,0)' }" :border-bottom="false" :is-back="pageStatus != 'home'">
		</u-navbar>

		<!-- logo -->
		<view class="logo-wrap" v-if="
        pageStatus == 'home' ||
        pageStatus == 'getWxRole' ||
        pageStatus == 'loginByCode'
      ">
			<image class="logo" src="https://eggplantrabbit.zhangjiancong.top/images/eggplantrabbit/eggplantrabbit_home.jpg"></image>
			<view class="app-name">欢迎来到 茄兔小屋！</view>
		</view>

		<u-modal title="绿美阅行用户服务协议/隐私权政策" v-model="statusShow" content="" @confirm="confirm" :show-cancel-button="true"
			confirm-text="确认授权">
			<div class="modal">
				<p>欢迎您使用我们的微信小程序服务。在使用我们的服务前,请您仔细阅读以下服务条款。如果您不同意本协议的任何内容,请勿使用我们的服务。一旦您使用我们的服务,即表示您已了解并完全同意本协议项下的全部条款。
				</p>

				<p class="title">一、服务内容</p>
				<p>1.1 我们的微信小程序提供了 [描述小程序提供的服务,如资讯、工具、交易等] 服务。</p>
				<p>1.2 我们有权随时变更、中断或终止部分或全部服务,且无需事先通知您。</p>

				<p class="title">二、用户账号</p>
				<p>2.1 您可以使用微信账号直接登录小程序。</p>
				<p>2.2 您应对通过您的账号发生的所有活动负责。</p>
				<p>2.3 您同意不将您的账号信息披露、出借或转让给他人使用。</p>

				<p class="title">三、用户隐私</p>
				<p>3.1 我们重视用户的隐私保护,您在使用小程序时提供的个人信息,我们将根据《隐私政策》进行收集、使用和保护。</p>
				<p>3.2 未经您的同意,我们不会向第三方披露您的个人信息,但法律法规要求及特定情况除外。</p>

				<p class="title">四、知识产权</p>
				<p>4.1 小程序的所有知识产权归我们所有。未经我们书面许可,您不得复制、修改、传播小程序中的任何内容。</p>
				<p>4.2 您通过小程序发布的内容仅代表您个人观点,并由您承担相应的法律责任。</p>

				<p class="title">五、免责声明 </p>
				<p>5.1 您明确同意使用本服务的风险由您个人承担。</p>
				<p>5.2 我们不对任何直接、间接或偶然的损害承担责任,包括但不限于利润损失、商誉损失等。</p>

				<p class="title">六、法律适用和管辖</p>
				<p>6.1 本协议的解释、效力等事项,均适用中华人民共和国法律。</p>
				<p>6.2 若您和我们发生任何纠纷,应友好协商解决。协商不成的,任何一方均可向我们所在地的人民法院提起诉讼。</p>

				<p class="title">七、其他</p>
				<p>7.1 如本协议中的任何条款无论因何种原因完全或部分无效,其余条款仍应有效且具有约束力。</p>
				<p>7.2 本协议条款的解释权归我们所有。我们保留随时修改本协议的权利,修改后的协议一经公布即代替原协议。</p>
			</div>


		</u-modal>



		<!-- 注册时选择的头像和昵称 -->
		<u-modal title="头像和昵称选择" v-model="firstShow" content="" @confirm="selectInfo" confirm-text="开始使用">
			<div class="modal">
				<p>欢迎使用绿美阅行小程序，请设置您的头像和昵称。若不作修改，则使用系统默认头像和昵称</p>
				<div class="avatar_text">请点击下方默认头像进行更换</div>
				<div class="avatar_button">
					<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
						<div class="avatar">
							<image style="width:200rpx;height:200rpx" :src="avatarUrl"></image>
						</div>
					</button>
				</div>

				<div class="avatar_text">昵称</div>
				<input width="400rpx" type="nickname" class="weui-input" placeholder="请输入昵称(默认:绿美阅行新用户)"
					@blur="setNickname" />

			</div>


		</u-modal>



		<!-- 默认登录页面显示 -->
		<view v-if="pageStatus === 'home'" style="width: 100%" class="text-area" @click="getWxLoginRole(1)">微信用户一键登录</view>
		<!-- <view class="login" v-if="pageStatus === 'home'" @click="loginByCode">手机号登录/注册</view> -->
		
	<!-- 	<view style="width: 100%" v-if="pageStatus === 'home'">
			<view class="text-area" @click="getWxLoginRole(1)">微信用户一键登录</view>

			<view class="login" v-if="pageStatus === 'home'" @click="loginByCode">手机号登录/注册</view>
		</view> -->
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
		<view class="loginSmsCode" v-if="pageStatus === 'loginByCode'">
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
				<u-button :disabled="!loginCodeForm.phone || !loginCodeForm.smsCode" type="success" shape="circle"
					@click="getWxLoginRole(0)">登录</u-button>
				<view class="login" v-if="pageStatus === 'loginByCode'" @click="loginByEasy">微信用户一键登录</view>
			</view>
		</view>

		<div class="bottom">
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
					<span @click="openModal">《用户服务协议》</span>
				</view>
			</view>
		</div>
     
		<view class="login" v-if="pageStatus === 'home'" @click="loginByCode">
		<view class="else" style="width: 100%" >其他方式登录</view>
			<div class="loginIcon">
				<u-icon size="55" name="https://cdn.static.zhangjiancong.top/public/icons/phone_code.png"></u-icon>
			</div>
			<div class="loginText">
				验证码登录
			</div>
			
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
				token: "",
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
					countDownTime: 600,
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
				statusShow: false,
				firstShow: false, // 注册时显示头像昵称初始化
				avatarUrl: "https://cdn.static.zhangjiancong.top/public/images/icon.png",
				nickname: '绿美阅行新用户',
				uploadUrl: 'https://plantwalk.zhangjiancong.top/api/plantwalk/upload',

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
			openModal() {
				this.statusShow = true;
			},

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

			confirm() {
				uni.showLoading({
					title: '登录中，请稍后',
					mask: true
				});

				this.agree_flag = true;
				this.getWxCode((code) => {
					this.getOpenId(code, (res) => {});
				});

				// uni.getUserProfile({
				// 	desc: '获取你的昵称、头像',
				// 	success: function(data) {
				// 		console.log("用户加密数据", data);
				// 		// const authInfo = JSON.parse(data.detail.reawData);
				// 		// console.log("用户加密数据", authInfo);
				// 		// that.$u.api.getAuth({
				// 		// 	...authInfo
				// 		// }).then(res => {

				// 		// })
				// 		// uni.setStorageSync({
				// 		// 	key: 'APP_WX_USERINFO',
				// 		// 	data: data
				// 		// });
				// 		// that.wxLoginUserInfo = data;
				// 		// that.pageStatus = 'loginByWx';
				// 		// callBack();
				// 	},
				// 	fail: function(error) {}
				// });


			},

			// 微信授权
			getWxLoginRole(flag) {
				uni.showLoading({
					title: '登录中，请稍后',
					mask: true
				});

				const that = this;

				if (!this.agree_flag) {
					uni.hideLoading();

					uni.showToast({
						icon: "none",
						title: "请先阅读并勾选协议",
					});

					that.statusShow = true;
					return;
				} else {
					// 一键登录要清空手机号
					if (flag === 1) {
						that.loginCodeForm = {
							phone: null,
							smsCode: null,
						};
					}
					
					that.getWxCode((code) => {
						that.getOpenId(code, (res) => {});
					});

					return;
				}


			},

			// 基于uni的获取code方法
			getWxCode(callBack) {
				uni.login({
					provider: "weixin",
					onlyAuthorize: true,
					success: (loginRes) => {
						console.log("登录code");
						callBack(loginRes.code);
					},
					fail(e) {},
				});
			},

			// 获取openId
			getOpenId(code, callBack) {
				const that = this;

				this.$u.api
					.getOpenId({
						code: code, // openid
						phone: this.loginCodeForm.phone,
						smsCode: this.loginCodeForm.smsCode, // 验证码
					})
					.then((res) => {
						console.log(res);
						if (res.message === "验证码错误") {
							uni.hideLoading();

							uni.showToast({
								title: "验证码错误",
								icon: "error",
							});
						} else if (res.message === '注册成功') {
							uni.hideLoading();

							uni.setStorageSync("token", res.token);
							uni.setStorageSync("userInfo", res.userInfo);
							uni.setStorageSync("IS_LOGIN", true);
							uni.showToast({
								title: res.message,
								icon: "success",
								mask: true
							});

							that.token = res.token;
							that.userInfo = res.userInfo;

							setTimeout(function() {
								// 第一次登录，跳转修改头像和昵称界面
								that.firstShow = true;
							}, 1000);

						} else if (res.message === '登录成功') {
							uni.hideLoading();

							uni.setStorageSync("token", res.token);
							uni.setStorageSync("userInfo", res.userInfo);
							uni.setStorageSync("IS_LOGIN", true);
							uni.showToast({
								title: res.message,
								icon: "success",
								mask: true
							});

							that.token = res.token;
							that.userInfo = res.userInfo;


							setTimeout(function() {
								uni.reLaunch({
									url: "/pages/home/index",
								});
							}, 1000);

						} else {
							uni.showToast({
								title: '登录失败',
								icon: "error",
								mask: true
							});
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
			
			// 一键登录
			loginByEasy() {
				this.pageStatus = "home";
				this.loginCodeForm = {};
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
									this.codeOPS.countDownTime <= 600
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
					countDownTime: 600,
					isGetting: false,
					getted: isInit ? false : true,
					timer: null,
				};
				this.$forceUpdate();
			},

			// 手机号登录方法，分为验证码和密码两种
			login(type) {
				const that = this;

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

						that.token = res.token;
						that.userInfo = res.userInfo;

						// 第一次登录，跳转到欢迎的页面
						uni.reLaunch({
							url: "/pages/home/index",
						});
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

			onChooseAvatar(e) {
				const {
					avatarUrl
				} = e.detail;
				this.avatarUrl = avatarUrl;
			},

			setNickname(e) {
				console.log(e.detail.value);
				this.nickname = e.detail.value;
			},

			selectInfo() {
				const that = this;

				if (this.avatarUrl === 'https://cdn.static.zhangjiancong.top/public/images/icon.png' && this.nickname ===
					'绿美阅行新用户') {
					// 使用系统默认头像和昵称，直接登录即可，无需修改注册信息
					uni.showToast({
						title: "登录成功",
						icon: "success",
					});

					setTimeout(() => {
						uni.switchTab({
							url: "/pages/home/index",
						});
					}, 1000);

				} else {
					// 需修改用户昵称和头像
					// this.$refs.uUpload.upload(); // 先将头像临时路径转为永久路径
					wx.uploadFile({
						url: 'https://plantwalk.zhangjiancong.top/api/plantwalk/upload', // 服务端地址
						filePath: that.avatarUrl, // 要上传的图片临时路径
						name: 'file', // 文件对应的key
						success: res => {
							console.log('上传成功', res, JSON.parse(res.data));
							const data = JSON.parse(res.data);

							this.$u.api
								.updateUserInfo({
									openid: this.userInfo.openid,
									nickname: this.nickname,
									icon: data.data.identify_img,
								})
								.then((res) => {
									uni.showToast({
										title: "登录成功",
										icon: "success",
									});

									setTimeout(() => {
										uni.switchTab({
											url: "/pages/home/index",
										});
									}, 1000);

								}).catch(err => {
									console.error(err);
									uni.showToast({
										title: "请联系开发人员",
										icon: "error",
									});
								})


						},
						fail: err => {
							console.error('上传失败', err)
						}
					})




				}
			}

		},
	};
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
