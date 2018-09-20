<template>
    <div>
        <div class="drag-item" v-for="(item, index) in pullList" :key="index">
            <i class="icon-control-text" v-if="item.type == 'InputText'"></i>
            <i class="icon-control-textfield" v-if="item.type == 'InputTextNum'"></i>
            <i class="icon-control-radiobutton" v-if="item.type == 'InputRadio'"></i>
            <i class="icon-control-checkbox" v-if="item.type == 'InputCheckbox'"></i>
            <i class="icon-control-date" v-if="item.type == 'InputDate'"></i>
            <i class="icon-control-date" v-if="item.type == 'InputContainer'"></i>
            {{item.title}}
        </div>
    </div>
</template>
