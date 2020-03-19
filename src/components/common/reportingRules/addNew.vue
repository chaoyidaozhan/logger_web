<template>
  <transition name="moveR">
    <div>
      <div class="bgCover" @click="close()"></div>
      <div class="container">
          <div class="header">
            <span class="title">设置汇报规则</span>
            <i class="closeIcon icon-add" @click="close()"></i>
          </div>
          <div class="body">
            <div class="item">
              <div class="itemTitle">
                <span class="must"></span>
                选择模板
              </div>
              <div class="subctn">
                <fs-select-template
                :hasDefaultTemplate="hasDefaultTemplate" 
                :templateType="templateType" 
                @handleChange="handleQuery"
                ref="selectTemplate"/>
              </div>
            </div>
            <div class="item">
              <div class="itemTitle">
                <span class="must"></span>
                选择提交人
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
            <div class="item">
              <div class="itemTitle">
                <!-- <span class="must"></span> -->
                选择周期
              </div>
              <div class="subctn">
                <YYSelect
                  v-model="dateType"
                  @on-change="handleDateTypeChange">
                  <YYOption value="0">
                    日
                  </YYOption>
                  <YYOption value="1">
                    周
                  </YYOption>
                  <YYOption value="2">
                    月
                  </YYOption>
                  <YYOption value="3">
                    双周
                  </YYOption>
              </YYSelect>
              </div>
            </div>
            <!-- 从当前周开始 -->
            <div class="item subItem" v-if="dateType == '3'">
              <div class="itemTitle">
              </div>
              <div class="subctn">
                <div>
                  <YYCheckbox v-model="fromCurrentWeek">
                    <span>从当前周开始</span>
                  </YYCheckbox>
                </div>
              </div>
            </div>
            <!-- 指定日期 只有日才有 -->
            <div class="item" v-if="dateType == '0'">
              <div class="itemTitle">
                <!-- <span class="must"></span> -->
                指定日期
              </div>
              <div class="subctn">
                <YYSelect 
                  v-model="appointedDate"
                  :multiple="true"
                  @on-change="handleAppointedDate">
                  <YYOption value="1">
                    周一
                  </YYOption>
                  <YYOption value="2">
                    周二
                  </YYOption>
                  <YYOption value="3">
                    周三
                  </YYOption>
                  <YYOption value="4">
                    周四
                  </YYOption>
                  <YYOption value="5">
                    周五
                  </YYOption>
                  <YYOption value="6">
                    周六
                  </YYOption>
                  <YYOption value="7">
                    周日
                  </YYOption>
              </YYSelect>
              </div>
            </div>
            <div class="item">
              <div class="itemTitle">
                <!-- <span class="must"></span> -->
                提交开始时间
              </div>
              <div class="subctn">
                  <WeekTime ref="remindStartTime" :firstColData="startFirstColData" :columns="startColumns" :day="'1'" :hms="'11:11'"></WeekTime>
              </div>
            </div>
            <div class="item">
              <div class="itemTitle">
                <!-- <span class="must"></span> -->
                提交结束时间
              </div>
              <div class="subctn">
                <WeekTime ref="remindEndTime" :firstColData="endFirstColData" :columns="endColumns" :hms="'11:11'"></WeekTime>
              </div>
            </div>
            <div class="item tipsCtn">
             <img class="tipsimg" :src="ImTips">
             <span class="desc"> 请在xxx时间填写汇报 </span>
            </div> 
            <div class="item">
              <div class="itemTitle">
                <!-- <span class="must"></span> -->
                提醒时间
              </div>
              <div class="subctn">
                <YYSelect 
                  v-model="lastRemindTime" 
                  @on-change="handleLastRemindTime">
                  <YYOption value="item" v-for="(item, i) in lastRemindTimeArr" :key="i">
                    截止前{{item}}小时
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
                  提交
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
        // showList: { // 是否显示模板
        //     type: Boolean,
        //     default: false
        // }
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
            {key: '1', value: '周一'},
            {key: '2', value: '周二'},
            {key: '3', value: '周三'}
          ],
          endFirstColData: [
            {key: '1', value: '周一'},
            {key: '2', value: '周二'},
            {key: '3', value: '周三'}
          ],
          appointedDate: [], // 指定日期
          startColumns: 2,
          endColumns: 2,
          lastRemindTimeArr: [],
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
        // debugger
        // this.$http.post('/diarySubmitRule/add?token=' + token, obj).then(res => {
        //   console.log(res)
        // })
      },
      handleSelectRange(res) { //汇报人
          let arr = res.member
          this.selectMemberData = arr
      },
      handleQuery () {

      },
      handleDateTypeChange (v) {
        switch (v) {
          case '0': // 日
            this.startColumns = 2
            this.endColumns = 3
            this.endFirstColData = [
              {key: '1', value: '本日'},
              {key: '2', value: '次日'}
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
          {key: '1', value: '周一'},
          {key: '2', value: '周二'},
          {key: '3', value: '周三'},
          {key: '4', value: '周四'},
          {key: '5', value: '周五'},
          {key: '6', value: '周六'},
          {key: '7', value: '周日'},
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
  .moveR-enter-active,  .moveR-leave-active {
    transition: all .1s linear;
    transform: translateX(0);
  }
  .moveR-enter,  .moveR-leave {
    transform: translateX(100%);
  }
  .moveR-leave-to{
    transform: translateX(100%);
  }
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

