const app = getApp();
const computedBehavior = require("miniprogram-computed").behavior;
const util = require("../../utils/util");
Component({
	behaviors: [computedBehavior],
	properties: {},

	data: {
		pageName: "群聊",
		scrollTop: 0,
		// 下拉刷新
		pullDownRefresh: false,
		// 群聊
		groups: [],
	},

	computed: {
		// 当前页面展示的 groups
		groupsShow(data) {
			// 目前展示所有的 groups
			return data.groups.filter(item => {
				return true;
			});
		},
	},

	watch: {},

	methods: {
		// 下拉刷新
		pullDownLoad() {
			this.setData({
				pullDownRefresh: true,
			});
			let groups = JSON.parse(wx.getStorageSync("groups") || "[]");
			// 默认
			if (!groups.length) {
				groups = [
					{
						id: 1,
						owner: 1,
						headIcon: app.globalData.avatorUrl,
						name: app.globalData.nickname,
						title: "凤城八路聚集地",
						content: [
							{
								owner: 1,
								nickname: "QlQl",
								avatorUrl: app.globalData.avatorUrl,
								content: "好好",
								date: util.formatDate(util.convertDateToString(new Date())),
							},
							{
								owner: 0,
								nickname: "QlQl",
								avatorUrl: app.globalData.avatorUrl,
								content: "好好",
								date: util.formatDate(util.convertDateToString(new Date())),
							},
						],
						date: "2022-04-20T12:00:00Z",
						address: "陕西省西安市未央区凤城八路109号",
					},
				];
			}
			wx.setStorageSync("groups", JSON.stringify(groups));
			// const groups = JSON.parse(wx.getStorageSync("groups") || "[]");
			this.setData({
				groups,
				pullDownRefresh: false,
			});
		},
		// 群聊页面
		handleNavigateChatRoom(e) {
			const {
				currentTarget: {
					dataset: { index },
				},
			} = e;
			wx.navigateTo({
				url: "/pages/chat-room/chat-room?group=" + JSON.stringify(this.data.groups[index]),
			});
		},
		// 前往增加群聊页面
		handleAddGroup(e) {
			wx.navigateTo({
				url: "/pages/add-group/add-group",
			});
		},
		// 返回顶部
		handleReturnTop(e) {
			this.setData({
				scrollTop: 0,
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
		show() {
			// 第一次进入的时候不加载
			if (!this._firstShow) {
				this._firstShow = true;
			} else {
				const groups = JSON.parse(wx.getStorageSync("groups") || "[]");
				this.setData({
					groups,
				});
			}
			// 切换 tabbar 时候显示该页面
			this.getTabBar().setData({
				selected: 1,
			});
		},
	},
});
