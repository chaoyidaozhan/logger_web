<template>
    <div class ="logger-summary-content">
        <div class="content-header">
            <div class="note">说明：只能查询到最新模板的数据，模板修改前的数据可以导出EXCEL，切换不同sheet进行查看</div>
        </div>
        <div v-if="list.length">
            <div class="content-bar">
                <Table border ref="selection" :columns="columnsData" :data="listTemplate"  @on-selection-change="handleSelectChange"></Table>
            </div>
            <div class="content-bottom" v-if="list.length">
                <span class="bottom-left">
                    <Checkbox v-model="dataType" @on-change="handleSelectAll(dataType)">全选</Checkbox>
                    <span class="checkout-note">已选中<span class="check-num">{{checkNum}}</span>日志</span>  
                </span>
                <span class="bottom-right">
                    <Button type="success">汇总日志</Button>
                    <Button type="ghost" @click="exportECL">导出EXCEL</Button>
                </span>
            </div>
            <pagination :totalCount="totalCount" @handleChangePage="handleChangePage" :pageSize="pageSize" :pageNo="pageNum" />
        </div>
        <fs-empty-tips v-else :iconType="iconType" :emptyMsg="emptyMsg" />
        <!-- <span v-if="list.length<=0">选择联系人</span> -->
    </div>
</template>
<script>
import Pagination from 'app_component/common/pagination';
import FsEmptyTips from 'app_component/common/empty-tips';
import config from 'app_src/config/config'
export default {
    props: {
        params: { // 暴露的对象字段
            type: Object,
            default: {}
        },
    },
    data(){
        return {
            dataType:0,
            checkNum:0,
            list: [],
            pageNum: 1, 
            pageSize: 20, 
            range: 0,
            totalCount:0,
            iconType:'member',
            emptyMsg:'请选择联系人',
            columnsData:[],//表头
            listTemplate: [],//表内容
        }
    },
    components: {
        Pagination,
        FsEmptyTips,
    },
    watch: {
        params: 'initList',
    },
    methods: {
        handleSelectAll (dataType) {//全选
            if(dataType==1) {
                this.dataType = 0
                this.$refs.selection.selectAll(true);
            } else {
                this.dataType = 1;
                this.$refs.selection.selectAll(false);
            }  
        },
        handleSelectChange(selection){//选项发生变化
            this.checkNum = selection.length;
        },
        handleChangePage(pageNo){//改变页数
            this.pageNum = pageNo;
            this.loadData();
        },
        exportECL(){//导出
            let templateId = this.params.templateId==null?0:this.params.templateId;
            let url = `${config[__ENV__].apiHost}/logger/diaryQuery/exportDiaryStatistics`+'?timestamp='+(new Date()).valueOf()+
            '&beginDate='+this.params.beginDate+'&endDate='+this.params.endDate+'&token='+this.$store.state.userInfo.token+'&templateId='+templateId;
            window.open(url, '_blank');
        },
        updateList(res){
            if(res && res.code === 0) {
                this.list = res.data.list|| [];
                this.totalCount =  this.list.length;
                if(this.list.length<=0){
                    this.iconType = '';
                    this.emptyMsg = '没有相关数据';
                }else{
                    this.listTemplate = [];
                    this.columnsData = [{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '提交时间',
                        key: 'column1'
                    },
                    {
                        title: '提交人',
                        key: 'column2'
                    }];
                    
                    let columnArr = [];
                    try{
                        columnArr = JSON.parse(this.list[0].content)
                    } catch(e){
                    
                    }
                    columnArr.forEach((item, key) => {//循环构建表头
                        let length = this.columnsData.length,
                            columnKey = 'column' + length;
                        let headerColumn = {
                            title: columnArr[key].title || '',
                            key : columnKey
                        }
                        this.columnsData.push(headerColumn);
                    });

                    this.list.forEach((item, key) => {//循环构建表body
                        let contentObj = [];
                        let columnLength = this.columnsData.length; //总列数
                        let data = {
                            column1: this.resetTime(item.createTime),
                            column2: item.userName,
                        };
                        try{
                            contentObj = JSON.parse(item.content);
                        } catch(e){
                            //
                        }
                        let contentLength = contentObj.length; //返回的列数
                        contentObj.forEach((v, k) => {
                            let i = columnLength - contentLength + k;
                            data['column' + i] = v.value || '';
                        });
                        this.listTemplate.push(data);
                    });
                }
                
            } else {
                this.$Message.warning((res && res.msg) || '网络错误');
            }
        },
        resetTime(time){
            var date = new Date(time);  
            var y = date.getFullYear();    
            var m = date.getMonth() + 1;    
            m = m < 10 ? ('0' + m) : m;    
            var d = date.getDate();    
            d = d < 10 ? ('0' + d) : d;    
            var h = date.getHours();  
            h = h < 10 ? ('0' + h) : h;  
            var minute = date.getMinutes();  
            var second = date.getSeconds();  
            minute = minute < 10 ? ('0' + minute) : minute;    
            second = second < 10 ? ('0' + second) : second;   
            return y + '-' + m + '-' + d+' '+h+':'+minute; 
        },
        getParams() {
            var data = Object.assign({
                pageNumber: this.pageNum,
                pageSize: this.pageSize,
                range: this.range,
                memberIds:'',
                deptIds:'',
                teamIds:'',
                templateId:17980,
            }, this.params);
            return data; 
        },
        loadData() {
            let data = this.getParams();
            if(!data.templateId){
                this.$Message.warning('请选择模版');
                return false;
            }else{
                this.$ajax({
                    url: '/logger/diaryQuery/getDiaryStatistics',
                    data: data,
                    success: (res)=>{
                        this.updateList(res);
                    },
                    error: (res)=>{
                        this.$Message.warning((res && res.msg) || '网络错误');
                    }
                })
            } 
        },
        initList() {
            this.pageNum = 1;
            this.loadData();
        }
    },
}
</script>
<style  lang="less">
.content-bar{
    .ivu-table-wrapper{
        border:none;
    }
    .ivu-table{
        height: 500px;
        overflow: auto;
    }
    .ivu-table-cell{
        max-height: 100px;
    }
}
</style>
<style lang="less" scoped>
@import '../../assets/css/var.less';
.logger-summary-content{
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 0px 20px 20px 20px;
    .content-header{
        .note{
            font-size: 12px;
            padding:10px 0px;
            color:@orange-color;
        }
    }
    .content-bottom{
        height: 50px;
        line-height: 50px;
        .bottom-left{
            display: inline-block;
            .checkout-note{
                font-size:12px;
                .check-num{
                    color:@primary-color
                }
            }
        }
        .bottom-right{
            float:right;
        }
    }
    
}

</style>
