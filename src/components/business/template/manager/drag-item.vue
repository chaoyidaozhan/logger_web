<template>
    <div class="drag-item"
        :class="item.type != 'InputContainer' ? 'dragable' : ''"
        @click="handleChangeCurrentItem($event, item)">
        <!-- 标题 -->
        <div :class="item.type != 'InputContainer' ? '' : 'dragable'">
            <label class="drag-label">
                <i v-if="+item.isRequired">*</i>{{item.title}}
            </label>
            <div class="mask" 
                v-if="(currentItem && currentItem.id) == item.id && item.type === 'InputContainer'">
                <Icon type="close" class="ivu-icon-ios-close" @click.native="handleDelete($event, zIndex, item, $parent.item)"></Icon>
            </div>
        </div>

        <!-- 内容 -->
        <template v-if="item.type !== 'InputContainer'">
            <div class="input-type-wrapper">
                <template v-if="item.type == 'InputText'">
                    <Input :placeholder="item.deion" type="textarea" :autosize="{ minRows: 5}"/>
                </template>
                <template v-if="item.type == 'InputTextNum'">
                    <Input :placeholder="`${item.deion}${item.unit ? `(单位：${item.unit})` : ''}`" type="text"/>
                </template>
                <template v-if="item.type == 'InputRadio'">
                    <YYRadioGroup>
                        <YYRadio v-for="(val, key) in item.options" :key="key" :label="val.string" ></YYRadio>
                    </YYRadioGroup>
                </template>
                <template v-if="item.type == 'InputCheckbox'">
                    <YYCheckboxGroup>
                        <YYCheckbox v-for="(val, key) in item.options" :key="key">
                            {{val.string}}
                        </YYCheckbox>
                    </YYCheckboxGroup>
                </template>
                <template v-if="item.type == 'InputDate'">
                    <YYDatePicker type="date"
                        placement="bottom-start"
                        :placeholder="`${$t('operate.please')}${$t('operate.select')}${$t('noun.date')}`" 
                        class="date-wrap"
                        :clearable="false">
                    </YYDatePicker>
                </template>
            </div>
            <!-- 蒙版 -->
            <div class="mask" 
                v-if="(currentItem && currentItem.id) == item.id">
                <Icon class="ivu-icon-ios-close" type="close" @click.native="handleDelete($event, zIndex, item, $parent.item)"></Icon>
            </div>
        </template>
        <!-- 子节点 -->
        <div class="drag-item-children" ref="advacedPush" v-if="item.type === 'InputContainer'">
            <div class="drag-item-children-tips" v-if="!item.children.length">
                {{$t('toast.pleaseDragInTheContent')}}
            </div>
            <template v-else>
                <drag-item
                    v-for="(val, index) in item.children"
                    :handleChangeCurrentItem="handleChangeCurrentItem"
                    :handleDelete="handleDelete"
                    :handleDragUpdate="handleDragUpdate"
                    :handleDragAdd="handleDragAdd"
                    :zIndex="index"
                    :key="val.id"
                    :item="val"
                    :isChildren="true"
                    :currentItem="currentItem">
                </drag-item>
            </template>
        </div>
    </div>
</template>
<script>
import Sortable from 'sortablejs';

export default {
    name: 'dragItem',
    props: {
        item: {
            type: Object
        },
        currentItem: {
            type: Object
        },
        zIndex: {
            type: Number
        },
        handleDragUpdate: {
            type: Function
        },
        handleDragAdd: {
            type: Function
        },
        handleChangeCurrentItem: {
            type: Function
        },
        handleDelete: {
            type: Function
        },
    },
    mounted () {
        const _this = this
        if(this.$refs.advacedPush) {
            Sortable.create(this.$refs.advacedPush, {
                group: {
                    name: 'advanced',
                    pull: false,
                    put: true
                },
                handle: '.dragable',
                onUpdate: function (evt) {
                    _this.handleDragUpdate(evt, _this.item)
                },
                onAdd: function (evt) {
                    _this.handleDragAdd(evt, _this.item,)
                },
                animation: 150
            })
        }
    }
}
</script>
<style lang="less">
@import '../../../../assets/css/var.less';
.drag-item, .date-item {
    cursor: pointer;
    padding: 0 0 10px;
    .drag-item-children & {
        border: 1px solid @border-color-base;
        border-radius: 3px;
        margin-bottom: 10px;
        padding: 0;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .drag-label {
        display: block;
        font-size: 14px;
        padding: 10px;
        .drag-item-children & {
            background-color: @white-color-title;
        }
        i {
            vertical-align: middle;
            color: @drag-close-color;
        }
    }
    .input-type-wrapper {
        position: relative;
        padding: 0 10px;
        .drag-item-children & {
            padding: 0;
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
    }
    .ivu-radio-group, .ivu-checkbox-group {
        line-height: 20px;
        .drag-item-children & {
            padding: 10px;
        }
    }
    .ivu-radio-wrapper, .ivu-checkbox-wrapper {
        margin-right: 20px;
        font-size: 14px;
    }
    textarea {
        min-height: 115px;
        resize: none;
    }
    textarea, input {
        .drag-item-children & {
            border: none;
        }
    }
    .ivu-input-number {
        width: 100%;
    }
    .ivu-date-picker {
        width: 100%;
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
            background: @primary-color;
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
.drag-item-children {
    position: relative;
    padding: 0 10px;
    min-height: 150px;
    .drag-item-children-tips {
        border : 1px dashed @border-color-dark;
        height: 130px;
        line-height: 130px;
        text-align: center;
        font-size: 14px;
        color: @btn-disable-color;
        position: absolute;
        top: 0;
        left: 10px;
        right: 10px;
    }
}
</style>
