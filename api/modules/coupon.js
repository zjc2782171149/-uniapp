export const useCouponsApi = (Vue, vm) => {
	return {
		// --------------------------查询优惠券信息--------------------------------
		// 查询该用户的优惠券
		getCouponList: (req) => vm.$u.post('/get_coupon_list'),
		
		// --------------------------新建优惠券信息--------------------------------
		// 新建该用户的优惠券
		setCoupon: (req) => vm.$u.post('/set_coupon', {
			...req
		}),
		
		// --------------------------删除优惠券信息--------------------------------
		// 删除该用户的优惠券
		deleteCoupon: (req) => vm.$u.post('/delete_coupon', {
			coupon_id: req.coupon_id,
		}),
		

	}
}
