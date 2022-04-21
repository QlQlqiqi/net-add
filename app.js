// app.js
App({
	globalData: {
		owner: 1,
		avatarUrl: "",
		nickname: "",
		default: [{
			owner: 2,
			avatarUrl: "https://pic.dogimg.com/2022/04/21/6260bf18ad907.png",
			nickname: "dk",
		}, {
			owner: 3,
			avatarUrl: "https://pic.dogimg.com/2022/04/21/6260bf286156e.png",
			nickname: "酢浆草cu",
		}, {
			owner: 4,
			avatarUrl: "https://pic.dogimg.com/2022/04/21/6260c02eac957.png",
			nickname: "海绵宝宝",
		}],
	},
	onLaunch() {
		this.globalData.login = JSON.parse(wx.getStorageSync("login") || "false");
		this.globalData.avatarUrl = JSON.parse(
			wx.getStorageSync("avatarUrl") || JSON.stringify("")
		);
		this.globalData.nickname = JSON.parse(
			wx.getStorageSync("nickname") || JSON.stringify("")
		);
		console.log(this.globalData);
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
