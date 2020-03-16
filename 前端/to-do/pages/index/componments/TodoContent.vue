<template>
	<view class="todo-content">
		<view class="todo-list" :class="{'todo--finish':item.checked}" v-for="(item,index) in listData" :key="item.id" @click="finish(item.id)">
			<view class="todo-list-checkbox">
				<view class="checkbox"></view>
			</view>
			<view class="todo-list-content">{{item.content}} </view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'TodoContent',
		props: {
			listData: {
				type: Array,
			}
		},
		data() {
			return {}
		},
		methods:{
			finish(id){
				this.$emit('change',id)
			}
		}
	}
</script>

<style>
	.todo-content {
		position: relative;
		padding-top: 50px;
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
