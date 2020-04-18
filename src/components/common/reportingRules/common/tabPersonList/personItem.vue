<template>
  <div class="personalItem mb-flex mb-flex-align-center" :class="{'active': memberMsg.isSelected}">
    <img class="personPhoto" :src="memberMsg.avatar">
    <div class="name mb-flex-1">{{memberMsg.userName}}</div>
    <div class="personalCheckbox" v-if="isCheckboxShow">
      <YYCheckbox class="isSelected" v-model="memberMsg.isSelected" @on-change="check"/>
    </div>
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
    },
    isCheckboxShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isGray: true
    }
  },
  methods: {
    check(memberMsg) {
      this.$emit('itemCheck')
    }
  }
}
</script>
<style lang="less" scoped>
.personalItem {
  cursor: pointer;
  width: 125px;
  height: 42px;
  border-radius: 2px;
  margin-right: 5px;
  margin-left: 2px;
  margin-bottom: 8px;
  line-height: 42px;
  padding-right: 8px;
  background: rgba(245,246,247,1);
  &:hover{
    box-shadow:0px 3px 6px 0px rgba(0,0,0,0.14);
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
    display: block;
    width:28px;
    height:28px;
    border-radius: 50%;
    vertical-align: middle;
    margin-left: 12px;
  }
  .name {
    vertical-align: middle;
    margin-left: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .personalCheckbox {
    width: 14px;
    height: 42px;
    font-size: 0;
  }
  .isSelected {
    display: none
  }
}
</style>