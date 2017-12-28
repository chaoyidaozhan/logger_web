<template>
    <div class="logger-statistics-month">
        <fs-table :columns="columns" :data="list" :type="type"></fs-table>
    </div>
</template>
<script>
import FsTable from '../statistics-table';
import {getMonthNum, getWeek} from 'app_src/filters/date-utils';
export default {
    props: {
        data: {
            type: Array,
            default: []
        },
        type: {
            type: String
        },
        title: {
            type: String
        },
        start: {
            type: String
        }
    },
    data() {
        return {
            columns: {
                title: this.title,
                key: 'deptName',
                array: [],
                caption: '汇总'
            },
        }
    },
    components: {
        FsTable
    },
    computed: {
        list: function () {
            let list = [];
            list = this.data;
            this.data.forEach(item => {
                item.totalCount = 0;
                item.array = [];
                item.array.length = 7;
                if(item.resultList && item.resultList.length) {
                    item.resultList.forEach(val=>{
                        item.array[val.week - 1] = val;
                        item.totalCount += val.num
                    })
                }
            });
            return list;
        }
    },
    watch: {
        start: 'initData',
    },
    methods: {
        initData() {
            this.columns.title = this.title;
            let date = this.start.replace(/[\-*]/g, '/');
            let year = date.substring(0, 4);
            let month = date.substring(date.indexOf('/') + 1, date.lastIndexOf('/'));
            let begin = +date.substring(date.lastIndexOf('/') + 1);
            this.columns.array = [];
            for(let i = begin; i < begin + 7; i++) {
                let monthNum = getMonthNum(new Date(date));
                let d = i;
                let yearMonth = `${year}/${month}`
                if(i > monthNum) {
                    d = i - monthNum;
                    yearMonth = `${year}/${+month + 1}`
                }
                console.log(yearMonth)
                this.columns.array.push(`${d} 周${getWeek(new Date(`${yearMonth}/${d}`))}`)
            }
        }
    },
    created () {
        this.initData();
    }
}
</script>
