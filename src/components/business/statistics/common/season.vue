<template>
    <div class="logger-statistics-content">
        <fs-table :emptyData="emptyData" :columns="columns" :data="list" :type="type"></fs-table>
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
                array: [this.$t('date.firstQuarter'),
                        this.$t('date.secondQuarter'),
                        this.$t('date.thirdQuarter'),
                        this.$t('date.fourthQuarter')],
                caption: this.$t('noun.summary')
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
    watch: {
        title(newValue) {
            this.columns.title = newValue;
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
