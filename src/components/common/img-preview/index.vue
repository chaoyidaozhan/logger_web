<template>
    <transition name="fade">
        <a class="img-preview" id="img-preview" v-if="isShow" 
            @mouseover="showSideBar = true"
            @mouseleave="showSideBar = false"  
            @mousewheel="(e)=>{e.stopPropagation()}"
            ref="preview">
            <div :class="'img-slider img-slider_' + index" v-for="(item, index) in imgList" v-show="(index == imgIndex) && isShow" :key="'a'+index" @click="hidePreview" @mousewheel="mousewheel($event, index)">
                <img :src="item"   
                    :class="'img_' + index"
                    @click="stopPropagation($event)"  
                    @mousedown="mousedown($event, index)" 
                    @load="onload($event, index)">
                <transition name="fade"><span :class="'tips_' + index" v-show="isWheel"></span></transition>
            </div>
            <transition name="fade">
                <div class="btn-groups" v-show="showSideBar">
                    <span class="to-prev" @click="toPrev" v-if="imgIndex != 0"></span>
                    <span class="to-next" @click="toNext" v-if="imgIndex != imgList.length - 1"></span>
                </div>
            </transition>
            <transition name="fade">
                <a href="javascript:void(0)" v-show="showSideBar" class="close icon icon-close-circle" @click="hidePreview"></a>
            </transition>
            <transition name="fade">
                 <div class="img-sidebar" v-show="showSideBar">
                    <ul>
                        <li class="zoomIn" @click="zoomIn"><a>放大</a></li>
                        <li class="zoomOut" @click="zoomOut"><a>缩小</a></li>
                        <li class="download" v-if="config.platform && config.platform.shell != 'nwjs'" @click="saveAs(imgMsgData[imgIndex])"><a>下载</a></li>
                        <li class="download nw-file-save" v-if="config.platform && config.platform.shell == 'nwjs'" @click="trimInputFIle">
                            <input type="file" @change="nwSaveAs($event, imgMsgData[imgIndex])" :nwsaveas="imgMsgData[imgIndex].data.content.name" :nwworkingdir="downloadLocation"/>
                            <a>下载</a>
                        </li>
                        <li class="rotate" @click="rotate"><a>旋转</a></li>
                    </ul>
                </div>
            </transition>
        </a>
    </transition>
</template>

