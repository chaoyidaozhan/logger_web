<template>
    <div class="select-member">
        <Input placeholder="请输入人员名称进行搜索" type="text" v-model="keyword" @on-change="handleSearch"/>
        <div class="select-member-wrapper">
            <ul class="select-member-list" v-if="list && list.length">
                <li v-for="(item, index) in list" :key="item.accountId">
                    <Checkbox v-model="item.checked" @on-change="handleChange(item)">
                        <div class="avatar">
                            <span>
                                <img v-if="item.headImgUrl" :src="item.headImgUrl" @error="onError($event, item)">
                                <img v-else src="../../assets/images/header.png">
                            </span>
                        </div>
                        <div class="info">
                            <span class="name">{{item.realName || item.userName}}</span>
                            <span class="dept">{{item.deptName || '无所属部门'}}</span>
                        </div>
                    </Checkbox>
                </li>
            </ul>
            <div class="operate" v-if="!list.length && !hasMore">
                暂无数据
            </div>
            <div class="operate" v-if="hasMore" @click="getMore">
                {{loading ? '正在加载中' : '点击加载更多'}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        userShifts: { // 回显组织需要的数据
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            accountIds: [],  // 已选成员id
            accounts: [], // 已选成员数据
            keyword: '',
            pageSize: 40,
            pageNumber: 1,
            list: [], // 成员列表
            hasMore: true,
            searchTimer: null,
            loading: true,
        }
    },
    methods: {
        init(iSearch) { // 初始化
            if(!iSearch) {
                this.keyword = '';
            }
            this.pageNumber = 1;
            this.list = [];
            this.hasMore = true;
            this.loadData();
        },
        initAccountIds() { // 初始化已选择ID
            if(this.userShifts && !!this.userShifts.length) {
                this.userShifts.forEach((item)=>{
                    this.accountIds.push(item.accountId);
                    this.accounts.push(item);
                })
            }
        },
        handleSearch() { // 搜索初始化
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                this.init(true);
            }, 200);
        },
        handleChange(value) {
            if(value.checked) {
                this.accountIds.push(value.accountId);
                this.accounts.push(value);
            } else {
                let index = this.accountIds.indexOf(value.accountId)
                this.accountIds.splice(index, 1);
                this.accounts.splice(index, 1);
            }
            this.$emit('handleChangeAccounts', this.accounts);
        },
        getMore() { // 拉去更多数据
            this.pageNumber++;
            this.loadData();
        },
        onError(e, item) {
            item.headImgUrl = false;
        },
        loadData() { // 拉去数据
            this.loading = true;
            this.$ajax({
                url: '/signin/workShift/getUsers',
                data: {
                    keyword: this.keyword.trim(),
                    pageSize: this.pageSize,
                    pageNumber: this.pageNumber
                },
                success: (res)=>{
                    this.loading = false;
                    if(res && res.code == 0) {
                        if(res.data) {
                            if(res.data.length < this.pageSize) {
                                this.hasMore = false;
                            }
                            res.data.forEach((item)=>{
                                item.checked = false;
                                if(this.accountIds.indexOf(item.accountId) != -1) {
                                    item.checked = true;
                                }
                            });
                            this.list = this.list.concat(res.data);
                        }
                    }
                },
                error: ()=>{
                    this.loading = false;
                }
            })
        },
        clearParams() { // 清除所有
            this.accountIds = [];
            this.accounts = [];
            this.list.forEach(item=>{
                item.checked = false;
            })
        },
        clearSingleParams(value) { // 清除单条
            value.checked = false;
            this.handleChange(value);
            this.list.forEach((item)=>{
                if(item.accountId == value.accountId) {
                    item.checked = false
                }
            })
        },
        getAccountIds() { // 返回已选择accountIds
            return this.accountIds
        }
    },
    created () {
        this.initAccountIds();
        this.init();
    },
    destroyed () {
        clearTimeout(this.searchTimer);
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.select-member {
    padding: 15px;
    position: relative;
    height: 100%;
    .select-member-wrapper {
        height: 298px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .operate {
        text-align: center;
        padding: 10px 0;
        cursor: pointer;
    }
}
.select-member-list {
    li {
        padding: 5px;
        position: relative;
        &:hover {
            background-color: rgba(55, 183, 253, .1);
        }
    }
    .ivu-checkbox-wrapper {
        width: 100%;
    }
    .avatar {
        display: inline-block;
        vertical-align: middle;
        width: 30px;
        height: 30px;
        background-color: @gray-color-elip;
        margin-right: 10px;
        margin-left: 10px;
        border-radius: 15px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .info {
        display: inline-block;
        vertical-align: middle;
        width: 65%;
        span {
            display: block;
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            &.name {
                color: @gray-color-medium;
            }
            &.dept {
                color: @gray-color-light;
            }
        }
    }
   
}

</style>
