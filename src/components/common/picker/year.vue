<template>
<div class="statisticsOfDeptMemberTimePicker">
	<div class="qzidNameAndCount">{{originData.spaceName && (originData.spaceName + '  ' + originData.memberCount + $t('summary.people') + originData.diaryCount + $t('summary.Total'))}}</div>
	<div class="picker">
		<div class="btn lt yy-icon-Vjiantou-zuo" :class="{disabled:this.ltDisabled}" @click="delYear"></div>
		<div>{{nowYear}}</div>
		<div class="btn rt yy-icon-Vjiantou-you" :class="{disabled:this.rtDisabled}" @click="addYear"></div>
	</div>
</div>
</template>
<script>
export default {
	props: {
		originData: {
			type: Object,
			default: function() {
				return {};
			}
		}
	},
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
				this.rtDisabled = true
			} else  {
				this.rtDisabled = false
			}
		}
	},
	methods: {
		setNowYear() { // 初始化调用
			this.nowYear = (new Date()).getFullYear()
			this.maxYear = (new Date()).getFullYear()
		},
		delYear() { // 减少年份
			if(!this.ltDisabled) {
				this.nowYear--
				this.handleChangeDate()
			}
		},
		addYear() {  // 增加年份
			if(!this.rtDisabled) {
				this.nowYear++
				this.handleChangeDate()
			}
		},
		handleChangeDate() { // 切换年份回调
			this.$emit('handleChangeDate', {
				year: this.nowYear,
				beginDate: `${this.nowYear}-1-1`
			})
		}
	},
	created () {
		this.setNowYear()
		this.handleChangeDate()
	}
}
</script>
