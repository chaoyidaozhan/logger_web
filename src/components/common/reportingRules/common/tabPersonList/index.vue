<template>
  <div class="ctn">
    <ul class="list clearfix">
      <li class="item"
        v-for="(item, i) in tabHeader" :key="i"
        :class="{'active' : i == tabIndex}"
        @click="changeIndex(item.index)">
          {{item.title}}({{item.sum}})
      </li>
    </ul>
    <div v-if="isRender">
      <!-- 已提交 -->
      <ul class="subCtn clearfix" v-show="tabIndex == 0 && diarySubumitList.submitNormal.length">
        <li class="subCtnItem" v-for="(item, i) in diarySubumitList.submitNormal" :key="i">
          <PersonItem :memberMsg="item"></PersonItem>
        </li>
      </ul>
      <!-- 未提交 -->
      <ul class="subCtn clearfix" v-show="tabIndex == 1 && diarySubumitList.unSubmit.length">
        <li class="subCtnItem" v-for="(item, i) in diarySubumitList.unSubmit" :key="i">
          <PersonItem :memberMsg="item"></PersonItem>
        </li>
      </ul>
      <!-- 延期提交 -->
      <ul class="subCtn clearfix" v-show="tabIndex == 2 && diarySubumitList.submitPostpone.length">
        <li class="subCtnItem" v-for="(item, i) in diarySubumitList.submitPostpone" :key="i">
          <PersonItem :memberMsg="item"></PersonItem>
        </li>
      </ul>
    </div>
    <div class="footer">
       <YYCheckbox class="isSelected" v-model="isAllSelected" @on-change="allSelect">全选</YYCheckbox>
       <YYButton 
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
    }
  },
  data () {
    let diarySubumitList = this.detailMsg.diarySubumitList;
    return {
      tabIndex: 0,
      tabHeader: [
        {
          title: this.$t('operate.submitted'),
          sum: diarySubumitList.submitNormal.length,
          index: 0
        },
        {
          title: this.$t('operate.notSubmitted'),
          sum: diarySubumitList.unSubmit.length,
          index: 1
        },
        {
          title: this.$t('operate.postponedSubmission'),
          sum: diarySubumitList.submitPostpone.length,
          index: 2
        }
      ],
      isAllSelected: false,
      diarySubumitList,
      isConfirmShow: false,
      isRender: true
    }
  },
  components: {
    PersonItem
  },
  methods: {
    allSelect(isAllSelected) {
      let diarySubumitList = this.detailMsg.diarySubumitList;
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
      this.isRender = false;
      this.$nextTick(() => {
        this.isRender = true;
      });
    },
    sendSelectedMember() {
      let diarySubumitList = this.detailMsg.diarySubumitList;
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
      this.$YYModal.show({
          title: ``,
          content: `你将给“${memberNames.join(',')}”等${memberNames.length}人发送提交汇报提醒。`,
          onOk: () => {
            this.$ajax({
                url: '/diaryStatistics/send',
                type: 'post',
                data: {
                  content: '',
                  userIds: memberIds.join(',')
                },
                requestBody: 1,
                success: (res)=>{
                    if(res && res.code == 0) {
                      this.$YYMessage.success(res)
                    }
                }
            })
          }
      })
    },
    changeIndex(i) {
      this.isAllSelected = false;
      this.tabIndex = i
    }
  },
  created() {

  }
}
</script>
<style lang='less' scoped>
.ctn {
  padding: 0 20px;
  padding-right: 0;
  .list {
    .item {
      float: left;
      color: #333333;
      margin-right: 24px;
      position: relative;
      cursor: pointer;
      &.active {
        color: #EE2223;
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
  .subCtn {
    margin-top: 10px;
    .subCtnItem {
      float: left;
    }
  }
  .footer{
    position: absolute;
    box-sizing: border-box;
    bottom: 13px;
    right: 0;
    width: 100%;
    padding-left: 20px;
    background: white;
  }
}

</style>