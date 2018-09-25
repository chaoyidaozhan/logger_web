<template>
    <div class="work-log-node">
        <template v-if="data.type == 'InputText'">
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
                    :placeholder="`${data.deion}${data.unit?`(${$t('noun.unit')}：${data.unit})`:''}`">
            </div>
        </template>
        <template v-if="data.type == 'InputRadio'">
            <RadioGroup v-model="data.content">
                <Radio v-for="(val, key) in data.options" 
                    :label="`${val.string}`" 
                    :key="key">
                    {{val.string}}
                </Radio>
            </RadioGroup>
        </template>
        <template v-if="data.type == 'InputCheckbox'">
            <CheckboxGroup v-model="data.content">
                <Checkbox v-for="(val, key) in data.options" 
                    :key="key"
                    :label="val.string">
                </Checkbox>
            </CheckboxGroup>
        </template>
        <template v-if="data.type == 'InputDate'">
            <DatePicker 
                v-model="data.dateValueSec"
                class="date-wrap"
                type="date"
                placement="bottom-start"
                :placeholder="$t('noun.date')" 
                :clearable="false">
            </DatePicker>
        </template>
        <template v-if="data.type == 'InputContainer' && data.children.length">
            <div
                v-for="(item, index) in data.children"
                class="input-container"
                :key="index">
                <div class="children-title">
                    <span>
                        {{item.title }}
                    </span>
                </div>
                <work-log-node 
                    :data="item"
                    :inputTextValue="inputTextValue"/> 
            </div>
        </template>
    </div>
</template>
<script>
import HTMLDeCode from 'app_src/filters/HTMLDeCode';
export default {
    name: 'workLogNode',
    props: {
        isChild: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object
        },
        inputTextValue: {
            type: Array | Object
        }
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
        }
    },
    mounted () {
        console.log(this.data)
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.work-log-node {
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
        }
    }
}
</style>

