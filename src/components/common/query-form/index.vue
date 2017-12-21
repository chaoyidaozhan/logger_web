<template>
    <div class="search-form">
        <Row type="flex" justify="start" class="code-row-bg">
            <Col span="4" v-if="showTemplate">
                <fs-select-template  ref="selectTemplate"></fs-select-template>
            </Col>
            <Col span="4" v-if="showDatePicker">
                <fs-select-date ref="selectDate"></fs-select-date>
            </Col>
            <Col span="4" v-if="showGroup">
                <fs-select-group ref="selectGroup"></fs-select-group>
            </Col>
            <Col span="4" v-if="showDateType">
                <fs-select-date-type ref="selectDateType"></fs-select-date-type>
            </Col>
            <Col span="2" class="search-btn">
                <Button type="primary" @click="handleQuery">
                    查询
                </Button>
            </Col>
        </Row>
    </div>
</template>
<script>
import FsSelectTemplate from '../select-template/';
import FsSelectDate from '../select-date/';
import FsSelectGroup from '../select-group/';
import FsSelectDateType from '../select-date-type/';
export default {
    props: {
        showTemplate: {
            type: Boolean,
            default: true
        },
        showDatePicker: {
            type: Boolean,
            default: true
        },
        showMember: {
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
        showDateType: {
            type: Boolean,
            default: true
        }
    },
    components: {
        FsSelectTemplate,
        FsSelectDate,
        FsSelectGroup,
        FsSelectDateType
    },
    methods: {
        handleQuery() { // 查询时返回整理好的数据
            let params = {
                templateId: this.$refs.selectTemplate && this.$refs.selectTemplate.templateId,
                beginDate: this.$refs.selectDate && this.$refs.selectDate.beginDate,
                endDate: this.$refs.selectDate && this.$refs.selectDate.endDate,
                orderType: this.$refs.selectDateType && this.$refs.selectDateType.orderType,
                groupId: this.$refs.selectGroup && this.$refs.selectGroup.groupId,
                deptId: this.$refs.selectDept && this.$refs.selectDept.deptId
            };
            console.log(params, 999);
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
    .search-btn {
        float: right;
    }
</style>


