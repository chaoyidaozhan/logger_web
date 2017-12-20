<template>
    <div class="search-form">
        <Row type="flex" justify="start" class="code-row-bg">
            <Col span="4" v-if="showTemplate">
                <fs-select-template  ref="selectTemplate"></fs-select-template>
            </Col>
            <Col span="2" v-if="showTemplate">
                <Button type="primary" @click="handleQuery">
                    查询
                </Button>
            </Col>
        </Row>
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
        handleQuery() { // 查询时返回整理好的数据
            let params = {
                templateId: this.$refs.selectTemplate && this.$refs.selectTemplate.templateId,
                groupId: this.$refs.selectGroup && this.$refs.selectGroup.groupId,
                deptId: this.$refs.selectDept && this.$refs.selectDept.deptId,
                beginDate: '',
                endDate: '',
            }
            let keys = Object.keys(params);
            keys.forEach(key=>{ // 非空验证
                if(!params[key] && key != 'deptId') {
                    delete params[key];
                }
                if(key == 'deptId') {
                    if(!params[key] && params[key] !== 0) {
                        delete params[key];
                    }
                }
            })
            this.$emit('handleQuery', params);
        },
        resetQuery() {
            if(this.$refs.selectTemplate) { // 重置模板
                this.$refs.selectTemplate.templateId = 0;
            }
            if(this.$refs.selectGroup) { // 重置团队
                this.$refs.selectGroup.groupId = '';
            }
            if(this.$refs.selectDept) { // 重置部门
                this.$refs.selectDept.deptId = '';
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>


