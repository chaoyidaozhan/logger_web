<template>
    <div class="search-form">
        <Form inline>
            <FormItem :label-width="50" :label="$t('noun.author')" v-if="showAllMember && !showTemplateCheck">
                <fs-select-member ref="selectMember" 
                    :title="`${$t('operate.select')}${$t('noun.author')}`"
                    :placeholder="`${$t('operate.select')}${$t('noun.author')}`"
                    :showDept="true"
                    :showGroup="true" 
                    :member="member"
                    :dept="dept"
                    :group="group"
                    @handleSelectMember="handleSelectMember"/>
            </FormItem> 
            <FormItem :label-width="50" :label="$t('noun.author')" v-if="showMember">
                <fs-select-member ref="selectMember" 
                    :title="`${$t('operate.select')}${$t('noun.author')}`"
                    :placeholder="`${$t('operate.select')}${$t('noun.author')}`"
                    :member="member"
                    @handleSelectMember="handleSelectMember"/>
            </FormItem> 
            <FormItem :label-width="lang === 'en' ? 60 : 40" :label="$t('noun.template')"  v-if="showTemplate">
                <fs-select-template 
                    :hasDefaultTemplate="hasDefaultTemplate" 
                    :templateType="templateType" 
                    ref="selectTemplate"/>
            </FormItem> 
            <FormItem class="form-item-checkbox" v-if="showTemplateCheck">
                <Checkbox @on-change="handleChange">{{$t('operate.disable')}}/{{$t('operate.delete')}}</Checkbox>
            </FormItem> 
            <FormItem :label-width="40" :label="$t('noun.date')"  v-if="showDatePicker">
                <fs-select-date ref="selectDate" :timeArr="timeArr"/>
            </FormItem> 
            <FormItem :label-width="50" :label="$t('noun.author')"  v-if="showAllMember && showTemplateCheck">
                <fs-select-member ref="selectMember" 
                    :title="`${$t('operate.select')}${$t('noun.author')}`"
                    :placeholder="`${$t('operate.select')}${$t('noun.author')}`"
                    :showDept="true"
                    :showGroup="true" 
                    :member="member"
                    :dept="dept"
                    :group="group"
                    @handleSelectMember="handleSelectMember"/>
            </FormItem> 
            <FormItem :label-width="lang === 'en' ? 76 : 40" :label="$t('noun.department')"  v-if="showDept">
                <fs-select-member ref="selectDept" 
                    :title="`${$t('operate.select')}${$t('noun.department')}`"
                    :placeholder="`${$t('operate.select')}${$t('noun.department')}`"
                    @handleSelectMember="handleSelectMember" 
                    :showMember="false" 
                    :showDept="true"
                    :dept="dept"
                    :limit="{ showAll: true, warning: '', count: 1 }"
                    :deptApiUri="deptApiUri"/>
            </FormItem> 
            <FormItem :label-width="lang === 'en' ? 98 : 50" :label="$t('noun.internalGroup')"  v-if="showGroup">
                <fs-select-member ref="selectGroup" 
                    :title="`${$t('operate.select')}${$t('noun.internalGroup')}`"
                    :placeholder="`${$t('operate.select')}${$t('noun.internalGroup')}`"
                    @handleSelectMember="handleSelectMember" 
                    :showMember="false" 
                    :showGroup="true" 
                    :group="group"
                    :limit="{ showAll: true, warning: '', count: 1 }"
                    :groupApiUri="groupApiUri"/>
            </FormItem> 
            <FormItem :label-width="40" :label="$t('noun.date')"  v-if="showOrderType || showOrderTypeMulti">
                <fs-select-order-type ref="selectOrderType" :multi="showOrderTypeMulti"/>
            </FormItem> 
            <FormItem class="search-btn">
                <Button :disabled="loading" type="primary" @click="handleQuery">
                    {{$t('operate.search')}}
                </Button>
                <FormItem :label-width="10" class="export-btn" v-if="showExportExcel">
                    <fs-export-excel
                    @handleExportExcel="handleExportExcel"
                    @handlePersonData="handlePersonData"
                    :isGroupOrDeptSelectedAll="isGroupOrDeptSelectedAll"
                    :showGroupExcelBtn="showGroupExcelBtn"
                    :showDeptExcelBtn="showDeptExcelBtn"></fs-export-excel>
                </FormItem>
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
 * showGroup 是否显示选择内部群组件
 * showMember 是否显示选择提交人组件
 * showOrderType 是否显示选择日期类型组件
 * showOrderTypeMulti 选择日期类型是否支持选择日期
 * showExportExcel 是否显示日志统计导出按钮
 **/
