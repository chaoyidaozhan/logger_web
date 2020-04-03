<template>
 <div class="listItem">
   <div class="header mb-flex mb-flex-align-center mb-flex-pack-justify">
      <div class="title">{{detailMsg.templateName}}</div>
      <div class="editAndDelete mb-flex mb-flex-pack-justify">
        <div class="edit yy-icon-bianji" @click.stop="toEdit()"></div>
        <div class="delete yy-icon-lajitong" @click.stop="delRule()"></div>
      </div>
   </div>
   <div class="subHeader">
     <div class="desc">{{detailMsg.detailMsgParticipant}}</div>
     <div class="desc">{{detailMsg.detailMsgTime}}</div>
   </div>
   <div class="footer mb-flex mb-flex-align-center mb-flex-pack-justify">
    <div class="lookDetail" @click="getDetail()">
      <span>{{$t('operate.viewDetails')}}</span>
      <i class="yy-icon-Vjiantou-you"></i>
    </div>
    <div class="photoInfor mb-flex mb-flex-align-center mb-flex-pack-justify">
      <div class="mb-flex">
        <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
        <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
        <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
      </div>
      <div class="submitNum">{{$t('operate.someoneNotSubmit').replace('<-placeholder->', detailMsg.unSubmitCount || '')}}</div>
    </div>
   </div>
 </div>
</template>
<script>
import detailDealwith from './detail.js'

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
          detailMsg: {}
        }
    },
    methods: {
      delRule() {
        this.$emit('delRule', this.detailMsg)
      },
      toEdit() {
        this.$emit('toEdit', this.detailMsg)
      },
      getDetail () {
        this.$emit('getDetail', this.detailMsg)
      }
    },
    created() {
        let data = this.data;
        this.detailMsg = {
          ...data,
          detailMsgParticipant: (detailDealwith.getParticipant.bind(this))(data.diarySubmitPeople),
          detailMsgTime: (detailDealwith.getTime.bind(this))(data.submitPeriodic)
        };
    }
}
</script>
<style lang='less' scoped>
.listItem {
  width: 430px;
  min-height: 128px;
  box-shadow: 0px 5px 15px 0px rgba(51,51,51,0.12);
  border-radius: 3px;
  margin: 0 auto 16px;
  padding: 20px 20px 0;
  background: white;
  .header {
    height: 20px;
    .title{
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    .editAndDelete {
      visibility: hidden;
      width: 47px;
    }
    .edit {
      font-size: 16px;
      cursor: pointer;
    }
    .delete {
      font-size: 16px;
      cursor: pointer;
    }
  }
  &:hover .editAndDelete {
    visibility: visible;
  }
  .subHeader {
    margin-top: 4px;
    min-height: 40px;
    font-size: 12px;
    color: #666;
    .desc {
      line-height: 20px;
    }
  }
  .footer {
    height: 20px;
    margin-top: 8px;
    .lookDetail {
      font-size: 14px;
      cursor: pointer;
      color: #3B76DD;
    }
    .photoInfor {
      width: 124px;
      height: 20px;
      .personPhoto {
        display: block;
        width: 20px;
        height: 20px;
        margin-left: -4px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 1px solid white;
      }
      .personPhoto:first-of-type {
        margin-left: 0;
      }
      .submitNum {
        color: #EE2223;
        font-weight: 400;
        font-size: 12px;
      }
    }
  }
}
</style>

