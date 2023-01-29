<template>
	<div class="main" v-loading="loading">
		<!-- 联系人 -->
		<div class="main-left">
			<div class="main-left-header">
				<div
					class="main-left-header-icons"
					v-for="icon in icons"
				>
					<component
						class="main-left-header-icons-icon"
						:is="icon.icon"
						:key="icon.id"
						style="width: 16px; height: 16px"
					></component>
				</div>
			</div>
			<div class="main-left-contacts" >
				<div class="main-left-contacts-inner" >
					<div
						class="main-left-contacts-inner-box"
						:class="{'activeCss':activeIndex==index}"
						ref="box"	
						v-for="(i, index) in FriendsInfo"
						:key="index"
						@click="getFriendMsg(index,userName,i.userName)"
					>	
						<el-avatar :size="50" :src="`${BASEURL}/${i.avatar}`" />
						<span class="main-left-contacts-inner-box-friendName">{{ i.userName }}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 聊天界面 -->
		<div class="main-right">

			<div
				class="main-right-top"
				ref="scrollView"
			>
				<li
					v-for="(ele, index) in inputs"
					:key="index"
				>
					<li
						class="chat left"
						v-if="ele.id === 0"
					>
						<span class="oneSelf">
							<img
								width="50"
								height="50"
								:src="avatarAddressRight"
								alt=""
							/>
						</span> 
						<!-- 语音 -->
						<span class="chat recorder" v-if="ele.msg.types==1"  @click="startAudio(ele.msg.audio)">{{ ele.msg.duration+"\""}}</span>
						<!-- 文字 -->
						<span class="chat"  v-if="ele.msg.types==0">{{ ele.msg.message }}</span>
					</li>
					<li
						class="chat right"
						v-if="ele.id === 1"
					>
						<span class="chat recorder" v-if="ele.msg.types==1"  @click="startAudio(ele.msg.audio)">{{ele.msg.duration+"\""}}</span>
						<span class="chat"  v-if="ele.msg.types==0" >{{ ele.msg.message }}</span>
						<span class="oneSelf">
							<img
								width="50"
								height="50"
								:src="avatarAddressLeft"
								alt=""
							/>
						</span>
					</li>
				</li>

			</div>
			<div v-show="showRecorder" class="sendRecorder">
				<span class="sendRecorder-showAnimate" :style="{width:RecorderTime*1.6666+'%'}"></span>
				<div class="sendRecorder-Left">
					<span @click="sendAudio" clsss="sendRecorder-Left-btn">发送</span>
					<span @click="cancelAudio" clsss="sendRecorder-Left-btn">取消</span>
				</div>
			</div>	

			<div class="main-right-bottom">
				<div class="someFunctions">
					<span v-for="(i) in emojiesPNGS" :key="i.id">
						<img @click="showFunctions(i.id)" class="someFunction" :src='i.component' />
					</span>

					<div class="emojis" v-if="showEmoji">
						<span class="emoji"  v-for="(emo,index) in emoji.data.split(',')" :key="index" @click="sendEmoji(index)">
							{{ emo }}
						</span>
					</div>
				</div>
				
				<el-input
					v-model="inputValue"
					:rows="6"
					:clearable="true"
					type="textarea"
					resize="none"
					@keyup.enter="sendMsg"
				/>
				<el-button
					class="main-right-bottom-btn"
					type="primary"
				>
					<span
						class="main-right-bottom-btn-send"
						@click="sendMsg"
					>
						发送(S)
					</span>
					<el-dropdown
						trigger="click"
						@command="handleCommand"
					>
						<span class="main-right-bottom-select">
							<component :is='ArrowDown'></component>
						</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="a">您好,我现在有事不在,一会再和您联系</el-dropdown-item>
								<el-dropdown-item command="b">工作中,请勿打扰</el-dropdown-item>
								<el-dropdown-item command="c">我去吃饭了,一会再联系</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</el-button>
			</div>
			<!-- <div @click="transFormText">文字转语音</div> -->
		</div>
	</div>
	<teleport to='.home' >
		<div class="pos" v-if="state().IsStartAudio">
			正在播放语音
		</div>
	</teleport>


</template>

<script setup lang="ts">
import { Service, Link, Pointer, Position, Avatar, Comment, ArrowDown } from '@element-plus/icons-vue';
import { getFriendInfoAPI,getMsgAPI } from '../api/index'
import { FriendsType, MsgType, ReceiveMsgType, UserFulExpressionType } from '@/types/Type';
import { Socket } from '../socket/index';
import { state } from '../store/index';
import { startRecorder,recorder, checkBuffer } from '../utils/audioRecorder';
import { ElNotification } from 'element-plus';
import emoji from '../emoji/emoji.json'
import emojiesPNGS from '../emoji/emoji.js'



