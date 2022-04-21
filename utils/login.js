const app = getApp();
const util = require('./util')
/**
 * 监测是否登录，未登录则弹窗登录
 * @returns {Boolean}
 */
function checkLogin() {
	if (!app.globalData.login) {
		util
			.getUserProfile("获取头像和昵称用于身份识别")
			.then(res => {
				app.globalData.avatarUrl = res.userInfo.avatarUrl;
				app.globalData.nickname = res.userInfo.nickName;
				app.globalData.login = true;
				wx.setStorageSync("login", JSON.stringify(true));
				wx.setStorageSync("nickname", JSON.stringify(app.globalData.nickname));
				wx.setStorageSync(
					"avatarUrl",
					JSON.stringify(app.globalData.avatarUrl)
				);
			})
			.catch(err => {
				console.log(err);
			});
		return false;
	}
	return true;
}

module.exports = {
	checkLogin,
};
