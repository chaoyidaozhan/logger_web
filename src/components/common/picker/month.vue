<template>
<div class="statisticsOfDeptMemberTimePicker">
	<div class="qzidNameAndCount">{{originData.spaceName && (originData.spaceName + '  ' + originData.memberCount + $t('summary.people') + originData.diaryCount + $t('summary.Total'))}}</div>
	<div class="picker">
		<div class="btn lt yy-icon-Vjiantou-zuo" :class="{disabled:this.ltDisabled}" @click="delMonth"></div>
		<div>{{nowYear}}/{{(10 - nowMonth > 0) ? `0${nowMonth}` : nowMonth}}</div>
		<div class="btn rt yy-icon-Vjiantou-you" :class="{disabled:this.rtDisabled}" @click="addMonth"></div>
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
	props: {
		originData: {
			type: Object,
			default: function() {
				return {};
			}
		}
	},
	watch: {
		nowMonth() {
            if (this.nowYear === this.maxYear && this.nowMonth == this.maxMonth) {
				this.rtDisabled = true
			} else  {
				this.rtDisabled = false
            }
            if (this.nowYear === this.minYear && this.nowMonth == this.minMonth) {
				this.ltDisabled = true
			} else  {
				this.ltDisabled = false
			}
        },
	},
	methods: {
        setNowDate() { // 初始化调用
			this.nowYear = (new Date()).getFullYear()
            this.maxYear = (new Date()).getFullYear()
			this.nowMonth = (new Date()).getMonth() + 1
			this.maxMonth = (new Date()).getMonth() + 1
        },
        delMonth() { // 减少年份
			if(!this.ltDisabled) {
                this.nowMonth--
                this.nowMonth == 0 && (this.nowMonth = 12, this.nowYear--)
				this.handleChangeDate()
			}
		},
		addMonth() {  // 增加年份
			if(!this.rtDisabled) {
                this.nowMonth++
                this.nowMonth == 13 && (this.nowMonth = 1, this.nowYear++)
				this.handleChangeDate()
			}
		},
		handleChangeDate() { // 切换月份
			this.$emit('handleChangeDate', {
				month: this.nowMonth, 
				year: this.nowYear, 
				beginDate: `${this.nowYear}-${this.nowMonth}-1`
			})
		}
	},
    created () {
		this.setNowDate()
		this.handleChangeDate()
    }
}
</script>
