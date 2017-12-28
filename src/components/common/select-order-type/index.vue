<template>
    <div class="select-order-type">
        <div @click="handleExpand" 
            class="select-order-type-select cursor-pointer" 
            :class="{expand: expand}">
            <div class="selected">
                {{orderNameObj[orderType]}}
                <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow"></i>
            </div>
            <ul v-if="expand">
                <li v-for="item in orderData"
                    @click="handleSelect(item)"
                    :class="(orderType == item.id) ?' selected': ''"
                    :key="item.id">
                    {{item.name}}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        multi: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            orderNameObj: {
                0: '按月统计',
                1: '按季度统计',
                2: '按周统计',
                3: '自定义',
                4: '按日统计',
            },
            normalOrderData: [
                {
                    name: "按月统计",
                    id: 0
                },
                {
                    name: "按季度统计",
                    id: 1
                },
            ],
            multiOrderData: [
                {
                    name: "按日统计",
                    id: 4
                }, 
                {
                    name: "按周统计",
                    id: 2
                },
                {
                    name: "按月统计",
                    id: 0
                },
                {
                    name: "自定义",
                    id: 3
                }
            ],
            orderData: [],
            orderType: '',
            orderName: '',
            expand: false,
            start: '',
            end: ''
        }
    },
    methods: {
        handleExpand() {
            this.expand = !this.expand;
        },
        handleSelect(data) {
            this.orderType = data.id
        },
        init() {
            if(this.multi) {
                this.orderData = this.multiOrderData;
                this.orderType = 4;
            } else {
                this.orderData = this.normalOrderData;
                this.orderType = 0
            }
        },
        getParams() {
            let params = {
                orderType: this.orderType
            }
            if(this.multi) {
                params.start = this.start;
                params.end = this.end;
            }
            console.log(params)
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
    .select-order-type-select {
        display: inline-block;
        vertical-align: middle;
        width: 100%;
        padding: 4px 30px 4px 7px;
        font-size: 12px;
        border: 1px solid @border-color;
        border-radius: 4px;
        color: @gray-color-dark;
        background-color: @white-color;
        background-image: none;
        position: relative;
        line-height: 22px;
        &.expand {
            .ivu-icon {
                transform: rotate(180deg);
            }
        }
        ul {
            position: absolute;
            max-height: 200px;
            overflow: auto;
            width: 100%;
            padding: 5px 0;
            background-color: @white-color;
            box-sizing: border-box;
            border-radius: 4px;
            top: 34px;
            left: 0;
            box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
            position: absolute;
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
                    background-color: #f3f3f3;
                }
                &.selected {
                    color: @white-color;
                    background-color: @primary-color;
                }
            }
        }
    }
}
</style>

