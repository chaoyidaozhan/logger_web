<template>
  <div id="globalModal" class="page-logger-list" @scroll.stop="onScroll" v-show="showGlobalModal">
    <transition-group name="fade" class="spanModal" style="display: inline-block;">
      <fs-logger-list-item
        v-for="(item, index) in list"
        @handleDelete="handleDelete"
        @handleViewLowerLevel="handleViewLowerLevel"
        @handleOperateModal="handleOperateModal"
        :index="index"
        :isDraft="isDraft"
        :isLowerLevel="isLowerLevel"
        :loggerItemData="item"
        :menus="item.title"
        :key="`${index}global`"
      />
    </transition-group>
    <YYLoadingH v-if="loading" :text="$t('status.loading')"></YYLoadingH>
    <div class="loading">
      <div
        class="loading-content"
        v-if="!hasMore && !loading && list.length"
      >{{$t('status.loadedAllData')}}</div>
    </div>
    <YYEmpty vertical="top" v-if="!list.length && !loading" />
    <!--操作记录弹层-->
    <Modal v-model="operateModal" class="operate-modal" :title="$t('noun.operationRecord')">
      <div class="operate-row" v-for="item in operateModalData" :key="`${item.id}global`">
        <fs-avatar
          class="operate-avatar"
          size="31px"
          :avatar="item.avatar"
          :fontSize="item.userName ? '12px' : '18px'"
          :name="item.userName"
        ></fs-avatar>
        <div class="operate-content">
          <div class="clearfix">
            <span>{{item.userName}}</span>
            <span class="pull-right">{{item.createTime | filterDiaryUserTime}}</span>
          </div>
          <div>{{item.reason}}</div>
        </div>
      </div>
      <p slot="footer"></p>
    </Modal>

    <!-- <canvas class="canvaldialog" id="draw" v-show="isCanval"></canvas> -->
    <div class="tooldialog">
      <div class="fontAdd" :class="{active:isFontAdd}" @click="fontAdd()">
        <!-- <i class="icon-add" ></i> -->
        <YYIcon type="zihaojia"></YYIcon>
      </div>
      <div class="fontReduce" :class="{active:isFontReduce}" @click="fontReduce()">
        <!-- <i class="icon-add" ></i> -->
        <YYIcon type="zihaojian"></YYIcon>
      </div>
      <div class="nodrawing" :class="{active:isCanval}" @click="drawing()">
        <YYIcon type="huabi"></YYIcon>
      </div>
      <ColorPane v-if="isCanval" :color="defaultColor"></ColorPane>

      <div class="exit" :class="{active:isExit}" @click="exit()">
        <i>退出</i>
        <!-- <YYIcon type="touping"></YYIcon> -->
      </div>
    </div>
    <div class="back2top" @click="back2top()" v-if="showBack2Top">
      <!-- <i class="icon-add" ></i> -->
      <YYIcon type="back-to-top"></YYIcon>
    </div>
  </div>
</template>
<script>
import FsLoggerListItem from "./globalModalitem";
import FormatTime from "app_src/filters/format-time";
import FsAvatar from "app_component/common/avatar";
import GlobalModal from "./globalModal";
import pen from "app_assets/images/pen.png";
import ColorPane from "./colorPane";

