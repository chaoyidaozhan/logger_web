<template>
    <div class = "listContent">
        <div class="contentHeader">
            <Col span="4" v-if="showTemplate">
                <fs-select-template  ref="selectTemplate"></fs-select-template>
            </Col>
            <Col span="4" v-if="showDatePicker">
                <fs-select-date ref="selectDate"></fs-select-date>
            </Col>
            <Button type="ghost" @click="searchData">查询</Button>
            <div class="note">说明：只能查询到最新模板的数据，模板修改前的数据可以导出EXCEL，切换不同sheet进行查看</div>
        </div>
        <div class="contentBar">
            <Table border ref="selection" :columns="columnsData" :data="dataList" @on-select="handleSelect" @on-selection-change="handleSelectChange"></Table>
        </div>
        <div class="contentBottom">
            <span class="bottomLeft">
               已选中<span v-html ="checkNum"></span>日志
                <input type="checkbox" :data-type="dataType" class="" @click="handleSelectAll(dataType)">
                全选
            </span>
            <span class="bottomRight">
                <Button type="success">汇总日志</Button>
                <Button type="ghost">导出EXCEL</Button>
            </span>
           
        </div>
    </div>
</template>
<script>
import FsSelectTemplate from 'app_component/common/select-template';
import FsSelectDate from 'app_component/common/select-date';
export default {
    components: {
        FsSelectTemplate,FsSelectDate
    },
    props: {
        showTemplate: {
            type: Boolean,
            default: true
        },
        showDatePicker: {
            type: Boolean,
            default: true
        },
    },
    data(){
        return {
            dataType:0,
            checkNum:0,
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
            dataList: [
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
    methods: {
        handleSelectAll (dataType) {//全选
            if(dataType==1){
                this.dataType = 0
                this.$refs.selection.selectAll(false);
            }else{
                this.dataType = 1;
                this.$refs.selection.selectAll(true);
            }  
        },
        handleSelect(selection){
            console.log(11,selection)
        },
        handleSelectChange(selection){//选项发生变化
            this.checkNum = selection.length;
            console.log(222,selection)

        },
        searchData(){
            
        }
        

    },
    created(){

    }

}
</script>
<style lang="less" scoped>
.listContent{
    width: 100%;
    height: 100%;
    background: #fff;
    .contentHeader{
        height:100px;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        position: relative;
        .note{
            position: absolute;
            bottom:20px;
            font-size: 12px;
            color: rgb(255, 181, 94);
        }
    }
    .contentBar{
        .ivu-table-wrapper{
            border:none;
        }
    }
    .contentBottom{
        height: 50px;
        line-height: 50px;
        .bottomLeft{
            display: inline-block;
        }
        .bottomRight{
            float:right;
        }
    }
    
}

</style>
