import Phaser from "phaser";
import WorldBuilder from "../game/WorldBuilder.js";
import EmployeeController from "../game/controllers/EmployeeController.js";
import IlumController from "../game/controllers/IlumController.js";


export default class GameScene extends Phaser.Scene{

constructor(){
super("GameScene");
}


init(data){

this.role=data.role;
this.session=data.session;

}


create(){

const walls=new WorldBuilder(this).create();


if(this.role==="ilum"){

this.controller=new IlumController(this);

}else{

this.controller=new EmployeeController(this);

}


if(this.controller.player){

this.physics.add.collider(
this.controller.player,
walls
);

}


this.createCamera();

}



createCamera(){

if(this.role==="employee"){

this.cameras.main.startFollow(
this.controller.player,
true,
0.1,
0.1
);

this.cameras.main.setZoom(1.5);

}else{

this.cameras.main.setZoom(0.8);

}

}



update(){

this.controller.update();

}

}