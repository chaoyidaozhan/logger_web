<template>
  <transition name="moveR">
    <div>
      <div class="bgCover" @click="close()"></div>
      <div class="container">
         <div class="header">
            <span class="title">{{$t('operate.setReportRules')}}</span>
            <i class="closeIcon icon-add" @click="close()"></i>
          </div>
         <DetailItem @edit="editClick()" :detailMsg="detailMsg" @handleChangeDate="handleChangeDate"></DetailItem>
         <DateRange :class="'dataRange'"></DateRange>
         <TabPersonList :detailMsg="detailMsg"></TabPersonList>
      </div>
    </div>
  </transition>
</template>
<script>
import DetailItem from './common/detailItem'
import DateRange from './common/dateRange'
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
      DateRange,
      TabPersonList
    },
    data() {
        return {
          tip_data
        }
    },
    methods: {
      handleChangeDate(data) {
        this.$emit('handleChangeDate', data);
      },
      editClick () {
        this.$emit('changeShow', 2)
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
    .dataRange {
      text-align: center;
      font-size: 14px;
    }
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
      height: 100%;
      overflow-y: auto;
      .scrollBody {

      }
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

