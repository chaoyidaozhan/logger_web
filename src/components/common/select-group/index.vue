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
                    groupName: `${this.$t('operate.all')}${this.$t('noun.internalGroup')}`
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
                        this.$YYMessage.warning((res && res.msg) || this.$t('status.networkError'));
                    }
                },
                error: (res)=>{
                    this.$YYMessage.error((res && res.msg) || this.$t('status.networkError'));
                }
            });
        }
    },
    created() {
        this.loadData();
    }
}
</script>
