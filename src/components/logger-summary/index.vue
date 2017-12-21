<template>
    <div class ="list-content">
        <div class="content-header">
            <!-- <div class="note">说明：只能查询到最新模板的数据，模板修改前的数据可以导出EXCEL，切换不同sheet进行查看</div> -->
        </div>
        <div class="content-bar">
            <Table border ref="selection" :columns="columnsData" :data="list"  @on-selection-change="handleSelectChange"></Table>
        </div>
        <div class="content-bottom" v-if="this.list.length">
            <span class="bottom-left">
                <Checkbox v-model="dataType" @on-change="handleSelectAll(dataType)">全选</Checkbox>
                已选中<span>{{checkNum}}</span>日志
            </span>
            <span class="bottom-right">
                <Button type="success">汇总日志</Button>
                <Button type="ghost" @click="exportECL">导出EXCEL</Button>
            </span>
        </div>
        <pagination :totalCount="totalCount" @handleChangePage="handleChangePage" :pageSize="pageSize" :pageNo="pageNum" ></pagination>
    </div>
</template>
<script>
import Pagination from 'app_component/common/pagination';
export default {
    props: {
        params: { // 暴露的对象字段
            type: Object,
            default: {}
        },
        // pageNo:{
        //     type: Number,
        //     default: 1
        // }
    },
    data(){
        return {
            dataType:0,
            checkNum:0,
            list: [],
            pageNum: 1, 
            // pageSize: 20, 
            pageSize: 3,
            range: 0,
            loading: false,
            loaderror: false,
            totalCount:0,
            list:[],
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
        Pagination
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
        var url = "/diaryQuery/exportDiaryStatistics?timestamp=" + (new Date()).valueOf() + "&token=" + token + "&templateId=" + id + 
        "&beginDate=" + beginDate + "&endDate=" + endDate + "&deptIds=" + deptIds.join(",") + "&memberIds=" + memberIds.join(",") + "&teamIds=" + teamIds.join(",");
            this.$ajax({
                url: '/diaryQuery/exportDiaryStatistics',
                data: {
                    templateId: this.templateId,
                    beginDate: this.beginDate,
                    endDate: this.endDate,
                    deptIds: this.deptIds,
                    memberIds: this.memberIds,
                    teamIds: this.teamIds
                },
                success: (res)=>{

                },
                error: (res)=>{

                }
            })
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
        getExportParams() {

        },
        loadData() {
            console.log(444)
            this.loading = true;
            this.$ajax({
                url: '/logger/diaryQuery/getDiaryStatistics',
                data: this.getParams(),
                success: (res)=>{
                    this.loading = false;
                    this.updateList(res);
                },
                error: (res)=>{
                    this.list=[];
                    this.loaderror = true;
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
.list-content{
    width: 100%;
    height: 100%;
    background: #fff;
    .content-header{
        .note{
            position: absolute;
            bottom:20px;
            font-size: 12px;
            color: rgb(255, 181, 94);
        }
    }
    .content-bar{
        .ivu-table-wrapper{
            border:none;
        }
    }
    .content-bottom{
        height: 50px;
        line-height: 50px;
        .bottom-left{
            display: inline-block;
        }
        .bottom-right{
            float:right;
        }
    }
    
}

</style>
