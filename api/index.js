// 用户模块api
import {
	useWxApi
} from './modules/user.js'


// 文章模块api(包括回答和科普)
import {
	useArticlesApi
} from './modules/article.js'



// 导出api全局安装方法
export const installApiModules = (Vue, vm) => {
	vm.$u.api = Object.assign(useWxApi(Vue, vm), useArticlesApi(Vue, vm))
}
