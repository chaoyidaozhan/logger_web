<template>
    <div>
        <div class="nav" ref="leftNav">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
        </div>
        <div class="content" ref="rightContent">
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
        </div>
    </div>
</template>
<script>
import Sortable from 'sortablejs'
export default {
    mounted () {
        Sortable.create(this.$refs.leftNav)
    }
}
</script>
<style lang="less" scoped>

</style>

