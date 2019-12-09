<template>
    <YYSelect 
        class="query-select-member"
        style="width: '200px'"
        v-model="members"
        labelInValue
        :placeholder="placeholder"
        clearable 
        multiple
        filterable
        sortable
        ref="member"
        :transfer="false"
        :filterMethod="handleSearch"
        @on-change="handleSelect">
        <YYOption v-for="item in searchResult" 
            :key="item.value"
            :value="item.value">
            <!-- <YYAvatar :path="item.avatar" :name="item.label" size="20px"/> -->
            {{item.label}}
        </YYOption>
        <i class="icon-add" @click.stop="openSelectMember" slot="suffix"></i>
    </YYSelect>
</template>
<script>
/**
 * showDept 是否显示选择组织组件
 * showGroup 是否显示选择内部群组件
 * showMember 是否显示选择提交人组件
 * ellipsis 是否强制换行, 不换行时可以删除单个选择 
 * limit showAll 是否添加全选 count 最大数量限制 warning 超过选择提示信息
 **/
export default {
    props: {
        member: { // 人员数据
            type: Array,
            default() {
                return []
            }
        },
        showLoading: {
            type: Boolean,
            default: true
        },
        ellipsis:  {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: '选择可见范围'
        },
        placeholder: {
            type: String,
            default: '选择可见范围'
        },
        limit: {
            type: Object,
            default() {
                return {
                    showAll: false,
                    warning: '',
                    count: 500
                }
            }            
        },
        memberApiUri: {
            type: String
        },
    },
    data() {
        const members = this.member.map(item => {
            return {
                avatar: item.avatar,
                label: item.userName,
                value: item.memberId
            }
        })
        return {
            members: [],
            searchResult: []
        }
    },
    methods: {
        handleSearch(value) {
            if(!value) return
            this.searchResult = []
            this.$ajax({
				url: this.memberApiUri || '/user/getUsersBySpace',
				data: {
					pageSize: 1000,
					pageNum: 1,
					keyWord: value,
					initial: '',
					isSort: 1 // 是否按首字母排序 0否, 1是
				},
				success: (res) => {
                    this.searchResult = res && res.data.map(item => {
                        return {
                            avatar: item.avatar,
                            label: item.userName,
                            value: item.memberId
                        }
                    })
                    this.$refs.member.updateSlotOptions()
				},
				error: (res) => {
					this.ajaxStatus = 'error'
				}
			})
        },
        handleSelect(res) {
            this.members = res
            const finalSelect = this.members.map(item => {
                return {
                    userName: item.label,
                    memberId: item.value
                }
            })
            this.$emit('handleSelect', {
                member: finalSelect
            })
        },
        handleClear(e, item, name) {
            e.stopPropagation();
            let selected = {
                member: JSON.parse(JSON.stringify(this.member))
            }
            let arr = [];
            let id = {
                member: 'memberId'
            }
            selected[name].forEach((val)=>{
                if(val[`${id[name]}`] != item[[`${id[name]}`]]) {
                    arr.push(val)
                }
            });
            selected[name] = arr;
            this.handleSelect(selected)
        },
        openSelectMember() {
            const members = this.members.map(item => {
                return {
                    name: item.label,
                    memberId: item.value,
                    userName: item.label.trim()
                }
            })
            let info = {
                title: this.title,
                man: true,
                team:  false,
                dep: false,
                org: false,
                showOtherDept: false,
                showLoading: this.showLoading,
                limit: { 
                    ...this.limit
                },
                selected: {
                    org: [],
                    dep: [],
                    man: members,
                    team: []
                }
            };
            if(this.memberApiUri) {
                info.memberApiUri = this.memberApiUri
            }
            this.$selectTree.show(JSON.parse(JSON.stringify(info)), res=>{
                let params = res && res.man.map(item => {
                    return {
                        label: item.userName,
                        value: item.memberId
                    }
                })
                this.handleSelect(JSON.parse(JSON.stringify(params)))
            })
        }
    }
}
</script>
<style lang="less">
@import '~app_assets/css/var.less';
.query-select-member {
    .yy-select-selection {
        & > span {
            white-space: nowrap;
            max-width: 140px;
            overflow: auto;
        }
        input {
            width: 60px;
        }
    }
    width: 240px;
    .yy-avatar-wrapper {
        vertical-align: middle;
    }
    .yy-avatar-name:after, .yy-avatar-name i {
        transform: scale(.6);
    }
}

</style>

