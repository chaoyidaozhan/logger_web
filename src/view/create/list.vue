<template>
    <div class="logger-detail logger-detail-bg">
        <div v-if="recentlyTemplates.length">
            <div class="commonTemplateListGrid">
                <div class="title">
                    <div>{{$t('noun.frequentlyUsedtTemplate')}}</div>
                </div>
            </div>
            <div class="commonTemplateListGrid">
                <fs-template-list :outerList='recentlyTemplates'/>
            </div>
        </div>
        <div v-if="template.length">
            <div class="commonTemplateListGrid">
                <div class="title">
                    <div>{{$t('placeholder.allTemplate')}}</div>
                </div>
            </div>
            <div class="commonTemplateListGrid">
                <fs-template-list :outerList='template'/>
            </div>
        </div>
        
    </div>
</template>
<script>
import ajax from '../../common/ajax';
import FsTemplateList from 'app_component/business/template/list'
export default {
    data() {
        return {
            params: {},
            transitionName: '',
            recentlyTemplates: [],// 常用模板
            template: [] // 全部模板
        }
    },
    computed: {
        // type: function() {
        //     let params = this.$route.params
        //     return params.loggertype=='create'
        //     || params.loggertype=='summary' 
        //     || params.loggertype=='draft'
        // }
    },
    methods: {
        initListData () {
            let token = this.$store.state.userInfo.token
            let defineTemplate = []
            // this.$vux.loading.show(this.$t('status.Loading'))
            this.$ajax({
                url: `/template/recentlyTemplates`,
                success: (res) => {
                    console.log(res)
                    this.recentlyTemplates = res.data.recentlyTemplates || defineTemplate
                    this.template = res.data.templates || defineTemplate
                    // setTimeout(() => {
                    //     this.$vux.loading.hide()
                    // }, 300)
                }
            })
            // ajax({
            //     // url: `/template/recentlyTemplates?token= ${token}`,
            //     url: `/rest/v1/group/template?token${token}`,
            //     data: {
            //         // pageNo: 1,
            //         // pageSize: 1000,
            //         // client: type || 'app'
            //     },
            //     success: (res) => {
            //         // if (res && res.code == 0) {
            //         //     call && call(res.data || []);
            //         // }
            //     }
            // })
        }
    },
    watch: {　
        // '$route' (to, from) {　　
        //     const toDepth = to.path.split('/').length　　　　
        //     const fromDepth = from.path.split('/').length　　　　 
        //     this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'　　
        // }
    },
    components: {
        FsTemplateList
    },
    created () {
        this.initListData()
    }
}
</script>
<style lang="less" scoped>
    .commonTemplateListGrid > .content {
        display: grid;
        grid-row-gap: 16px;
        grid-column-gap: 16px;
        grid-template-rows: repeat(auto-fill, 110px);
        grid-template-columns: repeat(auto-fill, 275px);
        justify-content: center;
    }
    .commonTemplateListGrid > .title {
        display: grid;
        grid-template-rows: repeat(auto-fill, 40px);
        grid-template-columns: repeat(auto-fill, 275px);
        grid-column-gap: 16px;
        justify-content: center;
    }
</style>
