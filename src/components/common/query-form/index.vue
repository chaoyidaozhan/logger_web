<template>
    <div class="search-form">
        <Form inline>
            <FormItem :label-width="50" label="提交人"  v-if="showMember">
                <fs-select-member ref="selectMember" 
                    title="选择提交人"
                    placeholder="选择提交人"
                    :man="man"
                    @handleSelectMember="handleSelectMember"/>
            </FormItem> 
            <FormItem :label-width="40" label="模板"  v-if="showTemplate">
                <fs-select-template 
                    :hasDefaultTemplate="hasDefaultTemplate" 
                    :templateType="templateType" 
                    ref="selectTemplate"/>
            </FormItem> 
            <FormItem class="form-item-checkbox" v-if="showTemplateCheck">
                <Checkbox @on-change="handleChange">已停用/删除模板</Checkbox>
            </FormItem> 
            <FormItem :label-width="40" label="日期"  v-if="showDatePicker">
                <fs-select-date ref="selectDate"/>
            </FormItem> 
            <FormItem :label-width="40" label="部门"  v-if="showDepart">
                <fs-select-member ref="selectDept" 
                    @handleSelectMember="handleSelectMember" 
                    :showMember="false" 
                    :showDept="true"
                    :dep="dep"
                    title="选择部门"
                    placeholder="选择部门"/>
            </FormItem> 
            <FormItem :label-width="40" label="团队"  v-if="showGroup">
                <fs-select-member ref="selectGroup" 
                    @handleSelectMember="handleSelectMember" 
                    :showMember="false" 
                    :showGroup="true" 
                    :team="team"
                    title="选择团队"
                    placeholder="选择团队"/>
            </FormItem> 
            <FormItem :label-width="40" label="日期"  v-if="showOrderType">
                <fs-select-order-type ref="selectOrderType"/>
            </FormItem> 
            
            <FormItem class="search-btn">
                <Button type="primary" @click="handleQuery">
                    查询
                </Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import FsSelectMember from '../select-member-input/';
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
        showTemplateCheck: {
            type: Boolean,
            default: false
        },
        hasDefaultTemplate: {
            type: Boolean,
            default: true
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
        FsSelectMember,
        FsSelectTemplate,
        FsSelectDate,
        FsSelectGroup,
        FsSelectOrderType
    },
    data() {
        return {
            templateType: 'app',
            dep: [],
            team: [],
            man: [],
        }
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
        handleSelectMember(res) {
            let keys = Object.keys(res);
            keys.forEach(key=>{
                this[key] = res[key]
            })
            console.log(this.dep)
            console.log(this.man)
            console.log(this.team)
        },
        handleChange(value) {
            console.log(value)
            if(value) {
                this.templateType = 'web'
            } else {
                this.templateType = 'app'
            }
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
        &.form-item-checkbox {
            width: auto;
        }
        .ivu-form-item-label {
            padding-top: 11px;
        }
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


