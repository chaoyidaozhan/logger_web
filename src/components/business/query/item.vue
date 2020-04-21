<template>
  <div class="logger-item" :id="loggerItemData.id + '' + index" @mouseenter="setLocation(index)">
    <div class="logger-content-item" @mouseleave="closeMenu()">
      <div class="leftMenu">
      </div>
      <div class="logger-list-item" ref="loggerListItem" @mouseenter="showMenu()">
        <!-- @mouseenter="showMenu()"> -->
        <!--当前人信息-->
        <div class="logger-list-row clearfix logger-list-user">
          <fs-avatar
            class="avatar"
            size="40px"
            :avatar="loggerItemData.avatar"
            :name="loggerItemData.userName"
            :fontSize="loggerItemData.userName ? '14px' : '20px'"
          />
          <div class="logger-list-col clearfix">
            <span class="username">{{loggerItemData.userName}}</span>
            <span class="template-name" v-if="loggerItemData.templateName">
              <i>{{filterEncode(loggerItemData.templateName)}}</i>
            </span>
            <span
              class="template-name"
              style="background:rgba(238,34,35,0.08);border-radius:5px;color:rgba(238,34,35,1);"
              v-if="Math.abs(loggerItemData.diaryTime - loggerItemData.createTime) > 1000 * 60 * 60 * 48"
            >
              <i>{{$t('operate.fill')}}</i>
            </span>
            <i
              class="view-lower-level"
              v-if="isLowerLevel && !!loggerItemData.hasSubordinate"
              @click="handleViewLowerLevel"
            >{{$t('operate.viewLowerLevelLog')}}</i>
            <div class="pull-right">
              <span class="time">{{loggerItemData.createTime | filterDiaryUserTime}}</span>
              <span class="data-type">{{dataSource[loggerItemData.dataType || 0]}}</span>
              <Poptip placement="bottom-end" width="70">
                <ul class="operate-tips" slot="content">
                  <li
                    class="cursor-pointer"
                    @click="handleEdit"
                    v-if="userInfo.member_id == loggerItemData.memberId"
                  >{{$t('operate.edit')}}</li>
                  <li
                    class="cursor-pointer"
                    @click="handleDelete"
                    v-if="(userInfo.member_id == loggerItemData.memberId) || userInfo.admin"
                  >{{$t('operate.delete')}}</li>
                  <li
                    class="cursor-pointer"
                    @click="handlePrint"
                    v-if="((userInfo.member_id == loggerItemData.memberId) || userInfo.admin) && (this.$route.path != '/DraftOfMine')"
                  >{{$t('operate.print')}}</li>
                  <li
                    class="cursor-pointer"
                    v-if="this.$route.path != '/DraftOfMine'"
                    @click="handleOperate"
                  >{{$t('operate.operationRecord')}}</li>
                </ul>
                <span class="operate cursor-pointer">
                  <i class="icon-more"></i>
                </span>
              </Poptip>
            </div>
          </div>
        </div>
        <!--可见范围-->
        <div class="logger-list-row logger-list-range">
          <div
            class="logger-list-col"
            :class="{'ellipsis': (!rangeExpand && rangeRealHeight > rangeDefaultHeight)}"
            :style="{'height': `${rangeHeight}px` }"
            ref="rangeHeight"
          >
            {{renderRange(loggerItemData)}}
            <span
              v-if="rangeRealHeight > rangeDefaultHeight"
              class="expand cursor-pointer"
              @click="handleRangeExpand"
            >
              <Icon v-if="rangeExpand" type="chevron-up"></Icon>
              <Icon v-else type="chevron-down"></Icon>
            </span>
          </div>
        </div>
        <div class="loggerlistcontent">
          <!-- 控制展开收起 -->
          <div
            class="handle-content-expand"
            ref="contentHeight"
            :style="{'height': `${contentHeight}px` }"
          >
            <div class="logger-list-row logger-list-time" v-if="loggerItemData.diaryTimeStatus">
              <div class="logger-list-col">
                <div class="title-date outer-title">{{$t('noun.logDate')}}:</div>
                <div class="caption-date">{{loggerItemData.diaryTime | filterDiaryTime}}</div>
              </div>
            </div>
            <!--具体内容-->
            <template v-if="typeof JSON.parse(loggerItemData.content) === 'object'">
              <logger-list-content-node
                v-for="(item, index) in JSON.parse(loggerItemData.content)"
                :data="item"
                :key="item.id + index"
                :filterEncode="filterEncode"
              />
            </template>
            <template v-else>
              <logger-list-content-node
                :data="JSON.parse(loggerItemData.content)"
                :filterEncode="filterEncode"
              />
            </template>

            <!--具体内容-->
            <div class="logger-list-row logger-list-content">
              <div class="logger-list-col logger-at">
                <span
                  class="at"
                  v-for="(item, index) in loggerItemData.at"
                  :key="item.id + index"
                >@{{item.replayUserName}}</span>
              </div>
            </div>

            <!-- 附件 -->
            <div class="logger-list-row logger-list-attach">
              <div class="logger-list-col">
                <fs-images
                  :images="loggerItemAttachs.imgs"
                  v-if="loggerItemAttachs.imgs && loggerItemAttachs.imgs.length"
                ></fs-images>
                <fs-files
                  :files="loggerItemAttachs.files"
                  v-if="loggerItemAttachs.files && loggerItemAttachs.files.length"
                ></fs-files>
              </div>
            </div>
          </div>
        </div>
        <div
          class="loggerDialog"
          v-show="contentRealHeight > contentDefaultHeight && contentDefaultHeight && !contentExpand"
        ></div>
        <div class="loggerExpand">
          <div class="logger-list-row handle-content-expand-btn">
            <div
              class="logger-list-col logger-open-close"
              v-if="contentRealHeight > contentDefaultHeight && contentDefaultHeight"
            >
              <span
                class="cursor-pointer more"
                @click="handleContentExpand"
                v-if="!contentExpand"
              >{{$t('operate.expand')}}</span>
              <span
                class="cursor-pointer more"
                @click="handleContentExpand"
                v-else
              >{{$t('operate.collapse')}}</span>
            </div>
            <div class="logger-list-col logger-list-location logger-list-watcher" v-if="!isDraft">
              <Poptip
                v-if="loggerItemData.readCount"
                @on-popper-show="getAllMembers"
                placement="right-end"
              >
                <div slot="content">
                  <div
                    class="avatar-container"
                    v-for="(item, index) in members"
                    :key="item.id + index"
                  >
                    <fs-avatar
                      class="avatar member-card"
                      size="40px"
                      :avatar="item.avatar"
                      :name="item.userName"
                      :fontSize="item.userName ? '14px' : '20px'"
                    />
                    <span class="username">{{item.userName || ''}}</span>
                  </div>
                </div>
                <div class="count" v-if="loggerItemData.readCount">
                  <div class="imageCount">
                    <img
                      v-show="!!loggerItemData && !!loggerItemData.readLog[2]"
                      style="z-index:3"
                      class="count-img"
                      :src="!!loggerItemData && !!loggerItemData.readLog[2] && loggerItemData.readLog[2].avatar"
                    />
                    <img
                      v-show="!!loggerItemData && !!loggerItemData.readLog[1]"
                      style="z-index:2"
                      class="count-img"
                      :src="!!loggerItemData && !!loggerItemData.readLog[1] && loggerItemData.readLog[1].avatar"
                    />
                    <img
                      v-show="!!loggerItemData && !!loggerItemData.readLog[0]"
                      style="z-index:1"
                      class="count-img"
                      :src="!!loggerItemData && !!loggerItemData.readLog[0] && loggerItemData.readLog[0].avatar"
                    />
                    <span>{{loggerItemData.readCount}}{{$t('noun.peopleHaveSeen')}}</span>
                    <YYIcon type="arrow-right"></YYIcon>
                  </div>
                </div>
              </Poptip>
              <div class="count" v-else>
                <span>{{loggerItemData.readCount}}{{$t('noun.peopleHaveSeen')}}</span>
                <!-- <i class="icon-chat-normal"></i> -->
                <!-- <YYIcon type="arrow-right"></YYIcon> -->
              </div>
              <div class="logger-list-col mb-flex mb-flex-align-center">
                <div
                  class="operate-item"
                  :class="{active: loggerItemData.like.isLike}"
                  @click="handleLike"
                >
                  <div
                    class="icon-position mb-flex mb-flex-align-center"
                    v-if="!loggerItemData.like.isLike"
                  >
                    <div>
                      <YYIcon type="zan" style="margin-right:7px"></YYIcon>
                    </div>
                    <div
                      class="word"
                    >{{loggerItemData.like && loggerItemData.like.likeNum === 0 ? $t('operate.like') : loggerItemData.like.likeNum}}</div>
                  </div>
                  <div
                    class="icon-position mb-flex mb-flex-align-center"
                    style="color:#EE2223"
                    v-else
                  >
                    <div>
                      <YYIcon type="thumb-up" style="margin-right:7px"></YYIcon>
                    </div>
                    <div
                      class="word"
                    >{{loggerItemData.like && loggerItemData.like.likeNum === 0 ? $t('operate.like') : loggerItemData.like.likeNum}}</div>
                  </div>
                </div>
                <div
                  class="operate-item"
                  :class="{active: loggerItemData.favorite.isFavorite}"
                  @click="handleCollect"
                >
                  <div
                    class="icon-position mb-flex mb-flex-align-center"
                    v-if="!loggerItemData.favorite.isFavorite"
                  >
                    <div>
                      <YYIcon type="xingxing-kong" style="margin-right:7px"></YYIcon>
                    </div>
                    <div
                      class="word"
                    >{{loggerItemData.favorite && loggerItemData.favorite.favoriteNum === 0 ? $t('operate.favorite') : loggerItemData.favorite.favoriteNum}}</div>
                  </div>
                  <div class="icon-position mb-flex mb-flex-align-center" v-else>
                    <div>
                      <YYIcon type="xingxing-quan" style="color:#FF8B00;margin-right:7px"></YYIcon>
                    </div>
                    <div
                      class="word"
                    >{{loggerItemData.favorite && loggerItemData.favorite.favoriteNum === 0 ? $t('operate.favorite') : loggerItemData.favorite.favoriteNum}}</div>
                  </div>
                </div>
                <div class="operate-item" :class="{active: showReply}" @click="handleReply">
                  <div class="icon-position mb-flex mb-flex-align-center" v-if="!showReply">
                    <div style="height:14px">
                      <YYIcon type="message-square" style="margin-right:7px"></YYIcon>
                    </div>
                    <div
                      class="word"
                    >{{loggerItemData.commentNum === 0 ? $t('operate.comment') : loggerItemData.commentNum }}</div>
                  </div>
                  <div class="icon-position mb-flex mb-flex-align-center" v-else>
                    <div style="height:14px">
                      <YYIcon type="message-square" style="margin-right:7px"></YYIcon>
                    </div>
                    <div
                      class="word"
                    >{{loggerItemData.commentNum === 0 ? $t('operate.comment') : loggerItemData.commentNum }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="logger-list-col logger-list-location logger-list-closewatcher" v-else>
            </div>
          </div>
          <div class="logger-list-row">
            <!-- <div class="logger-list-col logger-list-location">
                            <Poptip
                                v-if="loggerItemData.readCount"
                                @on-popper-show="getAllMembers"
                                placement="right-end">
                                <div slot="content">
                                    <div 
                                        class="avatar-container"
                                        v-for="(item, index) in members"
                                        :key="index">
                                        <fs-avatar
                                            class="avatar member-card"
                                            size="40px"
                                            :avatar="item.avatar" 
                                            :name="item.userName"
                                            :fontSize="item.userName ? '14px' : '20px'" 
                                        />
                                        <span class="username">{{item.userName || ''}}</span>
                                    </div>
                                </div>
                                <div class="count">{{loggerItemData.readCount}}{{$t('noun.peopleHaveSeen')}}</div>
                            </Poptip>
                            <div class="count" v-else>{{loggerItemData.readCount}}{{$t('noun.peopleHaveSeen')}}</div>
            </div>-->
          </div>
          <div class="logger-list-row" v-if="!!loggerItemData.location">
            <div class="logger-list-col logger-list-location">
              <Icon type="ios-location"></Icon>
              {{loggerItemData.location}}
            </div>
          </div>
          <div class="lat"></div>
          <!--点赞回复收藏-->
          <div class="logger-list-row logger-list-operate">
            <!-- <div class="logger-list-col">
                            <span class="operate-item" :class="{active: loggerItemData.like.isLike}" @click="handleLike">
                                <i class="icon-position" v-if="!loggerItemData.like.isLike">
                                    <YYIcon type="zan"></YYIcon>
                                    {{loggerItemData.like && loggerItemData.like.likeNum === 0 ? '赞' : loggerItemData.like.likeNum}}
                                </i>
                                <i class="icon-position" style="color:#EE2223" v-else>
                                    <YYIcon type="thumb-up"></YYIcon>
                                    {{loggerItemData.like && loggerItemData.like.likeNum === 0 ? '赞' : loggerItemData.like.likeNum}}
                                </i>
                            </span>
                            <span class="operate-item" style="margin-top:12px" :class="{active: showReply}" @click="handleReply">
                                <i class="icon-position" v-if="!showReply">
                                    <YYIcon type="message-square"></YYIcon>
                                    {{loggerItemData.commentNum === 0 ? '评论' : loggerItemData.commentNum }}
                                </i>
                                <i class="icon-position" v-else>
                                    <YYIcon type="message-square"></YYIcon>
                                    {{loggerItemData.commentNum === 0 ? '评论' : loggerItemData.commentNum }}
                                </i>
                            </span>
                            <span class="operate-item" style="margin-top:12px" :class="{active: loggerItemData.favorite.isFavorite}" @click="handleCollect">
                                <i class="icon-position" v-if="!loggerItemData.favorite.isFavorite">
                                    <YYIcon type="xingxing-kong"></YYIcon>
                                    {{loggerItemData.favorite && loggerItemData.favorite.favoriteNum === 0 ? '收藏' : loggerItemData.favorite.favoriteNum}}
                                </i>
                                <i class="icon-position" v-else>
                                    <YYIcon type="xingxing-quan" style="color:#FF8B00"></YYIcon>
                                    {{loggerItemData.favorite && loggerItemData.favorite.favoriteNum === 0 ? '收藏' : loggerItemData.favorite.favoriteNum}}
                                </i>
                            </span> 
            </div>-->
          </div>
          <div class="logger-list-row">
            <div class="logger-list-col">
              <fs-reply
                v-if="showReply"
                @handleReplyNum="handleReplyNum"
                :dailyId="loggerItemData.id"
              />
            </div>
          </div>
          <div class="line" v-if="!loggerItemData.islast"></div>
        </div>
        <div v-if="this.isShowMenu" class="borderStyle">
          <!-- <div class="topLine"></div>
          <div class="bottomLine"></div>-->
          <div class="leftLine"></div>
          <!-- <div class="rightLine"></div> -->
        </div>
      </div>
      <!--点赞回复收藏isShowMenu isInternalGroupReport-->
      <div class="logger-list-vertical-operate">
        <!-- v-show="isShowMenu && !isInternalGroupReport" -->
        <div class="leftMenuBox" v-show="isShowMenu">
          <div class="left-header" @click="back2Logger()">
            {{loggerItemData.userName + $t('title.workReports')}}
            <div class="left-close"></div>
          </div>
          <div class="left-line"></div>
          <div class="left-content">
            <div
              class="left-item"
              v-for="(item, index) in menus"
              :key="item.id + index"
              @click="back2Title($event, item)"
            >
              <span class="left-words">{{item.title}}</span>
            </div>
          </div>
        </div>
        <!-- <div class="logger-list-vertical-operate-menu"  v-show="isShowMenu"> -->
        <!-- <div class="operate-item" :class="{active: loggerItemData.like.isLike}" @click="handleLike">
                        <i class="icon-position" v-if="!loggerItemData.like.isLike">
                            <YYIcon type="zan"></YYIcon>
                        </i>
                        <i class="icon-position" style="color:#EE2223" v-else>
                            <YYIcon type="thumb-up"></YYIcon>
                        </i>
                    </div>
                    <div class="operate-item" style="margin-top:12px" :class="{active: showReply}" @click="handleReply">
                        <i class="icon-position" v-if="!showReply">
                            <YYIcon type="message-square"></YYIcon>
                        </i>
                        <i class="icon-position" v-else>
                            <YYIcon type="message-square"></YYIcon>
                        </i>
                    </div>
                    <div class="operate-item" style="margin-top:12px" :class="{active: loggerItemData.favorite.isFavorite}" @click="handleCollect">
                        <i class="icon-position" v-if="!loggerItemData.favorite.isFavorite">
                            <YYIcon type="xingxing-kong"></YYIcon>
                        </i>
                        <i class="icon-position" v-else>
                            <YYIcon type="xingxing-quan" style="color:#FF8B00"></YYIcon>
                        </i>
        </div>-->
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import FormatTime from "app_src/filters/format-time";
import FsAvatar from "app_component/common/avatar/";
import FsReply from "app_component/common/reply/";
import HTMLDeCode from "app_src/filters/HTMLDeCode";
import FsFiles from "./file";
import FsImages from "./image";
import LoggerListContentNode from "./content";
// import treeNode from './tree-recursive'

const contentHeight = 24;
export default {
  props: {
    loggerItemData: {
      type: Object
    },
    index: {
      type: Number
    },
    isDraft: {
      type: Boolean,
      default: false
    },
    isLowerLevel: {
      type: Boolean,
      default: false
    },
    menus: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      dataSource: [
        this.$t("noun.other"),
        this.$t("noun.dailyReport"),
        this.$t("noun.weeklyReport"),
        this.$t("noun.monthlyReport"),
        this.$t("noun.other")
      ],

      rangeHeight: "",
      rangeRealHeight: "",
      rangeDefaultHeight: 26,
      rangeExpand: false,

      contentHeight: "",
      contentRealHeight: "",
      contentDefaultHeight: contentHeight * 8 - 2,
      contentExpand: false,

      userInfo: this.$store.state.userInfo,

      showReply: false,
      editTimer: null,
      members: null,
      isShowMenu: false,
      loggerItem: null, //记录该item
      isInternalGroupReport: false //是否是内部群汇报
    };
  },
  components: {
    FsAvatar,
    FsReply,
    FsFiles,
    FsImages,
    LoggerListContentNode
    // treeNode
  },
  filters: {
    filterDiaryTime(val) {
      // 格式化日志日期
      let timezone = 8, // 东八区
        offsetGMT = new Date().getTimezoneOffset(), // 本地时间和格林威治的时间差，单位为分钟
        nowDate = new Date(val).getTime(), // 日志时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
        targetDate = new Date(
          nowDate + offsetGMT * 60 * 1000 + timezone * 60 * 60 * 1000
        );
      return FormatTime(new Date(targetDate), "YYYY-MM-DD");
    },
    filterDiaryUserTime(val) {
      // 格式化日志日期
      return FormatTime(new Date(val), "YYYY-MM-DD HH:mm");
    },
    filterCommentNum(val) {
      // 回复数量小于0
      let num = val < 0 ? 0 : val;
      return num;
    }
  },
  computed: {
    data() {
      return this.loggerItemData;
    },
    loggerItemAttachs() {
      // 目前仅图片和文件类型
      let attachList = {
        imgs: [],
        files: []
      };
      let imgTypeArr = [
        ".jpg",
        ".jpeg",
        ".png",
        ".pic",
        ".gif",
        ".bmp",
        ".svg",
        ".raw"
      ];
      this.loggerItemData.fileStr.forEach(item => {
        imgTypeArr.indexOf(item.fileExtension) >= 0
          ? attachList.imgs.push(item)
          : attachList.files.push(item);
      });
      return attachList;
    }
  },
  methods: {
    getAllMembers() {
      this.$ajax({
        url: `/diaryReadLog/getDiaryReadLogList/${this.loggerItemData.id}`,
        success: res => {
          if (res && res.code == 0) {
            this.members = res.data || [];
          }
        }
      });
    },
    setRangeHeight() {
      // 设置可展开的高度
      this.rangeRealHeight =
        this.$refs.rangeHeight && this.$refs.rangeHeight.offsetHeight;
      this.contentRealHeight =
        this.$refs.contentHeight && this.$refs.contentHeight.offsetHeight;
      this.rangeHeight = this.rangeDefaultHeight;
      if (this.contentRealHeight > this.contentDefaultHeight) {
        this.contentHeight = this.contentDefaultHeight;
      } else {
        this.contentHeight = this.contentRealHeight;
      }
    },
    filterEncode(val) {
      return typeof val == "string"
        ? val
          ? HTMLDeCode(val.replace(/\n/g, "<br>"))
          : ""
        : val;
    },
    handleViewLowerLevel() {
      this.$emit("handleViewLowerLevel", this.loggerItemData.memberId);
    },
    renderRange(loggerItemData) {
      // 可见范围控制
      let range = loggerItemData.range;
      let str = `${this.$t("noun.visibleTo")}：`;
      if (!range.length) {
        if (loggerItemData.visibleRange === 0) {
          str += `${this.$t("noun.public")}`;
        } else if (loggerItemData.visibleRange === 2) {
          str += `${this.$t("noun.private")}`;
        } else {
          str = "";
        }
      } else {
        range.forEach(item => {
          switch (+item.dataType) {
            case 1:
              if (item.teamName) {
                str += `${item.teamName} `;
              } else {
                if (this.$store.state.userInfo.dept_id === 0) {
                  str += `${item.spaceName} `;
                }
              }
              break;
            case 4:
              if (item.userName) {
                str += `${item.userName} `;
              }
              break;
            case 3:
              if (item.teamName) {
                str += `${item.teamName} `;
              }
          }
        });
      }

      return str;
    },
    handleCollect(e) {
      // 收藏
      e.stopPropagation();
      let uri = this.loggerItemData.favorite.isFavorite
        ? "/favorite/delete"
        : "/favorite/add";

      this.loggerItemData.favorite.isFavorite = !!this.loggerItemData.favorite
        .isFavorite
        ? 0
        : 1;
      if (this.loggerItemData.favorite.isFavorite) {
        this.loggerItemData.favorite.favoriteNum += 1;
      } else {
        this.loggerItemData.favorite.favoriteNum -= 1;
      }
      this.$ajax({
        url: uri,
        type: "post",
        data: {
          diaryId: this.loggerItemData.id
        },
        requestBody: true,
        success: res => {
          if (res && res.code == 0) {
            // this.loggerItemData.favorite = res.data
            // if(this.loggerItemData.favorite) {
            //     if(this.$parent.$parent.isFavorite) {
            //         this.$parent.$parent.list.splice(this.index ,1)
            //     }
            // }
            this.sendHasReadBrand();
          }
        },
        error: res => {
          this.$YYMessage.warning(this.$t("toast.operationFailed"));
        }
      });
    },
    handleLike(e) {
      // 点赞
      e.stopPropagation();
      this.loggerItemData.like.isLike = !!this.loggerItemData.like.isLike
        ? 0
        : 1;
      if (this.loggerItemData.like.isLike) {
        this.loggerItemData.like.likeNum += 1;
      } else {
        this.loggerItemData.like.likeNum -= 1;
      }

      this.$ajax({
        url: `/diaryLike/${this.loggerItemData.id}`,
        type: "post",
        requestBody: true,
        success: res => {
          this.sendHasReadBrand();
        },
        error: res => {
          this.$YYMessage.warning(this.$t("toast.operationFailed"));
        }
      });
    },
    sendHasReadBrand() {
      // 未读情况发送已读标记
      let root = this.$route.path;
      if (!this.loggerItemData.isRead) {
        this.$ajax({
          url: `/diaryReadLog/add`,
          type: "post",
          requestBody: 1,
          data: {
            diaryId: this.loggerItemData.id
          },
          success: res => {
            if (res && res.code == 0) {
              this.loggerItemData.readCount++;
              this.loggerItemData.isRead = 1;
              this.$eventbus.$emit("getUnreadCount");
            }
          }
        });
      }
    },
    handleRangeExpand() {
      // 范围展开操作
      this.rangeExpand = !this.rangeExpand;
      if (this.rangeExpand) {
        this.rangeHeight = this.rangeRealHeight;
      } else {
        this.rangeHeight = this.rangeDefaultHeight;
      }
    },
    handleContentExpand() {
      // 全文展开操作
      this.contentExpand = !this.contentExpand;
      if (this.contentExpand) {
        this.sendHasReadBrand();
      }
      if (this.contentExpand) {
        this.contentHeight = this.contentRealHeight;
      } else {
        this.contentHeight = this.contentDefaultHeight;
      }

      let loggerDialog = this.$el.querySelector(".loggerDialog");
      if (this.contentExpand) {
        loggerDialog.style.backgroundImage = "";
      } else {
        loggerDialog.style.backgroundImage =
          "linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.9) 50%,rgba(255,255,255,1) 100%)";
        let pageContent = document.querySelector(".page-logger-content");
        if (this.$el.offsetHeight > pageContent.offsetHeight) {
          let pageLoggerList = document.querySelector(".page-logger-list");
          pageLoggerList.scrollTop = this.$el.offsetTop;
        }
      }
    },
    handleEdit() {
      clearTimeout(this.editTimer);
      this.editTimer = setTimeout(() => {
        const id =
          this.$route.path == "/DraftOfMine"
            ? this.loggerItemData.draftId
            : this.loggerItemData.id;
        this.$store
          .dispatch("update_template_content", {
            //登录成功更新store
            content: this.loggerItemData
          })
          .then(() => {
            this.$router.push({
              path: `LoggerDetail/operate/${
                this.$route.path == "/DraftOfMine" ? "draft" : "edit"
              }/${id}`,
              query: {
                token: this.$store.state.userInfo.token
              }
            });
          });
      }, 400);
    },
    handleDelete() {
      // 删除
      this.$YYModal.show({
        title: this.$t("toast.deleteLogPrompt"),
        content: this.$t("toast.clickOKToDeleteTheLog"),
        onOk: res => {
          let params = {
            id: this.loggerItemData.id || null
          };
          if (this.loggerItemData.draftId) {
            params = {
              draftId: this.loggerItemData.draftId || null
            };
          }
          this.$ajax({
            url: `/diary/`,
            type: "delete",
            data: params,
            success: res => {
              if (res && res.code == 0) {
                this.$YYMessage.success(this.$t("toast.successfullyDeleted"));
                this.$emit(
                  "handleDelete",
                  this.loggerItemData.draftId || this.loggerItemData.id
                );
              }
            },
            error: res => {
              this.$YYMessage.error(
                (res && res.msg) || this.$t("status.networkError")
              );
            }
          });
        }
      });
    },
    handlePrint() {
      // 打印
      window.print();
    },
    handleOperate() {
      // 操作记录
      this.$ajax({
        url: `/diaryOpeationLoggers/${this.loggerItemData.id}`,
        success: res => {
          if (res && res.code == 0) {
            this.$emit("handleOperateModal", res.data || []);
          }
        },
        error: res => {
          this.sendHasReadBrand();
          this.$YYMessage.error(
            (res && res.msg) || this.$t("status.networkError")
          );
        }
      });
    },
    handleReply() {
      // 回复
      this.showReply = !this.showReply;
    },
    handleReplyNum(type) {
      if (type) {
        this.loggerItemData.commentNum += 1;
      } else {
        this.loggerItemData.commentNum -= 1;
      }
    },
    setLocation(index) {
      this.$eventbus.$emit("transid", this.loggerItemData.id + '' + index);
    },
    showMenu() {
      //显示左右两边菜单
      this.loggerItem = this.$el;
      this.isShowMenu = true;
      let pageLoggerList = document.querySelector(".page-logger-list");
      let loggerListItem = this.$el.querySelector(".logger-list-item");
      // loggerListItem.style.border = '1px dashed #18B681'

      let itemScrollTop = pageLoggerList.scrollTop;
      // let leftMenuBox = this.$el.querySelector('.leftMenuBox')
      // if(window.innerWidth <= 1250){
      //     leftMenuBox.style.top = pageLoggerList.scrollTop-this.$el.offsetTop + 10 + 'px'
      // }

      // if(leftMenuBox) {
      //     if(itemScrollTop - this.$el.offsetTop > 0){
      //         leftMenuBox.style.marginTop = itemScrollTop - this.$el.offsetTop + 10 + 'px'
      //     }else{
      //         leftMenuBox.style.marginTop = 0
      //     }
      // }
    },
    closeMenu() {
      //关闭左右两边菜单
      this.isShowMenu = false;
      let loggerListItem = this.$el.querySelector(".logger-list-item");
      loggerListItem.style.border = "";
    },
    // 返回工作汇报
    back2Logger() {
      let pageLoggerList = document.querySelector(".page-logger-list");
      pageLoggerList.scrollTop = this.loggerItem.offsetTop;
    },
    //返回工作汇报的当前title
    back2Title(event, item) {
      //显示菜单样式
      this.$el.querySelectorAll(".left-item").forEach(event => {
        event.style.background = "";
        event.style.color = "";
        event.style.fontWeight = "";
        event.style.marginRight = "";
      });

      let leftWords = event.currentTarget.querySelector(".left-words");
      let rightWidth =
        this.$el.querySelector(".leftMenuBox").offsetWidth -
        leftWords.offsetWidth -
        12 -
        12 -
        16;
      event.currentTarget.style.background = "#F6F6F6";
      event.currentTarget.style.color = "#333333";
      event.currentTarget.style.fontWeight = "550";
      event.currentTarget.style.borderRadius = "0px 16px 16px 0px";
      event.currentTarget.style.marginRight = rightWidth + "px";

      if (!this.contentExpand) {
        this.handleContentExpand();
      }
      this.$nextTick(() => {
        let _this = this;
        let pageLoggerList = document.querySelector(".page-logger-list");
        pageLoggerList.scrollTop = this.loggerItem.offsetTop;
        this.$el.querySelectorAll(".title").forEach(e => {
          if (e.innerText === item.title && e.id === item.id.toString()) {
            let pageContent = document.querySelector(".page-logger-content");
            // if(e.offsetTop > pageContent.offsetHeight){
            let pageLoggerList = document.querySelector(".page-logger-list");
            pageLoggerList.scrollTop = e.offsetTop + _this.$el.offsetTop - 20;
            // }

            _this.$el.querySelectorAll(".mark-title").forEach(e => {
              if (e.id === item.id.toString()) {
                e.style.transition = "";
                e.style.background = "#FAFAFA";
                if (!!e.nextElementSibling) {
                  let loggerListChildren = e.nextElementSibling;
                  loggerListChildren.style.transition = "";
                  loggerListChildren.style.background = "#FAFAFA";
                }
                setTimeout(() => {
                  e.style.background = "";
                  e.style.transition = "background 2s";
                  if (!!e.nextElementSibling) {
                    let loggerListChildren = e.nextElementSibling;
                    loggerListChildren.style.background = "";
                    loggerListChildren.style.transition = "background 2s";
                  }
                }, 3000);
              } else {
                e.style.background = "";
              }
            });
          }
        });

        event.stopPropagation();
      });
    }
  },
  mounted() {
    let loggerList = this.$el.querySelector(".logger-list-item");

    //根据设计js调整width大小
    if (window.innerWidth > 1200 && window.innerWidth < 1920) {
      loggerList.style.width =
        768 + ((window.innerWidth - 1200) * 256) / 720 + "px";
    }

    //判断是否是内部群
    if (this.$route.path === "/LoggerQueryGroup") {
      this.isInternalGroupReport = true;
    }
    this.$nextTick(() => {
      this.setRangeHeight();
      let loggerDialog = this.$el.querySelector(".loggerDialog");
      if (
        !(
          this.contentRealHeight > this.contentDefaultHeight &&
          this.contentDefaultHeight
        )
      ) {
        loggerDialog.style.backgroundImage = "";
      } else {
        loggerDialog.style.backgroundImage =
          "linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.9) 50%,rgba(255,255,255,1) 100%)";
      }
    });

    //通过js改变leftMenu样式
    let pageLoggerList = document.querySelector(".logger-frame-scroller");
    // let leftMenuBox = document.querySelectorAll('.leftMenuBox')
    let loggerContent = document.querySelector(".logger-content-item");
    let loggerOperates = document.querySelectorAll(
      ".logger-list-vertical-operate"
    );
    // if(window.innerWidth > 1439){
    //     leftMenus.forEach((leftMenu) => {
    //         leftMenu.style.width = (loggerContent.offsetWidth - loggerList.offsetWidth)/2 + 'px'
    //     })
    //     loggerOperates.forEach((loggerOperate)=>{
    //         loggerOperate.style.right = (loggerContent.offsetWidth - loggerList.offsetWidth)/2 - 56 + 'px'
    //     })
    // }else{
    //     pageLoggerList.style.width = loggerList.offsetWidth + 188 * 2 + 'px'
    // }

    this.$eventbus.$on("changeLeftMenuScroll", () => {
      let pageLoggerList = document.querySelector(".page-logger-list");
      let leftMenuBox = this.$el.querySelector(".leftMenuBox");
      // if(window.innerWidth <= 1250){
      //     leftMenuBox.style.top = pageLoggerList.scrollTop-this.$el.offsetTop + 10 + 'px'
      // }
    });
    window.onresize = function() {
      //通过js改变leftMenu样式
      // let pageLoggerList = document.querySelector('.logger-frame-scroller')
      // let leftMenus = document.querySelectorAll('.leftMenu')
      // let loggerContent = document.querySelector('.logger-content-item')
      // let loggerOperates = document.querySelectorAll('.logger-list-vertical-operate')
      // if(window.innerWidth > 1439){
      //     leftMenus.forEach((leftMenu) => {
      //         leftMenu.style.width = (loggerContent.offsetWidth - loggerList.offsetWidth)/2 + 'px'
      //     })
      //     loggerOperates.forEach((loggerOperate)=>{
      //         loggerOperate.style.right = (loggerContent.offsetWidth - loggerList.offsetWidth)/2 - 56 + 'px'
      //     })
      // }else{
      //     pageLoggerList.style.width = loggerList.offsetWidth + 188 * 2 + 'px'
      // }
    };
  },
  destroyed() {
    this.$eventbus.$off("changeLeftMenuScroll");
  }
};
</script>
<style lang="less">
@import "~app_assets/css/var.less";
@rowMarginBottom: 14px;
@titleMarginBottom: 4px;

