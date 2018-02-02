<template>
    <fs-frame>
        <template slot="head">
            <div class="logger-detail-header clearfix">
                <span class="back cursor-pointer pull-left" @click="handleBack"><Icon type="chevron-left"></Icon>返回</span>
                <span v-if="this.$route.params.loggertype=='create'
                    || this.$route.params.loggertype=='summary' 
                    || this.$route.params.loggertype=='draft'" class="back pull-right" >
                    <Button  type="ghost"  class="draft-btn" @click="saveDraftFun">
                        存为草稿
                    </Button>
                </span>
            </div>
        </template>
        <template slot="body">
            <!-- <transition :name="transitionName">  -->
                <router-view></router-view>
            <!-- </transition>  -->
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';

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
    .title {
        padding: 10px;
        color: @gray-color-medium;
        font-size: 12px;
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

