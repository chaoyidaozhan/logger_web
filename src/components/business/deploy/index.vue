<template>
    <div class="deploy-container">
        <div class="deploy-member">
            <div class="deploy-title">{{$t('operate.addAdministrator')}}
                <span>
                    <Button type="primary" @click="handleAddMember">{{$t('operate.add')}}</Button>
                    <Button type="default">{{$t('operate.delete')}}</Button>
                </span>
            </div>
            <div class="deploy-member-content" 
                v-if="deployMember && deployMember.length">
                <div class="deploy-member-card" 
                    v-for="(item, index) in deployMember"
                    @click="handleChangeLimit(item)"
                    :class="{'active':item.memberId === currentMemberId}"
                    :key="index">
                    <fs-avatar name="nizhja" size="50px"/>
                    <span class="name">nizhja</span>
                    <span class="ico"></span>
                </div>
            </div>
        </div>
        <div class="deploy-limit">
            <div class="deploy-title">
                {{$t('title.statisticalAuthority')}}
                <span><Button type="default">{{$t('operate.add')}}</Button></span>
            </div>
            <div class="deploy-limit-content">
                <span class="deploy-limit-scope">13232131<i class="icon-delete-userlist"></i></span>
            </div>
        </div>
    </div>
</template>
<script>
import FsAvatar from 'app_component/common/avatar'
export default {
    data() {
        return {
            deployMember: [1,2,3,4,5,6,7],
            deployLimit: null,
            currentMemberId: null
        }
    },
    components: {
        FsAvatar
    },
    methods: {
        handleAddMember() {
            let info = {
                title: this.$t('operate.addAdministrator'),
                man: true,
                team:  false,
                dep: false,
                limit: {
                    showAll: false,
                    warning: '',
                    count: 500
                },
                selected: {
                    
                }
            }
            this.$selectMember.show(JSON.parse(JSON.stringify(info)), res=>{
                console.log(res)
                
            })
        },
        handleDeleteMember() {

        },
        handleAddLimit() {

        },
        handleChangeLimit(param) {
            console.log(param)
            this.getDeployLimit()
        },
        getDeployMember() {

        },
        getDeployLimit() {

        }
    },
    created () {
        this.getDeployMember()
    }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/var.less';
.deploy-container {
    padding: 20px;
    .deploy-title {
        color: @text-color;
        font-size: 14px;
        margin-bottom: 14px;
        span {
            margin-left: 10px;
        }
        .ivu-btn {
            padding: 4px 15px;
            margin-right: 5px;
            &.ivu-btn-default {
                background-color: @select-item-bg;
                color: @gray-color-medium;
            }
            &:hover {
                border-color: @select-item-bg;
            }
            &:focus {
                box-shadow: none;
            }
        }
    }
    .deploy-member-content {
        font-size: 0;
        .deploy-member-card {
            width: 96px;
            height: 116px;
            margin: 0 10px 10px 0;
            background-color: @menu-hover-bg-color;
            border-radius: 3px;
            position: relative;
            padding-top: 24px;
            text-align: center;
            display: inline-block;
            transition: .2s ease all;
            cursor: default;
            .ico {
                position: absolute;
                right: 0;
                top: 0;
                width: 20px;
                height: 18px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }
            .name {
                width: 100%;
                padding: 0 10px;
                font-size: 12px;
                display: inline-block;
                color: @gray-color-medium;
                margin-top: 10px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            &:hover, &.active {
                background-color: @white-color;
                box-shadow: 0 5px 30px rgba(0,0,0,.15);
            }
            &:hover .ico {
                background-image: url('../../../assets/images/angle-normal.png');
            }
            &.active .ico {
                background-image: url('../../../assets/images/angle-primary.png');
            }
        }
    }
    .deploy-limit {
        margin-top: 20px;
    }
    .deploy-limit-content {
        border: 1px solid @border-color-dark;
        border-radius: 4px;
        padding: 10px;
        height: 130px;
        font-size: 0;
        .deploy-limit-scope {
            background:rgba(243,243,243,1);
            border-radius:4px;
            position: relative;
            display: inline-block;
            color:rgba(85,85,85,1);
            line-height: 16px;
            padding: 4px 10px;
            margin-right: 10px;
            font-size:12px;
            .icon-delete-userlist {
                display: none;
                color: @input-select-border-color;
                position: absolute;
                right: -6px;
                top: 50%;
                margin-top: -7px;
                background: #ffffff;
                border-radius: 50%;
                padding: 1px;
                font-size: 12px;
            }
            &:hover {
                .icon-delete-userlist {
                    display: block;
                }
            }
        }
    }
}
</style>
