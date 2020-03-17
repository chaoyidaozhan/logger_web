<template>
<div class="baseCtn">
  <List v-show="showList" @changeShow="changeShowList"/>
  <Detail v-show="showDetail" @changeShow="changeShowDetail"/>
  <AddNew v-show="showAdd" @changeShow="changeShowAdd"/>
</div>
</template>
<script>
import List from './list'
import Detail from './detail'
import AddNew from './addNew'

export default {
    props: {
    },
    components: {
      List,
      Detail,
      AddNew
    },
    data() {
        return {
          showList: true,
          showDetail: false,
          showAdd: false
        }
    },
    methods: {
      changeShowList () {
        this.showList = false
        this.$parent.showReportingRules = false
      },
      changeShowDetail () {},
      changeShowAdd () {}
    },
    mounted () {
    },
    destroyed () {
    }
}
</script>
<style lang='less' scoped>

</style>

