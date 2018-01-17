<template>
    <div class="logger-create">
        <Form :label-width="110" >
            <FormItem label="日志日期">
                 <DatePicker type="date"
                    placement="bottom-start"
                    placeholder="日期" 
                    class="date-wrap"
                    :options="dateOption"
                    v-model="dateValue"
                    :clearable="false"
                    >
                </DatePicker>
            </FormItem>
            <FormItem label="可见范围" class="required-icon">
                <select-member-input 
                    :dept="deptRange"
                    :group="groupRange"
                    :member="memberRange"
                    title="选择可见范围"
                    placeholder="本部门可见"
                    @handleSelectMember="handleSelectRange"
                    :ellipsis="false" 
                    :showDept="true" 
                    :showGroup="true" 
                    ref="selectDept"
                    />
            </FormItem>
            <FormItem v-if="templateContent.length" v-for="(item, index) in templateContent" :key="index" 
                :label="item.title | filterHtml" :class="item.isRequired==1?'required-icon':''">
                <template v-if="item.type == 'InputText'">
                    <Input :placeholder="item.deion" v-model="inputTextValue[index]" type="textarea" :autosize="{ minRows: 5, maxRows: 10}"/>
                </template>
                <template v-if="item.type == 'InputTextNum'">
                    <div class="ivu-input-wrapper ivu-input-type">
                        <input autocomplete="off" spellcheck="false" type="number" 
                        v-model="item.valueNum"
                        :placeholder="`${item.deion}${item.unit?`(单位：${item.unit})`:''}`" number="true" class="ivu-input">
                    </div>
                </template>
                <template v-if="item.type == 'InputRadio'">
                    <RadioGroup v-model="item.content">
                        <Radio v-for="(val, key) in item.options" :label="`${val.string}`" :key="key">{{val.string}}</Radio>
                    </RadioGroup>
                </template>
                <template v-if="item.type == 'InputCheckbox'">
                    <CheckboxGroup v-model="item.content">
                        <Checkbox v-for="(val, key) in item.options" 
                            :key="key"
                            :label="val.string">
                            </Checkbox>
                    </CheckboxGroup>
                </template>
                <template v-if="item.type == 'InputDate'">
                    <DatePicker type="date"
                        placement="bottom-start"
                        placeholder="日期" 
                        class="date-wrap"
                        v-model="item.dateValueSec"
                        :clearable="false"
                    >
                    </DatePicker>
                </template>
            </FormItem>

           
            <FormItem label="@TA查看">
                <select-member-input 
                    :member="member"
                    title="@TA查看"
                    placeholder="提醒关键人员查看您的日志"
                    @handleSelectMember="handleSelectMember"
                    :ellipsis="false" 
                    ref="selectMember"
                    />
            </FormItem>
            <FormItem label="附件">
                <template>
                    <Upload :action="uploadFile" :on-success="handleFileSuccess" :default-file-list="defaultFileList" :on-remove="handleRemoveFile">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                </template>
            </FormItem>
           
            <FormItem>
                <Button type="primary" class="submit-btn" @click="handleSubmit">
                    提交
                </Button>
                <Button type="ghost"  class="cancel-btn" @click="cancleSubmit">
                    取消
                </Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import SelectMemberInput from '../common/select-member-input/';
