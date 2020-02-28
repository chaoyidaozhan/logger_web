<template>
  <div>
    <div class="row">
      <YYTable :columns="columns" :data="data" />
    </div>
    <YYDialog v-model="showDialog">
        <div>
            122222
        </div>
    </YYDialog>
  </div>
</template>
<script>
export default {
    data() {
        return {
            data: [],
            columns: [
                {
                    title: '序号',
                    align: 'center'
                },
                {
                    title: '内部群名称',
                    align: 'center'
                },
                {
                    title: '模版名称',
                    align: 'center'
                },
                {
                    title: '汇报范围',
                    align: 'center'
                },
                {
                    title: '描述',
                    align: 'center'
                },
                {
                    title: '状态',
                    align: 'center'
                },
                {
                    title: '操作',
                    align: 'center'
                }
            ],
            showDialog: true
        }
    },
    components: {
    }
}
</script>