<template>
    <div class="logger-template-create">
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
                        <div class="mask" v-if="currentItem.id == item.id">
                            <Icon type="close" @click.native="handleDelete($event, item, index)"></Icon>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
        <div class="sub pull-left">
            <span class="title">控件</span>
            <div class="nav" ref="advacedPull">
                <div class="drag-item" v-for="(item, index) in pullList" :key="index">
                    {{item.title.substring(0, 4)}}
                </div>
            </div>
        </div>
        <div class="extra pull-left">

        </div>
    </div>
</template>
<script>
import Sortable from 'sortablejs'
export default {
    data() {
        return {
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
            currentItem: {}
        }
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
        handleChangeCurrentItem(evt, item) { // 更改当前Item
            evt.stopPropagation();
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
        }
    },
    mounted () {
        this.$nextTick(()=>{
            this.initDragItem();
        })
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/css/var.less';
.logger-template-create {
    width: 100%;
    height: 100%;
    padding: 10px;
    background-color: @white-color-light;
    .box-shadow {
        box-shadow: 0 1px 10px @box-shadow;
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
                line-height: 70px;
                text-align: center;
                width: 100%;
                cursor: move;
                color: @gray-color-light;
                &:hover {
                    line-height: 68px;
                    border: 1px dashed @drag-border-color;
                    background-color: @drag-bg-color;
                }
            }
        }
    }
    .extra {
        width: 250px;
        height: 100%;
        border-radius: 5px;
        background-color: @white-color;
        margin-left: -250px;
        .box-shadow;
    }
    .main {
        height: 100%;
        width: 100%;
        border-radius: 5px;
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
                    font-size: 12px;
                    padding: 10px 12px 10px 0;
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
                    z-index: 10;
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
                    line-height: 60px;
                    border: 1px dashed @drag-border-color;
                    background-color: @drag-bg-color;
                }
            }
        }
        
    }
}
</style>

