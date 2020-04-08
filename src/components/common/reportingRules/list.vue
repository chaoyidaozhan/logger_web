<template>
  <transition name="moveR">
    <div>
      <div class="bgCover" @click="close()"></div>
      <div class="container">
          <div class="header mb-flex mb-flex-pack-justify mb-flex-align-center">
            <div class="title">{{$t('operate.reportRules')}}</div>
            <div class="mb-flex-1">
              <YYButton
                type="ghost" 
                @click="setRules()">
                {{$t('operate.setReportRules')}}
              </YYButton>
            </div>
            <div class="yy-icon-guanbi" @click="close()"></div>
          </div>
          <div class="body">
            <div class="scrollBody" v-if="listArr.length">
              <Item 
                :data="item" 
                v-for="(item, i) in listArr" 
                :key="i" 
                @getDetail="getDetail" 
                @toEdit="toEdit" 
                @delRule="delRule">
              </Item>
            </div>
            <div class="noImgCtn" v-else>
              <img class="noDataImg" :src="tip_data">
              <div class="tips">{{$t('operate.noReportRules')}}</div>
            </div>
          </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Item from './common/listItem'
import tip_data from 'app_assets/images/tip_data.png'
import FormatTime from 'app_src/filters/format-time'

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
          listArr: [],
          tip_data
        }
    },
    methods: {
      delRule(item) {
        this.$ajax({
            url: `/diarySubmitRule/${item.id}`,
            type: 'delete',
            data: {},
            success: res => {
                if (res.code != 0) {
                  return;
                }
                this.allRulesList();
            }
        })
      },
      allRulesList() {
        this.$ajax({
            url: '/diarySubmitRule/getAllDiarySubmitRules',
            type: 'get',
            data: {},
            success: res => {
              if (res && res.data) {
                this.listArr = res.data || [];
              }
            }
        })
      },
      close () {
        // 1 关闭 2 设置规则  3 查看详情
        this.$emit('changeShow', 1)
      },
      setRules () {
        this.$emit('changeShow', 2)
      },
      itemDetailMsg(item, queryDate = '') {
        return new Promise((reslove, reject) => {
                this.$ajax({
                  url: `/diarySubmitRule/getRuleDetail`,
                  data: {
                    diarySubmitRuleId: item.id,
                    queryDate: (queryDate || FormatTime(new Date(), 'YYYY-MM-DD'))
                  },
                  success: (res) => {
                    if (res.code == 0) {
                        reslove(res.data);
                    }
                  }
                })
        });
      },
      toEdit(item) {
        this.itemDetailMsg(item).then((data) => {
            data.currentItemDetailMsg = item;
            this.$emit('changeShow', 2, data);
        });
      },
      getDetail (item) {
        this.itemDetailMsg(item).then((data) => {
            data.currentItemDetailMsg = item;
            this.$emit('changeShow', 3, data);
        });
      }
    },
    created() {
      this.allRulesList();
    },
    mounted () {
    },
    destroyed () {
    }
}
</script>
<style lang='less' scoped>
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
    box-shadow: -8px 0px 30px 0px rgba(74,81,93,0.2);
    width: 470px;
    height: 100%;
    z-index: 99;
    right: 0;
    top: 0;
    background: white;
    .header {
      height: 48px;
      padding: 0 20px;
      .title {
        
      }
      .mb-flex-1 {
        padding-right: 23px;
        text-align: right;
      }
      .yy-icon-guanbi {
        font-size: 12px;
        cursor: pointer;
      }
    }
    .body{
      height: 100%;
      overflow-y: auto;
      padding-top: 16px;
      box-sizing: border-box;
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

