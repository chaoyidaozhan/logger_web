<template>
  <div class="ctn mb-flex mb-flex-v tab-person-list-wrapper">
    <div class="list mb-flex mb-flex-align-center">
      <div 
        class="item"
        v-for="(item, i) in tabHeader" :key="i"
        :class="{'active' : i == tabIndex}"
        @click="changeIndex(item.index)">
        {{item.title}}({{item.sum}})
      </div>
    </div>
    <div class="listContainer mb-flex-1">
      <!-- 已提交 -->
      <div class="subCtn mb-flex mb-flex-wrap" v-show="tabIndex == 0">
        <div class="mb-flex mb-flex-wrap ">
          <PersonItem :memberMsg="item" @itemCheck="itemCheck(item)" :isCheckboxShow="false" v-for="(item, i) in diarySubumitList.submitNormal" :key="i"></PersonItem>
          <YYEmpty v-if="!diarySubumitList.submitNormal.length" vertical="middle" text="暂无数据"/>
        </div>
      </div>
      <!-- 未提交 -->
      <div class="subCtn" v-if="isRender" v-show="tabIndex == 1">
        <div class="mb-flex mb-flex-wrap">
          <PersonItem :memberMsg="item" @itemCheck="itemCheck(item)" v-for="(item, i) in diarySubumitList.unSubmit" :key="i"></PersonItem>
          <YYEmpty v-if="!diarySubumitList.unSubmit.length" vertical="middle" text="暂无数据"/>
        </div>
      </div>
      <!-- 延期提交 -->
      <div class="subCtn mb-flex mb-flex-wrap" v-if="isRender" v-show="tabIndex == 2">
        <div class="mb-flex mb-flex-wrap">
          <PersonItem :memberMsg="item" @itemCheck="itemCheck(item)" v-for="(item, i) in diarySubumitList.submitPostpone" :key="i"></PersonItem>
          <YYEmpty v-if="!diarySubumitList.submitPostpone.length" vertical="middle" text="暂无数据"/>
        </div>
      </div>
    </div>
    <div class="footer">
       <YYCheckbox v-show="tabIndex != 0" class="isSelected" v-model="isAllSelected" @on-change="allSelect">全选</YYCheckbox>
       <YYButton 
        v-show="tabIndex != 0"
        @click="sendSelectedMember"
        type="primary">
          {{$t('operate.sendReminder')}}
      </YYButton>
    </div>
  </div>
</template>

<script>
import PersonItem from './personItem'

