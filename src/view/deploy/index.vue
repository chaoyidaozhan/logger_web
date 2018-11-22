<template>
    <fs-frame>
        <template slot="head">
            <div>{{$t('title.configureAdministratorAndStatisticsPermissions')}}</div>
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
