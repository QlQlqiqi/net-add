const app = getApp();
const computedBehavior = require("miniprogram-computed").behavior;
Component({
	behaviors: [computedBehavior],
	properties: {},

	data: {
		pageName: "舆情分析",
		scrollTop: 0,
		// 下拉刷新
		pullDownRefresh: false,
		chatsShow: [],
		chats: [],
	},

	computed: {
		// 当前页面展示的 chats
		chatsShow(data) {
			// 目前展示所有的 chats
			return data.chats.filter(item => {
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
			let chats = JSON.parse(wx.getStorageSync("chats") || "[]");
			// 默认
			if (!chats.length) {
				chats = [
					{
						id: 1,
						owner: 1,
						headIcon: app.globalData.avatorUrl,
						name: app.globalData.nickname,
						content:
							"啊实打实大苏打实打实打算啊实打实大苏打实打实打算啊实打实大苏打实打实打算啊实打实大苏打实打实打算啊实打实大苏打实打实打算",
						likes: [1, 2, 3],
						date: "2022-04-20T12:00:00Z",
						address: "陕西省西安市未央区凤城八路109号",
					},
				];
			}
			wx.setStorageSync("chats", JSON.stringify(chats));
			// const chats = JSON.parse(wx.getStorageSync("chats") || "[]");
			this.setData({
				chats,
				pullDownRefresh: false,
			});
		},
		// 举报分享
		handleReport(e) {
			const {
				detail: { id },
			} = e;
			this.setData({
				dialogShow: true,
				dialogButton: [{ text: "取消" }, { text: "确定" }],
				dialogContent: "是否举报该分享？",
			});
			const _this = this;
			this._dialogHandler = {
				// 取消
				0: () => {},
				// 确定
				1: () => {
					wx.showToast({
						title: "举报成功",
					});
				},
				finalThing: () => {
					_this.setData({
						dialogShow: false,
					});
					delete _this._dialogHandler;
				},
			};
		},
		// 删除分享
		handleDelete(e) {
			const {
				detail: { id },
			} = e;
			this.setData({
				dialogShow: true,
				dialogButton: [{ text: "取消" }, { text: "确定" }],
				dialogContent: "是否删除该分享？",
			});
			const _this = this;
			this._dialogHandler = {
				// 取消
				0: () => {},
				// 确定
				1: () => {
					let { chats } = _this.data;
					for (let i = 0; i < chats.length; i++) {
						if (chats[i].id != id) continue;
						chats.splice(i, 1);
						break;
					}
					_this.setData({
						chats,
					});
					wx.showToast({
						title: "删除成功",
					});
				},
				finalThing: () => {
					_this.setData({
						dialogShow: false,
					});
					delete _this._dialogHandler;
				},
			};
		},
		// dialog handler
		handleDialogButtons(e) {
			const {
				detail: { index },
			} = e;
			this._dialogHandler[index]();
			this._dialogHandler["finalThing"]();
		},
		// 点赞
		handleAddLike(e) {
			const {
				detail: { id },
			} = e;
			const { chats } = this.data;
			const { owner } = app.globalData;
			for (const chat of chats) {
				if (chat.id == id) {
					const idx = chat.likes.findIndex(item => item == owner);
					idx == -1 ? chat.likes.push(owner) : chat.likes.splice(idx, 1);
					this.setData({
						chats: JSON.parse(JSON.stringify(chats)),
					});
					break;
				}
			}
		},
		// 前往增加分享页面
		handleAddShare(e) {
			wx.navigateTo({
				url: "/pages/add-share/add-share",
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
				const chats = JSON.parse(wx.getStorageSync("chats") || "[]");
				this.setData({
					chats,
				});
			}
			// 切换 tabbar 时候显示该页面
			this.getTabBar().setData({
				selected: 0,
			});
		},
	},
});
