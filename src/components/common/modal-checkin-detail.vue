<template>

	<!-- 考勤签到列表详情 -->
	<!-- 内勤 + 外勤 -->

	<div>
        <Modal
            v-model="open"
            title="考勤详情"
            class="signin-modal my_checkin_modal_detail"
            width="520">
	        <div class="detail">
	        	<p class="p1">{{getDate(detail.signDate)}}</p>
	        	<p class="p2">
	        		<span class="s1">
	        			考勤打卡{{detail.signinCounter}}次 
	        				工时<font class="font">{{getTime(detail.workHours)}}</font>
	        		</span>
	        		<span class="s2">
	        			考勤班次：{{detail.workShift}}
	        		</span>
	        	</p>
	        </div>
	        <div class="list">
	        	 <no-data v-if="detail.attendances && !detail.attendances.length" style="margin-top:85px"/>
	        	 <ul>
	        	 	<li v-for="each in detail.attendances">
	        	 		<div class="d1">
	        	 			<div class="heiht"></div>
	        	 			<div class="dot"></div>
	        	 		</div>
	        	 		<div class="d2">
	        	 			<div class="in-d2">
		        	 			<p class="p1">
		        	 				{{each.attendanceTime}}
		        	 				<span class="sp" v-if="each.status != 0" :class="{out:each.status==5}">
		        	 					{{getStatus(each.status)}}
		        	 				</span>
		        	 			</p>
		        	 			<p class="p2" v-show="each.attendanceAddress" >
		        	 				{{each.attendanceAddress}}
		        	 			</p>
		        	 			<p class="p2" v-show="!each.attendanceAddress">
		        	 				暂无
		        	 			</p>
		        	 			<!-- 存在外勤 -->
		        	 			<div class="legWorkAttendance" v-if="each.legWorkAttendance">
		        	 				<p class="f">部门负责人:{{each.legWorkAttendance.dealManName}}</p>
		        	 				<p>外勤说明:{{each.legWorkAttendance.legWorkReason}}</p>
									<span v-if="each.legWorkAttendance.dealStatus==1" class="icon-status-signet-yes"/>
									<span v-if="each.legWorkAttendance.dealStatus==2" class="icon-status-signet-no"/>
		        	 			</div>
		        	 		</div>
	        	 		</div>
	        	 	</li>
	        	 </ul>
	        </div>
        </Modal>
	</div>
</template>
<script type="text/javascript">

	/*
		考勤详情浮层 
		通过调用 this$refs.name.show( 考勤id ) 
	*/

	import FormatTime from '../../filters/format-time'; // 'YYYY年MM月DD日 HH:mm:ss 周E'
	import NoData from '../../components/common/no-data';

	export default {
		components:{
			NoData
		},
		data(){
			return {
				open:false,
				detail:''
			}
		},
		methods:{
			getDate( stmp ){
				if( !stmp ){
					return '';
				}
				var d = new Date( stmp );
				return FormatTime( d , 'YYYY-MM-DD 周E' )				
			},
			getTime( s ){
				if( !s ){
					return '';
				}
				let allm = s/60 ;
				let h = Math.floor(s/3600);
				let m = allm - h*60 ;
				if(!m){
					return h+'小时';
				}
				return " "+h+'小时'+m+'分';
			},
			getStatus( s ){
				 // 0=正常 1=迟到 2=早退 3=漏打卡 4=缺勤 5=外勤
				if( s==1 ){
					return '迟到'
				}
				if( s==2 ){
					return '早退'
				}
				if( s==3 ){
					return '漏打卡'
				}
				if( s==4 ){
					return '缺勤'
				}
				if( s==5 ){
					return '外勤'
				}
				if( !s ){
					return '';
				}
			},
			getDetail( id ){
	            this.$ajax({
	                url: '/signin/myAttentance/getDetails',
	                data: {
	                    attendanceId:id
	                },
	                success: (res)=>{
	                    if(res && res.code == 0) {
	                        this.detail = res.data ;
	                    } else {
	                        this.$Message.warning((res && res.msg) || '网络错误');
	                    }
	                },
	                error: (res)=>{
	                    this.$Message.error((res && res.msg) || '网络错误');
	                }
	            })
			},
			show( id ){
				this.getDetail( id );
				this.open = true ;
			}
		},
	}




</script>
<style lang="less">
	.my_checkin_modal_detail{
        [class^="icon-status"]{
		    position: absolute;
		    right: 27px;
		    bottom: 4px;
		    font-size: 63px;
        }
		.ivu-modal-header{
			padding-left: 20px;
			padding-right: 20px;
		}
		.detail{
			height: 72px;
			border-bottom: 1px solid #e9eaec;
			.p1{
				font-size: 18px;
				color: rgb(55, 183, 253);
				padding-bottom: 10px;
			padding-left: 4px;
			padding-right: 4px;
			}
			.p2{
			padding-left: 6px;
			padding-right: 6px;
				.s2{float: right;}
				.font{
					color: rgb(36, 216, 253)
				}
			}
		}
		.list{
			height: 300px;
			overflow-y: scroll;
			padding-top: 5px;
			li{
				position: relative;
				padding-left: 65px;
				.d1{
					height: 100%;
					width:60px;
					position: absolute;
					left: 0;top: 0;
					.heiht{
						width: 1px;height: 100%;
						background: rgb(55, 183, 253);
						position: absolute;
						left: 30px;
					}
					.dot{
						position: absolute;
						width: 9px;height: 9px;
						border: 3px solid white;
						background: rgb(55, 183, 253);
						border-radius: 50%;
						left: 23px;top: 30px;
						box-sizing: unset;
					}
				}
				.d2{
					min-height: 80px;
					padding: 5px 0;
					width: 400px;
					.in-d2{
						padding: 10px 0 ;min-height: 70px;
						border-top: 1px solid transparent;
						box-sizing: border-box;
						background: rgb(245, 245, 245);
						border-radius: 6px;
						position: relative;
						height: 100%;
						text-indent: 20px;
						&::before{
							content: "";
							display:inline-block;
							width: 0;height: 0;
							border: 9px solid rgb(245, 245, 245);
							border-left-color:transparent;border-top-color:transparent;border-bottom-color:transparent;
							position: absolute;
							left: -18px;top: 23px;
						}
						.legWorkAttendance{
							color: #999;
							text-indent: 0px;
							padding:0 20px;
							.f{
								border-top:1px solid rgb(224, 224, 224);
								margin-top: 3px;
								padding-top: 2px;
							}
						}
						.p1{
							font-size: 16px;
							color: rgb(51,51,51);
							position: relative;
							.sp{
								display: inline-block;
								border-radius: 4px;
								padding: 0px 5px;
								background-color: rgb(255, 103, 128);
								color: rgb(255, 255, 255);
								font-size: 12px;
								margin-left: 6px;
								bottom: 1px;
								text-indent: 0px;
								position: relative;
								top: -1px;
							}
							.out{
								background: #37b7fd;
							}
						}
						.p2{
							padding: 0 10px 0 20px;
							text-indent: 0px;
							font-size: 13px;
							color: rgb(153, 153, 153);
							position:relative;top:1px;
						}
					}
				}
			}
		}
	}
</style>