export const useArticlesApi = (Vue, vm) => {
	return {
		// -------------------------------------获取--------------------------------------------------
		// 获取故事记录
		getStory: (req) => vm.$u.post('/api/eggplantrabbit/get_story_record', {
			...req,
		}),
		
		getStoryComment: (req) => vm.$u.post('/api/eggplantrabbit/get_story_comment', {
			...req,
		}),
		
		
		// --------------------------新建故事信息--------------------------------
		// 新增故事
		setStory: (req) => vm.$u.post('/api/eggplantrabbit/set_story', {
			...req,
		}),
		
		// 新增故事评论
		setStoryComment: (req) => vm.$u.post('/api/eggplantrabbit/set_story_comment', {
			...req,
		}),
		

		
	
		
		// --------------------------删除--------------------------------
		// 删除故事
		deleteStory: (req) => vm.$u.post('/api/eggplantrabbit/delete_story', {
			...req,
		}),


	}
}
