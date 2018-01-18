<template>
    <div class="logger-statistics"  ref="loggerStatisticsWrapper">
        <fs-year-picker @handleChangeDate="handleChangeDate"/>
        <!--月份统计-->
        <fs-logger-statistics-month 
            :data="list"
            :type="type"
            :title="title"
            :emptyData="emptyData"
            v-loading="{loading: loaded, text: '加载中...'}"
            v-if="params.orderType == 0"/>
        <!--季度统计-->
        <fs-logger-statistics-season  
            :data="list"
            :type="type"
            :title="title"
            :emptyData="emptyData"
            v-loading="{loading: loaded, text: '加载中...'}"
            v-if="params.orderType == 1"/>
        <pagination :totalCount="totalCount" @handleChangePage="handleChangePage" :pageSize="pageSize" :pageNo="pageNo" />
        <fs-modal-table 
            @handleCancel="handleCancel"
            :orderType="params.orderType"
            :years="years"
            :templateId="params.templateId"
            :modalParams="modalParams"
            :showModal="showModal" />
    </div>
</template>
<script>
import FsYearPicker from 'app_component/common/picker/year';
import FsLoggerStatisticsMonth from './logger-statistics-month';
import FsLoggerStatisticsSeason from './logger-statistics-season';
import Pagination from 'app_component/common/pagination';
import FsModalTable from '../modal-table';
export default {
    props: {
        params: { // 暴露的对象字段
            type: Object,
            default() {
                return {
                    orderType: '0',
                }
            }
        },
        type: {
            type: String
        },
        title: {
            type: String,
            default: '名称'
        }
    },
    data() {
        return {
            list: [],
            years: (new Date()).getFullYear(),
            timer: null,
            pageSize: 20,
            pageNo: 1,
            totalCount: 0,
            loaded: true,
            emptyData: false,
            showModal: false,
            modalParams: {}
        }
    },
    components: {
        FsYearPicker,
        FsLoggerStatisticsMonth,
        FsLoggerStatisticsSeason,
        Pagination,
        FsModalTable
    },
    watch: {
        params: 'handleChangeDate'
    },
    methods: {
        handleChangeDate({year}) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.pageNo = 1;
                if(year) {
                    this.years = year || (new Date()).getFullYear();
                }
                if(this.params.deptId || this.params.groupId) {
                    this.loadData();
                } 
            }, 200);
        },
        handleChangePage(index) {
            this.pageNo = index;
            this.loadData();
        },
        getParams() { // 获取参数
            return Object.assign({
                years: this.years,
                pageSize: this.pageSize,
                pageNo: this.pageNo
            }, this.params);
        },
        loadData() {
            this.loaded = false;
            this.$ajax({
                url: '/logger/diaryQuery/getStatisticsByCondition',
                data: this.getParams(),
                success: (res)=>{
                    if(res && res.code === 0) {
                        this.list = res.data;
                        if(res.data && res.data.length) {
                            this.totalCount = res.data[0].totalCount || 0
                            this.emptyData = false;
                        } else {
                            this.totalCount = 0;
                            this.emptyData = true;
                        }
                    }
                    this.loaded = true;
                },
                error: (res)=>{
                    this.loaded = true;
                    this.$Message.error(res && res.msg || '网络错误');
                }
            })
        },
        handleCancel() {
            this.modalParams = {}
            this.showModal = false
        }
    },
    mounted () {
        this.$eventbus.$off('handleModal').$on('handleModal', (data)=>{
            console.log(data)
            this.modalParams = data;
            this.showModal = true
        })  
    },
    destroyed () {
        this.$eventbus.$off('handleModal');
        clearTimeout(this.timer);
    }
}
</script>


