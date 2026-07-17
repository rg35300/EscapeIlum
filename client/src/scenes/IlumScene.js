import Phaser from "phaser";
import SocketManager from "../network/SocketManager.js";

export default class IlumScene extends Phaser.Scene {

    constructor(){
        super("IlumScene");
    }


    init(data){

        this.session = data.session;

        this.gridSize = 150;
        this.cellSize = 8;

        this.mapWidth =
        this.gridSize * this.cellSize;

        this.mapHeight =
        this.gridSize * this.cellSize;

        this.objects = [];

        this.money = 1000;

        this.costs = {
            wall:10,
            enemy:100,
            trap:25,
            exit:0
        };

        this.dragObject = null;

    }


    create(){

        const width =
        this.scale.width;


        this.mapX =
        width / 3 + 20;

        this.mapY =
        40;


        this.add.text(
            width * 0.16,
            40,
            "ILUM - CREATION DU NIVEAU",
            {
                fontSize:"28px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);



        this.moneyText =
        this.add.text(
            width * 0.16,
            90,
            "ENERGIE : " + this.money,
            {
                fontSize:"24px",
                color:"#ffff00"
            }
        )
        .setOrigin(0.5);



        this.createMenu();

        this.createMap();

        this.createStartButton();

        this.setupCamera();

    }



    createMenu(){

        const menuWidth =
        this.scale.width / 3;


        this.add.rectangle(
            menuWidth/2,
            this.scale.height/2,
            menuWidth,
            this.scale.height,
            0x222222
        );



        this.add.text(
            menuWidth/2,
            140,
            "ELEMENTS",
            {
                fontSize:"32px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);



        this.createElementButton(
            "MUR - 10",
            220,
            0x884444,
            "wall"
        );


        this.createElementButton(
            "ENNEMI - 100",
            300,
            0xff0000,
            "enemy"
        );


        this.createElementButton(
            "PIEGE - 25",
            380,
            0xffff00,
            "trap"
        );


        this.createElementButton(
            "SORTIE",
            460,
            0x00ff00,
            "exit"
        );

    }



    createElementButton(text,y,color,type){

        const button =
        this.add.rectangle(
            this.scale.width/6,
            y,
            220,
            50,
            color
        )
        .setInteractive();



        this.add.text(
            this.scale.width/6,
            y,
            text,
            {
                fontSize:"20px",
                color:"#000000"
            }
        )
        .setOrigin(0.5);



        button.on(
            "pointerdown",
            ()=>{


                if(this.dragObject)
                    this.dragObject.destroy();



                this.dragObject =
                this.add.rectangle(
                    this.input.x,
                    this.input.y,
                    this.cellSize,
                    this.cellSize,
                    color
                );


                this.dragObject.type =
                type;


                this.dragObject.setDepth(
                    10
                );


            }
        );

    }



    createMap(){

        this.grid =
        this.add.graphics();



        this.grid.lineStyle(
            1,
            0x444444
        );



        for(
            let x=0;
            x<=this.gridSize;
            x++
        ){

            this.grid.lineBetween(
                this.mapX + x*this.cellSize,
                this.mapY,
                this.mapX + x*this.cellSize,
                this.mapY + this.mapHeight
            );

        }



        for(
            let y=0;
            y<=this.gridSize;
            y++
        ){

            this.grid.lineBetween(
                this.mapX,
                this.mapY + y*this.cellSize,
                this.mapX + this.mapWidth,
                this.mapY + y*this.cellSize
            );

        }



        this.input.on(
            "pointerup",
            pointer=>{


                if(!this.dragObject)
                    return;



                const x =
                Math.floor(
                    (pointer.x-this.mapX)
                    /
                    this.cellSize
                );


                const y =
                Math.floor(
                    (pointer.y-this.mapY)
                    /
                    this.cellSize
                );


                if(
                    x>=0 &&
                    y>=0 &&
                    x<this.gridSize &&
                    y<this.gridSize
                ){

                    this.placeObject(
                        x,
                        y,
                        this.dragObject.type
                    );

                }


                this.dragObject.destroy();

                this.dragObject = null;


            }
        );


    }



    placeObject(x,y,type){


        const exists =
        this.objects.find(
            o=>o.x===x && o.y===y
        );


        if(exists)
            return;



        const cost =
        this.costs[type];


        if(this.money < cost)
            return;



        this.money -= cost;



        this.moneyText.setText(
            "ENERGIE : " + this.money
        );



        const colors = {

            wall:0x884444,

            enemy:0xff0000,

            trap:0xffff00,

            exit:0x00ff00

        };



        this.add.rectangle(
            this.mapX+x*this.cellSize+this.cellSize/2,
            this.mapY+y*this.cellSize+this.cellSize/2,
            this.cellSize,
            this.cellSize,
            colors[type]
        );



        this.objects.push({

            x:x,

            y:y,

            type:type

        });



        SocketManager.saveLevel(
            this.objects
        );


    }



    createStartButton(){

        const button =
        this.add.text(
            this.scale.width/2,
            this.scale.height-50,
            "VALIDER LA MAP",
            {
                fontSize:"30px",
                backgroundColor:"#008800",
                padding:{
                    x:20,
                    y:10
                }
            }
        )
        .setOrigin(0.5)
        .setInteractive();



        button.on(
            "pointerdown",
            ()=>{

                SocketManager.saveLevel(
                    this.objects
                );

            }
        );

    }



    setupCamera(){

        const cam =
        this.cameras.main;


        cam.setBounds(
            this.mapX,
            this.mapY,
            this.mapWidth,
            this.mapHeight
        );


        cam.setZoom(
            0.5
        );



        this.input.on(
            "wheel",
            (pointer,objects,deltaY)=>{


                let zoom =
                cam.zoom - deltaY*0.001;


                zoom =
                Phaser.Math.Clamp(
                    zoom,
                    0.2,
                    2
                );


                cam.setZoom(
                    zoom
                );


            }
        );



        let dragging = false;

        let startX = 0;

        let startY = 0;



        this.input.on(
            "pointerdown",
            pointer=>{


                if(pointer.middleButtonDown()){

                    dragging = true;

                    startX = pointer.x;

                    startY = pointer.y;

                }


            }
        );



        this.input.on(
            "pointerup",
            ()=>{

                dragging = false;

            }
        );



        this.input.on(
            "pointermove",
            pointer=>{


                if(!dragging)
                    return;



                cam.scrollX +=
                (startX-pointer.x)
                /
                cam.zoom;



                cam.scrollY +=
                (startY-pointer.y)
                /
                cam.zoom;



                startX = pointer.x;

                startY = pointer.y;


            }
        );


    }



    update(){

        if(this.dragObject){

            this.dragObject.x =
            this.input.x;


            this.dragObject.y =
            this.input.y;

        }

    }

}