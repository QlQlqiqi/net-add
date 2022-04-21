const computedBehavior = require("miniprogram-computed").behavior;
const util = require("../../utils/util");
const app = getApp();
Component({
	behaviors: [computedBehavior],
	properties: {
		// 该说说
		group: Object,
		// 最大列宽
		componentWidthMax: Number,
		divLine: false,
	},

	data: {},

	computed: {
		date(data) {
			return util.formatDate(data.group.date);
		},
		last(data) {
			let last = {
				nickname: "",
				content: "",
				date: data.date,
			};
			if (!data.group.content.length) return last;
			let lastContent = data.group.content[data.group.content.length - 1];
			last.nickname = lastContent.nickname;
			last.content = lastContent.content;
			if (last.content.length > 5)
				last.content = last.content.slice(0, 5) + "...";
			last.date = util.formatDate(lastContent.date);
			return last;
		},
	},

	watch: {},

	/**
	 * 组件的方法列表
	 */
	methods: {},
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
