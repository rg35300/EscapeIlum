import Phaser from "phaser";
import SocketManager from "../network/SocketManager.js";

export default class IlumScene extends Phaser.Scene {

    constructor(){
        super("IlumScene");
    }

    init(data){

        this.session = data.session;

        this.energy = 1000;

        this.gridSize = 150;
        this.cellSize = 32;

        this.mapX = 450;
        this.mapY = 40;

        this.objects = [];
        this.grid = [];

        this.draggingObject = null;

        this.items = {
            wall:{
                texture:"wall",
                name:"Mur",
                price:10,
                blocked:true
            },
            enemy:{
                texture:"enemy",
                name:"Ennemi",
                price:100,
                blocked:false
            },
            latexPit:{
                texture:"latexPit",
                name:"Trou Latex",
                price:50,
                blocked:true
            },
            squeakIlum:{
                texture:"squeakIlum",
                name:"Squeak",
                price:150,
                blocked:false
            },
            gliderUp:{
                texture:"gliderUp",
                name:"Glider Haut",
                price:75,
                blocked:true
            },
            gliderDown:{
                texture:"gliderDown",
                name:"Glider Bas",
                price:75,
                blocked:true
            },
            gliderLeft:{
                texture:"gliderLeft",
                name:"Glider Gauche",
                price:75,
                blocked:true
            },
            gliderRight:{
                texture:"gliderRight",
                name:"Glider Droite",
                price:75,
                blocked:true
            }
        };

    }


    create(){

        for(let x=0;x<this.gridSize;x++){

            this.grid[x]=[];

            for(let y=0;y<this.gridSize;y++){
                this.grid[x][y]=null;
            }

        }

        this.createHUD();
        this.createMap();
        this.createMenu();
        this.createCamera();

    }


    createHUD(){

        this.energyText =
        this.add.text(
            20,
            20,
            "⚡ Energie : "+this.energy,
            {
                fontSize:"28px",
                color:"#ffff00"
            }
        )
        .setScrollFactor(0);


        this.validateButton =
        this.add.text(
            20,
            650,
            "VALIDER",
            {
                fontSize:"24px",
                backgroundColor:"#008800",
                padding:{
                    x:15,
                    y:10
                }
            }
        )
        .setInteractive()
        .setScrollFactor(0);


        this.validateButton.on(
            "pointerdown",
            ()=>{
                console.log(this.grid);
            }
        );

    }


    createMap(){

        for(let x=0;x<this.gridSize;x++){

            for(let y=0;y<this.gridSize;y++){

                this.add.image(
                    this.mapX+x*this.cellSize+16,
                    this.mapY+y*this.cellSize+16,
                    "ground"
                )
                .setDisplaySize(
                    this.cellSize,
                    this.cellSize
                );

            }

        }


        this.input.on(
            "pointerup",
            pointer=>{

                if(
                    pointer.rightButtonDown()
                ){

                    this.removeObject(
                        pointer.worldX,
                        pointer.worldY
                    );

                }

            }
        );


        this.input.on(
            "pointermove",
            pointer=>{

                if(this.draggingObject){

                    this.draggingObject.x =
                    pointer.worldX;

                    this.draggingObject.y =
                    pointer.worldY;

                }

            }
        );


        this.input.on(
            "pointerup",
            pointer=>{

                if(!this.draggingObject)
                    return;


                this.placeObject(
                    pointer.worldX,
                    pointer.worldY
                );


                this.draggingObject.destroy();

                this.draggingObject=null;

            }
        );

    }


    createMenu(){

        let y=140;
        const x=120;


        this.add.text(
            x,
            80,
            "ELEMENTS",
            {
                fontSize:"32px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0);


        Object.entries(this.items).forEach(
            ([key,item])=>{

                const box =
                this.add.rectangle(
                    x,
                    y,
                    220,
                    70,
                    0x333333
                )
                .setInteractive()
                .setScrollFactor(0);


                this.add.image(
                    x-70,
                    y,
                    item.texture
                )
                .setDisplaySize(
                    45,
                    45
                )
                .setScrollFactor(0);


                this.add.text(
                    x-35,
                    y-15,
                    item.name,
                    {
                        fontSize:"18px",
                        color:"#ffffff"
                    }
                )
                .setScrollFactor(0);


                this.add.text(
                    x-35,
                    y+10,
                    "⚡ "+item.price,
                    {
                        fontSize:"16px",
                        color:"#ffff00"
                    }
                )
                .setScrollFactor(0);


                box.on(
                    "pointerdown",
                    ()=>{
                        this.startDrag(key);
                    }
                );


                y+=85;

            }
        );

    }


    startDrag(type){

        const item =
        this.items[type];


        if(this.energy < item.price)
            return;


        this.draggingType=type;


        this.draggingObject =
        this.add.image(
            this.input.x,
            this.input.y,
            item.texture
        )
        .setDisplaySize(
            32,
            32
        );

    }


    placeObject(x,y){

        const gx =
        Math.floor(
            (x-this.mapX)/this.cellSize
        );

        const gy =
        Math.floor(
            (y-this.mapY)/this.cellSize
        );


        if(
            gx<0 ||
            gy<0 ||
            gx>=this.gridSize ||
            gy>=this.gridSize
        )
            return;


        if(this.grid[gx][gy])
            return;


        const item =
        this.items[this.draggingType];


        this.energy -= item.price;


        this.energyText.setText(
            "⚡ Energie : "+this.energy
        );


        const image =
        this.add.image(
            this.mapX+gx*this.cellSize+16,
            this.mapY+gy*this.cellSize+16,
            item.texture
        )
        .setDisplaySize(
            32,
            32
        );


        this.grid[gx][gy]={
            type:this.draggingType,
            price:item.price,
            blocked:item.blocked,
            image:image
        };


        this.objects.push({
            x:gx,
            y:gy,
            type:this.draggingType
        });

    }


    removeObject(x,y){

        const gx =
        Math.floor(
            (x-this.mapX)/this.cellSize
        );

        const gy =
        Math.floor(
            (y-this.mapY)/this.cellSize
        );


        const object =
        this.grid[gx]?.[gy];


        if(!object)
            return;


        this.energy += object.price;


        this.energyText.setText(
            "⚡ Energie : "+this.energy
        );


        object.image.destroy();


        this.grid[gx][gy]=null;


        this.objects =
        this.objects.filter(
            o=>!(o.x===gx && o.y===gy)
        );

    }


    isBlocked(x,y){

        return !!this.grid[x]?.[y]?.blocked;

    }


    createCamera(){

        this.cameras.main.setZoom(0.35);


        this.input.on(
            "wheel",
            (pointer,objects,dx,dy)=>{

                let zoom =
                this.cameras.main.zoom-dy*0.001;


                zoom =
                Phaser.Math.Clamp(
                    zoom,
                    0.2,
                    1
                );


                this.cameras.main.setZoom(
                    zoom
                );

            }
        );

    }

}