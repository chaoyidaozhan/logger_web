<template>
    <div class="logger-creat">
        <div class="select-date-bar">
            <div class="creat-left">日志日期</div>
            <div class="creat-right"> 
                <DatePicker type="date"
                    placement="bottom-start"
                    placeholder="日期" 
                    class="date-wrap"
                    >
                </DatePicker>
            </div>
        </div>
        <div class="select-range-bar">
            <div class="creat-left">可见范围</div>
            <div class="creat-right">
                <div class="select-range">
                    <i class="select-range-icon"></i>
                </div>
            </div>
        </div>
         <div>
            <div class="creat-left">本周工作总结</div>
            <div class="creat-right">{{this.$store.state.template.app}}</div>
        </div>
    </div>
</template>
<script>
export default {
    // data(){

    // },
    components: {
    },
    methods: {
        loadData(){
            let id = this.$route.params.id;
            let template = this.$store.state.template.app;
            var templateList = {};
            template.forEach((v,k) => {
                var id = v.id;
                templateList[id] = [];
                templateList.forEach((value,key)=>{
                    templateList[id].push(v);
                })
               
                
            })
               console.log(templateList)

            // for(var i in template){
            //     // templateList[i] = i.id;
            //     console.log(i)
               
            // }
            //  console.log(templateList)
        }

    },
    created(){
        this.loadData();
        console.log(this.$store.state,4444444,this.$route.path)
    },
}
</script>
<style lang="less" scoped>
@import '../../assets/css/var.less';
.logger-creat{
    .creat-left{
        width: 22%;
        height:48px;
        line-height: 48px;
        float: left;
        font-size: 14px;
        color: @gray-color-dark;
        text-align: right;
    }
    .creat-right{
        height:48px;
        line-height: 48px;
        padding-left: 24%;
        padding-right: 17%;
        box-sizing: border-box;
        // color: #333333;
    }
    .select-date-bar{
        .date-wrap{
            width: 100%;
            .ivu-input{
                height: 37px;
            }
        }
    }
    .select-range-bar{
        .select-range{
            height:37px;
            line-height: 37px; 
            border:1px solid  @border-color-base;
            border-radius: 4px;
        }
    }

    

}
</style>


