<template>
    <div class="deploy-container" v-yyloading="isLoadingShow">
        <div class="deploy-member">
            <div class="deploy-title">{{$t('operate.addAdministrator')}}
                <span>
                    <YYButton type="primary" @click="handleAddMember">{{$t('operate.add')}}</YYButton>
                    <YYButton type="default" @click="handleDeleteMember" v-if="currentMember">{{$t('operate.delete')}}</YYButton>
                </span>
            </div>
            <div class="deploy-member-content"
                v-if="deployMember && deployMember.length">
                <div class="deploy-member-card" 
                    v-for="(item) in deployMember"
                    v-if="!+item.status"
                    @click="handleChangeLimit(item)"
                    :class="{'active':currentMember && (item.memberId === currentMember.memberId)}"
                    :key="item.memberId">
                    <fs-avatar :avatar="item.avatar" :name="item.userName" size="50px"/>
                    <span class="name">{{item.userName}}</span>
                    <span class="ico"></span>
                </div>
            </div>
        </div>
        <div class="deploy-limit" v-if="currentTab == 'addReportReviewer'">
            <div class="reportMemberList">
                <div class="memberAddTemplate mb-flex mb-flex-align-center">
                    <div>雷蒙蒙的核查模版</div>
                    <div class="mb-flex mb-flex-align-center mb-flex-pack-justify">
                        <div class="yy-icon-xinzeng"></div>
                        <div>{{$t('operate.add')}}</div>
                    </div>
                </div>
                <div class="memberSelectedTemplate mb-flex">
                    <div class="mb-flex mb-flex-align-center mb-flex-pack-justify">
                        <div>项目双周报</div>
                        <div class="yy-icon-guanbi"></div>
                    </div>
                    <div class="mb-flex mb-flex-align-center mb-flex-pack-justify">
                        <div>项目双周报</div>
                        <div class="yy-icon-guanbi"></div>
                    </div>
                </div>
            </div>
            <div class="reportMemberList">
                <div class="memberAddTemplate mb-flex mb-flex-align-center">
                    <div>雷蒙蒙的核查模版</div>
                    <div class="mb-flex mb-flex-align-center mb-flex-pack-justify">
                        <div class="yy-icon-xinzeng"></div>
                        <div>{{$t('operate.add')}}</div>
                    </div>
                </div>
                <div class="memberSelectedTemplate mb-flex">
                    <div class="mb-flex mb-flex-align-center mb-flex-pack-justify">
                        <div>项目双周报</div>
                        <div class="yy-icon-guanbi"></div>
                    </div>
                    <div class="mb-flex mb-flex-align-center mb-flex-pack-justify">
                        <div>项目双周报</div>
                        <div class="yy-icon-guanbi"></div>
                    </div>
                </div>
            </div>
            <div class="changeOperate mb-flex mb-flex-pack-justify">
                <YYButton type="primary" @click="changeSave">{{$t('operate.save')}}</YYButton>
                <YYButton @click="changeReset">{{$t('operate.reset')}}</YYButton>
            </div>
        </div>
        <div v-else-if="currentTab == 'addReportReminder'">

        </div>
        <div class="deploy-limit" v-else-if="currentTab == 'configureAdministrator'">
            <div class="deploy-title" v-if="currentMember">
                {{currentMember.userName}}{{$t('title.statisticalAuthority')}}
                <span><YYButton type="default" @click="handleAddLimit">{{$t('operate.add')}}</YYButton></span>
            </div>
            <div class="deploy-limit-content" v-if="deployLimit && deployLimit.length">
                <span class="deploy-limit-scope" 
                    v-for="item in deployLimit"
                    v-if="!+item.status"
                    :key="item.id">
                    {{item[mapKey[item.dataType]] || '“'}}
                    <i @click="handleDeleteLimit(item)" class="icon-delete-userlist"></i>
                </span>
            </div>
        </div>
        <div class="addTemplate mb-flex mb-flex-v" v-show="isAddTemplateShow">
            <div class="addTemplateHeader mb-flex mb-flex-align-center mb-flex-pack-justify">
                <div>{{$t('noun.addTemplate')}}</div>
                <div class="yy-icon-guanbi" @click.stop="isAddTemplateShow = false"></div>
            </div>
            <div class="addTemplateBody mb-flex-1 mb-flex mb-flex-pack-justify">
                <div class="templateItem" v-for="(item, index) in allTemplateList">
                    <fs-template-item
                        :bottomOperate="false"
                        :isToDetail="false"
                        :isSelectIconShow="true"
                        :data="item">
                    </fs-template-item>
                </div>
            </div>
            <div class="addTemplateFooter mb-flex mb-flex-align-center mb-flex-pack-justify">
                <div>
                    <YYCheckbox v-model="isAllChecked" @on-change="allCheck(isAllChecked)">
                        {{$t('operate.checkAll')}}
                    </YYCheckbox>
                </div>
                <div>
                    <YYButton type="primary" @click.stop="addSelectedTemplate">{{$t('noun.addTemplate')}}</YYButton>
                </div>
                <div class="mb-flex-1">
                    <YYPagination
                        :total="totalCount" 
                        :pageSize="pageSize"
                        :showTotal="false"
                        align="right"
                        :show-elevator="false"
                        :show-sizer="false"
                        @on-change="paginationChange"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import FsAvatar from 'app_component/common/avatar';
