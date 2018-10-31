<template>
    <div class="excel-btn-wrap">
        <Dropdown placement="bottom-end" @on-click="handleExportExcel">
            <a href="javascript:void(0)" v-if="showDeptExcelBtn || showGroupExcelBtn">{{$t('operate.export')}}</a>
            <a href="javascript:void(0)" @click="handlePersonData" v-else>{{$t('operate.export')}}</a>
            <DropdownMenu slot="list" v-if="showDeptExcelBtn">
                <DropdownItem :name="0">{{$t('toast.departmentalDataOnly')}}</DropdownItem>
                <DropdownItem v-if="!isGroupOrDeptSelectedAll" :name="1">{{$t('toast.departmentAndPersonnelData')}}</DropdownItem>
            </DropdownMenu>
            <DropdownMenu slot="list" v-if="showGroupExcelBtn">
                <DropdownItem :name="2">{{$t('toast.internalGroupDataOnly')}}</DropdownItem>
                <DropdownItem v-if="!isGroupOrDeptSelectedAll" :name="3">{{$t('toast.internalGroupAndPersonnelData')}}</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
    export default {
        props: {
            showGroupExcelBtn: {
                type: Boolean,
                default: false
            },
            showDeptExcelBtn: {
                type: Boolean,
                default: false
            },
            isGroupOrDeptSelectedAll: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            handleExportExcel(params) {
                this.$emit("handleExportExcel", params)
            },
            handlePersonData() {
                this.$emit("handlePersonData")
            }
        }
    }
</script>

<style lang="less">
    @import '../../../assets/css/var.less';
    .excel-btn-wrap {
        text-align: center;
        margin-right: 0;
        border: 1px solid @select-item-bg;
        background-color: @select-item-bg;
        border-radius: 4px;
        .ivu-dropdown-item:hover {
            background: @select-item-bg;
        }
        a {
            color: @gray-color-medium;
            &:hover {
                color: @gray-color-medium;
            }
        }
        .ivu-select-dropdown {
            right: 0;
            left: auto!important;
        }
    }
</style>
