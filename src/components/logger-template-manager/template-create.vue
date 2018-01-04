<template>
    <div class="logger-template-create" :class="{disabled: editDisable}">
        <!-- 控件列表 -->
        <div class="main pull-left">
            <div class="main-inner" ref="advacedPush">
                <div class="drag-item" @click="handleChangeCurrentItem($event, item)" v-for="(item, index) in pushList" :key="index">
                    <label class="drag-label"><i v-if="item.isRequired != '0'">*</i>{{item.title}}</label>
                    <template v-if="item.type == 'InputText'">
                        <Input :placeholder="item.description" type="textarea" :autosize="{ minRows: 5}"/>
                    </template>
                    <template v-if="item.type == 'InputTextNum'">
                        <Input :placeholder="item.description" type="text"/>
                    </template>
                    <template v-if="item.type == 'InputRadio'">
                        <RadioGroup>
                            <Radio v-for="(val, key) in item.options" :key="key" :label="val.string" ></Radio>
                        </RadioGroup>
                    </template>
                    <template v-if="item.type == 'InputCheckbox'">
                        <CheckboxGroup>
                            <Checkbox v-for="(val, key) in item.options" :key="key">
                                {{val.string}}
                            </Checkbox>
                        </CheckboxGroup>
                    </template>
                    <template v-if="item.type == 'InputDate'">
                        <DatePicker type="date"
                            placement="bottom-start"
                            placeholder="请选择日期" 
                            class="date-wrap"
                            :clearable="false">
                        </DatePicker>
                    </template>
                    <div class="mask" v-if="(currentItem && currentItem.id) == item.id">
                        <Icon type="close" @click.native="handleDelete($event, item, index)"></Icon>
                    </div>
                </div>
            </div>
        </div>
        <!-- 控件菜单 -->
        <div class="sub pull-left">
            <span class="title">控件</span>
            <div class="nav" ref="advacedPull">
                <div class="drag-item" v-for="(item, index) in pullList" :key="index">
                    <i class="icon-control-text" v-if="item.type == 'InputText'"></i>
                    <i class="icon-control-textfield" v-if="item.type == 'InputTextNum'"></i>
                    <i class="icon-control-radiobutton" v-if="item.type == 'InputRadio'"></i>
                    <i class="icon-control-checkbox" v-if="item.type == 'InputCheckbox'"></i>
                    <i class="icon-control-date" v-if="item.type == 'InputDate'"></i>
                    {{item.title.substring(0, 4)}}
                </div>
            </div>
        </div>
        <!-- 控件设置-->
        <div class="extra pull-left">
            <Tabs>
                <TabPane label="控件设置">
                    <div v-if="currentItem">
                        <div class="extra-item">
                            <label class="extra-label">标题</label>
                            <Input placeholder="不超过10个字" :maxlength="10" v-model="currentItem.title" type="text"/>
                        </div>
                        <div class="extra-item" v-if="currentItem.type == 'InputText' || currentItem.type == 'InputTextNum'">
                            <label class="extra-label">提示文字</label>
                            <Input placeholder="不超过50个字" :autosize="{ minRows: 3}" :maxlength="50" v-model="currentItem.description" type="textarea"/>
                        </div>
                        <div class="extra-item" v-if="currentItem.type == 'InputRadio' || currentItem.type == 'InputCheckbox'">
                            <label class="extra-label">选项<span>(至少2项至多10项)</span></label>
                            <ul class="extra-group-check">
                                <li v-for="(item, index) in currentItem.options" :key="index">
                                    <Input :maxlength="20" placeholder="请填写选项名" v-model="item.string" type="text"/>
                                    <Icon v-if="currentItem.options.length > 2" 
                                        type="ios-minus-outline" 
                                        @click.native="handleDeleteOptions(index)" />
                                </li>
                            </ul>
                            <Button type="ghost" long :disabled="!(currentItem.options.length < 10)" @click="handleAddOptions">
                                添加选项
                            </Button>
                        </div>
                        <div class="extra-item">
                            <Checkbox @on-change="handleChangeRequired" v-model="isRequired">
                                必填
                            </Checkbox>
                        </div>
                    </div>
                    <fs-empty-tips v-else emptyMsg="还没有控件哦～请选择控件" iconType="template"/>
                </TabPane>
                <TabPane label="模板设置">
                    <div>
                        <div class="extra-item">
                            <label class="extra-label"><i>*</i>模板名称</label>
                            <Input placeholder="不超过10个字" :maxlength="10" v-model="data.title" type="text"/>
                        </div>
                        <div class="extra-item">
                            <label class="extra-label">模板说明</label>
                            <Input placeholder="不超过20个字" :maxlength="20" v-model="data.describe" type="text"/>
                        </div>
                        <div class="extra-item">
                            <label class="extra-label">可见范围</label>
                            <select-member-input 
                                :dept="deptRange"
                                :group="groupRange"
                                :member="memberRange"
                                title="选择可见范围"
                                placeholder="本部门可见"
                                :ellipsis="false" 
                                :showDept="true" 
                                :showGroup="true" 
                                ref="selectDept"
                                @handleSelectMember="handleSelectRange"
                                />
                        </div>
                        <div class="extra-item">
                            <label class="extra-label">模板类型</label>
                            <RadioGroup v-model="data.dataType">
                                <Radio v-for="(val, key) in options" :key="key" :label="val.dataType" >{{val.string}}</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <Modal :width="300" class-name="template-modal" :mask-closable="false" :closable="false" v-model="showSuccessModal">
            <p>保存成功</p>
            <div slot="footer">
                <Button type="primary" @click="onOk">返回模板管理</Button>
                <Button type="ghost" @click="onCancel">继续编辑</Button>
            </div>
        </Modal>
        <Modal :width="580" class-name="preview-modal" v-model="showPreviewModal">
            <RadioGroup class="tab-radio" v-model="previeWeb" type="button">
                <Radio label="0">web端</Radio>
                <Radio label="1">移动端</Radio>
            </RadioGroup>
            <div class="main-inner" :class="previeWeb == '0' ? 'web-inner' : 'mobile-inner'">
                <div class="mobile-title" v-if="previeWeb != '0'">
                    <i class="icon-arrow-left"></i>
                    写日志
                </div>
                <div v-html="previewHtml"></div>
                <img v-if="previeWeb != '0'" src="../../assets/images/preview-mobile.png">
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
import Sortable from 'sortablejs';
import FsEmptyTips from 'app_component/common/empty-tips';
import SelectMemberInput from 'app_component/common/select-member-input/';

