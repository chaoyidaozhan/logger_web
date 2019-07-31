<template>
    <fs-frame v-loading="{loading: loading, text: '正在处理...'}">
        <template slot="head">
            <div class="logger-template-header clearfix">
                <div class="pull-left">
                    <span class="first-name cursor-pointer" @click="goToTemplate">
                        {{$t('title.logTemplate')}}
                    </span>
                    <span><i class="icon-arrow-right"></i>
                        {{$t('title.logTemplateSettings')}}
                    </span>
                </div>
                <div class="pull-right">
                    <!--启用， 停用-->
                    <YYButton type="ghost" @click="handlePreview">
                        {{$t('operate.preview')}}
                    </YYButton>
                    <template v-if="!dataStatus">
                        <YYButton type="ghost" @click="handleSubmit('1')">
                            {{$t('operate.saveAndEnable')}}
                        </YYButton>
                        <YYButton type="primary" @click="handleSubmit(null)">
                            {{$t('operate.save')}}
                        </YYButton>
                    </template>
                    <template v-else>
                        <!--启用-->
                        <YYButton type="ghost" @click="handleStop">
                            {{$t('operate.disable')}}
                        </YYButton>
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
import FsFrame from 'app_view/frame/'
import FsTemplateCreate from 'app_component/business/template/manager/'

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
        handlePreview() {
            this.$refs.TemplateCreate.handlePreview();
        },
        handleStop() {
            this.loading = false;
            this.$refs.TemplateCreate.handleStop();
        },
        goToTemplate() {
            this.$router.push({
                path: `/LoggerTemplate/manager`,
                query: {
                    token: this.$store.state.userInfo.token
                }
            });
        }
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';

.logger-template-header {
    button {
        margin-left: 6px;
    }
    .first-name {
        color: @gray-color-light;
    }
    span {
        i {
            padding: 0 4px 0 0;
            font-size: 12px;
        }
    }
    .ivu-btn-ghost {
        color: @primary-color;
        border-color: @primary-color;
    }
}
</style>



