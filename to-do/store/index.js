import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin: false,
		userName: "",
		jwt:''//鉴权使用的jwt
	},
	mutations: {
		//登录成功之后记录用户的信息
		save_user_info(state, userInfo) {
			state.userName = userInfo.userName
			state.hasLogin = true;
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		},
		save_jwt(state,info){
			state.jwt=info
		}
	}
})

export default store
