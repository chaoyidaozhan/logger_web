<template>
	<div class="year-picker">
		<div class="btn lt" :class="{disabled:this.ltDisabled}" @click="delYear"></div>
		<div>{{nowYear}}</div>
		<div class="btn rt" :class="{disabled:this.rtDisabled}" @click="addYear"></div>
	</div>
</template>
<script type="text/javascript">
export default {
	data() {
		return {
			nowYear: '',
			maxYear: '',
			minYear: '',
			ltDisabled: false,
			rtDisabled: false
		}
	},
	watch: {
		nowYear() {
			if (this.nowYear === this.maxYear) {
				this.rtDisabled = true;
			} else  {
				this.rtDisabled = false;
			}
		}
	},
	methods: {
		// 初始化调用
		setNowYear() {
			this.nowYear = (new Date()).getFullYear();
			this.maxYear = (new Date()).getFullYear();
			console.log(this.nowYear)
			console.log(this.maxYear)
		},
		delYear() {
			if(!this.ltDisabled) {
				this.nowYear--;
			}
		},
		addYear() {
			if(!this.rtDisabled) {
				this.nowYear++;
			}
		},
	},
	created () {
		this.setNowYear();
	}
}
</script>
<style lang="less" scoped>
@import '../../../assets/css/var.less';
.year-picker {
	width: 180px;
	height: 38px;
	padding: 0 30px;
	line-height: 38px;
	color: @primary-color;
	position: relative;
	text-align: center;
	font-size: 18px;
	margin: 0 auto;
	::selection {
		background-color: transparent;
	}
	.btn {
		width: 30px;
		height: 38px;
		position: absolute;
		top: 0;
		cursor: pointer;
		&::after {
			content: "";
			display: inline-block;
			border: 6px solid @primary-color;
			border-radius: 2.5px;
			border-top-color: transparent;
			border-bottom-color: transparent;
		}
		&.lt {
			left: -2px;
			&::after {
				border-left-color: transparent;
			}
		}
		&.rt {
			right: 0;
			&::after {
				border-right-color: transparent;
			}
		}
		&.disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}
	}
}
</style>