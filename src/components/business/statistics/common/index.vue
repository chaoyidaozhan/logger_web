<template>
    <div class="logger-statistics"  ref="loggerStatisticsWrapper">
        <fs-month-picker v-if="params.orderType == 4" @handleChangeDate="handleChangeDateMonth"/>
        <fs-year-picker v-else @handleChangeDate="handleChangeDate"/>
        <!--按日统计统计-->
        <fs-statistics-day 
            :data="list"
            :type="type"
            :title="title"
            :emptyData="emptyData"
            :start="start"
            :totalMap="totalMap"
            v-loading="{loading: loaded, text: $t('status.loading')}"
            v-if="start && params.orderType == 4"/>
        <!--月份统计-->
        <fs-statistics-month 
            :data="list"
            :type="type"
            :title="title"
            :emptyData="emptyData"
            v-loading="{loading: loaded, text: $t('status.loading')}"
            v-if="params.orderType == 0"/>
        <!--季度统计-->
        <fs-statistics-season  
            :data="list"
            :type="type"
            :title="title"
            :emptyData="emptyData"
            v-loading="{loading: loaded, text: $t('status.loading')}"
            v-if="params.orderType == 1"/>
        <pagination :totalCount="totalCount" @handleChangePage="handleChangePage" :pageSize="pageSize" :pageNo="pageNo" />
        <fs-modal-table 
            @handleCancel="handleCancel"
            :orderType="params.orderType"
            :years="years"
            :start="start"
            :templateId="params.templateId"
            :modalParams="modalParams"
            :showModal="showModal" />
    </div>
</template>
<script>
import FsYearPicker from 'app_component/common/picker/year'
import FsMonthPicker from 'app_component/common/picker/month'
import Pagination from 'app_component/common/pagination'
import FsStatisticsDay from './day'
import FsStatisticsMonth from './month'
import FsStatisticsSeason from './season'
import FsModalTable from '../modal-table'
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
            modalParams: {},
            totalMap: null,
            start: '', // 开始时间
            end: '',  // 结束时间,
        }
    },
    components: {
        FsYearPicker,
        FsMonthPicker,
        FsStatisticsDay,
        FsStatisticsMonth,
        FsStatisticsSeason,
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
                if(this.params.deptIds || this.params.groupIds || this.params.memberIds) {
                    this.loadData();
                } 
                this.$eventbus.$emit('getYear', this.years);
            }, 200);
        },
        handleChangeDateMonth({month, beginDate, year}) { // 切换按日统计
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.pageNo = 1;
                if(beginDate) {
                    this.start = beginDate || '';
                }
                if(year) {
                    this.years = year || (new Date()).getFullYear();
                }
                if(this.params.memberIds) {
                    this.loadData();
                } 
                this.$eventbus.$emit('getStartEndTime', {
                    start: this.start
                });
            }, 200);
        },
        handleChangePage(index) { // 分页
            this.pageNo = index;
            this.loadData();
        },
        getParams() { // 获取参数
            let params = {
                pageSize: this.pageSize,
                pageNo: this.pageNo
            }
            if(this.years) {
                params.years = this.years;
            }
            if(this.start) {
                params.start = this.start;
            }
            return Object.assign(params, this.params);
        },
        loadData() {
            this.loaded = false;
            this.$ajax({
                url: '/diaryQuery/getStatisticsByCondition',
                data: this.getParams(),
                success: (res)=>{
                    if(res && res.code === 0) {
                        this.list = res.data || [];
                        if(res.data && res.data.length) {
                            this.totalCount = res.data[0].totalCount || 0
                            this.emptyData = false;
                        } else {
                            this.totalCount = 0;
                            this.emptyData = true;
                        }
                    } else {
                        this.list = [];
                        this.emptyData = true;
                    }
                    this.loaded = true;
                },
                error: (res)=>{
                    this.loaded = true;
                    this.list = [];
                    this.$YYMessage.error(res && res.msg || this.$t('status.networkError'));
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
            this.modalParams = data;
            this.showModal = true
        })  
    },
    destroyed () {
        this.$eventbus.$off('handleModal');
        this.$eventbus.$off('getYear');
        clearTimeout(this.timer);
    }
}
</script>


