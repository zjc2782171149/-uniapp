export const useArticlesApi = (Vue, vm) => {
	return {
		// --------------------------查询文章信息--------------------------------
		// 查询所有已发表文章
		getArticleAll: () => vm.$u.post('/get_article_list', {
		
		}),
		// 查询文章基本信息
		getArticleMes: (req) => vm.$u.post('/get_article', {
			article_id: req.article_id
		}),
		// 查询文章评论
		getArticleEvaluate: (req) => vm.$u.post('/get_article_evaluate', {
			article_id: req.article_id
		}),
		
		
		
		// --------------------------新建订单信息--------------------------------
		// 新增文章基本信息(包括提问、官方科普、每日喝茶记录)
		setArticleMes: (req) => vm.$u.post('/set_article', {
			user_id: req.user_id,
			content: req.content,
			publish_time: req.publish_time,
			view_num: 0,
			type: req.type,
			title: req.title,
			img: req.img,
			desc: req.desc
		}),
		// 新增文章评论
		setArticleEvaluate: (req) => vm.$u.post('/set_article_evaluate', {
			article_id: req.article_id,
			user_id: req.user_id,
			content: req.content,
			publish_time: req.publish_time
		}),
		
		


		
		// --------------------------更新订单信息--------------------------------
		// 更新该用户的 相关订单的订单的支付状态
		updateArticleMes: (req) => vm.$u.post('/update_order_mes', {
			user_id: req.user_id,
			order_id: req.order_id,
			status: req.status,
			pay_way: req.pay_way
		}),

		
		// --------------------------删除文章信息--------------------------------
		// 删除文章评论
		deleteArticleEvaluate: (req) => vm.$u.post('/delete_article_evaluate', {
			user_id: req.user_id,
			article_id: req.article_id
		}),

		
	}
}
