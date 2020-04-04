<template>
<div class="baseCtn">
  <List v-if="showList" @changeShow="changeShowList"/>
  <Detail v-if="showDetail" @changeShow="changeShowDetail" :detailMsg="detailMsg"/>
  <AddNew v-if="showAdd" @changeShow="changeShowAdd" :detailMsg="detailMsg"/>
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
          showAdd: false,
          detailMsg: {}
        }
    },
    methods: {
      changeShowList (flag, detailMsg = {}) {
        this.detailMsg = detailMsg;
        switch (flag) {
          case 1 :
            this.showList = false
            this.$parent.showReportingRules = false
            break;
          case 2 :
            this.showAdd = true
            break;
          case 3 :
            this.showDetail = true
            break;
        }
      },
      changeShowDetail (flag, detailMsg = {}) {
        this.detailMsg = detailMsg;
        switch (flag) {
          case 'close' :
            this.showDetail = false
            break;
          case 2 :
            this.showList = false
            this.showDetail = false
            this.showAdd = true
            break;
          case 3 :
            this.showList = false
            this.showDetail = false
            this.showAdd = true
            break;
        }
      },
      changeShowAdd () {
        this.showAdd = false;
        this.showList = true;
      }
    }
}
</script>
<style lang='less' scoped>

</style>

