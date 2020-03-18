<template>
    <fs-frame>
        <template slot="head">
            <div class="mb-flex">
                <div>{{$t('title.addReportReviewer')}}</div>
                <div>{{$t('title.addReportReminder')}}</div>
                <div>{{$t('title.configureAdministratorAndStatisticsPermissions')}}</div>
            </div>
        </template>
        <template slot="body">
            <fs-deploy />
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from 'app_view/frame/'
import FsDeploy from 'app_component/business/deploy'
export default {
    components: {
        FsFrame,
        FsDeploy
    }
}
</script>
<style lang="less" scoped>
.mb-flex {
    font-size: 14px;
    color: #333;
    height: 100%;
}
</style>
