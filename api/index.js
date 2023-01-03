// 用户模块api
import {
	useWxApi
} from './modules/user.js'

// 基础模块api
import {
	useFileApi
} from './modules/base.js'

// 商城模块api
import {
	useMallApi
} from './modules/mall.js'

// 社区模块api
import {
	useCommunityApi
} from './modules/community.js'

// 商品模块api
import {
	useGoodsApi
} from './modules/goods.js'

// 商品模块api
import {
	useOrdersApi
} from './modules/order.js'

// 优惠券模块api
import {
	useCouponsApi
} from './modules/coupon.js'

// 文章模块api(包括回答和科普)
import {
	useArticlesApi
} from './modules/article.js'


// 导出api全局安装方法
export const installApiModules = (Vue, vm) => {
	vm.$u.api = Object.assign(useFileApi(Vue, vm), useWxApi(Vue, vm), useMallApi(Vue, vm), useCommunityApi(Vue, vm), useGoodsApi(Vue, vm), useOrdersApi(Vue, vm), useCouponsApi(Vue, vm), useArticlesApi(Vue, vm))
}
