const app = getApp();
const computedBehavior = require("miniprogram-computed").behavior;
const util = require('../../utils/util')
Component({
	behaviors: [computedBehavior],
	properties: {},

	data: {
		group: {},
		_scrollTop: 0,
		scrollTop: 0,
		owner: app.globalData.owner,
		inputContent: "",
	},

	computed: {
		pageName(data) {
			return data.group.title;
		},
		InputBottom(data) {
			return data.bottomLineHeight;
		},
	},

	methods: {
		// 返回
		handleBack(e) {
			wx.navigateBack();
		},
		InputFocus(e) {
			this.setData({
				InputBottom: e.detail.height,
			});
		},
		InputBlur(e) {
			this.setData({
				InputBottom: this.data.bottomLineHeight,
			});
		},
		// 输入
		handleInput(e) {
			const {
				detail: { value },
			} = e;
			this.setData({
				inputContent: value,
			});
		},
		// 发送
		handleSend(e) {
			const { group, owner, inputContent } = this.data;
			const { nickname, avatorUrl } = app.globalData;
			const newContent = {
				owner,
				nickname,
				avatorUrl,
				content: inputContent,
				date: util.formatDate(util.convertDateToString(new Date())),
			}
			group.content.push(newContent);
			this.setData({
				group,
				inputContent: ''
			})
			const groups = JSON.parse(wx.getStorageSync('groups') || "[]");
			for(const item of groups) {
				if(item.id == group.id) {
					item.content.push(newContent)
				}
			}
			wx.setStorageSync('groups', JSON.stringify(groups));
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
