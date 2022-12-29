export const useGoodsApi = (Vue, vm) => {
	return {
		// 查询所有商品
		getGoodsAll: () => vm.$u.get('/goods'),
		
		// 查询指定id的商品
		getGood: (req) => vm.$u.post('/good', {
			id: req.id
		}),
		
		// 查询指定id的商品的规格
		getGoodSpec: (req) => vm.$u.post('/good_spec', {
			id: req.id
		}),
		
		// 查询指定id的商品的轮播图
		getGoodSwiper: (req) => vm.$u.post('/good_swiper', {
			id: req.id
		}),
		
		// 查询指定id的商品的评论
		getGoodEvaluate: (req) => vm.$u.post('/good_evaluate', {
			id: req.id
		}),
	}
}
