<template>
    <div class="excel-btn-wrap">
        <Dropdown placement="bottom-end" @on-click="handleExportExcel">
            <a href="javascript:void(0)" v-if="showDeptExcelBtn || showGroupExcelBtn">导出</a>
            <a href="javascript:void(0)" @click="handlePersonData" v-else>导出</a>
            <DropdownMenu slot="list" v-if="showDeptExcelBtn">
                <DropdownItem :name="0">仅部门数据</DropdownItem>
                <DropdownItem v-if="!isGroupOrDeptSelectedAll" :name="1">部门和人员数据</DropdownItem>
            </DropdownMenu>
            <DropdownMenu slot="list" v-if="showGroupExcelBtn">
                <DropdownItem :name="2">仅内部群数据</DropdownItem>
                <DropdownItem v-if="!isGroupOrDeptSelectedAll" :name="3">内部群和人员数据</DropdownItem>
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
                this.$emit("handleExportExcel", params);
            },
            handlePersonData() {
                this.$emit("handlePersonData");
            }
        }
    }
</script>

<style lang="less">
    @import '../../../assets/css/var.less';
    .excel-btn-wrap {
        text-align: center;
        margin-right: 0;
        border: 1px solid @primary-color;
        border-radius: 4px;
        .ivu-dropdown-item:hover {
            background: @primary-color;
        }
        a {
            color: @primary-color;
            &:hover {
                color: @primary-color;
            }
        }
        .ivu-select-dropdown {
            right: 0;
            left: auto!important;
        }
    }
</style>