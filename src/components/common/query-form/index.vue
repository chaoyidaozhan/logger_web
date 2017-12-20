<template>
    <div class="search-form">
        <row type="flex" justify="start" class="code-row-bg">
            <col span="4" v-if="showTemplate">
                <fs-select-template  ref="selectTemplate"></fs-select-template>
            </col>
            <col span="2" v-if="showTemplate">
                <Button @click="handleQuery">
                    查询
                </Button>
            </col>
        </row>
        
    </div>
</template>
<script>
import FsSelectTemplate from '../select-template/';
export default {
    props: {
        showMember: {
            type: Boolean,
            default: true
        },
        showTemplate: {
            type: Boolean,
            default: true
        },
        showDateType: {
            type: Boolean,
            default: true
        },
        showDatePicker: {
            type: Boolean,
            default: true
        },
        showDepart: {
            type: Boolean,
            default: true
        },
        showGroup: {
            type: Boolean,
            default: true
        },
    },
    components: {
        FsSelectTemplate
    },
    methods: {
        handleQuery() {
            let params = {
                templateId: this.$refs.selectTemplate && this.$refs.selectTemplate.templateId,
                groupId: this.$refs.selectGroup && this.$refs.selectGroup.groupId,
                deptId: this.$refs.selectDept && this.$refs.selectDept.deptId,
                beginDate: '',
            }
            let keys = Object.keys(params);
            keys.forEach(key=>{ // 非空验证
                if(!params[key] && params[key] !== 0) {
                    delete params[key];
                }
            })
            this.$emit('handleQuery', params);
        }
    }
}
</script>
<style lang="less" scoped>

</style>


