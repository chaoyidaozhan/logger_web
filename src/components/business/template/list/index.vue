<template>
    <div class="content" v-loading="{loading: loaded, text: $t('status.loading')}">
        <!-- <div class="col" v-if="showEdit" @click="goToTemplate">
            <div class="template-item cursor-pointer">
                <div class="template-item-content template-item-content-create">
                    <span>
                        <i class="icon-add-template"></i>
                        {{$t('operate.createTemplate')}}
                    </span>
                </div>
            </div>
        </div> -->
        <template v-if="!isCommonTemplateShow">
            <div class="col" v-for="item in list" :key="item.id">
                <fs-template-item @successCreateCopyTemplate="successCreateCopyTemplate" @setTempListData="setTempListData" :showEdit="showEdit" :data="item" @deleteData="deleteData"/>
            </div>
        </template>
        <template v-else>
            <div class="commonTemplate">{{$t('operate.commonTemplate')}}</div>
            <div class="commonTemplateList">
                <transition-group :name="animate" class="commonTemplateListGrid">
                    <div class="col" v-for="item in recentlyTemplates" :key="item.id">
                        <fs-template-item @successCreateCopyTemplate="successCreateCopyTemplate" @setTempListData="setTempListData" :showEdit="showEdit" :data="item" @deleteData="deleteData"/>
                    </div>
                </transition-group>
            </div>
            <div class="allTemplate">{{$t('operate.allTemplate')}}</div>
            <transition-group :name="animate" class="allTemplateList">
                <div class="col" v-for="item in list" :key="item.id">
                    <fs-template-item @successCreateCopyTemplate="successCreateCopyTemplate" @setTempListData="setTempListData" :showEdit="showEdit" :data="item" @deleteData="deleteData"/>
                </div>
            </transition-group>
        </template>
        <div class="page" v-if="totalCount > pageSize">
            <pagination :totalCount="totalCount" @handleChangePage="handleChangePage" :pageSize="pageSize" :pageNo="pageNo" />
        </div>
    </div>
</template>
<script>
import FsTemplateItem from './item'
import pagination from 'app_component/common/pagination'

export default {
    props: {
        showEdit: {
            type: Boolean,
            default: false,
        },
        outerList: {
            type: Array,
            default: ()=>([])
        },
        isCommonTemplateShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            list: this.outerList,
            show: true,
            totalCount: 0,
            pageSize: 19,
            pageNo: 1,
            loaded: false,
            animate: 'fade',
            timer: null,
            contentWidth: 0,
            recentlyTemplates: []
        }
    },
    components: {
        FsTemplateItem,
        pagination
    },
    methods: {
        successCreateCopyTemplate() {
            this.loadData('fade');
        },
        commonTempListData() {
            if(!this.isCommonTemplateShow) {
                return;
            }
            this.$ajax({
                url: `/template/recentlyTemplates`,
                success: (res) => {
                    this.recentlyTemplates = res.data.recentlyTemplates;
                }
            })
        },
        setTempListData(name) { // 设置模板数据
            this.list = this.$store.state.template[`${name}`];
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.loaded = true
            }, 400);
        },
        getTemplateApp(call) { // 获取当前模板列表
            this.$store.dispatch('update_template_app', { templateType: 'app' }).then(()=>{
                this.setTempListData('app');
            })
        },
        goToTemplate(e) { 
            e.stopPropagation();
            this.$router.push({
                path: `/LoggerTemplate/operate/-1`,
                query: {
                    token: this.$store.state.userInfo.token
                }
            })
        },
        deleteData(data) { // 删除日志
            this.animate = 'out';
            this.list.forEach((val, i)=>{
                if(data.id == val.id) {
                    this.list.splice(i, 1)
                }
            })
        },
        handleChangePage(index) {
            this.pageNo = index;
            this.loadData();
        },
        loadData(animate) { // 默认优先获取数据保存到store
            this.animate = animate || '';
            this.loaded = false;
            if(this.showEdit) { // 编辑页面分页进行请求
                this.list = [];
                this.$ajax({
                    url: '/template/list',
                    data: {
                        pageSize: this.pageSize,
                        pageNo: this.pageNo,
                    },
                    success: (res)=>{
                        if(res && res.code == 0) {
                            this.list = res.data.list || []
                            this.totalCount = res.data.totalCount || 0
                        }
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.loaded = true
                        }, 400);
                    },
                    error: (res)=>{
                        this.$YYMessage.error(res && res.msg || this.$t('status.networkError'))
                    }
                })
            } else {
                this.getTemplateApp();
            }
        },
    },
    created () {
        if(this.$router.currentRoute.path == "/LoggerTemplate/manager") {
            this.loadData('fade');
        }
        this.commonTempListData();
    },
}
</script>
<style lang="less" scoped>
@import '../../../../assets/css/var.less';
 .content {
    font-size: 0;
    .commonTemplate,
    .allTemplate {

        padding-bottom: 12px;
        color: #333;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
    }
    .commonTemplateList {
        min-height: 110px;
    }
    .allTemplate {
        padding-top: 8px;
    }
    .commonTemplateListGrid,
    .allTemplateList {
        display: grid;
        grid-row-gap: 16px;
        grid-column-gap: 16px;
        grid-template-rows: repeat(auto-fill, 110px);
        grid-template-columns: repeat(auto-fill, 275px);
        justify-content: center;
        .col {
            margin: 0;
        }
    }
    .template-item-content-create {
        span {
            position: absolute;
            top: 50%;
            margin-top: -20px;
            text-align: center;
            left: 0;
            right: 0;
            i {
                transition: .4s ease all;
                display: block;
                color: @primary-color;
                margin-bottom: 6px;
                font-size: 24px;
            }
        }
        // &:hover {
        //     i {
        //         transform: rotateX(180deg);
        //     }
        // }
    }
    .page {
        width: 100%;
        /deep/ .yy-pagination {
            text-align: center;
        }
        /deep/ .yy-pagination-item {
            background: white;
        }
        /deep/ .yy-pagination-item:hover {
            background: #adb4bc;
        }
        /deep/ .yy-pagination-item-active {
            background: #adb4bc;
        }
    }
    .col {
        width: 275px;
        height: 110px;
        display: inline-block;
        box-sizing: border-box;
        font-size: 14px;
        overflow: hidden;
        border-radius: 3px;
        margin: 0 16px 16px 0;
        // vertical-align: top;
        &.out-leave-active {
            transition: width .3s, opacity .3s;
        }
        &.out-leave-to {
            width: 0;
            opacity: 0;
            padding: 0;
        }
        &.fade-enter {
            opacity: 0;
            transition: width .3s, opacity .3s;
        }
        &.fade-enter-in {
            opacity: 1;
        }
    }
    // @media (min-width: 1280px) {
    //     .col {
    //         width: 25%;
    //     }
    // }
    // @media (min-width: 1680px) {
    //     .col {
    //         width: 20%;
    //     }
    // }
    // @media (min-width: 1920px) {
    //     .col {
    //         width: 16.666666666%;
    //     }
    // }
    
    
}
</style>
