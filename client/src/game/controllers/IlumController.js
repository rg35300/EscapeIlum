export default class IlumController{

constructor(scene){

this.scene=scene;

this.speed=8;


this.keys=scene.input.keyboard.addKeys({

up:"Z",
down:"S",
left:"Q",
right:"D"

});


scene.input.on(
"wheel",
(pointer,objects,dx,dy)=>{

const cam=scene.cameras.main;

cam.zoom-=dy*0.001;

cam.zoom=Phaser.Math.Clamp(
cam.zoom,
0.5,
1.5
);

});

}


update(){

const cam=this.scene.cameras.main;


if(this.keys.left.isDown)
cam.scrollX-=this.speed;


if(this.keys.right.isDown)
cam.scrollX+=this.speed;


if(this.keys.up.isDown)
cam.scrollY-=this.speed;


if(this.keys.down.isDown)
cam.scrollY+=this.speed;


}

}