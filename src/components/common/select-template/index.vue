<template>
    <div class="select-template">
        <Select v-model="templateId" placeholder="请选择模板">
            <Option v-for="(item, index) in tempListData"
                :value="item.id"
                :key="index">{{ item.title }}
            </Option>
        </Select>
    </div>
</template>
<script>
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
                        title: '全部模板'
                    }
                ],
                templateId: 0,
            }
        },
        watch: {
            templateType: 'setTempListData'  
        },
        methods: {
            getTemplateApp(call) {
                this.$store.dispatch('update_template_app').then(()=>{
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
                if(this.hasDefaultTemplate) {
                    this.tempListData = this.tempListData.concat(this.$store.state.template[this.templateType])
                } else {
                    this.tempListData = this.$store.state.template[this.templateType]
                    this.templateId = null
                }
            },
            loadData() { // 默认优先获取数据保存到store
                if(!this.$store.state.template.app.length) { 
                    this.getTemplateApp();
                }
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