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
      changeShowList (flag) {
        switch (flag) {
          case 1 :
            this.showList = false
            this.$parent.showReportingRules = false
            break;
          case 2 :
            // this.showList = true,
            // this.showDetail = true
            this.showAdd = true
            break;
        }
      },
      changeShowDetail () {
        this.showDetail = false
      },
      changeShowAdd () {
        this.showAdd = false
      }
    },
    mounted () {
    },
    destroyed () {
    }
}
</script>
<style lang='less' scoped>

</style>

