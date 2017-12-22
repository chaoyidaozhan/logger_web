<template>
    <div class ="logger-summary-content">
        <div class="content-header">
            <div class="note">说明：只能查询到最新模板的数据，模板修改前的数据可以导出EXCEL，切换不同sheet进行查看</div>
        </div>
        <div v-if="list.length">
            <div class="content-bar">
                <Table border ref="selection" :columns="columnsData" :data="list"  @on-selection-change="handleSelectChange"></Table>
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
        <fs-empty-tips v-else  />
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
            list:[],
            exportUrl:'',
            columnsData: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '提交时间',
                    key: 'subTime'
                },
                {
                    title: '提交人',
                    key: 'subPeo'
                },
                {
                    title: '文本输入框',
                    key: 'txtInput'
                },
                {
                    title: '数字输入框',
                    key: 'numInput'
                },
                {
                    title: '今日工作内容',
                    key: 'workContent'
                },
                {
                    title: '单选框',
                    key: 'radioCheckbox'
                },
                {
                    title: '日期',
                    key: 'date'
                },
                {
                    title: '所得金额',
                    key: 'price'
                }

            ],
            listTest: [
                {
                    subTime:'2016-10-03',
                    subPeo: 'John Brown',
                    txtInput:'haha',
                    numInput:'444',
                    workContent:'能否哈哈哈哈',
                    radioCheckbox:'红',
                    date: '2016-10-03',
                    price:'123'
                },
                {
                    subTime:'2016-10-03',
                    subPeo: 'John Brown',
                    txtInput:'haha',
                    numInput:'444',
                    workContent:'能否哈哈哈哈',
                    radioCheckbox:'红',
                    date: '2016-10-03',
                    price:'123'
                },
                {
                    subTime:'2016-10-03',
                    subPeo: 'John Brown',
                    txtInput:'haha',
                    numInput:'444',
                    workContent:'能否哈哈哈哈',
                    radioCheckbox:'红',
                    date: '2016-10-03',
                    price:'123'
                },
                {
                    subTime:'2016-10-03',
                    subPeo: 'John Brown',
                    txtInput:'haha',
                    numInput:'444',
                    workContent:'能否哈哈哈哈',
                    radioCheckbox:'红',
                    date: '2016-10-03',
                    price:'123'
                },
                {
                    subTime:'2016-10-03',
                    subPeo: 'John Brown',
                    txtInput:'haha',
                    numInput:'444',
                    workContent:'能否哈哈哈哈',
                    radioCheckbox:'红',
                    date: '2016-10-03',
                    price:'123'
                },
                {
                    subTime:'2016-10-03',
                    subPeo: 'John Brown',
                    txtInput:'haha',
                    numInput:'444',
                    workContent:'能否哈哈哈哈',
                    radioCheckbox:'红',
                    date: '2016-10-03',
                    price:'123'
                },
                {
                    subTime:'2016-10-03',
                    subPeo: 'John Brown',
                    txtInput:'haha',
                    numInput:'444',
                    workContent:'能否哈哈哈哈',
                    radioCheckbox:'红',
                    date: '2016-10-03',
                    price:'123'
                },
                
            ]
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
        handleChangePage(pageNo){
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
                // this.list = res.data || [];
                this.list = this.listTest;
                this.totalCount =  this.list.length;
            } else {
                this.list = [];
                this.$Message.warning((res && res.msg) || '网络错误');
            }
        },
        getParams() {
            var data = Object.assign({
                pageNumber: this.pageNum,
                pageSize: this.pageSize,
                range: this.range,
                memberIds:'',
                deptIds:'',
                teamIds:'',
            }, this.params);
            data.templateId==null?data.templateId=0:data.templateId;
            return data;
        },
        loadData() {
            this.$ajax({
                url: '/logger/diaryQuery/getDiaryStatistics',
                data: this.getParams(),
                success: (res)=>{
                    this.updateList(res);
                },
                error: (res)=>{
                    this.$Message.warning((res && res.msg) || '网络错误');
                }
            })
        },
        initList() {
            this.list = [];
            this.pageNum = 1;
            this.loadData();
        }
    },
}
</script>
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
    .content-bar{
        .ivu-table-wrapper{
            border:none;
        }
        .ivu-table-border th, .ivu-table-border td{
            border-right:none!important;
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
