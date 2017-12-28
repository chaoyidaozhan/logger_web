<template>
    <div class="select-date-type">
        <Select v-model="orderType">
            <Option v-for="item in dateListData"
                :value="item.id"
                :key="item.id">{{ item.name }}
            </Option>
        </Select>
    </div>
</template>
<script>
export default {
    props: {
        dateListData: {
            type: Array,
            default: function () {
                return [{
                    name: "按日统计",
                    id: 4
                }, {
                    name: "按月统计",
                    id: 0
                }];
            }
        }
    },
    data() {
        return {
            orderType: this.dateListData[0] && this.dateListData[0].id
        }
    }
}
</script>
