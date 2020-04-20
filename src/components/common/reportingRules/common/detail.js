export default {
    getParticipant(diarySubmitPeople) {
        if(!diarySubmitPeople) {
          return;
        }
        if (diarySubmitPeople.length) {
            let participantArr = [];
            diarySubmitPeople.forEach((item, index) => {
                if (index < 3)  {
                    participantArr.push(item.userName);
                }
            });
            if(this.lang == 'en') {
                return `${participantArr.join('、')}${diarySubmitPeople.length> 3 ?
                this.$t('summary.AsATotal'):this.$t('summary.Total')} ${diarySubmitPeople.length} ${this.$t('summary.people')}`;
            } else {
                return `${participantArr.join('、')}${diarySubmitPeople.length> 3 ?
                this.$t('summary.AsATotal'):this.$t('summary.Total')}${diarySubmitPeople.length}${this.$t('summary.people')}`;
            }
        } else {
            return this.$t('summary.TheSubmitterIsNotSet');
        }
    },
    getTime(submitPeriodic) {
        let timeText = "";
        if(submitPeriodic == 0) {
            let weekMap = {
                1:this.$t('date.mon'),
                2:this.$t('date.tue'),
                3:this.$t('date.wed'),
                4:this.$t('date.thu'),
                5:this.$t('date.fri'),
                6:this.$t('date.sat'),
                7:this.$t('date.sun'),
            };
            let dayText = this.$t('date.everyDay');
            let weekArr = [];
            let dayTextArr = [];
            if(this.data.submitStartWeek) {
                weekArr = this.data.submitStartWeek.split(",");
            }
            weekArr.forEach((item)=> {
                if(weekMap[item]) {
                    dayTextArr.push(weekMap[item]);
                }
            });
            dayText = (weekArr.length >=7 ? this.$t('date.everyDay'):dayTextArr.join('、'));
            timeText = `${dayText}${this.data.submitStartTime && this.data.submitStartTime.substring(0,5)}-${this.data.submitStartTime>this.data.submitEndTime?this.$t('date.morrow'):''}${this.data.submitEndTime && this.data.submitEndTime.substring(0,5)}`;
        } else if(submitPeriodic == 1) {
            let weekMap = {
                1:this.$t('date.mon'),
                2:this.$t('date.tue'),
                3:this.$t('date.wed'),
                4:this.$t('date.thu'),
                5:this.$t('date.fri'),
                6:this.$t('date.sat'),
                7:this.$t('date.sun'),
            };
            timeText = `${this.data.submitStartWeek && weekMap[this.data.submitStartWeek] || ""}${this.data.submitStartTime && this.data.submitStartTime.substring(0,5)}-${this.data.submitStartWeek>this.data.submitEndWeek?`${this.$t('date.next')} `:''}${this.data.submitEndWeek && weekMap[+this.data.submitEndWeek] || ""}${this.data.submitEndTime && this.data.submitEndTime.substring(0,5)}`;
        } else if(submitPeriodic == 2) {
            timeText = `${this.$t('date.lastDayOfTheMonth')}${this.data.submitStartTime && this.data.submitStartTime.substring(0,5)}-${this.data.submitEndTime && this.data.submitEndTime.substring(0,5)}`;
        }
        return timeText;
    }
};