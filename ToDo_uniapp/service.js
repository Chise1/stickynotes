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
//测试端口
const server_ip="http://39.98.132.68:8033"
//正式端口
// const server_ip = "http://www.salent.vip"
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



//数据处理相关



const get_data = function(list) { //从服务器加载数据
	uni.getStorage({
		key: 'jwt',
		success(res) {
			let jwt = res.data

			uni.request({
				url: server_ip + "/data",
				data: {
					jwt: jwt
				},
				method: 'GET',
				success(res) {
					if (res.statusCode !== 200) {
						uni.showToast({
							title: "加载失败"
						})
					}
					res = res.data
					if (res.code == 0) {
						let data = res.data
						data.forEach((item, index) => {
							//将操作按钮信息集成进来
							if (item.checked) {
								item.options = [{
									text: '修改'
								}, {
									text: '取消',
									style: {
										backgroundColor: 'rgb(254,156,1)'
									}
								}, {
									text: '删除',
									style: {
										backgroundColor: 'rgb(255,58,49)'
									}
								}]
							} else {
								item.options = [{
									text: '修改'
								}, {
									text: '完成',
									style: {
										backgroundColor: 'rgb(254,156,1)'
									}
								}, {
									text: '删除',
									style: {
										backgroundColor: 'rgb(255,58,49)'
									}
								}]
							}
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
		},
		fail(res) {
			uni.showToast({
				title: "请先登录"
			})
		}
	})
}
//data:要上传的数据,
// 原始的list
const create_data = function(data, list) {
	console.log("我被调用了")
	let info = JSON.parse(JSON.stringify(data))
	uni.getStorage({
		key: 'jwt',
		success(res) {
			info.jwt = res.data
			uni.request({
				url: server_ip + "/data",
				method: "POST",
				data: info,
				success(res) {
					if (res.statusCode != 200) {
						uni.showToast({
							title: "创建失败"
						})
						//把创建的数据删掉
						list.forEach((item, index) => {
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
					} else {

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
						console.log("我被执行了：", index)
						if (item.id == data.id) {
							list.splice(index, 1)
						}
					})
				}
			})
		},
		fail(res) {
			uni.showToast({
				title: "请先登录"
			})
		}
	})
}

//删除某条数据
const delete_data = function(index, list) {
	let info = {
		id: list[index].id
	}
	uni.getStorage({
		key: 'jwt',
		success(res) {
			info.jwt = res.data
			let data = list[index]
			list.splice(index, 1)
			uni.request({
				url: server_ip + "/data",
				method: "DELETE",
				data: info,
				success(res) {
					res_data = res.data
					if (res.statusCode != 200) {
						uni.showToast({
							title: "服务器异常"
						})
						//把删除的数据补回来
						list.splice(index, 0, data)
						return
					} else {
						res_data = res.data
						if (res.code != 0) {
							uni.showToast({
								title: res_data.msg
							})
							list.splice(index, 0, data)
							return
						}
					}
				},
				fail() {
					uni.showToast({
						title: "删除失败"
					})
				}
			})
		},
		fail(res) {
			uni.showToast({
				title: "请先登录"
			})
		}
	})
}


//修改单个元素使用该操作,flag是用来判断是完成还是取消完成
const modify_data = function(index, flag, list) {
	let info = null
	if(flag == 'checked') {
		info = {
			id: list[index].id,
			flag: 'checked',
			
		}
	} else {
		info = {
			id: list[index].id,
			flag: 'unchecked'
		}
	}
	list[index].checked = !list[index].checked
	uni.getStorage({
		key: 'jwt',
		success(res) {
			let jwt = res.data
			info.jwt=jwt
			uni.request({
				url: server_ip + "/data",
				method: 'PUT',
				data: info,
				success(res) {
					if (res.statusCode != 200) {
						uni.showToast({
							title: '服务器错误'
						})
						list[index].checked = !list[index].checked
					} else {
						let data = res.data
						if (data.code != 0) {
							uni.showToast({
								title: data.msg
							})
							list[index].checked = !list[index].checked
						}
					}

				}
			})
		},
		fail() {
			uni.showToast({
				title: "未登陆"
			})
		}
	})
}


export default {
	getUsers,
	addUser,
	create_data,
	delete_data,
	modify_data,
	get_data,
	server_ip
}
