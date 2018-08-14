<template>
    <div class="logger-detail">
        <div class="title">
            <div><span>1</span>{{$t('operate.select')}}{{$t('noun.template')}}</div>
        </div>
        <fs-template-list/>
    </div>
</template>
<script>
import FsTemplateList from 'app_component/logger-template-list/';
export default {
    components: {
        FsTemplateList
    }
}
</script>
