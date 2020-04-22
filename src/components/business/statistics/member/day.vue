<template>
    <div class="logger-statistics-content">
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
                item.array.length = getMonthNum(new Date(this.start.replace(/\-/g, '/')));
                if(item.resultList && item.resultList.length) {
                    item.resultList.forEach(val=>{
                        item.array[val.days - 1] = val;
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
            let yearMonth = date.substring(0, date.lastIndexOf('/'));
            this.columns.array = [];
            for(let i = 0; i < getMonthNum(new Date(date)); i++) {
                if(this.lang === 'en') {
                    let sArr = [ 'date.sun', 'date.mon', 'date.tue', 'date.wed', 'date.thu', 'date.fri', 'date.sat']
                    let date = new Date(`${yearMonth}/${i+1}`)
                    this.columns.array.push(`${i+1} ${this.$t(sArr[date.getDay()])}`)
                } else {
                    this.columns.array.push(`${i+1} ${this.$t('date.w')}${getWeek(new Date(`${yearMonth}/${i+1}`))}`)
                }
            }
        }
    },
    created () {
        this.initData();
    }
}
</script>
