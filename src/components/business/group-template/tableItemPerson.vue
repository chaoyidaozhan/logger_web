<template>
  <div class="personCtn">
    <img class="personImg" :src='src'>
    <span class="desc"> {{groupName}} </span>
  </div>
</template>

<script>

export default {
  data () {
    return {
      src: this.groupLogo,
      name: this.groupName
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
    },
    groupName : {
      type: String,
      default: ''
    },
    groupLogo : {
      type: String,
      default: ''
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
