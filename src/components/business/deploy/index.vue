<template>
    <div class="deploy-container" v-yyloading="isLoadingShow">
        <div class="deploy-member">
            <div class="deploy-title mb-flex mb-flex-align-center">
                <div v-if="currentTabType == 0">添加汇报核查人</div>
                <div v-else-if="currentTabType == 1">添加汇报催办人</div>
                <div v-else-if="currentTabType == 2">{{$t('operate.addAdministrator')}}</div>
                <YYButton class="operateAdd" type="primary" @click="handleAddMember">{{$t('operate.add')}}</YYButton>
                <YYButton type="default" @click="handleDeleteMember" v-if="currentMember">{{$t('operate.delete')}}</YYButton>
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
        <div class="deploy-limit" v-if="currentTab != 'configureAdministrator' && currentMember">
            <div class="reportMemberList">
                <div class="memberAddTemplate mb-flex mb-flex-align-center">
                    <div>{{currentMember.userName}}的{{currentTabType == 0 ? '核查' : '催办'}}模板</div>
                    <div class="mb-flex mb-flex-align-center mb-flex-pack-justify" @click.stop="addRoleTemplate">
                        <div class="yy-icon-xinzeng"></div>
                        <div>{{$t('operate.add')}}</div>
                    </div>
                </div>
                <div class="memberSelectedTemplate mb-flex mb-flex-wrap">
                    <YYTag :key="index" @on-delete="delRoleTemplate(item, index)" closeable v-for="(item, index) in currentRoleMapTemplate">
                        {{item.title}}
                    </YYTag>
                </div>
            </div>
            <div class="changeOperate mb-flex mb-flex-pack-justify">
                <YYButton type="primary" @click="reportSave">{{$t('operate.save')}}</YYButton>
                <YYButton @click="reportReset">{{$t('operate.reset')}}</YYButton>
            </div>
        </div>
        <div class="deploy-limit" v-else-if="currentTab == 'configureAdministrator' && currentMember">
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
        <div class="bgCover" v-if="isAddTemplateShow" @click.stop="addTemplateClose"></div>
        <div class="addTemplate mb-flex mb-flex-v" v-if="isAddTemplateShow">
            <div class="addTemplateHeader mb-flex mb-flex-align-center mb-flex-pack-justify">
                <div>{{$t('noun.addTemplate')}}</div>
                <div class="yy-icon-guanbi" @click.stop="addTemplateClose"></div>
            </div>
            <div class="addTemplateBody mb-flex-1 mb-flex mb-flex-pack-justify">
                <div class="templateItem" v-for="(item, index) in currentPageNumTemplate">
                    <fs-template-item
                        :bottomOperate="false"
                        :isToDetail="false"
                        :isSelectIconShow="true"
                        :data="item">
                    </fs-template-item>
                </div>
                <div class="addTemplatePagination">
                    <YYPagination
                        :current="pageNo"
                        :total="totalCount" 
                        :pageSize="pageSize"
                        :showTotal="false"
                        align="center"
                        :show-elevator="false"
                        :show-sizer="false"
                        @on-change="paginationChange">
                    </YYPagination>
                </div>
            </div>
            <div class="addTemplateFooter mb-flex mb-flex-align-center mb-flex-pack-justify">
                <div>
                    <YYCheckbox v-model="isAllChecked" @on-change="allCheck(isAllChecked)">
                        {{$t('operate.checkAll')}}
                    </YYCheckbox>
                </div>
                <div>
                    <YYButton type="primary" @click.stop="giveRoleAddTemplate">{{$t('noun.addTemplate')}}</YYButton>
                </div>
                <div class="mb-flex-1">
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
                0: 'deptName',
                3: 'groupName'
            },
            allTemplatePagenumMapList: {},
            totalCount: 0,
            pageSize: 20,
            pageNo: 1,
            isAllChecked: false,
            isLoadingShow: false,
            isAddTemplateShow: false,
            originCurrentRoleMapTemplate: [],
            currentRoleMapTemplate: [],
            currentTabType: 0,
            currentPageNumTemplate: []
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
                        this.currentTabType = 0;
                        this.reportList();
                    break;
                    case 'addReportReminder':
                        this.currentTabType = 1;
                        this.reportList();
                    break;
                    case 'configureAdministrator':
                        this.currentTabType = 2;
                        this.getDeployMember();
                    break;
                }
                this.currentMember = null
            },
            immediate: true
        }
    },
    components: {
        FsAvatar,
        FsTemplateItem
    },
    methods: {
        addTemplateClose() {
            this.isAllChecked = false;
            this.isAddTemplateShow = false;
        },
        reportSave() {
            this.isAddTemplateShow = false;
            let templateIds = [];
            this.currentRoleMapTemplate.forEach((item, index) => {
                templateIds.push(item.id);
            });
            this.$ajax({
                url: '/rest/v1/diary/role_template_relation',
                type: 'post',
                data: {
                    diaryRoleId: this.currentMember.id,
                    templateIds,
                    type: this.currentTabType
                },
                requestBody: 1,
                success: (res) => {
                    this.$YYMessage.success(this.$t('toast.savedSuccessfully'));
                    this.roleMapTemplateList();
                }
            });
        },
        reportReset() {
            this.currentRoleMapTemplate = this.originCurrentRoleMapTemplate;
        },
        giveRoleAddTemplate() {
            let allTemplatePagenumMapList = Object.assign({}, this.allTemplatePagenumMapList);
            let twoDimensional = Object.values(allTemplatePagenumMapList);
            let allSelectedTemplate = [];
            twoDimensional.forEach((itemA, indexA) => {
                itemA.forEach((itemB, indexB) => {
                    itemB.isCurrentTemplateSelected && allSelectedTemplate.push(itemB);
                });
            });
            let excludeRepeat = {};
            this.currentRoleMapTemplate.forEach((item, index) => {
                excludeRepeat[item.id] = item;
            });
            let templateIds = [];
            let excludeSelectedTemplate = [];
            allSelectedTemplate.forEach((item, index) => {
                if(!excludeRepeat[item.id]) {
                    excludeSelectedTemplate.push(item);
                }
            });
            this.currentRoleMapTemplate = this.currentRoleMapTemplate.concat(excludeSelectedTemplate);
            // 
            let twoDimensionalOrigin = Object.values(this.allTemplatePagenumMapList);
            twoDimensionalOrigin.forEach((itemA, indexA) => {
                itemA.forEach((itemB, indexB) => {
                    !itemB.hasOwnProperty('isCurrentTemplateSelected') && (itemB.isCurrentTemplateSelected = false);
                });
            });
            this.isAddTemplateShow = false;
        },
        addRoleTemplate() {
            this.isAddTemplateShow = true;
            this.loadData();
        },
        delRoleTemplate(item, index) {
            if(item.hasOwnProperty('isCurrentTemplateSelected')) {
                this.currentRoleMapTemplate.splice(index, 1);
                this.currentRoleMapTemplate = this.currentRoleMapTemplate;
                return;
            }
            this.$ajax({
                url: '/rest/v1/diary/role_template_relation',
                type: 'delete',
                data: {
                    diaryRoleId: this.currentMember.id,
                    type: this.currentTabType,
                    templateIds: [item.id]
                },
                requestBody: 1,
                success: (res)=>{
                    this.$YYMessage.success(this.$t('toast.successfullyDeleted'));
                    this.roleMapTemplateList();
                }
            });
        },
        delRole() {
            this.$ajax({
                url: `/rest/v1/diary/role/${this.currentMember.id}`,
                type: 'delete',
                data: {},
                requestBody: 1,
                success: (res)=>{
                    this.$YYMessage.success(this.$t('toast.successfullyDeleted'))
                    this.reportList();
                }
            });
        },
        reportList() {
            this.isLoadingShow = true;
            let qzId = this.$store.state.userInfo.qzId;
            this.$ajax({
                url: `/rest/v1/${qzId}/diary/roles`,
                data: {
                    type: this.currentTabType
                },
                success: (res)=>{
                    this.isLoadingShow = false;
                    if(res) {
                        this.deployMember = res
                    }
                }
            })
        },
        paginationChange(pageNum) {
            this.pageNo = pageNum;
            this.loadData();
        },
        allCheck(isAllChecked) {
            let currentPageNumTemplate = this.allTemplatePagenumMapList[this.pageNo + ''];
            currentPageNumTemplate.forEach((item, index) => {
                item.isCurrentTemplateSelected = isAllChecked;
            });
        },
        loadData() {
            let currentPageNumTemplate = this.allTemplatePagenumMapList[this.pageNo + ''];
            if(currentPageNumTemplate) {
                this.currentPageNumTemplate = currentPageNumTemplate;
                return;
            }
            this.$ajax({
                url: '/template/list',
                data: {
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                    status: 1
                },
                success: (res)=>{
                    if(res && res.code == 0) {
                        let list = res.data.list;
                        list.forEach((item, index) => {
                            item.isCurrentTemplateSelected = false;
                        });
                        this.currentPageNumTemplate = this.allTemplatePagenumMapList[this.pageNo + ''] = list || [];
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
            members.forEach(mem=>{
                mem.type = this.currentTabType;
            });
            this.$ajax({
                url: '/rest/v1/diary/role',
                type: 'post',
                data: members,
                requestBody: 1,
                success: (res)=>{
                    this.reportList();
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
            let title = '';
            let content = '';
            switch(this.currentTabType) {
                case 0:
                    title = '删除汇报核查人';
                break;
                case 1:
                    title = '删除汇报催办人';
                break;
                case 2:
                    title = '删除管理员';
                break;
            }
            content = '是否' + title;
            this.$YYModal.show({
                title,
                content,
                onOk: () => {
                    const members = [this.currentMember.memberId]
                    this.stashLimitData[this.currentMember.memberId] = null
                    if(this.currentTab == 'configureAdministrator') {
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
                        return;
                    }
                    this.delRole();
                    this.currentMember = null;
                }
            });
        },
        handleAddLimit() {
            let dept = [], man = [], org = [], team = []
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
                team:  true,
                showLoading: true,
                selected: {
                    dep: dept,
                    man: man,
                    org: org,
                    team: team
                },
                limit: {
                    showAll: false,
                    warning: '',
                    count: 500
                },
                isPullAllGroup: true
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
                let groupIds = res.team.map((item, index) => {
                    return item.gid;
                });
                this.$ajax({
                    url: '/rest/v1/diaryStatistics/acl',
                    type: 'post',
                    data: {
                        memberId: this.currentMember.memberId,
                        memberIds: memberIds,
                        deptIds: deptIds,
                        orgIds: orgIds,
                        groupIds: groupIds
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
                },
                3: {
                    key: 'groupId',
                    value: []
                }
            }
            stashData[param.dataType].value.push(param[stashData[param.dataType].key])
            const memberIds = stashData[2].value
            const orgIds = stashData[1].value
            const deptIds = stashData[0].value
            const groupIds = stashData[3].value
            this.$ajax({
                url: '/rest/v1/diaryStatistics/acls',
                type: 'delete',
                data: {
                    memberId: this.currentMember.memberId,
                    memberIds: memberIds,
                    deptIds: deptIds,
                    orgIds: orgIds,
                    groupIds: groupIds
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
            if(this.currentTab == 'configureAdministrator') {
                this.getDeployLimit();
                return;
            }
            this.roleMapTemplateList();
        },
        roleMapTemplateList() {
            this.$ajax({
                url: `/rest/v1/diary/${this.currentMember.id}/role_template_relations`,
                data: {},
                success: (res) => {
                    this.originCurrentRoleMapTemplate = Object.assign([], res.templates);
                    this.currentRoleMapTemplate = Object.assign([], res.templates);
                }
            })
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
        
    }
}
</script>

<style lang="less" scoped>
.deploy-container {
    padding: 40px;
    height: 100%;
    position: relative;
    border-top: 1px solid #D9D9D9;
    .deploy-title {
        color: @text-color;
        font-size: 12px;
        margin-bottom: 14px;
        font-weight: 500;
        .ivu-btn {
            margin-right: 5px;
        }
        .operateAdd {
            margin: 0 8px 0 16px;
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
            cursor: pointer;
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
        margin-top: 34px;
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
            /deep/ .yy-tag {
                height: 30px;
                margin: 0 8px 8px 0;
                border-radius:3px;
                background: rgba(230,230,230,1);
                .yy-tag-inner span {
                    margin-right: 6px;
                }
                .yy-icon-close {
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
    .bgCover {
        position: fixed;
        right: 0;
        top: 0;
        left: 0;
        bottom: 0;
        opacity: 0;
    }
    .addTemplate {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 618px;
        box-shadow:-8px 0px 30px 0px rgba(74,81,93,0.2);
        background: #f5f5f5;
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
            align-content: flex-start;
        }
        .templateList {
            min-height: 300px;
        }
        .addTemplatePagination {
            width: 100%;
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
