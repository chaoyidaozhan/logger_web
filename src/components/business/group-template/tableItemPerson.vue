<template>
  <div class="personCtn">
    <img class="personImg" :src='src'>
    <span class="desc"> {{name}} </span>
  </div>
</template>

<script>

export default {
  data () {
    return {
      src: this.personData.avatar,
      name: this.personData.name
    }
  },
  props: {
    personData: {
      type: Object,
      default: () => (
        {
          'name': '',
          'src': ''
        }
      )
    }
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

<style lang='less' scoped>
.personCtn {
  .personImg {
    display: inline-block;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .desc{
    display: inline-block;
    margin-left: 3px;
    vertical-align: middle;
  }
}
</style>
