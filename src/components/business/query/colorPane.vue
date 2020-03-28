<template>
    <div>
        <div class="colorPane" @click="showdrawingBoard = !showdrawingBoard">
            <div class="colorLump"></div>
        </div>
        <div class="drawingBoard" v-show='showdrawingBoard'>
            <div class="drawingBoardBorder" v-for="(drawPane, index) in drawPanes" :key="index">
                <div class="drawPaneBoardFirst" v-if="index % 6 === 0" :style="{background:drawPane.color}" @click="changeColor(drawPane.color)"></div>
                <div class="drawPaneBoard" v-else :style="{background:drawPane.color}" @click="changeColor(drawPane.color)"></div>
            </div>
        </div> 
    </div>
</template>
<script>
export default {
    data(){
        return{
            drawPanes:[{
                color:'#BDA6E9'
            },{
                color:'#75D4B4'
            },{
                color:'#9CBBF2'
            },{
                color:'#FFBA67'
            },{
                color:'#F57B7C'
            },{
                color:'#999999'
            },{
                color:'#9069D9'
            },{
                color:'#18B681'
            },{
                color:'#588CE9'
            },{
                color:'#FF8B00'
            },{
                color:'#EE2223'
            },{
                color:'#666666'
            },{
                color:'#6A5396'
            },{
                color:'#228161'
            },{
                color:'#49689F'
            },{
                color:'#AC6714'
            },{
                color:'#A22829'
            },{
                color:'#333333'
            }],
            showdrawingBoard: false
        }
    },
    methods:{
        changeColor(color){
            let colorLump = document.querySelector('.colorLump')
            colorLump.style.background = color
            this.showdrawingBoard = false
            const canvas = document.querySelector('#draw')
            const ctx = canvas.getContext('2d')
            ctx.strokeStyle = color
        }
    }
}
</script>
<style lang="less" scoped>
    .colorPane{
        font-size: 20px;
        background:rgba(0,0,0,.36);
        width: 48px;
        height: 48px;
        color: #FFF;
        line-height: 48px;
        text-align: center;
        cursor: pointer;
        padding: 13px;
        border-radius:0px 0px 3px 3px;
        .colorLump{
            width: 22px;
            height: 22px;
            background:rgba(238,34,35,1);
            border-radius:2px;
            opacity:1;
            border:1px solid rgba(136,136,136,1);
        }
    }
    .drawingBoard{
        width:200px;
        height:110px;
        padding: 11px;
        background:rgba(255,255,255,1);
        box-shadow:0px 6px 8px 0px rgba(74,81,93,0.25);
        border-radius:3px;
        border:1px solid rgba(208,208,208,1);
        top:192px;
        right: 88px;
        position: absolute;
        .drawingBoardBorder{
            display: inline-block;
            .drawPaneBoardFirst{
                cursor: pointer;
                display: inline-block;
                width:26px;
                height:26px;
                border-radius:2px;
            }
            .drawPaneBoard{
                cursor: pointer;
                display: inline-block;
                width:26px;
                height:26px;
                border-radius:2px;
                margin-left: 4px;
            }
        }
    }
</style>