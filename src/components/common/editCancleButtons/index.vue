<template>
  <div class="">
    <span class="btn edit" @click="edit"> {{$t('fieldAuth.edit')}} </span>
    <span class="btn cancle" @click="cancle"> {{$t('cusBtns.remove')}} </span>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  props: {
  },
  methods: {
    edit () {
      this.$emit('BtnEdit')
    },
    cancle () {
      this.$emit('BtnCancle')
    }
  }
}
</script>

<style lang='scss' scoped>
.btn{
  display: inline-block;
  cursor: pointer;
  // width:24px;
  height:18px;
  font-size:12px;
  font-weight:400;
  color:rgba(59,118,221,1);
  line-height:18px;
  margin-right: 13px;
}
</style>
