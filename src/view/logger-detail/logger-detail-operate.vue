<template>
    <div class="logger-detail">
        <div class="title">
            <div v-if="this.$route.params.loggertype=='create'">
                <span>2</span>{{$t('operate.createLog')}}-{{this.$route.query.templateName | filterHtml}}
            </div>
        </div>
        <fs-template-create/>
    </div>
</template>
<script>
import FsTemplateCreate from 'app_component/logger-template-create/';
import HTMLDeCode from 'app_src/filters/HTMLDeCode';

export default {
    components: {
        FsTemplateCreate
    },
    filters: {
        filterHtml(val) {
            return HTMLDeCode(val)
        }
    }
}
</script>