import FsSelectMember from '../select-member-input/';
import FsSelectTemplate from '../select-template/';
import FsSelectDate from '../select-date/';
import FsSelectGroup from '../select-group/';
import FsSelectOrderType from '../select-order-type/';
import FsExportExcel from '../export-excel';
import config from 'app_src/config/config';
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
            type: Boolean | String,
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
        },
        showExportExcel: {
            type: Boolean,
            default: false
        },
        showGroupExcelBtn: {
            type: Boolean,
            default: false
        },
        showDeptExcelBtn: {
            type: Boolean,
            default: true
        }
    },
    components: {
        FsSelectMember,
        FsSelectTemplate,
        FsSelectDate,
        FsSelectOrderType,
        FsExportExcel
    },
    data() {
        return {
            dept: [], // 组织
            group: [], // 内部群
            member: [], // 提交人
            queryTimer: null,
            loading: false,
            isGroupOrDeptSelectedAll: false
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
            if(this.group && !!this.group.length) { // 整理内部群
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
            res && res.group && res.group.forEach((item) => {
                if(item.gid === 0) {
                    this.isGroupOrDeptSelectedAll = true;
                }
            });
            res && res.dept && res.dept.forEach((item) => {
                if(item.deptId === 0) {
                    this.isGroupOrDeptSelectedAll = true;
                }
            });
            let keys = Object.keys(res);
            keys.forEach(key=>{
                this[key] = res[key]
            })
        },
        handleExportExcel(params) {
            this.handleQuery();
            let data = {
                templateId: this.$refs.selectTemplate && this.$refs.selectTemplate.templateId,
                orderType: this.$refs.selectOrderType && this.$refs.selectOrderType.getParams().orderType,
                years: this.years,
                start: this.startEndData && this.startEndData.start || ""
            };
            this.trimIds(data);
            let isDept = params === 0 || params == 1 ? true : false;
            if((isDept && data.deptId === undefined) || (!isDept && data.groupId === undefined)) {
                return;
            }
            let path = (params === 1 || params === 3) 
                     ? "exportExcelIncludeUserStatisticsByCondition"
                     : "exportExcelStatisticsByCondition";
            let deptOrGroupId = data.deptId !== undefined
                              ? `deptId=${data.deptId}`
                              : `groupId=${data.groupId}`;
            let url = `${config[__ENV__].apiHost}/diaryQuery/${path}?token=${this.$store.state.userInfo.token}&timestamp=${new Date().getTime()}&language=${window.lang}&orderType=${data.orderType}&${deptOrGroupId}&templateId=${data.templateId}&years=${data.years}&start=${data.start}`;
            window.open(url);
        },
        handlePersonData() {
            this.handleQuery();
            let data = {
                templateId: this.$refs.selectTemplate && this.$refs.selectTemplate.templateId,
                orderType: this.$refs.selectOrderType && this.$refs.selectOrderType.getParams().orderType,
                start: this.startEndData.start || "",
                end: this.startEndData.end || "",
                pageNo: 1,
                pageSize: 9999
            };
            this.trimIds(data);
            if(!data.memberIds) {
                return;
            }
            let url = `${config[__ENV__].apiHost}/diaryQuery/exportUsersStatisticsByCondition?token=${this.$store.state.userInfo.token}&timestamp=${new Date().getTime()}&orderType=${data.orderType}&templateId=${data.templateId}&start=${data.start}&end=${data.end}&memberIds=${data.memberIds}&pageNo=${data.pageNo}&pageSize=${data.pageSize}`;
            window.open(url);
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
            if(this.$refs.selectGroup) { // 重置内部群
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
        });
        this.$eventbus.$on('getYear', (data) => {
            this.years = data;
        });
        this.$eventbus.$on('getStartEndTime', (data) => {
            this.startEndData = data;
        });
    },
    destroyed () {
        this.$eventbus.$off('setBtnLoading')
    }
}
</script>
<style lang="less">
@import '../../../assets/css/var.less';
.search-form {
    position: relative;
    font-size: 0;
    line-height: 56px;
    .ivu-form-inline .ivu-form-item {
        vertical-align: middle;
        margin: 0 0 0 5px;
        max-width: 360px;
        min-width: 226px;
        &.form-item-checkbox {
            width: auto;
            min-width: auto;
        }
        .ivu-form-item-label {
            padding-top: 11px;
            color: @gray-color-light;
        }
        .ivu-form-item-content {
            line-height: 30px;
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
        &.export-btn {
            min-width: 60px;
        }
    }
    .select-date {
        margin-right: 0;
    }
}
</style>


