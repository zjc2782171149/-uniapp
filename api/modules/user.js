export const useWxApi = (Vue, vm) => {
	return {
				// -------------------------------------获取--------------------------------------------------
		// 获取openid
		getOpenId: (code) => vm.$u.get('/appletsUser/openId', {
			code
		}),
		// 通过openid登录
		loginByOpenId: (openId) => vm.$u.get('/appletsUser/loginByOpenId', {
			openId
		}),
		// 根据user_id获取用户数据
		getUserMes: (req) => vm.$u.post('/get_user_mes', {
			user_id: req.user_id
		}),
		// 根据user_id和good_id获取用户是否收藏了该商品
		getUserCollect: (req) => vm.$u.post('/get_user_collect', {
			user_id: req.user_id,
			good_id: req.good_id
		}),
		// 根据user_id获取商品收藏列表
		getUserCollectList: (req) => vm.$u.post('/get_user_collect', {
			user_id: req.user_id
		}),
		// 根据user_id获取购物车列表
		getUserShoppingcart: (req) => vm.$u.post('/get_user_shoppingcart', {
			user_id: req.user_id
		}),
		
		// -------------------------------------修改-------------------------------------------------
		// 修改该用户对该商品的收藏状态
		setUserCollect: (req) => vm.$u.post('/set_user_collect', {
			user_id: req.user_id,
			good_id: req.good_id,
			isCollection: req.isCollection
		}),
		// 添加商品到购物车列表
		setUserShoppingcart: (req) => vm.$u.post('/set_user_shoppingcart', {
			user_id: req.user_id,
			...req
		}),
		
		// -------------------------------------删除--------------------------------------------------
		// 添加商品到购物车列表
		deleteUserShoppingcart: (req) => vm.$u.post('/delete_user_shoppingcart', {
			user_id: req.user_id,
			id_pri: req.id_pri
		}),
	}
}
