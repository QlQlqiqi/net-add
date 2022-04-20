const app = getApp();
const computedBehavior = require("miniprogram-computed").behavior;
const util = require("../../utils/util");
Component({
	behaviors: [computedBehavior],
	properties: {},

	data: {
		pageName: "增加分享",
		chatContent: "",
		maxLength: 800,
		address: "",
	},

	computed: {
		charInputLength(data) {
			return data.chatContent.length;
		},
	},

	methods: {
		// 返回上一页面
		handleBack(e) {
			wx.navigateBack();
		},
		// 取消
		handleCancel(e) {
			this.handleBack(e);
		},
		// 确定
		handleEnsure(e) {
			// 内容和地址不得为空
			const {chatContent, address} = this.data;
			if(!chatContent || !address) {
				const title = !chatContent? '内容不得为空': '地址不得为空';
				wx.showToast({
					title,
					icon: 'error'
				})
				return;
			}
			const date = new Date();
			const chat = {
				id: date.getTime(),
				owner: app.globalData.owner,
				headIcon: app.globalData.avatarUrl,
				name: app.globalData.nickname,
				content: chatContent,
				likes: [],
				date: util.convertDateToString(date),
				address: address,
			};
			const chats = JSON.parse(wx.getStorageSync("chats") || "[]");
			chats.push(chat);
			wx.setStorageSync("chats", JSON.stringify(chats));
			wx.showToast({
				title: '成功',
				icon: 'success'
			})
			this.handleBack();
		},
		// 绑定输入
		handleInput(e) {
			this.setData({
				chatContent: e.detail.value,
			});
		},
		// 获取当前位置
		handleGetAdd(e) {
			// 不多次获取
			if (this.data.address) return;
			const _this = this;
			wx.getLocation({
				type: "gcj02",
				altitude: true,
				isHighAccuracy: true,
				highAccuracyExpireTime: 3000,
				success: res => {
					const { latitude, longitude } = res;
					_this.setData({
						latitude,
						longitude,
					});
					wx.request({
						url:
							"https://apis.map.qq.com/ws/geocoder/v1/?location=" +
							latitude +
							"," +
							longitude +
							"&key=KEFBZ-HPRCU-EJ5VK-2ZBFL-JJYB7-TBBT6",
						method: "GET",
						success: res => {
							_this.setData({
								address: res.data.result.address,
							});
						},
					});
				},
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
});
