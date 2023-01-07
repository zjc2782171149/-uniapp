export const useHomesApi = (Vue, vm) => {
	return {
		// --------------------------查询--------------------------------
		// 查询所有活动
		getActsAll: () => vm.$u.post('/get_act_list'),
		
		// 查询所有轮播图
		getSwipersAll: () => vm.$u.post('/get_swiper_list'),

		
		
		// --------------------------新建--------------------------------
		// 新建活动信息
		setActs: (req) => vm.$u.post('/set_act', {
			content: req.content,
			publish_time: req.publish_time,
			view_num: 0,
			type: req.type,
			title: req.title,
			img: req.img,
			desc: req.desc
		}),
		


		
		// --------------------------更新--------------------------------
		// 更新活动信息
		updateActsAll: (req) => vm.$u.post('/update_act_mes', {
			order_id: req.order_id,
			status: req.status,
			pay_way: req.pay_way
		}),

		
		// --------------------------删除---------------------------------
		// 删除活动信息
		deleteActsAll: (req) => vm.$u.post('/delete_act', {
			article_id: req.article_id
		}),

		
	}
}
