<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input type="text" focus clearable v-model="account" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
			<view class="input-row">
				<text class="title">邮箱：</text>
				<m-input type="text" clearable v-model="email" placeholder="请输入邮箱"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="register">注册</button>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import mInput from '../../components/m-input.vue';
	import {
		mapMutations
	} from 'vuex'
	export default {
		components: {
			mInput
		},
		data() {
			return {
				account: '',
				password: '',
				email: '',
				login_info:'',
			}
		},
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			//判断是哪个端登录的信息
			let flag = option.login_info || ''
			if (flag == 'wx') {
				this.login_info = 'wx'
			} else {
				console.log("未知注册方式")
			}
		},
		methods: {
			...mapMutations(['save_user_info']),
			register() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				if (this.account.length < 5) {
					uni.showToast({
						icon: 'none',
						title: '账号最短为 5 个字符'
					});
					return;
				}
				
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				if (this.email.length < 3 || !~this.email.indexOf('@')) {
					uni.showToast({
						icon: 'none',
						title: '邮箱地址不合法'
					});
					return;
				}

				let data = {
					account: this.account,
					password: this.password,
					email: this.email
				}
				//微信注册
				if (this.login_info == 'wx') {
					let wx_info =JSON.parse(uni.getStorageSync('wx_info'));
					data.openid=wx_info.openid
					data.session_key=wx_info.session_key
					data.flag='wx'
				}
				service.register(data);
			}
		},
	}
</script>

<style>
	@import '../../common/login_css.css';
</style>
