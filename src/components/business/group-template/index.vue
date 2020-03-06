<template>
  <div>
    <div class="row specalTableCtn">
        <YYTable :columns="columns" :data="tableListData" :border='showBorder'/>
        <!-- v-show="showPagination" -->
        <YYPagination
            :class="'paginationCtn'"
            :total="totalCount" 
            :pageSize="pageSize"
            :showTotal="false" 
            @on-change="paginationChange"
            @on-page-size-change="paginationPageSizeChange"
        />
        <!-- <YYLoadingH  v-if='loading' :text="$t('status.loading')"></YYLoadingH> -->
        <!-- <div class="loading">
            <div class="loading-content" v-if="!hasMore && !loading && tableListData.length">{{$t('status.loadedAllData')}}</div>
        </div> -->
        <!-- <YYEmpty vertical="top" v-if="!tableListData.length && !loading"/> -->
    </div>
    <YYDialog
        :class="'featureDiaalogCtn'"
        width='450px'
        height='320px'
        :title="$t('operate.addNewGroupTemplate')"
        v-model="show"
        @on-ok='dialogConfirm'
        class="addDialogCtn">
        <div class="item" style="margin-top: 20px;">
            <span class="title">
                <span class="must">{{$t("operate.internalGroupName")}}</span>
            </span>
            <span class="ctn">
                <!-- :isRadio="true"  是否单选 -->
                <fs-select-tree-input
                    :group="selectGroupData"
                    :title="$t('operate.insideGroupSelect')"
                    :placeholder="$t('placeholder.pleaseSelect')"
                    @handleSelect="handleSelectRange1"
                    :ellipsis="false" 
                    :showDept="false" 
                    :showGroup="true" 
                    :showMember="false" 
                    :isRadio="true" 
                    ref="selectDept"
                />
            </span>
        </div>
        <div class="item">
            <span class="title">
                <span class="must">{{$t("operate.templateName")}}</span>
            </span>
            <span class="ctn">
                <YYSelect 
                    v-model="templateNameId" 
                    @on-change="templateListHandleChange" style="width: 300px">
                    <!-- <span v-for="(item, i) in templateDataList" key=''></span> -->
                    <YYOption v-for="(item, i) in templateDataList" :value="item.id" :key="i">
                        {{item.title}}
                    </YYOption>
                </YYSelect>
            </span>
        </div>
        <div class="item">
            <span class="title">
                <span class="must">{{$t('operate.reportPerson')}}</span>
            </span>
            <span class="ctn">
                    <fs-select-tree-input
                        :member="selectMemberData"
                        :title="`${$t('operate.reportPerson')}${$t('operate.select')}`"
                        :placeholder="$t('placeholder.pleaseSelect')"
                        @handleSelect="handleSelectRange2"
                        :ellipsis="false" 
                        :showDept="false" 
                        :showGroup="false" 
                        :showMember="true" 
                        :memberApiUri="memberApiUri" 
                        ref="selectDept"
                    />
            </span>
        </div>
        <div class="item noMarginBottom">
            <span class="title">{{$t('operate.describe')}}</span>
            <span class="ctn">
                <YYInput ref='dialogDeacInput'
                    v-model="templateDesc" 
                    @on-change="handleChange">
                </YYInput>
            </span>
        </div>
    </YYDialog>
  </div>
