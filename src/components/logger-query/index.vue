<template>
    <div class="page-logger-query">
        <fs-logger-list-item 
            v-for="item in list" 
            :loggerItemData="item" 
            :key="item.id" />
    </div>
</template>
<script>
import LoggerList from '../../mixins/logger-list';
import FsLoggerListItem from '../common/logger-list-item/';
/**
    range 
    0  所有日志
    4  @我的
    -1 我的日志
    3  团队日志
    1  下属日志
**/
export default {
    data() {
        return {
            params: {
                range: 0,
                dataStatus: 1 // 日志查询标记
            }
        }
    },
    mixins: [LoggerList],
    components: {
        FsLoggerListItem
    },
    methods: {
        loadData() {
            this.$ajax({
                url: '/logger/diaryQuery/getAllDiary',
                data: this.getParams(this.params),
                success: (res)=>{
                    console.log(res)
                    this.updateList(res);
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>

</style>
