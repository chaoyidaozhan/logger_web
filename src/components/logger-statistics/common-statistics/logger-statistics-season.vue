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
        emptyData: {
            type: Boolean
        }
    },
    data() {
        return {
            columns: {
                title: this.title,
                array: ['一季度','二季度','三季度','四季度'],
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
                item.array.length = 4;
                if(item.resultList && item.resultList.length) {
                    item.resultList.forEach(val=>{
                        item.array[val.quarter - 1] = val
                        item.totalCount += val.num
                    })
                }
            });
            return list;
        },
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
