<template>
    <div>
        <Modal 
            class-name="modal-table"
            :width="800"
            :mask-closable="false"
            v-model="openModal"
            @on-cancel="handleCancel">
            <div class="modal-table-header clearfix" slot="header">
                <div class="pull-left">
                    <fs-select-order-type 
                        v-if="showModal" 
                        :defaultType="type"
                        :multi="showOrderTypeMulti"
                        @handleSelectOrderType="handleSelectOrderType"/>
                </div>
                <div class="middle">
                    {{modalParams.groupId ? '内部群统计' : '部门统计'}}
                </div>
                <div class="pull-right" @click="exportExcel">
                    <Button type="primary">导出</Button>
                </div>
            </div>
            <div>
                <fs-table :emptyData="emptyData" :refuse="true" :columns="columns" :data="list" :type="typeName"></fs-table>
                <pagination :totalCount="totalCount" @handleChangePage="handleChangePage" :pageSize="pageSize" :pageNo="pageNo" />
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
import FsTable from './statistics-table';
import Pagination from 'app_component/common/pagination';
import FsSelectOrderType from 'app_component/common/select-order-type/';
import config from 'app_src/config/config';
import {getMonthNum, getWeek} from 'app_src/filters/date-utils';

export default {
    props: {
        showModal: {
            type: Boolean
        },
        modalParams: {
            type: Object
        },
        templateId: {
            type: String | Number
        },
        years: {
            type: String | Number
        },
        orderType: {
            type: Number | String
        },
        start: {
            type: String
        }
    },
    data() {
        return {
            data: [],
            columns: {
                title: '人员名称',
                array: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                caption: '汇总'
            },
            mArray: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            sArray: ['一季度','二季度','三季度','四季度'],
            type: '0',
            typeName: 'member',
            totalCount: 0,
            pageSize: 7,
            pageNo: 1,
            openModal: false,
            emptyData: false,
            showOrderTypeMulti: null
        }
    },
    components: {
        FsTable,
        Pagination,
        FsSelectOrderType
    },
    computed: {
        list: function () { // 数据处理
            let list = [];
            list = this.data;
            this.data.forEach(item => {
                item.totalCount = 0;
                item.array = [];

                switch (this.type) {
                    case 0:
                        item.array.length = 12;
                        break;
                    case 1:
                        item.array.length = 4;
                        break;
                    case 4:
                        item.array.length = getMonthNum(new Date(this.start.replace('-', '/')));
                        break;
                }
                
                if(item.userName && typeof item.userName == 'object') {
                    let userInfo = item.userName;
                    item.userName = userInfo.userName;
                    item.memberId = userInfo.memberId;
                }

                if(item.resultList && item.resultList.length) {
                    item.resultList.forEach(val=>{
                        if(this.type == 1) {
                            item.array[val.quarter - 1] = val;
                        } else if(this.type == 0){
                            item.array[+val.MONTH - 1] = val;
                        } else {
                            item.array[+val.days - 1] = val;
                        }
                        item.totalCount += val.num;
                    })
                }
            });
            return list;
        }
    },
    watch: {
        showModal: 'watchShowModal'
    },
    methods: {
        setColumnsArray() { // 当前属于季度1、月份0、日4
            if(this.type == 1) {
                this.columns.array=this.sArray;
            } else if(this.type == 0){
                this.columns.array=this.mArray;
            } else {
                this.sortByDaily();
            }
        },
        sortByDaily() { // 按日统计
            let date = this.start.replace(/[\-*]/g, '/'),
                yearMonth = date.substring(0, date.lastIndexOf('/'));
            this.columns.array = [];
            for (let i = 0; i < getMonthNum(new Date(date)); i++) {
                this.columns.array.push(`${i+1} 周${getWeek(new Date(`${yearMonth}/${i+1}`))}`)
            }
        },
        handleSelectOrderType(orderType) { // 切换季度
            this.type = orderType;
            this.setColumnsArray();
            this.loadData();
        },
        handleChangePage(index) { // 分页
            this.pageNo = index;
            this.loadData();
        },
        watchShowModal() { // 打开关闭弹出框
            this.openModal = this.showModal;
            this.type = +this.orderType;
            if(this.showModal) {
                this.loadData();
            }
        },
        handleCancel() { // 关闭弹窗
            this.$emit('handleCancel')
        },
        loadData() { // 加载数据
            this.setColumnsArray();
            let params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                years: this.years,
                orderType: this.type,
                start: this.start || "" // 仅按人员统计需要
            }
            params.templateId = this.templateId || 0;
            if(this.modalParams.groupId) {
                params.groupId = this.modalParams.groupId;
            }
            if(this.modalParams.deptId != undefined) {
                params.deptId = this.modalParams.deptId;
            }
            this.$ajax({
                url: '/diaryQuery/getUserStatisticsByCondition',
                data: params,
                success: (res)=>{
                    if(res && res.code === 0) {
                        this.data = res.data.resultList || [];
                        this.totalCount = res.data.totalRows || 0;
                        if(res.data && res.data.length) {
                            this.emptyData = false;
                        } else {
                            this.emptyData = true;
                        }
                    }
                },
                error: (res)=>{
                    this.$Message.error(res && res.msg || '网络错误');
                }
            })
        },
        exportExcel() { // 导出数据
            let data = {
                templateId: this.templateId || 0,
                orderType: this.type,
                years: this.years,
                deptId: this.modalParams.deptId,
                groupId: this.modalParams.groupId,
                start: this.start || ""
            };
            let deptOrGroupId = data.deptId !== undefined
                              ? `deptId=${data.deptId}`
                              : `groupId=${data.groupId}`;
            let url = `${config[__ENV__].apiHost}/diaryQuery/exportExcelIncludeUserStatisticsByCondition?token=${this.$store.state.userInfo.token}&timestamp=${new Date().getTime()}&orderType=${data.orderType}&${deptOrGroupId}&templateId=${data.templateId}&years=${data.years}&start=${data.start}`;
            window.open(url);
        }
    },
    created () {
        if(this.$route.path.indexOf("StatisticsOfGroup") !== -1) {
            this.showOrderTypeMulti = 'group';
        }else {
            this.showOrderTypeMulti = 'dept';
        }
    }
}
</script>
<style lang="less">
.modal-table {
    .ivu-modal-close {
        z-index: 20;
        padding: 0 10px;
    }
    .ivu-modal-body {
        padding: 0 0 40px 0;
        min-height: 360px;
    }
    .ivu-modal-footer {
        display: none;
    }
    .ivu-modal-header {
        padding: 6px;
    }
    .modal-table-header {
        position: relative;
        .pull-left {
            width: 200px;
        }
        .middle {
            font-size: 14px;
            width: 200px;
            position: absolute;
            left: 50%;
            line-height: 32px;
            margin-left: -100px;
            text-align: center;
        }
        .pull-right {
            width: 200px;
            text-align: right;
            padding-right: 60px;
        }
    }
}
</style>
