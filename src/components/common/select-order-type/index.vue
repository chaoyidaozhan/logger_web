<template>
    <div class="select-order-type">
        <div class="select-order-type-select cursor-pointer" 
            @click="handleExpand"
            :class="{expand: expand}">
            <div class="selected mb-flex mb-flex-pack-justify mb-flex-align-center">
                <div>{{(orderType == 3 && minDate) ? `${minDate} - ${maxDate}` : orderNameObj[orderType]}}</div>
                <div class="yy-icon-arrow-down"></div>
            </div>
            <ul v-if="expand">
                <li v-for="item in orderData"
                    @click="handleSelect($event, item)"
                    :class="(orderType == item.id) ?' selected': ''"
                    :key="item.id">
                    <span>{{item.name}}</span>
                    <YYDatePicker 
                        type="daterange" 
                        v-if="item.id == 3"
                        placement="bottom-end"
                        v-model="pickerValue"
                        :placeholder="$t('noun.date')" 
                        :options="options"
                        :editable="false"
                        @on-change="change"
                        :style="{'width': '190px'}">
                    </YYDatePicker>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
// daily: '按日统计',
// weekly: '按周统计',
// monthly: '按月统计',
// quarterly: '按季度统计',
// custom: '自定义
export default {
    props: {
        multi: {
            type: Boolean | String,
            default: false
        },
        defaultType: {
            type: Number | String,
        },
        classificationArrData: {
            type: Array | Number | String,
            default: function() {
                return [];
            }
        }
    },
    watch: {
        classificationArrData(newVal, oldVal) {
            if(typeof newVal == 'string') {
                switch(newVal) {
                    case '1':
                        this.orderData = this.deptOrderData;
                    break;
                    case '2':
                        this.orderData = this.memberOrderData;
                    break;
                    case '3':
                        this.orderData = this.groupOrderData;
                    break;
                }
            }
            
        }
    },
    data() {
        return {
            orderNameObj: {
                0: this.$t('noun.monthly'),
                1: this.$t('noun.quarterly'),
                2: this.$t('noun.weekly'),
                3: this.$t('noun.custom'),
                4: this.$t('noun.daily'),
            },
            deptOrderData: [ // dept  1
                {
                    name: this.$t('noun.daily'),
                    id: 4
                }, 
                {
                    name: this.$t('noun.monthly'),
                    id: 0
                },
                {
                    name: this.$t('noun.quarterly'),
                    id: 1
                },
            ],
            groupOrderData: [ // group  3
                {
                    name: this.$t('noun.daily'),
                    id: 4
                }, 
                {
                    name: this.$t('noun.monthly'),
                    id: 0
                },
                {
                    name: this.$t('noun.quarterly'),
                    id: 1
                },
            ],
            memberOrderData: [ // member  2
                {
                    name: this.$t('noun.daily'),
                    id: 4
                }, 
                {
                    name: this.$t('noun.weekly'),
                    id: 2
                },
                {
                    name: this.$t('noun.monthly'),
                    id: 0
                },
                {
                    name: this.$t('noun.custom'),
                    id: 3
                }
            ],
            orderData: [],
            orderType: '',
            orderName: '',
            expand: false,
            options: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            minDate: '',
            maxDate: '',
            pickerValue: []
        }
    },
    methods: {
        handleExpand(e) {
            e.stopPropagation();
            this.expand = !this.expand;
        },
        handleSelect(e, data) {
            if(data.id == 3) {
                e.stopPropagation();
            } else {
                this.orderType = data.id;
                this.$emit('handleSelectOrderType', this.orderType)
            }
        },
        init() {
            this.orderData = this.multi ? this[`${this.multi}OrderData`] : this.deptOrderData;
            switch (this.multi) {
                case 'dept':
                    this.orderType = 0;  // 按月
                    break;
                case 'group':
                    this.orderType = 4; // 按人员
                    break;
                case 'member':
                    this.orderType = 4;
                    break;
            }
            if(this.defaultType != undefined && this.defaultType != null) {
                this.orderType = this.defaultType;
            }
            document.onclick = (e)=>{
                this.expand = false;
            }
        },
        change(params) {
            this.orderType = 3;
            this.minDate = params[0] || "";
            this.maxDate = params[1] || "";
            this.pickerValue[0] = params[0] || "";
            this.pickerValue[1] = params[1] || "";
            this.expand = false;
        },
        getParams() {
            let params = {
                orderType: this.orderType
            }
            if(this.multi) {
                params.minDate = this.minDate;
                params.maxDate = this.maxDate;
            }
            return params;
        }
    },
    created () {
        this.init();
    }
}
</script>
<style lang="less" scoped>
@import '../../../assets/css/var.less';
.select-order-type {
    height: 32px;
    font-size: 0;
    .select-order-type-select {
        display: inline-block;
        vertical-align: middle;
        width: 100%;
        padding: 4px 12px 4px 7px;
        font-size: 12px;
        border: 1px solid @border-color;
        border-radius: 4px;
        color: @gray-color-medium;
        background-color: @white-color;
        background-image: none;
        position: relative;
        line-height: 22px;
        transition: all 0.2s ease-in-out;
        &:hover {
            border-color: @input-select-border-color;
        }
        &.expand {
            .yy-icon-arrow-down {
                transform: rotate(180deg);
            }
        }
        ul {
            position: absolute;
            min-width: 100%;
            padding: 5px 0;
            background-color: @white-color;
            box-sizing: border-box;
            border-radius: 4px;
            top: 34px;
            left: 0;
            box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
            z-index: 900;
            li {
                margin: 0;
                line-height: normal;
                padding: 7px 16px;
                clear: both;
                color: @gray-color-dark;
                font-size: 12px !important;
                white-space: nowrap;
                list-style: none;
                cursor: pointer;
                transition: background 0.2s ease-in-out;
                &:hover {
                    background-color: #f0f3f9;
                }
                &.selected {
                    // span { color: @gray-color-dark; }
                    background-color: #fef9ed;
                }
            }
        }
    }
}
</style>

