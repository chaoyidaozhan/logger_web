<template>
	<div>
		<Tree class="selMemTree" :data="rootData.children" :render="renderContent" @on-toggle-expand="autoExpandChildren"></Tree>
	</div>
</template>
<script>
	
	// 默认 loading 图标站位
	const DEFAULT_CHILDREN = [{
        expand:false, 
        getListDone:false,
        defaultChildren:true , //如果种类是defaultChildren 默认显示loading图标 ;
	}]

    export default {
    	props:['info'],
        data () {
            return {
            	// 跟节点 root ;
                rootData: {
            		title:'root',
            		expand:true,
            		getListDone:false,
            		pid:'',
                    // 站位子节点 ;
                    children: DEFAULT_CHILDREN
                },
            }
        },

        mounted(){
        	this.autoExpandChildren( this.rootData );
        },

        methods: {
            renderContent(h, { root, node, data }){
            	console.log(1)
            	if( data.defaultChildren ){
            		// 站位元素显示loading图标 ;
            		return (
            			h('div',{
            				style:{
            					display:'inline-block',
            					width:'100%',
            					textAlign:'center'
            				}
            			},[
            				h('Spin',{
            					style:{
            						display: 'inline-block',
            					}
            				})
            			]));
            	}else {
	            	// 正常元素 ;
	                return (
		             	h('div',{
		             		style:{
		                        display: 'inline-block',
		                        width: '100%',
		                        marginLeft:'4px',      			
		             		}
		             	},[
		                    h('span', {
		                    	style:{
		                    		fontSize:'13px',
		                    	},
		                    	domProps:{
		                    		innerText:data.title
		                    	}
		                    }),
		                    h('span', {
		                        style: {
		                            display: 'inline-block',
		                            float: 'right',
		                            marginRight: '5px'
		                        }
		                    }, [
		                    	h('Checkbox',{
		                    		props:{
		                    			value: data.check ,
		                    		},
		                    		on:{
		                    			'on-change':(bool)=>{
		                    				this.selectEach( data , bool );
		                    			}
		                    		}
		                    	}),
		                    ])                             		
		             	]));
            	}
            },

            remove (root, node, data) {
                const parentKey = root.find(el => el === node).parent;
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(data);
                parent.children.splice(index, 1);
            },
            autoExpandChildren( data ){
            	// 节点被展开 && 没有请求过数据
            	if( data.expand===true && data.getListDone===false ){
            		this.getList( data.pid ,( arr )=>{ //成功回调	
            			// 添加默认元素
            			let deps = arr.map( v=>{
            				// 整理数据数据格式 ;
            				let obj = {
                				target:v, //数据源
                				pid:v.deptId,
            					title:v.deptName,
            					expand:false,
            					check:false,
                				getListDone:false
            				}
            				if( v.haveSub==1 ){
            					obj.children = DEFAULT_CHILDREN ;
            				}
            				return obj ;
            			});
            			data.getListDone=true;
            			this.$set(data, 'children', deps );
            		});
            	}
            },
			getList( pid , callback ){
				// callback(tttt.data);
            	let data={ pid : pid };
            	!pid ? delete data.pid : null ;
            	this.$ajax({
	                url: '/logger/team/getDepts',
	                data: data ,
	                success: (res)=>{
	                    res.code==0 ? callback(res.data) : callback([]) ;
	                },
	                error:(res)=>{
	                	console.error(res);
	                	callback([]);
	                }
	            })
            },
            selectEach( data , bool ){
            	data.check = bool ;
            	let selDeps = this.info.selectedAll.deps ;
            	if( bool ){
	            	selDeps[data.deptId] = data ;
            	}else {
            		delete selDeps[data.deptId] ;
            	}
            }
        }
    }

