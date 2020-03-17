<template>
	<view>
		<!-- 状态栏 -->
		<index-header v-if="list.length!=0" :data_num="data_num" @choose_state="tab"></index-header>
		<!-- 没有数据 -->
		<view v-if="list.length==0">
			<view class="image-default">
				<image src="../../static/default.png" mode="aspectFit" class="default"></image>
			</view>
			<view class="default-info">
				<view class="defa-text">您还没有创建任何待办事项</view>
				<view class="defa-text">点击下方+添加一个把</view>
			</view>
		</view>
		<!-- 内容 -->
		<todo-content @change="finish" :listData="listData"></todo-content>
		<!-- 创建按钮 -->
		<view class="create-todo" @click="create">
			<text class="iconfont icon-add" :class="{'create-todo-active':acitve}"></text>
		</view>
		<!-- 输入框 -->
		<view class="create-content" v-if="acitve" :class="{'create--show':acitve}">
			<view class="create-content-box">
				<!-- input 输入 -->
				<view class="create-input">
					<input type="text" v-model="value" placeholder="请输入您要创建的todo" />
				</view>
				<view class="create-button" @click="add">
					创建
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import service from '../../service.js'
	import IndexHeader from './componments/IndexHeader.vue'
	import TodoContent from './componments/TodoContent.vue'
	export default {
		components: {
			IndexHeader,
			TodoContent
		},
		computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		data() {
			return {
				//输入值
				value: '',
				//显示值
				list: [],//list结构：{id,id: content,checked: false}
				acitve: false, //选中效果
				activeIndex: 0,
			}
		},
		onLoad() {
			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: (res) => {
						if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
							if (this.forcedLogin) {
								uni.reLaunch({
									url: '../login/login'
								});
							} else {
								uni.navigateTo({
									url: '../login/login'
								});
							}
						}
					}
				});
			}
		},
		computed: {
			listData() {
				//深度复制
				var listx = JSON.parse(JSON.stringify(this.list))
				let newList = []
				//全部
				if (this.activeIndex === 0) {
					return listx
				}
				//已完成
				else if (this.activeIndex === 1) {
					listx.forEach((item) => {

						if (!item.checked) {
							newList.push(item)
						}
					})
					return newList
				} else if (this.activeIndex === 2) {
					listx.forEach((item) => {
						if (item.checked) {
							newList.push(item)
						}
					})
					return newList
				}
			},
			//要显示的数据条数
			data_num() {
				return this.listData.length
			},
			//从vuex获取存储的登录状态和登录设置
			...mapState(['forcedLogin', 'hasLogin', 'userName'])

		},
		methods: {
			//显示输入框
			create: function() {
				this.acitve = !this.acitve
				this.$nextTick(function() {
					setTimeout(() => {

					}, 50)
				})
			},
			add: function() {//创建按钮，新增数据
				if (this.value == '') {
					uni.showToast({
						title: "请输入内容",
						icon: 'none'
					})
					return
				}
				let data={
					id: 'id' + new Date().getTime(),
					content: this.value,
					checked: false,
					has_upload:false
				}
				this.list.unshift(data)
				this.value = ''
				this.acitve = false
				service.create_data(data,this.list)
			},
			finish(id) {
				console.log(this.list)
				let index = this.list.findIndex((item) => item.id === id)
				this.list[index].checked = !this.list[index].checked
				// item=>{
				// 	if(item.id==id){
				// 		console.log(item)
				// 		item.checked=!item.checked
				// 	}
				// }
			},
			tab(index) {
				console.log("接受:", index)
				this.activeIndex = index
			}

		},
		watch:{
			hasLogin:function(newQuestion, oldQuestion){
				if(newQuestion=='')
				{
					return 
				}
				console.log("成功侦听")
				service.get_data(this.list)
				
			}
		}
		
	}
</script>
<style>
	@import '../../common/icon2.css';

	.create-todo {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 20px;
		left: 0;
		right: 0;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		margin: 0 auto;
		background-color: #deeff5;
		box-shadow: -1px 1px 5px 2px rgba(0, 0, 0, 0.1), -1px 1px 1px 0 rgba(255, 255, 255) inset;
	}

	.icon-add {
		font-size: 30px;
		color: #add816;
	}

	.create-content {
		position: fixed;
		bottom: 95px;
		left: 20px;
		right: 20px;
		transition: all 0.3s;
		opacity: 0;
		transform: scale(0) translateY(200%);
	}

	.create--show {
		opacity: 1;
		transform: scale(1) translateY(0);
	}

	.create-content-box {
		display: flex;
		align-items: center;
		padding: 0 15px;
		padding-right: 0;
		border-radius: 50px;
		background: #DEEFF5;
		;
		box-shadow: -1px 1px 5px 2px rgba(0, 0, 0, 0.1), -1px 1px 0 rgba(255, 255, 255) inset;
		z-index: 2;
	}

	.create-input {
		width: 100%;
		padding-right: 15px;
		color: #add816;
	}

	.create-button {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		height: 50px;
		width: 80px;
		border-radius: 50px;
		font-size: 16px;
		color: #88d4ec;
		box-shadow: -2px 0px 2px 1px rgba(0, 0, 0, 0.1);
	}

	.create-content:after {
		content: '';
		position: absolute;
		right: 0;
		left: 0;
		margin: 0 auto;
		width: 20px;
		height: 20px;
		background: #DEEFF5;
		transform: rotate(45deg);
		bottom: -8px;
		box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, 0.1);
		z-index: -1;
	}

	.create-content-box:after {
		content: '';
		position: absolute;
		right: 0;
		left: 0;
		margin: 0 auto;
		width: 20px;
		height: 20px;
		background: #DEEFF5;
		transform: rotate(45deg);
		bottom: -8px;
	}

	.default {
		padding-top: 100px;
	}

	.image-default {
		display: flex;
		justify-content: center;
	}

	.image-default image {

		width: 100%;
	}

	.default-info {
		text-align: center;
		font-size: 14px;
		color: #ccc;
	}

	.icon-add {
		transition: transform 0.3s;
	}

	.create-todo-active {
		transform: rotate(135deg);
	}
</style>
