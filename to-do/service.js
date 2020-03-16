// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';

const server_id = "http://39.98.132.68:8032"
const getUsers = function() {
	let ret = '';
	ret = uni.getStorageSync(USERS_KEY);
	if (!ret) {
		ret = '[]';
	}
	return JSON.parse(ret);
}
//注册账户 微信小程序

const register = function(userInfo) {
	console.log(userInfo)
	uni.request({
		url: server_id + "/register",
		data: userInfo,
		method: "POST",
		success(res) { //注册返回
			console.log(res)
			res = res.data
			if (res.code == 0) {
				//注册成功，保存注册的账户密码
				let users = getUsers();
				users.push({
					account: res.account,
					password: userInfo.password
				});
				uni.setStorageSync(USERS_KEY, JSON.stringify(users));
				uni.setStorage({
					key:"jwt",
					data:res.jwt
				})
				uni.showToast({
					title: '注册成功'
				});
				uni.navigateBack({
					delta: 2
				})
			}
			//注册成功跳转到index
			else if (res.code == 1) {
				uni.showToast({
					title: "该账户已注册"
				})
			}else if(res.code==2){
				uni.showToast({
					title:"内部错误,请重试!"
				})
			}
			 else {
				uni.showToast({
					title: "注册失败"
				})
			}
		},
		fail(res) {
			uni.showToast({
				title: "注册失败"
			})
			console.log(res)
			return false
		}
	})
}
// 微信登录接口（通过code进行登录)
const wx_login = function(detail) {
	//detail {errMsg: "login:ok", code: "0219ziTz1U3Mt904drSz1plgTz19ziTv"}
	if (detail.errMsg == 'login:ok') { //提示获取code成功
		uni.request({
			url: server_id + "/wx_login",
			data: detail,
			method: 'POST',
			success(res) { //res返回值：{"msg":"not regist","code":0}#没有注册，code不为0则代表失败
				// {"msg":"success"}#登录成功,两者都携带有openId和session_key
				res = res.data
				console.log(res)
				if (res.code != 0) {
					uni.showToast({
						title: res.code,
					})
					console.log(res)

					return false
				} else {
					console.log("跳转注册页面")
					uni.setStorageSync("wx_info", JSON.stringify({
						openid: res.openid,
						session_key: res.session_key
					}))
					//判断是否未注册，未注册则进入注册页面
					if (res.msg == "not regist") {
						uni.navigateTo({
							url: "/pages/reg/reg?login_info=wx",
						})
					}else{
						
						uni.navigateBack({
							delta:1
						})
					}
					//已经注册则跳转到登录页面
				}
			},
			fail(res) {
				uni.showModal({
					title: "登录失败！",
				})
			}
		})
	}
}

//微信上传数据
const wx_upload_user_info = function(userInfo) {
	let data = userInfo.userInfo
	console.log(uni.getStorageSync('wx_info'))
	let wx_info=JSON.parse(uni.getStorageSync('wx_info'))
	data.openid=wx_info.openid
	console.log("openid",data.openid)
	data.platform = 'wx'
	uni.request({
		url: server_id + "/userinfo",
		data: userInfo.userInfo,
		dataType: 'json',
		method: 'POST',
		fail(err) {
			console.log('get_userinfo error:')
			console.log(e)
		}
	})
}
export default {
	getUsers,
	register,
	wx_login,
	wx_upload_user_info
}
