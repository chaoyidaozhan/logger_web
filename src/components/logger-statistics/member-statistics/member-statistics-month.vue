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
        totalMap: {
            type: Object
        }
    },
    data() {
        return {
            columns: {
                title: this.title,
                key: 'deptName',
                array: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
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
