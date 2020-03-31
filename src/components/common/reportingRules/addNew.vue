<template>
  <transition name="moveR">
    <div>
      <div class="bgCover" @click="close()"></div>
      <div class="container">
          <div class="header">
            <span class="title">{{$t('operate.setReportRules')}}</span>
            <i class="closeIcon icon-add" @click="close()"></i>
          </div>
          <div class="body">
            <!-- 选择模板 -->
            <div class="item">
              <div class="itemTitle">
                <span class="must"></span>
                {{$t('operate.selectTemplate')}}
              </div>
              <div class="subctn">
                <fs-select-template
                :hasDefaultTemplate="hasDefaultTemplate" 
                :templateType="templateType" 
                @handleChange="handleQuery"
                ref="selectTemplate"/>
              </div>
            </div>
            <!-- 选人 -->
            <div class="item">
              <div class="itemTitle">
                <span class="must"></span>
                {{$t('operate.selectSubmitPeople')}}
              </div>
              <div class="subctn">
               <fs-select-tree-input
                  :member="selectMemberData"
                  :title="`${$t('operate.reportPerson')}${$t('operate.select')}`"
                  :placeholder="$t('placeholder.pleaseSelect')"
                  @handleSelect="handleSelectRange"
                  :ellipsis="false" 
                  :showDept="false" 
                  :showGroup="false" 
                  :showMember="true"
                  ref="selectDept"
              />
              </div>
            </div>
            <!-- 选择周期 -->
            <div class="item">
              <div class="itemTitle">
                {{$t('operate.selectionCycle')}}
              </div>
              <div class="subctn">
                <YYSelect
                  v-model="dateType"
                  @on-change="handleDateTypeChange">
                  <YYOption value="0">
                    {{$t('date.d')}}
                  </YYOption>
                  <YYOption value="1">
                    {{$t('date.w')}}
                  </YYOption>
                  <YYOption value="2">
                    {{$t('date.m')}}
                  </YYOption>
              </YYSelect>
              </div>
            </div>
            <!-- 从当前周开始 -->
            <div class="item subItem" v-if="dateType == '1'">
              <div class="itemTitle">
              </div>
              <div class="subctn">
                <div>
                  <YYCheckbox v-model="fromCurrentWeek">
                    <!-- <span>{{$t('date.fromCurrentWeek')}}</span> -->
                    <span>双周提醒</span>
                  </YYCheckbox>
                </div>
              </div>
            </div>
            <!-- 指定日期 周期选择日 -->
            <div class="item" v-if="dateType == '0'">
              <div class="itemTitle">
                {{$t('date.appointedDate')}}
              </div>
              <div class="subctn">
                <YYSelect 
                  v-model="appointedDate"
                  :multiple="true"
                  @on-change="handleAppointedDate">
                  <YYOption value="1">
                    {{$t('date.mon')}}
                  </YYOption>
                  <YYOption value="2">
                    {{$t('date.tue')}}
                  </YYOption>
                  <YYOption value="3">
                    {{$t('date.wed')}}
                  </YYOption>
                  <YYOption value="4">
                    {{$t('date.thu')}}
                  </YYOption>
                  <YYOption value="5">
                    {{$t('date.fri')}}
                  </YYOption>
                  <YYOption value="6">
                    {{$t('date.sat')}}
                  </YYOption>
                  <YYOption value="7">
                    {{$t('date.sun')}}
                  </YYOption>
              </YYSelect>
              </div>
            </div>
            <!-- 提交开始时间 -->
            <div class="item">
              <div class="itemTitle">
                {{$t('date.submissionStartTime')}}
              </div>
              <div class="subctn">
                  <WeekTime ref="remindStartTime" :firstColData="startFirstColData" :columns="startColumns" :day="'1'" :hms="'9:00'"></WeekTime>
              </div>
            </div>
            <!-- 提交结束时间 -->
            <div class="item">
              <div class="itemTitle">
                {{$t('date.submissionEndTime')}}
              </div>
              <div class="subctn">
                <WeekTime ref="remindEndTime" :firstColData="endFirstColData" :columns="endColumns" :hms="'18:00'"></WeekTime>
              </div>
            </div>
            <div class="item tipsCtn">
             <img class="tipsimg" :src="ImTips">
             <span class="desc">{{$t('date.pleaseFillReportAtSomeTime')}}</span>
            </div> 
            <!-- 提醒时间 -->
            <div class="item">
              <div class="itemTitle">
                {{$t('date.reminderTime')}}
              </div>
              <div class="subctn">
                <YYSelect 
                  v-model="lastRemindTime" 
                  @on-change="handleLastRemindTime">
                  <YYOption value="item" v-for="(item, i) in lastRemindTimeArr" :key="i">
                    {{$t('date.hoursBeforeTheDeadline').replace('<-placeholder->', item)}}
                  </YYOption>
              </YYSelect>
              </div>
            </div>
             <div class="item submitCtn">
              <div class="itemTitle">
              </div>
              <div class="subctn">
                <YYButton
                  @click="submit"
                  type="primary">
                  {{$t('operate.submit')}}
                </YYButton>
              </div>
            </div>
          </div>
      </div>
    </div>
  </transition>
