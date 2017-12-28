<template>
    <div class="logger-statistics" ref="loggerStatisticsWrapper">
        <!--按日统计-->
        <template v-if="params.orderType == 4">
            <fs-month-picker @handleChangeDate="handleChangeDate"/>
            <fs-member-statistics-day
                v-if="start"
                :data="list"
                :type="type"
                :start="start"
                :title="title"/>
        </template>
        <!--按周统计-->
        <template v-if="params.orderType == 2">
            <fs-week-picker @handleChangeDate="handleChangeDate"/>
            <fs-member-statistics-week
                v-if="start"
                :data="list"
                :type="type"
                :start="start"
                :title="title"/>
        </template>
        <!--按月统计-->
        <template v-if="params.orderType == 0">
            <fs-year-picker @handleChangeDate="handleChangeDate"/>
            <fs-member-statistics-month
                v-if="start"
                :data="list"
                :type="type"
                :start="start"
                :title="title"/>
        </template>

    </div>
</template>
<script>
import FsYearPicker from 'app_component/common/picker/year';
import FsMemberStatisticsMonth from './member-statistics-month';

import FsMonthPicker from 'app_component/common/picker/month';
import FsMemberStatisticsDay from './member-statistics-day';

import FsWeekPicker from 'app_component/common/picker/week';
import FsMemberStatisticsWeek from './member-statistics-week';
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
            start: '', // 开始时间
            end: '',  // 结束时间,
            timer: null
        }
    },
    components: {
        FsYearPicker,
        FsMemberStatisticsMonth,
        
        FsMonthPicker,
        FsMemberStatisticsDay,
        
        FsWeekPicker,
        FsMemberStatisticsWeek
    },
    watch: {
        params: 'handleChangeDate'
    },
    methods: {
        handleChangeDate({month, beiginDate, endDate}) {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                if(beiginDate) {
                    this.start = beiginDate || '';
                    this.end = endDate || '';
                }
                // if(this.params.memberIds) {
                    this.loadData();
                // }
            }, 200);
        },
        getParams() { // 获取参数
            return Object.assign({
                start : this.start
            }, this.params);
        },
        loadData() {
            console.log(this.start)
            this.$ajax({
                url: '/logger/diaryQuery/getUsersStatisticsByCondition',
                data: this.getParams(),
                success: (res)=>{
                    if(res && res.code === 0) {
                        this.list = res.data.resultList;
                        console.log(this.list)
                    }
                },
                error: (res)=>{
                    this.$Message.error(res && res.msg || '网络错误');
                }
            })
        }
    },
    destroyed () {
        clearTimeout(this.timer);
    }
}
</script>

