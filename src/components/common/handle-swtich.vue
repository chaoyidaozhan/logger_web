<template>
	<div class="handle_switch">
		<div class="btn-left btn"  @click="handleSwtich(0)" :class="{active:activeIndex==0}">
			{{this.contentArr[0]}}
		</div>
		<div class="btn-right btn" @click="handleSwtich(1)" :class="{active:activeIndex==1}">
			{{this.contentArr[1]}}
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		props:{
			contentArr:{
				type:Array,
				default(){
					return ['','']
				}
			}
		},
		data(){
			return {
				activeIndex:0,
			}
		},
		methods:{
			handleSwtich(index) {
				if( index==this.active ){
					return ;
				}
				this.activeIndex = index ;
				this.$emit('handleSwtich', index);
			},
		}

	}
</script>
<style lang="less" scoped>
@import '../../assets/css/var.less';
.handle_switch{
	width: 200px;
	height: 36px;
	font-size: 14px;
	position: absolute;
	left: 50%;
	top: 50%;
	margin: -18px 0 0 -100px;
	.btn{
		width: 100px;height: 36px;
		line-height: 36px;
		text-align: center;
		box-sizing: border-box;
		float: left;
		background: white;
		color: @switch-color;
		border: 1px solid @switch-border-color;
		position: relative;z-index: 1;
		transition: all .2s ease-in-out;
		cursor: pointer;
	}
	.btn:hover{
		background: rgba(247, 248, 249,0.8);
	}
	.btn-left{
		border-radius: 4px 0px 0px 4px;
	}
	.btn-right{
		border-radius: 0px 4px 4px 0px;
		position: relative;left: -1px;
	}
	.active{
		color: @primary-color;
		background: rgb(236,248,254);
		border:1px solid @primary-color;
		z-index: 2;
	}
	.active:hover{
		background: rgb(236,248,254);
	}
}
</style>
