<template>
    <div class="logger-detail">
        <div class="title">
            <div v-if="this.$route.params.loggertype=='create'">
                <span>2</span>创建日志-{{this.$route.query.templateName}}
            </div>
        </div>
        <fs-template-create/>
    </div>
</template>
<script>
import FsTemplateCreate from 'app_component/logger-template-create/';
export default {
    components: {
        FsTemplateCreate
    }
}
</script>


