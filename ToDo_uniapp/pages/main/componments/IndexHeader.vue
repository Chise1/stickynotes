<template>
	<view class="todo-header">
		<view class="todo-header-left">
			<text class="active-text">{{active_text}}</text>
			<text>{{data_num}}条</text>
		</view>
		<!-- 状态栏右侧 -->
		<view class="todo-header-right">
			<view class="todo-header-right-item" :class="{'active-table':(active===0)}" @click="tab(0)">全部</view>
			<view class="todo-header-right-item" :class="{'active-table':(active===1)}" @click="tab(1)">代办</view>
			<view class="todo-header-right-item" :class="{'active-table':(active===2)}" @click="tab(2)">完成</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'IndexHeader',
		props: {
			//当前数据条数
			data_num:{
				type:Number
			},
			//默认显示全部，1为显示代办，2为显示完成
			get_active:{
				type:Number,
				default:0
			}
		},
		onLoad() {
			this.active=this.get_active
		},
		data() {
			return {
				active:0
			}
		},
		computed:{
			active_text(){
				if(this.active===0){
					return "全部"
				}else if(this.active===1){
					return "代班"
				}else{
					return "完成"
				}
			}
		},
		methods:{
			tab(index){
				this.active=index
				this.$emit("choose_state",index)
			}
		}
	}
</script>

<style>
	.todo-header {
		position: fixed;
		top: var(--window-top);
		left: 0;
		width: 100%;
		display: flex;
		align-items: center;
		font-size: 12px;
		color: #333333;
		height: 45px;
		box-shadow: -1px 1px 5px 0 rgba(0, 0, 0, 0.1);
		background-color: #FFFFFF;
		pad: 0 15px;
		z-index: 10;
		box-sizing: border-box;
	}
	
	.todo-header-left {
		width: 100%;
	
	}
	
	.todo-header-right {
		flex-shrink: 0;
		display: flex;
	
	}
	
	.todo-header-right-item {
		padding: 0 5px;
	}
	.active-table {
		color: #007AFF;
	}
	
	.active-text {
		font-size: 14px;
		color: #279abf;
		padding-right: 10px;
	}
	
</style>
