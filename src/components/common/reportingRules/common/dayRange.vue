<template>
  <div class="dayRange mb-flex mb-flex-align-center">
    <div class="yy-icon-Vjiantou-zuo" @click="timeToggle('right')" ></div>
    <div class="timer">&nbsp;&nbsp;{{dateText}}&nbsp;&nbsp;</div>
    <div class="yy-icon-Vjiantou-you" @click="timeToggle('left')" :class="{disabled:this.rtDisabled}"></div>
  </div>
</template>
<script>
import formatTime from 'app_src/filters/format-time';

export default {
  data () {
    return {
        timerList: [],
        dateIndex: 0,
        showDots: false,
        dateText: null,
        ltDisabled: false,
        rtDisabled: false
    }
  },
  methods: {
    init() { // 初始化数据
        this.timeToggle();
    },
    formatDate(n) { // 格式化日期
        let dateText = '';
        let tempDate = new Date(new Date().getTime()+n*24*60*60*1000);
        if(this.lang == 'en') {
            dateText = `${tempDate.getMonth()+1}/${tempDate.getDate()}`
        } else {
            dateText = (tempDate.getMonth()+1) + this.$t('date.m') + tempDate.getDate()+this.$t('date.d');
        }
        return {
            text: dateText,
            date: tempDate
        };
    },
    timeToggle(param) { // 左右切换时间
        this.dateIndex = (this.dateIndex?this.dateIndex:0);
        if (param==='left' && !this.rtDisabled) {
            this.dateIndex += 1;
        } 
        if (param==='right' && !this.ltDisabled) {
            this.dateIndex -= 1;
        }
        this.dateText = this.formatDate(this.dateIndex).text;
        this.$emit('handleChangeDate', {
            beginDate: formatTime(new Date(this.formatDate(this.dateIndex).date), 'YYYY-MM-DD')
        });
        if (this.dateIndex >= 0) {
            this.rtDisabled = true;
        } else {
            this.rtDisabled = false;
        }
        if (this.dateIndex <= -365) {
            this.ltDisabled = true;
        } else {
            this.ltDisabled = false;
        }
    }
    },
    created() {
        this.init();
    },
}
</script>
<style lang='less' scoped>
.dayRange {

}

</style>