<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showDatePicker="true"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body" >
            <fs-query-list 
                url="/favorite/getMyFavorite"
                :isCollect="true"
                :range="range" 
                :dataStatus="0" 
                :params="params" 
            />
        </template>
    </fs-frame>
</template>
<script>
import query from 'app_src/mixins/query.js'
export default {
    data() {
        return {
            range: '0'
        }
    },
    mixins: [query]
}
</script>