import FsTemplateItem from '../template/list/item';
export default {
    data() {
        return {
            deployMember: [],
            deployLimit: null,
            currentMember: null,
            stashLimitData: {},
            getLimitTime: null,
            mapKey: {
                2: 'userName',
                1: 'orgName',
                0: 'deptName'
            },
            allTemplateList: [],
            totalCount: 0,
            pageSize: 20,
            pageNo: 1,
            isAllChecked: false,
            isLoadingShow: false,
            isAddTemplateShow: false,
            
        }
    },
    props: {
        currentTab: {
            type: String,
            default: 'addReportReviewer'
        }
    },
    watch: {
        currentTab: {
            handler(newVal, oldVal) {
                switch(newVal) {
                    case 'addReportReviewer':
                        this.reportReviewerList(0);
                    break;
                    case 'addReportReminder':
                        this.reportReviewerList(1);
                    break;
                    case 'configureAdministrator':
                        this.getDeployMember();
                    break;
                }
            },
            immediate: true
        }
    },
    components: {
        FsAvatar,
        FsTemplateItem
    },
    methods: {
        reportReviewerList(type = 0) {
            this.isLoadingShow = true;
            let qzId = this.$store.state.userInfo.qzId;
            this.$ajax({
                url: `/rest/v1/${qzId}/diary/roles`,
                data: {
                    type
                },
                success: (res)=>{
                    this.isLoadingShow = false;
                    if(res) {
                        this.deployMember = res
                    }
                }
            })
        },
        changeSave() {

        },
        changeReset() {

        },
        paginationChange() {
            
        },
        allCheck(isAllChecked) {

        },
        loadData() {
            this.$ajax({
                url: '/template/list',
                data: {
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                },
                success: (res)=>{
                    if(res && res.code == 0) {
                        let list = res.data.list;
                        list.forEach((item, index) => {
                            item.isCurrentTemplateSelected = false;
                        });
                        this.allTemplateList = list || [];
                        this.totalCount = res.data.totalCount || 0;
                    }
                },
                error: (res)=>{
                    this.$YYMessage.error(res && res.msg || this.$t('status.networkError'));
                }
            });
        },
        addRoleMember(members = '') {
            if(this.currentTab == 'configureAdministrator') {
                this.$ajax({
                    url: '/rest/v1/diaryStatistics/people',
                    type: 'post',
                    data: members,
                    requestBody: 1,
                    success: (res)=>{
                        if(res && res.code == 0) {
                            this.getDeployMember()
                        } else {
                            this.$YYMessage.warning(res.msg)
                        }
                    }
                });
                return;
            }
            let type = this.currentTab == 'addReportReviewer' ? 0 : 1;
            this.$ajax({
                url: '/rest/v1/diary/role',
                type: 'post',
                data: {
                    memberId: members,
                    type
                },
                requestBody: 1,
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.reportReviewerList(type);
                    } else {
                        this.$YYMessage.warning(res.msg)
                    }
                }
            });
        },
        handleAddMember() {
            let info = {
                title: this.$t('operate.addAdministrator'),
                man: true,
                showLoading: true,
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
                    this.addRoleMember(members);
                }
            })
        },
        handleDeleteMember() {
            this.$YYModal.show({
                title: `${this.$t('operate.delete')}${this.$t('noun.admin')}`,
                content: `${this.$t('operate.delete')}${this.$t('noun.admin')}`,
                onOk: () => {
                    const members = [this.currentMember.memberId]
                    this.stashLimitData[this.currentMember.memberId] = null
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
            let dept = [], man = [], org = []
            this.stashLimitData[this.currentMember.memberId].forEach(item=>{
                if(item.dataType === 1) {
                    item.deptId = item.orgId
                    item.deptName = item.orgName
                }
                if(item.dataType === 1 || item.dataType === 0) {
                    dept.push(item)
                }
                if(item.dataType === 2) {
                    man.push(item)
                }
            })
            let info = {
                title: this.$t('operate.addAdministrator'),
                man: true,
                dep: true,
                team:  false,
                showLoading: true,
                selected: {
                    dep: dept,
                    man: man,
                    org: org
                },
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
                    if(dept.type === 1 || dept.dataType === 1) {
                        orgIds.push(dept.deptId)
                    }
                    if(dept.type === 0 || dept.dataType === 0) {
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
                            this.$YYMessage.warning(res.msg)
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
                    key: 'orgId',
                    value: []
                },
                0: {
                    key: 'deptId',
                    value: []
                }
            }
            stashData[param.dataType].value.push(param[stashData[param.dataType].key])
            const memberIds = stashData[2].value
            const orgIds = stashData[1].value
            const deptIds = stashData[0].value
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
            this.isLoadingShow = true;
            this.$ajax({
                url: '/rest/v1/diaryStatistics/peoples',
                data: {
                    pageNo: 1,
                    pageSize: 999
                },
                success: (res)=>{
                    this.isLoadingShow = false;
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
        this.loadData();
    }
}
</script>

<style lang="less" scoped>
.deploy-container {
    padding: 20px;
    height: 100%;
    position: relative;
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
                box-shadow: 0 0 16px rgba(0,0,0,.15);
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
    .reportMemberList {
        margin-bottom: 20px;
        .memberAddTemplate {
            color: #333;
            font-size: 12px;
            cursor: pointer;
            & > div {
                margin-right: 16px;
                font-weight: 500;
            }
            .mb-flex {
                width: 60px;
                height: 26px;
                border-radius: 3px;
                box-sizing: border-box;
                border: 1px solid #D9D9D9;
                padding: 0 8px 0 10px;
            }
            margin-bottom: 12px;
        }
        .memberSelectedTemplate {
            & > .mb-flex {
                min-width: 92px;
                height: 30px;
                border-radius:3px;
                font-size: 12px;
                color: #333;
                padding: 0 10px 0 8px;
                flex-wrap: wrap;
                margin: 0 8px 8px 0;
                background: #E6E6E6;
                div:first-of-type {
                    margin-right: 6px;
                }
                .yy-icon-guanbi {
                    cursor: pointer;
                }
            }
        }
    }
    .changeOperate {
        width: 128px;
    }
    .deploy-limit-content {
        border: 1px solid @border-color-dark;
        border-radius: 4px;
        padding: 10px;
        min-height: 130px;
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
                color: @primary-color;
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
    .addTemplate {
        position: absolute;
        top: -60px;
        right: 0;
        bottom: 0;
        width: 622px;
        box-shadow:-8px 0px 30px 0px rgba(74,81,93,0.2);
        background: #F6F5F8;
        .addTemplateHeader {
            height: 48px;
            padding: 0 22px 0 20px;
            font-size: 14px;
            color: #333;
            .yy-icon-guanbi {
                cursor: pointer;
            }
        }
        .addTemplateBody {
            flex-wrap: wrap;
            padding: 12px 20px;
            box-sizing: border-box;
            overflow-y: auto;
            height: 100%;
        }
        .templateItem {
            width: 275px;
            height: 110px;
            margin-bottom: 16px;
            background: white;
        }
        .addTemplateFooter {
            height: 60px;
            padding: 0 20px 0;
            background: white;
        }
    }
}
</style>
