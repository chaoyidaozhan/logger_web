module.exports = {
    // 導航
    menus: {
        More: '更多',
        Record: '寫日誌',
        View: '看日誌',
        Report: '統計',
        MyLogs: '我的日誌',
        SubordinateLog: '下屬日誌',
        All: '全部日誌',
        FavoriteLog: '收藏日誌',
        InternalGroupLog: '內部群日誌',
        Me: '@我的'
    },
    // 狀態
    status: {
        Loading: '正在加載...',
        NoData: '暫無數據',
        NetworkError: '網酪錯誤'
    },
    // 提示
    toast: {
        // 點贊
        PointPraiseSuccess: '點贊成功',
        PointPraiseFailed: '點贊失敗',
        HasCanceledDotPraise: '已取消點贊',
        // 收藏
        CollectionSuccess: '收藏成功',
        CollectionFailed: '收藏失敗',
        HasCanceledCollection: '已取消收藏',
        // 評論
        CommentSuccess: '評論成功',
        CommentFailed: '評論失敗',
        // 刪除
        DeleteSuccess: '刪除成功',
        DeleteFailed: '刪除失敗'
    },
    // 操作
    operate: {
        Like: '贊',
        Favorite: '收藏',
        Comment: '評論',
        Delete: '刪除',
        Ok: '確定',
        Cancel: '取消',
        Reply: '回復',
        Copy: '復制',
        Disable: '停用',
        Add: '添加',
        Delete: '刪除',
        Share: '分享',
        EditLog: '編輯日誌',
        FillLog: '補寫日誌',
        OpenTheFullText: '展開全文',
        PackUpTheFullText: '收起全文'
    },
    // 表單
    form: {
        Select: '請選擇',
        Enter: '請輸入',
        Submit: '提交',
        WriteWarn: '請至少填寫壹項',
        SelectWarn: '請至少選擇壹項',
    },
    // 日誌分類
    logCategory: {
        DailyReport: '日報',
        WeeklyReport: '周報',
        MonthlyReport: '月報',
        Others: '其他'
    },
    // 模板提示
    template: {
        AddTemplate: '添加模板',
        HowToAdd: '如何添加模板？',
        FirstStep: '登錄友空間，點擊“日誌”應用',
        SecondStep: '當前空間下管理員點擊“模板設置”',
        ThirdStep: '填寫模板名字，日誌相關字段及描述後保存',
        FourthStep: '手機端新增日誌模板，填寫即可完成'
    },
    scroller: {
        pullUpLoadTxt: {
            more: '上拉加載',
            noMore: '沒有更多數據了',
            loading: '正在加載',
        },
        pullDownLoadTxt: {
            refresh: '下拉刷新',
            loading: '正在刷新'
        }
    },
    // 日期相關
    date: {
        Mon: '周壹',
        Tue: '周二',
        Wed: '周三',
        Thu: '周四',
        Fri: '周五',
        Sat: '周六',
        Sun: '周日',
        D: "日",
        W: "周",
        M: "月",
        EveryDay: '每天',
        Today: '今日',
        Morrow: '次日',
        Next: '下',
        StartTime: '開始時間',
        EndTime: '結束時間',
        StartingAndEndingTime: '起止時間',
        LastDayOfTheMonth: '每月最後壹天',
    },
    // 可見範圍
    whocansee: {
        Public: '公開',
        EveryoneVisible: '所有人可見',
        Private: '私密',
        OnlyFromAFewVisible: '僅自己可見',
        PartiallyVisible: '部分可見',
        DeptVisible: '部門可見',
        InnerGroupVisible: '內部群可見',
        ContactVisible: '聯系人可見',
        SelectDept: '選擇部門',
        SelectGroup: '選擇內部群',
        SelectMember: '選擇聯系人',
        SelectedPeopleVisible: '選中部分人可見',
        SelectADifferentContact: '選擇其他聯系人'
    },
    // 看日誌
    readLog: {
        LogDetail: '日誌詳情',
        ClickOkToDeleteLog: '點擊確定刪除日誌',
        ViewAllHisLogs: '查看他的全部日誌',
        AllLogs: '的全部日誌'
    },
    // 寫日誌
    writeLog: {
        LogDate: '日誌日期',
        UploadPicture: '添加圖片',
        WhoCanSee: '誰能看見',
        Location: '所在位置',
        VisibleInThisDepartment: '本部門可見',
        public: '公開',
        private: '私密',
        TheVisibleRangeCannotBeAdjusted: '可見範圍不能調整',
        SelectTheVisibleRange: '選擇可見範圍',
        PleaseSelectTheVisibleRange: '請選擇可見範圍',
        LogSaveInRealTime: '日誌實時保存',
        SelectTemplate: '選擇模板',
        RemindkeyPeopleToViewYourLog: '提醒關鍵人員查看您的日誌',
        SomeoneChecked: 'TA查看',
        TheCurrentLogTemplateHasBeen: '當前日誌模板已',
        PleaseContactTheLogAdministratorToProcess: '請聯系日誌管理員處理'
    },
    // 統計
    summary: {
        Select: '請選擇',
        Summary: '日誌匯總',
        LogSummarySearch: '日誌匯總查詢',
        RemindEmployeeToRecordLogOnTime: '提醒員工按時寫日誌',
        CreateLogRecordRule: '創建日誌提交規則',
        EmployeeWillNeverForget: '讓員工再也不會忘記寫日誌',
        PersonsNotSubmitted: '人未提交',
        AsATotal: '等共',
        Total: '共',
        people: '人',
        TheSubmitterIsNotSet: '未設置提交人',

        Template: '選擇模板',
        TheTemplate: '模板',
        Author: '選擇提交人',
        TheAuthor: '提交人',
        RecordPeriod: '提交周期',
        SpecifyDate: '指定日期',
        SubmitStartTime: '提交開始時間',
        SubmitEndTime: '提交結束時間',
        RemindEmployeesToSubmit: '提醒員工提交',
        ReminderTime: '提醒時間',

        TemplateHasBeenDeleted: '模板已刪除',
        EditRule: '編輯規則',
        CreateRule: '創建規則',
        ClickOkToDeleteRule: '點擊確定刪除規則',
        Search: '查詢',
        Number: '編號',
        Time: '時間',

        RuleDetail: '規則詳情',
        Edit: '編輯',
        HasBeenSubmitted: '已提交',
        NotSubmitted: '未提交',
        DeferredSubmission: '延期提交'
    }
}
// 寫日誌 Record
// 看日誌 View
// 統計 Report
// 添加模板 Add Template
// 如何添加模板 How to add template
// 登錄友空間， 點擊“ 日誌” 應用 Login YouZone Web and click "Log"
// 當前空間下管理員點擊“ 模板設置” YouZone administrator clicks Template Setting
// 填寫模板名字， 日誌相關字段及描述後保存 Add name, field and description, then Save
// 手機端新增日誌模板， 填寫即可完成 New log template on YouZone Mobile
// 日誌日期 Log Date
// 看日誌 View
// 我的日誌 My Logs
// 全部日誌 All
// 收藏日誌 Favorite Log
// 內部群日誌 Internal Group Log
//     .@我的.@Me
// 周報 Weekly Report
// 日報 Daily Report
// 月報 Monthly Report
// 贊 Like
// 收藏 Favorite
// 評論 Comment
// 更多 More
// 統計 Summary
// 模板 Template
// 開始日期 Start Date
// 結束日期 End Date
// 提交人 Author
// 查詢 Search
// 日誌匯總查詢 Log Summary Search
// 暫無數據 No relevant data
// 創建日誌提交規則 Create Log Record Rule
// 提醒員工按時寫日誌 Remind employee to record log on time
// 讓員工再也不會忘記也日誌 Employee will never forget
// 選擇模板 Template
// 請選擇 Select
// 取消 Cancel
// 確定 OK
// 選擇提交人 Author
// 提交周期 Record Period
// 日 D
// 周 W
// 月 M
// 指定日期 Specify Date
// 每天 Every Day
// 周壹 Mon
// 周二 Tue
// 周三 Wed
// 周四 Thu
// 周五 Fri
// 周六 Sat
// 周日 Sun
// 下周壹 Next Mon
// 下周二 Next Tue
// 下周三 Next Wed
// 下周四 Next Thu
// 下周五 Next Fri
// 提交開始時間 Submit Start Time
// 提交結束時間 Submit End Time
// 提醒時間 Reminder Time
// 截至前1小時 1 Hr in Advance
// 截至前15小時 15 Hrs in Advance
