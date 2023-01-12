<template>
	<view class="page">
		<!-- 自定义头部 -->
		<u-navbar back-icon-name="arrow-leftward" :title="title">
		  <view class="slot-wrap" v-if="type === 'update'">
		    <u-button
		      type="gold"
		      shape="circle"
		      size="mini"
		      :ripple="true"
		      @click="deleteAddress"
		      >删除</u-button
		    >
		  </view>
		</u-navbar>
		
		<view class="form">
			<u-form :model="form" ref="form" label-width="180rpx">
				<u-form-item label="收货人"><u-input v-model="form.name" placeholder="请输入收货人姓名" /></u-form-item>
				<u-form-item label="联系方式"><u-input v-model="form.phone" placeholder="请输入联系方式" /></u-form-item>
				<u-form-item label="所在地区"><u-input v-model="cityPickerLabel" type="select" placeholder="请选择所在地区" @click="showCityPicker = true" /></u-form-item>
				<u-form-item label="所在街道"><u-input v-model="form.street" placeholder="请输入所在街道" /></u-form-item>
				<u-form-item label="详细地址"><u-input v-model="form.address" placeholder="请输入详细地址" /></u-form-item>
				<u-form-item :border-bottom="false" label="设为家"><u-switch slot="right" v-model="form.isHome" :active-color="appThemeColor"></u-switch></u-form-item>
			</u-form>
		</view>
		<view class="btn">
			<u-button type="gold" shape="circle" @click="submit">
				<u-icon name="plus"></u-icon>
				<text>{{ type == 'add' ? '新增地址' : '保存地址' }}</text>
			</u-button>
		</view>
		<!-- 省市区选择器 -->
		<CityPicker v-model="showCityPicker" @city-change="cityChange"></CityPicker>
		
	</view>
</template>

<script>
import CityPicker from '@/pages-mine/components/city-picker.vue';
export default {
	components: {
		CityPicker
	},
	data() {
		return {
			// 标题
			title: '收货地址',
			appThemeColor: this.$appTheme.appThemeColor,
			// 表单
			form: {
				name: '',
				phone: '',
				province: '',
				city: '',
				region: '',
				street: '',
				address: '',
				isHome: false
			},
			// 省市区
			showCityPicker: false,
			cityPickerLabel: '',
			
			deleteShow: false,
			type: 'add'
		};
	},
	onLoad(ops) {
		if (ops.type == 'add') {
			this.title = '新建地址';
		} else if (ops.type == 'update') {
			this.title = '修改地址';
			
			this.initAddress();
		}
		this.type = ops.type;
	},
	methods: {
		deleteAddress() {
		  const that = this;
		  const addressInfo = getApp().globalData.addressList[getApp().globalData.addressIndex];
		  uni.showModal({
		  	title: '提示',
		  	content: '是否删除当前地址？',
		  	confirmColor: this.appThemeColor,
		  	success: function(res) {
		  		if (res.confirm) {
		  			that.$u.api.deleteUserAddress({
						id_pri: addressInfo.id_pri
					}).then(res => {
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						});
						
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1000);
					})
		  
		  		}
		  	}
		  });
		},
		// 省市区选择回调
		cityChange(e) {
			console.log(e);
			this.cityPickerLabel = e.province.label + e.city.label + e.area.label;
			this.form.province = e.province.label;
			this.form.city = e.city.label;
			this.form.region = e.area.label;
		},
		
		initAddress() {
			const addressInfo = getApp().globalData.addressList[getApp().globalData.addressIndex];
			this.form = {
				...addressInfo,
				isHome: addressInfo.isHome === 0 ? false : true
			}
			this.cityPickerLabel = addressInfo.province + addressInfo.city + addressInfo.region
		},

		// 提交表单
		submit() {
			const that = this;
			const addressInfo = getApp().globalData.addressList[getApp().globalData.addressIndex];
			
			// 新增地址
			if(this.type == 'add') {
				that.$u.api.setUserAddress({
					...that.form,
					isHome: that.form.isHome === false ? 0 : 1
				}).then(res => {
					uni.showToast({
						title: '新增成功',
						icon: 'success'
					});
					
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 1000);
				})
			} else {
				// 修改地址
				that.$u.api.updateUserAddress({
					id_pri: addressInfo.id_pri,
					...that.form,
					isHome: that.form.isHome === false ? 0 : 1
				}).then(res => {
					uni.showToast({
						title: '修改成功',
						icon: 'success'
					});
					
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 1000);
				})
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.form {
	background-color: $app-theme-bg-color;
	padding: 30rpx;
}
.btn {
	padding: 60rpx 30rpx;
}
.slot-wrap {
  position: absolute;
  right: 20rpx;
}
</style>