let	FriendsInfo = reactive<FriendsType[]>([]) 
const BASEURL = import.meta.env.VITE_BASE_URL;
const userName = localStorage.getItem('userName') as string
const box = ref<any>(null)
const activeIndex = ref()
const scrollView = ref<any>(null)
const avatar = localStorage.getItem('avatar')
const avatarAddressLeft = ref(`${BASEURL}${avatar}`);
const avatarAddressRight = ref('');
const inputs = reactive<MsgType[]>([]);
const inputValue = ref<string>('');
const NowCheckIndex = ref(state().NowCheckIndex)
const RecorderTimer = ref()
const RecorderTime = ref(0)

const showEmoji = ref(false)
const showRecorder = ref(false)
// == icon ==
const icons = [
	// Service, Link, Pointer, Position
	{
		id: 0,
		icon: Service,
	},
	{
		id: 1,
		icon: Link,
	},
	{
		id: 2,
		icon: Pointer,
	},
	{
		id: 3,
		icon: Position,
	},
	{
		id: 4,
		icon: Avatar,
	},
	{
		id: 5,
		icon: Comment,
	},
];
// == 常用语 ==
const UserFulExpression = <UserFulExpressionType[]>[
	{
		command: 'a',
		message: '您好,我现在有事不在,一会再和您联系'
	},
	{
		command: 'b',
		message: '工作中,请勿打扰'
	},
	{
		command: 'c',
		message: '我去吃饭了,一会再联系'
	}
]
let loading = ref(state().loading)

// == 接收消息 ==
Socket.on('returnmsg', (msg: string) => {
	// == 如果是接收,id就为0 ==
	inputs.push({
			id: 0,
			msg: {
				message: `${msg}`,
				time: new Date() as unknown as string,
				types: 0,
			},
		});
});
Socket.on('returnaudio',async(msg:ArrayBuffer,duration:number)=>{
	inputs.push({
		id: 0,
		msg: {
			message:duration+"\"",
			time: new Date() as unknown as string,
			types:1,
			duration,
			audio:msg,
		},
	});
})
// == 获取朋友信息 ==
const getFriendInfo = async() =>{
	let res = await getFriendInfoAPI({userName})
	console.log('res======>',res);
	if(res.data.code ===10001){
		ElNotification({
			message:res.data.msg,
			type:'success',
			duration:2000
		})
	}
	if(res.data.data){
		// 在onMounted中直接赋值会失去响应式
		FriendsInfo.push(...res.data.data)
		return FriendsInfo
	}else {
		return
	}
}
// == 获取朋友聊天记录 == 
const getFriendMsg = async(
	index: number,
	userName:string,
	friendName:string
) => {
	if(index!==activeIndex.value){
		inputs.length = 0
		let data = await getMsgAPI({userName,friendName})
		const { userMsg,friendMsg } = data.data.data
		const Msg = [userMsg,friendMsg].flat(2)
		Msg.forEach((m:ReceiveMsgType,index)=>{
			index > userMsg.length-1? inputs.push({
				id: 0, msg: m,
				}) : inputs.push({
				id: 1, msg: m,
				})
		})
		inputs.sort((a,b):number=>{
			const ATime = new Date(a.msg.time).getTime()
			const BTime = new Date(b.msg.time).getTime()
			if(ATime>BTime){
				return 1
			}else {
				return -1
			}	
		})
		// console.log('inputs2',inputs);
		
		activeIndex.value = index
		avatarAddressRight.value = `${BASEURL}${FriendsInfo[activeIndex.value].avatar}`
	}
}
// 获取常用语
const handleCommand = (
	command: string | number | object
) => {
	UserFulExpression.forEach((e) => 
	{
		if (e.command == command) {
			inputValue.value = e.message
		} else {
			return
		}
	})
	return
}
// == 展示表情包 ==
const showFunctions = (i:number)=>{
	switch (i) {
		// 如果是0就为表情包
		case 0:
			showEmoji.value = !showEmoji.value
			break;
		// 如果是1就为语音输入
		case 1:
			// 如果有一个语音进程启动时,就无法启动另一个
			if(RecorderTime.value!=0){	
				ElNotification({
					title: '录制出错',
					message: '当前已有一个录音进程,请先关闭该进程',
					type: 'warning',
					offset:50,
					duration:1500,
					showClose: false,
				})
				return 
			}
			// 展示并开始录制,并显示录制中,一个是发送,一个是取消
			showRecorder.value = !showRecorder.value
			// 开始录制,每一秒增加一,
			RecorderTimer.value = setInterval(()=>{
				RecorderTime.value++
			},1000)
			startRecorder()
		default:
			break;
	}
}
// == 选择表情包 ==
const sendEmoji = (index:number)=>{
	showEmoji.value = !showEmoji.value
	inputValue.value += emoji.data.split(',')[index]
}
// == 发送消息 ==
const sendMsg = () => {
	if (inputValue.value.trim().length != 0) {
		Socket.emit('msg',{ 
			msg: inputValue.value.trim(), 
			id: Socket.id,
			userName:localStorage.getItem('userName') as string,
			friendName:FriendsInfo[activeIndex.value].userName 
		});
		// == 如果是发送,id就为1 ==
		inputs.push({
				id: 1,
				msg: {
					message: `${inputValue.value.trim()}`,
					time: new Date() as unknown as string,
					types: 0
				},
			});
		inputValue.value = '';
	} else {
		ElNotification({
			title: '输入出错',
			message: '输入不能为空',
			type: 'warning',
			offset:50,
			duration:1500,
			showClose: false,
		})
		inputValue.value = ''
		return
	}
};
// == 发送语音 ==
const sendAudio = async ()=>{
	if(recorder.duration < 1){
		return 
	}
	RecorderTime.value = 0
	clearInterval(RecorderTimer.value)
	showRecorder.value = !showRecorder.value
	recorder.stop()
	const friendName = FriendsInfo[activeIndex.value].userName 
	const blob = recorder.getWAVBlob()
	console.log('blob========>',blob);
	const reader = new FileReader()
	reader.readAsDataURL(blob)
	// console.log('	reader.result===>',	reader.result);
	reader.onload = function(e){
		// console.log(e.target?.result);
		console.log('URL.createObjectURL(blob)===>',URL.createObjectURL(blob));
		
		
	}
	// reader?.onload(function(data) {
	// 	console.log(data);
	// })

	// == 触发事件,后端保存语音,调用接口,返回该数据 ==
	Socket.emit('audio',{ 
		msg:blob, 
		duration:Math.floor(recorder.duration),
		id: Socket.id,
		userName:localStorage.getItem('userName') as string,
		friendName
	});
	// == 右边 == 
	inputs.push({
		id: 1,
		msg: {
			time: new Date() as unknown as string,
			types:1,
			duration:Math.floor(recorder.duration),
			audio:blob,
		},
	});
}
// == 取消发送 ==
const cancelAudio = async ()=>{
	RecorderTime.value = 0
	clearInterval(RecorderTimer.value)
	showRecorder.value = !showRecorder.value
	recorder.stop()
	recorder.destroy()
}
// == 播放语音 ==
const startAudio = async (audioSource: any | Blob)=>{
	// 如果是第一次播放,就判断是否为first
	// 如果正在播放就return
	if(state().IsStartAudio){
		return
	}
	let BF = null;
	if(audioSource.type==='Buffer'){
		BF = Buffer.from(audioSource as Buffer);
		checkBuffer(BF.buffer)
	}else if(audioSource.type==="audio/wav"){
		const reader = new FileReader()
		reader.onload = function(){
			checkBuffer(this.result as ArrayBuffer)
		}
		reader.readAsArrayBuffer(audioSource)
	}else {
		checkBuffer(audioSource)
	}
}

