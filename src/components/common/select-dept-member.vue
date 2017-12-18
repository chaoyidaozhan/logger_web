<template>
    <div class="select-dept-member">
        <div class="select-dept-member-input" @click="handleCancel">
            {{getValue()}}
            <Icon type="android-person-add"></Icon>
        </div>
        <Modal
            v-model="modal"
            title="选择考勤部门/人员"
            class-name="signin-modal select-dept-member-modal vertical-center-modal"
            :mask-closable="false"
            :closable="false"
            width="600">
            <div class="select-dept-member-body clearfix">
                <div class="select-dept-member-left">
                    <div class="tab">
                        <span  
                            @click="handleChangeTab('dept')" 
                            v-if="showDept" 
                            :class="tab=='dept' ? 'active' : ''">部门</span>
                        <span 
                            @click="handleChangeTab('account')" 
                            v-if="showAccount" 
                            :class="tab=='account' ? 'active' : ''">成员</span>
                    </div>
                    <div class="content" v-if="hasLoadedDepts">
                        <fs-select-dept 
                            ref="selectDept"
                            @handleChangeDepts="handleDepts" 
                            v-show="tab=='dept'"
                            v-if="showDept"
                            :isEcho="true" 
                            :deptShifts="depts"/>
                        <fs-select-member 
                            ref="selectMember"
                            @handleChangeAccounts="handleAccounts" 
                            v-show="tab=='account'" 
                            v-if="showAccount"
                            :userShifts="accounts"/>
                    </div>
                </div>
                <div class="select-dept-member-right">
                    <div class="title clearfix">已选择<span @click="clearParams">清空</span></div>
                    <div class="echo-list">
                        <!-- 已选择组织 -->
                        <template v-if="showDept">
                            <div class="expand clearfix" @click="handleExpand('expandDept')">
                                组织
                                <Icon :type="`chevron-${expandDept ? 'up' : 'down'}`"></Icon>
                            </div>
                            <ul class="select-member-list " v-show="expandDept">
                                <li v-for="(item, index) in depts" :key="item.deptId">
                                    <div class="info">
                                        <span class="name">{{item.deptName}}</span>
                                    </div>
                                    <span class="clear" @click="clearSingleParams(item, 'dept')">
                                        <Icon type="close-round"></Icon>
                                    </span>
                                </li>
                            </ul>
                            <div class="line"></div>
                        </template>
                        <!-- 已选择成员 -->
                        <template v-if="showAccount">
                            <div class="expand clearfix" @click="handleExpand('expandAccount')">
                                成员
                                <Icon :type="`chevron-${expandAccount ? 'up' : 'down'}`"></Icon>
                            </div>
                            <ul class="select-member-list " v-show="expandAccount">
                                <li v-for="(item, index) in accounts" :key="item.accountId">
                                    <div class="info">
                                        <span class="name">{{item.realName || item.userName}}</span>
                                    </div>
                                    <span class="clear" @click="clearSingleParams(item, 'account')">
                                        <Icon type="close-round"></Icon>
                                    </span>
                                </li>
                            </ul>
                        </template>
                    </div>
                </div>
            </div>
            <div slot="footer" class="select-dept-member-footer">
                <Button type="ghost" @click="handleCancel(null)">取消</Button>
                <Button type="info" @click="handleOk">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import FsSelectDept from './select-dept';
