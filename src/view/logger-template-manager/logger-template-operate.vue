<template>
    <fs-frame v-loading="{loading: loading, text: '正在处理...'}">
        <template slot="head">
            <div class="logger-template-header clearfix">
                <div class="pull-left">
                    <span>日志模板</span>
                    <span>设置日志模板</span>
                </div>
                <div class="pull-right">
                    <!--启用， 停用-->
                    <Button type="ghost">
                        预览
                    </Button>
                    <template v-if="!dataStatus">
                        <Button type="ghost" @click="handleSubmit('1')">
                            保存并启用
                        </Button>
                        <Button type="primary" @click="handleSubmit(null)">
                            保存
                        </Button>
                    </template>
                    <template v-else>
                        <!--启用-->
                        <Button type="ghost" @click="handleStop">
                            停用
                        </Button>
                    </template>
                </div>
            </div>
        </template>
        <template slot="body">
            <fs-template-create 
                ref="TemplateCreate" 
                @handleLoading="handleLoading"
                @handleDataStatus="handleDataStatus"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsTemplateCreate from 'app_component/logger-template-manager/template-create';
import 'app_src/directives/loading/';

export default {
    data () {
        return {
            dataStatus: 0,
            loading: false
        }
    },
    components: {
        FsFrame,
        FsTemplateCreate
    },
    methods: {
        handleDataStatus(dataStatus) {
            this.dataStatus = dataStatus;
        },
        handleLoading() {
            this.loading = true;
        },
        handleSubmit(dataStatus) {
            this.$refs.TemplateCreate.handleSubmit(dataStatus || null, ()=>{
                this.loading = false;
            });
        },
        handleStop() {
            this.loading = false;
            this.$refs.TemplateCreate.handleStop();
        },
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';

.logger-template-header {
    button {
        margin-left: 6px;
    }
    .ivu-btn-ghost {
        color: @primary-color;
        border-color: @primary-color;
    }
}
</style>



