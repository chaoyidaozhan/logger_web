<template>
  <div class="ctn">
    <ul class="list clearfix">
      <li class="item"
        v-for="(item, i) in tabHeader" :key="i"
        :class="{'active' : i == tabIndex}"
        @click="changeIndex(item.index)">
          {{item.title}}({{item.sum}})
      </li>
      <!-- <li class="item" :class="{'active' : tabIndex == 2}" @click="changeIndex(2)">未提交 (1)</li> -->
      <!-- <li class="item" @click="changeIndex(3)">延期提交 (1)</li> -->
    </ul>
    <!-- 已提交 -->
    <ul class="subCtn clearfix" v-show="tabIndex == 0">
      <li class="subCtnItem" v-for="(item, i) in list" :key="i">
        <PersonItem></PersonItem>
      </li>
    </ul>
    <!-- 未提交 -->
    <ul class="subCtn clearfix" v-show="tabIndex == 1">
      <li class="subCtnItem" v-for="(item, i) in list" :key="i">
        <PersonItem></PersonItem>
      </li>
    </ul>
    <!-- 延期提交 -->
    <ul class="subCtn clearfix" v-show="tabIndex == 2">
      <li class="subCtnItem" v-for="(item, i) in list" :key="i">
        <PersonItem></PersonItem>
      </li>
    </ul>
    <div class="footer">
       <YYCheckbox class="isSelected" v-model="isSelected">全选</YYCheckbox>
       <YYButton 
        type="primary">
          发送提醒
      </YYButton>
    </div>
  </div>
</template>

<script>
import PersonItem from './personItem'

export default {
  data () {
    return {
      list: [1,2,3,4,5,6],
      tabIndex: 0,
      tabHeader: [
        {
          title: '已提交',
          sum: 11,
          index: 0
        },
        {
          title: '未提交',
          sum: 2222,
          index: 1
        },
        {
          title: '延期提交',
          sum: 323,
          index: 2
        }
      ],
      isSelected: false
    }
  },
  components: {
    PersonItem
  },
  methods: {
    changeIndex(i) {
      this.tabIndex = i
    }
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
    bottom: 13px;
    right: 0;
    width: 100%;
    padding-left: 20px;
  }
}

</style>