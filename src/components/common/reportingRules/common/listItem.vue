<template>
 <div class="listItem" @click.stop="getDetail">
   <div class="header mb-flex mb-flex-align-center mb-flex-pack-justify">
      <div class="title">{{detailMsg.templateName}}</div>
      <div class="editAndDelete mb-flex mb-flex-pack-justify">
        <div class="edit yy-icon-bianji-2" :class="{notCreater: currentMemberId != detailMsg.memberId}" @click.stop="toEdit"></div>
        <div class="delete yy-icon-lajitong" @click.stop="delRule"></div>
      </div>
   </div>
   <div class="subHeader">
     <div class="desc">{{detailMsg.detailMsgParticipant}}</div>
     <div class="desc">{{detailMsg.detailMsgTime}}</div>
   </div>
   <div class="footer mb-flex mb-flex-align-center mb-flex-pack-justify">
    <div class="lookDetail mb-flex mb-flex-align-center">
      <div>{{$t('operate.viewDetails')}}</div>
      <div class="yy-icon-Vjiantou-you"></div>
    </div>
    <div class="photoInfor mb-flex mb-flex-align-center" v-if="detailMsg.unSubmit.length">
      <div class="mb-flex">
        <template v-for="(item, index) in detailMsg.unSubmit">
          <img @click.stop="toSomeoneReportList(item)" class="personPhoto" v-if="index < 3" :src="item.avatar">
        </template>
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
          detailMsg: {},
          currentMemberId: this.$store.state.userInfo.member_id
        }
    },
    methods: {
      toSomeoneReportList(item) {
        // this.$router.push({
        //   path: '/LoggerQueryAll',
        //   query: {
        //     token: this.$store.state.userInfo.token
        //   }
        // });
        // setTimeout(() => {
        //   this.$eventbus.$emit('reportingRules/common/listItem--someoneReportList', item);
        // }, 1000);
      },
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
  cursor: pointer;
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
      color: #666;
    }
    .edit {
      font-size: 16px;
    }
    .delete {
      font-size: 16px;
    }
    .notCreater {
      visibility: hidden;
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
      color: #3B76DD;
    }
    .photoInfor {
      min-width: 124px;
      height: 20px;
      justify-content: flex-end;
      img {
        display: block;
      }
      .mb-flex {
        margin-right: 12px;
      }
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

