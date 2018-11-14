<template>
    <div class="deploy-container">
        <div class="deploy-member">
            <div class="deploy-title">{{$t('operate.addAdministrator')}}
                <span>
                    <Button type="primary" @click="handleAddMember">{{$t('operate.add')}}</Button>
                    <Button type="default" @click="handleDeleteMember" v-if="currentMember">{{$t('operate.delete')}}</Button>
                </span>
            </div>
            <div class="deploy-member-content" 
                v-if="deployMember && deployMember.length">
                <div class="deploy-member-card" 
                    v-for="(item) in deployMember"
                    @click="handleChangeLimit(item)"
                    :class="{'active':currentMember && (item.memberId === currentMember.memberId)}"
                    :key="item.memberId">
                    <fs-avatar :avatar="item.avatar" :name="item.userName" size="50px"/>
                    <span class="name">{{item.userName}}</span>
                    <span class="ico"></span>
                </div>
            </div>
        </div>
        <div class="deploy-limit">
            <div class="deploy-title" v-if="currentMember">
                {{currentMember.userName}}{{$t('title.statisticalAuthority')}}
                <span><Button type="default" @click="handleAddLimit">{{$t('operate.add')}}</Button></span>
            </div>
            <div class="deploy-limit-content" v-if="deployLimit">
                <template v-if="deployLimit && deployLimit.length">
                    <span class="deploy-limit-scope" v-for="item in deployLimit" :key="item.id">
                        {{item[mapKey[item.dataType]] || '“'}}
                        <i @click="handleDeleteLimit(item)" class="icon-delete-userlist"></i>
                    </span>
                </template>
                <div class="no-data" v-else>{{$t('status.noRelevantData')}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import FsAvatar from 'app_component/common/avatar'
export default {
    data() {
        return {
            deployMember: null,
            deployLimit: null,
            currentMember: null,
            stashLimitData: {},
            getLimitTime: null,
            mapKey: {
                2: 'userName',
                1: 'deptName',
                0: 'orgName'
            }
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
                }
            }
            this.$selectTree.show(JSON.parse(JSON.stringify(info)), res=>{
                if(res && res.man.length) {
                    const members = res.man.map(mem=>{
                        return {
                            memberId: mem.memberId
                        }
                    })
                    this.$ajax({
                        url: '/rest/v1/diaryStatistics/people',
                        type: 'post',
                        data: members,
                        requestBody: 1,
                        success: (res)=>{
                            if(res && res.code == 0) {
                                this.getDeployMember()
                            } else {
                                this.$Message.warning(res.msg)
                            }
                        }
                    })
                }
            })
        },
        handleDeleteMember() {
            this.$Modal.confirm({
                title: `${this.$t('operate.delete')}${this.$t('noun.admin')}`,
                content: `${this.$t('operate.delete')}${this.$t('noun.admin')}`,
                onOk: () => {
                    const members = [this.currentMember.memberId]
                    this.$ajax({
                        url: '/rest/v1/diaryStatistics/people/delete',
                        type: 'post',
                        data: members,
                        requestBody: 1,
                        success: (res)=>{
                            if(res && res.code == 0) {
                                this.handleInitData()
                                this.getDeployMember()
                            }
                        }
                    })
                }
            })

        },
        handleAddLimit() {
            let info = {
                title: this.$t('operate.addAdministrator'),
                man: true,
                dep: true,
                team:  false,
                limit: {
                    showAll: false,
                    warning: '',
                    count: 500
                }
            }
            this.$selectTree.show(JSON.parse(JSON.stringify(info)), res=>{
                const memberIds = res.man.map(mem=>{
                    return mem.memberId
                }) || []
                let deptIds = [], orgIds = []
                res.dep.forEach(dept=>{
                    if(dept.type === 1) {
                        orgIds.push(dept.deptId)
                    }
                    if(dept.type === 0) {
                        deptIds.push(dept.deptId)
                    }
                }) 
                
                this.$ajax({
                    url: '/rest/v1/diaryStatistics/acl',
                    type: 'post',
                    data: {
                        memberId: this.currentMember.memberId,
                        memberIds: memberIds,
                        deptIds: deptIds,
                        orgIds: orgIds,
                    },
                    requestBody: 1,
                    success: (res)=>{
                        if(res && res.code == 0) {
                            this.getDeployLimit()
                        } else {
                            this.$Message.warning(res.msg)
                        }
                    }
                })
            })
        },
        handleDeleteLimit(param) {
            let stashData = {
                2: {
                    key: 'memberId',
                    value: []
                },
                1: {
                    key: 'deptId',
                    value: []
                },
                0: {
                    key: 'orgId',
                    value: []
                }
            }
            stashData[param.dataType].value.push(param[stashData[param.dataType].key])
            const memberIds = stashData[2].value
            const deptIds = stashData[1].value
            const orgIds = stashData[0].value
            this.$ajax({
                url: '/rest/v1/diaryStatistics/acls',
                type: 'delete',
                data: {
                    memberId: this.currentMember.memberId,
                    memberIds: memberIds,
                    deptIds: deptIds,
                    orgIds: orgIds
                },
                requestBody: 1,
                success: (res) =>{
                    this.getDeployLimit()
                }
            })
        },
        handleChangeLimit(param) {
            if(this.currentMember && param.memberId === this.currentMember.memberId) {
                return this.handleInitData()
            }
            this.currentMember = param
            if(this.stashLimitData[param.memberId]) {
                return this.deployLimit = this.stashLimitData[param.memberId]
            }
            this.getDeployLimit()
        },
        handleInitData() {
            this.currentMember = null
            this.deployLimit = null
        },
        getDeployMember() {
            this.$ajax({
                url: '/rest/v1/diaryStatistics/peoples',
                data: {
                    pageNo: 1,
                    pageSize: 999
                },
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.deployMember = res.data
                    }
                }
            })
        },
        getDeployLimit() {
            clearTimeout(this.getLimitTime)
            this.getLimitTime = setTimeout(() => {
                if(!this.currentMember) return
                this.$ajax({
                    url: '/rest/v1/diaryStatistics/acls',
                    data: {
                        memberId: this.currentMember.memberId
                    },
                    success: (res) =>{
                        this.deployLimit = res.data
                        this.stashLimitData[this.currentMember.memberId] = res.data
                    }
                })
                
            }, 300)
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
            margin-right: 5px;
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
                margin-top: 8px;
                line-height: 18px;
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
        .no-data {
            font-size: 14px;
            line-height: 110px;
            text-align: center;
            color: @gray-color-dark;
        }
        .deploy-limit-scope {
            background:rgba(243,243,243,1);
            border-radius:4px;
            position: relative;
            display: inline-block;
            color:rgba(85,85,85,1);
            line-height: 16px;
            padding: 4px 10px;
            margin: 0 10px 10px 0;

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