<script>
export default {
    name: 'imgPreview',
    components: {},
    props: ['value', 'msgId'],
    data () {
        return {
            imgIndex: 1,
            isWheel: false,
            prevMsgId: '',
            nextMsgId: '',
            imgList: [],
            imgMsgData: [],
            bWidth:'', //屏幕可见宽高
            bHeight:'',
            cWidth:'', //元素显示宽高
            cHeight:'',
            cLeft: '', //定位
            cTop: '',
            showSideBar: false,
            rotateDeg: 0,
            wheelTimer: null,
            config: {},
            downloadLocation: ''
        }
    },
    methods : {
        hidePreview: function () { //关闭预览
            this.$emit('input', false);
        },
        stopPropagation: function (e) {  
            e.stopPropagation();
        },
        toNext: function () {
            if(!!this.nextMsgId) {
                this.getNextImg();
            }
            if(this.imgIndex < this.imgList.length - 1) this.imgIndex++;
            this.msgData
            this.resetImg();
        },
        toPrev: function () {
            if(!!this.prevMsgId) {
                this.getPrevImg();
            } 
            if(this.imgIndex > 0 && !this.prevMsgId) this.imgIndex--;
            this.resetImg();
        },
        zoomIn: function () {
            this.mousewheel(null, this.imgIndex, 100)
        },
        zoomOut: function () {
            this.mousewheel(null, this.imgIndex, -100)
        },
        rotate: function () {
            let oImg = document.querySelector('.img_' + this.imgIndex);
            this.rotateDeg += 90;
            oImg.style.transform = `rotate(${this.rotateDeg}deg)`;
        },
        slider: function (keyCode) {
            if(keyCode == 37) {
                this.toPrev();
            }
            if(keyCode == 39) {
                this.toNext();
            }
        },
        onload: function(e, index){
            this.resetImg(()=>{
                let slider = document.querySelector('.img-slider_' + index);
                if(slider) {
                    if(slider.className.indexOf('on') == -1) {
                        slider.className += ' on'
                    }
                }
            });
        },
        resetImg: function (call) {
            this.$nextTick(()=>{
                this.rotateDeg = 0;
                let oImg = document.querySelector('.img_' + this.imgIndex);
                if (oImg) {
                    let nWidth = oImg && oImg.naturalWidth;
                    let nHeight = oImg && oImg.naturalHeight;

                    let bWidth = document.body.clientWidth;
                    let bHeight = document.body.clientHeight;

                    let per = .8;

                    let bscale = bHeight / bWidth;
                    let nscale = nHeight / nWidth;

                    let cWidth, cHeight;
                    if (nHeight > bHeight && nWidth > bWidth) { //真实高度宽度大于屏幕宽高
                        if (bscale > nscale) { //真实宽度大于屏幕高
                            cWidth = bWidth * per;
                            cHeight = bWidth * nHeight / nWidth * per;
                        } else if (bscale < nscale) { //真实高度大于屏幕宽
                            cWidth = bHeight * nWidth / nHeight * per;
                            cHeight = bHeight * per;
                        } else { //真实宽高等于屏幕宽高
                            cWidth = bWidth * per;
                            cHeight = bHeight * per;
                        }
                    } else if (nHeight > bHeight) { //真实高度大于屏幕高度
                        cWidth = bHeight * nWidth / nHeight * per;
                        cHeight = bHeight * per;
                    } else if (nWidth > bWidth) { //真实宽度大于屏幕宽度
                        cWidth = bWidth * per;
                        cHeight = bWidth * nHeight / nWidth * per;
                    } else {
                        cWidth = nWidth;
                        cHeight = nHeight;
                    }
                    this.bWidth = Math.round(bWidth); //记录屏幕宽度
                    this.bHeight = Math.round(bHeight); //记录屏幕高度

                    this.cWidth = Math.round(cWidth); //记录初始宽度
                    this.cHeight = Math.round(cHeight); //记录初始高度

                    this.cLeft = Math.round(bWidth - cWidth) / 2; //记录初始位移
                    this.cTop = Math.round(bHeight - cHeight) / 2;
                    this.isWheel = false;

                    oImg.delta = '100%';
                    oImg.style.width = Math.round(cWidth) + 'px';
                    oImg.style.height = Math.round(cHeight) + 'px';

                    oImg.style.top = this.cTop + 'px';
                    oImg.style.left = this.cLeft + 'px';

                    oImg.style.marginLeft = 0;
                    oImg.style.marginTop = 0;
                }
                setTimeout(()=>{
                    call && call()
                }, 0)
            })
        },
        getImgData: function () {
            this.imgList = []; //初始化数组
            this.imgMsgData = []; //初始化数组
            if(this.msgId) {
                let msg = YYIMCache.getMessageManager().get(this.msgId);
                let prevMsg = YYIMCache.getMessageManager().getPrevImageCache(this.msgId);
                let nextMsg = YYIMCache.getMessageManager().getNextImageCache(this.msgId);

                this.prevMsgId = prevMsg && prevMsg.id || undefined;
                this.nextMsgId = nextMsg && nextMsg.id || undefined;
                
                let curImg = msg && msg.data && msg.data.content && msg.data.content.path;
                this.imgList.push(curImg); 
                this.imgMsgData.push(msg); 
                if(prevMsg && prevMsg.data && prevMsg.data.content && prevMsg.data.content.path) { 
                    this.imgList.unshift(prevMsg.data.content.path);
                    this.imgMsgData.unshift(prevMsg);
                }  
                if(nextMsg && nextMsg.data && nextMsg.data.content && nextMsg.data.content.path) { 
                    this.imgList.push(nextMsg.data.content.path); 
                    this.imgMsgData.push(nextMsg);
                } 

                this.imgIndex = (prevMsg != undefined && msg != undefined) ? 1 : 0; //初始化当前显示图片
            }
        },
        saveAs: function (message) {
			if(!!renderer) {
				const that = this;
				let member_id = this.$store.state.user.userInfo.member_id;
				let settings = storage.get('SYSTEM_SETTINGS');
				let path = settings && settings[member_id] && settings[member_id].systemSettings.downloadLocation;
				
                const platform = this.$store.state.config.platform;
				renderer.cmdAsync('dialog-showSaveDialog',{
					title:'另存为',
					defaultPath: path.result + (platform.isMac? '/':'\\') + message.data.content.name,
					callback: function(path){
						if(path){
							if(message && message.data && message.data.content && message.data.content.type) {
								if(path.lastIndexOf(message.data.content.type) == -1) {
									path += `.${message && message.data && message.data.content && message.data.content.type}`;
								}
							}
							const finalPath = path.replace(/(.*[\\|\/])((.*)\.(.*))/,'$1');
							const finalName = path.replace(/(.*[\\|\/])((.*)\.(.*))/,'$3');
							console.log(finalPath, finalName)
							//const finalSuffix = path.replace(/(.*[\\|\/])((.*)\.(.*))/,'$4');

							that.download(message, finalPath, `${finalName}${message.data.content.type ? '.' + message.data.content.type : ''}`);
							message = null;
						}
					}
				});

			}
        },
        trimInputFIle: function (e) {
			if(e && e.target && e.target.children && e.target.children.length) {
				e.target.children[0].click();
			}
		},
        nwSaveAs: function (e, message) {
			if(!!renderer) {
				let path = e && e.target && e.target.value;
				if(!!path) {
					const finalPath = path.replace(/(.*[\\|\/])((.*)(\.(.*))?)/,'$1');
					const finalName = path.replace(/(.*[\\|\/])((.*)(\.(.*))?)/,'$3');
					this.download(message, finalPath, `${finalName}${message.data.content.type ? (finalName.indexOf(message.data.content.type) != -1 ? '' : '.' + message.data.content.type) : ''}`);
				}
			}
		},
        download: function (message, local, filename) {
			if(!!renderer) {
				const platform = this.$store.state.config.platform;

				let member_id = this.$store.state.user.userInfo.member_id;
				let settings = storage.get('SYSTEM_SETTINGS');
				let settingsPath = settings && settings[member_id] && settings[member_id].systemSettings.downloadLocation

                let path = local || settingsPath;

				if(path && platform.isWin){
					path = path.replace(/[\\\/]/g,'\\\\');
					if(!(/[\\\/]$/.test(path))){
						path += '\\\\';
					}
				}

                renderer.cmdAsync('download-launch',{
                    remote: message.data.content.path,
                    local: path,
					fileName: filename || message.data.content.name,
					data: {
						id: message.id,
						location: `${path}/${filename || message.data.content.name}` 
					},
					isMkdir: true,
                    progress: (res)=>{
						
                    },
                    success: (res)=>{
						
                    },
                    error: (res)=>{
						
                    }
                });
            }
		},
        getPrevImg: function (id) {
            let prevMsg = YYIMCache.getMessageManager().getPrevImageCache(this.prevMsgId);
            this.prevMsgId = prevMsg && prevMsg.id || undefined;
            if(prevMsg) {
                this.imgList.unshift(prevMsg.data.content.path);
                this.imgMsgData.unshift(prevMsg);
            } 
        },
        getNextImg: function (id) {
            let nextMsg = YYIMCache.getMessageManager().getNextImageCache(this.nextMsgId);
            this.nextMsgId = nextMsg && nextMsg.id || undefined;
            if(nextMsg) {
                this.imgList.push(nextMsg.data.content.path);
                this.imgMsgData.push(nextMsg);
            }
        },
        mousewheel: function (event, index, delta) { // 鼠标滚动缩放
            if(event) {
                event.preventDefault();
            }
            let oImg = document.querySelector('.img_' + index);
            let tElement = document.querySelector('.tips_' + index);

            this.isWheel = true;
            let zoom = parseInt(oImg.delta ,10) || 100;
            if(event) {
                zoom += event.wheelDelta / 12;
            } else {
                zoom += delta / 12;
            }

            let mWidth = this.cWidth * zoom / 100;
            let mHeight = this.cHeight * zoom / 100;
            
            this.cTop = (this.bHeight - mHeight) / 2;
            this.cLeft = (this.bWidth - mWidth) / 2;

            if(zoom > 20 && zoom < 1000) {
                oImg.style.width = Math.round(mWidth) + 'px';
                oImg.style.height = Math.round(mHeight) + 'px';
                oImg.style.left = Math.round(this.cLeft) + 'px';
                oImg.style.top = Math.round(this.cTop) + 'px';
                oImg.delta = zoom +'%';
                tElement.innerHTML = zoom.toFixed(0) +'%';
            }
            clearTimeout(this.wheelTimer);
            this.wheelTimer = setTimeout(()=>{
                this.isWheel = false;
            }, 5000)
            return false;
        },
        mousedown: function(event, index) { //鼠标拖拽
            let that = this;
            let disX = event.clientX;
            let disY = event.clientY;
            let oImg = document.querySelector('.img_' + index);
            
            let imgL = parseInt(oImg.style.marginLeft) || 0;
            let imgT = parseInt(oImg.style.marginTop) || 0;

            let zoom = parseInt(oImg.delta, 10) || 100;
            document.onmousemove = function (event, index){
                let iDisX = (event.clientX - disX) + imgL;
                let iDisY = (event.clientY - disY) + imgT;

                oImg.style.marginLeft = Math.round(iDisX) + 'px';
                oImg.style.marginTop = Math.round(iDisY) + 'px';

                return false
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };

            return false;
        },
        destroyed: function () { // 退出清空图片数据
            this.imgList = null;
        },
        init: function() {
            this.config = this.$store.state.config;
            if(!!renderer) {
                let member_id = this.$store.state.user.userInfo.member_id;
                let settings = storage.get('SYSTEM_SETTINGS');
                let settingsPath = settings && settings[member_id] && settings[member_id].systemSettings.downloadLocation;
                this.downloadLocation = settingsPath;
            }
        }
    },
    computed: {
        isShow: { //判断当前预览
            get: function() {
                return this.value;
            }
        }
    },
    watch: {
        value: function () { //打开关闭的时候重新获取数据
            if(this.isShow) {
                this.getImgData();
                this.$nextTick(()=>{
                    clearTimeout(this.resetImgTimer);
                    this.resetImgTimer = setTimeout(()=>{
                        this.resetImg();
                    }, 200)
                })
            }
        }
    },
    created () {
        this.getImgData();
    },
    mounted () {
        this.init();
        this.$eventbus.$on('previewOnKeyDown', (keyCode)=>{
            if(!!this.value){
                this.slider(keyCode);
            }
            if(keyCode == 27) {
                this.hidePreview()
            }
        })
    },
    destroyed () {
        this.$eventbus.$off('previewOnKeyDown');
        this.destroyed();
        clearTimeout(this.resetImgTimer);
        clearTimeout(this.wheelTimer);
    }
}
</script>

