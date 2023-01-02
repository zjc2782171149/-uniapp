export const useOrdersApi = (Vue, vm) => {
	return {
		// --------------------------查询订单信息--------------------------------
		// 查询该用户的订单
		getOrderList: (req) => vm.$u.post('/get_order_list', {
			user_id: req.user_id
		}),
		
		// 查询该用户的 相关订单的地址信息
		getOrderAddress: (req) => vm.$u.post('/get_order_address', {
			user_id: req.user_id,
			order_id: req.order_id
		}),
		
		// 查询该用户的 相关订单的基本信息
		getOrderMes: (req) => vm.$u.post('/get_order_mes', {
			user_id: req.user_id,
			order_id: req.order_id
		}),
		
		// 查询该用户的 相关订单所购买的商品列表
		getOrderGoodsList: (req) => vm.$u.post('/get_order_goodslist', {
			user_id: req.user_id,
			order_id: req.order_id
		}),
		
		
		// --------------------------新建订单信息--------------------------------
		// 新建该用户的订单
		setOrderList: (req) => vm.$u.post('/set_order_list', {
			user_id: req.user_id,
			order_id: req.order_id
		}),
		
		// 新建该用户的 相关订单的地址信息
		setOrderAddress: (req) => vm.$u.post('/set_order_address', {
			user_id: req.user_id,
			order_id: req.order_id,
			...req.address_info
		}),
		
		// 新建该用户的 相关订单的基本信息
		setOrderMes: (req) => vm.$u.post('/set_order_mes', {
			user_id: req.user_id,
			order_id: req.order_id,
			...req.order_mes
		}),
		
		// 新建该用户的 相关订单所购买的商品列表
		setOrderGoodsList: (req) => vm.$u.post('/set_order_goodslist', {
			user_id: req.user_id,
			order_id: req.order_id,
			goods: req.goods
		}),

		
		// --------------------------更新订单信息--------------------------------
		// 更新该用户的 相关订单的订单的支付状态
		updateOrderMes: (req) => vm.$u.post('/update_order_mes', {
			user_id: req.user_id,
			order_id: req.order_id,
			status: req.status,
			pay_way: req.pay_way
		}),
		// 更新该用户的 相关订单的提醒发货状态
		updateOrderRemind: (req) => vm.$u.post('/update_order_remind', {
			user_id: req.user_id,
			order_id: req.order_id,
			isRemind: 1
		}),
		// 更新该用户的 相关订单的收货状态
		updateOrderReceive: (req) => vm.$u.post('/update_order_receive', {
			user_id: req.user_id,
			order_id: req.order_id,
			status: req.status
		}),
		// 更新该用户的 相关订单的评论状态
		updateOrderEvaluate: (req) => vm.$u.post('/update_order_evaluate', {
			user_id: req.user_id,
			order_id: req.order_id,
			isEvaluate: req.isEvaluate
		}),
		// 更新该用户的 相关订单的退款/售后状态
		updateOrderAffterSale: (req) => vm.$u.post('/update_order_afftersale', {
			user_id: req.user_id,
			order_id: req.order_id,
			...req.affterSale
		}),
		
		// --------------------------删除订单信息--------------------------------
		// 删除该用户的订单
		deleteOrderList: (req) => vm.$u.post('/delete_order_list', {
			user_id: req.user_id,
			order_id: req.order_id
		}),
		
		// 删除该用户的 相关订单的地址信息
		deleteOrderAddress: (req) => vm.$u.post('/delete_order_address', {
			user_id: req.user_id,
			order_id: req.order_id
		}),
		
		// 删除该用户的 相关订单的基本信息
		deleteOrderMes: (req) => vm.$u.post('/delete_order_mes', {
			user_id: req.user_id,
			order_id: req.order_id
		}),
		
		// 删除该用户的 相关订单所购买的商品列表
		deleteOrderGoodsList: (req) => vm.$u.post('/delete_order_goodslist', {
			user_id: req.user_id,
			order_id: req.order_id
		}),
		
	}
}
