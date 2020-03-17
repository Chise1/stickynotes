// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';

const getUsers = function() {
	let ret = '';
	ret = uni.getStorageSync(USERS_KEY);
	if (!ret) {
		ret = '[]';
	}
	return JSON.parse(ret);
}

const server_ip = "http://39.98.132.68:8032"
const addUser = function(userInfo,func) { //注册账户,func是login的回调函数
	uni.request({
		url: server_ip + "/register",
		data: userInfo,
		method: 'POST',
		success: (res) => {
			res = res.data
			if (res.code == 0) {
				uni.setStorage({
					key: 'jwt',
					data: res.jwt
				})
				func(res.userName)
				uni.showToast({
					title: "注册成功"
				})
				uni.redirectTo({
					url:"/pages/main/main"
				});
			} else {
				uni.showToast({
					title: res.msg
				})
			}

		}
	})
}

export default {
	getUsers,
	addUser
}
