<template>
<div class="ctn" v-clickoutside="handleClose">
  <div class="subCtn" @click="showSlide = !showSlide">
    <span class="text">
      {{ showValue }}
    </span>
    <i class="icon-date icon-statistics-2018"></i>
  </div>
  <div class="slideCtn" v-if="showSlide">
    <div class="mb-flex">
      <!-- 第一列 -->
      <div class="listsub mb-flex-1">
        <ul class="listCtn">
          <li class="listItem"
            v-for="(item, i) in firstColumsData"
            :key="i"
            @click="setFirstCol(item)"
            :class="{'active': currentFirstCol.value == item.value}">
              {{item.name}}
          </li>
        </ul>
      </div>
      <!-- 第二列 -->
      <div class="listsub mb-flex-1" v-show="columns > 1">
        <ul class="listCtn">
          <li class="listItem"
            v-for="(item, i) in secondColumsData"
            :key="i"
            @click="setSecondCol(item)"
            :class="{'active': currentSecondCol.value == item.value}">
              {{item.name}}
          </li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <YYButton
        type="primary"
        size="small"
        @click="confirm()">
        {{$t('operate.ok')}}
      </YYButton>
    </div>
  </div>
</div>
</template>
<script>
import clickoutside from 'app_src/directives/clickoutside'

export default {
    props: {
      // 展示几列
        columns: {
            type: Number,
            default: 1
        },
        // 第一列数据
        firstColData: {
          type: Array,
          default: () => {
            return []
          }
        },
        secondColData: {
          type: Array,
          default: () => {
            return []
          }
        },
        firstColDefault: {
          type: Object,
          default: {
            name: '',
            value: ''
          }
        },
        secondColDefault: {
          type: Object,
          default: {
            name: '',
            value: ''
          }
        },
        showValue: {
          type: String,
          default: '00:00'
        }
    },
    directives: {
      clickoutside
    },
    watch: {
      firstColData(newVal) {
        this.firstColumsData = newVal;
      },
      secondColData(newVal) {
        this.secondColumsData = newVal;
      },
    },
    components: {
    },
    data() {
        return {
          showSlide: false,
          firstColumsData: this.firstColData,
          secondColumsData: this.secondColData,
          currentFirstCol: this.firstColDefault,
          currentSecondCol: this.secondColDefault,
        }
    },
    computed: {
    },
    methods: {
      handleClose () {
        this.showSlide = false
      },
      getShowValue() {
        let str = ''
        let dayValue = ''
        if(this.columns == 3) {
          this.firstColumsData.forEach(item => {
            if (item.key == this.selfDay) dayValue = item.value
          })
        }
        str = `${dayValue} ${this.selfHour}:${this.selfMinute}`
        return str
      },
      confirm () {
        if(this.columns == 1) {
          this.$emit('setTimePicker', this.currentFirstCol);
        }else if(this.columns == 2) {
          this.$emit('setTimePicker', this.currentFirstCol, this.currentSecondCol);
        }else if(this.columns == 3) {
          this.$emit('setTimePicker', this.currentFirstCol);
        }
        this.showSlide = false
      },
      setFirstCol(item) {
        this.currentFirstCol = item;
      },
      setSecondCol (item) {
        this.currentSecondCol = item
      }
    },
    created () {

    }
}
</script>
<style lang='less' scoped>
.ctn {
    position: relative;
    .subCtn {
      height: 32px;
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
      position: absolute;
      width: 100%;
      height: 240px;
      left: 0;
      top: 34px;
      z-index: 9;
      background: white;
      box-shadow:0px 3px 6px 0px rgba(74,81,93,0.25);
      border-radius:3px;
      border:1px solid rgba(221,221,221,1);
      font-size: 12px;
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