// == 文字转语音 ==
const transFormText = async()=>{
	const synth = window.speechSynthesis;
	const utterThis = new SpeechSynthesisUtterance('你好,我叫康梦玥');
	utterThis.lang = 'en-US'
  synth.speak(utterThis);
}


// == 监视聊天变化,调整窗口位置 ==
watch(()=>inputs.length,(now,pre)=>{
	if(now!==pre){
		nextTick(()=>{
			scrollView.value.scrollTo({ top: scrollView.value.scrollHeight, behavior: 'smooth' })
		})
	}
},{immediate:false,deep:false})
onMounted(async() => {
	let userName = localStorage.getItem("userName") as string

	let data =  await getFriendInfo() 
	if(data){
		getFriendMsg(NowCheckIndex.value,userName,data[NowCheckIndex.value].userName)
	}
	if (state().loading) {
    setTimeout(()=>{
			loading.value = false
		},1500)
  }
})
// == 加载显示使用该生命周期函数 ==
onUnmounted(()=>{
	state().loading = false
	state().NowCheckIndex = activeIndex.value
})
</script>

<style scoped lang="less">

:deep(.el-textarea__inner::-webkit-scrollbar) {
	display: none;
}

:deep(.el-button) {
	border-radius: 0;
}

:deep(.el-textarea__inner) {
	transform: translateY(32px);
	height: 160px;
	padding: 6px 7px;
	font-size: 18px;
	border-radius: 0;
	box-shadow: none;
}

li {
	list-style: none;
}

