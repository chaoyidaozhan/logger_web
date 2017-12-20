<template>
    <div class="logger-statistics">
        <fs-year-picker />
    </div>
</template>
<script>
import FsYearPicker from '../year-picker/'
export default {
    props: {
        params: { // 暴露的对象字段
            type: Object,
            default() {
                return {
                    groupId: '',
                    templateId: '',
                    orderType: '',
                    deptId: ''
                }
            }
        },
    },
    data() {
        return {
            list: []
        }
    },
    components: {
        FsYearPicker
    },
    methods: {
        getParams(params) { // 获取参数
            return Object.assign({
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                range: this.range,
                dataStatus: this.dataStatus
            }, params)
        },
    }
}
</script>
