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
			// 按时间排序
			let groupsShow = data.groups.filter(item => {
				return true;
			});
			groupsShow.sort((a, b) => a.date - b.date);
			return groupsShow;
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
						id: 2,
						owner: 2,
						nickname: app.globalData.default[0].nickname,
						headIcon: app.globalData.default[0].avatarUrl,
						title: "凤城八路聚集地",
						content: [
							{
								owner: 2,
								nickname: app.globalData.default[0].nickname,
								avatarUrl: app.globalData.default[0].avatarUrl,
								content: "友友们别来了，又堵车了",
								date: "2022-04-20T12:01:00Z",
							},
							{
								owner: 2,
								nickname: app.globalData.default[0].nickname,
								avatarUrl: app.globalData.default[0].avatarUrl,
								content: "每次来都堵车",
								date: "2022-04-20T12:01:05Z",
							},
							{
								owner: 2,
								nickname: app.globalData.default[0].nickname,
								avatarUrl: app.globalData.default[0].avatarUrl,
								content: "我震惊了",
								date: "2022-04-20T12:01:11Z",
							},
							{
								owner: 3,
								nickname: app.globalData.default[1].nickname,
								avatarUrl: app.globalData.default[1].avatarUrl,
								content: "确实，我也堵住了，不知道啥时候才能出去啊",
								date: "2022-04-20T12:01:21Z",
							},
							{
								owner: 4,
								nickname: app.globalData.default[2].nickname,
								avatarUrl: app.globalData.default[2].avatarUrl,
								content: "谢谢友友们，我绕路走了",
								date: "2022-04-20T12:02:21Z",
							},
						],
						date: "2022-04-20T12:00:00Z",
						address: "陕西省西安市未央区凤城八路109号",
					},
					{
						id: 3,
						owner: 3,
						nickname: app.globalData.default[1].nickname,
						headIcon: app.globalData.default[1].avatarUrl,
						title: "西沣路",
						content: [
							{
								owner: 3,
								nickname: app.globalData.default[1].nickname,
								avatarUrl: app.globalData.default[1].avatarUrl,
								content: "西沣路好像出车祸了，大家绕路走吧",
								date: "2022-04-21T10:11:12Z",
							},
						],
						date: "2022-04-21T10:10:00Z",
						address: "陕西省显示长安区西沣路",
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
			if (!this._checkLogin()) return;
			const {
				currentTarget: {
					dataset: { index },
				},
			} = e;
			wx.navigateTo({
				url:
					"/pages/chat-room/chat-room?group=" +
					JSON.stringify(this.data.groups[index]),
			});
		},
		// 前往增加群聊页面
		handleAddGroup(e) {
			if (!this._checkLogin()) return;
			wx.navigateTo({
				url: "/pages/add-group/add-group",
			});
		},
		// 监测是否“登录”
		_checkLogin() {
			if (!app.globalData.login) {
				util
					.getUserProfile("获取头像和昵称用于身份识别")
					.then(res => {
						app.globalData.avatarUrl = res.userInfo.avatarUrl;
						app.globalData.nickname = res.userInfo.nickName;
						app.globalData.login = true;
						wx.setStorageSync("login", JSON.stringify(true));
						wx.setStorageSync(
							"nickname",
							JSON.stringify(app.globalData.nickname)
						);
						wx.setStorageSync(
							"avatarUrl",
							JSON.stringify(app.globalData.avatarUrl)
						);
					})
					.catch(err => {
						console.log(err);
					});
				return false;
			}
			return true;
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
