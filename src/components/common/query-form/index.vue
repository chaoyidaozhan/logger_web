<template>
  <div class="search-form">
    <Form inline>
      <!-- 分类： 按部门统计 按人员统计 按内部群统计 -->
      <FormItem :label-width="lang === 'en' ? 60 : 40" :label="'分类'" v-if="showReportRule">
        <YYSelect
          :invertable="false"
          :transfer="false"
          v-model="classificationArrData"
          @on-change="classifyHandleChange"
          style="width: 180px"
        >
          <YYOption value="1">{{$t('menus.department')}}</YYOption>
          <YYOption value="2">{{$t('menus.employee')}}</YYOption>
          <YYOption value="3">{{$t('menus.internalGroupReport')}}</YYOption>
        </YYSelect>
      </FormItem>
      <FormItem :label-width="50" :label="$t('noun.author')" v-if="isMemberShow">
        <fs-select-member
          ref="selectMember"
          :title="`${$t('operate.select')}${$t('noun.author')}`"
          :placeholder="`${$t('operate.select')}${$t('noun.author')}`"
          :member="member"
          @handleSelect="handleSelect"
        />
      </FormItem>
      <FormItem
        :label-width="50"
        :label="$t('noun.author')"
        v-if="showAllMember && showTemplateCheck"
      >
        <fs-select-tree-input
          ref="selectMember"
          :title="`${$t('operate.select')}${$t('noun.author')}`"
          :placeholder="`${$t('operate.select')}${$t('noun.author')}`"
          :showDept="true"
          :showGroup="true"
          :member="member"
          :dept="dept"
          :group="group"
          @handleSelect="handleSelect"
        />
      </FormItem>
      <FormItem
        :label-width="lang === 'en' ? 76 : 40"
        :label="$t('noun.department')"
        v-if="isDeptShow"
      >
        <fs-select-tree-input
          ref="selectDept"
          :title="`${$t('operate.select')}${$t('noun.department')}`"
          :placeholder="`${$t('operate.select')}${$t('noun.department')}`"
          @handleSelect="handleSelect"
          :showOtherDept="showOtherDept"
          :showMember="false"
          :showDept="true"
          :dept="dept"
          :limit="{ showAll: false, warning: '', count: 10 }"
          :deptApiUri="deptApiUri"
        />
      </FormItem>
      <FormItem
        :label-width="lang === 'en' ? 98 : 50"
        :label="$t('noun.internalGroup')"
        v-if="isGroupShow"
      >
        <fs-select-tree-input
          ref="selectGroup"
          :title="`${$t('operate.select')}${$t('noun.internalGroup')}`"
          :placeholder="`${$t('operate.select')}${$t('noun.internalGroup')}`"
          @handleSelect="handleSelect"
          :showMember="false"
          :showGroup="true"
          :group="group"
          :limit="{ showAll: false, warning: '', count: 1 }"
          :groupApiUri="groupApiUri"
        />
      </FormItem>
      <!-- <FormItem :label-width="50" :label="$t('noun.author')" v-if="showAllMember && !showTemplateCheck">
                <fs-select-tree-input ref="selectMember" 
                    :title="`${$t('operate.select')}${$t('noun.author')}`"
                    :placeholder="`${$t('operate.select')}${$t('noun.author')}`"
                    :showDept="true"
                    :showGroup="true" 
                    :member="member"
                    :dept="dept"
                    :group="group"
                    @handleSelect="handleSelect"/>
      </FormItem>-->
      <!-- <FormItem :class="'minFormItem'" :label-width="lang === 'en' ? 60 : 40" :label="$t('noun.template')"  v-if="showTemplate"> -->
      <FormItem
        :label-width="lang === 'en' ? 60 : 40"
        :label="$t('noun.template')"
        v-if="showTemplate"
      >
        <fs-select-template
          :hasDefaultTemplate="hasDefaultTemplate"
          :templateType="templateType"
          @handleChange="handleQuery"
          ref="selectTemplate"
        />
      </FormItem>
      <FormItem class="form-item-checkbox" v-if="showTemplateCheck">
        <YYCheckbox @on-change="handleChange">{{$t('operate.disable')}}/{{$t('operate.delete')}}</YYCheckbox>
      </FormItem>
      <FormItem :label-width="40" :label="$t('noun.date')" v-if="showDatePicker">
        <fs-select-date ref="selectDate" :createDate="createDate" @handleChange="handleQuery" />
      </FormItem>
      <!-- <FormItem :label-width="50" :label="$t('noun.author')" v-if="showMember">
                <fs-select-member ref="selectMember" 
                    :title="`${$t('operate.select')}${$t('noun.author')}`"
                    :placeholder="`${$t('operate.select')}${$t('noun.author')}`"
                    :member="member"
                    @handleSelect="handleSelect"/>
      </FormItem>-->
      <FormItem :label-width="40" :label="$t('noun.date')" v-if="showOrderType || orderTypeMulti">
        <fs-select-order-type
          ref="selectOrderType"
          :classificationArrData="classificationArrData"
          :multi="orderTypeMulti"
        />
      </FormItem>
      <FormItem class="form-item-checkbox" v-if="showWithPublic">
        <YYCheckbox
          v-model="withPublic"
          @on-change="handleChangePublic"
        >{{$t('operate.withPublic')}}</YYCheckbox>
      </FormItem>
      <FormItem class="search-btn">
        <YYButton :disabled="loading" @click="handleQuery">{{$t('operate.search')}}</YYButton>
      </FormItem>
      <div v-if="showReportRule" class="reportRules">
        <YYButton type="ghost" @click="setReportingRules">{{$t('operate.reportRules')}}</YYButton>
      </div>
      <div class="rightButtonGroup">
        <FormItem
          :class="'exportStyle'"
          :label-width="10"
          class="export-btn"
          v-if="showExportExcel">
          <fs-export-excel
            @handleExportExcel="handleExportExcel"
            @handlePersonData="handlePersonData"
            :isGroupOrDeptSelectedAll="isGroupOrDeptSelectedAll"
            :showGroupExcelBtn="showGroupExcelBtn"
            :showDeptExcelBtn="showDeptExcelBtn"
          ></fs-export-excel>
        </FormItem>
      </div>
      <div class="open-date" v-if="showBrowse" @click.stop="globalModel">
        <YYIcon type="yanshizhemoshi"></YYIcon>
      </div>
      <div class="logger-menu-logo"  v-if="showCreateMenu">>
        <YYButton type="primary" @click="goLoggerDetail">{{$t('operate.createLog')}}</YYButton>
      </div>
    </Form>
    <ReportingRules v-if="showReportingRules" />
  </div>
