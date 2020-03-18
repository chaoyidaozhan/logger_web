<template>
<div class="ctn">
  <div class="subCtn" @click="showSlide = !showSlide">
    <span class="text">
      日期 啊啊啊啊
    </span>
    <i class="icon-date icon-statistics-2018"></i>   
  </div> 
  <div class="slideCtn" v-show="showSlide" :style="{width: columns == 2 ? '66.66%' : '100%'}">
    <div class="listsub" :style="{width: columns == 2 ? '50%' : '33.33%'}" v-if="columns != 2">
       <ul class="listCtn">
        <li class="listItem">1</li>
        <li class="listItem">2</li>
        <li class="listItem">3</li>
      </ul>
    </div>
    <div class="listsub" :style="{width: columns == 2 ? '50%' : '33.33%'}">
       <ul class="listCtn">
          <li class="listItem">1</li>
          <li class="listItem">2</li>
          <li class="listItem">3</li>
          <li class="listItem">1</li>
          <li class="listItem">2</li>
          <li class="listItem">3</li>
          <li class="listItem">1</li>
          <li class="listItem">2</li>
          <li class="listItem">3</li>
          <li class="listItem">1</li>
          <li class="listItem">2</li>
          <li class="listItem">3</li>
          <li class="listItem">1</li>
          <li class="listItem">2</li>
          <li class="listItem">3</li>
          <li class="listItem">1</li>
          <li class="listItem">2</li>
          <li class="listItem">3</li>
          <li class="listItem">1</li>
          <li class="listItem">2</li>
          <li class="listItem">3</li>
          <li class="listItem">1</li>
          <li class="listItem">2</li>
          <li class="listItem">3</li>
          <li class="listItem">1</li>
          <li class="listItem">2</li>
          <li class="listItem">3</li>
      </ul>
    </div>
    <div class="listsub" :style="{width: columns == 2 ? '50%' : '33.33%'}">
       <ul class="listCtn">
        <li class="listItem">1</li>
        <li class="listItem">2</li>
        <li class="listItem">3</li>
      </ul>
    </div>
    <div style="clear: both"></div>
    <div class="footer">
      <YYButton 
        type="primary"
        size="small"
        @click="confirm()"
        >
        确定
      </YYButton>
    </div>
  </div>
</div>
</template>
<script>

export default {
    props: {
        columns: { // 是否显示模板
            type: Number,
            default: 3
        }
    },
    components: {
    },
    data() {
        return {
          showSlide: false,
          firstColumsData: [
            {key: 1, value: '星期一'},
            {key: 2, value: '星期二'},
            {key: 3, value: '星期三'},
          ]
        }
    },
    methods: {
      confirm () {
        this.showSlide = false
      }
    },
    mounted () {
    },
    destroyed () {
    }
}
</script>
<style lang='less' scoped>
.ctn {
    position: relative;
    height: 32px;
    line-height: 32px;
    .subCtn {
      // width: 115px;
      padding: 0px 10px;
      font-size: 12px;
      border: 1px solid #d9d9d9;
      border-radius: 3px;
      color: #333;
      &:hover {
        border-color: #737985;
      }
      .text {

      }
      .icon-date {
        font-size: 15px;
        float: right;
        margin-top: 8px;
      }
    }
    .slideCtn {
      width: 100%;
      height: 240px;
      position: absolute;
      left: 0;
      top: 34px;
      z-index: 9;
      background: white;
      box-shadow:0px 3px 6px 0px rgba(74,81,93,0.25);
      border-radius:3px;
      border:1px solid rgba(221,221,221,1);
      .listsub {
        height: 200px;
        overflow-y: auto;
        width: 33.33%;
        float: left;
        border-right: 1px solid #D9D9D9;
        &::-webkit-scrollbar {      /*滚动条整体样式*/
            width: 4px;             /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
        }
        &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.2);
        }
        .listItem {
          line-height: 28px;
          height: 28px;
          cursor: pointer;
          padding-left: 8px;
          color: #555555;
          &:hover {
            background:rgba(240,243,249,1);
            color: #333333;
          }
          &.active {
            background: #FFF9ED;
            color: #EE2223;
          }
        }
      }
      .footer{
        text-align: right;
        border-top: 1px solid #D9D9D9;
        padding: 3px 5px 4px 0;
      }
    }
}
</style>

