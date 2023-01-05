<template>
	<view class="page">
		<!-- 导航栏 -->
		<Navbar title="个人中心"></Navbar>
		<!-- 表单 -->
		<view class="form">
			<u-form label-position="left" ref="form" label-width="180rpx">
				<u-form-item label="头像">
					<view class="value" @click="uploadAvatar">
						<u-avatar style="height: 72rpx;" size="72"
							:src="icon === '' ? '../../../static/user/1.png' : icon"></u-avatar>
						<u-icon :color="arrowColor" style="margin-left: 20rpx;" size="28" name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="昵称">
					<view class="value" @click="openUsernameModal">
						<text>{{ nickname || '无' }}</text>
						<u-icon :color="arrowColor" style="margin-left: 20rpx;" size="28" name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="性别">
					<view class="value" @click="openSexPicker">
						<text v-if="gender === '男'">男</text>
						<text v-if="gender === '女'">女</text>
						<text v-if="gender === '保密'">保密</text>
						<u-icon :color="arrowColor" style="margin-left: 20rpx;" size="28" name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="个性签名">
					<view class="value" @click="openSignatureModal">
						<text>{{ personal_signature || '无' }}</text>
						<u-icon :color="arrowColor" style="margin-left: 20rpx;" size="28" name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="生日">
					<view class="value" @click="openDatePicker">
						<text>{{ birthday || '' }}</text>
						<u-icon :color="arrowColor" style="margin-left: 20rpx;" size="28" name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="地区">
					<view class="value" @click="openRegionPicker">
						<text>{{ province + city + region || '请选择所在地区' }}</text>
						<u-icon :color="arrowColor" style="margin-left: 20rpx;" size="28" name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="账号">
					<view class="value">
						<text>{{ account }}</text>
					</view>
				</u-form-item>
				<u-form-item label="设置密码">
					<view class="value" @click="openPasswordModal">
						<text>{{ password }}</text>
						<u-icon :color="arrowColor" style="margin-left: 20rpx;" size="28" name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="手机">
					<view class="value" @click="openPhoneModal">
						<text>{{ phone }}</text>
						<u-icon :color="arrowColor" style="margin-left: 20rpx;" size="28" name="arrow-right"></u-icon>
					</view>
				</u-form-item>
			</u-form>
		</view>

		<!-- 按钮 -->
		<view class="btn">
			<div class="btn_item">
				<u-button type="gold" shape="circle" @click="submit"><text>保存</text></u-button>
			</div>
			<div class="btn_item">
				<u-button type="default" shape="circle" @click="logout"><text>退出登录</text></u-button>
			</div>
		</view>



		<!-- picker -->
		<u-picker mode="region" v-model="showRegion" :default-region="regionArr" :confirm-color="themeColor"
			@confirm="confirmRegion"></u-picker>

		<u-picker mode="time" v-model="showDate" :default-time="birthday" :confirm-color="themeColor"
			@confirm="confirmBirthday"></u-picker>

		<u-picker mode="selector" v-model="showSex" :default-selector="[genderIndex]" :confirm-color="themeColor"
			:range="genderRange" range-key="label" @confirm="confirmGender"></u-picker>


		<!-- modal -->
		<u-modal v-model="showUsername" title="修改昵称" ref="nicknameModal" show-cancel-button :async-close="true"
			:confirm-color="themeColor" @confirm="confirmNickname" @cancel="cancelNickname">
			<view class="slot-content">
				<u-field label-width="60" focus placeholder="请输入昵称" clearable :border-bottom="false"
					v-model="nicknameTemp" label="昵称" required></u-field>
			</view>
		</u-modal>


		<u-modal v-model="showSignature" title="修改个性签名" ref="signatureModal" show-cancel-button :async-close="true"
			:confirm-color="themeColor" @confirm="confirmSignature" @cancel="cancelSignature">
			<view class="slot-content">
				<u-field label-width="120" focus placeholder="请输入个性签名" clearable :border-bottom="false"
					v-model="personal_signatureTemp" label="个性签名" required auto-height type="textarea"></u-field>
			</view>
		</u-modal>


		<u-modal v-model="showPassword" title="修改密码" ref="passwordModal" show-cancel-button :async-close="true"
			:confirm-color="themeColor" @confirm="confirmPassword" @cancel="cancelPassword">
			<view class="slot-content">
				<u-field label-width="120" focus placeholder="请输入密码" clearable v-model="passwordTemp" label="密码"
					required auto-height></u-field>
			</view>
		</u-modal>

		<!-- modal -->
		<u-modal v-model="showPhone" title="修改手机" ref="phoneModal" show-cancel-button :async-close="true"
			:confirm-color="themeColor" @confirm="confirmPhone" @cancel="cancelPhone">
			<view class="slot-content">
				<u-field label-width="60" focus placeholder="请输入手机" clearable :border-bottom="false" v-model="phoneTemp"
					label="手机" required></u-field>
			</view>
		</u-modal>


	</view>
