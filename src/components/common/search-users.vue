<template>
    <div class="search-user searchStopPropagation" :style="{'width': width}" >
        <Input class="input" :placeholder="placeholder" v-model="keyword" @on-change="handleChange" :disabled="disabled"/>
        <ul class="search-user-list" v-if="showList && !!searchUserList.length">
            <li class="search-user-item" v-for="item in searchUserList" :key="item.id" @click="handleSelect($event, item)">
                <span class="avatar">
                    <img v-if="item.headImgUrl" :src="item.headImgUrl" @error="onError($event, item)">
                    <img v-else src="../../assets/images/header.png">
                </span>
                <div class="intro">
                    <h3>{{item.realName || item.userName}}</h3>
                    <p>{{item.deptName || '其他'}}</p>
                </div>
            </li>
        </ul>
        <div class="no-data" v-if="showList && !searchUserList.length">暂无数据</div>
    </div>
</template>
<script>
export default {
    props: {
        placeholder: {
            type: String
        },
        url: {
            type: String
        },
        width: {
            type: String
        },
        disabled: {
            type: Boolean,
            default: false
        },
        searchName: {
            type: String,
            default: 'keyword'            
        }
    },
    data() {
        return {
            keyword: '',
            searchUserList: [],
            searchTimer: null,
            showList: false
        }
    },
    methods: {
        handleChange() { // 搜索状态
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                if(!!this.keyword.trim()) {
                    this.$ajax({
                        url: this.url,
                        data: {
                            [this.searchName]: this.keyword.trim()
                        },
                        success: (res)=>{
                            if(res && res.code === 0) {
                                this.searchUserList = res.data || [];
                                this.showList = true;
                            }
                        }
                    })
                } else {
                    this.initSearch();
                }
            }, 200);
        },
        initSearch() { // 初始化搜索
            this.searchUserList = [];
            this.showList = false;
        },
        handleSelect(e, item) { // 点击option
            e.stopPropagation();
            this.keyword = item.realName || item.userName;
            this.$emit('handleSelect', item);
            this.initSearch();
        },
        getKeyword() { // 获取keyword
            return this.keyword.trim();
        },
        clearKeyword() { // 清除keyword
            this.keyword = '';
        },
        setKeyword(key) { // 设置keyword
            this.keyword = key || '';
        },
        onError(e, item) {
            item.headImgUrl = false;
        }
    },
    mounted () {
        document.addEventListener('click', (e)=>{
            this.initSearch();
        });  
    },
    destroyed () {
        clearTimeout(this.searchTimer);
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.search-user {
    display: inline-block;
    position: relative;
     ::-webkit-scrollbar {
        width: 0px;
    }
     ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        width: 6px;
        min-height: 40px;
        max-height: 100px;
        background-color: transparent;
    }
    .no-data {
        position: absolute;
        top: 31px;
        left: 0px;
        border: 1px solid @input-border-color;
        border-radius: 5px;
        background: #fff;
        z-index: 999;
        width: 170px;
        max-height: 160px;
        overflow-y: auto;
        padding: 12px;
        display: block;
        text-align: center;
    }
    .search-user-list {
        position: absolute;
        top: 31px;
        left: 0px;
        border: 1px solid @input-border-color;
        border-radius: 5px;
        background: #fff;
        z-index: 999;
        width: 170px;
        max-height: 160px;
        overflow-y: auto;
        display: block;
        .search-user-item {
            cursor: pointer;
            padding: 5px 10px;
            overflow: hidden;
            &:hover {
                background-color: @table-bg-color;
            }
            .avatar {
                display: block;
                float: left;
                width: 30px;
                height: 30px;
                border-radius: 30px;
                background-color: @gray-color-elip;
                overflow: hidden;
                background: url('../../assets/images/header.png') no-repeat center;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .intro {
                margin-left: 38px;
                h3 {
                    width: 115px;
                    text-align: left;
                    color: #333;
                    font-size: 12px;
                    line-height: 15px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                p {
                    width: 115px;
                    text-align: left;
                    font-size: 12px;
                    color: #999;
                    line-height: 15px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
</style>

