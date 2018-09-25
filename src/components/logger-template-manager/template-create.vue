<template>
    <div class="logger-template-create" :class="{disabled: editDisable}">
        <!-- 控件列表 -->
        <div class="main pull-left">
            <div class="main-inner">
                <!-- 日志日期 -->
                <div class="date-item dragable" @click="handleChangeCurrentItem($event, dateOptions)">
                    <label class="drag-label">
                        {{$t('noun.logDate')}}
                    </label>
                    <div class="input-type-wrapper">
                        <DatePicker type="date"
                            placement="bottom-start"
                            :placeholder="`${$t('operate.please')}${$t('operate.select')}${$t('noun.date')}`" 
                            class="date-wrap"
                            :clearable="false">
                        </DatePicker>
                    </div>
                    <div class="mask" v-if="(currentItem && currentItem.id) == dateOptions.id">
                    </div>
                </div>
                <!-- 拖拽控件 -->
                <div class="inner-push" ref="advacedPush">
                    <fs-drag-item 
                        v-for="(item, index) in pushList" 
                        :handleChangeCurrentItem="handleChangeCurrentItem"
                        :handleDelete="handleDelete"
                        :handleDragUpdate="handleDragUpdate"
                        :handleDragAdd="handleDragAdd"
                        :item="item"
                        :currentItem="currentItem"
                        :zIndex="index"
                        :key="index" />
                </div>
            </div>
        </div>
        <!-- 控件菜单 -->
        <div class="sub pull-left">
            <span class="title">{{$t('noun.control')}}</span>
            <div class="nav" ref="advacedPull">
                <fs-sub-nav v-for="(item, index) in pullList" :data="item" :key="index"></fs-sub-nav>
            </div>
        </div>
        <!-- 控件设置-->
        <div class="extra pull-left">
            <Tabs>
                <!-- 控件设置 -->
                <TabPane :label="`${$t('noun.controlSettings')}`">
                    <div v-if="currentItem && currentItem.id != 'dateOptions'">
                        <div class="extra-item">
                            <label class="extra-label">{{$t('noun.title')}}</label>
                            <Input :placeholder="$t('placeholder.maximum10Chars')" :maxlength="10" v-model="currentItem.title" type="text"/>
                        </div>
                        <div class="extra-item" v-if="currentItem.type == 'InputText' || currentItem.type == 'InputTextNum'">
                            <label class="extra-label">{{$t('noun.promptText')}}</label>
                            <Input :placeholder="$t('placeholder.maximum50Chars')" :autosize="{ minRows: 3}" :maxlength="50" v-model="currentItem.deion" type="textarea"/>
                        </div>
                        <div class="extra-item" v-if="currentItem.type == 'InputTextNum'">
                            <label class="extra-label">{{$t('noun.unit')}}</label>
                            <Input :placeholder="$t('placeholder.enterUnit')" :maxlength="10" v-model="currentItem.unit" type="text"/>
                        </div>

                        <div class="extra-item" v-if="currentItem.type == 'InputRadio' || currentItem.type == 'InputCheckbox'">
                            <label class="extra-label">{{$t('noun.option')}}<span>({{$t('placeholder.leastItems')}})</span></label>
                            <ul class="extra-group-check">
                                <li v-for="(item, index) in currentItem.options" :key="index">
                                    <Input :maxlength="20" :placeholder="`${$t('operate.please')}${$t('operate.enter')}${$t('noun.option')}${$t('noun.name')}`" v-model="item.string" type="text"/>
                                    <Icon v-if="currentItem.options.length > 2" 
                                        type="ios-minus-outline" 
                                        @click.native="handleDeleteOptions(index)" />
                                </li>
                            </ul>
                            <Button type="ghost" long :disabled="!(currentItem.options.length < 10)" @click="handleAddOptions">
                                {{$t('noun.addOption')}}
                            </Button>
                        </div>
                        <div class="extra-item" v-if="currentItem.type !== 'InputContainer'">
                            <Checkbox @on-change="handleChangeRequired" v-model="isRequired">
                                {{$t('noun.required')}}
                            </Checkbox>
                        </div>
                    </div>
                    <div v-else-if="currentItem && currentItem.id == 'dateOptions'">
                        <div class="extra-item"></div>
                        <div class="extra-item">
                            <Checkbox v-model="dateOptions.diaryTimeStatus">
                                {{$t('placeholder.whetherDisplayDate')}}
                            </Checkbox>
                        </div>
                    </div>
                    <fs-empty-tips v-else :emptyMsg="$t('toast.thereIsNoControl')" iconType="template"/>
                </TabPane>
                <!-- 模板设置 -->
                <TabPane :label="`${$t('noun.templateSettings')}`">
                    <div>
                        <div class="extra-item">
                            <label class="extra-label"><i>*</i>
                                {{$t('noun.template')}}{{$t('noun.uName')}}
                            </label>
                            <Input :placeholder="$t('placeholder.maximum10Chars')" 
                                    :maxlength="10" v-model="data.title" type="text"/>
                        </div>
                        <div class="extra-item">
                            <label class="extra-label">
                                {{$t('noun.template')}}{{$t('noun.description')}}
                            </label>
                            <Input :placeholder="$t('placeholder.maximum20Chars')"  :maxlength="20" v-model="data.describe" type="text"/>
                        </div>
                        <div class="extra-item">
                            <label class="extra-label">{{$t('noun.visibleTo')}}</label>
                            <select-member-input 
                                :dept="deptRange"
                                :group="groupRange"
                                :member="memberRange"
                                :title="`${$t('operate.select')}${$t('noun.visibleRange')}`"
                                :placeholder="$t('noun.public')"
                                :ellipsis="false" 
                                :showDept="true" 
                                :showGroup="true" 
                                ref="selectDept"
                                @handleSelectMember="handleSelectRange"
                                />
                        </div>
                        <div class="extra-item">
                            <label class="extra-label">
                                {{$t('noun.template')}}{{$t('noun.category')}}
                            </label>
                            <RadioGroup v-model="data.dataType" style="line-height: 20px">
                                <Radio v-for="(val, key) in options" :key="key" :label="val.dataType" >{{val.string}}</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <Modal :width="lang == 'en' ? 420 : 300" class-name="template-modal" :mask-closable="false" :closable="false" v-model="showSuccessModal">
            <p>{{$t('toast.savedSuccessfully')}}</p>
            <div slot="footer">
                <Button type="primary" @click="onOk">{{$t('toast.returnToTemplateManagement')}}</Button>
                <Button type="ghost" @click="onCancel">{{$t('toast.continueEditing')}}</Button>
            </div>
        </Modal>
        <Modal :width="580" class-name="preview-modal" v-model="showPreviewModal">
            <RadioGroup class="tab-radio" v-model="previeWeb" type="button">
                <Radio label="0">{{$t('noun.web')}}</Radio>
                <Radio label="1">{{$t('noun.mobile')}}</Radio>
            </RadioGroup>
            <div class="main-inner" :class="previeWeb == '0' ? 'web-inner' : 'mobile-inner'">
                <div class="mobile-title" v-if="previeWeb != '0'">
                    <i class="icon-arrow-left"></i>
                    {{$t('menus.workLog')}}
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
import HTMLDeCode from 'app_src/filters/HTMLDeCode';
import FsDragItem from './drag-item'
import FsSubNav from './sub-nav'
export default {
    data() {
        return {
            dateOptions: {
                "id": 'dateOptions',
                "diaryTimeStatus": true
            },
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
                    "deion": `${this.$t('operate.please')}${this.$t('operate.enter')}`,
                    "title": this.$t('noun.textBox'),
                    "isRequired": "0",
                    "value": "",
                    "content": "",
                    "type": "InputText"
                }, {
                    "type": "InputTextNum",
                    "deion": `${this.$t('operate.please')}${this.$t('operate.enter')}`,
                    "unit": "",
                    "size": 0,
                    "title": this.$t('noun.numberBox'),
                    "isRequired": "0",
                    "value": "",
                    "content": ""
                }, {
                    "options": [{
                        "string": `${this.$t('noun.option')}1`
                    }, {
                        "string": `${this.$t('noun.option')}2`
                    }, {
                        "string": `${this.$t('noun.option')}3`
                    }],
                    "type": "InputRadio",
                    "title": this.$t('noun.radioBox'),
                    "isRequired": "0",
                    "value": "",
                    "content": ""
                }, {
                    "options": [{
                        "string": `${this.$t('noun.option')}1`
                    }, {
                        "string": `${this.$t('noun.option')}2`
                    }, {
                        "string": `${this.$t('noun.option')}3`
                    }],
                    "type": "InputCheckbox",
                    "title": this.$t('noun.checkBox'),
                    "isRequired": "0",
                    "value": "",
                    "content": ""
                }, {
                    "dateType": "1",
                    "type": "InputDate",
                    "title": this.$t('noun.date'),
                    "isRequired": "0",
                    "value": "",
                    "content": ""
                }, {
                    "type": "InputContainer",
                    "title": this.$t('noun.content'),
                    "isRequired": "0",
                    "children": []
                }
            ],
            pushList: [],
            currentItem: null,
            isRequired: false,
            options: [
                {
                    string: this.$t('noun.dailyReport'),
                    dataType: 1
                },
                {
                    string: this.$t('noun.weeklyReport'),
                    dataType: 2
                },
                {
                    string: this.$t('noun.monthlyReport'),
                    dataType: 3
                },
                {
                    string: this.$t('noun.other'),
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
        SelectMemberInput,
        FsDragItem,
        FsSubNav
    },
    methods: {
        removeNode(node) { // 移除节点
            node.parentElement.removeChild(node);
        },
        insertNodeAt(fatherNode, node, position) { // 插入节点
            let refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
            fatherNode.insertBefore(node, refNode);
        },
        handleDragAdd(evt, data) { // 新增数据的时候
            this.removeNode(evt.item);
            let timesmap = (new Date()).valueOf();
            let newItem = JSON.parse(JSON.stringify(this.pullList[evt.oldIndex]))
            newItem.id = timesmap;
            if(data) {
                if(newItem.type != 'InputContainer') {
                    data.children.splice(evt.newIndex, 0, newItem)
                    this.currentItem = newItem;
                }
            } else {
                this.pushList.splice(evt.newIndex, 0, newItem);
                this.currentItem = newItem;
            }
        },
        handleDelete(evt, index, data, parent) { // 删除节点
            evt.preventDefault();
            evt.stopPropagation();
            if(parent && parent.children) {
                this.currentItem = parent.children[index + 1] ? parent.children[index + 1] : parent.children[index - 1];
                parent.children.splice(index, 1);
            } else {
                this.currentItem = this.pushList[index + 1] ? this.pushList[index + 1] : this.pushList[index - 1];
                this.pushList.splice(index, 1);
            }
        },
        handleDeleteOptions(index) { // 删除选项
            this.currentItem.options.splice(index, 1);
        },
        handleAddOptions() { // 添加选项
            this.currentItem.options.push({
                string: this.$t('noun.option')
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
        handleDragUpdate(evt, data) { // 更新数据的时候
            this.removeNode(evt.item);
            this.insertNodeAt(evt.from, evt.item, evt.oldIndex);
            console.log(data);
            if(data) {
                data.children.splice(evt.newIndex, 0, data.children.splice(evt.oldIndex, 1)[0]);
            } else {
                this.pushList.splice(evt.newIndex, 0, this.pushList.splice(evt.oldIndex, 1)[0]);
            }
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
                handle: '.dragable',
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
                    teamId: item.groupId || item.gid,
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
                url: '/template/stop',
                type: 'post',
                data: { 
                    id: templateId
                },
                requestBody: true,
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.data.dataStatus = 0;
                        this.editDisable = false;
                        this.$emit('handleLoading');
                        this.$emit('handleDataStatus', this.data.dataStatus);
                    } else {
                        this.$Message.error(res && res.msg || this.$t('status.networkError'));
                    }
                },
                error: (res)=>{
                    this.$Message.error(res && res.msg || this.$t('status.networkError'));
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
            // 日志日期
            params.diaryTimeStatus = +this.dateOptions.diaryTimeStatus
            if(!params.title.trim()) {
                return this.$Message.error(`${this.$t('operate.please')}${this.$t('operate.enter')}${this.$t('noun.template')}${this.$t('noun.name')}`);
            }
            call && call();
            if(templateId != -1) {
                this.$ajax({
                    url: '/template/edit',
                    type: 'post',
                    data: { ...params },
                    requestBody: true,
                    success: (res)=>{
                        if(res && res.code == 0) {
                            this.currentItem = null;
                            this.showSuccessModal = true;
                        } else {
                            this.$Message.error(res && res.msg || this.$t('status.networkError'));
                        }
                        this.$emit('handleLoading');
                    },
                    error: (res)=>{
                        this.$Message.error(res && res.msg || this.$t('status.networkError'));
                    }
                })
            } else {
                this.$ajax({
                    url: '/template/add',
                    type: 'post',
                    data: { ...params },
                    requestBody: true,
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
                            this.$Message.error(res && res.msg || this.$t('status.networkError'));
                        }
                        this.$emit('handleLoading');
                    },
                    error: (res)=>{
                        this.$Message.error(res && res.msg || this.$t('status.networkError'));
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
                } else if (v.dataType == 3) { //内部群
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
                this.pushList = JSON.parse(res && res.data && res.data.content);
                this.pushList.length && this.pushList.forEach((item)=>{
                    item.title && (item.title = HTMLDeCode(item.title));
                    item.deion && (item.deion = HTMLDeCode(item.deion));
                    item.description && (item.deion = HTMLDeCode(item.deion || item.description));
                })
                let resData = res && res.data;
                this.initRange(resData.templateVisibleRange)
                this.data = { // 当前模板对应数据
                    title: HTMLDeCode(resData.title || ''),
                    describe: HTMLDeCode(resData.describe || ''),
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
                // 是否显示日志日期
                this.dateOptions.diaryTimeStatus = !!resData.diaryTimeStatus
                console.log(this.dateOptions);
                
                this.$emit('handleDataStatus', resData.dataStatus);
            }
            this.$emit('handleLoading');
        },
        init() { // 模板初始化
            let templateId = this.$route.params.id;
            if(templateId != -1) { // 当为编辑时请求接口初始化数据
                this.$ajax({
                    url: `/template/detail/${templateId}`,
                    success: (res)=>{
                        this.initData(res);
                    },
                    error: (res)=>{
                        this.$Message.error(res && res.msg || this.$t('status.networkError'));
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
                padding: 10px 0 10px 0;
                span {
                    color: @gray-color-light;
                    font-size: 12px;
                }
                i {
                    vertical-align: middle;
                    color: @drag-close-color;
                }
            }
            .ivu-checkbox-wrapper {
                font-size: 14px;
                line-height: 20px;
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
        .ivu-tabs {
            height: 100%;
            position: relative;
        }
        .ivu-tabs-bar {
            margin-bottom: 0;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 36px;
            z-index: 10;
        }
        .ivu-tabs-nav {
            width: 100%;
            background-color: @white-color-light;
        }
        .ivu-tabs-content {
            height: 100%;
            padding-top: 36px;
            .ivu-tabs-tabpane {
                height: 100%;
                overflow: auto;
            }
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
    .inner-push {
        min-height: 80%;
    }
    .dragable {
        position: relative;
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

