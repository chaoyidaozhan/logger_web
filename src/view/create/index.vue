<template>
    <fs-frame>
        <template slot="head">
            <div class="logger-detail-header clearfix">
                <span 
                    class="back cursor-pointer pull-left" 
                    @click="handleBack">
                    <Icon type="chevron-left"></Icon>
                    {{$t('operate.back')}}
                </span>
                <span 
                    v-if="type" 
                    class="back pull-right" >
                    <YYButton 
                        type="primary" 
                        @click="saveDraftFun">
                        {{$t('operate.saveAsDraft')}}
                    </YYButton>
                </span>
            </div>
        </template>
        <template slot="body">
            <router-view></router-view>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from 'app_view/frame/'

export default {
    data() {
        return {
            params: {},
            transitionName: ''
        }
    },
    components: {
        FsFrame,
    },
    computed: {
        type: function() {
            let params = this.$route.params
            return params.loggertype=='create'
            || params.loggertype=='summary' 
            || params.loggertype=='draft'
        }
    },
    methods: {
        handleBack() {
            this.$router.go(-1);
        },
        saveDraftFun() {
            this.$eventbus.$emit('saveDraftFun');
        }
    },
    watch: {　
        // '$route' (to, from) {　　
        //     const toDepth = to.path.split('/').length　　　　
        //     const fromDepth = from.path.split('/').length　　　　 
        //     this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'　　
        // }
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.logger-detail-header {
    .back {
        color: @gray-color-light;
        i {
            color: @gray-color-light;
            margin-right: 5px;
        }
    }
    .draft-btn{
        margin: 0 5px;
        border-color: @primary-color;
        color: @primary-color;
    }
}
.logger-detail.logger-detail-bg {
    background: #F4F6F8;
}
.logger-detail {
    height: 100%;
    overflow: auto;
    padding: 0 10px 60px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    transition: all .4s ease;
    background: white;
    .title {
        padding: 10px;
        font-size: 14px;
        font-family: PingFangSC-Medium,PingFang SC;
        font-weight: 500;
        color: rgba(51,51,51,1);
        line-height: 20px;
        padding-bottom: 0;
        & > div {
            height: 40px;
            line-height: 40px;
        }
        span {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 100%;
            background-color: @gray-color-elip;
            line-height: 19px;
            text-align: center;
            margin-right: 8px;
        }
    }
}
</style>

