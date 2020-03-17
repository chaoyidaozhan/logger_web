<template>
 <div class="listItem">
   <div class="header">
      <span class="title">项目实施周报</span>
      <span class="buttonGroup">
        <i class="edit icon-edit"></i>
        <i class="delete icon-delete"></i>
      </span>
   </div>
   <div class="subHeader">
     <div class="desc">张三,李四,王五等11人</div>
     <div class="desc">周五18：00-下周一09：00</div>
   </div>
   <div class="footer">
     <span class="lookDetail" @click="getDetail()">查看详情 <i class="icon-arrow-right"></i></span>
     <span class="photoInfor">
       <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
       <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
       <img class="personPhoto" src='http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/10668/3259547/201802/9/151815486186b6e5713f8117fa31190a7f2cba2cfd.jpg.thumb.jpg'>
       <span class="submitNum">5人提交</span>
     </span>
   </div>
 </div>
</template>
<script>

export default {
    props: {
        // showTemplate: { // 是否显示模板
        //     type: Boolean,
        //     default: false
        // }
    },
    components: {
    },
    data() {
        return {
          // showList: true
        }
    },
    methods: {
      getDetail () {
        this.$emit('getDetail')
      }
    },
    mounted () {
    },
    destroyed () {
    }
}
</script>
<style lang='less' scoped>
.listItem {
  width:430px;
  height:128px;
  background:rgba(255,255,255,1);
  box-shadow:0px 5px 15px 0px rgba(51,51,51,0.12);
  border-radius:3px;
  margin: 16px auto;
  padding: 0 20px;
  &:hover{
    .buttonGroup {
      display: inline-block!important;
    }
  }
  .header {
    .title{
      display: inline-block;
      font-size:14px;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:20px;
    }
    .buttonGroup {
      display: none;
      float: right;
      .edit {
        font-size: 18px;
        margin-right: 10px;
        vertical-align: middle;
      }
      .delete {
        font-size: 16px;
        vertical-align: middle;
      }
    }
  }
  .subHeader {
    .desc {
        font-size: 12px;
        color: #666666;
        line-height: 20px;
    }
  }
  .footer {
    .lookDetail {
      cursor: pointer;
      color: #3B76DD;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      .icon-arrow-right {
        vertical-align: middle;
        margin-top: -2px;
        display: inline-block;
      }
    }
    .photoInfor {
      height: 20px;
      line-height: 20px;
      float: right;
      .personPhoto {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        vertical-align: middle;
        margin-top: -2px;
        margin-right: -10px;
      }
      .submitNum {
        margin-left: 18px;
        color: #EE2223;
      }
    }
  }
}
</style>