<style lang="less" scoped>
.fade-enter-active {
    transition: .25s all ease;
    opacity: 0;
}
.fade-enter-to {
    opacity: 1;
}
.fade-leave-active {
    transition: .25s all ease;
    opacity: 1;
}
.fade-leave-to {
    opacity: 0;
}  
.img-preview {
    position: fixed;
    top:0;
    right:0;
    left:0;
    bottom:0;
    z-index: 9999;
    opacity: 1;
    overflow: hidden;
    background-color: rgba(0,0,0,.3);
    -webkit-app-region: no-drag;
    &.fade-enter-active {
        transition: .4s all ease;
        opacity: 0;
    }
    &.fade-enter-to {
        opacity: 1;
    }
    &.fade-leave-active {
        transition: .4s all ease;
        opacity: 1;
    }
    &.fade-leave-to {
        opacity: 0;
    }  
    .close {
        color: #444;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        border-radius: 50%;
        z-index: 999;
        font-size: 18px;
        -webkit-app-region: no-drag;
    }
    .img-slider {
        position: absolute;
        top:0;
        right:0;
        left:0;
        bottom:0;
        text-align: center;
        // background: url(../../../assets/images/im/frame/loading_transparent.gif) no-repeat center;
        img {
            position: absolute;
            top:50%;
            left:50%;
            cursor: move;
            cursor: -webkit-grab;
            cursor: -moz-grab;
            cursor: grab;
            z-index:20;
            -ms-interpolation-mode:bicubic;
            display:none;
        }
        &.on {
            background: none;
            img {
                display: block;
            }
        }
        span {
            background-color: #000;
            background-color: rgba(0,0,0,.8);
            color: #fff;
            border-radius: 10px;
            padding: 3px 10px;
            opacity: 1;
            margin:30% auto 0;
            font-size: 12px;
            position:relative;
            z-index:999;
            display:inline-block;
            &.fade-enter-active, &.fade-leave-active {
                transition: .2s all ease;
            }
            &.fade-enter, &.fade-leave-active {
                opacity:0;
            } 
        }
    }
    .to-prev, .to-next {
        position: absolute;
        top:50%;
        width:46px;
        height:45px;
        margin-top:-23px;
        // background: url(../../../assets/images/im/frame/switch.png) no-repeat;
        cursor: pointer;
        z-index: 99;
    }
    .to-prev {
        background-position: bottom center;
        left:10px;
    }
    .to-next {
        background-position: top center;
        right:10px;
    }
    .img-sidebar {
        position: absolute;
        bottom: 20px;
        height: 66px;
        border-radius: 60px;
        padding: 0 15px;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 99;
        -webkit-user-select: none;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        li {
            display: inline-block;
            margin: 5px 10px 12px;
            color: #afaeae;
            cursor: pointer;
            overflow: hidden;
            a {
                color: #afaeae;
                display: block;
                width: 100%;
                height: 100%;
                padding-top: 35px;
                // background-image: url(../../../assets/images/im/frame/viewer_toolbar.png);
                background-repeat: no-repeat;
            }
            &.nw-file-save {
                position: relative;
                overflow: hidden;
                input {
                    position: absolute;
                    left: 0;
                    opacity: 0;
                    height: 100%;
                }
            }
            &.zoomIn a{ background-position: 3px 7px; }

            &.zoomOut a{ background-position: -52px 7px; }

            &.download a{ background-position: -163px 7px; }

            &.rotate a{ background-position: -109px 7px; }
            &:hover {
                a {
                    color: #fff;
                }
                &.zoomIn a{ background-position: -25px 6px; }

                &.zoomOut a{ background-position: -81px 8px; }

                &.download a{ background-position: -188px 6px; }

                &.rotate a{ background-position: -138px 7px; }
            }
        }
    }
}
</style>