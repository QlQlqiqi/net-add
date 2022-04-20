// app.js
App({
	globalData: {
		owner: 0,
		avatarUrl: "",
		nickname: "",
	},
	onLaunch() {
		this.globalData.login = JSON.parse(wx.getStorageSync("login") || "false");
		this.globalData.avatarUrl = JSON.parse(
			wx.getStorageSync("avatarUrl") ||
				JSON.stringify("/public/image/anameBlue.svg")
		);
		this.globalData.nickname = JSON.parse(
			wx.getStorageSync("nickname") || JSON.stringify("小蓝")
		);
		console.log(this.globalData)
		// 获取设备相关信息
		let menuButtonObject = wx.getMenuButtonBoundingClientRect();
		wx.getSystemInfo({
			success: res => {
				let statusBarHeight = res.statusBarHeight,
					navTop = menuButtonObject.top,
					navHeight =
						statusBarHeight +
						menuButtonObject.height +
						(menuButtonObject.top - statusBarHeight) * 2;
				// 导航栏高度
				this.globalData.navHeight = navHeight;
				// 导航栏距离顶部距离
				this.globalData.navTop = navTop;
				// 可使用窗口高度
				this.globalData.windowHeight = res.windowHeight;
				// 可使用窗口宽度
				this.globalData.windowWidth = res.windowWidth;
				// 底部“黑线”高度
				this.globalData.bottomLineHeight =
					res.windowHeight - res.safeArea.bottom;
			},
			fail(err) {
				console.error(err);
			},
		});
	},
});
