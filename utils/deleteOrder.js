// 删除相应订单的消息
import { useOrdersApi } from "../api/modules/order.js";

export const deleteOrder = async (user_id, order_id) => {
	// 删除订单
	let task1 = await deleteOrderList2({
		user_id: user_id,
		order_id: order_id
	});

	// 删除订单信息——购买地址
	let task2 = await deleteOrderAddress2({
		user_id: user_id,
		order_id: order_id
	});

	// 删除订单信息——订单基本信息
	let task3 = await deleteOrderMes2({
		user_id: user_id,
		order_id: order_id
	});

	// 删除订单信息——购买物品清单
	let task4 = await deleteOrderGoodsList2({
		user_id: user_id,
		order_id: order_id
	});

	Promise.all([task1, task2, task3, task4]).then(res => {
		uni.showToast({
			title: "订单已取消"
		})
		uni.setStorageSync('orderInfo', null);
		// 提交订单成功2s才跳转
		setTimeout(() => {
			uni.navigateTo({
				url: '/pages-mall/pages/order/list'
			});
		}, 2000);
	}).catch(err => {
		uni.showToast({
			title: "订单取消失败",
			icon: "error"
		})
		console.log("失败原因", err);
	})
}
// 删除该用户订单
function deleteOrderList2(req) {
	console.log(useOrdersApi);
	return useOrdersApi.deleteOrderList({
		user_id: req.user_id,
		order_id: req.order_id
	});
}
// 删除该用户的 相关订单的地址信息 
const deleteOrderAddress2 = (req) => {
	return useOrdersApi.deleteOrderAddress({
		user_id: req.user_id,
		order_id: req.order_id
	});
}
// 删除该用户的 相关订单的基本信息
const deleteOrderMes2 = (req) => {
	return useOrdersApi.deleteOrderMes({
		user_id: req.user_id,
		order_id: req.order_id
	});
}
// 删除订单id去获取订单的地址信息
const deleteOrderGoodsList2 = (req) => {
	return useOrdersApi.deleteOrderGoodsList({
		user_id: req.user_id,
		order_id: req.order_id
	});
}
