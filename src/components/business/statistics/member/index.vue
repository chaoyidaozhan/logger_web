<template>
    <div class="logger-statistics" ref="loggerStatisticsWrapper" v-if="type == 'member'">
        <!--按日统计-->
        <template v-if="params.orderType == 4">
            <fs-month-picker @handleChangeDate="handleChangeDate" :originData="originData"/>
            <fs-member-statistics-day
                v-if="start"
                :data="list"
                :type="type"
                :start="start"
                v-loading="{loading: loaded, text: $t('status.loading')}"
                :totalMap="totalMap"
                :title="title"/>
        </template>
        <!--按周统计-->
        <template v-if="params.orderType == 2">
            <fs-week-picker @handleChangeDate="handleChangeDate" :originData="originData"/>
            <fs-member-statistics-week
                v-if="start"
                :data="list"
                :type="type"
                :start="start"
                v-loading="{loading: loaded, text: $t('status.loading')}"
                :totalMap="totalMap"
                :title="title"/>
        </template>
        <!--按月统计-->
        <template v-if="params.orderType == 0">
            <fs-year-picker @handleChangeDate="handleChangeDate" :originData="originData"/>
            <fs-member-statistics-month
                v-if="start"
                :data="list"
                :type="type"
                :start="start"
                :totalMap="totalMap"
                v-loading="{loading: loaded, text: $t('status.loading')}"
                :title="title"/>
        </template>
        <!--自定义统计-->
        <template v-if="params.orderType == 3">
            <fs-define-picker 
                :minDate="minDate"
                :maxDate="maxDate"
                :originData="originData"
                @handleChangeDate="handleChangeDate"/>
            <fs-member-statistics-define
                v-if="start && end"
                :data="list"
                :type="type"
                :start="start"
                :end="end"
                :totalMap="totalMap"
                v-loading="{loading: loaded, text: $t('status.loading')}"
                :title="title"/>
        </template>
        <pagination :totalCount="totalCount" @handleChangePage="handleChangePage" :pageSize="pageSize" :pageNo="pageNo" />
    </div>
</template>
<script>
import FsYearPicker from 'app_component/common/picker/year'
import FsMemberStatisticsMonth from './month'

import FsMonthPicker from 'app_component/common/picker/month'
import FsMemberStatisticsDay from './day'

import FsWeekPicker from 'app_component/common/picker/week'
import FsMemberStatisticsWeek from './week'

import FsDefinePicker from 'app_component/common/picker/define'
import FsMemberStatisticsDefine from './define'
import Pagination from 'app_component/common/pagination'
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
        minDate: {
            type: String,
        },
        maxDate: {
            type: String,
        },
        type: {
            type: String
        },
        title: {
            type: String,
            default: function() {
                return this.$t('noun.name')
            }
        }
    },
    data() {
        return {
            list: [],
            totalMap: null,
            start: '', // 开始时间
            end: '',  // 结束时间,
            timer: null,
            totalCount: 0,
            pageSize: 50,
            pageNo: 1,
            loaded: true,
            originData: {}
        }
    },
    components: {
        FsYearPicker,
        FsMemberStatisticsMonth,
        
        FsMonthPicker,
        FsMemberStatisticsDay,
        
        FsWeekPicker,
        FsMemberStatisticsWeek,

        FsDefinePicker,
        FsMemberStatisticsDefine,

        Pagination
    },
    watch: {
        params: 'handleChangeDate'
    },
    methods: {
        handleChangeDate({month, beginDate, endDate}) {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.pageNo = 1;
                if(beginDate) {
                    this.start = beginDate || '';
                    this.end = endDate || '';
                }
                if(this.params.memberIds || this.params.groupIds || this.params.deptIds) {
                    this.loadData();
                } 
                this.$eventbus.$emit('getStartEndTime', {
                    start: this.start,
                    end: this.end
                });
            }, 200);
        },
        handleChangePage(index) {
            this.pageNo = index;
            this.loadData();
        },
        getParams() { // 获取参数
            return Object.assign({
                start : this.start,
                end: this.end,
                pageSize: this.pageSize,
                pageNo: this.pageNo
            }, this.params);
        },
        loadData() {
            this.loaded = false;
            this.$ajax({
                url: '/diaryQuery/getUsersStatisticsByCondition',
                data: this.getParams(),
                success: (res)=>{
                    if(res && res.code === 0) {
                        this.list = res.data.resultList || [];
                        let keys = Object.keys(res.data.totalMap || {});
                        this.totalCount = res.data.totalCount || 0;
                        if(keys && keys.length) {
                            res.data.totalMap.total = 0
                            keys.forEach(key=>{
                                res.data.totalMap.total += res.data.totalMap[key];
                            })
                        }
                        this.totalMap = res.data.totalMap || {};
                        this.originData = res.data;
                    }
                    this.loaded = true;
                },
                error: (res)=>{
                    this.$YYMessage.error(res && res.msg || $t('status.networkError'));
                    this.loaded = true;
                }
            })
        }
    },
    destroyed () {
        clearTimeout(this.timer);
        this.$eventbus.$off('getStartEndTime');
    }
}
</script>
<style lang="less">
.logger-statistics-content {
    position: relative;
}
</style>

