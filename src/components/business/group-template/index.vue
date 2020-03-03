<template>
  <div>
    <div class="row">
      <YYTable :columns="columns" :data="tableListData" />
    </div>
    <YYDialog
        width='450px'
        height='320px'
        title="新增群模板"
        v-model="show"
        @on-ok='dialogConfirm'
        class="addDialogCtn">
        <div class="item" style="margin-top: 20px;">
            <span class="title">内部群名称:</span>
            <span class="ctn">
                <fs-select-tree-input
                    :group="selectGroupData"
                    :title="`${$t('operate.select')}${$t('noun.visibleRange')}`"
                    :placeholder="$t('placeholder.visibleToThisDepartment')"
                    @handleSelect="handleSelectRange1"
                    :ellipsis="false" 
                    :showDept="false" 
                    :showGroup="true" 
                    :showMember="false" 
                    ref="selectDept"
                />
            </span>
        </div>
        <div class="item">
            <span class="title">模板名称:</span>
            <span class="ctn">
                <YYSelect 
                    v-model="templateNameId" 
                    @on-change="templateListHandleChange" style="width: 200px">
                    <!-- <span v-for="(item, i) in templateDataList" key=''></span> -->
                    <YYOption v-for="(item, i) in templateDataList" :value="item.id" :key="i">
                        {{item.title}}
                    </YYOption>
                </YYSelect>
            </span>
        </div>
        <div class="item">
            <span class="title">描述:</span>
            <span class="ctn">
                <YYInput
                    v-model="templateDesc" 
                    @on-change="handleChange">
                </YYInput>
            </span>
        </div>
        <div class="item">
            <span class="title">汇报人:</span>
            <span class="ctn">
                    <fs-select-tree-input
                        :member="selectMemberData"
                        :title="`${$t('operate.select')}${$t('noun.visibleRange')}`"
                        :placeholder="$t('placeholder.visibleToThisDepartment')"
                        @handleSelect="handleSelectRange2"
                        :ellipsis="false" 
                        :showDept="false" 
                        :showGroup="false" 
                        :showMember="true" 
                        ref="selectDept"
                    />
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
            tableListData: [],
            columns: [
                // {
                //     title: '序号',
                //     align: 'center',
                //     key: 'index'
                // },
                {
                    title: '内部群名称',
                    align: 'left',
                    key: 'groupName',
                    render: (h, params) => {
                        return h(
                        TableItemPerson,
                        {
                            props: {
                                personData: params.row.reportUsers[0]
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
                    title: '模版名称',
                    align: 'left',
                    key: 'templateName'
                },
                {
                    title: '汇报人',
                    align: 'left',
                    key: 'reportUsersStr'
                },
                {
                    title: '描述',
                    align: 'center',
                    key: 'desc'
                },
                {
                    title: '状态',
                    align: 'center',
                    key: 'enable',
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
        },
        show(val) {
            if(!val) {
                this.$parent.$parent.showDialog = false
            }
        }
    },
    methods: {
        handleChange () {

        },
        templateListHandleChange (v) {
            // let id = this.templateNameId
            // let self = this
            // this.templateDataList.forEach((item, i) => {
            //     if(item.id == id) {
            //         self.templateName = item
            //         // break
            //     }
            // })
            // debugger
            // templateDesc
        },
        dialogConfirm () {
            let groupId = this.selectGroupData[0].gid
            // let groupId = '7112'
            let reportedMembers = this.selectMemberData[0].memberId
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
            axios.post(`/rest/v1/template/customized/group_relation`,obj).then((res) => {
                debugger
                if(res && res.status == 200) {
                    this.loadList()
                } else {
                    this.$YYMessage.warning((res && res.msg) || this.$t('status.networkError'))
                }
            }).catch(function (err) {
                console.log(err)
            })
        },
        handleSelectRange1(res) { //内部群
            debugger
            let arr = res.group
            this.selectGroupData = arr
            // let keys = Object.keys(res)
            // keys.forEach(key => {
            //     this[`${key}Range`] && (this[`${key}Range`] = res[key])
            // })
        },
        handleSelectRange2(res) { //汇报人
            let arr = res.member
            this.selectMemberData = arr
            // let keys = Object.keys(res)
            // keys.forEach(key => {
            //     this[`${key}Range`] && (this[`${key}Range`] = res[key])
            // })
        },
        loadList (pageNo = 1, pageSize = 1000) {
            this.$ajax({
                // bug 还没处理分页
                // url: `/rest/v1/template/customized/group_relations?pageNo=${pageNo}&pageSize=${pageSize}`,
                url: `/rest/v1/template/customized/group_relations`,
                success: (res) => {
                    debugger
                    if (res && res.length != 0) {
                        let arr = []
                        res.forEach((item, i) => {
                            // item.index = i + 1
                            let str = item.reportUsers[0].name
                            item.reportUsersStr = str
                            item.enable = !!item.enable
                            arr.push(item)
                        })
                        this.tableListData = arr
                    }
                }
            })
        },
        initList () {
            this.loadList()
        },
        initTemplate () {
            this.$ajax({
                url: '/template/list',
                data: {
                    pageNo: 1,
                    pageSize: 1000,
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
            axios.patch(`/rest/v1/template/customized/group_relation/${id}/?enable=${enable}`).then((res) => {
                debugger
                if(res && res.status == 200) {
                    if(enable) {
                        this.$YYMessage.success('开启成功')
                        p.row.enable = true
                    } else {
                        this.$YYMessage.success('关闭成功')
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
                    this.$YYMessage.success('删除成功')
                    this.loadList()
                }
            })
        },
        editBtnClick (p) {
            let rowData = p.row
            this.templateDesc = rowData.desc
            this.selectGroupData = [
                {
                    groupName: rowData.groupName,
                    groupId: rowData.groupId
                }
            ]
            this.selectMemberData = [
                {
                    memberId: rowData.reportUsers[0].memberId,
                    userName: rowData.reportUsers[0].name
                }
            ]
            this.templateNameId = rowData.templateId
            this.show = true
        },
        handleSelect(res) {
            console.log(res)
            // res && res.group && res.group.forEach((item) => {
            //     if(item.gid === 0) {
            //         this.isGroupOrDeptSelectedAll = true
            //     }
            // })
            // res && res.dept && res.dept.forEach((item) => {
            //     if(item.deptId === 0) {
            //         this.isGroupOrDeptSelectedAll = true
            //     }
            // })
            // let keys = Object.keys(res)
            // keys.forEach(key=>{
            //     this[key] = res[key]
            // })
            // this.handleQuery()
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
        height: 32px;
        line-height: 32px;
        margin-bottom: 16px;
        .title{
            display: inline-block;
            width: 90px;
            text-align: right;
            color:rgba(51,51,51,1);
            margin-right: 10px;
        }
        .ctn{
            display: inline-block;
            width: 300px;
        }
    }
}
.logger-frame-scroller {
    .yy-switch {
        margin: 4px 0;
    }
}
</style>