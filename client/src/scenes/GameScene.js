import Phaser from "phaser";

import WorldBuilder from "../game/WorldBuilder.js";

import EmployeeController from "../game/controllers/EmployeeController.js";
import IlumController from "../game/controllers/IlumController.js";



export default class GameScene extends Phaser.Scene{


constructor(){

super("GameScene");

}



init(data){

this.session=data.session;

this.role=data.role;

}



create(){



const builder=
new WorldBuilder(this);



const walls=
builder.create();





if(this.role==="ilum"){


this.controller=
new IlumController(this);


}
else{


this.controller=
new EmployeeController(this);



this.physics.add.collider(
this.controller.player,
walls
);



this.cameras.main.startFollow(
this.controller.player,
true,
0.1,
0.1
);



this.cameras.main.setZoom(
1.5
);



}



this.cameras.main.setBounds(
0,
0,
640,
640
);



}



update(){


if(this.controller)
this.controller.update();



}


}