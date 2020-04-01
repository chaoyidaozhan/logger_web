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
                  :member="formData.diarySubmitPeopleStr"
                  :title="`${$t('operate.reportPerson')}${$t('operate.select')}`"
                  :placeholder="$t('placeholder.pleaseSelect')"
                  @handleSelect="handleSelectRange"
                  :ellipsis="false" 
                  :showDept="false" 
                  :showGroup="false" 
                  :showMember="true"
                  ref="selectDept"/>
              </div>
            </div>
            <!-- 选择周期 -->
            <div class="item">
              <div class="itemTitle">
                {{$t('operate.selectionCycle')}}
              </div>
              <div class="subctn">
                <YYSelect
                  v-model="formData.submitPeriodic"
                  @on-change="handleSubmitPeriodic(+formData.submitPeriodic, submitPeriodic[+formData.submitPeriodic])">
                  <YYOption value="0">
                    {{$t('date.d')}}
                  </YYOption>
                  <YYOption value="1">
                    {{$t('date.w')}}
                  </YYOption>
                  <YYOption value="2">
                    {{$t('date.m')}}
                  </YYOption>
                  <YYOption value="3">
                    双周提醒
                  </YYOption>
              </YYSelect>
              </div>
            </div>
            <!-- 周期选择日 -->
            <div class="item" v-if="formData.submitPeriodic == 0">
              <div class="itemTitle">
                {{$t('date.appointedDate')}}
              </div>
              <div class="subctn">
                <YYSelect
                  v-model="formData.submitStartWeek"
                  :multiple="true">
                  <YYOption :value="item.key + ''" :key="index" v-for="(item, index) in submitDate">
                    {{item.value}}
                  </YYOption>
                </YYSelect>
              </div>
            </div>
            <!-- 从当前周开始 -->
            <div class="item subItem" v-if="formData.submitPeriodic == 3">
              <div class="itemTitle">
              </div>
              <div class="subctn">
                <div>
                  <YYCheckbox v-model="formData.remindThisWeek">
                    <span>当前周开始</span>
                  </YYCheckbox>
                </div>
              </div>
            </div>
            <!-- 提交开始时间 -->
            <div class="item">
              <div class="itemTitle">
                {{$t('date.submissionStartTime')}}
              </div>
              <div class="subctn">
                  <WeekTime
                    ref="remindStartTime"
                    @setTimePicker="setStartTimePicker"
                    :firstColData="firstStartColData"
                    :secondColData="secondStartColumsData"
                    :columns="columnsNum"
                    :firstColDefault="startPickerDefault"
                    :showValue="startPickerDefault.name">
                  </WeekTime>
              </div>
            </div>
            <!-- 提交结束时间 -->
            <div class="item">
              <div class="itemTitle">
                {{$t('date.submissionEndTime')}}
              </div>
              <div class="subctn">
                <WeekTime
                    ref="remindEndTime"
                    @setTimePicker="setEndTimePicker"
                    :firstColData="firstEndColData"
                    :secondColData="secondEndColumsData"
                    :columns="columnsNum"
                    :firstColDefault="endPickerDefault"
                    :showValue="endPickerDefault.name">
                </WeekTime>
              </div>
            </div>
            <!-- tips -->
            <div class="item tipsCtn">
              <img class="tipsimg" :src="ImTips">
              <span class="desc">{{$t('date.pleaseFillReportAtSomeTime')}}</span>
            </div> 
            <!-- 提醒时间 -->
            <!-- <div class="item">
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
            </div> -->
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
import formatTime from 'app_src/filters/format-time'

