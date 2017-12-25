<template>
    <div class="logger-template-list">
        <fs-template-list :showEdit="true"/>
    </div>
</template>
<script>
import FsTemplateList from 'app_component/logger-template-list/';
export default {
    components: {
        FsTemplateList
    },
}
</script>
<style lang="less" scoped>
.logger-template-list {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 20px 10px 110px;
}
</style>
