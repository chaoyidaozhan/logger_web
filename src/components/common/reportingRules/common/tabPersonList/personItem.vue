<template>
  <div class="personalItem" :class="{'active': isSelected, 'gray': isGray}">
    <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
    <span class="name">张三</span>
    <YYCheckbox class="isSelected" v-model="isSelected"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isSelected: false,
      isGray: false
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