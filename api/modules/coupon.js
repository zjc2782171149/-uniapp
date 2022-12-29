export const useCouponsApi = (Vue, vm) => {
	return {
		// --------------------------查询优惠券信息--------------------------------
		// 查询该用户的优惠券
		getCouponList: (req) => vm.$u.post('/get_coupon_list', {
			user_id: req.user_id
		}),
		
		// --------------------------新建优惠券信息--------------------------------
		// 新建该用户的优惠券，未启用
		setCoupon: (req) => vm.$u.post('/set_coupon', {
			user_id: req.user_id
		}),
		
		// --------------------------删除优惠券信息--------------------------------
		// 删除该用户的优惠券
		deleteCouponList: (req) => vm.$u.post('/delete_coupon_list', {
			user_id: req.user_id
		}),
		

	}
}
