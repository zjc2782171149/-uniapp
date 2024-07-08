export const useWxApi = (Vue, vm) => {
	return {
		// -------------------------------------获取--------------------------------------------------
		// 如果微信一键登录，传值为openid，如果手机号，传值为手机号和验证码
		// 获取openid，然后在数据库中查找有没有，没有就首次登录，否则不是
		getOpenId: (req) => vm.$u.post('/api/eggplantrabbit/login', {
			...req
		}),

		// 手机号登录
		getPhoneCode: (phone) => vm.$u.post('/api/eggplantrabbit/login/get_phone_code', {
			phone
		}),
		
		// 获取每日打卡记录
		getUserSign: (req) => vm.$u.post('/api/eggplantrabbit/get_sign_record', {
			...req,
			token: ''
		}),
		
		// 获取用户数据
		getUserMes: (req) => vm.$u.post('/api/plantwalk/get_user_mes'),
		
		// -------------------------------------插入--------------------------------------------------
		// 进行每日打卡
		setUserSign: (req) => vm.$u.post('/api/eggplantrabbit/set_user_sign', {
			...req,
			token: ''
		}),
		
		
		// -------------------------------------删除--------------------------------------------------
		// 删除打卡记录
		deleteUserSign: (req) => vm.$u.post('/api/eggplantrabbit/delete_user_sign', {
			...req,
			token: ''
		}),

	}
}
