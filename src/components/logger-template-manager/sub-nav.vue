<template>
    <div class="drag-item">
        <i class="icon-control-text" v-if="data.type == 'InputText'"></i>
        <i class="icon-control-textfield" v-if="data.type == 'InputTextNum'"></i>
        <i class="icon-control-radiobutton" v-if="data.type == 'InputRadio'"></i>
        <i class="icon-control-checkbox" v-if="data.type == 'InputCheckbox'"></i>
        <i class="icon-control-date" v-if="data.type == 'InputDate'"></i>
        <i class="icon-control-date" v-if="data.type == 'InputContainer'"></i>
        {{data.title}}
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Object
        }
    }
}
</script>
