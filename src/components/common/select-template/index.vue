<template>
    <div class="select-template">
        <Select v-model="templateId">
                <Option v-for="item in tempListData"
                    :value="item.id"
                    :key="item.id">{{ item.title }}
                </Option>
        </Select>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                tempListData: [
                    {
                        id: 0,
                        title: '全部模板'
                    }
                ],
                templateId: 0
            }
        },
        methods: {
            loadData() {
                this.$ajax({
                    url: '/logger/template/list',
                    type: 'get',
                    data: {
                        pageNumber: 1,
                        pageSize: 1000
                    },
                    success: (res)=>{
                        if(res && res.code === 0) {
                            this.tempListData = this.tempListData.concat(res.data.list || []);
                        } else {
                            this.$Message.warning((res && res.msg) || '网络错误');
                        }
                    },
                    error: (res)=>{
                        this.$Message.error((res && res.msg) || '网络错误');
                    }
                });
            }
        },
        created() {
            this.loadData();
        }
    }
</script>
<style lang="less" scoped>
    .select-template {
        margin-right: 15px;
    }
</style>

