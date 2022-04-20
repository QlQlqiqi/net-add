const app = getApp();
Component({
  data: {
    selected: 0,
    color: "#888",
    selectedColor: "#4B844D",
    list: [{
			"pagePath": "/pages/community/community",
			"iconPath": "/public/image/tabbar-community-unselected.png",
			"selectedIconPath": "/public/image/tabbar-community.png",
			"text": "社区"
		},
		{
			"pagePath": "/pages/group-chat/group-chat",
			"iconPath": "/public/image/tabbar-group-chat-unselected.png",
			"selectedIconPath": "/public/image/tabbar-group-chat.png",
			"text": "群聊"
		}]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      // 切换 tabbar 页面
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({url})
      this.setData({
        selected: data.index
      });
    }
  }
})