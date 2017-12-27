<template>
    <div class="logger-statistics-month">
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
        }
    },
    data() {
        return {
            columns: {
                title: this.title,
                key: 'deptName',
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
            this.columns.title = this.title;
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
