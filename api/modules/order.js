export const useOrdersApi = (Vue, vm) => {
	return {
		// --------------------------查询订单信息--------------------------------
		// 查询该用户的订单
		getOrderList: (req) => vm.$u.post('/api/cxj/get_order_list'),
		
		// 查询该用户的 相关订单的地址信息
		getOrderAddress: (req) => vm.$u.post('/api/cxj/get_order_address', {
			order_id: req.order_id
		}),
		
		// 查询该用户的 相关订单的基本信息
		getOrderMes: (req) => vm.$u.post('/api/cxj/get_order_mes', {
			order_id: req.order_id
		}),
		
		// 查询该用户的 相关订单所购买的商品列表
		getOrderGoodsList: (req) => vm.$u.post('/api/cxj/get_order_goodslist', {
			order_id: req.order_id
		}),
		// 查询该用户的 相关订单所购买的商品列表
		getOrder: () => vm.$u.post('/api/cxj/backend/get_order'),
		
		
		// --------------------------新建订单信息--------------------------------
		// 新建该用户的订单
		setOrderList: (req) => vm.$u.post('/api/cxj/set_order_list', {
			order_id: req.order_id
		}),
		
		// 新建该用户的 相关订单的地址信息
		setOrderAddress: (req) => vm.$u.post('/api/cxj/set_order_address', {
			order_id: req.order_id,
			...req.address_info
		}),
		
		// 新建该用户的 相关订单的基本信息
		setOrderMes: (req) => vm.$u.post('/api/cxj/set_order_mes', {
			order_id: req.order_id,
			...req.order_mes
		}),
		
		// 新建该用户的 相关订单所购买的商品列表
		setOrderGoodsList: (req) => vm.$u.post('/api/cxj/set_order_goodslist', {
			order_id: req.order_id,
			goods: req.goods
		}),

		
		// --------------------------更新订单信息--------------------------------
		// 更新该用户的 相关订单的订单的支付状态
		updateOrderMes: (req) => vm.$u.post('/api/cxj/update_order_mes', {
			order_id: req.order_id,
			status: req.status,
			pay_way: req.pay_way
		}),
		// 更新待付款订单截止时间
		updateOrderEnd: (req) => vm.$u.post('/api/cxj/update_order_endtime', {
			order_id: req.order_id
		}),
		
		// 更新该用户的 相关订单的提醒发货状态
		updateOrderRemind: (req) => vm.$u.post('/api/cxj/update_order_remind', {
			order_id: req.order_id,
			isRemind: 1
		}),
		// 更新该用户的 相关订单的收货状态
		updateOrderReceive: (req) => vm.$u.post('/api/cxj/update_order_receive', {
			order_id: req.order_id,
			status: req.status
		}),
		// 更新该用户的 相关订单的评论状态
		updateOrderEvaluate: (req) => vm.$u.post('/api/cxj/update_order_evaluate', {
			order_id: req.order_id,
			isEvaluate: req.isEvaluate
		}),
		// 更新该用户的 相关订单的退款/售后状态
		updateOrderAffterSale: (req) => vm.$u.post('/api/cxj/update_order_afftersale', {
			order_id: req.order_id,
			...req.affterSale
		}),
		
		// --------------------------删除订单信息--------------------------------
		// 删除该用户的订单
		deleteOrderList: (req) => vm.$u.post('/api/cxj/delete_order_list', {
			order_id: req.order_id
		}),
		
		// 删除该用户的 相关订单的地址信息
		deleteOrderAddress: (req) => vm.$u.post('/api/cxj/delete_order_address', {
			order_id: req.order_id
		}),
		
		// 删除该用户的 相关订单的基本信息
		deleteOrderMes: (req) => vm.$u.post('/api/cxj/delete_order_mes', {
			order_id: req.order_id
		}),
		
		// 删除该用户的 相关订单所购买的商品列表
		deleteOrderGoodsList: (req) => vm.$u.post('/api/cxj/delete_order_goodslist', {
			order_id: req.order_id
		}),
		
	}
}
