<template>
    <fs-frame>
        <template slot="head">
            <div class="logger-detail-header clearfix">
                <span class="back cursor-pointer pull-left" @click="handleBack"><Icon type="chevron-left"></Icon>返回</span>
                <span v-if="this.$route.params.loggertype=='create'" class="back pull-right" >
                    <Button  type="ghost"  class="draft-btn" @click="saveDraftFun">
                        保存为草稿
                    </Button>
                </span>
            </div>
        </template>
        <template slot="body">
            <router-view></router-view>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';

export default {
    data() {
        return {
            params: {}, 
        }
    },
    components: {
        FsFrame,
    },
    methods: {
        handleBack() {
            this.$router.go(-1);
        },
        saveDraftFun(){
            this.$eventbus.$emit('saveDraftFun')
        }
    }
}
</script>
<style lang="less" scoped>
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
</style>

