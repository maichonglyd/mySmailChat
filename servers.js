'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let userList = [];

http.listen(3000);
app.use("/",express.static(__dirname+"/web"));

io.on("connection",userConnection);

function userConnection(socket){
	console.log("a user connecting!!");
	let user = new User("",socket);
	userList.push(user);
	socket.on("disconnect",userDisconnect);
	socket.on("login",function (data){
		if(checkName(data)){
			socket.emit("login","ok");
			addName(data,socket);
			io.sockets.emit("system_login",data,userList.length);
		}else{
			socket.emit("login","have");
		}
	});
	socket.on("userChat",function(data){
		for(let i = 0,length=userList.length;i<length;i++){
			if(socket === userList[i].getSocket()){
				let msgObj = {
					nickName : userList[i].getName(),
					msg : data
				};
				io.sockets.emit("userChat",msgObj);
			}
		}
	})
	
}

function userDisconnect(){
	let i = 0;
	while(i<userList.length){
		if(userList[i].socket.disconnected){
			if(userList[i].nickName.trim().length!=0){
				io.sockets.emit("system_logout",userList[i].nickName,userList.length-1);
			}
			userList.splice(i,1);
			i--;
		}
		i++;
	}
}


function checkName(nickName){
	for(let i = 0,length=userList.length;i<length;i++){
		if(nickName == userList[i].nickName){
			return false;
		}
	}
	return true;
}
function addName(name,socket){
	for(let i = 0,length=userList.length;i<length;i++){
		if(userList[i].socket === socket){
			userList[i].nickName = name;
			console.log("nickName:",name);
		}
	}
}






class User{
	constructor(name,socket){
		this.nickName = name;
		this.socket = socket;
	}
	getName(){
		return this.nickName;
	}
	getSocket(){
		return this.socket;
	}
}