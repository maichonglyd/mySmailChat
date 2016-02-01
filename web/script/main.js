
var nickName = "";
window.onload = function(){
	init();
}

function init(){

var info			= document.getElementById("info");
var nickWrapper		= document.getElementById("nickWrapper");
var nicknameInput	= document.getElementById("nicknameInput");
var loginBtn		= document.getElementById("loginBtn");
var chatMsg			= document.getElementById("chatMsg");
var chatSendBtn		= document.getElementById("chatSendBtn");
var loginPage		= document.getElementById("loginPage");
	
	info.textContent = "正在连接...."
	nickWrapper.style.display = "none";
	socket = io.connect("http://localhost:3000");
	
	socket.on("connect", function (){
		info.textContent = "请输入昵称！";
		nickWrapper.style.display = "block";
		nicknameInput.focus();


		loginBtn.addEventListener("click",function (){
			var _nickName =  nicknameInput.value;
			if(_nickName.trim().length!=0){
				socket.emit("login",_nickName);
				nickName = _nickName;
			}else{
				nicknameInput.focus();
				nicknameInput.value = "";
			}
		},false);

		chatSendBtn.addEventListener("click",function(){
			var _msg = chatMsg.value;
			if(_msg.trim().length !=0){
				socket.emit("userChat",_msg);
			}
			chatMsg.value = "";
			chatMsg.focus();
		});
	});
	socket.on("login",function (data){
		if(data == "ok"){
			loginPage.style.display = "none";
			document.title = "我的聊天室 | " + nickName;
			chatMsg.focus();
		}else if(data == "have"){
			info.textContent = "昵称被占用，请重新输入！";
			nicknameInput.value = "";
			nicknameInput.focus();
		}
	});
	socket.on("system_login",function (data,count){
		if(data == nickName){
			insertMsg("system_login","我","已加入聊天室,目前有" + count + "位用户在线");
		}else{
			insertMsg("system_login",data,"已加入聊天室,目前有" + count + "位用户在线");
		}
	});
	socket.on("system_logout",function (data,count){
		insertMsg("system_logout",data,"已离开聊天室,目前有" + count + "位用户在线");
	});
	socket.on("userChat",function (data){
		insertMsg("userChat",data.nickName,data.msg);
	});
}


function insertMsg(type,name,msg){
	var color = "#f00";
	var space = ":";
	switch(type){
		case "system_login":
		case "system_logout":
			color="#f00";
			space = "";
			break;
		case "userChat":
			if(name == nickName){
				color = "#080";
				name = "我";
			}else{
				color = "#088";
			}
			space = ":<br/>&nbsp;&nbsp;"
			break;
	}

	var chatValue = document.getElementById("chatValue");
	var newNode = document.createElement("div");
	newNode.innerHTML = "<p width='790px' style='word-wrap:break-word'><font  color='"+color+"'>"+name +space+msg+"</font></p>";
	chatValue.appendChild(newNode);

	chatValue.scrollTop = chatValue.scrollHeight;

}



