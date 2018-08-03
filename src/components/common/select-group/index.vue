<template>
    <div class="select-group">
        <Select v-model="groupId" filterable>
                <Option v-for="item in groupListData"
                    :value="item.gid"
                    :key="item.gid">{{ item.groupName }}
                </Option>
        </Select>
    </div>
</template>
<script>
export default {
    data() {
        return {
            pageSize: 100,
            pageNum: 1,
            keyword: "",
            groupListData: [
                {
                    gid: 0,
                    groupName: '全部内部群'
                }
            ],
            groupId: 0
        }
    },
    methods: {
        loadData() {
            this.$ajax({
                url: '/group/authMe',
                type: 'get',
                data: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    keyword: this.keyword
                },
                success: (res)=>{
                    if(res && res.code === 0) {
                        this.groupListData = this.groupListData.concat(res.data || []);
                    } else {
                        this.$Message.warning((res && res.msg) || this.$t('status.networkError'));
                    }
                },
                error: (res)=>{
                    this.$Message.error((res && res.msg) || this.$t('status.networkError'));
                }
            });
        }
    },
    created() {
        this.loadData();
    }
}
</script>
