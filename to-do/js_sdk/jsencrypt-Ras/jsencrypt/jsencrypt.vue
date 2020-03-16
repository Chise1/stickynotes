<template>
	<view>
		
	</view>
</template>

<script>
	import JSEncrypt from './jsencrypt.min.js';
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		setEncrypt:function(publicKey,data){
				const encrypt =new JSEncrypt();
				encrypt.setPublicKey(publicKey);
		
				return encrypt.encrypt(data);
		},
		setDecrypt:function(PrivateKey,data){
				const encrypt =new JSEncrypt();
				encrypt.setPrivateKey(PrivateKey);
				
				return encrypt.decrypt(data);
		}
	}
</script>

<style>

</style>
