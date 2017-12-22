<template>
    <div class="select-template">
        <Select v-model="templateId">
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
                this.$ajax({
                    url: '/logger/template/list',
                    data: {
                        pageNumber: 1,
                        pageSize: 1000,
                        client: 'app'
                    },
                    success: (res)=>{
                        if(res && res.code === 0) {
                            this.$store.dispatch('update_template_app', { //登录成功更新store
                                app: res.data || []
                            })
                            this.setTempListData();
                        } else {
                            this.$Message.warning((res && res.msg) || '网络错误');
                        }
                    }
                });
            },
            getTemplateWeb(call) {
                this.$ajax({
                    url: '/logger/template/list',
                    data: {
                        pageNumber: 1,
                        pageSize: 1000,
                        client: 'web'
                    },
                    success: (res)=>{
                        if(res && res.code === 0) {
                            this.$store.dispatch('update_template_web', { //登录成功更新store
                                web: res.data.list || []
                            });
                            this.setTempListData();
                        } else {
                            this.$Message.warning((res && res.msg) || '网络错误');
                        }
                    }
                });
            },
            setTempListData() { // 设置当前模板数据
                if(this.hasDefaultTemplate) {
                    this.tempListData = this.tempListData.concat(this.$store.state.template[this.templateType])
                } else {
                    this.tempListData = this.$store.state.template[this.templateType]
                }
            },
            loadData() { // 默认优先获取数据保存到store
                if(!this.$store.state.template.app.length) { 
                    this.getTemplateApp();
                }
                if(!this.$store.state.template.web.length) {
                    this.getTemplateWeb();
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