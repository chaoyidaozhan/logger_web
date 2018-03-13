<template>
    <div class="select-member-input cursor-pointer" 
        @click="openSelectMember" 
        :class="{disabled: !dept.length && !group.length && !member.length, ellipsis: ellipsis}">
        <template v-if="!dept.length && !group.length && !member.length">
            {{placeholder}}
        </template>
        <template v-else-if="ellipsis">
            <span v-for="item in dept">
                {{item.deptName}}
            </span>
            <span v-for="item in group">
                {{item.groupName}}
            </span>
            <span v-for="item in member" :key="item.memberId">
                {{item.userName}}
            </span>
        </template>
        <template v-else>
            <span class="tag" v-for="item in dept" @click="handleClearMember($event, item, 'dept')">
                {{item.deptName}}
                <i class="icon-delete-userlist"></i>
            </span>
            <span class="tag" v-for="item in group" @click="handleClearMember($event, item, 'group')">
                {{item.groupName}}
                <i class="icon-delete-userlist"></i>
            </span>
            <span class="tag" v-for="item in member" :key="item.memberId" @click="handleClearMember($event, item, 'member')">
                {{item.userName}}
                <i class="icon-delete-userlist"></i>
            </span>
        </template>
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
        dept: { // 组织数据
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
        showDept: {
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
        }
    },
    data() {
        return {
            
        }
    },
    methods: {
        handleSelectMember(res) {
            this.$emit('handleSelectMember', res);
        },
        handleClearMember(e, item, name) {
            e.stopPropagation();
            let selected = {
                dept: JSON.parse(JSON.stringify(this.dept)),
                member: JSON.parse(JSON.stringify(this.member)),
                group: JSON.parse(JSON.stringify(this.group))
            }
            let arr = [];
            let id = {
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
            this.handleSelectMember(selected)
        },
        openSelectMember() {
            let info = {
                title: this.title,
                man: this.showMember,
                team:  this.showGroup,
                dep: this.showDept,
                limit: { 
                    ...this.limit
                },
                selected: {
                    dep: this.dept,
                    man: this.member,
                    team: this.group
                }
            };
            if(this.deptApiUri) {
                info.deptApiUri = this.deptApiUri;
                if(this.deptApiUri == '/team/getDeptsWithPart') {
                    info.deptApiData = {
                        pid:this.$store.state.userInfo.deptId
                    }
                }
            }
            if(this.groupApiUri) {
                info.groupApiUri = this.groupApiUri
            }
            console.log(info)
            this.$selectMember.show(JSON.parse(JSON.stringify(info)), res=>{
                let params = {};
                params.dept = res.dep;
                params.member = res.man;
                params.group = res.team;
                this.handleSelectMember(JSON.parse(JSON.stringify(params)))
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../../assets/css/var.less';
.select-member-input {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    padding: 4px 35px 4px 7px;
    font-size: 12px;
    border: 1px solid @border-color;
    border-radius: 4px;
    color: @gray-color-dark;
    background-color: @white-color;
    background-image: none;
    position: relative;
    line-height: 22px;
    &.ellipsis {
        height: 32px;
    }
    &.disabled {
        color: @btn-disable-color;
    }
    .icon-add {
        position: absolute;
        height: 30px;
        font-size: 14px;
        line-height: 30px;
        top: 50%;
        margin-top: -15px;
        width: 30px;
        background-color: @white-color;
        color: @gray-color-normal;
        right: 1px;
        text-align: center;
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

