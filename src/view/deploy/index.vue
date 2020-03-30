<template>
    <fs-frame>
        <template slot="head">
            <div class="mb-flex">
                <div @click.stop="tabChange('addReportReviewer')" :class="{selected: currentTab == 'addReportReviewer'}">{{$t('title.addReportReviewer')}}</div>
                <div @click.stop="tabChange('addReportReminder')" :class="{selected: currentTab == 'addReportReminder'}">{{$t('title.addReportReminder')}}</div>
                <div v-if="isSettingManagerShow" @click.stop="tabChange('configureAdministrator')" :class="{selected: currentTab == 'configureAdministrator'}">{{$t('title.configureAdministratorAndStatisticsPermissions')}}</div>
            </div>
        </template>
        <template slot="body">
            <fs-deploy :currentTab="currentTab"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from 'app_view/frame/'
import FsDeploy from 'app_component/business/deploy'
export default {
    data() {
        return {
            currentTab: 'addReportReviewer',
            isSettingManagerShow: !!this.$store.state.userInfo.showConfig
        };
    },
    components: {
        FsFrame,
        FsDeploy
    },
    methods: {
        tabChange(tab) {
            this.currentTab = tab;
        }
    }
}
</script>
<style lang="less" scoped>
.mb-flex {
    font-size: 14px;
    color: #333;
    height: 100%;
    & > div {
        position: relative;
        text-align: center;
        margin-right: 24px;
        cursor: pointer;
    }
    & > div.selected {
        color: #ee2223;
        font-size: 14px;
    }
    & > div.selected::after {
        content: '';
        position: absolute;
        width: 50%;
        height: 4px;
        border-radius: 1px;
        left: 50%;
        bottom: 10px;
        transform: translate(-50%, 0);
        background: #ee2223;

    }
}
</style>
