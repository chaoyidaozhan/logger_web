module.exports = {
    menus: { // 导航
        logQuery: '日志查询',
        all: '所有日志',
        atMe: '@我的',
        myLogs: '我的日志',
        internalGroupLog: '内部群日志',
        subordinateLog: '下属日志',
        myDraft: '我的草稿',
        myFavorite: '我的收藏',
        logStatistic: '日志统计',
        department: '按部门统计',
        employee: '按人员统计',
        internalGroupReport: '按内部群统计',
        summary: '日志汇总',
        templateManagement: '模板管理',
    },
    operate: { // 操作
        back: '返回',
        createLog: '创建日志',
        createTemplate: '创建模板',
        update: '更新于',
        updated: '更新',
        discontinued: '已停用',
        search: '查询',
        export: '导出',
        expand: '展开全文',
        collapse: '收起全文',
        checkAll: '全选',
        selected: '已选中',
        please: '请',
        select: '选择',
        enter: '输入',
        submit: '提交',
        save: '保存',
        ok: '确定',
        cancel: '取消',
        clear: '清除',
        all: '全部',
        saveAndEnable: '保存并启用',
        preview: '预览',
        reply: '回复',
        delete: '删除',

        edit: '编辑',
        disable: '停用',
        print: '打印',
        download: '下载',
        operationRecord: '操作记录',
        saveAsDraft: '存为草稿',
        file: '附件',
        upload: '上传'
    },
    status: { // 状态
        loading: '正在加载...',
        loadedAllData: '已加载全部数据',
        networkError: '网络错误',
        clickToReload: '点击重新加载',
        loadMore: '加载更多',
        noRelevantData: '没有相关数据'
    },
    toast: { // 提示
        operationFailed: '操作失败',
        successfullyDeleted: '删除成功',
        deleteLogPrompt: '删除日志提示',
        clickOKToDeleteTheLog: '点击确定删除该日志',
        singleUploadIsNoMoreThanAttachments: '单次上传不大于9个附件',
        deleteReplyPrompt: '删除回复提示',
        clickOKToDeleteTheReply: '点击确定删除该回复',
        selectTheDataThatExport: '选择提交人查询需要汇总的数据 ，可导出Excel',
        pleaseSelectTheSummaryLog: '请选择汇总的日志',
        thereIsNoControl: '还没有控件哦～请选择控件',
        pagePrompt: '页面提示',
        confirmToLeaveCurrentPage: '你确定离开当前页面吗？',
        departmentalDataOnly: '仅部门数据',
        internalGroupDataOnly: '仅内部群数据',
        departmentAndPersonnelData: '部门和人员数据',
        internalGroupAndPersonnelData: '内部群和人员数据',
        savedSuccessfully: '保存成功',
        returnToTemplateManagement: '返回模板管理',
        continueEditing: '继续编辑',
        deleteTemplateReminder: '删除模板提醒',
        clickOKToDeleteTheTemplate: '点击确定删除模板',
        cancelEditing: '取消编辑',
        cancelEditingConfirm: '您的日志还没提交，确定要放弃编辑吗？',
        theLogWasSuccessfullyModified: '日志修改成功',
        theDraftOfTheLogWasSavedSuccessfully: '日志草稿保存成功',
        theLogWasCreatedSuccessfully: '日志创建成功',
        canNotBeEmpty: '不能为空'
    },
    placeholder: { // 输入框提示文字
        postYourComment: '发表您的评论',
        allTemplate: '全部模板',
        maximum10Chars: '不超过10个字',
        maximum20Chars: '不超过20个字',
        maximum50Chars: '不超过50个字',
        enterUnit: '请输入单位比如（元）',
        leastItems: '至少2项至多10项',
        whetherDisplayDate: '是否显示日志日期',
        enterKeyword: '请输入关键字进行搜索',
        noMore: '每次选择不可超过500人，请分批选择',
        remindkeyPeopleToViewYourLog: '提醒关键人员查看您的日志',
        visibleToThisDepartment: '本部门可见'
    },
    date: { // 时间
        mon: '周一',
        tue: '周二',
        wed: '周三',
        thu: '周四',
        fri: '周五',
        sat: '周六',
        sun: '周日',
        january: '一月',
        february: '二月',
        march: '三月',
        april: '四月',
        may: '五月',
        june: '六月',
        july: '七月',
        august: '八月',
        september: '九月',
        october: '十月',
        november: '十一月',
        december: '十二月',
        firstQuarter: '一季度',
        secondQuarter: '二季度',
        thirdQuarter: '三季度',
        fourthQuarter: '四季度',
        d: "日",
        w: "周",
        m: "月",
        everyDay: '每天',
        today: '今日',
        morrow: '次日',
        next: '下',
        startTime: '开始时间',
        endTime: '结束时间',
        startingAndEndingTime: '起止时间',
        lastDayOfTheMonth: '每月最后一天',
    },
    noun: { // 固有名词
        web: 'web端',
        mobile: '移动端',
        log: '日志',
        uLog: '日志',
        logs: '日志',
        author: '提交人',
        template: '模板',
        personnel: '人员',
        department: '部门',
        internalGroup: '内部群',
        name: '名称',
        uName: '名称',
        summary: '汇总',
        statistics: '汇总',
        article: '篇',
        date: '日期',
        visibleTo: '可见范围',
        visibleRange: '可见范围',
        public: '所有人可见',
        private: '仅自己可见',
        submitTime: '提交时间',
        logDate: '日志日期',
        other: '其他',
        dailyReport: '日报',
        weeklyReport: '周报',
        monthlyReport: '月报',

        daily: '按日统计',
        weekly: '按周统计',
        monthly: '按月统计',
        quarterly: '按季度统计',
        custom: '自定义',

        textBox: '文本输入',
        numberBox: '数字输入',
        radioBox: '单选框',
        checkBox: '复选框',
        option: '选项',
        control: '控件',
        description: '说明',
        category: '类型',
        controlSettings: '控件设置',
        templateSettings: '模板设置',
        title: '标题',
        promptText: '提示文字',
        unit: '单位',
        addOption:'添加选项',
        required: '必填',
        peopleHaveSeen: '人看过',
        viewAll: '查看全部',
        someoneChecked: 'TA查看',
        operationRecord: '操作记录'
    },
    title: {
        logTemplate: '日志模板',
        logTemplateSettings: '设置日志模板'
    }
}
