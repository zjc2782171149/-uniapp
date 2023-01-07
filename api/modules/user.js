export const useWxApi = (Vue, vm) => {
	return {
				// -------------------------------------获取--------------------------------------------------
		// 如果微信一键登录，传值为openid，如果手机号，传值为手机号和验证码
		// 获取openid，然后在数据库中查找有没有，没有就首次登录，否则不是
		getOpenId: (req) => vm.$u.post('/api/login', {
			...req
		}),
		// 手机号登录
		getPhoneCode: (phone) => vm.$u.post('/api/get_phone_code', {
			phone
		}),
	
		// 根据user_id获取用户数据
		getUserMes: (req) => vm.$u.post('/get_user_mes'),
		// 根据user_id和good_id获取用户是否收藏了该商品
		getUserCollect: (req) => vm.$u.post('/get_user_collect', {
			good_id: req.good_id
		}),
		// 根据user_id获取商品收藏列表
		getUserCollectList: (req) => vm.$u.post('/get_user_collect'),
		// 根据user_id获取购物车列表
		getUserShoppingcart: (req) => vm.$u.post('/get_user_shoppingcart'),
		// 根据user_id获取签到时间
		getUserSign: (req) => vm.$u.post('/get_user_sign'),
		
		// -------------------------------------修改-------------------------------------------------
		// 修改该用户对该商品的收藏状态
		setUserCollect: (req) => vm.$u.post('/set_user_collect', {
			good_id: req.good_id,
			isCollection: req.isCollection
		}),
		// 添加商品到购物车列表
		setUserShoppingcart: (req) => vm.$u.post('/set_user_shoppingcart', {
			...req
		}),
		// 新增用户每日签到
		setUserSign: (req) => vm.$u.post('/set_user_sign', {
			...req
		}),
		
		// -------------------------------------更新-------------------------------------------------
		// 修改用户个人信息
		updateUserMes: (req) => vm.$u.post('/update_user_mes', {
			...req
		}),
		// 修改用户积分
		updateUserPoint: (req) => vm.$u.post('/update_user_point', {
			...req
		}),
		
		// -------------------------------------删除--------------------------------------------------
		// 添加商品到购物车列表
		deleteUserShoppingcart: (req) => vm.$u.post('/delete_user_shoppingcart', {
			id_pri: req.id_pri
		}),
	}
}
