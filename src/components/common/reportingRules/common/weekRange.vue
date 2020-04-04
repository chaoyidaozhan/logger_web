<template>
	<div class="weekRange mb-flex mb-flex-align-center">
        <div class="timer-left" :class="{disabled:this.ltDisabled}" @click="delWeek">
			<i class="yy-icon-Vjiantou-zuo"></i>
		</div>
        <div class="timer">
            {{beginDate}} {{lang == "en" ? '-' : '至'}} {{endDate}}
        </div>
        <div class="timer-right" :class="{disabled:this.rtDisabled}" @click="addWeek">
			<i class="yy-icon-Vjiantou-you"></i>
		</div>
	</div>
</template>
<script type="text/javascript">
import formatTime from 'app_src/filters/format-time';
export default {
    props: {
        doubleWeekRemind: {
            type: Boolean,
            default: false
        },
        remindThisWeek: {
            type: Boolean,
            default: false
        }
    },
	data() {
		return {
			nowYear: '',
			nowWeek: '',
			maxYear: '',
			minYear: 2000,
			maxWeek: 52,
            minWeek: 1,
			ltDisabled: false,
			rtDisabled: false
		}
	},
	watch: {
		nowWeek() {
            if (this.nowYear === this.maxYear && this.nowWeek == this.maxWeek) {
				this.rtDisabled = true;
			} else  {
				this.rtDisabled = false;
            }
            if (this.nowYear === this.minYear && this.nowWeek == this.minWeek) {
				this.ltDisabled = true;
			} else  {
				this.ltDisabled = false;
			}
        },
    },
    computed: {
        beginDate() {
            return this.getDate(this.nowYear, this.nowWeek, 1);
        },  
        endDate() {
            let count = this.doubleWeekRemind ? 2 : 1
            return this.getDate(this.nowYear, this.nowWeek + count, 2);
        },  
    },
	methods: {
        getNowWeek() {
            let y = this.nowYear, m = (new Date()).getMonth(), d = (new Date()).getDate();
            let dateEnd = new Date(y, m, d), 
                dateStart = new Date(y, 0, 1),
                t = Math.round((dateEnd.valueOf() - dateStart.valueOf()) / 86400000),
                w = Math.ceil((t + ((dateStart.getDay() + 1) - 1)) / 7 ); 
            return w;
        },
        getDate(year,weeks,endday){   
            var date = new Date(year,"0","1");   
            var time = date.getTime();   
            let oneWeek = this.doubleWeekRemind ? 1 : 0
            time += (weeks-oneWeek) * 7 * 24 * 3600000 - (3600000 * 24 * endday) - 24 * 3600000;   
            date.setTime(time);   
            return formatTime(date, "YYYY-MM-DD")
        },
        setNowDate() { // 初始化调用
            this.nowYear = (new Date()).getFullYear();
            this.nowWeek = this.getNowWeek();
            this.maxWeek = this.getNowWeek();

            this.maxYear = (new Date()).getFullYear();
        },
        delWeek() { // 减少周
			if(!this.ltDisabled) {
                this.nowWeek = this.nowWeek - (this.doubleWeekRemind ? 2 : 1)
                this.nowWeek == 0 && (this.nowWeek = 52, this.nowYear--)
				this.handleChangeDate();
			}
		},
		addWeek() {  // 增加周
			if(!this.rtDisabled) {
                this.nowWeek = this.nowWeek + (this.doubleWeekRemind ? 2 : 1)
                this.nowWeek == 53 && (this.nowWeek = 1, this.nowYear++)
				this.handleChangeDate();
			}
		},
        handleChangeDate() { // 切换周回调
			this.$emit('handleChangeDate', {
                beginDate: this.beginDate,
                endDate: this.endDate
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
.weekRange {

}
</style>
