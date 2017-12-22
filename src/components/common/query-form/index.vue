<template>
    <div class="search-form">
        <Form inline :label-width="40">
            <FormItem label="模板"  v-if="showTemplate">
                <fs-select-template ref="selectTemplate"></fs-select-template>
            </FormItem> 
            <FormItem label="日期"  v-if="showDatePicker">
                <fs-select-date ref="selectDate"></fs-select-date>
            </FormItem> 
            <FormItem label="团队"  v-if="showGroup">
                <fs-select-group ref="selectGroup"></fs-select-group>
            </FormItem> 
            <FormItem label="日期"  v-if="showOrderType">
                <fs-select-order-type ref="selectOrderType"></fs-select-order-type>
            </FormItem> 
            
            <FormItem :label-width="0" class="search-btn">
                <Button type="primary" @click="handleQuery">
                    查询
                </Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import FsSelectTemplate from '../select-template/';
import FsSelectDate from '../select-date/';
import FsSelectGroup from '../select-group/';
import FsSelectOrderType from '../select-order-type/';
export default {
    props: {
        showTemplate: {
            type: Boolean,
            default: false
        },
        showDatePicker: {
            type: Boolean,
            default: false
        },
        showMember: {
            type: Boolean,
            default: false
        },
        showDepart: {
            type: Boolean,
            default: false
        },
        showGroup: {
            type: Boolean,
            default: false
        },
        showOrderType: { // 时间统计类型
            type: Boolean,
            default: false
        },
        showOrderTypeMulti: {
            type: Boolean,
            default: false
        },
    },
    components: {
        FsSelectTemplate,
        FsSelectDate,
        FsSelectGroup,
        FsSelectOrderType
    },
    methods: {
        handleQuery() { // 查询时返回整理好的数据
            let params = {
                templateId: this.$refs.selectTemplate && this.$refs.selectTemplate.templateId,
                beginDate: this.$refs.selectDate && this.$refs.selectDate.beginDate,
                endDate: this.$refs.selectDate && this.$refs.selectDate.endDate,
                orderType: this.$refs.selectOrderType && this.$refs.selectOrderType.orderType,
                groupId: this.$refs.selectGroup && this.$refs.selectGroup.groupId,
                deptId: this.$refs.selectDept && this.$refs.selectDept.deptId,
                memberId: this.$refs.selectMember && this.$refs.selectMember.deptId,
            };
            let keys = Object.keys(params);
            keys.forEach(key=>{ // 非空验证
                if(!params[key] && key != 'deptId') {
                    delete params[key];
                }
                if(key == 'deptId' || key == 'templateId') {
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
<style lang="less">
.search-form {
    position: relative;
    font-size: 0;
    line-height: 56px;
    .ivu-form-inline .ivu-form-item {
        vertical-align: middle;
        margin: 0 10px 0 0;
        width: 226px;
        &.search-btn {
            position: absolute;
            right: 0;
            width: auto;
            top: 11px;
            button {
                margin-left: 10px;
            }
        }
    }
    .select-date {
        margin-right: 0;
    }
}
</style>


