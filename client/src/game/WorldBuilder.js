import map from "../maps/HomeDepotMap.js";


export default class WorldBuilder{


constructor(scene){

    this.scene=scene;

    this.tileSize=32;

    this.walls=[];

}



create(){


for(let y=0;y<map.length;y++){


    for(let x=0;x<map[y].length;x++){


        if(map[y][x]==="#"){


            const wall=this.scene.add.image(
                x*this.tileSize+16,
                y*this.tileSize+16,
                "wall"
            );


            wall.setDisplaySize(
                this.tileSize,
                this.tileSize
            );


            this.scene.physics.add.existing(
                wall,
                true
            );


            this.walls.push(wall);


        }
        else{


            const ground=this.scene.add.image(
                x*this.tileSize+16,
                y*this.tileSize+16,
                "ground"
            );


            ground.setDisplaySize(
                this.tileSize,
                this.tileSize
            );


        }


    }

}


return this.walls;


}


}