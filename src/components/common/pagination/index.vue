<template>
    <div class="signin-page" v-if="totalCount > pageSize">
        <Page :total="totalCount" :page-size="pageSize" :current="pageNo" @on-change="changePage" show-elevator></Page>
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
            this.$emit('handleChangePage', pageNo);
        }
    }
}
</script>
<style>
.signin-page {
    text-align: center;
    padding-top: 20px;
}
</style>

