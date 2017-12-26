<template>
    <div class="select-member-input cursor-pointer" 
        @click="openSelectMember" 
        :class="{disabled: !dep.length && !team.length && !man.length, ellipsis: ellipsis}">
        <template v-if="!dep.length && !team.length && !man.length">
            {{placeholder}}
        </template>
        <template v-else-if="ellipsis">
            <span v-for="item in dep" :key="item.deptId">
                {{item.deptName}}
            </span>
            <span v-for="item in team" :key="item.groupId">
                {{item.groupName}}
            </span>
            <span v-for="item in man" :key="item.memberId">
                {{item.userName}}
            </span>
        </template>
        <template v-else>
            <span class="tag" v-for="item in dep" :key="item.deptId">
                {{item.deptName}}
                <Icon type="close-round" @click.native="handleClearMember($event, item, 'dep')"></Icon>
            </span>
            <span class="tag" v-for="item in team" :key="item.groupId">
                {{item.groupName}}
                <Icon type="close-round" @click.native="handleClearMember($event, item, 'team')"></Icon>
            </span>
            <span class="tag" v-for="item in man" :key="item.memberId">
                {{item.userName}}
                <Icon type="close-round" @click.native="handleClearMember($event, item, 'man')"></Icon>
            </span>
        </template>
        <i class="icon-add"></i>
    </div>
</template>
<script>
export default {
    props: {
        dep: { // 组织数据
            type: Array,
            default() {
                return []
            }
        },
        team: { // 团队数据
            type: Array,
            default() {
                return []
            }
        },
        man: { // 人员数据
            type: Array,
            default() {
                return []
            }
        },
        showDept: {
            type: Boolean
        },
        showGroup: {
            type: Boolean
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
            e.preventDefault();
            e.stopPropagation();
            console.log(e)
            let selected = {
                dep: JSON.parse(JSON.stringify(this.dep)),
                man: JSON.parse(JSON.stringify(this.man)),
                team: JSON.parse(JSON.stringify(this.team))
            }
            let arr = [];
            let id = {
                dep: 'deptId',
                team: 'groupId',
                man: 'memberId'
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
                selected: {
                    dep: JSON.parse(JSON.stringify(this.dep)),
                    man: JSON.parse(JSON.stringify(this.man)),
                    team: JSON.parse(JSON.stringify(this.team))
                }
            };
            this.$selectMember.show(info, res=>{
                this.handleSelectMember(JSON.parse(JSON.stringify(res)))
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
    padding: 4px 30px 4px 7px;
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
        padding: 0 6px;
        color: @gray-color-light;
        background-color: @gray-color-elip;
        margin:2px;
        line-height: 19px;
        border-radius: 12px;
        display: inline-block;
    }
}
</style>

