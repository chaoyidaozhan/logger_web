<template>
    <div class="logger-statistics" ref="loggerStatisticsWrapper">
        <!-- <fs-year-picker @handleChangeDate="handleChangeDate"/> -->
        <fs-month-picker @handleChangeDate="handleChangeDate"/>
        
        <!--月份统计-->
        <fs-member-statistics-day
            :data="list"
            :type="type"
            :start="start"
            :title="title"
            v-if="params.orderType == 4"/>
      
    </div>
</template>
<script>
import FsYearPicker from 'app_component/common/picker/year';
import FsMonthPicker from 'app_component/common/picker/month';
import FsMemberStatisticsMonth from './member-statistics-month';
import FsMemberStatisticsDay from './member-statistics-day';
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
            start: '2017-12-10',
            end: ''
        }
    },
    components: {
        FsYearPicker,
        FsMonthPicker,
        FsMemberStatisticsMonth,
        FsMemberStatisticsDay,
    },
    watch: {
        params: 'loadData'
    },
    methods: {
        handleChangeDate(date) {
            this.years = date || (new Date()).getFullYear();
            this.loadData();
        },
        getParams() { // 获取参数
            return Object.assign({
                start : this.start
            }, this.params);
        },
        loadData() {
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
                    this.list = []
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.logger-statistics {
    padding: 0 20px;
    width: 100%;
    height: 100%;
}
</style>

