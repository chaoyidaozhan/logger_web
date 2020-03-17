<template>
  <transition name="moveR"  v-if="showList">
    <div>
      <div class="bgCover"></div>
      <div class="container">
          <div class="header">
            <span>汇报规则</span>
            <span>设置汇报规则</span>
            <i class="icon-customized"></i>
          </div>
      </div>
    </div>
  </transition>
</template>
<script>

export default {
    props: {
        showTemplate: { // 是否显示模板
            type: Boolean,
            default: false
        }
    },
    components: {
    },
    data() {
        return {
          showList: true
        }
    },
    methods: {
      aa () {

      }
    },
    mounted () {
    },
    destroyed () {
    }
}
</script>
<style lang='less' scoped>
  .moveR-enter-active,  .moveR-leave-active {
    transition: all 0.3s linear;
    transform: translateX(0);
  }
  .moveR-enter,  .moveR-leave {
    transform: translateX(100%);
  }
  .moveR-leave-to{
    transform: translateX(100%);
  }
  .bgCover {
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    bottom: 0;
    opacity: 0;
    z-index: 98;
  }
  .container {
    position: fixed;
    box-shadow: 0 2px 8px rgba(0,0,0,.15);
    width: 470px;
    height: 100%;
    z-index: 99;
    right: 0;
    top: 0;
    background: white;
    // transition: transform .3s cubic-bezier(.9,0,.3,.7),-webkit-transform .3s cubic-bezier(.9,0,.3,.7);
  }
</style>

