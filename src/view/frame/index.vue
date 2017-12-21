<template>
	<div class="logger-frame">
		<div class="logger-frame-header">
			<!-- 放置头部 -->
			<slot name="head"></slot>
		</div>
		<div class="logger-frame-body" ref="loggerBody">
			<!-- 放置内容 -->
			<slot name="body"></slot>
		</div>
	</div>
</template>
<script>
export default {
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

<style lang="less" scoped>
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
		width: 100%;
		height: 100%;
		margin-top: 8px;
		position: relative;
	}
}
</style>