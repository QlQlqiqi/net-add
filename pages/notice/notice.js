const app = getApp();
const computedBehavior = require("miniprogram-computed").behavior;
const util = require("../../utils/util");
const login = require('../../utils/login')
Component({
	behaviors: [computedBehavior],
	properties: {},

	data: {
		pageName: "交通信息",
		tipContent: "",
		tipShow: false,
	},

	computed: {},

	watch: {},

	methods: {
		handleBack(e) {
			wx.navigateBack();
		},
		handleShowMoreInfo(e) {
			this.setData({
				moreInfoShow: true,
			});
		},
		handleAddInfo(e) {
			if (!login.checkLogin()) return;
			this.setData({
				tipShow: true,
			});
		},
		handleDialogButtons(e) {
			const {
				detail: { index },
			} = e;
			if (index) {
				wx.showToast({
					title: "感谢您的信息",
				});
			}
			this.setData({
				tipShow: false,
			});
		},
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
				pullDownRefresh: true,
			});
		},
	},

	pageLifetimes: {
		show() {},
	},
});
