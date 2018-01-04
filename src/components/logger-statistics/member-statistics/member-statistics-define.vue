<template>
    <div class="logger-statistics-content">
        <fs-table :columns="columns" :data="list" :type="type"></fs-table>
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
                item.array.length = 31;
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
        isLeapYear(fullyear) { // 判断是否是闰年
            let year = fullyear || (new Date()).getFullYear();
            if (year % 4 == 0 && year % 100 != 0) {
                this.point[1] = 29;
            } else if (year % 400 == 0) {
                this.point[1] = 29;
            } 
        },
        getWeek(day) { // 获取周
            return "日一二三四五六".charAt(new Date(`${this.year}/${this.month}/${day}`).getDay());
        },
        initData() {
            this.columns.title = this.title;

            let date = new Date(this.start.replace('-', '/'));
            this.isLeapYear(date.getFullYear());
            this.year = date.getFullYear();
            this.month = date.getMonth();
            this.columns.array = [];
            for(let i = 0; i < this.point[this.month]; i++) {
                this.columns.array.push(`${i+1} 周${this.getWeek(i+1)}`)
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
