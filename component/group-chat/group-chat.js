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
			if (!data.group.content.length) {
				return { nickname: "", content: "", date: data.date };
			}
			return data.group.content[0];
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
