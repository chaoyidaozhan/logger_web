<template>
  <div class="personalItem" :class="{'active': isSelected, 'gray': isGray}">
    <img class="personPhoto" :src="memberMsg.avatar">
    <span class="name">{{memberMsg.userName}}</span>
    <YYCheckbox class="isSelected" v-model="memberMsg.isSelected"/>
  </div>
</template>

<script>
export default {
  props: {
    memberMsg: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data () {
    return {

      isGray: true
    }
  }
}
</script>
<style lang="less" scoped>
.personalItem {
  cursor: pointer;
  width: 102px;
  height: 42px;
  background: rgba(245,246,247,1);
  border-radius: 2px;
  margin-right: 7px;
  margin-bottom: 8px;
  line-height: 42px;
  &:hover{
    .isSelected {
      display: inline-block;
    }
  }
  &.active {
    .isSelected {
      display: inline-block;
    }
  }
  .personPhoto {
    width:28px;
    height:28px;
    border-radius: 50%;
    vertical-align: middle;
    margin-left: 12px;
  }
  .name{
    vertical-align: middle;
    margin-left: 6px;
  }
  .isSelected {
    display: none
  }
}
</style>