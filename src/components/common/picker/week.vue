<template>
	<div class="picker">
		<div class="btn lt" :class="{disabled:this.ltDisabled}" @click="delWeek"></div>
		<div>{{nowYear}}年{{(nowWeek < 10) ? `0${nowWeek}` : nowWeek}}周</div>
        <div class="date-range">{{beginDate}} 至 {{endDate}}</div>
		<div class="btn rt" :class="{disabled:this.rtDisabled}" @click="addWeek"></div>
	</div>
</template>
<script type="text/javascript">
import formatTime from 'app_src/filters/format-time';
export default {
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
            return this.getDate(this.nowYear, this.nowWeek + 1, 7);
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
        getDate(year,weeks,weekDay){   
            var date = new Date(year,"0","1");   
            var time = date.getTime();   
            time+=(weeks-1)*7*24*3600000;   
            date.setTime(time);   
            return formatTime(date, "YYYY-MM-DD")
        },
        setNowDate() { // 初始化调用
            this.nowYear = (new Date()).getFullYear();
            this.nowWeek = this.getNowWeek();

            this.maxYear = (new Date()).getFullYear();
        },
        delWeek() { // 减少周
			if(!this.ltDisabled) {
                this.nowWeek--;
                this.nowWeek == 0 && (this.nowWeek = 52, this.nowYear--)
				this.handleChangeDate();
			}
		},
		addWeek() {  // 增加周
			if(!this.rtDisabled) {
                this.nowWeek++;
                this.nowWeek == 53 && (this.nowWeek = 1, this.nowYear++)
				this.handleChangeDate();
			}
		},
		handleChangeDate() { // 切换周回调
			this.$emit('handleChangeDate', {
                beiginDate: this.beginDate,
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
.picker {
    width: 220px;
    line-height: 27px;
    height: auto;
}
.date-range {
    font-size: 12px;
}
</style>
