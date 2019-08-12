<template>
    <div class="work-log-node">
        <template v-if="data.type == 'InputText'">
            <div class="transfrom-wrapper"
                v-clickoutside="handleClose"
                :style="{'z-index': isDisableTrasnformList ? 30 : 20}">
                <span class="transform-icon" @click="handleTransformList(undefined)"></span>
                <div class="transform-list" v-if="isDisableTrasnformList">
                    <div class="transform-list-header">
                        <div class="btn" 
                            @click="handleTransform('task')" 
                            :class="transformType === 'task' ? 'active' : ''">{{$t('noun.task')}}</div>
                        <div class="btn" 
                            @click="handleTransform('schedule')" 
                            :class="transformType === 'schedule' ? 'active' : ''">{{$t('noun.schedule')}}</div>
                    </div>
                    <div class="transform-list-body">
                        <template v-if="transformType === 'task'">
                            <template v-if="transformList.taskNames.length">
                                <YYCheckboxGroup v-model="checkedTask">
                                    <YYCheckbox 
                                        v-for="(item, index) in transformList.taskNames" 
                                        :key="index" 
                                        :label="item">
                                        <span class="checkbox-label">{{item}}</span>
                                    </YYCheckbox>
                                </YYCheckboxGroup>
                            </template>
                            <div v-else class="empty">{{$t('status.noRelevantData')}}</div>
                        </template>
                        <template v-if="transformType === 'schedule'">
                            <template v-if="transformList.scheduleNames.length">
                                <YYCheckboxGroup v-model="checkedSchedule">
                                    <YYCheckbox 
                                        v-for="(item, index) in transformList.scheduleNames" 
                                        :key="index" 
                                        :label="item">
                                        <span class="checkbox-label">{{item}}</span>
                                    </YYCheckbox>
                                </YYCheckboxGroup>
                            </template>
                            <div v-else class="empty">{{$t('status.noRelevantData')}}</div>
                        </template>
                    </div>
                    <div class="transform-list-footer">
                        <div class="btn" @click="handleTransformList(false)">
                            {{$t('operate.cancel')}}
                        </div>
                        <div class="btn" @click="handleCheck">
                            {{$t('operate.ok')}}
                        </div>
                    </div>
                </div>
            </div>
            <Input 
                v-model="data.content" 
                type="textarea" 
                :placeholder="data.deion" 
                :autosize="{ minRows: 5, maxRows: 10}"/>
        </template>
        <template v-if="data.type == 'InputTextNum'">
            <div class="ivu-input-wrapper ivu-input-type">
                <input 
                    v-model="data.valueNum"
                    autocomplete="off" 
                    class="ivu-input"
                    spellcheck="false" 
                    type="number" 
                    max="100000000"
                    number="true" 
                    @keypress='keypress($event)'
                    :placeholder="`${data.deion || data.description}${data.unit?`(${$t('noun.unit')}：${data.unit})`:''}`">
            </div>
        </template>
        <template v-if="data.type == 'InputRadio'">
            <YYRadioGroup v-model="data.content">
                <YYRadio v-for="(val, key) in data.options" 
                    :label="`${val.string}`"
                    :key="key">
                    {{val.string}}
                </YYRadio>
            </YYRadioGroup>
        </template>
        <template v-if="data.type == 'InputCheckbox'">
            <YYCheckboxGroup v-model="data.content">
                <YYCheckbox v-for="(val, key) in data.options" 
                    :key="key"
                    :label="val.string">
                    {{val.string}}
                </YYCheckbox>
            </YYCheckboxGroup>
        </template>
        <template v-if="data.type == 'InputDate'">
            <YYDatePicker 
                v-model="data.dateValueSec"
                class="date-wrap"
                type="date"
                placement="bottom-start"
                :placeholder="$t('noun.date')" 
                :clearable="false">
            </YYDatePicker>
        </template>
        <template v-if="data.type == 'InputContainer' && data.children.length">
            <div
                v-for="(item, index) in data.children"
                class="input-container"
                :key="index">
                <div class="children-title" :class="item.isRequired==1?'required-icon':''">
                    <span class="label">
                        {{item.title }}
                    </span>
                </div>
                <work-log-node 
                    :data="item"
                    :transformList="transformList"
                    :inputTextValue="inputTextValue"/> 
            </div>
        </template>
    </div>