let tttt = {"code":0,"data":[{"deptId":147849,"szId":null,"deptName":"管会与资产负债事业部(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":147848,"szId":null,"deptName":"ERP事业部(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":148775,"szId":null,"deptName":"ERP解决方案部(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":147855,"szId":null,"deptName":"人力资源部(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":147856,"szId":null,"deptName":"财务部(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":147857,"szId":null,"deptName":"华东银行ABU(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":147860,"szId":null,"deptName":"保险信托事业部(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":147858,"szId":null,"deptName":"北方银行ABU(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":147859,"szId":null,"deptName":"养老金事业部(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":147861,"szId":null,"deptName":"华东证券综合ABU(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":147862,"szId":null,"deptName":"租赁事业部(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":147864,"szId":null,"deptName":"华北银行ABU(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":147869,"szId":null,"deptName":"金融与互联网业务系统平台部(2016)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":148005,"szId":null,"deptName":"实施交付管理部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":148006,"szId":null,"deptName":"咨询与售前部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":148007,"szId":null,"deptName":"开发部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":148010,"szId":null,"deptName":"支持服务部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":149142,"szId":null,"deptName":"石家庄业务部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":149610,"szId":null,"deptName":"香港-財務部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":149710,"szId":null,"deptName":"用友网络科技股份有限公司","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":149711,"szId":null,"deptName":"用友金融信息技术有限公司","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":149712,"szId":null,"deptName":"北京用友政务软件有限公司","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":149713,"szId":null,"deptName":"厦门用友烟草软件有限责任公司","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":149714,"szId":null,"deptName":"UF International Hol","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":149715,"szId":null,"deptName":"用友医疗卫生信息系统有限公司","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":149716,"szId":null,"deptName":"畅捷通信息技术股份有限公司","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":149717,"szId":null,"deptName":"北京用友幸福投资管理有限公司","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":163295,"szId":null,"deptName":"C3智能营销事业部(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163296,"szId":null,"deptName":"I2移动平台与服务事业部(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163297,"szId":null,"deptName":"I3数据平台与服务事业部(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163298,"szId":null,"deptName":"支持服务事业部(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163299,"szId":null,"deptName":"实施与项目管理部(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163300,"szId":null,"deptName":"2017.V1-BG事业群(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":163301,"szId":null,"deptName":"2017.V2-BG事业群(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":163310,"szId":null,"deptName":"华东证券综合ABU-数据部(2017)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163315,"szId":null,"deptName":"数字营销业务部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163339,"szId":null,"deptName":"其他工作组(2017)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163362,"szId":null,"deptName":"I1链融云-平台研发部(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163363,"szId":null,"deptName":"I1链融云-应用研发部(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":163365,"szId":null,"deptName":"北方证券综合ABU-客户营销中心(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163366,"szId":null,"deptName":"保险信托事业部本级(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":163367,"szId":null,"deptName":"保险信托-战略客户ABU(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163368,"szId":null,"deptName":"保险信托华东ABU(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":163369,"szId":null,"deptName":"保险信托华南ABU(撤销)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":163392,"szId":null,"deptName":"NC产品部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163396,"szId":null,"deptName":"华东证券综合ABU-开发部(2017)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163393,"szId":null,"deptName":"660SaaS运营部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163397,"szId":null,"deptName":"662数字营销研发部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":153974,"szId":null,"deptName":"服务与新业务事业部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":163402,"szId":null,"deptName":"门店管理部模块","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163408,"szId":null,"deptName":"人力协同实施部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163409,"szId":null,"deptName":"地产实施部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":163460,"szId":null,"deptName":"服务与新业务实施部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":166704,"szId":null,"deptName":"660上海三区","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":1},{"deptId":173115,"szId":null,"deptName":"北方银行-事业部本部-支持服务组(2017)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":155290,"szId":null,"deptName":"HCM业务支持部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":154266,"szId":null,"deptName":"实施交付部","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0},{"deptId":173267,"szId":null,"deptName":"华东证券综合ABU-HR业务部(2017)","status":null,"parentId":"0","createTime":null,"updateTime":null,"leaderMemberId":null,"haveSub":0}]}


</script>  
<style lang="less">

</style> 
