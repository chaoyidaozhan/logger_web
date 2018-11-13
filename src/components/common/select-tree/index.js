
import selectMemberBody from './select-member-body'
import treeDep from './tree-dep.vue'
import { i18n } from 'app_src/common/language/'
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

        const DEFAULT_INFO = ()=>{
            return{
                title:'选择可见范围',  
                dep:false,
                team:false,
                man:false,    
                // 所有选中内容 ( 添加用的 );  
                selected:{ 
                    dep :[] ,
                    team:[] ,
                    man :[]
                },
                // 上限
                limit:{
                    count:500,
                    showAll:false, //当limit为1时 可选择是否全选 ;
                    warning:'超出选择范围'
                },
            }
        };

        Vue.prototype.$selectTree = window.ok = new Vue({
            i18n,
            template:`<div id="selectMember" v-if="info.open">
                        <selectMemberBody :info="info" @submit="submit" @cancel="cancel"/> 
                      </div>`,  
            components:{
                selectMemberBody
            },
            data:()=>{
                return {
                    // 配置选项 ;
                    info:{ ...DEFAULT_INFO() ,open:false},
                    // 储存所有的部门,内部群,人团 ( 右侧点击 删除用的 )
                    saveAjaxDep : [],
                    saveAjaxTeam: [],
                    saveAjaxMan : []
                }
            },
            computed:{
                allowCheck(){
                    let all = this.info.selected.dep.length + this.info.selected.team.length + this.info.selected.man.length ;
                    let max = this.info.limit.count ;
                    if( all>=max ){
                        return false ;
                    }else {
                        return true ;
                    }
                }
            },

            methods:{
                show( config={} , callback ){
                    callback ? this.getSelectedCallback = callback : null ;
                    let info = {
                        ...DEFAULT_INFO() ,
                        ...config,
                        open:true,
                    };
                    !info.selected.dep  ? info.selected.dep =[]  : null ;
                    !info.selected.team ? info.selected.team=[]  : null ;
                    !info.selected.man  ? info.selected.man =[]  : null ; 
                    // 赋值
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
                    this.info = { ...DEFAULT_INFO() ,open:false} ;
                    this.saveAjaxDep  = [] ;
                    this.saveAjaxTeam = [] ;
                    this.saveAjaxMan  = [] ;
                },
                resetAllSelected(){
                    this.info.selected.dep   =[];
                    this.info.selected.team  =[];
                    this.info.selected.man   =[];
                    this.saveAjaxDep.map(  v =>v.checked=false ); 
                    this.saveAjaxTeam.map( v =>v.checked=false ); 
                    this.saveAjaxMan.map(  v =>v.checked=false );                     
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
                // 检查上限
                checkLimit( each , type ){
                    let info = this.info ;
                    // 当前没被点击时执行 *** 
                    if( !each.checked ){
                        // *** 选择全部不能再点击
                        // if( this.info.limit.showAll ){
                        //     if(type=='dep' && info.selected.dep.length>0 && info.selected.dep[0].deptId==0){
                        //         this.$Message.warning( '已点击全选' );
                        //         return false ;
                        //     };
                        //     if(type=='team' && info.selected.team.length>0 && info.selected.team[0].gid==0){
                        //         this.$Message.warning( '已点击全选' );
                        //         return false ;
                        //     };
                        //     if(type=='man' && info.selected.man.length>0 && info.selected.man[0].memberId==0){
                        //         this.$Message.warning( '已点击全选' );
                        //         return false ;
                        //     }
                        // };

                        if( info.limit.count==1 ){
                            //单选替换
                            let isRadio = false ;
                            let r_each , type ;
                            if( info.selected.dep.length>0 ){
                                r_each  = info.selected.dep[0] ;
                                isRadio = true  ;
                                type    = 'dep' ;
                            };
                            if( info.selected.team.length>0 ){
                                r_each  = info.selected.team[0] ;
                                isRadio = true   ;
                                type    = 'team' ;
                            };
                            if( info.selected.man.length>0 ){
                                r_each  = info.selected.man[0] ;
                                isRadio = true  ;
                                type    = 'man' ;
                            };   
                            // 单选已经选了 ;             
                            if( isRadio ){ 
                                this.right_del( type , r_each );
                            };
                        }else if( !this.allowCheck ){
                            // 多选提示
                            let str = info.limit.warning ;
                               !str ? str="超出选择范围" : null ;
                            this.$Message.warning( str );
                            return false ;
                        };
                    }
                    return true ;
                },
                // 全选
                checkAll( k ){
                    let info = this.info ;
                    // limit为1 直接替换
                    if( info.limit.count==1 && info.limit.showAll ){
                        this.resetAllSelected();
                        if( k=='dep' ){
                            this.info.selected.dep = [{
                                deptId:0,
                                deptName: `${this.$t('operate.all')}${this.$t('noun.department')}`
                            }]
                        };
                        if( k=='team' ){
                            this.info.selected.team = [{
                                gid:0,
                                groupName: `${this.$t('operate.all')}${this.$t('noun.internalGroup')}`
                            }]
                        };
                        if( k=='man' ){
                            this.info.selected.man = [{
                                memberId:0,
                                userName: `${this.$t('operate.all')}${this.$t('noun.personnel')}`
                            }]
                        };
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
                        arr.push(each);   
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
