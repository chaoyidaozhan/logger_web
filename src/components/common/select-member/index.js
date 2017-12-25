
import selectMemberBody from './select-member-body';
import treeDep from './tree-dep.vue';

export default {
    install(Vue, options) {
        // 生成部门递归组件 ;
        Vue.component('tree-dep',{
            mixins:[treeDep]
        });

        // 挂载实例
        let body   = document.body;
        let dom    = document.createElement('div');
            dom.id = 'selectMember';
            body.appendChild( dom );

        const DEFAULT_INFO = {
            title:'选择可见范围',  
            dep:false,
            team:false,
            man:false,    
            // 所有选中内容 ( 添加用的 );  
            selected:{ 
                dep :[],
                team:[],
                man :[]
            }
        }
        Vue.prototype.$selectMember = window.ok = new Vue({
            template:`<div id="selectMember"> 
                        <selectMemberBody :info="info" @submit="submit" @cancel="cancel"/> 
                    </div>`,  
            components:{
                selectMemberBody
            },
            data:()=>{
                return {
                    // 配置选项 ;
                    info:{...JSON.parse(JSON.stringify(DEFAULT_INFO)),open:false},
                    // 储存所有的部门,团队,人团 ( 右侧点击 删除用的 )
                    saveAjaxDep : [],
                    saveAjaxTeam: [],
                    saveAjaxMan : []
                }
            },
            mounted(){

            },
            methods:{
                show( config={} , callback ){
                    callback ? this.getSelectedCallback = callback : null ;
                    let info = {
                        ...JSON.parse(JSON.stringify(DEFAULT_INFO)),
                        ...config,
                        open:true,
                    }
                    console.log(DEFAULT_INFO)
                    !config.dep  ? info.selected.dep =[]  : this.setDefaultTure('dep') ;
                    !config.team ? info.selected.team=[]  : this.setDefaultTure('team') ;
                    !config.man  ? info.selected.man =[]  : this.setDefaultTure('man') ; 
                    this.info = info ;
                },
                // 设置传进来的为true 
                setDefaultTure( type ){
                    let idtype ;
                    let get  ; // 右侧得到的数据
                    let save ; // 储存的数据
                    if( type=='dep' ){
                        idtype = 'deptId' ;
                        get    = this.info.selected.dep;
                        save   = this.saveAjaxDep;
                    };
                    if( type=='team' ){
                        idtype = 'gid' ;
                        get    = this.info.selected.team;
                        save   = this.saveAjaxTeam;
                    };
                    if( type=='man' ){
                        idtype = 'memberId' ;
                        get    = this.info.selected.man;
                        save   = this.saveAjaxMan;
                    };
                    for( let i=0 ; i<get.length ; i++ ){
                        for( let j=0 ; j<save.length ; j++ ){
                            if( get[i][idtype]==save[j][idtype]){
                                save[j].checked = true ;
                            }
                        }
                    }
                },
                resetInfo(){
                    this.info = {...DEFAULT_INFO,open:false} ;
                    this.saveAjaxDep.map( v=>{
                        v.checked = false ;
                        // 部门全部折叠
                        v.openChild = false ;
                        v.open      = false ;
                    });
                    this.saveAjaxTeam.map( v=>{
                        v.checked = false ;
                    });
                    this.saveAjaxMan.map( v=>{
                        v.checked = false ;
                    });
                    // 重置关键字
                    this.$selectMember.$emit('resetKeyWord');
                },
                resetScrollTop(){
                    let doms = document.querySelectorAll('.sm_scroll');
                    try{
                        doms.forEach( v=>{
                           v.scrollTop=0;
                        });
                    }catch(e){
                        console.log(e)
                    }
                },
                submit(){
                    if(this.getSelectedCallback){
                        let obj = JSON.parse(JSON.stringify(this.info.selected));
                        this.getSelectedCallback(obj); 
                    };
                    this.resetInfo();
                },
                cancel(){
                    this.resetInfo();
                },
                // 点击左侧 右侧增加一个选中项 ;
                right_add( k , each ){
                    let arr = this.info.selected[k] ;
                    // 如果选择人员增加过滤 ( 暂时不用!!! );
                    // if( k=='man'){
                    //     let inarr = false ;
                    //     arr.map( (v)=>{
                    //         if(v.memberId == each.memberId){
                    //             inarr=true ;
                    //         }
                    //     })
                    //     !inarr ? arr.push(each) : null ;
                    // }else {
                        arr.push(each);   
                    // }
                },
                // 点击(左侧/右侧) 删除一个选中项目 ;
                right_del( k , model_each ){
                    let idtype ;
                    let save ;
                        if( k=='dep' ){
                            idtype = 'deptId';
                            save   =  this.saveAjaxDep ;
                        };
                        if( k=='team' ){
                            idtype = 'gid';
                            save   = this.saveAjaxTeam ;
                        };
                        if( k=='man' ){
                            idtype = 'memberId';
                            save   = this.saveAjaxMan ;
                        };
                    // model_each可能为请求数据的 也可能为后传进来的 , 需要从储存数据中拿到真实值 ;
                    let each ;
                        save.map( v=>{
                            // *** 数据中出现
                            if( v[idtype]==model_each[idtype] ){
                                each = v ;
                            }
                        }) 
                        // *** 数据中没出现(说明右侧出现数据 但是左侧还没数据)
                        if( !each ){
                            each=model_each ;
                        }

                    // 从右侧选中移除
                    let arr = this.info.selected[k] ;
                        arr.map((v,ind)=>{
                            if( each[idtype]==v[idtype] ){
                                each.checked = false ;
                                arr.splice( ind , 1 );
                            }
                        });
                },
            },
            el:"#selectMember"
        })
    }
};