export default class IlumController{


constructor(scene){


this.scene=scene;


this.speed=10;



this.keys=
scene.input.keyboard.addKeys({

up:"Z",
down:"S",
left:"Q",
right:"D"

});



scene.cameras.main.setZoom(
0.8
);



scene.input.on(
"wheel",
(pointer,objects,dx,dy)=>{


let zoom=
scene.cameras.main.zoom;


zoom-=dy*0.001;



scene.cameras.main.setZoom(

Phaser.Math.Clamp(
zoom,
0.4,
1.5
)

);



});



}



update(){


const cam=
this.scene.cameras.main;



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