<template>
    <div class="search-form">
        <Form inline>
            <FormItem :label-width="50" label="提交人"  v-if="showAllMember && !showTemplateCheck">
                <fs-select-member ref="selectMember" 
                    title="选择提交人"
                    placeholder="选择提交人"
                    :showDept="true"
                    :showGroup="true" 
                    :member="member"
                    :dept="dept"
                    :group="group"
                    @handleSelectMember="handleSelectMember"/>
            </FormItem> 
            <FormItem :label-width="50" label="提交人"  v-if="showMember">
                <fs-select-member ref="selectMember" 
                    title="选择提交人"
                    placeholder="选择提交人"
                    :member="member"
                    @handleSelectMember="handleSelectMember"/>
            </FormItem> 
            <FormItem :label-width="40" label="模板"  v-if="showTemplate">
                <fs-select-template 
                    :hasDefaultTemplate="hasDefaultTemplate" 
                    :templateType="templateType" 
                    ref="selectTemplate"/>
            </FormItem> 
            <FormItem class="form-item-checkbox" v-if="showTemplateCheck">
                <Checkbox @on-change="handleChange">停用/删除</Checkbox>
            </FormItem> 
            <FormItem :label-width="40" label="日期"  v-if="showDatePicker">
                <fs-select-date ref="selectDate" :timeArr="timeArr"/>
            </FormItem> 
            <FormItem :label-width="50" label="提交人"  v-if="showAllMember && showTemplateCheck">
                <fs-select-member ref="selectMember" 
                    title="选择提交人"
                    placeholder="选择提交人"
                    :showDept="true"
                    :showGroup="true" 
                    :member="member"
                    :dept="dept"
                    :group="group"
                    @handleSelectMember="handleSelectMember"/>
            </FormItem> 
            <FormItem :label-width="40" label="部门"  v-if="showDept">
                <fs-select-member ref="selectDept" 
                    @handleSelectMember="handleSelectMember" 
                    :showMember="false" 
                    :showDept="true"
                    :dept="dept"
                    :limit="{ showAll: true, warning: '', count: 1 }"
                    title="选择部门"
                    :deptApiUri="deptApiUri"
                    placeholder="选择部门"/>
            </FormItem> 
            <FormItem :label-width="40" label="团队"  v-if="showGroup">
                <fs-select-member ref="selectGroup" 
                    @handleSelectMember="handleSelectMember" 
                    :showMember="false" 
                    :showGroup="true" 
                    :group="group"
                    :limit="{ showAll: true, warning: '', count: 1 }"
                    title="选择团队"
                    :groupApiUri="groupApiUri"
                    placeholder="选择团队"/>
            </FormItem> 
            <FormItem :label-width="40" label="日期"  v-if="showOrderType || showOrderTypeMulti">
                <fs-select-order-type ref="selectOrderType" :multi="showOrderTypeMulti"/>
            </FormItem> 
            <FormItem class="search-btn">
                <Button :disabled="loading" type="primary" @click="handleQuery">
                    查询
                </Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
/**
 * showTemplate 是否显示模板
 * showTemplateCheck 是否显示模板过滤check
 * hasDefaultTemplate 是否显示默认全部模板
 * showDatePicker 是否显示日期组件
 * showDept 是否显示选择组织组件
 * showGroup 是否显示选择团队组件
 * showMember 是否显示选择提交人组件
 * showOrderType 是否显示选择日期类型组件
 * showOrderTypeMulti 选择日期类型是否支持选择日期
 **/
import FsSelectMember from '../select-member-input/';
import FsSelectTemplate from '../select-template/';
import FsSelectDate from '../select-date/';
import FsSelectGroup from '../select-group/';
import FsSelectOrderType from '../select-order-type/';
export default {
    props: {
        showTemplate: { // 是否显示模板
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
        showDept: {
            type: Boolean,
            default: false
        },
        showGroup: {
            type: Boolean,
            default: false
        },
        showAllMember: {
            type: Boolean,
            default: false
        },
        showMember: {
            type: Boolean,
            default: false
        },
        showOrderType: {
            type: Boolean,
            default: false
        },
        showOrderTypeMulti: {
            type: Boolean,
            default: false
        },
        templateType: {
            type: String,
            default: 'app'
        },
        timeArr: {
            type: Array,
            default: function () {
                return []
            }
        },
        deptApiUri: {
            type: String
        },
        groupApiUri: {
            type: String
        }
    },
    components: {
        FsSelectMember,
        FsSelectTemplate,
        FsSelectDate,
        FsSelectOrderType,
    },
    data() {
        return {
            dept: [], // 组织
            group: [], // 团队
            member: [], // 提交人
            queryTimer: null,
            loading: false
        }
    },
    methods: {
        trimIds(params) { // 整理id数据
            if(this.member && !!this.member.length) { // 整理人员id
                let memberIds = []
                this.member.forEach(item=>{
                    memberIds.push(item.memberId);
                })
                params.memberIds = memberIds.join(',');
            }
            if(this.dept && !!this.dept.length) { // 整理组织id
                let deptId = []
                this.dept.forEach(item=>{
                    deptId.push(item.deptId);
                })
                params.deptId = deptId.join(',');
            }
            if(this.group && !!this.group.length) { // 整理团队
                let groupId = []
                this.group.forEach(item=>{
                    groupId.push(item.gid);
                })
                params.groupId = groupId.join(',');
            }
        },
        rulesValidate(params) { // 非空验证
            let keys = Object.keys(params);
            keys.forEach(key=>{ 
                switch (typeof params[key]) {
                    case 'number':
                        if(!params[key] && params[key] != 0) {
                            delete params[key];
                        }
                        break;
                    case 'string':
                        if(!params[key]) {
                            delete params[key];
                        }
                        break;
                    default:
                        delete params[key];
                        break;
                }
               
                if(key == 'templateId' && params[key] == 0) {
                    delete params[key];
                }
            })
        },
        handleQuery() { // 查询时返回整理好的数据
            clearTimeout(this.queryTimer);
            this.queryTimer = setTimeout(() => {
                let params = {
                    templateId: this.$refs.selectTemplate && this.$refs.selectTemplate.templateId,
                    beginDate: this.$refs.selectDate && this.$refs.selectDate.beginDate,
                    endDate: this.$refs.selectDate && this.$refs.selectDate.endDate,
                    ...this.$refs.selectOrderType && this.$refs.selectOrderType.getParams(),
                };
                this.trimIds(params);
                this.rulesValidate(params);
                this.$emit('handleQuery', params);
            }, 200);
           
        },
        handleSelectMember(res) {
            let keys = Object.keys(res);
            keys.forEach(key=>{
                this[key] = res[key]
            })
        },
        handleChange(value) {
            let templateType;
            if(value) {
                templateType = 'web'
            } else {
                templateType = 'select'
            }
            this.$emit('handleTemplateType', templateType)
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
    },
    mounted () {
        this.$eventbus.$on('setBtnLoading', (data)=>{
            this.loading = data;
        })
    },
    destroyed () {
        this.$eventbus.$off('setBtnLoading')
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
        max-width: 360px;
        min-width: 226px;
        &.form-item-checkbox {
            width: auto;
            min-width: auto;
        }
        .ivu-form-item-label {
            padding-top: 11px;
        }
        &.search-btn {
            position: absolute;
            right: 0;
            width: auto;
            min-width: auto;
            top: 11px;
            text-align: right;
            margin-right: 0;
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