</template>
<script>
/**
 * showTemplate 是否显示模板
 * showTemplateCheck 是否显示模板过滤check
 * hasDefaultTemplate 是否显示默认全部模板
 * showDatePicker 是否显示日期组件
 * showDept 是否显示选择组织组件
 * showGroup 是否显示选择内部群组件
 * showMember 是否显示选择提交人组件
 * showOrderType 是否显示选择日期类型组件
 * showOrderTypeMulti 选择日期类型是否支持选择日期
 * showExportExcel 是否显示日志统计导出按钮
 * showReportRule 是否显示规则分类:部门,人员,内部群
 **/
import ReportingRules from "../reportingRules/";
import FsSelectTreeInput from "../select-tree-input/";
import FsSelectTemplate from "../select-template/";
import FsSelectMember from "../select-member/";
import FsSelectDate from "../select-date/";
import FsSelectGroup from "../select-group/";
import FsSelectOrderType from "../select-order-type/";
import FsExportExcel from "../export-excel";
import config from "app_src/config/config";

export default {
  props: {
    showTemplate: {
      // 是否显示模板
      type: Boolean,
      default: false
    },
    showTemplateCheck: {
      type: Boolean,
      default: false
    },
    showWithPublic: {
      type: Boolean,
      default: false
    },
    hasDefaultTemplate: {
      type: Boolean,
      default: true
    },
    showReportRule: {
      type: Boolean,
      default: false
    },
    showDatePicker: {
      type: Boolean,
      default: false
    },
    showOtherDept: {
      type: Boolean,
      default: false
    },
    showDept: {
      type: Boolean,
      default: false
    },
    showGroup: {
      type: Boolean,
      default: false
    },
    showAllMember: {
      type: Boolean,
      default: false
    },
    showMember: {
      type: Boolean,
      default: false
    },
    showOrderType: {
      type: Boolean,
      default: false
    },
    showOrderTypeMulti: {
      type: Boolean | String,
      default: false
    },
    templateType: {
      type: String,
      default: "app"
    },
    createDate: {
      type: Array,
      default: function() {
        return [];
      }
    },
    deptApiUri: {
      type: String
    },
    groupApiUri: {
      type: String
    },
    showExportExcel: {
      type: Boolean,
      default: false
    },
    showGroupExcelBtn: {
      type: Boolean,
      default: false
    },
    showDeptExcelBtn: {
      type: Boolean,
      default: true
    },
    showCreateMenu: {
      type: Boolean,
      default: true
    },
    showBrowse: {
      type: Boolean,
      default: false
    }
  },
  components: {
    FsSelectTreeInput,
    FsSelectTemplate,
    FsSelectDate,
    FsSelectOrderType,
    FsExportExcel,
    FsSelectMember,
    ReportingRules
  },
  data() {
    return {
      showReportingRules: false,
      isDeptShow: this.showDept,
      isGroupShow: this.showGroup,
      isMemberShow: this.showMember,
      classificationArrData: "1", // 分类
      dept: [], // 组织
      group: [], // 内部群
      member: [], // 提交人
      queryTimer: null,
      loading: false,
      withPublic: false,
      isGroupOrDeptSelectedAll: false,
      showReportingRulesFlag: true,
      orderTypeMulti: this.showOrderTypeMulti,
      list: [],
      pageNo: 1,
      pageSize: 20,
      offsetId: "" //设置滚动到第几条
    };
  },
  methods: {
    globalModel() {
      this.$eventbus.$emit("openglobal");
      // let {protocol, host, pathname} = window.location
      // let url = `${protocol}//${host}${pathname}#/globalModal?token=${this.$store.state.userInfo.token}`
      // const $win = window.open(url)
      // let _this = this
      // $win.onload = function() {
      //     setTimeout(() => {
      //         $win.postMessage(
      //         {
      //             list: _this.list,
      //             pageNo: _this.pageNo,
      //             pageSize: _this.pageSize,
      //             offsetId: _this.offsetId
      //         },
      //         '*'
      //         )
      //     }, 2000)
      // }
    },
    goLoggerDetail() {
      this.$router.push({
        path: `/LoggerDetail/template`,
        query: {
          token: this.$store.state.userInfo.token
        }
      });
    },
    setReportingRules() {
      this.showReportingRules = !this.showReportingRules;
    },
    classifyHandleChange(v) {
      this.isDeptShow = false;
      this.isGroupShow = false;
      this.isMemberShow = false;
      this.dept = [];
      this.group = [];
      this.member = [];
      this.$nextTick(() => {
        if (v == "1") {
          this.isDeptShow = true;
          this.orderTypeMulti = "dept";
        }
        if (v == "2") {
          this.isMemberShow = true;
          this.orderTypeMulti = "member";
        }
        if (v == "3") {
          this.isGroupShow = true;
          this.orderTypeMulti = "group";
        }
        this.handleQuery();
      });
    },
    trimIds(params) {
      // 整理id数据
      if (this.member && !!this.member.length) {
        // 整理人员id
        let memberIds = [];
        this.member.forEach(item => {
          memberIds.push(item.memberId);
        });
        params.memberIds = memberIds.join(",");
      }
      if (this.dept && !!this.dept.length) {
        // 整理组织id
        let deptIds = [];
        this.dept.forEach(item => {
          deptIds.push(item.deptId);
        });
        params.deptIds = deptIds.join(",");
      }
      if (this.group && !!this.group.length) {
        // 整理内部群
        let groupIds = [];
        this.group.forEach(item => {
          groupIds.push(item.gid);
        });
        params.groupIds = groupIds.join(",");
      }
    },
    rulesValidate(params) {
      // 非空验证
      let keys = Object.keys(params);
      keys.forEach(key => {
        switch (typeof params[key]) {
          case "number":
            if (!params[key] && params[key] != 0) {
              delete params[key];
            }
            break;
          case "string":
            if (!params[key]) {
              delete params[key];
            }
            break;
          default:
            delete params[key];
            break;
        }

        if (key == "templateId" && params[key] == 0) {
          delete params[key];
        }
      });
    },
    handleQuery() {
      // 查询时返回整理好的数据
      clearTimeout(this.queryTimer);
      this.queryTimer = setTimeout(() => {
        let params = {
          classification: this.classificationArrData, // 分类
          withPublic: this.withPublic,
          templateId:
            this.$refs.selectTemplate && this.$refs.selectTemplate.templateId,
          beginDate: this.$refs.selectDate && this.$refs.selectDate.beginDate,
          endDate: this.$refs.selectDate && this.$refs.selectDate.endDate,
          ...(this.$refs.selectOrderType &&
            this.$refs.selectOrderType.getParams())
        };
        this.trimIds(params);
        this.rulesValidate(params);
        this.$emit("handleQuery", params);
      }, 200);
    },
    handleSelect(res) {
      res &&
        res.group &&
        res.group.forEach(item => {
          if (item.gid === 0) {
            this.isGroupOrDeptSelectedAll = true;
          }
        });
      res &&
        res.dept &&
        res.dept.forEach(item => {
          if (item.deptId === 0) {
            this.isGroupOrDeptSelectedAll = true;
          }
        });
      let keys = Object.keys(res);
      keys.forEach(key => {
        this[key] = res[key];
      });
      this.handleQuery();
    },
    handleExportExcel(params) {
      this.handleQuery();
      let data = {
        templateId:
          this.$refs.selectTemplate && this.$refs.selectTemplate.templateId,
        orderType:
          this.$refs.selectOrderType &&
          this.$refs.selectOrderType.getParams().orderType,
        years: this.years,
        start: (this.startEndData && this.startEndData.start) || ""
      };
      this.trimIds(data);
      let isDept = params === 0 || params == 1 ? true : false;
      if (
        (isDept && data.deptIds === undefined) ||
        (!isDept && data.groupIds === undefined)
      ) {
        return;
      }
      let path =
        params === 1 || params === 3
          ? "exportExcelIncludeUserStatisticsByCondition"
          : "exportExcelStatisticsByCondition";
      let deptOrGroupId =
        data.deptIds !== undefined
          ? `deptIds=${data.deptIds}`
          : `groupIds=${data.groupIds}`;
      let host = `${window.location.protocol}//${window.location.host}/logger`;
      let url = `${host}/diaryQuery/${path}?token=${
        this.$store.state.userInfo.token
      }&timestamp=${new Date().getTime()}&language=${window.lang}&orderType=${
        data.orderType
      }&${deptOrGroupId}&templateId=${data.templateId}&years=${
        data.years
      }&start=${data.start}`;
      window.open(url);
    },
    handlePersonData() {
      this.handleQuery();
      let data = {
        templateId:
          this.$refs.selectTemplate && this.$refs.selectTemplate.templateId,
        orderType:
          this.$refs.selectOrderType &&
          this.$refs.selectOrderType.getParams().orderType,
        start: this.startEndData.start || "",
        end: this.startEndData.end || "",
        pageNo: 1,
        pageSize: 9999
      };
      this.trimIds(data);
      if (!data.memberIds) {
        return;
      }
      let host = `${window.location.protocol}//${window.location.host}/logger`;
      let url = `${host}/diaryQuery/exportUsersStatisticsByCondition?token=${
        this.$store.state.userInfo.token
      }&timestamp=${new Date().getTime()}&language=${window.lang}&orderType=${
        data.orderType
      }&templateId=${data.templateId}&start=${data.start}&end=${
        data.end
      }&memberIds=${data.memberIds}&pageNo=${data.pageNo}&pageSize=${
        data.pageSize
      }`;
      window.open(url);
    },
    handleChange(value) {
      let templateType;
      if (value) {
        templateType = "web";
      } else {
        templateType = "select";
      }
      this.$emit("handleTemplateType", templateType);
      this.handleQuery();
    },
    handleChangePublic() {
      this.$emit("handleChangePublic", this.withPublic);
    },
    resetQuery() {
      if (this.$refs.selectTemplate) {
        // 重置模板
        this.$refs.selectTemplate.templateId = 0;
      }
      if (this.$refs.selectGroup) {
        // 重置内部群
        this.$refs.selectGroup.groupId = "";
      }
      if (this.$refs.selectDept) {
        // 重置部门
        this.$refs.selectDept.deptId = "";
      }
    }
  },
  mounted() {
    this.$eventbus.$on("setBtnLoading", data => {
      this.loading = data;
    });
    this.$eventbus.$on("getYear", data => {
      this.years = data;
    });
    this.$eventbus.$on("getStartEndTime", data => {
      this.startEndData = data;
    });
    // this.$eventbus.$on("translist", (list, pageNo, pageSize) => {
    //   this.list = list;
    //   this.pageNo = pageNo;
    //   this.pageSize = pageSize;
    // });
    // this.$eventbus.$on("transid", id => {
    //   this.offsetId = id;
    // });
    this.$eventbus.$on('reportingRules/common/listItem--someoneReportList', (data) => {
      this.$refs.selectMember.members = [{
          avatar: data.avatar,
          label: data.userName,
          value: data.memberId
      }];
      this.orderTypeMulti = 'member';
      this.handleQuery();
    });
  },
  destroyed() {
    this.$eventbus.$off("setBtnLoading");
    // this.$eventbus.$off("translist");
    // this.$eventbus.$off("transid");
    this.$eventbus.$off("reportingRules/common/listItem--someoneReportList");
  }
};
</script>
<style scoped>
.logger-menu-logo {
  display: inline-block;
  float: right;
  margin-right: 8px;
}
.open-date {
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  text-align: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 3px;
  border: 1px solid rgba(217, 217, 217, 1);
  float: right;
  color: #333333;
}
.reportRules {
  float: right;
}
</style>
<style lang='less'>
.search-form {
  .ivu-form-inline {
    .ivu-form-item {
      min-width: 150px;
      margin-right: 8px;
      .ivu-form-item-label {
        padding: 10px 8px 10px 0;
      }
      .query-select-member {
        width: 160px;
      }
    }
  }
  .rightButtonGroup {
    float: right;
    .excel-btn-wrap {
      background-color: #ee2223;
      border-color: #ee2223;
      &:hover {
        background-color: #d61f20;
        border-color: #d61f20;
      }
      a {
        color: #fff;
      }
    }
  }
}
</style>

