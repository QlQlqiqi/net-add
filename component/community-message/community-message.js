const computedBehavior = require("miniprogram-computed").behavior;
const util = require("../../utils/util");
const app = getApp();
Component({
	behaviors: [computedBehavior],
	/**
	 * 组件的属性列表
	 */
	properties: {
		// 该说说
		chat: Object,
		// 最大列宽
		componentWidthMax: Number,
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		chatShow: false,
		optionsShow: false,
	},

	computed: {
		date(data) {
			return util.formatDate(data.chat.date);
		},
		likeIcon(data) {
			const owner = app.globalData.owner;
			return data.chat.likes.findIndex(item => item == owner) === -1
				? "/public/image/like-unselected.png"
				: "/public/image/like.png";
		},
		options(data) {
			const options = [
				{ icon: "/public/image/option-report.svg", content: "举报" },
				{ icon: "/public/image/option-delete.svg", content: "删除" },
			];
			if (data.chat.owner != app.globalData.owner) options.splice(1, 1);
			return options;
		},
	},

	watch: {},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点赞
		handleAddLike(e) {
			this.triggerEvent("addLike", {
				id: this.properties.chat.id,
			});
		},
		// 打开说说的功能区
		handleShowOptions(e) {
			this.setData({
				optionsShow: !this.data.optionsShow,
			});
		},
		// 点击相关功能，告诉父组件
		handleSelectOption(e) {
			const index = e.currentTarget.dataset.index;
			const id = this.properties.chat.id;
			if (!index)
				this.triggerEvent("report", {
					id,
				});
			else if (index == 1)
				this.triggerEvent("delete", {
					id,
				});
			this.setData({
				optionsShow: false,
			});
		},
	},
	pageLifetimes: {
		// 加载数据
		show: function () {
			// 设置机型相关信息
			let {
				navHeight,
				navTop,
				windowHeight,
				windowWidth,
				bottomLineHeight,
			} = app.globalData;
			// 从后端拉取数据
			// this.getDataFromSql();
			this.setData({
				navHeight,
				navTop,
				windowHeight,
				windowWidth,
				ratio: 750 / windowWidth,
				bottomLineHeight,
			});
		},
	},
});
