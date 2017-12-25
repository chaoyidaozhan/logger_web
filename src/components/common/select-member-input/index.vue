<template>
    <div class="select-member-input cursor-pointer" 
        @click="openSelectMember" 
        :class="{disabled: !dep.length && !team.length && !man.length, ellipsis: ellipsis}">
        <template v-if="!dep.length && !team.length && !man.length">
            {{placeholder}}
        </template>
        <template v-else>
            <span class="tag" v-for="item in dep" :key="item.deptId">{{item.deptName}}</span>
            <span class="tag" v-for="item in team" :key="item.deptId">{{item.groupName}}</span>
            <span class="tag" v-for="item in man" :key="item.deptId">{{item.userName}}</span>
        </template>
        <i class="icon-add"></i>
    </div>
</template>
<script>
export default {
    props: {
        dep: {
            type: Array,
            default() {
                return []
            }
        },
        team: {
            type: Array,
            default() {
                return []
            }
        },
        man: {
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
        openSelectMember() {
            let info = {
                title: this.title,
                man: this.showMember,
                team:  this.showGroup,
                dep: this.showDept,
                selected: {
                    dep: this.dep,
                    man: this.man,
                    team: this.team
                }
            };
            console.log(info)
            this.$selectMember.show(info, res=>{
                this.handleSelectMember(res)
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
    height: 32px;
    line-height: 22px;
    padding: 4px 24px 4px 7px;
    font-size: 12px;
    border: 1px solid @border-color;
    border-radius: 4px;
    color: @gray-color-dark;
    background-color: @white-color;
    background-image: none;
    position: relative;
    &.disabled {
        color: @btn-disable-color;
    }
    i {
        position: absolute;
        right: 10px;
        height: 32px;
        font-size: 14px;
        line-height: 30px;
        top: 0;
        color: @gray-color-normal;
    }
}
</style>