export default {
    data() {
        return {
            data: {
                title: '',
                describe: '',
                dataType: 1,
                visibleRange: 0,
                visibleRangeStr: [],
                source: 3,
                id: ''
            },
            pullList: [ // 默认数据
                {
                    "size": 0,
                    "description": "请输入",
                    "title": "文本输入框",
                    "isRequired": "0",
                    "value": "",
                    "content": "",
                    "type": "InputText"
                }, {
                    "type": "InputTextNum",
                    "description": "请输入",
                    "unit": "",
                    "size": 0,
                    "title": "数字输入框",
                    "isRequired": "0",
                    "value": "",
                    "content": ""
                }, {
                    "options": [{
                        "string": "选项1"
                    }, {
                        "string": "选项2"
                    }, {
                        "string": "选项3"
                    }],
                    "checked": 0,
                    "type": "InputRadio",
                    "title": "单选框",
                    "isRequired": "0",
                    "value": "",
                    "content": ""
                }, {
                    "options": [{
                        "string": "选项1"
                    }, {
                        "string": "选项2"
                    }, {
                        "string": "选项3"
                    }],
                    "type": "InputCheckbox",
                    "title": "复选框",
                    "isRequired": "0",
                    "value": "",
                    "content": ""
                }, {
                    "dateType": "1",
                    "type": "InputDate",
                    "title": "日期",
                    "isRequired": "0",
                    "value": "",
                    "content": ""
                }
            ],
            pushList: [],
            currentItem: null,
            isRequired: false,
            options: [
                {
                    string: '日报',
                    dataType: 1
                },
                {
                    string: '周报',
                    dataType: 2
                },
                {
                    string: '月报',
                    dataType: 3
                },
                {
                    string: '其他',
                    dataType: 4
                },
            ],
            deptRange: [],
            groupRange: [],
            memberRange: [],
            showSuccessModal: false,
            showPreviewModal: false,
            previewHtml: null,
            previeWeb: '0',
            editDisable: false,
        }
    },
    components: {
        FsEmptyTips,
        SelectMemberInput
    },
    methods: {
        removeNode(node) { // 移除节点
            node.parentElement.removeChild(node);
        },
        insertNodeAt(fatherNode, node, position) { // 插入节点
            let refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
            fatherNode.insertBefore(node, refNode);
        },
        handleDragAdd(evt) { // 新增数据的时候
            this.removeNode(evt.item);
            let timesmap = (new Date()).valueOf();
            let newItem = JSON.parse(JSON.stringify(this.pullList[evt.oldIndex]))
            newItem.id = timesmap;
            this.currentItem = newItem;
            this.pushList.splice(evt.newIndex, 0, newItem);
        },
        handleDelete(evt, item, index) { // 删除节点
            evt.preventDefault();
            evt.stopPropagation();
            this.currentItem = this.pushList[index + 1] ? this.pushList[index + 1] : this.pushList[index - 1];
            this.pushList.splice(index, 1);
        },
        handleDeleteOptions(index) { // 删除选项
            this.currentItem.options.splice(index, 1);
        },
        handleAddOptions() { // 添加选项
            this.currentItem.options.push({
                string: '选项'
            })
        },
        handleChangeRequired() { // 是否必填
            this.currentItem.isRequired = this.isRequired ? '1' : '0';
        },
        handleChangeCurrentItem(evt, item) { // 更改当前Item
            evt.stopPropagation();
            if(item.isRequired != '0') {
                this.isRequired = true;
            } else {
                this.isRequired = false;
            }
            this.currentItem = item;
        },
        handleDragUpdate(evt) { // 更新数据的时候
            this.removeNode(evt.item);
            this.insertNodeAt(evt.from, evt.item, evt.oldIndex);
            this.pushList.splice(evt.newIndex, 0, this.pushList.splice(evt.oldIndex, 1)[0]);
        },
        initDragItem() { // 拖拽初始化
            let _this = this;
            Sortable.create(this.$refs.advacedPull, {
                sort: false,
                group: {
                    name: 'advanced',
                    pull: 'clone',
                    put: false
                },
                chosenClass: "sortable-chosen-nav",
                animation: 150
            })
            Sortable.create(this.$refs.advacedPush, {
                group: {
                    name: 'advanced',
                    pull: false,
                    put: true
                },
                onUpdate: function (evt) {
                    _this.handleDragUpdate(evt);
                },
                onAdd: function (evt) {
                    _this.handleDragAdd(evt);
                },
                animation: 150
            })
        },
        handleSelectRange(res){ // 选范围
            let keys = Object.keys(res);
            keys.forEach(key=>{
                this[`${key}Range`] && (this[`${key}Range`] = res[key])
            })
        },
        trimVisibleRangeStr() { // 提交整理范围数据
            let visibleRangeStr = [];
            this.deptRange.forEach((item)=>{
                visibleRangeStr.push({
                    dataType: 1,
                    teamId: item.deptId,
                    teamName: item.deptName,
                })
            })
            this.groupRange.forEach((item)=>{
                visibleRangeStr.push({
                    dataType: 3,
                    teamId: item.groupId,
                    teamName: item.groupName,
                })
            })
            this.memberRange.forEach((item)=>{
                visibleRangeStr.push({
                    dataType: 4,
                    memberId: item.memberId,
                })
            })
            if(visibleRangeStr.length) {
                this.data.visibleRange = 1;
            } else {
                this.data.visibleRange = 0;
            }
            this.data.visibleRangeStr = JSON.stringify(visibleRangeStr);
        },
        onOk() { // 返回模板列表
            this.showSuccessModal = false;
            this.$emit('handleDataStatus', this.data.dataStatus);
            this.$router.push({
                path: `/LoggerTemplate/manager`,
                query: {
                    token: this.$store.state.userInfo.token
                }
            });
        },
        onCancel() { // 继续编辑
            this.showSuccessModal = false;
            this.$emit('handleDataStatus', this.data.dataStatus);
            if(this.data.dataStatus) { // 如果dataStatus为1模板禁用
                this.editDisable = true;
            }
        },
        handlePreview() {
            this.showPreviewModal = true;
            this.previewHtml = this.$refs.advacedPush.innerHTML;
        },
        handleStop() {  // 停用模板
            let templateId = this.$route.params.id || 0;
            this.$ajax({
                url: '/logger/template/stop',
                type: 'post',
                data: { 
                    id: templateId
                },
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.data.dataStatus = 0;
                        this.editDisable = false;
                        this.$emit('handleLoading');
                        this.$emit('handleDataStatus', this.data.dataStatus);
                    } else {
                        this.$Message.error(res && res.msg || '网络错误');
                    }
                },
                error: (res)=>{
                    this.$Message.error(res && res.msg || '网络错误');
                }
            })
           
        },
        handleSubmit(dataStatus, call) { // 保存数据
            let templateId = this.$route.params.id || 0;
            this.trimVisibleRangeStr();
            if(dataStatus) {
                this.data.dataStatus = dataStatus || 0;
            }
            let params = {
                content: JSON.stringify(this.pushList),
                ...this.data
            }
            if(!params.title.trim()) {
                return this.$Message.error('请输入模板名称');
            }
            call && call();
            if(templateId != -1) {
                this.$ajax({
                    url: '/logger/template/edit',
                    type: 'post',
                    data: { ...params },
                    success: (res)=>{
                        if(res && res.code == 0) {
                            this.currentItem = null;
                            this.showSuccessModal = true;
                        } else {
                            this.$Message.error(res && res.msg || '网络错误');
                        }
                        this.$emit('handleLoading');
                    },
                    error: (res)=>{
                        this.$Message.error(res && res.msg || '网络错误');
                    }
                })
            } else {
                this.$ajax({
                    url: '/logger/template/add',
                    type: 'post',
                    data: { ...params },
                    success: (res)=>{
                        if(res && res.code == 0) {
                            this.currentItem = null;
                            this.showSuccessModal = true;
                            this.$router.push({
                                path: `/LoggerTemplate/operate/${res.data && res.data.id || '-1'}`,
                                query: {
                                    token: this.$store.state.userInfo.token
                                }
                            });
                            this.initData(res);
                        } else {
                            this.$Message.error(res && res.msg || '网络错误');
                        }
                        this.$emit('handleLoading');
                    },
                    error: (res)=>{
                        this.$Message.error(res && res.msg || '网络错误');
                    }
                })
            }
        },
        initRange(datalist) { // 初始化范围数据
            let teamArray = [], depArrar = [], manArray = [];
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
        initData(res) { // 初始化模板对应数据
            if(res && res.code == 0) {
                this.pushList = JSON.parse(res.data && res.data.content);
                let resData = res.data && res.data;
                this.initRange(resData.templateVisibleRange)
                this.data = { // 当前模板对应数据
                    title: resData.title,
                    describe: resData.describe,
                    dataType: resData.dataType,
                    visibleRange: resData.visibleRange,
                    visibleRangeStr: resData.templateVisibleRange,
                    source: resData.title,
                    id: resData.id,
                    dataStatus: resData.dataStatus
                }
                if(this.data.dataStatus) { // 如果dataStatus为1模板禁用
                    this.editDisable = true;
                }
                this.$emit('handleDataStatus', resData.dataStatus);
            }
            this.$emit('handleLoading');
        },
        init() { // 模板初始化
            let templateId = this.$route.params.id;
            if(templateId != -1) { // 当为编辑时请求接口初始化数据
                this.$ajax({
                    url: `/logger/template/detail/${templateId}`,
                    success: (res)=>{
                        this.initData(res);
                    },
                    error: (res)=>{
                        this.$Message.error(res && res.msg || '网络错误');
                    }
                })
            } else {
                this.$emit('handleDataStatus', 0)
                this.$emit('handleLoading');
            }
        }
    },
    
    mounted () {
        this.$nextTick(()=>{
            this.init();
            this.initDragItem();
        })
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.box-shadow {
    box-shadow: 0 1px 10px @box-shadow;
}
.logger-template-create {
    width: 100%;
    height: 100%;
    padding: 10px;
    background-color: @white-color-light;
    position: relative;
    &.disabled:after {
        position: absolute;
        content: '';
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(80,80,80,.1);
        cursor: not-allowed;
        z-index: 1000;
    }
    .sub {
        width: 70px;
        height: 100%;
        border-radius: 5px;
        background-color: @white-color;
        margin-left: -100%;
        overflow: hidden;
        .box-shadow;
        font-size: 0;
        .title {
            width: 100%;
            background-color: @white-color-light;
            color:@gray-color-dark;
            display: inline-block;
            font-size: 14px;
            text-align: center;
            line-height: 40px;
            box-shadow: 0 0 10px @box-shadow;
        }
        .nav {
            font-size: 14px;
            position: relative;
            z-index: 10;
            .drag-item {
                display: inline-block;
                height: 70px;
                text-align: center;
                width: 100%;
                cursor: move;
                color: @gray-color-light;
                padding: 12px 0;
                transition: .2s ease all;
                border: 1px dashed transparent;
                i {
                    display: block;
                    margin-bottom: 4px;
                    font-size: 25px;
                }
                &:hover {
                    border: 1px dashed @drag-border-color;
                    background-color: @drag-bg-color;
                }
            }
        }
    }
    textarea.ivu-input {
        resize: none;
        font-size: 12px;
    }
    .extra {
        width: 250px;
        height: 100%;
        border-radius: 5px;
        background-color: @white-color;
        margin-left: -250px;
        .box-shadow;
        .extra-item {
            padding: 0 10px;
            margin-bottom: 10px;
            .extra-label {
                display: block;
                font-size: 14px;
                padding: 10px 12px 10px 0;
                span {
                    color: @gray-color-light;
                }
                i {
                    vertical-align: middle;
                    color: @drag-close-color;
                }
            }
            .ivu-checkbox-wrapper {
                font-size: 14px;
            }
            .extra-group-check {
                li {
                    margin-bottom: 10px;
                    position: relative;
                    input {
                        padding-right: 30px;
                    }
                    i {
                        color: @error-color;
                        font-size: 20px;
                        position: absolute;
                        right: 10px;
                        top: 50%;
                        cursor: pointer;
                        margin-top: -10px;
                    }
                }
            }
        }
        .empty-tips {
            margin-top: 40%;
        }
        .ivu-tabs-bar {
            margin-bottom: 0;
        }
        .ivu-tabs-nav {
            width: 100%;
            background-color: @white-color-light;
        }
        .ivu-tabs-tab {
            width: 47%;
            text-align: center;
            &:hover {
                color: @primary-color;
            }
        }
    }
    .main {
        height: 100%;
        width: 100%;
        border-radius: 5px;
    }
}
.main-inner {
    background-color: @white-color;
    height: 100%;
    margin-left: 80px;
    margin-right: 260px;
    border-radius: 5px;
    overflow: auto;
    padding-bottom: 20px;
    .box-shadow;
    .drag-item {
        position: relative;
        cursor: pointer;
        padding: 0 10px 10px;
        margin-bottom: 5px;
        .drag-label {
            display: block;
            font-size: 14px;
            padding: 10px 12px 10px 0;
            i {
                vertical-align: middle;
                color: @drag-close-color;
            }
        }
        .ivu-radio-wrapper, .ivu-checkbox-wrapper {
            margin-right: 20px;
            margin-bottom: 2px;
            font-size: 14px;
        }
        textarea {
            height: 115px; 
            min-height: 115px;
            resize: none;
        }
        .ivu-input-number {
            width: 100%;
        }
        .ivu-date-picker {
            width: 100%;
        }
        &:after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0);
            z-index: 90;
        }
        .mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            text-align: right;
            bottom: 0;
            border: 1px dashed @drag-border-color;
            background-color: @drag-bg-color;
            z-index: 1000;
            i {
                position: absolute;
                right: 0;
                top: 0;
                font-size: 12px;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                background: @drag-close-color;
                color: @white-color;
                cursor: pointer;
            }
        }
        &.sortable-chosen-nav {
            opacity: .4;
            text-align: center;
            padding: 20px 0;
            border: 1px dashed @drag-border-color;
            background-color: @drag-bg-color;
            i {
                display: block;
                font-size: 25px;
                margin-bottom: 3px;
            }
        }
    }
}
.template-modal {
    p {
        font-size: 16px;
        padding: 30px 0 10px;
        text-align: center;
    }
    .ivu-modal-footer {
        text-align: center;
        border-top: 0;
    }
    
}
.preview-modal {
    .ivu-modal-content {
        background-color: transparent;
    }
    .ivu-modal-footer {
        border-top: none;
    }
    .tab-radio {
        display: block;
        text-align: center;
        margin-bottom: 10px;
        .ivu-radio-wrapper {
            font-size: 14px;
            width: 90px;
            height: 40px;
            line-height: 40px;
            &.ivu-radio-wrapper-checked {
                background-color: @primary-color;
                color: @white-color;
            }
        }
    }
    .ivu-modal-close {
        i {
            width: 24px;
            height: 24px;
            color: @white-color;
            border: 1px solid @white-color;
            line-height: 24px;
            text-align: center;
            border-radius: 50%;
        }
        &:hover i{
            color: @white-color;
        }
    }
    .main-inner {
        margin: 0 auto;
        &.web-inner {
            padding: 0 10px;
        }
        .drag-item {
            textarea, input {
                transition: unset!important;
            }
        }
        &.mobile-inner {
            width: 340px;
            border-radius: 20px;
            padding-top: 40px;
            .mobile-title {
                border-top: 1px solid @border-color;
                line-height: 37px;
                font-size: .48rem;
                color: @gray-color-dark;
                position: relative;
                text-align: center;
                i {
                    position: absolute;
                    color: @primary-color;
                    left: 10px;
                    font-size: 20px;
                    top: 50%;
                    margin-top: -10px;
                }
            }
            img {
                width: 100%;
            }
            .drag-item {
                padding: 0 10px;
                textarea, input {
                    border: 0;
                    transition: unset!important;
                }
            }
            .ivu-checkbox-group, .ivu-radio-group {
                padding-top: 5px;
            }
            .ivu-checkbox-wrapper {
                span {
                    display: none;
                }
                background-color: @white-color-elip;
                padding: 3px 9px;
                border-radius: 4px;
                margin: 4px 4px 4px 0;
            }
            .drag-label {
                margin: 0 -10px;
                padding: 10px;
                background-color: @white-color-elip;
            }
        }
        .mask {
            display: none;
        }
    }
}
</style>

