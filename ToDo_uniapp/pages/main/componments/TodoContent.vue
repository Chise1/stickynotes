<template>
	<view>
		<!-- <view class="todo-content">
			<view class="todo-list" :class="{'todo--finish':item.checked}" v-for="(item,index) in listData" :key="item.id"
			 @click="finish(item.id)">
				<view class="todo-list-checkbox">
					<view class="checkbox"></view>
				</view>
				<view class="todo-list-content">{{item.content}} </view>
			</view>
		</view> -->
		<uni-swipe-action class="todo-content">
			<uni-swipe-action-item v-for="(item,index) in listData" :key="item.id" @click="swipeClick($event,index)" @change="swipeChange"
			 :options="item.options">
				<view @click="finish(index)" :class="{'content-checked':item.checked}">
				<view class="todo-list-checkbox">
					<view class="checkbox"></view>
				</view>
				<view  class="todo-list-content">{{item.content}} </view>
				
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
	</view>

</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem
		},
		name: 'TodoContent',
		props: {
			listData: {
				type: Array,
			}
		},
		data() {
			return {
				isOpened: false,
				swipeList: [{
					options: [{
						text: '添加',
						style: {
							backgroundColor: 'rgb(255,58,49)'
						}
					}],
					id: 0,
					content: 'item1'
				}, {
					id: 1,
					options: [{
						text: '置顶'
					}, {
						text: '删除',
						style: {
							backgroundColor: 'rgb(255,58,49)'
						}
					}],
					content: 'item2'
				}, {
					id: 2,
					options: [{
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
					}],
					content: 'item3'
				}]
			}
		},
		methods: {
			finish(index) { //主要是用于向上级反馈已经完成
				if(this.listData[index].checked==false){
					this.$emit('change','checked', index)
				}
				
			},
			modify(id) { //反馈修改数据
				pass
			},
			del(id) { //反馈被删除
				pass
			},
			bindClick(e) {
				uni.showToast({
					title: `点击了${e.content.text}按钮`,
					icon: 'none'
				})
			},
			setOpened() {
				this.isOpened = !this.isOpened
			},
			change(e) {
				this.isOpened = e
				console.log('返回：', e);
			},
			swipeChange(e) {
				console.log("触发滑动变更")
				console.log('返回：', e);
			},
			swipeClick(e, index) {
				let {
					content
				} = e
				//删除数据操作
				if (content.text === '删除') {
					uni.showModal({
						title: '提示',
						content: '是否删除',
						success: (res) => {
							if (res.confirm) {
								this.$emit('change', 'delete', index)
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
				else if(content.text==='取消'){//完成操作
					this.$emit('change', 'unchecked', index)
				}else if(content.text==='完成'){
					this.$emit('change', 'checked', index)
				}
				else {
					uni.showToast({
						title: `点击了${e.content.text}按钮`,
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style>
	.content-checked{
		text-decoration: line-through;
	}
	.todo-content {
		position: relative;
		top: 50px;
		/* bottom: 100px; */
		/* #ifdef MP-WEIXIN*/  
		top :20px;
		margin: 1px;
		/* #endif */
		padding-bottom: 100px;
	}

	.todo-list {
		position: relative;
		display: flex;
		align-items: center;
		padding: 15px;
		margin: 15px;
		border-radius: 10px;
		background-color: #cfebfd;
		color: #0c3854;
		font-size: 14px;
		box-shadow: -1px 1px 5px 0 rgba(0, 0, 0, 0.1), -1px 2px 1px 0 rgba(255, 255, 255) inherit;
		overflow: hidden;
	}

	.todo-list:after {
		position: absolute;
		content: '';
		bottom: 0;
		top: 0;
		left: 0;
		width: 5px;
		background: #91d1e8;
	}

	.todo-list-checkbox {
		padding-right: 15px;
	}

	.checkbox {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #FFFFFF;
		box-shadow: -1px 1px 5px 0 rgba(0, 0, 0, 0.1);
	}

	.todo--finish .checkbox {
		position: relative;
		background: #eee;
	}

	.todo--finish .checkbox:after {
		content: '';
		position: absolute;
		width: 10px;
		height: 10px;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		background-color: #cfebfd;
		border-radius: 50%;
		box-shadow: 0 0 2px 0px rgba(0, 0, 0, 0.2) inset;

	}

	.todo--finish .todo-list-content {
		color: #999999;
	}

	.todo--finish.todo-list:before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 40px;
		right: 10px;
		height: 2px;
		margin: auto 0;
		background-color: #bdcdd8;
	}

	.todo--finish.todo-list:after {
		background-color: #ccc;
	}
</style>
