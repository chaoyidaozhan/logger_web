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
                <!-- 提交人 -->
                <FormItem :label-width="50" :label="$t('noun.author')">
                    <div 
                        class="select-tree-input2 cursor-pointer ellipsis" 
                        @click="openSelectMember" 
                        :class="{disabled: !org.length && !dept.length && !member.length}">
                        <template v-if="!org.length && !dept.length && !member.length">
                            {{$t('noun.author')}}
                        </template>
                        <template>
                            <span v-for="(item, index) in org" :key="index">
                                {{item.orgName}}
                            </span>
                            <span v-for="(item, index) in dept" :key="'index'+index">
                                {{item.deptName}}
                            </span>
                            <span v-for="item in member" :key="item.memberId">
                                {{item.userName}}
                            </span>
                        </template>
                        <i class="icon-add"></i>
                    </div>
                </FormItem> 
                <!-- 日期 -->
                <FormItem :label-width="40" :label="$t('noun.date')">
                    <fs-select-date 
                        ref="createDate" 
                        :createDate="createDate"/>
                </FormItem> 
                <FormItem class="search-btn">
                    <YYButton :disabled="loading" type="primary" @click="handleQuery">
                        {{$t('operate.search')}}
                    </YYButton>
                </FormItem> 
            </Form>
        </div>
        <div class="summary-page">
            <template v-if="tables">
                <div class="tabs">
                    <div class="tabs-nav-wrapper">
                        <div class="tabs-nav-scroller" ref="tab">
                            <div
                                class="tabs-nav"
                                :class="{active: table.key === activeTable}"
                                v-for="(table) in tables" :key="table.key"
                                v-if="table.key === activeTable || isDisplayHistoryTemplate"
                                @click="handleSwitchTab(table.key)">
                                {{table.title}}
                            </div>
                        </div>
                        <span
                            @click="handleExpandTab"
                            v-if="Object.keys(tables).length > 1" 
                            class="tabs-bread">
                            <i class="icon-arrow-left" v-if="isDisplayHistoryTemplate"></i>
                            {{isDisplayHistoryTemplate ? '收起' : '展开'}}
                            <i class="icon-arrow-right" v-if="!isDisplayHistoryTemplate"></i>
                        </span>
                    </div>
                </div>
                <!--正常表体-->
                <div v-for="(table, index) in tables"
                    v-if="activeTable === table.key"
                    :key="table.key">
                    <Table 
                        border
                        :loading="loading" 
                        :ref="`selection${index}`" 
                        :columns="table.columns" 
                        :data="table.data"
                        @on-selection-change="handleSelectChange"/>
                    <!--正常表foot-->
                    <template v-if="table.data && table.data.length">
                        <Table 
                            border
                            :columns="table.footColumns" 
                            :show-header="false" 
                            :data="table.footData" 
                            class="table-count"/>
                        <!--全选-->
                        <div class="table-statistics" v-if="table.key == stashSelectionKey">
                            <YYCheckbox v-model="table.dataType" @on-change="handleSelectAll(table.dataType, index)">
                                {{$t('operate.checkAll')}}
                                <span class="checkout-note">
                                    {{$t('operate.selected')}}
                                    <span class="check-num">{{table.checkNum}}</span>
                                    {{$t('noun.uLog')}}
                                </span>
                            </YYCheckbox>
                        </div>
                    </template>
                </div>
            </template>
            <YYEmpty v-else 
                iconType="member" 
                :text="hasQuery ? $t('status.noRelevantData') : $t('toast.selectTheDataThatExport')" />  
        </div>
    </div>
</template>
<script>
import FsSelectTemplate from 'app_component/common/select-template/'
import FsSelectDate from 'app_component/common/select-date/'
import FsSelectTreeInput from 'app_component/common/select-tree-input/'
import formatTime from 'app_src/filters/format-time'
import PerfectScrollbar from 'perfect-scrollbar';
let Ps = null;

