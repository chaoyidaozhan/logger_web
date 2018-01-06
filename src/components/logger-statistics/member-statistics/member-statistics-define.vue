<template>
    <div class="logger-statistics-content">
        <fs-table :columns="columns" :data="list" :totalMap="totalMap" :type="type"></fs-table>
    </div>
</template>
<script>
import FsTable from '../statistics-table';
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
        end: {
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
                array: ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
                caption: '汇总'
            },
            point: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30 ,31], // 对应每月天数,
            month: 11,
            yearMonth: '2017-12'
        }
    },
    components: {
        FsTable
    },
    computed: {
        list: function () {
            this.initData();
            let list = [];
            list = this.data;
            this.data.forEach(item => {
                item.totalCount = 0;
                item.array = [];
                let start = new Date(this.start).valueOf();
                let end = new Date(this.end).valueOf();
                let len = (end - start)/86400000 < 6 ? 6 : (end - start)/86400000
                item.array.length = len+1;
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
    methods: {
        getWeek(date) { // 获取周
            return "日一二三四五六".charAt(new Date(date).getDay());
        },
        initData() {
            this.columns.title = this.title;

            let start = new Date(this.start).valueOf();
            let end = new Date(this.end).valueOf();
            this.columns.array = [];
            let len = (end - start)/86400000 < 6 ? 6 : (end - start)/86400000;
            for(let i = 0; i <= len; i++) {
                let day = start + 86400000 * i;
                this.columns.array.push(`${new Date(day).getDate()} 周${this.getWeek(day)}`)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.logger-statistics-month {
    height: 100%;
}
</style>
