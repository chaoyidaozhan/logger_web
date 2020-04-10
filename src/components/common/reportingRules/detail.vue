<template>
  <transition name="moveR">
    <div>
      <div class="bgCover" @click="close()"></div>
      <div class="container">
        <div class="header mb-flex mb-flex-pack-justify mb-flex-align-center">
          <div class="title">{{$t('operate.setReportRules')}}</div>
          <div class="yy-icon-guanbi" @click="close"></div>
        </div>
        <DetailItem @edit="editClick" :detailMsg="detailMsgCopy"></DetailItem>
        <dayRange 
          v-if="detailMsgCopy.currentItemDetailMsg.submitPeriodic == 0" 
          class="dateRangeCommon" 
          @handleChangeDate="handleChangeDate">
        </dayRange>
        <weekRange 
          v-if="detailMsgCopy.currentItemDetailMsg.submitPeriodic == 1" 
          class="dateRangeCommon" 
          @handleChangeDate="handleChangeDate">
        </weekRange>
        <monthRange 
          v-if="detailMsgCopy.currentItemDetailMsg.submitPeriodic == 2" 
          class="dateRangeCommon" 
          @handleChangeDate="handleChangeDate">
        </monthRange>
        <TabPersonList :detailMsg="detailMsgCopy" :dateRange="dateRange"></TabPersonList>
      </div>
    </div>
  </transition>
</template>
<script>
import DetailItem from './common/detailItem'
import dayRange from './common/dayRange'
import weekRange from './common/weekRange'
import monthRange from './common/monthRange'
import TabPersonList from './common/tabPersonList'
import tip_data from 'app_assets/images/tip_data.png'
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
      DetailItem,
      dayRange,
      TabPersonList,
      weekRange,
      monthRange
    },
    data() {
        return {
          tip_data,
          detailMsgCopy: {},
          dateRange: {}
        }
    },
    methods: {
      itemDetailMsg(item, queryDate = '') {
        return new Promise((reslove, reject) => {
                this.$ajax({
                  url: `/diarySubmitRule/getRuleDetail`,
                  data: {
                      diarySubmitRuleId: item.diarySubmitRule.id,
                      queryDate: (queryDate || FormatTime(new Date(), 'YYYY-MM-DD'))
                  },
                  success: (res) => {
                      if (res.code == 0) {
                          reslove(res.data);
                      }
                  }
                })
        });
      },
      handleChangeDate(data) {
        this.dateRange = data
        this.itemDetailMsg(this.detailMsg, data.beginDate).then((responseData) => {
          responseData.currentItemDetailMsg = this.detailMsgCopy.currentItemDetailMsg;
          this.detailMsgCopy = responseData;
        });
      },
      editClick () {
        this.$emit('changeShow', 2, this.detailMsg)
      },
      close () {
        // 1 关闭 2 设置规则  3 查看详情
        this.$emit('changeShow', 'close')
      },
      setRules () {
        // 1 关闭 2 设置规则  3 查看详情
        this.$emit('changeShow', 3)
      }
    },
    created() {
      this.detailMsgCopy = Object.assign({}, this.detailMsg);
    },
    mounted () {
    },
    destroyed () {
    }
}
</script>
<style lang='less' scoped>
  // .moveR-enter-active,  .moveR-leave-active {
  //   transition: all .5s linear;
  //   transform: translateX(0);
  // }
  // .moveR-enter,  .moveR-leave {
  //   transform: translateX(100%);
  // }
  // .moveR-leave-to{
  //   transform: translateX(100%);
  // }
  .dateRangeCommon {
    margin: 0 auto 6px;
    justify-content: center;
    text-align: center;
    font-size: 14px;
    /deep/ .yy-icon-Vjiantou-zuo,
    /deep/ .yy-icon-Vjiantou-you {
        cursor: pointer;
    }
    /deep/ .timer {
      padding: 0 8px;
      white-space: nowrap;
    }
    /deep/ .disabled {
      color: #ccc;
    }
  }
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
    width: 570px;
    height: 100%;
    z-index: 101;
    right: 0;
    top: 0;
    background: white;
    .body{
      height: 100%;
      overflow-y: auto;
      .noImgCtn {
        text-align: center;
        margin-top: 50%;
        .noDataImg {
          width:62px;
          height:59px;
        }
        .tips{
          height:16px;
          font-size:12px;
          color:rgba(102,102,102,1);
          line-height:16px;
        }
      }
    }
  }
</style>

