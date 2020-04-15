<template>
    <div class="select-template">
        <YYSelect 
            v-model="templateId" 
            :invertable="false"
            :transfer="false"
            :placeholder="`${$t('operate.select')}${$t('noun.template')}`">
            <YYOption v-for="(item, index) in tempListData"
                :value="item.id"
                :key="index">{{ item.title | filterHtml  }}
            </YYOption>
        </YYSelect>
    </div>
</template>
<script>
import HTMLDeCode from 'app_src/filters/HTMLDeCode';

export default {
    props: {
        hasDefaultTemplate: {
            type: Boolean,
            default: true
        },
        templateType: {
            type: String,
            default: 'app'
        }
    },
    data() {
        return {
            tempListData: [
                {
                    id: 0,
                    title: this.$t('placeholder.allTemplate')
                }
            ],
            templateId: 0,
            templateVersion: null
        }
    },
    watch: {
        templateType: 'setTempListData',
        templateId: 'setTemplateVersion'
    },
    filters: {
        filterHtml(val) {
            return HTMLDeCode(val)
        }
    },
    methods: {
        setTemplateVersion(value) {
            this.tempListData.filter((item)=>{
                if(item.id === this.templateId) {
                    this.templateVersion = item.version
                }
            })
            if(value) {
                this.$emit('handleChange', value)
            }
        },
        getTemplateApp(call) {
            this.$store.dispatch('update_template_app', {templateType:this.templateType}).then(()=>{
                this.setTempListData();
            })
        },
        getTemplateWeb(call) {
            this.$store.dispatch('update_template_web').then(()=>{
                this.setTempListData();
            })
        },
        setTempListData() { // 设置当前模板数据
            if(!this.$store.state.template.web.length && this.templateType == 'web') {
                this.getTemplateWeb();
            }
            let templateType = this.templateType != 'web' ? 'app' : 'web';
            if(this.hasDefaultTemplate) {
                this.tempListData = [
                    {
                        id: 0,
                        title: this.$t('placeholder.allTemplate')
                    }
                ]
                this.tempListData = this.tempListData.concat(this.$store.state.template[templateType])
            } else {
                this.tempListData = this.$store.state.template[templateType]
                this.templateId = null
            }
        },
        loadData() { // 默认优先获取数据保存到store
            this.getTemplateApp();
            if(this.tempListData.length < 2) {
                this.setTempListData();
            }
        }
    },
    created() {
        this.loadData();
    }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/var.less';
.select-template {
    width: 100%;
    .ivu-select-dropdown-list {
        .ivu-select-item {
            padding: 12px 15px;
            &.selected, &:hover {
                background-color: @white-color-dark;
            }
        }
    }
}
</style>