</template>
<script>
	import dayjs from 'dayjs';

	export default {
		data() {
			return {
				arrowColor: this.$appTheme.appThemeTextGrayColor,
				themeColor: this.$appTheme.appThemeColor,

				// picker
				showRegion: false,
				showDate: false,
				showSex: false,
				genderRange: [{
					label: '男',
					value: '男'
				}, {
					label: '女',
					value: '女'
				}, {
					label: '保密',
					value: ''
				}],
				genderIndex: 0,

				// modal
				showUsername: false,
				showSignature: false,
				showPassword: false,
				showPhone: false,

				// modal数据
				nicknameTemp: '',
				personal_signatureTemp: '',
				passwordTemp: '',
				phoneTemp: '',

				// 默认回显
				icon: '',
				nickname: '',
				gender: '',
				personal_signature: '',
				birthday: '',
				account: '',
				password: '',
				phone: '',

				regionArr: [],
				province: '',
				city: '',
				region: '',

				// 上传地址
				uploadUrl: ''
			};
		},
		onLoad(options) {
			this.initUser();
		},
		methods: {
			// 修改地区
			confirmRegion(item) {
				console.log(item);
				this.province = item.province.label;
				this.city = item.city.label;
				this.region = item.area.label;
			},
			// 修改生日
			confirmBirthday(item) {
				console.log(item);
				this.birthday = item.year + "-" + item.month + "-" + item.day;
			},
			// 修改性别
			confirmGender(item) {
				console.log(item);
				if (item[0] === 0) {
					this.gender = "男";
				} else if (item[0] === 0) {
					this.gender = "女";
				} else {
					this.gender = "保密";
				}
			},
			// -----------------modal-------------------------
			// 修改昵称
			confirmNickname() {
				setTimeout(() => {
					// 3秒后自动关闭
					this.showUsername = false;
					
					this.nickname = this.nicknameTemp;
				}, 500)
				
			},
			// 修改个性签名
			confirmSignature() {
				setTimeout(() => {
					// 3秒后自动关闭
					this.showSignature = false;
					
					this.personal_signature = this.personal_signatureTemp;
				}, 500)
				
			},
			// 修改密码
			confirmPassword() {
				setTimeout(() => {
					// 3秒后自动关闭
					this.showPassword = false;
					
					this.password = this.passwordTemp;
				}, 500)

			},
			// 修改手机
			confirmPhone() {
				setTimeout(() => {
					// 3秒后自动关闭
					this.showPhone = false;
					this.phone = this.phoneTemp;
				}, 500)
				
			},

			// 撤销修改昵称
			cancelNickname() {
				this.nicknameTemp = this.nickname;
			},
			// 撤销修改个性签名
			cancelSignature() {
				this.personal_signatureTemp = this.personal_signature;
			},
			// 撤销修改密码
			cancelPassword() {
				this.passwordTemp = this.password;
			},
			// 撤销修改手机
			cancelPhone() {
				this.phoneTemp = this.phone;
			},

			// 保存个人信息的修改
			submit() {
				this.$u.api.updateUserMes({
					user_id: uni.getStorageSync("user_id"),
					nickname: this.nickname,
					icon: this.icon,
					gender: this.gender,
					personal_signature: this.personal_signature,
					birthday: this.birthday,
					password: this.password,
					phone: this.phone,
					province: this.province,
					city: this.city,
					region: this.region,
				}).then(res => {
					uni.showToast({
						title: '个人信息修改成功',
						icon: 'success'
					})

					setTimeout(() => {
						uni.switchTab({
							url: '/pages/mine-new/index'
						})
					}, 1000);
				})
			},
			// 上传头像
			uploadAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success(res) {
						console.log(JSON.stringify(res.tempFilePaths));
					}
				});
			},

			async initUser() {
				const info = await this.$u.api.getUserMes({
					user_id: uni.getStorageSync("user_id")
				});

				// 初始化用户信息
				this.icon = info.icon;
				this.nickname = this.nicknameTemp = info.nickname;
				this.gender = info.gender;
				this.personal_signature = this.personal_signatureTemp = info.personal_signature;
				this.birthday = dayjs(info.birthday).format().slice(0, 10);
				this.account = info.account;
				this.password = this.passwordTemp = info.password;
				this.phone = this.phoneTemp = info.phone;

				this.regionArr = [info.province, info.city, info.region];
				this.province = info.province;
				this.city = info.city;
				this.region = info.region;

				// 初始化性别选择器
				this.genderIndex = this.genderRange.findIndex(item => item.value === info.gender);
			},

			// 修改昵称
			openUsernameModal() {
				this.showUsername = true;
			},

			// 选择性别
			openSexPicker() {
				this.showSex = true;
			},

			// 修改个性签名
			openSignatureModal() {
				this.showSignature = true;
			},

			// 选择日期
			openDatePicker() {
				this.showDate = true;
			},

			// 选择地区
			openRegionPicker() {
				this.showRegion = true;
			},

			// 设置密码
			openPasswordModal() {
				this.showPassword = true;
			},

			// 设置手机
			openPhoneModal() {
				this.showPhone = true;
			},

			// 退出登录
			logout() {
				uni.showModal({
					title: '提示',
					content: '是否退出当前账号？',
					confirmColor: this.themeColor,
					success(res) {
						if (res.confirm) {
							uni.removeStorageSync('IS_LOGIN');
							uni.navigateBack({
								delta: 1
							});
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.page {
		padding: 24rpx 30rpx;
		background-color: $app-theme-bg-color;

		.form {
			.value {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: $app-theme-card-gray-deep-color;
			}
		}
	}

	.btn {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 60rpx 0rpx;

		.btn_item {
			flex: 1;
			margin: 0 10rpx;
		}
	}

	.slot-content {
		padding: 30rpx;
	}
	
</style>
