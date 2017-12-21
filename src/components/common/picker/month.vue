<template>
	<div class="picker">
		<div class="btn lt" :class="{disabled:this.ltDisabled}" @click="delMonth"></div>
		<div>{{nowYear}}年{{(nowMonth < 10) ? `0${nowMonth}` : nowMonth}}月</div>
		<div class="btn rt" :class="{disabled:this.rtDisabled}" @click="addMonth"></div>
	</div>
</template>
<script type="text/javascript">
export default {
	data() {
		return {
			nowYear: '',
			nowMonth: '',
			maxYear: '',
			minYear: 2000,
			maxMonth: '',
			minMonth: 1,
			ltDisabled: false,
			rtDisabled: false
		}
	},
	watch: {
		nowMonth() {
            if (this.nowYear === this.maxYear && this.nowMonth == this.maxMonth) {
				this.rtDisabled = true;
			} else  {
				this.rtDisabled = false;
            }
            if (this.nowYear === this.minYear && this.nowMonth == this.minMonth) {
				this.ltDisabled = true;
			} else  {
				this.ltDisabled = false;
			}
        },
	},
	methods: {
        setNowDate() { // 初始化调用
			this.nowYear = (new Date()).getFullYear();
            this.maxYear = (new Date()).getFullYear();
			this.nowMonth = (new Date()).getMonth() + 1;
			this.maxMonth = (new Date()).getMonth() + 1;
        },
        delMonth() { // 减少年份
			if(!this.ltDisabled) {
                this.nowMonth--;
                this.nowMonth == 0 && (this.nowMonth = 12, this.nowYear--)
				this.handleChangeYear();
			}
		},
		addMonth() {  // 增加年份
			if(!this.rtDisabled) {
                this.nowMonth++;
                this.nowMonth == 13 && (this.nowMonth = 1, this.nowYear++)
				this.handleChangeYear();
			}
		},
		handleChangeYear() { // 切换年份回调
			this.$emit('handleChangeYear', this.nowYear);
		}
	},
    created () {
        this.setNowDate();
    }
}
</script>
<style lang="less" scoped>
@import '../../../assets/css/var.less';
.picker {
	width: 180px;
	height: 38px;
	padding: 0 30px;
	line-height: 38px;
	color: @primary-color;
	position: relative;
	text-align: center;
	font-size: 18px;
	margin: 0 auto 10px;
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