</template>
<script>
import WeekTime from './common/dateReference/weekTime'
import FsSelectTemplate from '../select-template/'
import FsSelectTreeInput from '../../common/select-tree-input/'
import ImTips from 'app_assets/images/tips.png'
export default {
    props: {
      detailMsg: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    components: {
      FsSelectTemplate,
      FsSelectTreeInput,
      WeekTime
    },
    data() {
        return {
          fromCurrentWeek: false, //是否从当前周开始
          listArr: [1,2,3,4,5,6,7,8,9,10],
          selectMemberData: [],
          memberApiUri: '',
          hasDefaultTemplate: true,
          templateType: 'app',
          dateType: [],
          lastRemindTime: [],// 最后设置的提醒时间
          ImTips,
          startFirstColData: [
            {key: '1', value: this.$t('date.mon')},
            {key: '2', value: this.$t('date.tue')},
            {key: '3', value: this.$t('date.wed')}
          ],
          endFirstColData: [
            {key: '1', value: this.$t('date.mon')},
            {key: '2', value: this.$t('date.tue')},
            {key: '3', value: this.$t('date.wed')}
          ],
          appointedDate: [], // 指定日期
          startColumns: 3,
          endColumns: 3,
          lastRemindTimeArr: [],
          selectedTemplateId: 0
        }
    },
    methods: {
      close () {
        this.$emit('changeShow')
      },
      submit () {
        let token = this.$store.state.userInfo.token
        let obj = {}
        let templateId = this.$refs.selectTemplate.templateId
        let submitPeriodic = this.dateType == '3' ? '1' : this.dateType
        // let submitStartWeek = 1
        let submitStartTime = this.$refs.remindStartTime.showValue
        let submitEndWeek = this.$refs.remindEndTime.showValue
        let remindType = 1
        let remindTime = this.lastRemindTime
        let personArr = []
        this.selectMemberData.forEach(item => {
          personArr.push(item.memberId)
        })
        let diarySubmitPeopleStr = personArr.join(',')
        // if(dateType == 1) {
        // }
        obj = {
          templateId,
          submitPeriodic,
          submitStartTime,
          submitEndWeek,
          remindType,
          remindTime,
          diarySubmitPeopleStr
        }
      },
      handleSelectRange(res) { //汇报人
          let arr = res.member
          this.selectMemberData = arr
      },
      handleQuery(id) {
        this.selectedTemplateId = id;
      },
      handleDateTypeChange (v) {
        switch (v) {
          case '0': // 日
            this.startColumns = 2
            this.endColumns = 3
            this.endFirstColData = [
              {key: '1', value: this.$t('date.today')},
              {key: '2', value: this.$t('date.morrow')}
            ]
            break;
          case '1': // 周
            this.startColumns = 3
            this.endColumns = 3
            this.startFirstColData = this.getWeekDaysFromSomeDay()
            this.endFirstColData = this.getWeekDaysFromSomeDay()
            break;
          case '2': // 月
            this.startColumns = 2
            this.endColumns = 2
            break;
          case '3': // 当前周
            this.startColumns = 3
            this.endColumns = 3
            this.startFirstColData = this.getWeekDaysFromSomeDay()
            break;
        }
        console.log(this.dateType)
      },
      // 指定日期
      handleAppointedDate () {

      },
      handleLastRemindTime () {

      },
      getWeekDaysFromSomeDay (start = 0) {
        // 从start开始 一周时间 bug
        let r = [
          {key: '1', value: this.$t('date.mon')},
          {key: '2', value: this.$t('date.tue')},
          {key: '3', value: this.$t('date.wed')},
          {key: '4', value: this.$t('date.thu')},
          {key: '5', value: this.$t('date.fri')},
          {key: '6', value: this.$t('date.sat')},
          {key: '7', value: this.$t('date.sun')},
        ]
        return r
      }
    },
    created () {
      let arr = []
      for(let i = 1; i < 24; i++) {
        arr.push(i)
      }
      this.lastRemindTimeArr = arr
    },
    mounted () {
    },
    destroyed () {
    }
}
</script>
<style lang='less' scoped>
  // .moveR-enter-active,  .moveR-leave-active {
  //   transition: all .1s linear;
  //   transform: translateX(0);
  // }
  // .moveR-enter,  .moveR-leave {
  //   transform: translateX(100%);
  // }
  // .moveR-leave-to{
  //   transform: translateX(100%);
  // }
  .bgCover {
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    bottom: 0;
    opacity: 0;
    z-index: 100;
  }
  .container {
    font-size: 12px;
    position: fixed;
    box-shadow: 0 2px 8px rgba(0,0,0,.15);
    width: 470px;
    height: 100%;
    z-index: 101;
    right: 0;
    top: 0;
    background: white;
    .title {
      display: inline-block;
      height: 48px;
      line-height: 48px;
      margin-left: 20px;
    }
    .headerButton {
      float: right;
      margin-right: 56px;
      margin-top: 10px;
    }
    .closeIcon {
      position: absolute;
      right: 22px;
      top: 18px;
      cursor: pointer;
      transform: rotate(45deg);
    }
    .body{
      .item {
        padding: 0 20px;
        .itemTitle {
          width: 80px;
          height: 32px;
          text-align: right;
          float: left;
          .must {
            margin-right: -8px;
            &::before{
              content: '*';
              display: inline-block;
              margin-right: 4px;
              line-height: 1;
              font-family: SimSun;
              font-size: 12px;
              color: #fd838a;
            }
          }
        }
        .subctn {
          float: left;
          margin-left: 10px;
          width: 340px;
        }
        &::after {
          content: '';
          display: inline-block;
          clear: both;
        }
        margin-bottom: 15px;
        &.submitCtn {
          margin-top: 30px;
        }
      }
      .subItem {
        height: 20px;
        line-height: 20px;
        margin-top: -6px;
      }
      .tipsCtn {
        height:36px;
        background:rgba(255,171,0,0.07);
        border-radius:3px;
        padding-left: 36px;
        .tipsimg {
          width: 14px;
          height: 16px;
          vertical-align: middle;
        }
        .desc {
          color: #666666;
          vertical-align: middle;
        }
      }
    }
  }
</style>

