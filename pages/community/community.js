const app = getApp();
const computedBehavior = require("miniprogram-computed").behavior;
const util = require("../../utils/util");
const login = require('../../utils/login')
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
		// 轮播图
		gallerys: [
			{
				icon: "https://witime.wizzstudio.com/images/op/cover.png",
				title: "拒绝焦虑，良性竞争， “卷王”竟是我自己！？",
				url: "https://mp.weixin.qq.com/s/reKAhE4Fw0x7BhPTYjDHYg",
			},
		],
		currentGallery: 0,
		notice: [
			"西沣路前方疑似车祸，建议绕道而行",
			"凤城八路堵车长达 1km，请规划行车路线",
			"太白南路高峰期，请择路而行",
		],
		currentNoticeIndex: 0,
	},

	computed: {
		// 当前页面展示的 chats
		chatsShow(data) {
			// 按照时间排序
			let chatsShow = data.chats.filter(item => {
				return true;
			});
			chatsShow.sort((a, b) => b.date.localeCompare(a.date));
			return chatsShow;
		},
		noticeShow(data) {
			let noticeShow = data.notice[data.currentNoticeIndex];
			if (noticeShow.length > 12) noticeShow = noticeShow.slice(0, 12) + "...";
			return noticeShow;
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
						id: 2,
						owner: 2,
						headIcon: app.globalData.default[0].avatarUrl,
						name: app.globalData.default[0].nickname,
						content: "凤城八路又堵了...",
						likes: [2, 3, 4],
						date: "2022-04-20T12:00:01Z",
						address: "陕西省西安市未央区凤城八路109号",
					},
					{
						id: 3,
						owner: 3,
						headIcon: app.globalData.default[1].avatarUrl,
						name: app.globalData.default[1].nickname,
						content: "西沣路出车祸了，友友们绕路吧",
						likes: [2],
						date: "2022-04-21T10:00:02Z",
						address: "陕西省西安市长安区西沣路",
					},
					{
						id: 4,
						owner: 4,
						headIcon: app.globalData.default[2].avatarUrl,
						name: app.globalData.default[2].nickname,
						content: "西沣路半小时没动了，救命...",
						likes: [],
						date: "2022-04-21T10:40:03Z",
						address: "陕西省西安市长安区西沣路",
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
		// 前往消息页面
		handleNavigateNotice(e) {
			wx.navigateTo({
				url: '/pages/notice/notice',
			})
		},
		// 当前轮播图 index 改变
		handleChangeCurrentGallery(e) {
			this.setData({
				currentGallery: e.detail.current,
			});
		},
		// 跳转 web-view
		handleOpenOfficialAccount(e) {
			let gallery = this.data.gallerys[this.data.currentGallery];
			wx.navigateTo({
				url:
					"/pages/web-view/web-view?src=" +
					JSON.stringify(gallery.url) +
					"&title=" +
					JSON.stringify(gallery.title),
			});
		},
		// 举报分享
		handleReport(e) {
			if (!login.checkLogin()) return;
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
			if (!login.checkLogin()) return;
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
			if (!login.checkLogin()) return;
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
			if (!login.checkLogin()) return;
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
			// 通告
			let { currentNoticeIndex, notice } = this.data;
			setInterval(() => {
				currentNoticeIndex = (currentNoticeIndex + 1) % notice.length;
				this.setData({
					currentNoticeIndex,
				});
			}, 3000);
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
