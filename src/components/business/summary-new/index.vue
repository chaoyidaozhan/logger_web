<template>
    <div class="summary-new">
        <div class="search-form">
            <Form inline>
                <!-- 模板 -->
                <FormItem :label-width="lang === 'en' ? 60 : 40" :label="$t('noun.template')">
                    <fs-select-template 
                        :hasDefaultTemplate="false" 
                        :templateType="templateType" 
                        ref="selectTemplate"/>
                </FormItem> 
                <!-- 删除 -->
                <FormItem class="form-item-checkbox">
                    <Checkbox @on-change="handleTemplateType">
                        {{$t('operate.disable')}}/{{$t('operate.delete')}}
                    </Checkbox>
                </FormItem>
                <!-- 组织 -->
                <FormItem :label-width="40" :label="$t('noun.department')">
                    
                </FormItem> 
                <!-- 部门 -->
                <FormItem :label-width="40" :label="$t('noun.department')">
                   
                </FormItem> 
                <!-- 提交人 -->
                <FormItem :label-width="50" :label="$t('noun.author')">
                   
                </FormItem> 
                <!-- 日期 -->
                <FormItem :label-width="40" :label="$t('noun.date')">
                    <fs-select-date 
                        ref="createDate" 
                        :createDate="createDate"/>
                </FormItem> 
                <!-- 日志日期 -->
                <FormItem :label-width="60" :label="`${$t('noun.log')}${$t('noun.date')}`">
                    <fs-select-date 
                        ref="selectDate" 
                        dateType="date"/>
                </FormItem> 
            </Form>
            <Button @click="console">打印测试数据</Button>
        </div>
    </div>
</template>
<script>
import FsSelectTemplate from 'app_component/common/select-template/'
import FsSelectDate from 'app_component/common/select-date/'
import FsSelectTreeInput from 'app_component/common/select-tree-input/'
import formatTime from 'app_src/filters/format-time'

export default {
    data() {
        return {
            templateType: 'select',
            createDate: []
        }
    },
    components: {
        FsSelectTemplate,
        FsSelectDate,
        FsSelectTreeInput
    },
    methods: {
        handleTemplateType(value) { // 停用删除
            this.templateType = value ? 'web' : 'select'
        },
        handleSelectOrg() { // 控制选组织

        },
        handleSelectDept() { // 控制选部门

        },
        handleSelectMember() { // 控制选人

        },
        console() {
            console.log(this.$refs.createDate.beginDate)
        },
        trimData() { // 整理数据

        },
        validate() { // 验证非空

        },
        getParams() {

        },
        loadData() {

        },
        init() {
            let now = (new Date()).valueOf()
            let beginDate = formatTime(new Date(now - 86400000 * 15), 'YYYY-MM-DD')
            let endDate = formatTime(new Date(now), 'YYYY-MM-DD')
            this.createDate = [
                beginDate,
                endDate
            ]
        }
    },
    created () {
        this.init()
    }
}
</script>

<style lang="less" scoped>
.summary-new {
    padding: 20px;
    .search-form {
        line-height: normal;
        .ivu-form-item {
            margin-bottom: 10px;
            margin-right: 10px;
        }
    }
}
</style>
