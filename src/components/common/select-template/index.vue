<template>
    <div class="select-template">
        <Select v-model="templateId" 
            :placeholder="`${$t('operate.select')}${$t('noun.template')}`">
            <Option v-for="(item, index) in tempListData"
                :value="item.id"
                :key="index">{{ item.title | filterHtml  }}
            </Option>
        </Select>
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
        }
    },
    watch: {
        templateType: 'setTempListData'  
    },
    filters: {
        filterHtml(val) {
            return HTMLDeCode(val)
        }
    },
    methods: {
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
    .ivu-select-item-selected,
    .ivu-select-item-selected:hover {
        background: @select-item-bg;
        color: @gray-color-dark;
    }
}
</style>
