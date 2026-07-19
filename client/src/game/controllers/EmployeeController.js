export default class EmployeeController{

constructor(scene){

this.scene=scene;

this.player=scene.physics.add.sprite(
200,
200,
"player"
);

this.player.setDisplaySize(
32,
32
);

this.player.setCollideWorldBounds(
true
);


this.speed=150;


this.keys=scene.input.keyboard.addKeys({

up:"Z",
down:"S",
left:"Q",
right:"D"

});

}


update(){

let x=0;
let y=0;


if(this.keys.left.isDown)x=-1;
if(this.keys.right.isDown)x=1;
if(this.keys.up.isDown)y=-1;
if(this.keys.down.isDown)y=1;


this.player.setVelocity(
x*this.speed,
y*this.speed
);


}

}