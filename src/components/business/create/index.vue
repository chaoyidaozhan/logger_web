<template>
    <div class="logger-create">
        <Form :label-width="lang == 'en' ? 120 : 110" >
            <FormItem :label="`${$t('noun.logDate')}${isFill}`"
                :class="templateItemData.diaryTimeRequired===1?'required-icon':''"
                v-if="templateItemData.diaryTimeStatus">
                 <DatePicker type="date"
                    placement="bottom-start"
                    :placeholder="$t('noun.date')" 
                    class="date-wrap"
                    :options="dateOption"
                    v-model="dateValue"
                    :clearable="false"
                    >
                </DatePicker>
            </FormItem>
            <FormItem :label="$t('noun.visibleRange')" class="required-icon">
                <select-member-input 
                    :dept="deptRange"
                    :group="groupRange"
                    :member="memberRange"
                    :title="`${$t('operate.select')}${$t('noun.visibleRange')}`"
                    :placeholder="$t('placeholder.visibleToThisDepartment')"
                    @handleSelectMember="handleSelectRange"
                    :ellipsis="false" 
                    :showDept="true" 
                    :showGroup="true" 
                    ref="selectDept"
                    />
            </FormItem>
            <FormItem v-if="templateContent.length" v-for="(item, index) in templateContent" :key="index" 
                :label="item.title | filterHtml" :class="item.isRequired==1?'required-icon':''">
                <work-log-node :data="item" :transformList="transformList"></work-log-node>
            </FormItem>
            <FormItem :label="`@${$t('noun.someoneChecked')}`">
                <select-member-input 
                    :member="member"
                    :title="`@${$t('noun.someoneChecked')}`"
                    :placeholder="$t('placeholder.remindkeyPeopleToViewYourLog')"
                    @handleSelectMember="handleSelectMember"
                    :ellipsis="false" 
                    ref="selectMember"
                    />
            </FormItem>
            <FormItem :label="$t('operate.file')">
                <template v-if="uploadFile">
                    <Upload :action="uploadFile" :on-success="handleFileSuccess" :default-file-list="fileStr" :on-remove="handleRemoveFile">
                        <Button type="ghost" icon="ios-cloud-upload-outline">{{$t('operate.upload')}}</Button>
                    </Upload>
                </template>
            </FormItem>
           
            <FormItem>
                <Button type="primary" class="submit-btn" @click="handleSubmit" :loading="btnloading">
                    {{$t('operate.submit')}}
                </Button>
                <Button type="ghost"  class="cancel-btn" @click="cancleSubmit">
                    {{$t('operate.cancel')}}
                </Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import SelectMemberInput from 'app_component/common/select-member-input/'
import WorkLogNode from './item'
import config from 'app_src/config/config'
import FormatTime  from 'app_src/filters/format-time'
import HTMLDeCode from 'app_src/filters/HTMLDeCode'

