const app = getApp();
const computedBehavior = require("miniprogram-computed").behavior;
Component({
	behaviors: [computedBehavior],
	properties: {

	},

	data: {
		pageName: '群聊'
	},

	methods: {
		onLoad() {
			// 设置机型相关信息
			let { navHeight, navTop, windowHeight, windowWidth } = app.globalData;
			this.setData({
				navHeight,
				navTop,
				windowHeight,
				windowWidth,
				ratio: 750 / windowWidth,
				bottomLineHeight: app.globalData.bottomLineHeight,
				noticeUpdateContent: app.globalData.noticeUpdateContent || false,
			});
		}
	},

	pageLifetimes: {
		show() {
			// 切换 tabbar 时候显示该页面
			this.getTabBar().setData({
				selected: 1,
			});
		}
	}
})