export default {
    data() {
        return {
            templateType: 'select',
            createDate: [],
            org: [],
            dept: [],
            member: [],
            loading: false,
            tables: null,
            stashSelectionKey: null,
            activeTable: null,
            hasQuery: false,
            headerData: [
                { name: 'org', width: 100 },
                { name: 'dept', width: 100 },
                { name: 'author', width: 80 },
                { name: 'submitTime', width: 130},
            ],
            isDisplayHistoryTemplate: false
        }
    },
    components: {
        FsSelectTemplate,
        FsSelectDate,
        FsSelectTreeInput
    },
    methods: {
        initScroll() {
            this.$nextTick(()=>{
                if(!this.$refs.tab) return
                let container = this.$refs.tab
                Ps && Ps.destroy(container);
                Ps = new PerfectScrollbar(container, {
                        wheelSpeed: 0.5,
                        wheelPropagation: false,
                        useBothWheelAxes: true,
                        eventPassthrough : 'vertical',
                        minScrollbarLength: 60,
                        maxScrollbarLength: 300
                })
                // Ps.destroy(container);
                // Ps.initialize(container, {
                //     wheelSpeed: 0.5,
                //     wheelPropagation: false,
                //     useBothWheelAxes: true,
                //     eventPassthrough : 'vertical',
                //     minScrollbarLength: 60,
                //     maxScrollbarLength: 300
                // })

            })
        },
        handleTemplateType(value) { // 停用删除
            this.templateType = value ? 'web' : 'select'
        },
        handleSelect(res, name) { // 选择组织 部门 人员
            let keys = Object.keys(res)
            this[name] = res[name];
        },
        // ************ 2018-11-24 ****************
        openSelectMember(){
            let s_mans = JSON.parse(JSON.stringify(this.member)) ;
            let s_dept = JSON.parse(JSON.stringify(this.dept)) ;    
            let s_org = JSON.parse(JSON.stringify(this.org)) ;  
            let info = {
                title: this.$t('operate.select')+this.$t('noun.author'),
                man: true,
                dep: true,
                team:  false,
                showLoading: true,
                selected: {
                    dep: [].concat(s_dept , s_org) ,
                    man: s_mans,
                },
                limit: {
                    showAll: false,
                    warning: '',
                    count: 500
                }
            }
            this.$selectTree.show(JSON.parse(JSON.stringify(info)), res=>{
                this.org=[];
                this.dept=[];
                this.member=[];
                if(res.dep&&res.dep.length){
                    let org=[];
                    let dept=[];
                    res.dep.map(v=>{
                        if(v.type==0){
                            dept.push(v)
                        }else if(v.type==1){
                            org.push({
                                ...v ,
                                orgId: v.deptId ,   
                                orgName:v.deptName ,
                            })
                        }
                    })
                    this.org = org ;
                    this.dept = dept ;
                }
                if(res.man&&res.man.length){
                    this.member = res.man ;
                }
            })
        },
        handleSwitchTab(key) { // 切换
            this.activeTable = key
        },
        handleExpandTab(key) { // 展开收起
            this.isDisplayHistoryTemplate = !this.isDisplayHistoryTemplate
            this.initScroll()
        },
        handleSelectAll(dataType, index) { // 全选
            this.$refs[`selection${index}`][0].selectAll(dataType)
        },
        handleSelectChange(selection) { //选项发生变化
            let stashIds = selection && selection.map((item) => {
                return item.id
            })
            // 像tables中保存已选中的数据
            let activeTableList = this.tables[this.activeTable]
            // 是否全选
            activeTableList.dataType = selection.length < activeTableList.list.length ? false : (selection.length == activeTableList.list.length ? true : activeTableList.dataType)
            if(activeTableList && activeTableList.list) {
                let stashSelection = []
                activeTableList.list.forEach((item)=>{
                    if(stashIds.includes(+item.id)){
                        stashSelection.push(JSON.parse(item.content))
                    }
                })
                
                activeTableList.selection = stashSelection
                activeTableList.checkNum = selection.length
                activeTableList.version = activeTableList.list[0].version
                activeTableList.dataType = activeTableList.list[0].dataType
                activeTableList.templateName = activeTableList.list[0].templateName
            }
        },
        getSummaryData(param) { // 获取日志汇总数据
            let summaryData = param[0]
            param.forEach((parent, pIndex)=>{
                if(pIndex != 0) {
                    parent.forEach((child, cIndex)=>{
                        if(child.type == 'InputText') {
                            if(!!child.content.trim()) {
                                summaryData[cIndex].content += `\n${child.content}`
                                summaryData[cIndex].value += `\n${child.value}`
                            }
                        }
                        if(child.type == 'InputTextNum') {
                            if(!!child.content && typeof +child.content == 'number') {
                                summaryData[cIndex].content = (+summaryData[cIndex].content) + (+child.content)
                                summaryData[cIndex].value = (+summaryData[cIndex].value) + (+child.value)
                            }
                        }
                    })
                }
            })
            return summaryData
        },
        handleSummary() { // 日志汇总
            if(!this.tables) {
                return this.$YYMessage.warning(`${this.$t('operate.please')}${this.$t('operate.select')}${this.$t('noun.template')}`)
            }
            let activeTableList = this.tables[this.activeTable]
            if (activeTableList.checkNum <= 0) {
                return this.$YYMessage.warning(this.$t('toast.pleaseSelectTheSummaryLog'))
            } 
            this.$store.dispatch('update_template_content', {
                content: {
                    version: activeTableList.version,
                    dataType: activeTableList.dataType,
                    templateName: activeTableList.templateName,
                    content: JSON.stringify(this.getSummaryData(activeTableList.selection))
                }
            })
            this.$router.push({
                path: `/LoggerDetail/operate/summary/${this.$refs.selectTemplate && this.$refs.selectTemplate.templateId}`,
                query: {
                    token: this.$store.state.userInfo.token
                }
            })
        },
        getExportParams() {
            return {
                templateId: this.$refs.selectTemplate && this.$refs.selectTemplate.templateId,
                beginDate: this.$refs.createDate && this.$refs.createDate.beginDate,
                endDate: this.$refs.createDate && this.$refs.createDate.endDate,
                language: window.lang,
                token: this.$store.state.userInfo.token,
                memberIds: this.member.map(m=> {return m.memberId}).join(','),
                deptIds: this.dept.map(d=> {return d.deptId}).join(','),
                orgIds: this.org.map(o=> {return o.orgId}).join(',')
            }
        },
        createTableColumns(param, key) { // 创建表格colums
            let columns = [ // body columns固定的前列
                {
                    type: key == this.stashSelectionKey ? 'selection' : 'hide',
                    width: this.lang == 'en' ? 100 : 60,
                    align: 'center'
                },
                {
                    title: 'id',
                    key: 'id',
                    className: 'id-column',
                    width: 1
                }
            ]
            let footColumns = [
                {
                    title: '',
                    key: 'summary',
                    width: this.lang == 'en' ? 10 : 60
                }, 
                {
                    title: 'id',
                    key: 'id',
                    className: 'id-column',
                    width: 1
                }
            ]
            
            this.headerData.forEach((head, index)=>{
                columns.push({
                    title: this.$t(`noun.${head.name}`),
                    width: head.width,
                    key: `column_${index}`
                })
                footColumns.push({
                    title: this.$t(`noun.${head.name}`),
                    width: head.width,
                    key: `column_${index}`
                })
            })
         
            // 构建columns
            if(param.length) {
                const columnsContent = JSON.parse(param[0].content)
                if(columnsContent) {
                    columnsContent.forEach((column, index)=>{
                        const len = columns.length
                        let columnsParam = {
                            title: column.title || '',
                            key: `column_${len}`,
                            type: 'html'
                        }
                        let footParam = {
                            title: column.title || '',
                            key: `column_${len}`,
                        }
                        if(column.type && (column.type != 'InputText' && column.type != 'InputContainer')) {
                            columnsParam.width = 100
                            footParam.width = 100
                        }
                        columns.push(columnsParam)
                        footColumns.push(footParam)
                    })
                }
            }
            return {
                columns: columns,
                footColumns: footColumns
            }
        },
        createTableBody(param) { // 创建表体
            // 构建data
            let data = [], footState = {summary: this.$t('noun.summary'),}
            if(param.length) {
                param.forEach(item=>{
                    let column = {
                        column_0: item.orgName,
                        column_1: item.deptName,
                        column_2: item.userName,
                        column_3: formatTime(new Date(item.createTime), 'YYYY-MM-DD HH:mm')
                    }
                    let content = JSON.parse(item.content) || []
                    column.id = item.id
                    content.forEach((parent, pIndex) => {
                        const num = Object.keys(column).length + 1
                        if (parent.type === 'InputRadio' || parent.type === 'InputCheckbox') {
                            column[`column_${num}`] = ['number', 'string'].includes(typeof parent.content) 
                            ? parent.content: ""
                        } else {
                            column[`column_${num}`] = ['number', 'string'].includes(typeof parent.value) 
                            ? parent.value: ""
                        }
                        
                        if(parent.type === 'InputContainer' && parent.children.length) {
                            parent.children.forEach((child)=>{
                                column[`column_${num}`] += `${child.title}:${child.content}<br>`
                            })
                        }
                        if(parent.type === 'InputTextNum') {
                            if(!isNaN(+parent.value) && parent.value != 0) {
                                const footKey = `column_${num}`
                                if(footState[footKey] === undefined) {
                                    footState[footKey] = +parent.value
                                } else {
                                    footState[footKey] += +parent.value
                                }
                            }
                        }
                    })
                    data.push(column)
                })
            }
            return {
                data: data,
                footData: [footState]
            }
        },
        createTables(param) { // 创建表格
            let tables = null, hasQuery = false
            const keys = Object.keys(param).sort((a, b)=>{
                return b - a
            })
            if(keys && keys.length) {
                tables = {}
                keys.forEach((key, index)=>{
                    if (index === 0) {
                        this.activeTable = key
                    }
                    const data = this.createTableBody(param[key], key)
                    const columns = this.createTableColumns(param[key], key)
                    if(param[key] && param[key].length) hasQuery = true
                    tables[key] = {
                        key: key,
                        title: formatTime(new Date(+key), 'YYYY-MM-DD HH:mm:ss'),
                        dataType: false,
                        checkNum: 0,
                        selection: [],
                        list: param[key],
                        ...columns,
                        ...data
                    }
                })
            } 
            this.$emit('handleHasQuery', !!hasQuery)
            this.tables = tables
        },
        getParams() { // 获取请求统计参数
            let params = {}
            const _this = this
            function getIds(name) {
                return _this[name].map((item)=>{
                    return item[name + 'Id']
                }).join(',') || ''
            }
            const ids = ['org', 'dept', 'member']
            ids.forEach((id)=>{
                const value = getIds(id)
                if(value) {
                    params[id + 'Ids'] = value
                }
            })
            
            return {
                templateId: this.$refs.selectTemplate && this.$refs.selectTemplate.templateId,
                beginDate: this.$refs.createDate && this.$refs.createDate.beginDate,
                endDate: this.$refs.createDate && this.$refs.createDate.endDate,
                ...params
            }
        },
        handleQuery() { // 查询
            const data = this.getParams()
            this.stashSelectionKey = this.$refs.selectTemplate.templateVersion
            
            if (!data.templateId) {
                return this.$YYMessage.warning(`${this.$t('operate.please')}${this.$t('operate.select')}${this.$t('noun.template')}`)
            }
            if (!data.beginDate || !data.endDate) {
                return this.$YYMessage.warning(`${this.$t('operate.please')}${this.$t('operate.select')}${this.$t('noun.date')}`)
            }
            if(!data.orgIds && !data.deptIds && !data.memberIds) {
                return this.$YYMessage.warning(`
                    ${this.$t('noun.org')},
                    ${this.$t('noun.dept')},
                    ${this.$t('noun.author')}
                    ${this.$t('toast.selectAtLeastOne')}
                `)
            }
            this.loading = true
            this.$ajax({
                url: '/rest/v1/diaryStatistics/diaryStatistics',
                data: data,
                success: (res) => {
                    this.loading = false
                    this.hasQuery = true
                    if(res && res.code === 0) {
                        this.createTables(res.data)
                        this.initScroll()
                    } else {
                        this.$YYMessage.warning((res && res.msg) || this.$t('noun.networkError'));
                    }
                },
                error: (res) => {
                    this.loading = false
                    this.$YYMessage.warning((res && res.msg) || this.$t('status.networkError'))
                }
            })
        },
        init() { // 初始化
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
<style lang="less">
@import '../../../assets/css/var.less';
.summary-new {
    .yy-empty {
        margin-top: 10%;
    }
    .tabs {
        padding-bottom: 6px;
        .tabs-nav-wrapper {
            display: inline-block;
            max-width: 100%;
            padding-right: 40px;
            position: relative;
            overflow: hidden;
            height: 38px;
            .tabs-nav-scroller {
                width: 100%;
                height: 100%;
                overflow: hidden;     
                position: relative;
                white-space: nowrap;   
            }
        }
        .tabs-nav {
            color: @text-color;
            display: inline-block;
            margin-right: 30px;
            font-size: 14px;
            cursor: pointer;
            position: relative;
            &.active {
                color: @primary-color;
                &:after {
                    position: absolute;
                    content: '';
                    left: 50%;
                    margin-left: -35px;
                    bottom: -8px;
                    width: 70px;
                    height: 3px;
                    background: @primary-color;
                    border-radius:2px;
                }
            }
        }
        .tabs-bread {
            cursor: pointer;
            color: @btn-disable-color;
            font-size: 12px;
            position: absolute;
            right: 0;
            top: 2px;
            i {
                vertical-align: middle;
                display: inline-block;
                margin-top: -1px;
            }
        }
    }
    .ivu-table{
        overflow: auto;
        .ivu-checkbox-wrapper {
            margin-right: 0;
        }
    }
    .ivu-table-cell{
        padding: 10px;
        line-height: 1.3;
    }
    .ivu-table:before{
        height: 0px;
    }
    .ivu-table:after{
        width: 0px;
    }
    .ivu-table-row-hover td{
        background-color:@white-color-light;
    }
    .ivu-table-header {
        th:first-child {
            .ivu-table-cell {
                display: none;
            }
        }
    }
    .ivu-table-header .ivu-checkbox{
        display: none;
    }
    .id-column{
        // visibility: hidden;
        // width: 0;
        overflow: hidden;
        // font-size: 0;
        .ivu-table-cell {
            display: none;
        }
    }
    .table-count {
        border-top: none;
    }
    .table-statistics {
        height: 50px;
        line-height: 50px;
        .checkout-note {
            font-size: 12px;
            .check-num {
                color: @primary-color
            }
        }
    }
}

.select-tree-input2 {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    padding: 4px 35px 4px 7px;
    font-size: 12px;
    border: 1px solid @border-color;
    border-radius: 4px;
    color: @gray-color-dark;
    background-color: @white-color;
    background-image: none;
    position: relative;
    line-height: 22px;
    transition: all 0.2s ease-in-out;

    &:hover {
        border-color: @input-select-border-color;
    }
    &.ellipsis {
        height: 32px;
    }
    &.disabled {
        color: @btn-disable-color;
    }
    .icon-add {
        position: absolute;
        height: 30px;
        font-size: 14px;
        line-height: 30px;
        top: 50%;
        margin-top: -15px;
        width: 30px;
        background-color: @white-color;
        color: @gray-color-normal;
        right: 1px;
        text-align: center;
    }
    .tag {
        padding: 0 10px 0 6px;
        color: @gray-color-medium;
        background-color: @white-color-dark;
        margin:2px 10px 2px 2px;
        line-height: 19px;
        display: inline-block;
        position: relative;
        i {
            display: none;
            color: @error-color;
            position: absolute;
            right: -6px;
            top: 50%;
            margin-top: -7px;
            background: @white-color;
            border-radius: 50%;
            padding: 1px;
            font-size: 12px;
        }
        &:hover > i {
            display: block;
        }
    }
}

</style>
<style lang="less" scoped>
.summary-new {
    padding: 20px;
   
    .search-form {
        line-height: normal;
        .ivu-form-item {
            margin-bottom: 20px;
            margin-right: 10px;
        }
        .search-btn {
            position: static!important;
            button {
                margin-left: 0!important;
            }
        }
    }
}
</style>
