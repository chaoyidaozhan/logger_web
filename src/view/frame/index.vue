<template>
	<div class="logger-frame">
		<div class="logger-frame-header">
			<!-- 放置头部 -->
			<slot name="head"></slot>
		</div>
		<div class="logger-frame-body" @scroll="onScroll">
			<!-- 放置内容 -->
			<slot name="body"></slot>
		</div>
	</div>
</template>
<script>
export default {
    methods: {
        onScroll(e) {
            // let scrollTop = e.target && e.target.scrollTop;
            // console.log(scrollTop);
            // if(scrollTop > 52) {
            //     document.querySelector('.ivu-table-header').style.position = 'fixed';
            //     document.querySelector('.ivu-table-header').style.top = '80px';
            // } else {
            //     document.querySelector('.ivu-table-header').style.position = 'initial';
            // }
        }
    }
}
</script>

<style lang="less" scoped>
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
	        border-bottom: 1px solid rgb(238, 238, 238);
	        padding: 0 20px;
	        .logger-subread {
	            color: #262626;
	            font-size: 16px;
	        }
	    }
	    .logger-frame-body {
	        width: 100%;
	        height: 100%;
	        padding: 20px 20px 0;
	        overflow: auto;
	        &>div {
	            padding-bottom: 80px;
	        }
	    }
	}
</style>