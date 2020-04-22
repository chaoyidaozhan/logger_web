<template>
<div class="statisticsOfDeptMemberTimePicker">
	<div class="qzidNameAndCount">{{originData.spaceName && (originData.spaceName + '  ' + originData.memberCount + $t('summary.people') + originData.diaryCount + $t('summary.Total'))}}</div>
	<div class="picker">
		<div class="btn lt yy-icon-Vjiantou-zuo" :class="{disabled:this.ltDisabled}" @click="delDate"></div>
        <div class="date-range">{{beginDate}} - {{endDate}}</div>
		<div class="btn rt yy-icon-Vjiantou-you" :class="{disabled:this.rtDisabled}" @click="addDate"></div>
	</div>
</div>
</template>
<script>
import formatTime from 'app_src/filters/format-time'
export default {
    props: {
        minDate: {
            type: String
        },
        maxDate: {
            type: String
        },
        originData: {
			type: Object,
			default: function() {
				return {};
			}
		}
    },
	data() {
		return {
			ltDisabled: false,
            rtDisabled: false,
            beginDate: '',
            endDate: '',
		}
	},
	watch: {
		beginDate() {
            let beginDate = new Date(this.beginDate).valueOf()
            let minDate = new Date(this.minDate).valueOf()
            if(beginDate <= minDate) {
                this.ltDisabled = true
            } else {
                this.ltDisabled = false
            }
        },
		endDate() {
            let endDate = new Date(this.endDate).valueOf()
            let maxDate = new Date(this.maxDate).valueOf()
            if(endDate >= maxDate) {
                this.rtDisabled = true
            } else {
                this.rtDisabled = false
            }
        },
        minDate: 'setDate',
        maxDate: 'setDate'
    },
	methods: {
        isLeapYear(fullyear) { // 判断是否是闰年
            let year = fullyear || (new Date()).getFullYear()
            if (year % 4 == 0 && year % 100 != 0) {
                this.point[1] = 29
            } else if (year % 400 == 0) {
                this.point[1] = 29
            } 
        },
        setDate() { // 设置日期
            let maxDate = new Date(this.maxDate).valueOf()
            let minDate = new Date(this.minDate).valueOf()

            this.beginDate = this.minDate // 开始时间
            if((maxDate- minDate)/86400000 > 31) { // 如果范围大于31天可切换
                let date = new Date(this.beginDate).valueOf()
                date += 86400000 * 30
                this.endDate =  formatTime(new Date(date), 'YYYY-MM-DD')
            } else { // 如果范围小于于31天不可切换
                this.endDate = this.maxDate
            }
            this.handleChangeDate()
        },
        delDate() { // 减少时间
			if(!this.ltDisabled) {
                let beginDate = (new Date(this.beginDate)).valueOf() - 86400000 * 30
                this.beginDate = formatTime(new Date(beginDate), 'YYYY-MM-DD')

                let endDate = beginDate + 86400000 * 30
                this.endDate = formatTime(new Date(endDate), 'YYYY-MM-DD')
				this.handleChangeDate()
			}
		},
		addDate() {  // 增加时间
			if(!this.rtDisabled) {
                let beginDate = (new Date(this.beginDate)).valueOf() + 86400000 * 30
                this.beginDate = formatTime(new Date(beginDate), 'YYYY-MM-DD')

                let endDate = beginDate + 86400000 * 30
                let maxDate = (new Date(this.maxDate)).valueOf()
                this.endDate = formatTime(new Date(endDate), 'YYYY-MM-DD')
                if(endDate > maxDate) {
                    this.endDate = this.maxDate
                }
				this.handleChangeDate()
			}
		},
		handleChangeDate() { // 切换周回调
			this.$emit('handleChangeDate', {
                beginDate: this.beginDate,
                endDate: this.endDate
            })
        }
	},
    created () {
        this.setDate()
    }
}
</script>
<style lang="less" scoped>
.picker {
    width: 220px;
    line-height: 27px;
    height: auto;
}
.date-range {
    font-size: 12px;
}
</style>
