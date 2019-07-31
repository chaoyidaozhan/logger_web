<template>
    <div class="logger-page" v-if="totalCount > pageSize">
        <YYPagination :total="totalCount" :page-size="pageSize" :current="pageNo" @on-change="changePage" show-elevator/>
    </div>
</template>
<script>
export default {
    props: {
        totalCount: {
            type: Number
        },
        pageSize: {
            type: Number
        },
        pageNo: {
            type: Number,
            default: 1
        }
    },
    methods: {
        changePage(pageNo) {
            this.$emit('handleChangePage', pageNo)
        }
    }
}
</script>
<style>
.logger-page {
    text-align: center;
    padding-top: 20px;
    font-size: 12px;
}
</style>

