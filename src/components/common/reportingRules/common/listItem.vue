<template>
 <div class="listItem">
   <div class="header">
      <span class="title">{{detailMsg.templateName}}</span>
      <span class="buttonGroup">
        <i class="edit icon-edit" @click.stop="toEdit()"></i>
        <i class="delete icon-delete" @click.stop="delRule()"></i>
      </span>
   </div>
   <div class="subHeader">
     <div class="desc">{{detailMsg.detailMsgParticipant}}</div>
     <div class="desc">{{detailMsg.detailMsgTime}}</div>
   </div>
   <div class="footer">
     <span class="lookDetail" @click="getDetail()">{{$t('operate.viewDetails')}} <i class="icon-arrow-right"></i></span>
     <span class="photoInfor">
       <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
       <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
       <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
       <span class="submitNum">{{$t('operate.someoneNotSubmit').replace('<-placeholder->', detailMsg.unSubmitCount || '')}}</span>
     </span>
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

