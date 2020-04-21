<template>
 <div class="listItem">
   <div class="header mb-flex mb-flex-align-center mb-flex-pack-justify">
      <div class="title mb-flex-1">{{currentItemDetailMsg.templateName}}</div>
      <div>
        <YYButton
          v-if="currentMemberId == currentItemDetailMsg.memberId"
          type="ghost" 
          size="small" 
          @click="handleClick()">
          {{$t('operate.edit')}}
        </YYButton>
      </div>
   </div>
   <div class="subHeader">
     <div class="desc">{{currentItemDetailMsg.detailMsgParticipant}}</div>
     <div class="desc">{{currentItemDetailMsg.detailMsgTime}}</div>
   </div>
   <div class="footer mb-flex mb-flex-align-center">
    <div class="photoInfor mb-flex mb-flex-align-center" v-if="currentItemDetailMsg.unSubmit.length">
      <div class="mb-flex">
        <template v-for="(item, index) in currentItemDetailMsg.unSubmit">
          <img class="personPhoto" v-if="index < 3" :src="item.avatar"/>
        </template>
      </div>
      <div class="submitNum">{{$t('operate.someoneNotSubmit').replace('<-placeholder->', currentItemDetailMsg.unSubmitCount || '')}}</div>
    </div>
   </div>
 </div>
</template>
<script>
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
  },
  data() {
      return {
        currentItemDetailMsg: {},
        currentMemberId: this.$store.state.userInfo.member_id
      }
  },
  methods: {
    handleClick () {
      this.$emit('edit')
    }
  },
  created() {
    this.currentItemDetailMsg = this.detailMsg.currentItemDetailMsg;
  }
}
</script>
<style lang='less' scoped>
.listItem {
  box-shadow: 0px 5px 15px 0px rgba(51,51,51,0.12);
  border-radius: 3px;
  margin: 0 auto 16px;
  padding: 20px;
  background: white;
  .header {
    min-height: 26px;
    .title {
      padding-right: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      line-height: 20px;
      box-sizing: border-box;
    }
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
    .photoInfor {
      min-width: 124px;
      height: 20px;
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
        cursor: pointer;
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