export default {
    props: {
      detailMsg: {
        type: Object,
        default: function() {
          return {};
        }
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    components: {
      FsSelectTemplate,
      FsSelectTreeInput,
      WeekTime
    },
    data() {
        return {
          // 是否双周提醒
          fromCurrentWeek: false,
          hasDefaultTemplate: true,
          templateType: 'web',
          ImTips,
          columnsNum: 1,
          // 
          formData: {
            templateId: '',
            diarySubmitPeopleStr: [],
            submitPeriodic: '0',
            submitDate: '0',
            submitStartWeek: [],
            submitEndWeek: [],
            submitStartTime: [],
            submitEndTime: [],
            remindType: true,
            remindTime: [],
            doubleWeekRemind: false,
            remindThisWeek: false,
        },
        // 选择模板
        template: [], 
        showTemplate: false,
        templatePicker: [], 
        templateValue: [],
        // 提交周期
        submitPeriodic: [
            { key: 0, value: this.$t('date.d') },
            { key: undefined, value: this.$t('date.w') },
            { key: 1, value: this.$t('date.m') }
        ],
        // ----------------------------------------------------
        // 指定日期
        showSubmitDate: false,
        // 指定日期为日对应的周期
        submitDate: [
            { key: '1', value: this.$t('date.mon') },
            { key: '2', value: this.$t('date.tue') },
            { key: '3', value: this.$t('date.wed') },
            { key: '4', value: this.$t('date.thu') },
            { key: '5', value: this.$t('date.fri') },
            { key: '6', value: this.$t('date.sat') },
            { key: '7', value: this.$t('date.sun') }
        ],
        submitDateValue: ['1','2','3','4','5','6','7'],
        // ----------------------------------------------------
        // 提交开始时间
        showSubmitStartTime: false,
        submitStartTimePicker: [],
        submitStartTimeValue: [],
        // ----------------------------------------------------
        // 提交开始按周
        showSubmitStartWeek: false,
        submitStartWeekPicker: [],
        submitStartWeekValue: [],
        // ----------------------------------------------------
        // 按日提交开始时间  标记
        dayStartTimeValue: ['18:00'],
        // 按周提交开始时间  标记
        weekStartDateValue: ['5'],
        weekStartTimeValue: ['18:00'],
        // 按月提交开始时间  标记
        monthStartTimeValue: ['09:00'],
        // ----------------------------------------------------
        // 提交结束时间
        showSubmitEndTime: false,
        submitEndTimePicker: [],
        submitEndTimeValue: [],
        // ----------------------------------------------------
        // 提交结束按周
        showSubmitEndWeek: false,
        submitEndWeekPicker: [],
        submitEndWeekValue: [],
        // ----------------------------------------------------
        // 按日提交结束时间  标记
        dayEndTimeValue: [`${this.$t('date.morrow')} 09:00`],
        // 按周提交结束时间  标记
        weekEndDateValue: ['1'],
        weekEndTimeValue: ['09:00'],
        // 按月提交结束时间  标记
        monthEndTimeValue: ['18:00'],
        // ----------------------------------------------------
        // 选择周
        week: [this.$t('date.mon'), this.$t('date.tue'), this.$t('date.wed'), this.$t('date.thu'), this.$t('date.fri'), this.$t('date.sat'), this.$t('date.sun')],
        showRemindTime: false,
        remindTimePicker: [],
        remindTimeValue: ['1'],
        dayRemindTimeValue: ['1'],
        weekRemindTimeValue: ['1'],
        monthRemindTimeValue: ['1'],
        loaded: false,
        hasSave: false,
        // 
        firstStartColData: [],
        firstEndColData: [],
        secondStartColumsData: [],
        secondEndColumsData: [],
        startTimeShowValue: '',
        endTimeShowValue: '',
        startPickerDefault: {},
        endPickerDefault: {}
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
      // 选人控件
      handleSelectRange(res) {
        let arr = res.member
        this.formData.diarySubmitPeopleStr = arr;
      },
      handleQuery(id) {
        this.formData.templateId = id;
      },
      // 


      getRule() { 
        if(this.isEdit) {
          this.getEditData();
        } else {
          this.handleSubmitPeriodic(0, 0);
        }
      },
      setStartTimePicker(firstCol, secondCol) {
        let submitPeriodic = +this.formData.submitPeriodic;
        if(submitPeriodic == 0) {
          this.startPickerDefault = firstCol;
          this.handleSubmitEndTime();
        }else if(submitPeriodic == 1) {
          this.startPickerDefault = {
            name: (firstCol.name + ' ' + secondCol.name),
            value: (firstCol.value + ' ' + secondCol.value)
          };
        }else if(submitPeriodic == 2) {
          this.startPickerDefault = firstCol;
        }
      },
      setEndTimePicker(firstCol, secondCol) {
        let submitPeriodic = +this.formData.submitPeriodic;
        if(submitPeriodic == 0) {
          this.endPickerDefault = firstCol;
        }else if(submitPeriodic == 1) {
          this.endPickerDefault = {
            name: (firstCol.name + ' ' + secondCol.name),
            value: (firstCol.value + ' ' + secondCol.value)
          };
        }else if(submitPeriodic == 2) {
          this.endPickerDefault = firstCol;
        }
      },
      initPickerValue() { // 每次打开选择时间控件初始化当前值
        // 初始化当前周
        this.formData.submitStartWeek.length &&
            (this.submitStartWeekValue = this.cloneObj(this.formData.submitStartWeek));
        this.formData.submitEndWeek.length &&
            (this.submitEndWeekValue = this.cloneObj(this.formData.submitEndWeek));

        // 初始化当前时间
        this.submitStartTimeValue = this.cloneObj(this.formData.submitStartTime);
        this.submitEndTimeValue = this.cloneObj(this.formData.submitEndTime);

        // 初始化截止时间
        this.remindTimeValue = this.cloneObj(this.formData.remindTime);
      },
      getNum(str) { // 获取纯数字
        if (!str) {
            return 0
        }
        let arr = str.match(/[0-9]+/g);
        return +arr[0];
      },
      handleSubmitStartWeek() { // 打开选择开始周
        this.showSubmitStartWeek = true;
        this.submitStartWeekPicker = [];
        this.initPickerValue();
        let i = 0;
        for (; i < 7; i++) {
            this.submitStartWeekPicker.push({
                value: `${i+1}`,
                name: this.week[i]
            })
        }
        this.firstStartColData = this.submitStartWeekPicker;
        let temp = [];
        let j = 0;
        for (; j <= 24; j++) {
          let hour = `${j<10?`0${j}`:j}:00`;
          temp.push({
            name: hour,
            value: j
          })
        }
        this.secondStartColumsData = temp;
      },
      // 打开选择结束周
      handleSubmitEndWeek() {
        this.showSubmitEndWeek = true;
        this.submitEndWeekPicker = [];
        this.initPickerValue();
        let i = 0;
        let nextWeek = [];
        for (; i < 7; i++) {
            if (i < this.submitStartWeekValue[0] - 1) {
                nextWeek.push({
                    value: `${this.submitStartWeekValue[0]-i-1}`,
                    name: `${this.$t('date.next')} ${this.week[this.submitStartWeekValue[0]-i-2]}`
                })
            } else {
                this.submitEndWeekPicker.push({
                    value: `${i+1}`,
                    name: this.week[i]
                })
            }
        }
        this.submitEndWeekPicker = this.submitEndWeekPicker.concat(nextWeek.reverse());
        this.firstEndColData = this.submitEndWeekPicker;
        let temp = [];
        let j = 0;
        for (; j <= 24; j++) {
          let hour = `${j<10?`0${j}`:j}:00`;
          temp.push({
            name: hour,
            value: hour
          })
        }
        this.secondEndColumsData = temp;
      },
      // 打开选择开始时间 0~23
      handleSubmitStartTime() {
          let i = 0;
          this.submitStartTimePicker = [];
          this.initPickerValue();
          const submitEndTimeValue = this.getNum(this.formData.submitEndTime[0]);
          const submitStartTimeValue = this.getNum(this.formData.submitStartTime[0]);
          let firstColData = [];
          switch(+this.formData.submitPeriodic) {
              case 0:
                  for (; i <= 23; i++) {
                      if (i >= submitEndTimeValue || (submitEndTimeValue > submitStartTimeValue)) {
                          let time = `${i<10?`0${i}`:i}:00`;
                          this.submitStartTimePicker.push(time)
                          firstColData.push({
                            name: time,
                            value: time
                          });
                      }
                  }
                  this.firstStartColData = firstColData;
                  this.showSubmitStartTime = true;
                  this.startPickerDefault = {
                    name: '18:00',
                    value: '18'
                  };
                  break;
              case 1:
                  this.handleSubmitStartWeek();
                  break;
              case 2:
                  for (; i <= 23; i++) {
                      if (i >= submitEndTimeValue || (submitEndTimeValue > submitStartTimeValue)) {
                          this.submitStartTimePicker.push(`${i<10?`0${i}`:i}:00`)
                          let time = `${i<10?`0${i}`:i}:00`;
                          firstColData.push({
                            name: time,
                            value: time
                          });
                      }
                  }
                  this.firstStartColData = firstColData;
                  this.showSubmitStartTime = true;
                  break;
              default:
                  break;
          }
      },
      // 打开选择结束时间 1~24
      handleSubmitEndTime() {
        let i = 1;
        this.initPickerValue();
        let tomorrow = [];
        const submitStartTimeValue = this.getNum(this.startPickerDefault.value);
        this.submitEndTimePicker = [];
        let firstColData = [];
        switch (+this.formData.submitPeriodic) {
          case 0:
              let commonArr = [];
              let morrowArr = [];
              for (; i <= 24; i++) {
                  let tomorrowTemp = '';
                  let time = '';
                  if (i <= submitStartTimeValue) {
                      tomorrowTemp = `${this.$t('date.morrow')} ${i<10?`0${i}`:i}:00`;
                      tomorrow.push(tomorrowTemp)
                      morrowArr.push({
                        name: tomorrowTemp,
                        value: `next ${i<10?`0${i}`:i}:00`
                      });
                  } else {
                      time = `${i<10?`0${i}`:i}:00`;
                      this.submitEndTimePicker.push(time)
                      commonArr.push({
                        name: time,
                        value: time
                      });
                  }
              }
              this.submitEndTimePicker = this.submitEndTimePicker.concat(tomorrow);
              this.showSubmitEndTime = true;
              firstColData = commonArr.concat(morrowArr);
              this.firstEndColData = firstColData;
              this.endPickerDefault = {
                name: `${this.$t('date.morrow')} 09:00`,
                value: `next 9`
              };
              break;
          case 1:
              this.handleSubmitEndWeek();
              break;
          case 2:
              for (; i <= 24; i++) {
                  if (i > submitStartTimeValue) {
                    let time = `${i<10?`0${i}`:i}:00`;
                    this.submitEndTimePicker.push(time)
                    firstColData.push({
                      name: time,
                      value: time
                    });
                  }
              }
              this.firstEndColData = firstColData;
              this.showSubmitEndTime = true;
              break;
          default:
              break;
        }
      },
      // 格式化编辑回显
      trimEditData(param) { 
        Object.keys(param).forEach(key => {
            switch (key) {
                case 'templateId':
                    this.formData.templateId = [param[key]];
                    this.templateValue = [param[key]];
                    break;
                case 'diarySubmitPeople':
                    let peopleArr = []
                    param[key].forEach((item => {
                        peopleArr.push({
                            userName: item.userName,
                            memberId: item.memberId
                        })
                    }))
                    this.formData.diarySubmitPeopleStr = peopleArr;
                    break;
                case 'submitPeriodic':
                    this.formData.submitPeriodic = `${param[key]}`;
                    break;
                case 'submitStartWeek':
                    switch (+param.submitPeriodic) {
                        case 0:
                            this.submitDateValue = param[key].split(',');
                            break;
                        case 1:
                            this.weekStartDateValue = param[key].split(',')
                            break;
                        default:
                            break;
                    }
                    break;
                case 'submitEndWeek':
                    switch (+param.submitPeriodic) {
                        case 1:
                            this.weekEndDateValue = param[key].split(',')
                            break;
                        default:
                            break;
                    }
                    break;
                case 'submitStartTime':
                    const sNum = this.getNum(param[key]);
                    const sValue = [`${sNum<10?`0${sNum}`:sNum}:00`]
                    switch (+param.submitPeriodic) {
                        case 0:
                            this.dayStartTimeValue = sValue
                            break;
                        case 1:
                            this.weekStartTimeValue = sValue
                            break;
                        case 2:
                            this.monthStartTimeValue = sValue
                            break;
                        default:
                            break;
                    }
                    break;
                case 'submitEndTime':
                    const eNum = this.getNum(param[key]);
                    const eValue = [`${eNum<10?`0${eNum}`:eNum}:00`]
                    switch (+param.submitPeriodic) {
                        case 0:
                            this.dayEndTimeValue = eValue;
                            break;
                        case 1:
                            this.weekEndTimeValue = eValue;
                            break;
                        case 2:
                            this.monthEndTimeValue = eValue;
                            break;
                        default:
                            break;
                    }
                    break;
                case 'remindType':
                case 'doubleWeekRemind':
                case 'remindThisWeek':
                    this.formData[key] = !!param[key];
                    break;
                case 'remindTime':
                    if (param[key]) {
                        switch (+param.submitPeriodic) {
                            case 0:
                                this.dayRemindTimeValue = param[key].toString().split(',');
                                break;
                            case 1:
                                this.weekRemindTimeValue = param[key].toString().split(',');
                                break;
                            case 2:
                                this.monthRemindTimeValue = param[key].toString().split(',');
                                break;
                            default:
                                break;
                        }
                    }
                default:
                break;
            }
        });
        this.handleSubmitPeriodic(this.formData.submitPeriodic, this.submitPeriodic[this.formData.submitPeriodic].key)
      },
      getEditData() { // 获取编辑内容
        this.$ajax({
            url: `/diarySubmitRule/getRuleDetail`,
            data: {
                diarySubmitRuleId: this.detailMsg.id,
                queryDate: formatTime(new Date(), 'YYYY-MM-DD')
            },
            success: (res) => {
                if (res.code == 0) {
                    this.trimEditData(res.data && res.data.diarySubmitRule);
                }
            }
        })
      },
      // 克隆对象
      cloneObj(obj) {
          return JSON.parse(JSON.stringify(obj))
      },
      // 选择提交周期
      handleSubmitPeriodic(per, date) {
        if(+per == 3) {
          this.formData.doubleWeekRemind = true;
        }
        this.formData.doubleWeekRemind = false;
        this.formData.remindThisWeek = false;
        if (date != undefined) {
            this.$set(this.formData, 'submitDate', date.toString())
        }
        this.$set(this.formData, 'submitPeriodic', per.toString())
        // 根据不同的提价周期进行数据初始化
        switch (+per) {
            case 0:
                this.formData.submitStartWeek = this.cloneObj(this.submitDateValue);
                this.formData.submitEndWeek = [];

                this.submitStartTimeValue = this.dayStartTimeValue;
                this.submitEndTimeValue = this.dayEndTimeValue;

                this.remindTimeValue = this.dayRemindTimeValue;
                this.columnsNum = 1;
                break;
            case 1:
                this.submitStartWeekValue = this.weekStartDateValue;
                this.submitEndWeekValue = this.weekEndDateValue;

                this.formData.submitStartWeek = this.cloneObj(this.weekStartDateValue);
                this.formData.submitEndWeek = this.cloneObj(this.weekEndDateValue);

                this.submitStartTimeValue = this.weekStartTimeValue;
                this.submitEndTimeValue = this.weekEndTimeValue;

                this.remindTimeValue = this.weekRemindTimeValue;
                this.columnsNum = 2;
                break;
            case 2:
                this.formData.submitStartWeek = [];
                this.formData.submitEndWeek = [];

                this.submitStartTimeValue = this.monthStartTimeValue;
                this.submitEndTimeValue = this.monthEndTimeValue;

                this.remindTimeValue = this.monthRemindTimeValue;
                this.columnsNum = 1;
                break;
            default:
            break;
        }
        // 切换时更新当前表单字段
        this.formData.remindTime = this.cloneObj(this.remindTimeValue);
        this.formData.submitStartTime = this.cloneObj(this.submitStartTimeValue);
        this.formData.submitEndTime = this.cloneObj(this.submitEndTimeValue);
        this.handleSubmitStartTime();
        this.handleSubmitEndTime();
      },
    },
    created () {
      this.getRule();
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

