<template>
    <div class="logger-detail">
        <div v-if="recentlyTemplates.length">
            <div class="title">
                <div><span>1</span>常用模板{{$t('noun.template')}}</div>
            </div>
            <fs-template-list :outerList='recentlyTemplates'/>
        </div>
        <div v-if="template.length">
            <div class="title">
                <div><span>1</span>全部模板{{$t('noun.template')}}</div>
            </div>
            <fs-template-list :outerList='template'/>
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
