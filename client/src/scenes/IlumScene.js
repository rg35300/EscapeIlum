import Phaser from "phaser";

export default class IlumScene extends Phaser.Scene{

    constructor(){
        super("IlumScene");
    }


    init(data){

        this.session=data.session;

        this.energy=500;

        this.gridWidth=60;
        this.gridHeight=40;
        this.cellSize=32;

        this.menuWidth=300;

        this.mapX=0;
        this.mapY=0;

        this.selected=null;

        this.grid=[];
        this.objects=[];

        this.menuContainer=null;

        this.menuScroll=0;
        this.menuMaxScroll=0;


        this.items={

            wall:{
                texture:"wallGrid",
                name:"Mur",
                price:5
            },

            shelf:{
                texture:"shelfGrid",
                name:"Rayonnage",
                price:20
            },

            latexPit:{
                texture:"latexPitGrid",
                name:"Fosse Latex",
                price:40
            },

            glider:{
                texture:"gliderUpGrid",
                name:"Glider",
                price:60
            },

            exit:{
                texture:"exitGrid",
                name:"Sortie",
                price:0
            }

        };

    }



    create(){

        this.createGrid();

        this.createWorld();

        this.createUI();

        this.createMenu();

        this.createInput();

        this.createCamera();

    }



    createGrid(){

        for(let x=0;x<this.gridWidth;x++){

            this.grid[x]=[];

            for(let y=0;y<this.gridHeight;y++){

                this.grid[x][y]=null;

            }

        }

    }



    createWorld(){

        for(let x=0;x<this.gridWidth;x++){

            for(let y=0;y<this.gridHeight;y++){

                this.add.image(

                    this.mapX+x*this.cellSize+16,
                    this.mapY+y*this.cellSize+16,
                    "groundGrid"

                )
                .setDisplaySize(
                    this.cellSize,
                    this.cellSize
                );

            }

        }

    }



    createUI(){

        const panel=this.add.rectangle(

            this.scale.width-this.menuWidth/2,
            this.scale.height/2,
            this.menuWidth,
            this.scale.height,
            0x111111

        );


        panel.setScrollFactor(0);



        this.energyText=this.add.text(

            this.scale.width-this.menuWidth+20,
            20,
            "⚡ Energie : "+this.energy,

            {
                fontSize:"24px",
                color:"#ffff00"
            }

        );


        this.energyText.setScrollFactor(0);



        this.add.text(

            this.scale.width-this.menuWidth+20,
            70,
            "ENTREPOT",

            {
                fontSize:"26px",
                color:"#ffffff"
            }

        )
        .setScrollFactor(0);



        this.add.line(

            this.scale.width-this.menuWidth+20,
            110,
            0,
            0,
            this.menuWidth-40,
            0,
            0xffffff

        )
        .setOrigin(0)
        .setScrollFactor(0);


    }




    createMenu(){

        const startX=this.scale.width-this.menuWidth;

        const top=130;

        const height=this.scale.height-top;



        this.menuContainer=this.add.container(

            startX,
            top

        );


        this.menuContainer.setScrollFactor(0);



        const mask=this.make.graphics();

        mask.fillStyle(0xffffff);

        mask.fillRect(

            startX,
            top,
            this.menuWidth,
            height

        );


        this.menuContainer.setMask(

            mask.createGeometryMask()

        );



        let y=50;



        Object.entries(this.items)
        .forEach(([key,item])=>{


            const box=this.add.rectangle(

                this.menuWidth/2,
                y,
                this.menuWidth-40,
                90,
                0x333333

            )
            .setInteractive();



            const image=this.add.image(

                60,
                y,
                item.texture

            )
            .setDisplaySize(
                60,
                60
            );



            const name=this.add.text(

                110,
                y-20,
                item.name,

                {
                    fontSize:"20px",
                    color:"#ffffff"
                }

            );



            const price=this.add.text(

                110,
                y+15,
                "⚡ "+item.price,

                {
                    fontSize:"16px",
                    color:"#ffff00"
                }

            );



            this.menuContainer.add([

                box,
                image,
                name,
                price

            ]);



            box.on(

                "pointerdown",

                ()=>{

                    this.selected=key;

                }

            );



            y+=110;


        });



        this.menuMaxScroll=Math.max(

            0,
            y-height

        );

    }





    createInput(){

        this.input.mouse.disableContextMenu();



        this.input.on(

            "pointerdown",

            pointer=>{


                if(pointer.x>this.scale.width-this.menuWidth)
                    return;



                if(pointer.rightButtonDown()){


                    this.removeObject(

                        pointer.worldX,
                        pointer.worldY

                    );


                    return;

                }



                if(this.selected){

                    this.placeObject(

                        pointer.worldX,
                        pointer.worldY

                    );

                }


            }

        );


    }




    placeObject(x,y){


        const gx=Math.floor(

            x/this.cellSize

        );


        const gy=Math.floor(

            y/this.cellSize

        );



        if(

            gx<0 ||
            gy<0 ||
            gx>=this.gridWidth ||
            gy>=this.gridHeight

        )
        return;



        if(this.grid[gx][gy])
            return;



        const item=this.items[this.selected];



        if(this.energy<item.price)
            return;



        this.energy-=item.price;



        this.energyText.setText(

            "⚡ Energie : "+this.energy

        );



        const sprite=this.add.image(

            gx*this.cellSize+16,
            gy*this.cellSize+16,
            item.texture

        )
        .setDisplaySize(

            this.cellSize,
            this.cellSize

        );



        this.grid[gx][gy]={

            type:this.selected,
            price:item.price,
            sprite

        };



        this.objects.push({

            type:this.selected,
            x:gx,
            y:gy

        });


    }




    removeObject(x,y){


        const gx=Math.floor(

            x/this.cellSize

        );


        const gy=Math.floor(

            y/this.cellSize

        );



        const obj=this.grid[gx]?.[gy];



        if(!obj)
            return;



        this.energy+=obj.price;



        this.energyText.setText(

            "⚡ Energie : "+this.energy

        );



        obj.sprite.destroy();



        this.grid[gx][gy]=null;



        this.objects=this.objects.filter(

            o=>!(

                o.x===gx &&
                o.y===gy

            )

        );


    }





    createCamera(){


        this.cameras.main.setBounds(

            0,
            0,
            this.gridWidth*this.cellSize,
            this.gridHeight*this.cellSize

        );


        this.input.on(

            "wheel",

            (pointer,objects,dx,dy)=>{


                if(pointer.x>this.scale.width-this.menuWidth){


                    this.menuScroll-=dy;


                    this.menuScroll=Phaser.Math.Clamp(

                        this.menuScroll,
                        0,
                        this.menuMaxScroll

                    );


                    this.menuContainer.y=

                        130-this.menuScroll;


                    return;

                }


                let zoom=this.cameras.main.zoom-dy*0.001;


                zoom=Phaser.Math.Clamp(

                    zoom,
                    0.4,
                    1

                );


                this.cameras.main.setZoom(zoom);


            }

        );


    }





    level(){

        return {

            width:this.gridWidth,
            height:this.gridHeight,
            objects:this.objects

        };

    }

}