export default {
    data() {
        return {
            templateContent: [],
            templateContentClone: [],
            templateItemData: [],
            deptRange: [],
            groupRange: [],
            memberRange: [],
            rangeArr: [],
            member: [],
            dateValue: null,
            dateValueSec: new Date(),
            valueNum: "",
            dateOption: {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now()
                }
            },
            uploadFile: null,
            fileStr: [],
            atStr: [],
            submitData: {},
            saveDraft: false,
            editFlag: 0,
            summaryFlag: 0,
            btnloading: false,
            transformList: null
        }
    },
    components: {
        SelectMemberInput,
        WorkLogNode
    },
    computed: {
        isFill() {
            if(!this.dateValue) {
                return ''
            }
            let now = (new Date()).valueOf()
            let selectTime = this.dateValue.valueOf()
            return Math.abs(now - selectTime) > (1000 * 60 * 60 * 48) ? `(${this.$t('operate.fill')})` : ''
        }
    },
    filters: {
        filterHtml(val) {
            return HTMLDeCode(val)
        }
    },
    methods: {
        keypress(e) {
            if (!String.fromCharCode(e.keyCode).match(/[0-9\.]/)) {
                e.preventDefault()
            }
        },
        initData(templateItemData, templateContent) {
            window.createComplete = false
            this.dateValue = templateItemData.diaryTimeDefault === 1 ? templateItemData.diaryTime || new Date() : ''
            this.initRange(templateItemData.range || templateItemData.diaryVisibleRanges || []) // 初始化可选范围
            this.initAtMember(templateItemData) // 初始化at人 
            this.initDefaultFile(templateItemData) // 初始化文件
            this.initTemplateContent(templateContent) // 初始化可变表单
        },
        initRange(datalist) {
            let teamArray = [],
                depArrar = [],
                manArray = []
            datalist && datalist.forEach((v, k) => {
                if (v.dataType == 1) { //部门
                    depArrar.push({
                        'deptId': v.teamId,
                        'deptName': v.teamName
                    })
                } else if (v.dataType == 3) { //内部群
                    teamArray.push({
                        'groupId': v.teamId,
                        'groupName': v.teamName
                    })
                } else if (v.dataType == 4) { //个人
                    manArray.push({
                        'memberId': v.memberId,
                        'userName': v.userName
                    })
                }
            })
            this.deptRange = depArrar
            this.groupRange = teamArray
            this.memberRange = manArray
        },
        initAtMember(templateItemData) { //初始化at人
            let atArr = templateItemData.at || [],
                atMember = []
            atArr.forEach((v, k) => {
                atMember.push({
                    'memberId': v.replyMemberId,
                    'userName': v.replayUserName,
                    'avatar': v.avatar,
                    'szId': v.szId || v.spaceId || v.qzId || ''
                })
            })
            this.member = atMember
        },
        initTemplateContent(templateContent) { //初始化可变表单
            if(typeof templateContent == 'object') {
                function trimContent(data) {
                    data && data.forEach((v,k)=>{
                        switch (v.type) {
                            case 'InputText':
                                v.value = HTMLDeCode(v.value)
                                v.content = HTMLDeCode(v.value)
                                break
                            case 'InputRadio':
                                v.content = v.content ? v.content : v.options[0].string
                                break
                            case 'InputCheckbox':
                                v.content = v.value ? v.content.split(',') : []
                                break
                            case 'InputTextNum':
                                v.valueNum = typeof +v.value === 'number' ? v.value : ""
                                break
                            case 'InputDate':
                                v.dateValueSec = v.value ? new Date(v.value) : new Date()
                                break
                            case 'InputContainer':
                                trimContent(v.children)
                                break
                            default:
                                break
                        }
                    })
                }
                trimContent(templateContent)
            }
        },
        initDefaultFile(templateItemData) { //初始化文件列表
            templateItemData.fileStr && 
            templateItemData.fileStr.forEach((v, k) => {
                this.fileStr.push({
                    'name': `${v.fileName}${v.fileExtension}`,
                    'url': v.fileKey,
                    'fileName': `${v.fileName}${v.fileExtension}`,
                    'fileSize': v.fileSize,
                    'fileExtension': v.fileExtension,
                    'fileKey': v.fileKey
                })
            })
        },
        getTemplateApp() { //获取编辑数据
            this.$ajax({
                url: `/diary/detail/${this.$route.params.id}`,
                success: (res) => {
                    if (res && res.code === 0) {
                        this.templateItemData = res.data || {}
                        this.templateContent = JSON.parse(res.data.content) || []
                        this.initData(this.templateItemData, this.templateContent)
                    } else {
                        this.$Message.warning((res && res.msg) || this.$t('status.networkError'))
                    }
                },
                error: (res) => {
                    this.$Message.warning((res && res.msg) || this.$t('status.networkError'))
                }
            })
        },
        setTempListData() {
            this.templateItemData = this.$store.state.template.content || {}
            this.templateContent = JSON.parse(this.$store.state.template.content.content) || []
            this.initData(this.templateItemData, this.templateContent)
        },
        loadData() {
            this.getTransformList()
            if (!this.$store.state.template.content.content && (this.$route.params.loggertype == 'edit' || this.$route.params.loggertype == 'draft')) {
                this.getTemplateApp()
            } else if (!this.$store.state.template.content.content && (this.$route.params.loggertype == 'create' || this.$route.params.loggertype == 'summary')) {
                window.createComplete = true
                this.$router.go(-1)
            } else {
                this.setTempListData()
            }
        },
        getTransformList() {
            this.$ajax({
                url: '/diaryQuery/getTransformList',
                success: (res) => {
                    if (res && res.code === 0) {
                        this.transformList = res.data
                    } else {
                        this.$Message.warning((res && res.msg) || this.$t('status.networkError'))
                    }
                },
                error: (res) => {
                    this.$Message.warning((res && res.msg) || this.$t('status.networkError'))
                }
            })
        },
        getVisibleRange() { //可见范围
            this.$ajax({
                url: '/diary/lastVisibleRange',
                data: {
                    templateId: this.$route.params.id || 0
                },
                success: (res) => {
                    if (res && res.code === 0) {
                        let datalist = res.data.ranges || []
                        this.initRange(datalist)
                    } else {
                        this.$Message.warning((res && res.msg) || this.$t('status.networkError'))
                    }
                },
                error: (res) => {
                    this.$Message.warning((res && res.msg) || this.$t('status.networkError'))
                }
            })
        },
        handleSelectMember(res) { //选人
            let keys = Object.keys(res)
            keys.forEach(key => {
                this[key] && (this[key] = res[key])
            })
        },
        handleSelectRange(res) { //选范围
            let keys = Object.keys(res)
            keys.forEach(key => {
                this[`${key}Range`] && (this[`${key}Range`] = res[key])
            })
        },
        handleFileSuccess(res, file) { //处理上传的文件数据
            let fileData = res.data[0] || []
            this.fileStr.push({
                name: file.name,
                url: fileData.fileKey,
                fileName: file.name,
                fileSize: fileData.fileSize,
                fileExtension: fileData.fileExtension,
                fileKey: fileData.fileKey
            })
        },
        handleRemoveFile(file, fileList) { //处理移除文件
            this.fileStr = this.fileStr.filter((item) => {
                return item.fileName !== file.fileName
            })
        },
        cancleSubmit() { //取消编辑
            this.$Modal.confirm({
                title: this.$t('toast.cancelEditing'),
                content: this.$t('toast.cancelEditingConfirm'),
                onOk: () => {
                    window.createComplete = true
                    this.$router.go(-1)
                }
            })
        },
        handleSubmitData() { //处理提交数据
            let visibleRangeStr = [],
                submitContent = [],
                memberArr = []
            this.deptRange.forEach((v, k) => {
                visibleRangeStr.push({
                    'teamId': v.deptId,
                    'teamName': v.deptName,
                    'dataType': 1,
                    'visibleType': 0
                })
            })
            this.groupRange.forEach((v, k) => {
                visibleRangeStr.push({
                    'teamId': v.groupId || v.gid,
                    'teamName': v.groupName,
                    'dataType': 3,
                    'visibleType': 0
                })
            })
            this.memberRange.forEach((v, k) => {
                visibleRangeStr.push({
                    'memberId': v.memberId,
                    'userName': v.userName,
                    'dataType': 4,
                    'visibleType': 0
                })
            })
            // @人范围加入可见范围
            this.member.forEach((item) => {
                visibleRangeStr.push({
                    'memberId': item.memberId,
                    'userName': item.userName,
                    'dataType': 4,
                    'visibleType': 1
                })
            })
            this.rangeArr = visibleRangeStr
            this.templateContentClone = JSON.parse(JSON.stringify(this.templateContent))
            if(typeof this.templateContentClone == 'object') {
                function trimContent(data) {
                    data && data.forEach((v, k)=>{
                        switch (v.type) {
                            case 'InputText':
                                v.value = v.content
                                break
                            case 'InputTextNum':
                                v.content = v.valueNum
                                v.value = v.valueNum
                                if (v.valueNum != undefined) {
                                    delete v.valueNum
                                }
                                break
                            case 'InputRadio':
                                v.options && v.options.forEach((value, key) => {
                                    if (value.string == v.content) {
                                        v.value = key
                                        v.checked= "" + key
                                    }
                                })
                                break
                            case 'InputCheckbox':
                                let valueArr = []
                                v.options && v.options.forEach((value, key) => {
                                    v.content && v.content.forEach((item, index) => {
                                        if (value.string == v.content[index]) {
                                            valueArr.push(key)
                                        }
                                    })
                                })
                                v.content = v.content && v.content.join(',')
                                v.value = valueArr.join(',')
                                v.checked = valueArr.join(',')
                                break
                            case 'InputDate':
                                v.value = FormatTime(new Date(v.dateValueSec), 'YYYY-MM-DD')
                                v.content = FormatTime(new Date(v.dateValueSec), 'YYYY-MM-DD')
                                if (v.dateValueSec) {
                                    delete v.dateValueSec
                                }
                                break
                            case 'InputContainer':
                                trimContent(v.children)
                                break
                            default:
                                break
                        }
                    })
                }
                trimContent(this.templateContentClone)
            }

            this.member.forEach((v, k) => {
                memberArr.push({
                    userName: v.userName,
                    memberId: v.memberId,
                    szId: v.szId || v.spaceId || v.qzId || ''
                })
            })
            this.atStr = memberArr
        },
        handleValidate(templateContent) { //校验数据
            const _this = this
            function validate(content) {
                if(content && content.length) {
                    for (let i = 0, l = content.length; i < l; i++) {
                        if (content[i].isRequired == 1 
                            && content[i].type !== 'InputContainer'
                            && content[i].type !== 'InputRadio'
                            && !content[i].value) {
                            _this.$Message.warning(content[i].title + _this.$t('toast.canNotBeEmpty'))
                            return false
                        }
                        if(content[i].type === 'InputContainer') {
                            return validate(content[i].children || [])
                        }
                    }
                }
                return true
            }
            return validate(templateContent)
        },
        handleSubmit() { // 提交
            this.handleSubmitData()
            if (!this.handleValidate(this.templateContentClone)) {
                return
            } else {
                window.createComplete = true
                this.$store.dispatch('update_template_content', {
                    content: {
                        content: this.templateContentClone
                    }
                })
                let submitData = {
                    gather: this.summaryFlag ? 1 : 0, //是否是汇总日志 0：否 1：是
                    diaryTime: FormatTime(new Date(this.dateValue), "YYYY-MM-DD"),
                    templateName: this.templateItemData.title || this.templateItemData.templateName,
                    version: this.templateItemData.version,
                    source: 3, //1 安卓   2 ios    3web    4微信
                    templateId: !this.editFlag ? this.$route.params.id || 0 : this.templateItemData.templateId || 0,
                    id: this.$route.params.id,
                    visibleRange: this.rangeArr.length <= 0 ? 3 : 1,
                    visibleRangeStr: JSON.stringify(this.rangeArr),
                    dataType: this.templateItemData.dataType, // ["其他", "日报", "周报", "月报"]
                    fileStr: JSON.stringify(this.fileStr),
                    content: JSON.stringify(this.templateContentClone),
                    atStr: JSON.stringify(this.atStr)
                }
                this.editFlag ? submitData.id = this.templateItemData.id || 0 : ''
                let uri = `/diary/diaryCommit`

                if(this.saveDraft && this.editFlag) { // 即为草稿又为编辑
                    uri = `/diary/edit`
                    submitData.dataStatus = 0
                } else if (this.saveDraft) { // 草稿 新增草稿情况下删除id
                    uri = `/diary/diaryCommitDraft`
                    delete submitData.id
                } else if (this.editFlag) { // 编辑
                    uri = `/diary/edit`
                    if(this.$route.params.loggertype == 'draft') { // 草稿编辑保存时需要多加一个字段dataStatus
                        submitData.dataStatus = 1
                    }
                } else { // 其他 新增情况下删除id
                    uri = `/diary/diaryCommit`
                    delete submitData.id
                }
                this.btnloading = true

                this.$ajax({
                    url: uri,
                    data: submitData,
                    type: 'post',
                    requestBody: true,
                    success: (res) => {
                        if (res && res.code === 0) {
                            this.saveDraft ? this.$Message.success(this.$t('toast.theDraftOfTheLogWasSavedSuccessfully')) : (this.editFlag && !submitData.dataStatus ? this.$Message.success(this.$t('toast.theLogWasSuccessfullyModified')) : this.$Message.success(this.$t('toast.theLogWasCreatedSuccessfully')))
                            this.$router.push({
                                path:  this.saveDraft ? '/DraftOfMine' : '/LoggerQueryAll',
                                query: {
                                    token: this.$store.state.userInfo.token
                                }
                            })
                        } else {
                            this.$Message.warning((res && res.msg) || this.$t('status.networkError'))
                        }
                        this.btnloading = false
                    },
                    error: (res) => {
                        this.$Message.warning((res && res.msg) || this.$t('status.networkError'))
                        this.btnloading = false
                    }
                })
            }

        },
    },
    mounted() {
        let host = `${window.location.protocol}//${window.location.host}/logger`
        this.uploadFile = `${host}/diaryFile/?token=` + this.$store.state.userInfo.token

        this.$eventbus.$on('saveDraftFun', () => { // 保存草稿
            this.saveDraft = true
            this.handleSubmit()
        })
    },
    destroyed() {
        this.$eventbus.$off('saveDraftFun')
    },
    created() {
        if (this.$route.params.loggertype != 'edit') { // 非编辑情况
            if(this.$route.params.loggertype != 'draft') {
                this.getVisibleRange()
            }
            if (this.$route.params.loggertype == 'draft') { // 草稿
                this.editFlag = 1
            }
            if (this.$route.params.loggertype == 'summary') { // 汇总
                this.summaryFlag = 1
            }
        } else { // 编辑情况
            this.editFlag = 1
        }
        this.loadData()
    },
}
</script>
<style lang="less">
@import '../../../assets/css/var.less';
.logger-create {
    .required-icon .ivu-form-item-label::before, 
    .required-icon .label::before {
        content: '*';
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #fd838a;
    }
    .ivu-form .ivu-form-item-label{
        font-size: 14px!important;
        line-height: 1.2;
    }
    .ivu-upload-list-remove{
        line-height: inherit;
    }
    .ivu-date-picker, .ivu-input-number {
        width: 100%;
    }
    .ivu-form-item-content {
        line-height: 31px;
    }
    textarea.ivu-input {
        resize: none;
        font-size: 14px;
        line-height: 22px;
        padding: 4px 40px 4px 7px;
    }
}
</style>
<style lang="less">
@import '../../../assets/css/var.less';
.logger-create{
    // max-width: 900px;
    width:100%;
    padding: 0 10px;
    .ivu-form  {
        .ivu-form-item {
            margin-bottom: 12px;
        }
        .ivu-form-item-label {
            font-size: 14px;
        }
        .ivu-form-item-content {
            line-height: 31px;
        }
    }
    .ivu-btn {
        min-width: 65px;
        height: 31px;
    }
    .submit-btn{
        margin: 0 5px 0 0;
    }
    .cancel-btn{
    }
}
</style>