import config from 'app_src/config/config';
import FormatTime  from 'app_src/filters/format-time';
import HTMLDeCode from 'app_src/filters/HTMLDeCode';

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
            dateValue: new Date(),
            dateValueSec: new Date(),
            inputTextValue: [],
            valueNum: 0,
            dateOption: {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            uploadFile: `${config[__ENV__].apiHost}/logger/diaryFile/?token=` + this.$store.state.userInfo.token,
            fileStr: [],
            atStr: [],
            defaultFileList: [], //默认上传的文件
            submitData: {},
            saveDraft: false,
            editFlag: 0,
            summaryFlag: 0,
        }
    },
    components: {
        SelectMemberInput
    },
    filters: {
        filterHtml(val) {
            return HTMLDeCode(val);
        }
    },
    methods: {
        initData(templateItemData, templateContent) {
            window.createComplete = false;
            this.dateValue = templateItemData.diaryTime || new Date(); // 初始化日志日期
            this.initRange(templateItemData.range || []); // 初始化可选范围
            this.initAtMember(templateItemData); // 初始化at人 
            this.initDefaultFile(templateItemData) // 初始化文件
            this.initTemplateContent(templateContent) // 初始化可变表单
        },
        initRange(datalist) {
            let teamArray = [],
                depArrar = [],
                manArray = [];
            datalist && datalist.forEach((v, k) => {
                if (v.dataType == 1) { //部门
                    depArrar.push({
                        'deptId': v.teamId,
                        'deptName': v.teamName
                    });
                } else if (v.dataType == 3) { //团队
                    teamArray.push({
                        'groupId': v.teamId,
                        'groupName': v.teamName
                    });
                } else if (v.dataType == 4) { //个人
                    manArray.push({
                        'memberId': v.memberId,
                        'userName': v.userName
                    });
                }
            });
            this.deptRange = depArrar;
            this.groupRange = teamArray;
            this.memberRange = manArray;
        },
        initAtMember(templateItemData) { //初始化at人
            let atArr = templateItemData.at || [],
                atMember = [];
            atArr.forEach((v, k) => {
                atMember.push({
                    'memberId': v.memberId,
                    'userName': v.replayUserName
                })
            })
            this.member = atMember;
        },
        initTemplateContent(templateContent) { //初始化可变表单
            if(typeof templateContent == 'object') {
                templateContent && templateContent.forEach((v, k) => {
                    switch (v.type) {
                        case 'InputText':
                            v.value = HTMLDeCode(v.value)
                            this.inputTextValue[k] = v.value;
                            break;
                        case 'InputRadio':
                            v.content = v.content ? v.content : v.options[0].string;
                            break;
                        case 'InputCheckbox':
                            v.content = v.value ? v.content.split(',') : [];
                            break;
                        case 'InputTextNum':
                            v.valueNum = parseInt(v.value) || null;
                            break;
                        case 'InputDate':
                            v.dateValueSec = v.value ? new Date(v.value) : new Date();
                            break;
                        default:
                            break;
                    }
                })
            }
        },
        initDefaultFile(templateItemData) { //初始化文件列表
            let fileArr = templateItemData.fileStr || [];
            fileArr.forEach((v, k) => {
                this.defaultFileList.push({
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
                url: `/logger/diary/detail/${this.$route.params.id}`,
                success: (res) => {
                    if (res && res.code === 0) {
                        this.templateItemData = res.data || {};
                        this.templateContent = JSON.parse(res.data.content) || [];
                        this.initData(this.templateItemData, this.templateContent);
                    } else {
                        this.$Message.warning((res && res.msg) || '网络错误');
                    }
                },
                error: (res) => {
                    this.$Message.warning((res && res.msg) || '网络错误');
                }
            })
        },
        setTempListData() {
            this.templateItemData = this.$store.state.template.content || {};
            this.templateContent = JSON.parse(this.$store.state.template.content.content) || [];
            this.initData(this.templateItemData, this.templateContent);
        },
        loadData() {
            if (!this.$store.state.template.content.content && (this.$route.params.loggertype == 'edit' || this.$route.params.loggertype == 'draft')) {
                this.getTemplateApp();
            } else if (!this.$store.state.template.content.content && (this.$route.params.loggertype == 'create' || this.$route.params.loggertype == 'summary')) {
                this.$router.go(-1);
            } else {
                this.setTempListData();
            }
        },
        getVisibleRange() { //可见范围
            this.$ajax({
                url: '/logger/diary/lastVisibleRange',
                data: {
                    templateId: this.$route.params.id || 0
                },
                success: (res) => {
                    if (res && res.code === 0) {
                        let datalist = res.data.ranges || [];
                        this.initRange(datalist);
                    } else {
                        this.$Message.warning((res && res.msg) || '网络错误');
                    }
                },
                error: (res) => {
                    this.$Message.warning((res && res.msg) || '网络错误');
                }
            })
        },
        handleSelectMember(res) { //选人
            let keys = Object.keys(res);
            keys.forEach(key => {
                this[key] && (this[key] = res[key])
            })
        },
        handleSelectRange(res) { //选范围
            let keys = Object.keys(res);
            keys.forEach(key => {
                this[`${key}Range`] && (this[`${key}Range`] = res[key])
            })
        },
        handleFileSuccess(res, file) { //处理上传的文件数据
            let fileData = res.data[0] || [],
                defaultList = [];
            this.defaultFileList && this.defaultFileList.forEach((v, k) => {
                defaultList.push({
                    fileName: v.fileName,
                    fileSize: v.fileSize,
                    fileExtension: v.fileExtension,
                    fileKey: v.fileKey
                })
            });
            this.fileStr.push({
                fileName: file.name,
                fileSize: fileData.fileSize,
                fileExtension: fileData.fileExtension,
                fileKey: fileData.fileKey
            });
            this.fileStr = this.fileStr.concat(defaultList);
        },
        handleRemoveFile(file, fileList) { //处理移除文件
            fileList && fileList.forEach((v, k) => {
                this.fileStr.push({
                    fileName: v.fileName,
                    fileSize: v.fileSize,
                    fileExtension: v.fileExtension,
                    fileKey: v.fileKey
                })
            })
        },
        cancleSubmit() { //取消编辑
            this.$Modal.confirm({
                title: '取消编辑',
                content: '您的日志还没提交，确定要放弃编辑吗？',
                onOk: () => {
                    this.$router.push({
                        path: '/LoggerQueryAll',
                        query: {
                            token: this.$store.state.userInfo.token
                        }
                    });

                }
            });
        },
        handleSubmitData() { //处理提交数据
            let visibleRangeStr = [],
                submitContent = [],
                memberArr = [];
            this.deptRange.forEach((v, k) => {
                visibleRangeStr.push({
                    'teamId': v.deptId,
                    'teamName': v.deptName,
                    'dataType': 1
                })
            });
            this.groupRange.forEach((v, k) => {
                visibleRangeStr.push({
                    'teamId': v.groupId || v.gid,
                    'teamName': v.groupName,
                    'dataType': 3
                })
            });
            this.memberRange.forEach((v, k) => {
                visibleRangeStr.push({
                    'memberId': v.memberId,
                    'userName': v.userName,
                    'dataType': 4
                })
            });
            this.rangeArr = visibleRangeStr;
            this.templateContentClone = JSON.parse(JSON.stringify(this.templateContent));
            this.templateContentClone.forEach((v, k) => {
                if (v.type == 'InputText') {
                    v.value = this.inputTextValue[k];
                    v.content = this.inputTextValue[k];
                } else if (v.type == 'InputTextNum') {
                    v.content = v.valueNum;
                    v.value = v.valueNum;
                    if (v.valueNum) {
                        delete v.valueNum;
                    }
                } else if (v.type == 'InputRadio') {
                    v.options && v.options.forEach((value, key) => {
                        if (value.string == v.content) {
                            v.value = key;
                        }
                    })
                } else if (v.type == 'InputCheckbox') {
                    let valueArr = [];
                    v.options && v.options.forEach((value, key) => {
                        v.content && v.content.forEach((item, index) => {
                            if (value.string == v.content[index]) {
                                valueArr.push(key)
                            }
                        })
                    })
                    v.content = v.content && v.content.join(',');
                    v.value = valueArr.join(',');
                } else if (v.type == 'InputDate') {
                    v.value = FormatTime(new Date(v.dateValueSec), 'YYYY-MM-DD');
                    v.content = FormatTime(new Date(v.dateValueSec), 'YYYY-MM-DD');
                    if (v.dateValueSec) {
                        delete v.dateValueSec
                    }
                }
            })

            this.member.forEach((v, k) => {
                memberArr.push({
                    userName: v.userName,
                    memberId: v.memberId,
                    szId: 1
                })
            })
            this.atStr = memberArr;
        },
        handleValidate(templateContent) { //校验数据
            for (let i = 0, l = templateContent.length; i < l; i++) {
                if (templateContent[i].isRequired == 1) {
                    if ((templateContent[i].type != 'InputRadio' && templateContent[i].type != 'InputTextNum' && !templateContent[i].value) ||
                        ((templateContent[i].type == 'InputRadio' && templateContent[i].type == 'InputTextNum' && templateContent[i].value == ''))) {
                        this.$Message.warning(templateContent[i].title + '不能为空');
                        return false;
                    }
                }
            }
            return true;
        },
        handleSubmit() { // 提交
            this.handleSubmitData();
            if (!this.handleValidate(this.templateContentClone)) {
                return
            } else {
                window.createComplete = true;
                this.$store.dispatch('update_template_content', {
                    content: {
                        content: this.templateContentClone
                    }
                });
                this.submitData = {
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
                };
                console.log(this.submitData)
                this.editFlag ? this.submitData.id = this.templateItemData.id || 0 : '';
                let uri = `/logger/diary/diaryCommit`;

                if(this.saveDraft && this.editFlag) { // 即为草稿又为编辑
                    uri = `/logger/diary/edit`;
                } else if (this.saveDraft) { // 草稿 新增草稿情况下删除id
                    uri = `/logger/diary/diaryCommitDraft`
                    delete this.submitData.id;
                } else if (this.editFlag) { // 编辑
                    uri = `/logger/diary/edit`;
                    if(this.$route.params.loggertype == 'draft') { // 草稿编辑保存时需要多加一个字段dataStatus
                        this.submitData.dataStatus = 1;
                    }
                } else { // 其他 新增情况下删除id
                    uri = `/logger/diary/diaryCommit`;
                    delete this.submitData.id;
                }
                this.$ajax({
                    url: uri,
                    data: this.submitData,
                    type: 'post',
                    config: {
                         headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    },
                    success: (res) => {
                        if (res && res.code === 0) {
                            this.saveDraft ? this.$Message.success('日志草稿保存成功') : (this.editFlag ? this.$Message.success('日志修改成功') : this.$Message.success('日志创建成功'));
                            this.$router.push({
                                path:  this.saveDraft ? '/DraftOfMine' : '/LoggerQueryAll',
                                query: {
                                    token: this.$store.state.userInfo.token
                                }
                            });
                            console.log(this.saveDraft)
                            console.log(this.saveDraft ? '/DraftOfMine' : '/LoggerQueryAll')
                            console.log(this.$store.state.userInfo.token);
                        } else {
                            this.$Message.warning((res && res.msg) || '网络错误');
                        }
                    },
                    error: (res) => {
                        this.$Message.warning((res && res.msg) || '网络错误');
                    }

                })
            }

        },
    },
    mounted() {
        this.$eventbus.$on('saveDraftFun', () => { // 保存草稿
            this.saveDraft = true;
            this.handleSubmit();
        })
    },
    destroyed() {
        this.$eventbus.$off('saveDraftFun')
    },
    created() {
        if (this.$route.params.loggertype != 'edit') { // 非编辑情况
            this.getVisibleRange();
            if (this.$route.params.loggertype == 'draft') { // 草稿
                this.editFlag = 1;
            }
            if (this.$route.params.loggertype == 'summary') { // 汇总
                this.summaryFlag = 1;
            }
        } else { // 编辑情况
            this.editFlag = 1;
        }
        this.loadData();
    },
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.logger-create {
    .required-icon .ivu-form-item-label::before{
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
        font-size: 12px;
    }
}
</style>
<style lang="less" scoped>
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
        margin: 0 10px;
    }
    .draft-btn{
        margin: 0 5px;
    }
}
</style>