export default {
  props: {
    detailMsg: {
      type: Object,
      default: function() {
        return {};
      }
    },
    dateRange: {
      type: Object,
      default: function() {
        return {};
      }
    },
  },
  data () {
    let diarySubumitList = this.detailMsg.diarySubumitList;
    return {
      tabIndex: 0,
      tabHeader: [
        {
          title: this.$t('operate.submitted'),
          sum: diarySubumitList.submitNormal.length,
          index: 0,
          isAllSelected: false
        },
        {
          title: this.$t('operate.notSubmitted'),
          sum: diarySubumitList.unSubmit.length,
          index: 1,
          isAllSelected: false
        },
        {
          title: this.$t('operate.postponedSubmission'),
          sum: diarySubumitList.submitPostpone.length,
          index: 2,
          isAllSelected: false
        }
      ],
      diarySubumitList,
      isConfirmShow: false,
      isRender: true,
      isAllSelected: false
    }
  },
  components: {
    PersonItem
  },
  methods: {
    itemCheck(item) {
      let selectedLen = 0;
      let diarySubumitList = this.diarySubumitList;
      let unSubmit = diarySubumitList.unSubmit;
      let submitPostpone = diarySubumitList.submitPostpone;
      switch(this.tabIndex) {
        // case 0:
        // break;
        case 1:
          unSubmit.forEach((item, index) => {
            item.isSelected && (++selectedLen);
          });
          if(unSubmit.length == selectedLen) {
            this.tabHeader[this.tabIndex].isAllSelected = true;
            this.isAllSelected = true;
          }
        break;
        case 2:
          submitPostpone.forEach((item, index) => {
            item.isSelected && (++selectedLen);
          });
          if(submitPostpone.length == selectedLen) {
            this.tabHeader[this.tabIndex].isAllSelected = true;
            this.isAllSelected = true;
          }
        break;
      }
      if(selectedLen === 0) {
        this.tabHeader[this.tabIndex].isAllSelected = false;
        this.isAllSelected = false;
      }
    },
    allSelect(isAllSelected) {
      let diarySubumitList = this.diarySubumitList;
      switch(this.tabIndex) {
        // case 0:
        // break;
        case 1:
          diarySubumitList.unSubmit.forEach((item, index) => {
            item.isSelected = isAllSelected;
          });
        break;
        case 2:
          diarySubumitList.submitPostpone.forEach((item, index) => {
            item.isSelected = isAllSelected;
          });
        break;
      }
      this.isAllSelected = isAllSelected;
      this.tabHeader[this.tabIndex].isAllSelected = isAllSelected;
      this.diarySubumitList = diarySubumitList;
      this.isRender = false;
      this.$nextTick(() => {
        this.isRender = true;
      });
    },
    sendSelectedMember() {
      let diarySubumitList = this.diarySubumitList;
      let memberIds = [];
      let memberNames = [];
      switch(this.tabIndex) {
        // case 0:
        // break;
        case 1:
          diarySubumitList.unSubmit.forEach((item, index) => {
            if(item.isSelected) {
              memberIds.push(item.memberId);
              memberNames.push(item.userName);
            }
          });
        break;
        case 2:
          diarySubumitList.submitPostpone.forEach((item, index) => {
            if(item.isSelected) {
              memberIds.push(item.memberId);
              memberNames.push(item.userName);
            }
          });
        break;
      }
      if(!memberIds.length) {
        this.$YYMessage.warning('请先选择人员');
        return;
      }
      this.$YYModal.show({
          title: ``,
          content: `你将给“${memberNames.join(',')}”等${memberNames.length}人发送提交汇报提醒。`,
          onOk: () => {
            this.$ajax({
                url: '/diarySubmitRule/remind',
                type: 'post',
                data: {
                  diarySubmitRuleId: this.detailMsg.currentItemDetailMsg.id,
                  memberIds: memberIds.join(','),
                  queryDate: this.dateRange.beginDate
                },
                requestBody: true,
                success: (res)=>{
                  this.$YYMessage.success('提醒成功');
                }
            });
          }
      })
    },
    changeIndex(i) {
      this.tabIndex = i;
      this.isAllSelected = this.tabHeader[this.tabIndex].isAllSelected;
    }
  },
  created() {

  }
}
</script>
<style lang='less' scoped>
.ctn {
  box-sizing: border-box;
  padding: 0 20px;
  .listContainer {
    position: relative;
    .subCtn {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      overflow-y: auto;
      padding-top: 10px;
      box-sizing: border-box;
      &::-webkit-scrollbar {
        width: 0;
      }
      & > div {
        width: 100%;
        height: 100%;
        align-content: flex-start;
      }
    }
    /deep/ .yy-empty {
      margin: 0 auto;
    }
  }
  .list {
    height: 40px;
    .item {
      color: #333;
      margin-right: 24px;
      position: relative;
      cursor: pointer;
      &.active {
        color: #EE2223;
        font-weight: 500;
        &::before{
          content: '';
          width: 50%;
          height: 4px;
          background: #ee2223;
          border-radius: 1px;
          display: block;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .footer {
    box-sizing: border-box;
    padding: 0 0 13px 0;
    background: white;
  }
}
</style>
<style lang="less">
  .ctn.tab-person-list-wrapper {
    .yy-empty-content {
      position: relative;
    }
  }
</style>