</template>
<script>
import HTMLDeCode from 'app_src/filters/HTMLDeCode'
import clickoutside from 'app_src/directives/clickoutside'
export default {
    name: 'workLogNode',
    props: {
        transformList: {
            type: Object
        },
        data: {
            type: Object
        },
        inputTextValue: {
            type: Array | Object
        }
    },
    data() {
        return {
            isDisableTrasnformList: false,
            transformType: 'task', // task 任务 schedule 日程,
            checkedTask: [],
            checkedSchedule: []
        }
    },
    directives: {
        clickoutside
    },
    filters: {
        filterHtml(val) {
            return HTMLDeCode(val);
        }
    },
    methods: {
        keypress(e) {
            if (!String.fromCharCode(e.keyCode).match(/[0-9\.]/)) {
                e.preventDefault();
            }
        },
        handleTransform(type) {
            this.transformType = type
        },
        handleTransformList(isDisable) {
            if(typeof isDisable != 'undefined') {
                this.isDisableTrasnformList = isDisable
            } else {
                this.isDisableTrasnformList = !this.isDisableTrasnformList
            }
        },
        handleCheck() {
            if(this.checkedTask.length || this.checkedSchedule.length) {
                this.checkedTask.forEach(name=>{
                    this.data.content += this.data.content ? `\n${name}` : name
                })
                this.checkedTask = []
                this.checkedSchedule.forEach(name=>{
                    this.data.content += this.data.content ? `\n${name}` : name
                })
                this.checkedSchedule = []
            }
            this.isDisableTrasnformList = false
        },
        handleClose() {
            this.isDisableTrasnformList = false
        }
    }
}
</script>
<style lang="less">
@import '../../../assets/css/var.less';
.work-log-node {
    position: relative;
    .transfrom-wrapper {
        position: absolute;
        right: 10px;
        top: 0;
        z-index: 20;
        .input-container & {
            top: -30px;
        }
        .transform-icon {
            display: inline-block;
            width: 14px;
            height: 14px;
            background: url('../../../assets/images/transform-icon.png') no-repeat center;
            background-size: contain;
            cursor: pointer;
        }
        .transform-list {
            position: absolute;
            top: 30px;
            right: 0;
            width: 270px;
            height: 300px;
            border-radius: 5px;
            background-color: @white-color;
            box-shadow: 0 4px 8px rgba(41, 42, 45, .28);
            .transform-list-header {
                margin: 18px auto;
                width: 160px;
                height: 30px;
                line-height: 28px;
                text-align: center;
                border: 1px solid @border-color-base;
                border-radius: 4px;
                font-size: 0;
                .btn {
                    display: inline-block;
                    width: 50%;
                    height: 100%;
                    color: @gray-color-simple;
                    font-size: 12px;
                    cursor: pointer;
                    &:first-child {
                        border-right: 1px solid @border-color-base;
                    }
                    &.active {
                        background-color: @white-color-light;
                        color: @primary-color;
                    }
                }
            }
            .transform-list-body {
                height: 170px;
                overflow: auto;
                margin: 0 10px 10px;
                .yy-checkbox-group {
                    padding: 0!important;
                }
                .yy-checkbox-wrapper {
                    display: block;
                    padding: 0 10px;
                    border-radius: 2px;
                    overflow: hidden;
                    margin-right: 0;
                    &:hover {
                        background-color: @select-item-bg;
                    }
                    .checkbox-label {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        float: left;
                        width: 90%;
                    }
                    .yy-checkbox {
                        float: right;
                        margin-top: 8px;
                    }
                }
                .empty {
                    text-align: center;
                    color: @gray-color-simple;
                }
            }
            .transform-list-footer {
                text-align: right;
                padding-right: 30px;
                .btn {
                    display: inline-block;
                    width: 68px;
                    height: 30px;
                    line-height: 30px;
                    font-size: 14px; 
                    text-align: center;
                    border-radius: 3px;
                    &:first-child {
                        color: #474D54;
                        background-color: @select-item-bg;
                    }
                    &:last-child {
                        margin-left: 5px;
                        color: @white-color;
                        background-color: @primary-color;
                    }
                }

            }
        }
    }
    .input-container {
        border: 1px solid @border-color-base;
        border-radius: 3px;
        margin-top: 10px;
        .children-title {
            background-color: @white-color-title;
            padding: 0 10px;
        }
        .ivu-radio-group, .ivu-checkbox-group {
            padding: 0 10px;
        }
        input, textarea {
            border: none!important;
            color: @gray-color-medium;
            font-size: 13px;
        }
    }
}
</style>

