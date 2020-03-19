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
              @click="setRules()">
              设置汇报规则
            </YYButton>
            <i class="closeIcon icon-add" @click="close()"></i>
          </div>
          <div class="body">
            <div class="scrollBody" v-if="listArr.length">
              <Item v-for="(item, i) in listArr" :key=i @getDetail="getDetail"></Item>
            </div>
            <div class="noImgCtn" v-else>
              <img class="noDataImg" :src="tip_data">
              <div class="tips">暂无汇报规则</div>
            </div>
          </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Item from './common/listItem'
import tip_data from 'app_assets/images/tip_data.png'
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
          listArr: [1,2,3,4,5,6,7,8,9,10],
          // listArr: [],
          tip_data
        }
    },
    methods: {
      close () {
        // 1 关闭 2 设置规则  3 查看详情
        this.$emit('changeShow', 1)
      },
      setRules () {
        // 1 关闭 2 设置规则  3 查看详情
        this.$emit('changeShow', 2)
      },
      getDetail () {
        this.$emit('changeShow', 3)
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
    transition: all .5s linear;
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
      .noImgCtn {
        text-align: center;
        margin-top: 50%;
        .noDataImg {
          width:62px;
          height:59px;
        }
        .tips{
          height:16px;
          font-size:12px;
          color:rgba(102,102,102,1);
          line-height:16px;
        }
      }
    }
  }
</style>

