<template>
  <transition name="moveR">
    <div>
      <div class="bgCover" @click="close()"></div>
      <div class="container">
        <div class="header mb-flex mb-flex-pack-justify mb-flex-align-center">
          <div class="title">{{$t('operate.setReportRules')}}</div>
          <div class="yy-icon-guanbi" @click="close()"></div>
        </div>
        <div class="body">
          <!-- 选择模板 -->
          <div class="item mb-flex mb-flex-pack-justify mb-flex-align-center">
            <div class="itemTitle">
              <span class="must"></span>
              {{$t('operate.selectTemplate')}}
            </div>
            <div class="subctn">
              <fs-select-template
                :hasDefaultTemplate="true" 
                templateType="web" 
                @handleChange="handleQuery"
                ref="selectTemplate"/>
            </div>
          </div>
          <!-- 选人 -->
          <div class="item mb-flex mb-flex-pack-justify mb-flex-align-center">
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
          <div class="item mb-flex mb-flex-pack-justify mb-flex-align-center paddingTopInterval">
            <div class="itemTitle">
              {{$t('operate.selectionCycle')}}
            </div>
            <div class="subctn">
              <YYSelect
                :invertable="false"
                :transfer="false"
                v-model="formData.submitPeriodic"
                @on-change="handleSubmitPeriodic(+formData.submitPeriodic)">
                <YYOption :value="0">
                  {{$t('date.d')}}
                </YYOption>
                <YYOption :value="1">
                  {{$t('date.w')}}
                </YYOption>
                <YYOption :value="2">
                  {{$t('date.m')}}
                </YYOption>
                <YYOption :value="3">
                  双周提醒
                </YYOption>
            </YYSelect>
            </div>
          </div>
          <!-- 周期选择日  指定日期-->
          <div class="item mb-flex mb-flex-pack-justify mb-flex-align-center" v-if="formData.submitPeriodic == 0">
            <div class="itemTitle">
              {{$t('date.appointedDate')}}
            </div>
            <div class="subctn">
              <YYSelect
                v-model="formData.submitStartWeek"
                :invertable="false"
                :transfer="false"
                :multiple="true">
                <YYOption :value="item.key + ''" :key="index" v-for="(item, index) in submitDate">
                  {{item.value}}
                </YYOption>
              </YYSelect>
            </div>
          </div>
          <!-- 从当前周开始 -->
          <div class="item subItem mb-flex mb-flex-pack-justify mb-flex-align-center" v-if="formData.doubleWeekRemind">
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
          <div class="item mb-flex mb-flex-pack-justify mb-flex-align-center">
            <div class="itemTitle">
              {{$t('date.submissionStartTime')}}
            </div>
            <div class="subctn">
                <WeekTime
                  ref="remindStartTime"
                  @setTimePicker="setStartTimePicker"
                  :firstColData="startPickerFirstColData"
                  :secondColData="startPickersecondColData"
                  :columns="columnsNum"
                  :firstColDefault="startPickerDefault"
                  :secondColDefault="startPickerSecondColDefault"
                  :showValue="startPickerDefault.name">
                </WeekTime>
            </div>
          </div>
          <!-- 提交结束时间 -->
          <div class="item mb-flex mb-flex-pack-justify mb-flex-align-center">
            <div class="itemTitle">
              {{$t('date.submissionEndTime')}}
            </div>
            <div class="subctn">
              <WeekTime
                  ref="remindEndTime"
                  @setTimePicker="setEndTimePicker"
                  :firstColData="endPickerFirstColData"
                  :secondColData="endPickersecondColData"
                  :columns="columnsNum"
                  :firstColDefault="endPickerDefault"
                  :secondColDefault="endPickerSecondColDefault"
                  :showValue="endPickerDefault.name">
              </WeekTime>
            </div>
          </div>
          <!-- tips -->
          <div class="tipsCtn">
            <img class="tipsimg" :src="ImTips">
            <span class="desc" v-if="formData.submitPeriodic == 2">
              本月最后一天{{$t('date.pleaseFillReportAtSomeTime').replace('<-placeholder->', endPickerDefault.name)}}
            </span>
            <span class="desc" v-else>
              {{$t('date.pleaseFillReportAtSomeTime').replace('<-placeholder->', endPickerDefault.name)}}
            </span>
          </div> 
          <!-- 提醒时间 -->
          <div class="remindTimeArea item mb-flex mb-flex-pack-justify mb-flex-align-center">
            <div class="itemTitle">
              {{$t('date.reminderTime')}}
            </div>
            <div class="subctn">
              <YYSelect 
                :multiple="false"
                :invertable="false"
                :transfer="false"
                v-model="formData.remindTime">
                <YYOption :value="item" v-for="(item, index) in remindTimeArr" :key="index">
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
                @click="handleSubmitRule"
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
      }
    },
    components: {
      FsSelectTemplate,
      FsSelectTreeInput,
      WeekTime
    },
    data() {
        return {
          ImTips,
          columnsNum: 1,
          // 
          formData: {
            templateId: '',
            diarySubmitPeopleStr: [],
            submitPeriodic: 0,
            submitDate: '0',
            submitStartWeek: ['1', '2', '3', '4', '5', '6', '7'],
            submitEndWeek: [],
            submitStartTime: [],
            submitEndTime: [],
            remindType: 0,
            remindTime: 0,
            doubleWeekRemind: false,
            remindThisWeek: false,
        },
        submitDate: [
            { key: '1', value: this.$t('date.mon') },
            { key: '2', value: this.$t('date.tue') },
            { key: '3', value: this.$t('date.wed') },
            { key: '4', value: this.$t('date.thu') },
            { key: '5', value: this.$t('date.fri') },
            { key: '6', value: this.$t('date.sat') },
            { key: '7', value: this.$t('date.sun') }
        ],
        week: [
          this.$t('date.mon'), 
          this.$t('date.tue'), 
          this.$t('date.wed'), 
          this.$t('date.thu'), 
          this.$t('date.fri'), 
          this.$t('date.sat'), 
          this.$t('date.sun')
        ],
        startPickerFirstColData: [],
        endPickerFirstColData: [],
        startPickersecondColData: [],
        endPickersecondColData: [],
        startPickerDefault: {},
        endPickerDefault: {},
        startPickerSecondColDefault: {},
	      endPickerSecondColDefault: {},
        remindTimeArr: []
      }
    },
    methods: {
      close () {
        this.$emit('changeShow')
      },
      // 选人控件
      handleSelectRange(res) {
        let arr = res.member
        this.formData.diarySubmitPeopleStr = arr;
      },
      handleQuery(id) {
        this.formData.templateId = id;
      },
      getRule() {
        let detailMsg = this.detailMsg;
        let currentItemDetailMsg = Object.assign({}, detailMsg.currentItemDetailMsg);
        let formData = {};
        let detailMsgKeys = Object.keys(detailMsg);
        let timeDealWith = function(clock) {
          let arr = clock.split(':');
          return {
            all: (arr[0] + ':' + arr[1]),
            num: arr[0]
          };
        };
        let submitPeriodic = currentItemDetailMsg.submitPeriodic;
        if(detailMsgKeys.length) {
          formData = {
            templateId: currentItemDetailMsg.id + '',
            diarySubmitPeopleStr: currentItemDetailMsg.diarySubmitPeople,
            submitPeriodic: submitPeriodic,
            submitDate: currentItemDetailMsg.submitDate
          };
          let submitStartTimeDealWith = {};
          let submitEndTimeDealWith = {};
          let submitStartWeek = [];
          submitStartTimeDealWith = timeDealWith(currentItemDetailMsg.submitStartTime);
          submitEndTimeDealWith = timeDealWith(currentItemDetailMsg.submitEndTime);
          formData.submitStartTime = submitStartTimeDealWith.all;
          formData.submitEndTime = submitEndTimeDealWith.all;
          if(submitPeriodic == 0 || submitPeriodic == 2) {
              this.startPickerDefault = {
                name: submitStartTimeDealWith.all,
                value: submitStartTimeDealWith.num
              };
              this.endPickerDefault = {
                name: submitEndTimeDealWith.all,
                value: submitEndTimeDealWith.num
              };
              this.columnsNum = 1;
          }
          switch (submitPeriodic) {
            case 0:
              formData.submitStartWeek = currentItemDetailMsg.submitStartWeek.split(',')
            break;
            case 1:
              this.startPickerDefault = {
                name: this.week[+currentItemDetailMsg.submitStartWeek] + ' ' + submitStartTimeDealWith.all,
                value: currentItemDetailMsg.submitStartWeek
              };
              this.startPickerSecondColDefault = {
                name: submitStartTimeDealWith.all,
                value: submitStartTimeDealWith.num
              };
              this.endPickerDefault = {
                name: this.week[+currentItemDetailMsg.submitEndWeek] + ' ' + submitEndTimeDealWith.all,
                value: currentItemDetailMsg.submitEndWeek
              };
              this.endPickerSecondColDefault = {
                name: submitEndTimeDealWith.all,
                value: submitEndTimeDealWith.num
              };
              formData.doubleWeekRemind = !!currentItemDetailMsg.doubleWeekRemind;
              formData.remindThisWeek = !!currentItemDetailMsg.remindThisWeek;
              formData.doubleWeekRemind && (formData.submitPeriodic = 3);
            break;
            case 2:
              
            break;
          }
          formData.remindTime = currentItemDetailMsg.remindTime;
          if(!formData.remindTime) {
            formData.remindType = 0;
          }
          if(submitPeriodic == 0 || submitPeriodic == 2) {
            this.columnsNum = 1;
            this.handleSubmitStartTime(submitPeriodic);
            this.handleSubmitEndTime(submitPeriodic);
          }else if(currentItemDetailMsg.submitPeriodic == 1) {
            this.columnsNum = 2;
            this.handleSubmitStartTime(1);
            this.handleSubmitEndTime(1);
          }
          this.formData = {
            ...this.formData,
            ...formData
          };
        }else {
          this.handleSubmitPeriodic(0);
        }
      },
      handleSubmitRule() {
        let param = this.cloneObj(this.formData);
        param.submitPeriodic = +param.submitPeriodic;
        if (!param.templateId) {
            this.$YYMessage.warning(this.$t('summary.Select')+this.$t('summary.TheTemplate'));
            return;
        }
        if (!param.diarySubmitPeopleStr.length) {
            this.$YYMessage.warning(this.$t('summary.Select')+this.$t('summary.TheAuthor'));
            return;
        }
        let diarySubmitPeopleStr = [];
        param.diarySubmitPeopleStr.forEach((item, index) => {
          diarySubmitPeopleStr.push(item.memberId);
        });
        param.diarySubmitPeopleStr = diarySubmitPeopleStr.join(',');
        if (param.submitPeriodic == 0) {
          if (!param.submitStartWeek.length) {
            this.$YYMessage.warning(this.$t('summary.Select')+this.$t('summary.SpecifyDate'));
            return;
          }
          param.submitStartWeek = param.submitStartWeek.join(',');
          param.submitEndWeek = param.submitEndWeek.join(',');
          param.submitStartTime = this.startPickerDefault.name + ':00';
          param.submitEndTime = this.endPickerDefault.name.split(' ')[1] + ':00';
          param.submitDate = 0;
          // 
          param.doubleWeekRemind = 0;
          param.remindThisWeek = 0;
        }else if (param.submitPeriodic == 1 || param.submitPeriodic == 3) {
          let startWeekDayMapClockName = this.startPickerDefault.name.split(' ');
          let startWeekDayMapClockValue = this.startPickerDefault.value.split(' ');
          let endWeekDayMapClockName = this.endPickerDefault.name.split(' ');
          let endWeekDayMapClockValue = this.endPickerDefault.value.split(' ');
          param.submitStartWeek = startWeekDayMapClockValue[0];
          param.submitStartTime = startWeekDayMapClockName[1] + ':00';
          param.submitEndWeek = endWeekDayMapClockValue[0];
          param.submitEndTime = endWeekDayMapClockName[1] + ':00';
          // 
          param.doubleWeekRemind = param.doubleWeekRemind ? 1 : 0;
          param.remindThisWeek = param.remindThisWeek ? 1 : 0;
        }else if(param.submitPeriodic == 2) {
          param.submitStartWeek = '';
          param.submitEndWeek = '';
          // 提交日期，0：每天，1：每月最后一天 ;提交周期为日、月时使用   周期为日月的时候传   
          param.submitDate = 1;
          param.submitStartTime = this.startPickerDefault.name + ':00';
          param.submitEndTime = this.endPickerDefault.name + ':00';
          // 
          param.doubleWeekRemind = 0;
          param.remindThisWeek = 0;
        }
        param.remindType = 0;
        if(param.remindTime !== 0) {
          param.remindType = 1;
        }
        let uri = '/diarySubmitRule/add';
        this.$ajax({
            url: uri,
            type: 'post',
            data: param,
            requestBody: true,
            success: (res) => {
              if (res && res.code == 0) {
                this.close();
              }
            }
        });
      },
      setStartTimePicker(firstCol, secondCol) {
        let submitPeriodic = +this.formData.submitPeriodic;
        if(submitPeriodic == 0) {
          this.startPickerDefault = firstCol;
        }else if(submitPeriodic == 1) {
          this.startPickerDefault = {
            name: (firstCol.name + ' ' + secondCol.name),
            value: (firstCol.value + ' ' + secondCol.value)
          };
        }else if(submitPeriodic == 2) {
          this.startPickerDefault = firstCol;
        }
        this.handleSubmitEndTime(submitPeriodic);
      },
      setEndTimePicker(firstCol, secondCol) {
        let submitPeriodic = +this.formData.submitPeriodic;
        let startPickerDefault = this.startPickerDefault;
        if(submitPeriodic == 0) {
          this.endPickerDefault = firstCol;
        }else if(submitPeriodic == 1) {
          let startPickerValue = this.startPickerDefault.value.split(' ');
          if((+startPickerValue[0] == +firstCol.value) && (+startPickerValue[1] >= +secondCol.value)) {
            this.$YYMessage.warning('结束时间必须大于开始时间');
            return;
          }
          this.endPickerDefault = {
            name: (firstCol.name + ' ' + secondCol.name),
            value: (firstCol.value + ' ' + secondCol.value)
          };
        }else if(submitPeriodic == 2) {
          this.endPickerDefault = firstCol;
        }
        this.remindTimeComputed(submitPeriodic);
      },
      getNum(str) { // 获取纯数字
        if (!str) {
            return 0
        }
        let arr = str.match(/[0-9]+/g);
        return +arr[0];
      },
      handleSubmitStartWeek() { // 打开选择开始周
        let startPickerFirstColData = [];
        let i = 0;
        for (; i < 7; i++) {
          startPickerFirstColData.push({
            value: `${i+1}`,
            name: this.week[i]
          })
        }
        this.startPickerFirstColData = startPickerFirstColData;
        let startPickersecondColData = [];
        let j = 0;
        for (; j <= 24; j++) {
          let hour = `${j<10?`0${j}`:j}:00`;
          startPickersecondColData.push({
            name: hour,
            value: j
          })
        }
        this.startPickersecondColData = startPickersecondColData;
      },
      // 打开选择结束周
      handleSubmitEndWeek() {
        let dayAndClock = this.startPickerDefault.value.split(' ');
        dayAndClock[0] = +dayAndClock[0];
        dayAndClock[1] = +dayAndClock[1];
        let i = 1;
        let nextWeekDay = [];
        let commonWeekDay = [];
        for (;i<7;i++) {
          if(i<dayAndClock[0]) {
            nextWeekDay.push({
              value: `${dayAndClock[0]-i}`,
              name: `${this.$t('date.next')} ${this.week[dayAndClock[0]-i-1]}`
            });
          }else {
            commonWeekDay.push({
              value: `${i}`,
              name: this.week[i-1]
            });
          }
        };
        this.endPickerFirstColData = commonWeekDay.concat(nextWeekDay.reverse());
        let endPickersecondColData = [];
        let j = 0;
        for (; j <= 24; j++) {
          let clock = `${j<10?`0${j}`:j}:00`;
          endPickersecondColData.push({
            name: clock,
            value: j
          })
        }
        this.endPickersecondColData = endPickersecondColData;
      },
      // 打开选择开始时间 0~23
      handleSubmitStartTime(submitPeriodic = 0) {
          let i = 0;
          let firstColData = [];
          switch(submitPeriodic) {
              case 0:
                  for (; i <= 23; i++) {
                    let time = `${i<10?`0${i}`:i}:00`;
                    firstColData.push({
                      name: time,
                      value: i
                    });
                  }
                  this.startPickerFirstColData = firstColData;
                  break;
              case 1:
                  this.handleSubmitStartWeek();
                  break;
              case 2:
                  for (; i <= 23; i++) {
                    let time = `${i<10?`0${i}`:i}:00`;
                    firstColData.push({
                      name: time,
                      value: i
                    });
                  }
                  this.startPickerFirstColData = firstColData;
                  break;
              default:
                  break;
          }
      },
      // 打开选择结束时间 1~24
      handleSubmitEndTime(submitPeriodic = 0) {
        let i = 1;
        let tomorrow = [];
        let firstColData = [];
        switch (submitPeriodic) {
          case 0:
              const submitStartTimeValue = +this.startPickerDefault.value;
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
                        value: i
                      });
                  } else {
                      time = ` ${i<10?`0${i}`:i}:00`;
                      commonArr.push({
                        name: time,
                        value: i
                      });
                  }
              }
              firstColData = commonArr.concat(morrowArr);
              this.endPickerFirstColData = firstColData;
              break;
          case 1:
              this.handleSubmitEndWeek();
              break;
          case 2:
              {
                const submitStartTimeValue = +this.startPickerDefault.value;
                for (; i <= 24; i++) {
                  if (i > submitStartTimeValue) {
                    let time = `${i<10?`0${i}`:i}:00`;
                    firstColData.push({
                      name: time,
                      value: i
                    });
                  }
                }
                this.endPickerFirstColData = firstColData;
              }
              break;
          default:
              break;
        }
        this.remindTimeComputed(submitPeriodic);
      },
      remindTimeComputed(submitPeriodic) {
        let remindTimeArr = [];
        if(submitPeriodic == 0) {
          let dayStart = +this.startPickerDefault.value;
          let dayEnd = +this.endPickerDefault.value;
          let interval = (dayStart > dayEnd) ? (dayEnd = (24 - dayStart) + dayEnd) : (dayEnd - dayStart);
          for(let i=1;i<=interval;i++) {
            remindTimeArr.push(i);
          }
        }else if(submitPeriodic == 1) {
          let [weekStart, clockStart] = this.startPickerDefault.value.split(' ');
          let [weekEnd, clockEnd] = this.endPickerDefault.value.split(' ');
          weekStart = +weekStart;
          clockStart = +clockStart;
          weekEnd = +weekEnd;
          clockEnd = +clockEnd;
          if(weekEnd == weekStart) {
            for(let i=1;i<=(clockEnd - clockStart);i++) {
              remindTimeArr.push(i);
            }
          }else {
            for(let i=1;i<=23;i++) {
              remindTimeArr.push(i);
            }
          }
        }else if(submitPeriodic == 2) {
          let mouthStart = +this.startPickerDefault.value;
          let mouthEnd = +this.endPickerDefault.value;
          for(let i=1;i<=(mouthEnd - mouthStart);i++) {
            remindTimeArr.push(i);
          }
        }
        this.remindTimeArr = remindTimeArr;
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
        this.handleSubmitPeriodic(this.formData.submitPeriodic)
      },
      getEditData() {
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
      handleSubmitPeriodic(per) {
        per = +per;
        if(per == 3) {
          this.formData.doubleWeekRemind = true;
        }else {
          this.formData.doubleWeekRemind = false;
          this.formData.remindThisWeek = false;
        }
        this.formData.remindTime = 0;
        // 根据不同的提价周期进行数据初始化
        switch (per) {
            case 0:
              this.columnsNum = 1;
              this.startPickerDefault = {
                name: '18:00',
                value: '18'
              };
              this.handleSubmitStartTime(per);
              this.endPickerDefault = {
                name: `${this.$t('date.morrow')} 09:00`,
                value: '9'
              };
              this.handleSubmitEndTime(per);
            break;
            case 1:
              this.columnsNum = 2;
              this.startPickerDefault = {
                name: '周五 18:00',
                value: '5 18'
              };
              this.handleSubmitStartTime(per);
              this.endPickerDefault = {
                name: `${this.$t('date.next')}${this.$t('date.mon')} 09:00`,
                value: '1 9'
              };
              this.handleSubmitEndTime(per);
            break;
            case 2:
              this.columnsNum = 1;
              this.startPickerDefault = {
                name: '09:00',
                value: '9'
              };
              this.handleSubmitStartTime(per);
              this.endPickerDefault = {
                name: '18:00',
                value: '18'
              };
              this.handleSubmitEndTime(per);
            break;
            case 3:
              this.columnsNum = 2;
              this.startPickerDefault = {
                name: '周五 18:00',
                value: '5 18'
              };
              this.handleSubmitStartTime(1);
              this.endPickerDefault = {
                name: `${this.$t('date.next')}${this.$t('date.mon')} 09:00`,
                value: '1 9'
              };
              this.handleSubmitEndTime(1);
            break;
            default:
            break;
        }
      },
    },
    created() {
      this.getRule();
    },
    mounted () {
    },
    destroyed () {
    }
}
</script>
<style lang='less' scoped>
  .header {
    height: 48px;
    padding: 0 20px;
    .mb-flex-1 {
      padding-right: 23px;
      text-align: right;
    }
    .yy-icon-guanbi {
      font-size: 12px;
      cursor: pointer;
    }
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
    box-shadow: -8px 0px 30px 0px rgba(74,81,93,0.2);
    width: 470px;
    height: 100%;
    z-index: 101;
    right: 0;
    top: 0;
    background: white;
    .body{
      padding: 0 20px;
      .item {
        min-height: 32px;
        margin-bottom: 16px;
        .itemTitle {
          width: 80px;
          height: 32px;
          text-align: right;
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
          margin-left: 10px;
          width: 340px;
        }
        &::after {
          content: '';
          display: inline-block;
          clear: both;
        }
        &.submitCtn {
          margin-top: 30px;
        }
      }
      .item.paddingTopInterval {
        padding-top: 8px;
      }
      .subItem {
        height: 20px;
        line-height: 20px;
        margin-top: -6px;
      }
      .subctn {
        font-size: 0;
      }
      .tipsCtn {
        height: 36px;
        background:rgba(255,171,0,0.07);
        border-radius: 3px;
        padding-left: 36px;
        border-radius: 3px;
        .tipsimg {
          width: 14px;
          height: 16px;
          vertical-align: middle;
        }
        .desc {
          color: #666;
          vertical-align: middle;
        }
      }
      .remindTimeArea {
        padding-top: 20px;
      }
    }
  }
</style>

