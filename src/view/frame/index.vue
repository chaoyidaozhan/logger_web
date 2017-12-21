<template>
	<div class="logger-frame">
		<slot name="othter"></slot>
		<div class="logger-frame-header" :style="{'left': leftDistance}">
			<!-- 放置头部 -->
			<slot name="head"></slot>
		</div>
		<div class="logger-frame-body" :style="{'margin-left': leftDistance}" ref="loggerBody">
			<!-- 放置内容 -->
			<slot name="body"></slot>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		leftDistance: {
			type: String,
			default: '0'
		}
	},
	mounted () {
		this.$store.state.screenHeight = this.$refs.loggerBody.offsetHeight;
		window.onresize = ()=>{  
			this.$store.state.screenHeight = this.$refs.loggerBody.offsetHeight;
			
			try {
				this.$eventbus.$emit('changeHeight');
			} catch(e){}
		}  
	}
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.logger-frame {
	width: 100%;
	height: 100%;
	padding-top: 60px;
	position: relative;
	.logger-frame-header {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 60px;
		line-height: 60px;
		font-size: 14px;
		border-bottom: 1px solid @gray-color-elip;
		padding: 0 20px;
		background-color: #fff;
	}
	.logger-frame-body {
		height: 100%;
		position: relative;
		::selection {
			color: @white-color;
			background-color: @primary-color;
		}
	}
}
</style>