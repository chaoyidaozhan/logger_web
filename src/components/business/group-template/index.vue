<template>
  <div>
    <div class="row">
      <YYTable :columns="columns" :data="data" />
    </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            data: [],
            columns: [
                {
                    title: '群名称',
                    key: 'name'
                },
                {
                    title: '模版名称',
                    align: 'center'
                },
                {
                    title: '汇报人',
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
        }
    },
    components: {
    }
}
</script>