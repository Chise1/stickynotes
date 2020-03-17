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
const addUser = function(userInfo, func) { //注册账户,func是login的回调函数
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
					url: "/pages/main/main"
				});
			} else {
				uni.showToast({
					title: res.msg
				})
			}

		}
	})
}
const get_data = function(list) { //从服务器加载数据
console.log(list)
	let jwt = uni.getStorageSync('jwt')
	if (jwt) {
		uni.request({
			url: server_ip + "/data",
			data:{jwt:jwt},
			method: 'GET',
			success(res) {
				if(res.statusCode!==200){
					uni.showToast({
						title:"加载失败"
					})
				}
				res = res.data
				if (res.code == 0) {
					console.log("加载数据",res.data)
					let data=res.data
					data.forEach((item,index)=>{
						list.unshift(item)
						})
				} else {
					uni.showToast({
						title: res.msg
					})
				}
			},
			fail() {
				uni.showToast({
					title: "服务器异常"
				})
			}
		})
	} else {
		uni.showToast({
			title: "请先登录"
		})
	}

}
//data:要上传的数据,
// 原始的list
const create_data = function(data, list) {
	console.log("我被调用了")
	let info=JSON.parse(JSON.stringify(data))
	info.jwt=uni.getStorageSync('jwt')
	uni.request({
		url: server_ip + "/data",
		method: "POST",
		data: info,
		success(res) {
			if(res.statusCode!=200){
				uni.showToast({
					title: "创建失败"
				})
				//把创建的数据删掉
				list.forEach((item, index) => {
					console.log("我被执行了：",index)
					if (item.id == data.id) {
						list.splice(index, 1)
					}
				})
				return 
			}
			res = res.data
			if (res.code == 0) {
				data.id = res.data_id
				data.has_upload = true
			}else{
				
			}
		},
		fail() {
			uni.showToast({
				title: "创建失败"
			})
			console.log("即将删除")
			console.log(list)
			//把创建的数据删掉
			list.forEach((item, index) => {
				console.log("我被执行了：",index)
				if (item.id == data.id) {
					list.splice(index, 1)
				}
			})
		}
	})
}
export default {
	getUsers,
	addUser,
	create_data,
	get_data
}
