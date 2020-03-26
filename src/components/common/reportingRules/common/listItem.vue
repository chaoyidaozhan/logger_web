<template>
 <div class="listItem">
   <div class="header">
      <span class="title">{{data.templateName}}</span>
      <span class="buttonGroup">
        <i class="edit icon-edit"></i>
        <i class="delete icon-delete"></i>
      </span>
   </div>
   <div class="subHeader">
     <div class="desc">{{getParticipant()}}</div>
     <div class="desc">{{getTime()}}</div>
   </div>
   <div class="footer">
     <span class="lookDetail" @click="getDetail()">{{$t('operate.viewDetails')}} <i class="icon-arrow-right"></i></span>
     <span class="photoInfor">
       <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
       <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
       <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
       <span class="submitNum">{{$t('operate.someoneNotSubmit').replace('<-placeholder->', data.unSubmitCount || '')}}</span>
     </span>
   </div>
 </div>
</template>
<script>

export default {
    props: {
      data: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    components: {
    },
    data() {
        return {
        }
    },
    methods: {
        getParticipant() {
          let diarySubmitPeople = this.data.diarySubmitPeople;
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
      getTime() {
          let timeText = "";
          if(this.data.submitPeriodic == 0) {
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
          } else if(this.data.submitPeriodic == 1) {
              let weekMap = {
                  1:this.$t('date.mon'),
                  2:this.$t('date.tue'),
                  3:this.$t('date.wed'),
                  4:this.$t('date.thu'),
                  5:this.$t('date.fri'),
                  6:this.$t('date.sat'),
                  7:this.$t('date.sun'),
              };
              timeText = `${this.data.submitStartWeek && weekMap[this.data.submitStartWeek] || ""}${this.data.submitStartTime && this.data.submitStartTime.substring(0,5)}-${this.data.submitStartWeek>this.data.submitEndWeek?`${this.$t('date.next')} `:''}${this.data.submitEndWeek && weekMap[this.data.submitEndWeek] || ""}${this.data.submitEndTime && this.data.submitEndTime.substring(0,5)}`;                
          } else if(this.data.submitPeriodic == 2) {
              timeText = `${this.$t('date.LastDayOfTheMonth')}${this.data.submitStartTime && this.data.submitStartTime.substring(0,5)}-${this.data.submitEndTime && this.data.submitEndTime.substring(0,5)}`;
          }
          return timeText;
      },
      getDetail () {
        this.$emit('getDetail', this.data)
      }
    },
    mounted () {
    },
    destroyed () {
    }
}
</script>
<style lang='less' scoped>
.listItem {
  width:430px;
  height:128px;
  background:rgba(255,255,255,1);
  box-shadow:0px 5px 15px 0px rgba(51,51,51,0.12);
  border-radius:3px;
  margin: 16px auto;
  padding: 0 20px;
  &:hover{
    .buttonGroup {
      display: inline-block!important;
    }
  }
  .header {
    .title{
      display: inline-block;
      font-size:14px;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:20px;
    }
    .buttonGroup {
      display: none;
      float: right;
      .edit {
        cursor: pointer;
        font-size: 18px;
        margin-right: 10px;
        vertical-align: middle;
      }
      .delete {
        cursor: pointer;
        font-size: 16px;
        vertical-align: middle;
      }
    }
  }
  .subHeader {
    .desc {
        font-size: 12px;
        color: #666666;
        line-height: 20px;
    }
  }
  .footer {
    .lookDetail {
      cursor: pointer;
      color: #3B76DD;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      .icon-arrow-right {
        vertical-align: middle;
        margin-top: -2px;
        display: inline-block;
      }
    }
    .photoInfor {
      height: 20px;
      line-height: 20px;
      float: right;
      .personPhoto {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        vertical-align: middle;
        margin-top: -2px;
        margin-right: -10px;
      }
      .submitNum {
        margin-left: 18px;
        color: #EE2223;
      }
    }
  }
}
</style>

