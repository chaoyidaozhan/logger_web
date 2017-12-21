<template>
    <div class="logger-statistics-month">
        <fs-table :columns="columns" :data="list" :type="type"></fs-table>
    </div>
</template>
<script>
import FsTable from './logger-statistics-table';
export default {
    props: {
        data: {
            type: Array,
            default: []
        },
        type: {
            type: String
        }
    },
    data() {
        return {
            columns: {
                title: '部门名称',
                array: ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
                caption: '汇总'
            }
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
                item.array.length = 12;
                if(item.resultList && item.resultList.length) {
                    item.resultList.forEach(val=>{
                        item.array[val.MONTH - 1] = val;
                        item.totalCount += val.num
                    })
                }
            });
            return list;
        }
    },
    methods: {
        init() {
            if(this.type == 'depart') {
                this.columns.title = '部门名称'
            }
            if(this.type == 'group') {
                this.columns.title = '团队名称'
            }
        }
    },
    created () {
        this.init()
    }
}
</script>
<style lang="less" scoped>
.logger-statistics-month {
    height: 100%;
}
</style>
