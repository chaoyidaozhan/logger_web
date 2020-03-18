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
                <span class="must"></span>
                选择周期
              </div>
              <div class="subctn">
                <YYSelect 
                  v-model="dateType" 
                  @on-change="handleDateTypeChange">
                  <YYOption value="1">
                    周
                  </YYOption>
                  <YYOption value="2">
                    月
                  </YYOption>
                  <YYOption value="3">
                    日
                  </YYOption>
                  <YYOption value="4">
                    双周
                  </YYOption>
              </YYSelect>
              </div>
            </div>
            <!-- 从当前周开始 -->
            <div class="item subItem">
              <div class="itemTitle">
              </div>
              <div class="subctn">
                <div>
                  <YYCheckbox label="1">
                    <span>从当前周开始</span>
                  </YYCheckbox>
                </div>
              </div>
            </div>
            <!-- 指定日期 -->
            <div class="item">
              <div class="itemTitle">
                <span class="must"></span>
                指定日期
              </div>
              <div class="subctn">
                <YYSelect 
                  v-model="dateType"
                  :multiple="true"
                  @on-change="handleDateTypeChange">
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
                <span class="must"></span>
                提交开始时间
              </div>
              <div class="subctn">
                  <WeekTime></WeekTime>
              </div>
            </div>
            <div class="item">
              <div class="itemTitle">
                <span class="must"></span>
                提交结束时间
              </div>
              <div class="subctn">
                <WeekTime></WeekTime>
              </div>
            </div>
            <div class="item tipsCtn">
             <img class="tipsimg" :src="ImTips">
             <span class="desc"> 请在xxx时间填写汇报 </span>
            </div> 
            <div class="item">
              <div class="itemTitle">
                <span class="must"></span>
                提醒时间
              </div>
              <div class="subctn">
                <YYSelect 
                  v-model="dateType" 
                  @on-change="handleDateTypeChange">
                  <YYOption value="1">
                    截止前1小时
                  </YYOption>
                  <YYOption value="15">
                    截止前15小时
                  </YYOption>
              </YYSelect>
              </div>
            </div>
          </div>
      </div>
    </div>
  </transition>
</template>
<script>
import WeekTime from './common/weekTime'
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
          listArr: [1,2,3,4,5,6,7,8,9,10],
          selectMemberData: [],
          memberApiUri: '',
          hasDefaultTemplate: true,
          templateType: 'app',
          dateType: '1',
          ImTips
          // listArr: [],
        }
    },
    methods: {
      close () {
        this.$emit('changeShow')
      },
      handleSelectRange(res) { //汇报人
          let arr = res.member
          this.selectMemberData = arr
      },
      handleQuery () {

      },
      handleDateTypeChange () {

      }
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

