<template>
    <fs-frame>
        <template slot="head">
            <div class="logger-detail-header clearfix">
                日志模板
            </div>
        </template>
        <template slot="body">
            <router-view></router-view>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
export default {
    components: {
        FsFrame
    }
}
</script>

