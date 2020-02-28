<template>
    <fs-frame>
        <template slot="head">
            <div class="logger-detail-header clearfix">
                <span>{{$t('menus.groupTemplateManagement')}}</span>
                <div class="pull-right">
                    <YYButton type="primary">新建群模版</YYButton>
                </div>
            </div>
        </template>
        <template slot="body">
            <fs-group-template></fs-group-template>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from 'app_view/frame/'
import FsGroupTemplate from 'app_component/business/group-template'

export default {
    components: {
        FsFrame,
        FsGroupTemplate
    }
}
</script>