<template>
    <div class="select-dept" v-loading="{loading: loaded, text: '加载中...'}">
        <Input 
            placeholder="请输入组织名称进行搜索" 
            type="text" 
            v-model="keyword"
            @on-change="handleSearch"/>
        <Checkbox v-if="showCheckedAll && !!deptTree.length" class="select-dept-check" @on-change="handleCheckAll" v-model="checkAll">全选</Checkbox>
        <div class="select-dept-wrapper">
            <Tree ref="tree" :data="deptTree" show-checkbox @on-check-change="handleCheckChange"/>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        showCheckedAll: { // 是否显示全选
            type: Boolean,
            default: false
        },
        defaultDeptIds: { // 其他空间通过deptId来判断
            type: Array,
            default() {
                return []
            }
        },
        deptShifts: { // 
            type: Array,
            default() {
                return []
            }
        },
        isEcho: { // 是否需要回显数据
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            keyword: '',
            searchTimer: null,
            deptTree: [], // 整理之后的树结构数据
            deptIds: [],
            depts: [], // 已选中部门信息
            authDeptId: [],
            deptLen: 0,
            checkAll: false, // 全选
            loaded: false,
            insearch: false,
        }
    },
    methods: {
        initDeptIds() { // 初始化回显数据
            if(this.deptShifts && !!this.deptShifts.length) {
                this.deptIds = [];
                this.deptShifts.forEach(item=>{
                    this.deptIds.push(item.deptId);
                    this.depts.push(item);
                })
            }
        },
        getDeptsData() { // 获取组织节点
            this.$ajax({
                url: '/signin/dept/getDepts',
                data: {
                    keyword: this.keyword.trim(),
                },
                success: (res) => {
                    if (res && res.code === 0) {
                        this.deptLen = res.data && res.data.length || 0;
                        if(res.data && !!res.data.length) {
                            if(this.insearch) {
                                this.initSearchTree(res.data);
                            } else {
                                this.trimDeptTree(res.data);
                            }
                        }
                    }
                    this.loaded = true;
                }, error: (res)=>{
                    this.loaded = true;
                }
            })
        },
        trimDeptTree(params) { // 整理根节点数据
            let deptTree = {};
            (params || this.deptTree).forEach((item) => {
                let pid = item.parentId.toString();
                if (!deptTree[pid]) {
                    deptTree[pid] = [];
                }
                deptTree[pid].push(item);
            });
            this.initDeptTree(deptTree, 0);
        },
        initDeptTree(params, key) { // 初始化根节点
            if (params[`${key}`]) {
                params[`${key}`].forEach((item) => {
                    item.title = item.deptName;
                    item.checked = false;
                    this.formatTree(item); // 是否为true
                    
                    if (params[item.deptId]) {
                        item.children = params[`${item.deptId}`] || [];
                        this.initGroupTree(params, item.children, item.disableCheckbox);
                    }
                })
                this.deptTree = params[`0`];
            }
        },
        initGroupTree(params, children, disableCheckbox) { // 初始化子节点
            children.forEach((item) => {
                item.title = item.deptName;
                item.checked = false;
                this.formatTree(item); // 是否为true
                if(!disableCheckbox) {
                    item.disableCheckbox = false;
                }
                if (params[`${item.deptId}`]) {
                    item.children = params[`${item.deptId}`] || [];
                    this.initGroupTree(params, item.children, item.disableCheckbox);
                }
            })
        },
        initSearchTree(params) { // 搜索时平级展示
            params.forEach((item)=>{
                item.title = item.deptName;
                item.checked = false;
                this.formatTree(item);
            })
            this.deptTree = params;
        },
        getAuthDeptId() { // 获取允许点击的id
            this.$ajax({
                url: '/signin/signinManager/getAuthDeptIds',
                data: {
                    accountId: this.$store.state.userInfo.accountId
                },
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.authDeptId = res.data || [];
                    }
                }
            })
        },
        formatTree(value) { // 判断tree
            if(this.defaultDeptIds.length == 1 && this.defaultDeptIds[0] == 0) {
                value.checked = true; 
                this.checkAll = true; 
            }

            if(this.showCheckedAll) { // 存在全选按钮时的操作
                if(this.checkAll == true) { 
                    value.checked = true; 
                } else {
                    value.checked = false; 
                }
            }
           
            // 通过deptIds来判断
            if(this.deptIds.indexOf(value.deptId) != -1) { 
                value.checked = true; 
            } 

            // 通过defaultDeptIds来判断
            if(this.defaultDeptIds.indexOf(value.deptId) != -1) { 
                value.checked = true; 
            } 
            
            // 判断是否可以选择
            if(this.authDeptId && !!this.authDeptId.length) {
                value.disableCheckbox = true;
                if(this.authDeptId.indexOf(value.deptId) != -1) { 
                    value.disableCheckbox = false;
                } 
            }
        },
        handleSearch() { // 搜索初始化
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                this.insearch = true;
                if(!this.keyword.trim()) {
                    this.insearch = false;
                }
                this.getDeptsData(true);
            }, 200);
        },
        handleCheckChange(value, node) { // 单选的时候判断
            if(this.insearch) {
                if(node.checked) {
                    this.deptIds.push(node.deptId);
                    this.depts.push(node);
                } else {
                    let index = this.deptIds.indexOf(node.deptId)
                    if(index != -1) {
                        this.deptIds.splice(index, 1);
                        this.depts.splice(index, 1);
                    }
                }
                this.$emit('handleChangeDepts', this.depts);
            } else {
                this.setDeptIds();
                this.setDeptsInfo()
                this.$emit('handleChangeDepts', this.depts);
            }
            
            if(this.showCheckedAll) {
                if (value.length != this.deptLen) {
                    this.checkAll = false;
                } else {
                    this.checkAll = true;
                }
            }
        },
        trimDeptIds(param) { // 获取当前已选中部门id
            (param || this.deptTree).forEach(item => {
                if (!!item.checked) {
                    this.deptIds.push(item.deptId);
                } else {
                    if (item.children && !!item.children.length) {
                        this.trimDeptIds(item.children);
                    }
                }
            })
        },
        trimDeptInfo(param) { // 获取当前已选中部门信息
            (param || this.deptTree).forEach(item => {
                if (!!item.checked) {
                    this.depts.push(item);
                } else {
                    if (item.children && !!item.children.length) {
                        this.trimDeptInfo(item.children);
                    }
                }
            })
        },
        setDeptIds() { // 设置已选中的组织id, 外部调用
            this.deptIds = [];
            this.trimDeptIds();
        },
        setDeptsInfo() { // 设置已选中的组织信息, 外部调用
            this.depts = [];
            this.trimDeptInfo();
        },
        getDeptIds() { // 获取已选中的组织id, 外部调用
            return this.deptIds || [];
        },
        getDeptsInfo() { // 获取已选中的组织信息, 外部调用
            return this.depts || [];
        },
        handleCheckAll(val) { // 点击全选
            if (!val) { // 取消全选
                let checkedNodes = this.$refs.tree.getCheckedNodes();
                checkedNodes.forEach(item => {
                    item.checked = false
                });
            } else {
                this.checkedTree(this.deptTree, true);
                this.setDeptIds();
            }
            this.$emit('handleChangeDepts', this.$refs.tree.getCheckedNodes());
        },
        checkedTree(params, type) { // 全选递归
            (params || this.deptTree).forEach((item) => {
                if(!!type) {
                    item.checked = true; 
                    item.indeterminate = false;
                } 
                if (item.children && item.children.length) {
                    this.checkedTree(item.children)
                }
            })
        },
        clearParams() { // 取消全选, 供外部调用
            this.checkAll = false;
            this.handleCheckAll(false);
            this.deptIds = []
        },
        clearTree(node) { // 取消单个选择
            node.checked = false;
            if (node.children && !!node.children.length) {
                node.children.forEach(item=>{
                    this.clearTree(item);
                })
            }
        },
        clearSingleParams(node) { // 取消单个选择, 供外部调用
            let checkedNodes = this.$refs.tree.getCheckedNodes();
            checkedNodes.forEach((item) => {
                if(item.deptId == node.deptId) {
                    this.clearTree(item);
                    let index = this.deptIds.indexOf(node.deptId)
                    this.deptIds.splice(index, 1);
                    this.depts.splice(index, 1);
                } 
            });
            this.$emit('handleChangeDepts', this.isEcho ? this.getDeptsInfo() : checkedNodes);
        }
    },
    mounted () {
        this.initDeptIds();
        if(this.isEcho) {
            this.getAuthDeptId();
        }
        this.getDeptsData();
    }
}
</script>
<style lang="less">
.select-dept {
    padding: 15px;
    position: relative;
    height: 100%;
    .select-dept-wrapper {
        height: 298px;
        overflow: auto;
    }
    .operate {
        text-align: center;
        padding: 10px 0;
        cursor: pointer;
    }
}
    .select-dept {
        .select-dept-check {
            margin-left: 15px;
            margin-top: 10px;
            span.ivu-checkbox {
                margin-right: 12px;
            }
        }
        .ivu-tree-empty {
            text-align: center;
            padding: 20px;
        }
    }
</style>