import FsSelectMember from './select-member';
export default {
    props: {
        deptShifts: { // 回显组织需要的数据
            type: Array,
            default() {
                return []
            }
        },
        userShifts: { // 回显组织需要的数据
            type: Array,
            default() {
                return []
            }
        },
        showDept: {
            type: Boolean,
            default: true
        },
        showAccount: {
            type: Boolean,
            default: true
        },
        defaultTab: {
            type: String,
            default: 'dept'
        },
        stringName: {
            type: String,
            default: 'accountIds'
        }
    },
    data() {
        return {
            modal: false,
            tab: 'dept',
            expandAccount: true,
            expandDept: true,
            depts: [],    // 组织列表
            accounts: [], // 成员列表
            deptLen: 0,
            accountLen: 0,
            deptIds: [],    // 组织id列表
            accountIds: [], // 成员id列表
            hasLoadedDepts: false, // 组织信息只加载一次
        }
    },
    components: {
        FsSelectDept,
        FsSelectMember
    },
    methods: {
        init() { // 判断已有数据
            if(!this.showDept) {
                this.tab = 'account';
            }
            this.initDeptIds();
            this.initAccountIds();
            this.deptLen = this.deptShifts.length || 0;
            this.accountLen = this.userShifts.length || 0;
        },
        initDeptIds() { // 初始化deptIds
            if(this.deptShifts && !!this.deptShifts.length) {
                this.deptIds = [];
                this.deptShifts.forEach(item=>{
                    this.deptIds.push(item.deptId);
                    this.depts.push(item);
                })
            }
        },
        initAccountIds() { // 初始化accountIds
            if(this.userShifts && !!this.userShifts.length) {
                this.userShifts.forEach((item)=>{
                    this.accountIds.push(item.accountId);
                    this.accounts.push(item);
                })
            }
        },
        getValue() { // 获取当前值
            return this.showDept ? `${this.deptLen}部门，${this.accountLen}成员` : `${this.accountLen}成员`
        },
        handleAccounts(value) { // 数据变化更新已选择成员
            this.accounts = value || []
        },
        handleDepts(value) { // 数据变化更新已选择成员
            this.depts = value || []
        },
        clearSingleParams(value, name) { // 单个清除已选择成员
            if(name == 'dept') {
                this.$refs.selectDept.clearSingleParams(value);
            } 
            if(name == 'account') {
                this.$refs.selectMember.clearSingleParams(value);
            } 
        },
        clearParams() { // 清除所有选中
            this.accounts = [];
            this.$refs.selectDept && this.$refs.selectDept.clearParams();
            this.$refs.selectMember && this.$refs.selectMember.clearParams();
        },
        handleChangeTab(name) { // 切换tab
            this.tab = name
        },
        handleExpand(name) { // 收起展开
            this[`${name}`] = !this[`${name}`];
        },
        handleCancel() { // 关闭选范围选人
            this.modal = !this.modal;
            this.hasLoadedDepts = true;
        },
        handleOk() { // 点击确定按钮
            this.deptLen = this.depts.length;
            this.accountLen = this.accounts.length;

            this.deptIds = this.$refs.selectDept && this.$refs.selectDept.getDeptIds() || [];
            this.accountIds = this.$refs.selectMember && this.$refs.selectMember.accountIds || [];
            this.handleCancel();
        },
        getParams() { // 根据当前类型返回参数
            let data = {
                [`${this.stringName}`]: this.accountIds,
            }
            if(this.showDept) {
                data.deptIds = this.deptIds;
            }
            return data;
        }
    },
    created () {
        this.init();
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.select-dept-member {
    .select-dept-member-input {
        display: inline-block;
        width: 320px;
        height: 32px;
        line-height: 1.5;
        padding: 4px 7px;
        font-size: 12px;
        border-radius: 4px;
        background-color: #fff;
        position: relative;
        cursor: pointer;
        border: 1px solid #e6e6e6;
        color: @gray-color-medium;
        font-size: 12px;
        &>i {
            position: absolute;
            right: 10px;
            height: 32px;
            line-height: 32px;
            top: 0;
            font-size: 15px;
            color: @gray-color-light;
        }
    }
}

.select-dept-member-modal {
    .select-dept-member-left {
        float: left;
        width: 360px;
        height: 400px;
        border-right: 1px solid @gray-color-elip;
        .tab {
            height: 40px;
            line-height: 40px;
            padding: 0 10px;
            border-bottom: 1px solid @gray-color-elip;
            font-size: 0;
            text-align: center;
            span {
                font-size: 12px;
                display: inline-block;
                position: relative;
                width: 50%;
                text-align: center;
                cursor: pointer;
                &.active {
                    color: @primary-color;
                    &:after {
                        position: absolute;
                        content: '';
                        width: 100px;
                        height: 2px;
                        background-color: @primary-color;
                        left: 50%;
                        margin: 0 0 0 -50px;
                        bottom: -1px;
                    }
                }
            }
        }
        .content {
            height: 360px;
            overflow: auto;
        }
    }
    .select-dept-member-right {
        float: right;
        width: 240px;
        height: 400px;
        overflow: auto;
        .title {
            height: 40px;
            line-height: 40px;
            padding: 0 10px;
            border-bottom: 1px solid @gray-color-elip;
            span {
                float: right;
                color: @error-color;
                font-size: 12px;
                cursor: pointer;
            }
        }
        .echo-list {
            height: 360px;
            overflow: auto;
            ul {
                li {
                    padding: 5px 10px 8px
                }
            }
            .line {
                height: 1px;
                background-color: @gray-color-elip;
            }
            .expand {
                padding: 5px 10px;
                background-color: #f9f9f9;
                i {
                    float: right;
                    margin-top: 4px
                }
            }
            .clear {
                color: @gray-color-light;
                cursor: pointer;
                padding: 7px;
                position: absolute;
                right: 4px;
                top: 0;
            }
        }
    }
    .ivu-modal-body {
        padding: 0;
    }
}
</style>