// @media screen and (min-width: 1250px) {
//     .leftMenu{
//         flex:1 !important;
//         .leftMenuBox{
//             position: fixed !important;
//             top: 70px !important;
//             height: 100% !important;
//             padding: 6px 16px 8px 16px !important;
//             z-index: 2020 !important;
//             width: 13% !important;
//         }
//     }
// }

.logger-item {
  .logger-content-item {
    position: relative;
    display: inline-block;
    min-width: 1040px;
    display: flex;
    .logger-list-item {
      flex: 1;
      // margin-left: 188px;
      margin: 0 auto;
      background-color: #fff;
      overflow: hidden;
      min-width: 70%;
      @media screen and (min-width: 1920px) {
        max-width: 1197px;
      }
      @media screen and (max-width: 1200px) {
        min-width: 720px;
      }
      // margin: auto;
      // float: left;
      padding: 32px 32px 0 32px;
      position: relative;
      // background-image: linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.8),rgba(255,255,255,1));
      // background-color: @white-color;
      color: @gray-color-light;
      font-size: 14px;
      &.fade-enter {
        transition: 0.2s ease opacity;
        opacity: 0;
      }
      &.fade-enter-in {
        opacity: 1;
      }
      // &:after {
      //     position: absolute;
      //     left: 74px;
      //     height: 1px;
      //     right: 20px;
      //     bottom: 0;
      //     content: '';
      //     background-color: @border-color-base;
      // }
      .logger-list-row {
        line-height: 24px;
        word-break: break-all;
        .logger-content {
          padding: 16px 24px;
        }
        &.logger-list-time {
          margin-bottom: 12px;
          .title {
            margin-bottom: @titleMarginBottom;
          }
        }
        .username {
          color: #111;
        }
        .avatar {
          float: left;
          &.member-card {
            margin: 5px;
          }
        }
        .avatar-container {
          float: left;
          text-align: center;
          width: 50px;
          .avatar {
            float: none;
          }
          .username {
            display: block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .logger-at {
          margin-left: 78px !important;
        }
        .logger-list-col {
          margin-left: 54px;
          .logger-content {
            padding: 16px 24px;
          }
          .title {
            // font-family: "PingFangSC-Medium"
            margin-bottom: 6px;
            color: #333;
            font-weight: 500;
            display: inline-block;
          }
          .title-date {
            display: inline-block;
            font-size: 13px;
            color: #333;
          }
          .outer-title {
            margin-left: 24px;
          }
          .caption-date {
            display: inline-block;
            font-size: 13px;
            color: @gray-color-medium;
          }
          .caption {
            text-align: justify;
            font-size: 13px;
            color: #333;
          }
          .at {
            color: #289cf2;
            display: inline-block;
            margin-right: 4px;
            font-size: 13px;
          }
          .more {
            color: #289cf2;
            font-size: 13px;
          }
        }
      }
      .logger-list-user {
        line-height: 24px;
        margin-left: 24px;
        margin-right: 24px;
        .template-name {
          font-size: 12px;
          text-align: center;
          height: 20px;
          border-radius: 3px;
          color: #666666;
          display: inline-block;
          background: rgba(245, 245, 245, 1);
          i {
            font-style: normal;
            line-height: 20px;
            zoom: 0.8;
            padding: 4px 10px;
            display: block;
          }
        }
        .view-lower-level {
          font-size: 12px;
          padding: 0 12px 0 8px;
          cursor: pointer;
          background: url("../../../assets/images/view-lower-level.png")
            no-repeat right center;
          background-size: 12px;
        }
        .pull-right {
          color: @gray-color-light;
          font-size: 0;
          span {
            font-size: 12px;
            margin-left: 8px;
            &.operate {
              font-size: 14px;
            }
          }
          .ivu-poptip {
            position: relative;
          }
          .ivu-poptip-rel {
            .icon-more {
              vertical-align: middle;
            }
          }
          .ivu-poptip-popper {
            min-width: auto;
            left: auto !important;
            top: 17px !important;
            width: auto !important;
            right: -4px;
            .ivu-poptip-arrow {
              right: 6px;
            }
          }
          .operate-tips {
            line-height: 32px;
            li {
              color: @text-color;
              padding: 0 10px;
              margin: 1px;
              transition: 0.2 ease all;
              &:hover {
                background-color: @white-color-light;
                color: @primary-color;
              }
            }
          }
        }
      }
      .logger-list-location {
        font-size: 12px;
        color: @gray-color-light;
        position: relative;
        .ivu-poptip-popper {
          top: auto !important;
          bottom: 0;
        }
        .ivu-poptip {
          .count {
            cursor: pointer;
            display: flex;
            align-items: center;
            .imageCount {
              position: relative;
              display: flex;
              align-items: center;
              margin-right: 12px;
              .count-img {
                position: relative;
                float: left;
                border-radius: 50%;
                width: 20px;
                height: 20px;
              }
              .count-img:not(:first-child) {
                margin-left: -5px;
              }
              & > span {
                margin-left: 10px;
              }
            }
          }
        }
      }
      .logger-list-range {
        font-size: 12px;
        margin-left: 24px;
        color: @gray-color-light;
        margin-top: -20px;
        margin-bottom: 13px;
        position: relative;
        .logger-list-col {
          padding: 1px 0;
          transition: 0.2s ease height;
          overflow: hidden;
        }
        .expand {
          font-size: 12px;
          height: 20px;
          line-height: 20px;
        }
        .ellipsis {
          padding-right: 20px;
          .expand {
            position: absolute;
            right: 8px;
            top: 3px;
          }
        }
      }
      .loggerlistcontent {
        .handle-content-expand {
          // overflow: hidden;
        }
      }
      .loggerDialog {
        position: absolute;
        left: 0;
        right: 0;
        top: 240px;
        height: 140px;
      }
      .loggerExpand {
        position: relative;
        margin-top: 18px;
        // left: 0;
        // right: 30px;
        // bottom: 20px;
        .line {
          background: #d9d9d9;
          height: 1px;
          margin-left: 78px;
          margin-right: 24px;
        }
      }
      .handle-content-expand-btn {
        color: @primary-color;
        position: relative;
        // &:after {
        //     content: '';
        //     height: 10px;
        //     width: 100%;
        //     position: absolute;
        //     top: -10px;
        //     background: -webkit-linear-gradient(bottom, #ffffff 0, rgba(255, 255, 255, 0.4) 20%, rgba(255, 255, 255, 0) 100%);
        // }
        .logger-open-close {
          display: inline-block;
          margin-left: 78px;
        }
        .logger-list-watcher {
          display: block;
          font-size: 13px;
          height: 56px;
          padding: 20px 0;
          margin-left: 78px;
          /deep/ .ivu-poptip-arrow {
            bottom: 17px;
          }
          .count {
            display: inline-block;
            align-items: center;
            position: relative;
            .yy-icon-arrow-right {
              position: absolute;
              right: -17px;
              top: 0px;
            }
          }
          .logger-list-col {
            display: flex;
            float: right;
            .operate-item {
              margin-right: 24px;
              cursor: pointer;
              .icon-position {
                font-size: 18px;
                position: relative;
                display: flex;
                align-items: center;
              }
              .word {
                font-size: 13px;
                display: inline-block;
              }
            }
            .icon-position {
              position: relative;
              display: flex;
              font-size: 18px;
            }
          }
          .ivu-poptip-popper {
            .ivu-poptip-content {
              .ivu-poptip-inner {
                .ivu-poptip-body {
                  max-width: 540px;
                  .ivu-poptip-body-content {
                    max-height: 200px;
                  }
                }
              }
            }
          }
        }
        .logger-list-closewatcher {
            display: block;
            font-size: 13px;
            height: 20px;
            margin-left: 78px;
        }
        .lat {
          height: 10px;
        }
        .logger-list-operate {
          font-size: 0;
          padding-bottom: 8px;
          ::selection {
            background-color: transparent;
          }
          span {
            display: inline-block;
            margin-right: 10px;
            font-size: 12px;
            color: @gray-color-light;
            height: 20px;
            line-height: 20px;
            padding: 0 34px;
            border-right: 1px solid @border-color;
            vertical-align: middle;
            i {
              font-size: 16px;
            }
            &.reply {
              i {
                position: relative;
                top: 2px;
              }
            }
            &.collect {
              border-right: 0;
            }
            &.active {
              color: #ff8b00;
            }
          }
        }
        .line {
          position: absolute;
          left: 74px;
          height: 1px;
          right: 20px;
          bottom: 0;
          content: "";
          background-color: @border-color-base;
        }
      }
      .borderStyle {
        .topLine {
          margin: auto;
          position: absolute;
          width: 100%;
          height: 1px;
          top: 0px;
          left: 0px;
          background-image: linear-gradient(
            to right,
            #18b681 0%,
            #18b681 50%,
            transparent 50%
          );
          background-size: 18px 1px;
          background-repeat: repeat-x;
        }
        .bottomLine {
          margin: auto;
          position: absolute;
          width: 100%;
          height: 1px;
          bottom: 0px;
          left: 0px;
          background-image: linear-gradient(
            to right,
            #18b681 0%,
            #18b681 50%,
            transparent 50%
          );
          background-size: 18px 1px;
          background-repeat: repeat-x;
        }
        .leftLine {
          margin: auto;
          position: absolute;
          width: 3px;
          height: 100%;
          top: 0px;
          left: 0px;
          background: linear-gradient(
            180deg,
            rgba(248, 71, 73, 1) 0%,
            rgba(238, 34, 35, 0) 100%
          );
          opacity: 0.7;
        }
        .rightLine {
          margin: auto;
          position: absolute;
          width: 1px;
          height: 100%;
          background-image: linear-gradient(
            to bottom,
            #18b681 0%,
            #18b681 50%,
            transparent 50%
          );
          right: 0px;
          top: 0px;
          background-size: 1px 18px;
          background-repeat: repeat-y;
        }
      }
    }
    .logger-list-vertical-operate {
      position: relative;
      flex: 1;
      width: 56px;
      padding-right: 20px;
      // height: 150px;
      // position: absolute;
      bottom: 0;
      // @media screen and (max-width: 1439px) {
      //     width: 188px;
      //     height: 150px;
      //     position: absolute;
      //     right: 65px;
      //     bottom: -33px;
      // }
      .leftMenuBox {
        position: sticky;
        // top: 68px;
        height: auto;
        width: 100%;
        min-width: 168px;
        top: 10px;
        right: 20px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 0px 4px 4px 0px;
        // padding: 18px 16px 8px 28px;
        padding: 18px 16px 8px 0;
        z-index: 2020;
        .left-header {
          margin-left: 12px;
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height:17px .left-close {
            display: inline-block;
            float: right;
          }
        }
        .left-line {
          margin-left: 12px;
          margin-top: 8px;
          height: 1px;
          background: #d9d9d9;
        }
        .left-content {
          width: 100%;
          margin-top: 8px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          .left-item {
            cursor: pointer;
            padding: 8px 0 8px 12px;
            // height: 36px;
            // line-height: 36px;
          }
        }
      }
      // .logger-list-vertical-operate-menu {
      //     display: inline-block;
      //     margin-left: 16px;
      //     position: absolute;
      //     bottom: 0;
      //     .operate-item{
      //         width:32px;
      //         height:32px;
      //         background:rgba(255,255,255,1);
      //         box-shadow:0px 2px 6px 0px rgba(0,0,0,0.12);
      //         border-radius:16px;
      //         margin: auto;
      //         position: relative;
      //         cursor: pointer;
      //         .icon-position{
      //             position: absolute;
      //             top: 50%;
      //             left: 50%;
      //             transform: translate(-50%,-50%);
      //         }

      //     }
      // }
    }
    .leftMenu {
      // position: fixed;
      flex: 1;
      // @media screen and (max-width: 1439px) {
      //     position: absolute;
      //     top: 0;
      //     height: calc(~'100vh - 70px');
      //     padding: 6px 16px 8px 16px;
      //     z-index: 2020;
      //     width: 188px;
      // }
      position: relative;
      .leftMenuBox {
        position: absolute;
        // top: 68px;
        height: calc(~"100vh - 70px");
        width: 100%;
        padding: 6px 16px 8px 16px;
        z-index: 2020;
        .left-header {
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height:17px .left-close {
            display: inline-block;
            float: right;
          }
        }
        .left-line {
          width: 100%;
          margin-top: 8px;
          height: 1px;
          background: #d9d9d9;
        }
        .left-content {
          width: 100%;
          margin-top: 8px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          .left-item {
            cursor: pointer;
            padding: 10px 0;
            // height: 36px;
            // line-height: 36px;
          }
        }
      }
    }
  }
}
.operate-modal {
  .ivu-modal-body {
    padding: 0 50px 10px;
    min-height: 340px;
    position: relative;
    &:before {
      position: absolute;
      left: 26px;
      content: "";
      top: -8px;
      bottom: 0;
      width: 1px;
      background-color: @border-color;
    }
    .operate-row {
      line-height: 20px;
      font-size: 14px;
      padding: 12px;
      margin-top: 10px;
      border-radius: 4px;
      background-color: @white-color-light;
      position: relative;
      &:before {
        position: absolute;
        content: "";
        left: -26px;
        top: 15px;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: @gray-color-normal;
      }
      &:after {
        position: absolute;
        content: "";
        width: 0;
        border-style: solid;
        border-width: 8px 8px 8px 0;
        border-color: transparent @white-color-light transparent
          @white-color-light;
        left: -7px;
        top: 10px;
      }
      &:first-child {
        &:before {
          background-color: @primary-color;
        }
      }
      .operate-avatar {
        float: left;
        margin-top: 4px;
      }
      .operate-content {
        margin-left: 41px;
        .clearfix {
          color: @gray-color-light;
          height: 20px;
        }
        .pull-right {
          font-size: 12px;
        }
      }
    }
  }
  .ivu-modal-header p,
  .ivu-modal-header-inner {
    font-weight: normal;
  }
  .ivu-modal-footer {
    display: none;
  }
}

// background: #FAFAFA;
// padding: 16px 24px;
</style>

