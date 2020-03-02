<template>
    <div class="logger-detail">
        <div class="title">
            <div><span>1</span>{{$t('operate.select')}}{{$t('noun.template')}}</div>
        </div>
        <fs-template-list />
    </div>
</template>
<script>
import ajax from '../../common/ajax';
import FsTemplateList from 'app_component/business/template/list'
export default {
    data() {
        return {
            params: {},
            transitionName: ''
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
            ajax({
                url: `/template/recentlyTemplates?token= ${token}`,
                data: {
                    // pageNo: 1,
                    // pageSize: 1000,
                    // client: type || 'app'
                },
                success: (res) => {
                    // if (res && res.code == 0) {
                    //     call && call(res.data || []);
                    // }
                }
            })
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
