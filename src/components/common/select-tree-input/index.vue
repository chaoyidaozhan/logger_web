<template>
    <div class="select-tree-input cursor-pointer" 
        :class="{disabled: !org.length && !dept.length && !group.length && !member.length, ellipsis: ellipsis}"
        @click="openSelectMember">
        <div class="select-tree-ctn">
            <div class="scroll-auto-ctn">
                <template v-if="!org.length && !dept.length && !group.length && !member.length">
                    {{placeholder}}
                </template>
                <template v-else-if="ellipsis">
                    <span v-for="(item, index) in org" :key="index">
                        {{item.orgName}}
                    </span>
                    <span v-for="(item, index) in dept" :key="index">
                        {{item.deptName}}
                    </span>
                    <span v-for="(item, index) in group" :key="index">
                        {{item.groupName}}
                    </span>
                    <span v-for="item in member" :key="item.memberId">
                        {{item.userName}}
                    </span>
                </template>
                <template v-else>
                    <span class="tag" v-for="(item, index) in org" :key="index" @click="handleClear($event, item, 'org')">
                        {{item.orgName}}
                        <i class="icon-delete-userlist"></i>
                    </span>
                    <span class="tag" v-for="(item, index) in dept" :key="index" @click="handleClear($event, item, 'dept')">
                        {{item.deptName}}
                        <i class="icon-delete-userlist"></i>
                    </span>
                    <span class="tag" v-for="(item, index) in group" :key="index" @click="handleClear($event, item, 'group')">
                        {{item.groupName}}
                        <i class="icon-delete-userlist"></i>
                    </span>
                    <span class="tag" v-for="item in member" :key="item.memberId" @click="handleClear($event, item, 'member')">
                        {{item.userName}}
                        <i class="icon-delete-userlist"></i>
                    </span>
                </template>
            </div>
        </div>
        <i class="icon-add"></i>
    </div>
</template>
<script>
/**
 * showDept 是否显示选择组织组件
 * showGroup 是否显示选择内部群组件
 * showMember 是否显示选择提交人组件
 * ellipsis 是否强制换行, 不换行时可以删除单个选择 
 * limit showAll 是否添加全选 count 最大数量限制 warning 超过选择提示信息
 **/
export default {
    props: {
        org: { // 组织数据
            type: Array,
            default() {
                return []
            }
        },
        dept: { // 部门数据
            type: Array,
            default() {
                return []
            }
        },
        group: { // 内部群数据
            type: Array,
            default() {
                return []
            }
        },
        member: { // 人员数据
            type: Array,
            default() {
                return []
            }
        },
        showLoading: {
            type: Boolean,
            default: true
        },
        showOrg: {
            type: Boolean,
            default: false
        },
        showDept: {
            type: Boolean,
            default: false
        },
        showOtherDept: {
            type: Boolean,
            default: false
        },
        showGroup: {
            type: Boolean,
            default: false
        },
        showMember: {
            type: Boolean,
            default: true
        },
        ellipsis:  {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: '选择可见范围'
        },
        placeholder: {
            type: String,
            default: '选择可见范围'
        },
        limit: {
            type: Object,
            default() {
                return {
                    showAll: false,
                    warning: '',
                    count: 500
                }
            }            
        },
        deptApiUri: {
            type: String
        },
        groupApiUri: {
            type: String
        },
        orgApiUri: {
            type: String
        },
        memberApiUri: {
            type: String
        },
        isRadio: {
            type: false,
            default: false
        }
    },
    methods: {
        handleSelect(res) {
            this.$emit('handleSelect', res);
        },
        handleClear(e, item, name) {
            e.stopPropagation();
            let selected = {
                org: JSON.parse(JSON.stringify(this.org)),
                dept: JSON.parse(JSON.stringify(this.dept)),
                member: JSON.parse(JSON.stringify(this.member)),
                group: JSON.parse(JSON.stringify(this.group))
            }
            let arr = [];
            let id = {
                org: 'orgId',
                dept: 'deptId',
                group: 'groupId',
                member: 'memberId'
            }
            selected[name].forEach((val)=>{
                if(val[`${id[name]}`] != item[[`${id[name]}`]]) {
                    arr.push(val)
                }
            });
            selected[name] = arr;
            this.handleSelect(selected)
        },
        openSelectMember() {
            let info = {
                isRadio: this.isRadio,
                title: this.title,
                man: this.showMember,
                team:  this.showGroup,
                dep: this.showDept,
                org: this.showOrg,
                showOtherDept: this.showOtherDept,
                showLoading: this.showLoading,
                limit: { 
                    ...this.limit
                },
                selected: {
                    org: this.org,
                    dep: this.dept,
                    man: this.member,
                    team: this.group
                }
            };
            if(this.deptApiUri) {
                info.deptApiUri = this.deptApiUri;
                if(this.showOtherDept) {
                    info.deptApiData = {
                        pid: this.$store.state.userInfo.deptId
                    }
                }
            }
            if(this.groupApiUri) {
                info.groupApiUri = this.groupApiUri
            }
            if(this.orgApiUri) {
                info.orgApiUri = this.orgApiUri
            }
            if(this.memberApiUri) {
                info.memberApiUri = this.memberApiUri
            }
            this.$selectTree.show(JSON.parse(JSON.stringify(info)), res=>{
                let params = {}
                params.dept = res.dep
                params.member = res.man
                params.group = res.team
                params.org = res.org
                this.handleSelect(JSON.parse(JSON.stringify(params)))
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import '~app_assets/css/var.less';
.select-tree-input {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    padding: 4px 35px 4px 7px;
    font-size: 12px;
    border: 1px solid @border-color;
    border-radius: 4px;
    color: @gray-color-medium;
    background-color: @white-color;
    background-image: none;
    position: relative;
    line-height: 22px;
    transition: all 0.2s ease-in-out;
    .icon-add {
        position: absolute;
        height: 30px;
        font-size: 14px;
        line-height: 30px;
        // top: 50%;
        top: 1px;
        // margin-top: -15px;
        width: 30px;
        background-color: @white-color;
        color: @gray-color-normal;
        right: 1px;
        text-align: center;
    }
    .select-tree-ctn {
        position: relative;
    }
    &:hover {
        border-color: @input-select-border-color;
    }
    &.ellipsis {
        height: 32px;
    }
    &.disabled {
        color: @btn-disable-color;
    }
    .tag {
        padding: 0 10px 0 6px;
        color: @gray-color-medium;
        background-color: @white-color-dark;
        margin:2px 10px 2px 2px;
        line-height: 19px;
        display: inline-block;
        position: relative;
        i {
            display: none;
            color: @error-color;
            position: absolute;
            right: -6px;
            top: 50%;
            margin-top: -7px;
            background: @white-color;
            border-radius: 50%;
            padding: 1px;
            font-size: 12px;
        }
        &:hover > i {
            display: block;
        }
    }
}
</style>

