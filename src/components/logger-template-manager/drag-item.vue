<template>
    <div class="drag-item"
        :class="item.type != 'InputContainer' ? 'dragable' : ''"
        @click="handleChangeCurrentItem($event, item)">
        <!-- 标题 -->
        <div :class="item.type != 'InputContainer' ? '' : 'dragable'">
            <label class="drag-label">
                <i v-if="item.isRequired != '0'">*</i>{{item.title}}
            </label>
            <div class="mask" 
                style="margin: 0 -10px"
                v-if="(currentItem && currentItem.id) == item.id && item.type === 'InputContainer'">
                <Icon type="close" @click.native="handleDelete($event, zIndex, item, $parent.item)"></Icon>
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
                        :placeholder="`${$t('operate.please')}${$t('operate.select')}${$t('noun.date')}`" 
                        class="date-wrap"
                        :clearable="false">
                    </DatePicker>
                </template>
            </div>
            <!-- 蒙版 -->
            <div class="mask" 
                v-if="(currentItem && currentItem.id) == item.id">
                <Icon type="close" @click.native="handleDelete($event, zIndex, item, $parent.item)"></Icon>
            </div>
        </template>
        <!-- 子节点 -->
        <div class="drag-item-children" ref="advacedPush" v-if="item.type === 'InputContainer'">
            <drag-item
                v-for="(val, index) in item.children"
                :handleChangeCurrentItem="handleChangeCurrentItem"
                :handleDelete="handleDelete"
                :handleDragUpdate="handleDragUpdate"
                :handleDragAdd="handleDragAdd"
                :zIndex="index"
                :key="index"
                :item="val"
                :isChildren="true"
                :currentItem="currentItem">
            </drag-item>
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
<style lang="less" scoped>
.drag-item-children {
    min-height: 200px;
    border: 1px solid #ededed;
    margin-top: 10px;
}
</style>
