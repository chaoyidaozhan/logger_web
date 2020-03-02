<template>
  <div>
    <div class="row">
      <YYTable :columns="columns" :data="data" />
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
                    :group="member1"
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
                <!-- <fs-select-member ref="selectMember" 
                    :title="请选择汇报人"
                    :placeholder="`${$t('operate.select')}${$t('noun.author')}`"
                    :member="member"
                    @handleSelect="handleSelectRange2"/> -->
                    <fs-select-tree-input
                        :member="member2"
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
import FsSelectMember from '../../common/select-member/'
import FsSelectTreeInput from '../../common/select-tree-input/'
import axios from 'axios'
import qs from 'qs'
export default {
    data() {
        return {
            data: [
                {
                    "createTime": "",
                    "index": "1",
                    "desc": "11111",
                    "enable": 0,
                    "groupId": "121",
                    "id": 0,
                    "reportUsers": [
                        {
                            "avatar": "",
                            "memberId": "",
                            "name": "",
                            "qzId": ""
                        }
                    ],
                    "reportedMembers": "wsdsdsd",
                    "spaceId": "",
                    "templateId": 0,
                    "updateTime": ""
                }
            ],
            columns: [
                {
                    title: '序号',
                    align: 'center',
                    key: 'index'
                },
                {
                    title: '内部群名称',
                    align: 'center',
                    key: 'groupId'
                },
                {
                    title: '模版名称',
                    align: 'center',
                    key: 'templateId'
                },
                {
                    title: '汇报范围',
                    align: 'center',
                    key: 'reportedMembers'
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
                            value: params.row.status
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
                    key: 'enable',
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
            member1: [],
            member2: [],
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
        FsSelectTreeInput
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
            debugger
            // let groupId = this.member1[0].gid
            let groupId = '7112'
            // let reportedMembers = this.member2[0].memberId
            let reportedMembers = "182282"
            let templateId = this.templateNameId
            let desc = this.templateDesc
            let obj = {
                groupId,
                reportedMembers,
                templateId,
                desc
            }
            axios({
                url: '/rest/v1/template/customized/group_relation',
                data: qs.stringify(obj),
                method: 'post',
                headers:{
                    'Content-Type': 'application/json',
                }
            })
            // this.$ajax({
            //     url: "/logger/rest/v1/template/customized/group_relation",
            //     type: 'post',
            //     data: obj,
            //     success: (res) => {
            //         debugger
            //         // if (res && res.code == 0) {
            //         //     call && call(res.data || []);
            //         // }
            //     }
            // })
        },
        handleSelectRange1(res) { //内部群
            debugger
            let arr = res.group
            this.member1 = arr
            // let keys = Object.keys(res)
            // keys.forEach(key => {
            //     this[`${key}Range`] && (this[`${key}Range`] = res[key])
            // })
        },
        handleSelectRange2(res) { //汇报人
            let arr = res.member
            this.member2 = arr
            // let keys = Object.keys(res)
            // keys.forEach(key => {
            //     this[`${key}Range`] && (this[`${key}Range`] = res[key])
            // })
        },
        initList () {
            this.$ajax({
                // url: "/logger/rest/v1/template/customized/group_relations",
                url: "/rest/v1/template/customized/group_relations",
                data: {
                    pageNo: 1,
                    pageSize: 1000,
                },
                success: (res) => {
                    // if (res && res.code == 0) {
                    //     call && call(res.data || []);
                    // }
                }
            })
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
        changeStatus () {
            this.$ajax({
                url: "/logger/rest/v1/template/customized/group_relation/",
                type: 'patch',
                data: {
                    enable: true
                },
                success: (res) => {
                }
            })
        },
        cancleBtnClick () {
             this.$ajax({
                url: "/logger/rest/v1/template/customized/group_relation/{id}",
                type: 'delete',
                success: (res) => {
                }
            })
        },
        editBtnClick () {
            // 需要一个获取详情的接口
            this.$ajax({
                // url: "/logger/rest/v1/template/customized/group_relations",
                url: "/rest/v1/template/customized/group_relations",
                data: {
                },
                success: (res) => {
                }
            })
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
        this.initList()
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
</style>