/**
    range 
    0  所有日志
    4  @我的
    -1 我的日志
    3  内部群日志
    1  下属日志
**/
export default {
  props: {
    params: {
      // 暴露的对象字段
      type: Object
    },
    dataStatus: {
      // 日志查询标记
      type: Number,
      default: 1
    },
    range: {
      type: String,
      default: "0"
    },
    url: {
      type: String,
      default: "/diaryQuery/getAllDiary"
    },
    isCollect: {
      type: Boolean,
      default: false
    },
    isLowerLevel: {
      type: Boolean,
      default: false
    },
    isDraft: {
      type: Boolean,
      default: false
    },
    isUnread: {
      type: Boolean,
      default: false
    },
    withPublic: {
      type: Boolean,
      default: false
    },
    //
    showDatePicker: {
      type: Boolean,
      default: false
    },
    initCreateDate: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      list: [],
      pageNo: 1,
      pageSize: 20,
      loading: false,
      loaderror: false,
      hasMore: true,
      queryMemberId: null,
      operateModal: false,
      operateModalData: null,
      menus: [],
      isExit: false,
      isFontAdd: false,
      isFontReduce: false,
      isCanval: false,
      pen,
      offsetId: "", //设置滚动到第几条
      defaultColor: "#EE2223", //设置默认颜色
      isDrawing: false,
      times: 1.5, //倍数
      showBack2Top: false,
      showGlobalModal: false
    };
  },
  components: {
    FsLoggerListItem,
    FsAvatar,
    GlobalModal,
    ColorPane
  },
  watch: {
    pageNo: "loadData",
    params: "initList",
    withPublic: "initList"
  },
  filters: {
    filterDiaryUserTime(val) {
      // 格式化日志日期
      return FormatTime(new Date(val), "YYYY-MM-DD HH:mm");
    }
  },
  methods: {
    //退出全屏方法
    exitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExiFullscreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
    //打开全屏方法
    openFullscreen(element) {
      if (element) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen();
        }
      }
    },
    handleOperateModal(param) {
      this.operateModal = true;
      this.operateModalData = param;
    },
    getParams() {
      // 获取参数
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        range: this.range,
        withPublic: this.withPublic
      };
      let currentDate = new Date().getTime();
      let beginDate = FormatTime(
        new Date(currentDate - 100 * 24 * 60 * 60 * 1000),
        "YYYY-MM-DD"
      );
      let endDate = FormatTime(new Date(), "YYYY-MM-DD");
      if (
        this.showDatePicker &&
        !this.params.beginDate &&
        !this.params.endDate
      ) {
        data.beginDate = beginDate;
        data.endDate = endDate;
        this.initCreateDate([beginDate, endDate]);
      }
      if (this.isUnread) {
        data.withPublic = this.withPublic;
      }
      if (!this.isCollect) {
        data.dataStatus = this.dataStatus;
      }
      if (this.isLowerLevel) {
        data.memberId = this.queryMemberId;
      }
      return Object.assign(data, this.params);
    },
    debounce(func, wait) {
      return function() {
        let context = this;
        let args = arguments;
        let timeout = sessionStorage.getItem("globalModalTimer");
        if (!!timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
        timeout = sessionStorage.setItem("globalModalTimer", timeout);
      };
    },
    onScroll(e) {
      // 分页
      if (!this.loading && this.hasMore) {
        let $target = e && e.target;
        let scrollHeight = $target.scrollHeight;
        let scrollTop = $target.scrollTop;
        let offsetHeight = $target.offsetHeight;

        if (scrollHeight - scrollTop - offsetHeight < 20 && !this.isCanval) {
          this.pageNo++;
        }
      }
      this.showBack2Top = true;

      let t1 = 0;
      let t2 = 0;
      let _this = this;

      // scroll监听
      function isScrollEnd() {
        t2 = getScrollTop();
        if (t2 === t1) {
          _this.showBack2Top = false;
        }
      }

      function getScrollTop() {
        return document.documentElement.scrollTop || document.body.scrollTop;
      }

      t1 = getScrollTop();
      this.debounce(isScrollEnd, 2000)();
    },
    updateList(res) {
      // load成功之后更新数据
      if (res.groupId && res.groupId !== this.getParams().groupId) return;
      if (res && res.code === 0) {
        this.hasMore = true;
        if (this.pageNo == 1) {
          this.list = res.data || [];
        } else {
          this.list = this.list.concat(res.data || []);
        }
        this.list.forEach(item => {
          let items = JSON.parse(item.content);
          item.title = items;
        });
        if (res.data && res.data.length < this.pageSize) {
          this.hasMore = false;
        }
      } else {
        this.list = [];
        this.$YYMessage.warning(
          (res && res.msg) || this.$t("status.networkError")
        );
      }
    },
    handleDelete(id) {
      // 删除
      if (id) {
        let eq;
        this.list.forEach((item, index) => {
          if (item.id == id || item.draftId === id) {
            eq = index;
          }
        });
        this.list.splice(eq, 1);
      }
    },
    handleViewLowerLevel(id) {
      // 查看下级日志
      this.queryMemberId = id;
      this.initList();
    },
    loadData() {
      // 请求接口
      const id = new Date().valueOf();
      this.loading = true;
      this.$eventbus.$emit("setBtnLoading", this.loading);
      const groupId = this.getParams().groupId || null;
      this.$ajax({
        url: this.url,
        data: this.getParams(),
        success: res => {
          res.groupId = groupId;
          this.loading = false;
          this.$eventbus.$emit("setBtnLoading", this.loading);
          this.updateList(res);
        },
        error: res => {
          this.loaderror = true;
          this.loading = false;
          this.$eventbus.$emit("setBtnLoading", this.loading);
        }
      });
    },
    initList() {
      // 初始化列表
      this.list = [];
      this.pageNo = 1;
      this.loading = false;
      this.hasMore = true;
      this.loadData();
    },
    drawing() {
      // let isDrawing = sessionStorage.getItem('isDrawing')
      this.$eventbus.$emit("opencanvas", this.isCanval, this.defaultColor);
      if (!this.isCanval) {
        this.isExit = false;
        this.isFontAdd = false;
        this.isFontReduce = false;
        this.isCanval = true;
      } else {
        this.isCanval = false;
      }
    },
    fontAdd() {
      // const canvas = document.querySelector('#draw');
      // const ctx = canvas.getContext('2d');
      // ctx.strokeStyle = '#00FF7F';
      this.isExit = false;
      this.isFontAdd = true;
      this.isFontReduce = false;
      this.isCanval = false;
      let loggerItemModals = document.querySelector(".spanModal");
      if (loggerItemModals.style.zoom === "1.8") {
        //2.2
        return;
      }
      if (!!loggerItemModals.style.zoom) {
        loggerItemModals.style.zoom =
          parseFloat(loggerItemModals.style.zoom) + 0.1;
      } else {
        loggerItemModals.style.zoom = parseFloat(this.times) + 0.1;
      }
      this.times = loggerItemModals.style.zoom;
      this.$eventbus.$emit("closeCanvas");
    },
    fontReduce() {
      this.isExit = false;
      this.isFontAdd = false;
      this.isFontReduce = true;
      this.isCanval = false;
      let loggerItemModals = document.querySelector(".spanModal");
      if (loggerItemModals.style.zoom === "1") {
        return;
      }
      if (!!loggerItemModals.style.zoom) {
        loggerItemModals.style.zoom =
          parseFloat(loggerItemModals.style.zoom) - 0.1;
      } else {
        loggerItemModals.style.zoom = parseFloat(this.times) - 0.1;
      }
      this.times = loggerItemModals.style.zoom;
      this.$eventbus.$emit("closeCanvas");
    },
    exit() {
      this.exitFullScreen();
      this.showGlobalModal = false;
      // window.close()
      setTimeout(() => {
        this.isExit = true;
        this.isFontAdd = false;
        this.isFontReduce = false;
        this.isCanval = false;
        this.$eventbus.$emit("closeCanvas");
      }, 1000);
    },
    back2top() {
      this.$el.scrollTop = 0;
    }
  },
  updated() {
    if (this.offsetId !== "") {
      let pageLoggerList = this.$el;
      let firstOffset = this.$el.querySelector(`div[id='${this.offsetId}']`).offsetTop;
      pageLoggerList.scrollTop = firstOffset * this.times;
    }
  },
  mounted() {
    this.queryMemberId = this.$store.state.userInfo.member_id;
    // document.addEventListener('click', (e) => {
    //     this.openFullscreen(document.body)
    // }, false)

    // this.$nextTick(
    //     () => {
    //         e.initEvent("click", true, true);
    //         document.getElementById("globalModal").dispatchEvent(e);
    //     }
    // )
    // // document.getElementById("clickme").dispatchEvent(e);
    // var e = document.createEvent("MouseEvents");
    // e.initEvent("click", true, true);
    // document.getElementById("globalModal").dispatchEvent(e);
    // setTimeout(() => {
    // },10000)
  },
  created() {
    // this.$eventbus.$on('changeDrawing', (isDrawing)=>{
    //     this.isDrawing = isDrawing
    // })
    let _this = this;

    this.$eventbus.$on("openglobal", () => {
      _this.showGlobalModal = true;
      _this.openFullscreen(document.body);
    });
    this.$eventbus.$on("translist", (list, pageNo, pageSize) => {
      _this.list = list;
      _this.pageNo = pageNo;
      _this.pageSize = pageSize;
    });
    this.$eventbus.$on("transid", id => {
      _this.offsetId = id;
    });

    document.addEventListener("fullscreenchange", function() {
      if (document.fullscreenElement != null) {
        console.info("Went full screen");
      } else {
        _this.isCanval = false;
        _this.showGlobalModal = false;
        console.info("Exited full screen");
      }
    });

    this.$eventbus.$on("changeColor", color => {
      this.defaultColor = color;
      this.$eventbus.$emit("changePen", color);
    });

    this.loading = true;
    this.initList();
    // let getMessage = function(e) {
    //   const data = e.data || {};
    //   // 解析data就行
    //   if (data) {
    //     _this.list = data.list ? data.list : [];
    //     _this.pageNo = data.pageNo ? data.pageNo : 1;
    //     _this.pageSize = data.pageSize ? data.pageSize : 20;
    //     _this.offsetId = data.offsetId ? data.offsetId : "";
    //     _this.loading = false;
    //   }
    //   if (_this.list.length === 0) {
    //     _this.initList();
    //   }
    // };
    // window.addEventListener("message", getMessage, false);
    //长时间没有接收到postMessage
    // setTimeout(() => {
    //   if (this.list.length === 0) {
    //   }
    // window.removeEventListener("message", getMessage, false);
    // }, 2000);
  },
  destroyed() {
    this.$eventbus.$off("openglobal");
    this.$eventbus.$off("translist");
    this.$eventbus.$off("transid");
    this.$eventbus.$off("changeColor");
    // this.$eventbus.$off('changeDrawing')
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/css/var.less";
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.page-logger-list {
  padding: 5% 5% 0 5%;
  z-index: 2020;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  height: auto;
  overflow: auto;
  .spanModal {
    // display:inline-block;
    text-align: left;
    zoom: 1.5;
  }
  .loading {
    height: 60px;
    line-height: 50px;
    text-align: center;
    font-size: 14px;
    // background-color: @white-color;
    color: @gray-color-light;
    position: relative;
    overflow: hidden;
    * {
      vertical-align: middle;
      color: @gray-color-light;
    }
    .loading-content {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      left: 0;
    }
  }
  .tooldialog {
    position: fixed;
    top: 0;
    width: 120px;
    right: 0;
    color: #fff;
    padding: 36px;
    font-size: 15px;
    .fontAdd {
      font-size: 22px;
      background: #000;
      opacity: 0.36;
      width: 48px;
      height: 48px;
      color: #fff;
      line-height: 48px;
      text-align: center;
      cursor: pointer;
      border-radius: 3px 3px 0px 0px;
    }
    .fontReduce {
      font-size: 22px;
      background: #000;
      opacity: 0.36;
      width: 48px;
      height: 48px;
      color: #fff;
      line-height: 48px;
      text-align: center;
      cursor: pointer;
      border-radius: 0px 0px 3px 3px;
    }
    .nodrawing {
      font-size: 22px;
      margin-top: 8px;
      background: #000;
      opacity: 0.36;
      width: 48px;
      height: 48px;
      color: #fff;
      line-height: 48px;
      text-align: center;
      cursor: pointer;
      border-radius: 3px;
    }
    .exit {
      font-size: 14px;
      margin-top: 8px;
      background: #000;
      opacity: 0.36;
      width: 48px;
      height: 48px;
      color: #fff;
      line-height: 48px;
      text-align: center;
      cursor: pointer;
      border-radius: 3px;
    }
    .active {
      opacity: 0.5;
    }
  }
  .back2top {
    position: fixed;
    bottom: 36px;
    right: 36px;
    font-size: 22px;
    margin-top: 8px;
    background: #000;
    opacity: 0.36;
    width: 48px;
    height: 48px;
    color: #fff;
    line-height: 48px;
    text-align: center;
    cursor: pointer;
    border-radius: 3px;
  }
  // .canvaldialog{
  //     display: block;
  //     position: absolute;
  //     top:0;
  //     bottom:0;
  //     left: 0;
  //     right: 0;
  // }
}
</style>