.emojis {
	cursor: pointer;
	width: 40vw;
	height: 28vw;
	transform: translate3d(-175px, -162px, 0);
	overflow-y: scroll;
	background-color: #fff;
	box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
	padding: 6px;
	will-change: transform;
	.emoji {
		background: #ffffff;
    width: 40px;
    display: inline-block;
    text-align: center;
    line-height: 48px;
    font-size: 30px;
    border: 1px solid #ffffff;
		&:hover {
			background-color: #f3f3f4;
		}
	}
}
.activeCss {
	background-color: #ebeced;
}
.pos {
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 20%;
	width: 150px;
	height: 150px;
	background-color: grey;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
}
.sendRecorder {
	position: relative;
	display: flex;
	justify-content:space-between;
	align-items: center;
	width: 100%;
	height: 30px;
	background-color: #dfe6ec;
	&::before {
		position: absolute;
		left: 5px;
		content: '正在录音...';
	}
	&-showAnimate {
		height: 30px;
		line-height: 30px;
		background-color: #bee8f8;
	}
	&-Left{
		display: flex;
		width: 100px;
		height: 30px;
		justify-content: space-around;
		align-items: center;
		span {
			cursor: pointer;
			width: 40px;
			background-color: #ebebeb;
			border-radius: 5px;
			text-align: center;
			border: 1px solid #000;
			:hover {
				background-color: #bbbaba;
			}
		}
	}
}
.left {
	display: flex;
	justify-content: flex-start;
	align-content: center;

	.chat {
		width: fit-content;
		height: fit-content;
		max-width: 300px;
		margin-left: 10px;
		margin-top: 5px;
		font-size: 18px;
		background-color: #fff;
	}
}

.right {
	display: flex;
	justify-content: flex-end;
	align-content: center;

	.chat {
		width: fit-content;
		height: fit-content;
		max-width: 300px;
		margin-right: 10px;
		margin-top: 5px;
		color: #fff;
		font-size: 18px;
		background-color: #0199ff;
	}
}

.chat {
	line-height: normal;
	border-radius: 8px;
	padding: 9px
}
.recorder {
	cursor: pointer;
}
.main {
	display: flex;
	height: calc(100vh - 50px);
	color: black;

	&-left {
		width: 28%;
		background-color: #ffffff;
		border: 1px solid #eee;
		border-top: none;
		border-bottom: none;

		&-header {
			box-sizing: border-box;
			width: 100%;
			height: 50px;
			display: flex;
			justify-content: space-around;
			align-items: center;
			border-bottom: 1px solid #eee;

			&-icons {
				width: 28px;
				height: 28px;
				border-radius: 5px;
				display: flex;
				justify-content: center;
				align-items: center;

				&-icon {
					vertical-align: middle;
				}

				&:hover {
					background-color: #eee;
				}
			}
		}

		&-contacts {
			display: flex;
			flex-direction: column;
			height: fit-content;
			&-inner {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				height: auto;
				width: 100%;
				margin-top: 1px;

				&-box {
					box-sizing: border-box;
					cursor: pointer;
					width: 95%;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					height: 60px;
					border-radius: 8px;
					font-size: 14px;
					padding: 5px 10px;
					margin-bottom: 1px;
					&:hover {
						background-color: #f0f1f2;
					}
					&-friendName {
						margin-left: 10px;
						margin-bottom: 15px;
					}
				}
			}
		}
	}

	&-right {
		display: flex;
		flex-direction: column;
		flex: 7;
		&-top {
			background-color: #f1f1f1;
			flex: 8;
			overflow: auto;
			overflow-wrap: break-word;

			.oneSelf {
				img {
					margin-left: 10px;
					border-radius: 50%;
				}
			}
		}

		&-bottom {
			position: relative;
			display: flex;
			flex: 2;
			flex-direction: column;
			align-items: flex-end;
			border-top: 1px solid #eee;
			box-sizing: border-box;
			height:200px;
			.someFunctions {	
				display: flex;
				justify-content: flex-start;
				align-items: center;
				position: absolute;
				z-index: 1;
				width: 100%;
				height: 34px;
				.someFunction{
					cursor: pointer;
					display: block;
					width: 34px;
					height: 34px;
					transition: .3s;
					will-change: transform;
					&:hover {
						transform: translateY(-1px);
					}
				}
			}	
			button {
				transform: translateY(-30%);
			}
			&-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 3px 0px 3px 10px;
				// margin-top: 10px;
				margin-right: 10px;
				font-size: 12px;
				background-color: #12b7f5;

				&-send {
					display: flex;
					align-items: center;
					justify-content: center;
					height: 32px;
					padding-right: 10px;

				}
			}

			&-select {
				display: flex;
				width: 20px;
				height: 30px;
				padding: 0px 5px;
				justify-content: center;
				align-items: center;
				background-color: #12b7f5;

				svg {
					width: 14px;
					color: #fff;
				}

				&:hover {
					background-color: #47c8f8;
				}
			}
		}
	}
}
</style>
