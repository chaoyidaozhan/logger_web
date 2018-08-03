<template>
    <div class="logger-statistics-month">
        <fs-table :columns="columns" :data="list" :totalMap="totalMap" :type="type"></fs-table>
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
        },
        totalMap: {
            type: Object
        }
    },
    data() {
        return {
            columns: {
                title: this.title,
                key: 'deptName',
                array: [],
                caption: this.$t('noun.summary')
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
                if(this.lang === 'en') {
                    let sArr = [ 'date.sun', 'date.mon', 'date.tue', 'date.wed', 'date.thu', 'date.fri', 'date.sat']
                    let date = new Date(`${yearMonth}/${d}`)
                    this.columns.array.push(`${d} ${this.$t(sArr[date.getDay()])}`)
                } else {
                    this.columns.array.push(`${d} 周${getWeek(new Date(`${yearMonth}/${d}`))}`)
                }
            }
        }
    },
    created () {
        this.initData();
    }
}
</script>
