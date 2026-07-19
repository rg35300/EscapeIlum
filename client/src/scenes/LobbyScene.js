import SocketManager from "../network/SocketManager.js";


export default class LobbyScene extends Phaser.Scene{


constructor(){

super("LobbyScene");

}



init(data){

this.session=data.session;

this.localReady=false;

}



create(){


const width=this.scale.width;
const height=this.scale.height;



this.add.text(
width/2,
50,
"LOBBY",
{
fontSize:"50px",
color:"#ffffff"
}
)
.setOrigin(0.5);



this.add.text(
width/2,
120,
"Session : "+this.session.id,
{
fontSize:"30px",
color:"#00ff00"
}
)
.setOrigin(0.5);



this.add.text(
width*0.25,
170,
"ROLES",
{
fontSize:"35px",
color:"#ffffff"
}
)
.setOrigin(0.5);



this.ilumContainer=
this.add.container(
width*0.25,
280
);



this.employeesContainer=
this.add.container(
width*0.25,
470
);



this.drawPlayers();



this.createRoleButtons();

this.createReadyButton();



this.playersListener=(session)=>{

this.session=session;

this.drawPlayers();

this.updateRoleButtons();

};



this.countdownListener=(time)=>{


if(this.countdownText)
this.countdownText.destroy();



this.countdownText=
this.add.text(
width/2,
height-80,
"START "+time,
{
fontSize:"45px",
color:"#ff0000"
}
)
.setOrigin(0.5);


};



this.startGameListener=(session)=>{


const me=
session.players.find(
p=>p.id===SocketManager.socket.id
);



if(!me)
return;



this.scene.start(
"GameScene",
{
session:session,
role:me.role
}
);



};



SocketManager.onPlayersUpdated(
this.playersListener
);


SocketManager.onGameCountdown(
this.countdownListener
);


SocketManager.onStartGame(
this.startGameListener
);



this.events.once(
"shutdown",
()=>{
SocketManager.socket.off(
"players_updated",
this.playersListener
);

SocketManager.socket.off(
"game_countdown",
this.countdownListener
);

SocketManager.socket.off(
"start_game",
this.startGameListener
);

}
);



}



drawPlayers(){


this.ilumContainer.removeAll(true);

this.employeesContainer.removeAll(true);



const ilum=
this.session.players.find(
p=>p.role==="ilum"
);



if(ilum){


const avatar=
this.add.image(
-120,
0,
ilum.avatar
);



avatar.setDisplaySize(
60,
60
);



const text=
this.add.text(
-50,
0,
ilum.name,
{
fontSize:"24px",
color:"#ffffff"
}
)
.setOrigin(0,0.5);



this.ilumContainer.add([
avatar,
text
]);

}



let y=0;



this.session.players
.filter(
p=>p.role==="employee"
)
.forEach(
player=>{


const avatar=
this.add.image(
-120,
y,
player.avatar
);



avatar.setDisplaySize(
55,
55
);



const text=
this.add.text(
-50,
y,
player.name,
{
fontSize:"22px",
color:"#ffffff"
}
)
.setOrigin(0,0.5);



this.employeesContainer.add([
avatar,
text
]);



y+=60;


}
);



}




createRoleButtons(){


const w=this.scale.width;



this.ilumButton=
this.add.text(
w*0.25,
620,
"DEVENIR ILUM",
{
fontSize:"22px",
backgroundColor:"#c084fc",
color:"#000000",
padding:{
x:15,
y:10
}
}
)
.setOrigin(0.5)
.setInteractive();



this.employeeButton=
this.add.text(
w*0.55,
620,
"DEVENIR EMPLOYEE",
{
fontSize:"22px",
backgroundColor:"#555555",
color:"#ffffff",
padding:{
x:15,
y:10
}
}
)
.setOrigin(0.5)
.setInteractive();



this.ilumButton.on(
"pointerdown",
()=>{
SocketManager.changeRole("ilum");
}
);



this.employeeButton.on(
"pointerdown",
()=>{
SocketManager.changeRole("employee");
}
);



}



updateRoleButtons(){


const me=
this.session.players.find(
p=>p.id===SocketManager.socket.id
);



if(!me)
return;



this.ilumButton.setText(
me.role==="ilum"
?"ILUM ✓"
:"DEVENIR ILUM"
);



this.employeeButton.setText(
me.role==="employee"
?"EMPLOYEE ✓"
:"DEVENIR EMPLOYEE"
);



}



createReadyButton(){


this.readyButton=
this.add.text(
this.scale.width/2,
this.scale.height-40,
"READY",
{
fontSize:"30px",
backgroundColor:"#008800",
padding:{
x:25,
y:10
}
}
)
.setOrigin(0.5)
.setInteractive();



this.readyButton.on(
"pointerdown",
()=>{


if(this.localReady)
return;



SocketManager.playerReady();


this.localReady=true;


this.readyButton.setText(
"READY ✓"
);



}
);



}


}