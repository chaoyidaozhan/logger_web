<template>
	<div class="no_data_wrap">
		<div class="icon-wrap">
			<slot name="icon"></slot>

			<i v-show="!haveIcon" class="icon-no-data" type="sad-outline" style="color: rgb(238, 239, 240)"></i>
		</div>
		<div class="p">
			<slot name="content"></slot>

			<p v-show="!haveContent">未查询到相关数据</p>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		computed:{
			haveIcon(){
				if( this.$slots['icon'] ){
					return true
				}else{
					return false
				}
			},
			haveContent(){
				if( this.$slots['content'] ){
					return true
				}else{
					return false
				}				
			}
		},
		mounted(){

		}
	}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.no_data_wrap {
	width: 100%;
	height: 130px;
	margin-top: 120px;
	position: relative;
	color: @gray-color-light;
	.icon-wrap {
		width: 100px;
		height: 100px;
		margin-left: 50%;
		transform: translate(-50%, 0);
		i,
		.icon {
			width: 100%;
			height: 100%;
			text-align: center;
			line-height: 100px;
			font-size: 100px;
			color: @gray-color-light;
		}
	}
	.p {
		text-align: center;
		line-height: 30px;
		font-size: 14px;
	}
}
</style>