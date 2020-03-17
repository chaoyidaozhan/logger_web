<template>
  <transition name="moveR">
    <div>
      <div class="bgCover" @click="close()"></div>
      <div class="container">
          <div class="header">
            <span class="title">汇报规则</span>
            <YYButton
              :class="'headerButton'"
              type="ghost" 
              @click="close()">
              设置汇报规则
            </YYButton>
            <i class="closeIcon icon-add" @click="close()"></i>
          </div>
          <div class="body">
            <div class="scrollBody">
              <Item v-for="(item, i) in listArr" :key=i></Item>
            </div>
          </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Item from './common/listItem'

export default {
    props: {
        // showList: { // 是否显示模板
        //     type: Boolean,
        //     default: false
        // }
    },
    components: {
      Item
    },
    data() {
        return {
          listArr: [1,2,3,4,5,6,7,8,9,10]
        }
    },
    methods: {
      close () {
        this.$emit('changeShow')
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
    transition: all 5s linear;
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
    font-size: 12px;
    position: fixed;
    box-shadow: 0 2px 8px rgba(0,0,0,.15);
    width: 470px;
    height: 100%;
    z-index: 99;
    right: 0;
    top: 0;
    background: white;
    .title {
      display: inline-block;
      height: 48px;
      line-height: 48px;
      margin-left: 20px;
    }
    .headerButton {
      float: right;
      margin-right: 56px;
      margin-top: 10px;
    }
    .closeIcon {
      position: absolute;
      right: 22px;
      top: 18px;
      cursor: pointer;
      transform: rotate(45deg);
    }
    .body{
      height: 100%;
      overflow-y: auto;
      .scrollBody {

      }
    }
  }
</style>

