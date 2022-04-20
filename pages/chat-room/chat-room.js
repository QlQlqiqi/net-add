const app = getApp();
const computedBehavior = require("miniprogram-computed").behavior;
Component({
	behaviors: [computedBehavior],
	properties: {},

	data: {
		group: {},
	},

	computed: {
		pageName(data) {
			return data.group.title;
		},
	},

	methods: {
		// 返回
		handleBack(e) {
			wx.navigateBack();
		},
		onLoad(e) {
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
				pullDownRefresh: true,
			});
			const group = JSON.parse(e.group);
			this.setData({
				group,
			});
		},
	},
});
