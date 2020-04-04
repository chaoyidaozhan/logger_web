<template>
<div class="monthRange mb-flex mb-flex-align-center">
    <div class="timer-left" @click="delMonth()" :class="{disabled:this.ltDisabled}">
        <i class="yy-icon-Vjiantou-zuo"></i>
    </div>
    <div class="timer">{{nowYear}}{{lang == "en" ? '/' : '年'}}{{(nowMonth < 10) ? `0${nowMonth}` : nowMonth}}{{lang == "en" ? '' : '月'}}</div>
    <div class="timer-right" @click="addMonth()" :class="{disabled:this.rtDisabled}">
        <i class="yy-icon-Vjiantou-you"></i>
    </div>
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
				this.handleChangeDate();
			}
		},
		addMonth() {  // 增加年份
			if(!this.rtDisabled) {
                this.nowMonth++;
                this.nowMonth == 13 && (this.nowMonth = 1, this.nowYear++)
				this.handleChangeDate();
			}
		},
		handleChangeDate() { // 切换月份
			this.$emit('handleChangeDate', {
				month: this.nowMonth, 
				beginDate: `${this.nowYear}-${this.nowMonth}-01`
			});
		}
	},
    created () {
		this.setNowDate();
		this.handleChangeDate();
    }
}
</script>
<style lang="less" scoped>
.monthRange {
	.timer {
        white-space: nowrap;
	}
   .timer-left,
   .timer-right {
        cursor: pointer;
   }
   .disabled {
		i {
			color: #ccc;
		}
   }
}
</style>

