<template>
    <div class="logger-statistics" ref="loggerStatisticsWrapper">
        <fs-year-picker @handleChangeDate="handleChangeDate"/>
        <!--月份统计-->
        <fs-logger-statistics-month 
            :data="list"
            :type="type"
            :title="title"
            v-if="params.orderType == 0"/>
        <!--季度统计-->
        <fs-logger-statistics-season  
            :data="list"
            :type="type"
            :title="title"
            v-if="params.orderType == 1"/>
    </div>
</template>
<script>
import FsYearPicker from 'app_component/common/picker/year';
import FsLoggerStatisticsMonth from './logger-statistics-month';
import FsLoggerStatisticsSeason from './logger-statistics-season';
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
            years: (new Date()).getFullYear()
        }
    },
    components: {
        FsYearPicker,
        FsLoggerStatisticsMonth,
        FsLoggerStatisticsSeason,
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
                years : this.years
            }, this.params);
        },
        loadData() {
            this.$ajax({
                url: '/logger/diaryQuery/getStatisticsByCondition',
                data: this.getParams(),
                success: (res)=>{
                    if(res && res.code === 0) {
                        this.list = res.data;
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

