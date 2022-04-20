
/**
 * 获得凌晨的 date，如: 2021-07-05T00:00:00Z
 * @param {Number} offset 相对于当天凌晨偏移天数，默认 0
 * @returns {String} 
 */
const getDawn = function (offset = 0) {
	let date = new Date();
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	date.setTime(date.getTime() + offset * 1000 * 60 * 60 * 24);
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	return `${year}-${month < 10 ? "0" + month : month}-${
		day < 10 ? "0" + day : day
	}T00:00:00Z`;
};

/**
 * 格式化 date，转化时间为用户看到的时间
 * @param {String} date 时间 2019-10-14T13:41:45Z
 * @returns {String} 格式化后的时间
 */
function formatDate(date) {
	let todayYMD = getDawn(0).substr(0, 10);
	let year = date.substr(0, 4);
	let month = date.substr(5, 2);
	let day = date.substr(8, 2);
	let time = date.substr(11, 5),
		showDate;
	// 如果是今天，不显示年月日份
	if (date.substr(0, 10) === todayYMD) {
		showDate = time;
	}
	// 如果是今年的，显示月日
	else if (year === todayYMD.substr(0, 4)) {
		showDate = `${month}月${day}日${time}`;
	} else {
		showDate = `${year}年${month}月${day}日${time}`;
	}
	return showDate;
}

/**
 * 转化 date 为字符串 2019-10-14T13:41:45Z
 * @param {Date} date 日期
 * @returns {String}
 */
const convertDateToString = function (date) {
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let hour = date.getHours();
	let minute = date.getMinutes();
	let second = date.getSeconds();
	return `${year}-${month < 10 ? "0" + month : month}-${
		day < 10 ? "0" + day : day
	}T${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}:${
		second < 10 ? "0" + second : second
	}Z`;
};

module.exports = {
	getDawn,
	formatDate,
	convertDateToString
}
