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
                array: [
                    this.$t('date.january'),
                    this.$t('date.february'),
                    this.$t('date.march'),
                    this.$t('date.april'),
                    this.$t('date.may'),
                    this.$t('date.june'),
                    this.$t('date.july'),
                    this.$t('date.august'),
                    this.$t('date.september'),
                    this.$t('date.october'),
                    this.$t('date.november'),
                    this.$t('date.december'),
                ],
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