</template>
<script>
import EditCancleButtons from './EditCancleButtons'
import TableItemPerson from './tableItemPerson'
import FsSelectMember from '../../common/select-member/'
import FsSelectTreeInput from '../../common/select-tree-input/'
import axios from 'axios'
// axios.defaults.withCredentials = true
import qs from 'qs'
export default {
    data() {
        return {
            showPagination: false,
            totalCount: 0,
            memberApiUri: '',
            showBorder: true,
            tableListData: [],
            isEdit: false,
            pageNo: 1,
            pageSize: 20,
            loading: false,
            loaderror: false,
            hasMore: true,
            columns: [
                // {
                //     title: '序号',
                //     align: 'center',
                //     key: 'index'
                // },
                {
                    title: this.$t("operate.internalGroupName"),
                    align: 'left',
                    key: 'groupName',
                    width: 250,
                    render: (h, params) => {
                        return h(
                        TableItemPerson,
                        {
                            props: {
                                personData: params.row.reportUsers[0],
                                groupName: params.row.groupName,
                                groupLogo: params.row.groupLogo
                            },
                            on: {
                            'BtnEdit': () => {
                                setTimeout(() => {
                                this.editBtnClick(params)
                                }, 0)
                            },
                            'BtnCancle': () => {
                                setTimeout(() => {
                                this.cancleBtnClick(params)
                                }, 0)
                            }
                            }
                        },
                        params)
                    }
                },
                {
                    title: this.$t("operate.templateName"),
                    align: 'left',
                    key: 'templateName',
                    width: 250,
                },
                {
                    title: this.$t('operate.reportPerson'),
                    align: 'left',
                    key: 'reportUsersStr'
                },
                {
                    title: this.$t('operate.describe'),
                    align: 'left',
                    key: 'desc',
                    render: (h, params) => {
                        return h('span', {
                            attrs:{
                                class:'tableItemDescCtn'
                            }
                        }, params.row.desc)
                    },
                },
                {
                    title: this.$t('operate.status'),
                    align: 'center',
                    key: 'enable',
                    width: 120,
                    render: (h, params) => {
                        return h(
                        'y-y-switch',
                        {
                            props: {
                                value: params.row.enable
                            },
                            on: {
                            'on-change': () => {
                                setTimeout(() => {
                                this.changeStatus(params)
                                }, 0)
                            }
                            }
                        },
                        params)
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'id',
                    width: 120,
                    align: 'left',
                    render: (h, params) => {
                        return h(
                        EditCancleButtons,
                        {
                            on: {
                            'BtnEdit': () => {
                                setTimeout(() => {
                                this.editBtnClick(params)
                                }, 0)
                            },
                            'BtnCancle': () => {
                                setTimeout(() => {
                                this.cancleBtnClick(params)
                                }, 0)
                            }
                            }
                        },
                        params)
                    }
                }
            ],
            show: this.showDialog,
            selectGroupData: [],
            selectMemberData: [],
            deptRange: [],
            groupRange: [],
            memberRange: [],
            rangeArr: [],
            templateName: {},
            templateNameId: [],
            templateDesc: '',
            templateDataList: []
        }
    },
    components : {
        EditCancleButtons,
        FsSelectMember,
        FsSelectTreeInput,
        TableItemPerson
    },
    props: {
        showDialog: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        showDialog(val) {
            this.show = val;
            if(val && !this.isEdit) { // 新增
                this.selectGroupData = []
                this.selectMemberData = []
                this.templateNameId = []
                this.templateDesc = ''
            }
        },
        show(val) {
            if(!val) {
                this.$parent.$parent.showDialog = false
                this.isEdit = false
            } else {
                // 每次打开弹框都请求下模板数据 保证是最新数据
                this.initTemplate()
            }
        },
        pageNo (v) {
            this.loadList()
        },
        templateDesc (v) {
            if(v.length > 150) {
                let tips = this.$t('operate.max150Tips')
                this.$YYMessage.warning(tips)
                let substr = v.substr(0, 10)
                this.templateDesc = substr
                this.$refs.dialogDeacInput.currentValue = substr
            }
        },
        selectGroupData (v) {
            if(v.length) {
                let gid = v[0].gid || v[0].groupId
                this.memberApiUri = `/group/member/${gid}`
            }
        }
    },
    methods: {
        paginationChange (v) {
            this.loadList (v, this.pageSize) 
        },
        paginationPageSizeChange (v) {
            this.pageSize = v
            this.loadList (1, v) 
        },
        handleChange () {
        },
        onScroll(e) { // 分页
            if(!this.loading && this.hasMore) {
                let $target = e && e.target
                let scrollHeight = $target.scrollHeight
                let scrollTop = $target.scrollTop
                let offsetHeight = $target.offsetHeight
                
                if ((scrollHeight - scrollTop) - offsetHeight < 20) {
                    this.pageNo++
                }
            }
        },
        templateListHandleChange (v) {
        },
        addDialogChenk () {
            if(this.selectGroupData.length == 0) {
                let tips = this.$t('toast.selectInsideGroupName')
                this.$YYMessage.warning(tips)
                return false
            }
            if(this.selectGroupData.length != 1) {
                let tips = this.$t('toast.onlySelectOneInsideGroup')
                this.$YYMessage.warning(tips)
                return false
            }
            if(this.selectMemberData.length == 0) {
                let tips = this.$t('toast.selectReportPerson')
                this.$YYMessage.warning(tips)
                return false
            }
            if(this.templateNameId.length == 0) {
                let tips = this.$t('toast.selectTemplate')
                this.$YYMessage.warning(tips)
                return false
            }
            return true
        },
        dialogConfirm () {
            let checkFlag = this.addDialogChenk()
            if (!checkFlag) {
                this.show = true
                return false
            }
            let groupId = this.selectGroupData[0].gid || this.selectGroupData[0].groupId
            // let groupId = '7112'
            // let reportedMembers = this.selectMemberData[0].memberId
            let reportedMembers = []
            this.selectMemberData.forEach(item => {
                reportedMembers.push(item.memberId)
            })
            reportedMembers = reportedMembers.join(',')
            // let reportedMembers = "182282"
            let templateId = this.templateNameId
            let desc = this.templateDesc
            let obj = {
                groupId,
                reportedMembers,
                templateId,
                desc
            }
            axios.defaults.withCredentials = true
            let self = this
            let token = this.$store.state.userInfo.token
            if(!this.isEdit) {
                // 新增
                axios.post(`/rest/v1/template/customized/group_relation?token=${token}`,obj).then((res) => {
                    if(res && res.status == 200) {
                        this.$YYMessage.success(this.$t('toast.addSucess'))
                        this.loadList(this.pageNo, this.pageSize)
                    } else {
                        this.$YYMessage.warning((res && res.msg) || this.$t('status.networkError'))
                    }
                }).catch((err) => {
                    let tips = ''
                    if(err.response.status == 400) {
                        // tips = '该模板已经绑定过了'
                        tips = this.$t('toast.telplateHasBinded')
                    } else {
                        tips = err.response.data.message
                    }
                    self.$YYMessage.error(tips)
                })
            } else {
                // 编辑
                obj.id = this.editItemId
                axios.patch(`/rest/v1/template/customized/group_relation?token=${token}`,obj).then((res) => {
                    if(res && res.status == 200) {
                        this.$YYMessage.success(this.$t('toast.editSucess'))
                        this.loadList(this.pageNo, this.pageSize)
                    } else {
                        this.$YYMessage.warning((res && res.msg) || this.$t('status.networkError'))
                    }
                }).catch((err) => {
                    let tips = ''
                    if(err.response.status == 400) {
                        // tips = '该模板已经绑定过了'
                        tips = this.$t('toast.telplateHasBinded')
                    } else {
                        tips = err.response.data.message
                    }
                    self.$YYMessage.error(tips)
                })
            }
        },
        handleSelectRange1(res) { //内部群
            let arr = res.group
            if(arr.length > 1) {
                this.$YYMessage.warning(this.$t('toast.onlySelectOneInsideGroup'))
            } else if(arr.length == 1) {
                this.selectGroupData = arr
            }
        },
        handleSelectRange2(res) { //汇报人
            let arr = res.member
            this.selectMemberData = arr
        },
        loadList (pageNo = 1, pageSize = 20) {
            this.loading = true
            this.$ajax({
                url: `/rest/v1/template/customized/group_relations`,
                data: {
                    pageNo,
                    pageSize
                },
                success: (res) => {
                    if (res) {
                        this.loading = false
                        this.totalCount = res.totalCount
                        if(res.totalCount > this.pageSize) {
                            this.showPagination = true
                        } else {
                            this.showPagination = false
                        }
                        res.data.forEach(item => {
                            let arr = []
                            item.reportUsers.forEach(tem => {
                                arr.push(tem.name)
                            })
                            item.reportUsersStr = arr.join(',')
                        })
                        this.tableListData = res.data
                    }
                },
                error: (res)=>{
                    this.loaderror = true
                    this.loading = false
                }
            })
        },
        updateList(res) { // load成功之后更新数据
            // if(res.groupId && res.groupId !== this.getParams().groupId) return
            this.hasMore = true
            if(this.pageNo == 1) {
                this.tableListData = res || []
            } else {
                this.tableListData = this.tableListData.concat(res || [])
            }
            if (res && res.length < this.pageSize) {
                this.hasMore = false
            }
        },
        initList () {
            this.loadList()
        },
        initTemplate () {
            this.$ajax({
                url: '/template/list',
                data: {
                    pageNo: 1,
                    pageSize: this.pageSize,
                    client: 'app'
                },
                success: (res) => {
                    if (res && res.code == 0) {
                        this.templateDataList = res.data
                    }
                }
            })
        },
        changeStatus (p) {
            axios.defaults.withCredentials = true
            let id = p.row.id
            let enable = !p.row.enable
            let token = this.$store.state.userInfo.token
            axios.patch(`/rest/v1/template/customized/group_relation/${id}/?enable=${enable}&token=${token}`).then((res) => {
                if(res && res.status == 200) {
                    if(enable) {
                        this.$YYMessage.success(this.$t('toast.startSucess'))
                        p.row.enable = true
                    } else {
                        this.$YYMessage.success(this.$t('toast.offSucess'))
                        p.row.enable = false
                    }
                }
            }).catch(function (err) {
                console.log(err)
            })
        },
        cancleBtnClick (p) {
            let id = p.row.id
             this.$ajax({
                url: `/rest/v1/template/customized/group_relation/${id}`,
                type: 'delete',
                success: (res) => {
                    this.$YYMessage.success(this.$t('toast.deleteSucess'))
                    this.loadList(this.pageNo, this.pageSize)
                }
            })
        },
        editBtnClick (p) {
            this.editItemId = p.row.id
            let rowData = p.row
            this.templateDesc = rowData.desc
            this.selectGroupData = [
                {
                    groupName: rowData.groupName,
                    groupId: rowData.groupId
                }
            ]
            let arr = [] 
            rowData.reportUsers.forEach(item => {
                arr.push({
                    'memberId': item.memberId,
                    'userName': item.name
                })
            })
            this.selectMemberData = arr
            this.templateNameId = rowData.templateId
            this.show = true
            this.isEdit = true
        },
        handleSelect(res) {
        }
    },
    created () {
        // tab列表
        this.initList()
        // 模板列表
        this.initTemplate()
    }
}
</script>
<style lang='less'>
.addDialogCtn {
    .item{
        // height: 32px;
        line-height: 32px;
        margin-bottom: 16px;
        .title{
            display: inline-block;
            width: 90px;
            text-align: right;
            color:rgba(51,51,51,1);
            margin-right: 10px;
            font-size: 12px;
            .must::before{
                content: '*';
                display: inline-block;
                margin-right: 4px;
                line-height: 1;
                font-family: SimSun;
                font-size: 12px;
                color: #fd838a;
            }
        }
        .ctn{
            display: inline-block;
            width: 300px;
        }
        &.noMarginBottom {
            margin-bottom: 0
        }
    }
}
.logger-frame-scroller {
    .yy-switch {
        margin: 4px 0;
    }
}
.loading {
    height: 60px;
    line-height: 50px;
    text-align: center;
    font-size: 14px;
    background-color: #ffffff;
    color: #888;
    position: relative;
    overflow: hidden;
    .loading-content {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        left: 0;
    }
}
.featureDiaalogCtn {
    .yy-dialog-inner-content{
        // overflow: hidden;
        height: auto;
    }
}
.yy-table-cell {
    .tableItemDescCtn {
        margin: 9px 0;
        display: inline-block;
    }
}
.paginationCtn{
    margin-top: 20px;
}
.specalTableCtn {
    .yy-table-wrapper {
        min-height: 738px;
        height: 738px;
        overflow: auto;
        .scroll-content-horizonal {
            height: 706px;
        }
    }
    .yy-table-border::before {
        display: none;
    }
}
</style>