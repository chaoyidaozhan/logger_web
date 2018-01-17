<template>
    <div>
        <fs-table :emptyData="emptyData" :columns="columns" :data="list" :type="type"></fs-table>
        <pagination :totalCount="totalCount" @handleChangePage="handleChangePage" :pageSize="pageSize" :pageNo="pageNo" />
    </div>
</template>
<script>
import FsTable from './statistics-table';
import Pagination from 'app_component/common/pagination';

export default {
    props: {
        templateId: {
            type: String
        },
        groupId: {
            type: String
        },
        deptId: {
            type: String
        },
        year: {
            type: String
        },
        orderType: {
            type: String
        },
    },
    data() {
        return {
            data: [],
            columns: {
                title: this.title,
                key: 'deptName',
                array: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                caption: '汇总'
            },
            mArray: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            sArray: ['一季度','二季度','三季度','四季度'],
            type: '0',
            totalCount: 0,
            pageSize: 20,
            pageNo: 1
        }
    },
    computed: {
        list: function () {
            let list = [];
            list = this.data;
            this.data.forEach(item => {
                item.totalCount = 0;
                item.array = [];
                item.array.length = 12;

                let userInfo = item.userName;
                item.userName = userInfo.userName;
                item.memberId = userInfo.memberId;

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
        handleChangePage(index) {

        },
        loadData() {
            let params = {

            }
            this.$ajax({
                url: '/logger/diaryQuery/getUserStatisticsByCondition',
                data: params,
                success: (res)=>{
                    if(res && res.code === 0) {
                        this.list = res.data.resultList || [];
                        let keys = Object.keys(res.data.totalMap || {});
                        this.totalCount = res.data.totalCount || 0;
                        if(keys && keys.length) {
                            res.data.totalMap.total = 0
                            keys.forEach(key=>{
                                res.data.totalMap.total += res.data.totalMap[key];
                            })
                        }
                        this.totalMap = res.data.totalMap || {};
                    }
                    this.loaded = true;
                },
                error: (res)=>{
                    this.$Message.error(res && res.msg || '网络错误');
                    this.loaded = true;
                }
            })
        }
    },
    created () {
        
    }
}
</script>
<style lang="less">

</style>
