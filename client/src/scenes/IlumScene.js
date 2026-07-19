import Phaser from "phaser";

export default class IlumScene extends Phaser.Scene {

    constructor(){
        super("IlumScene");
    }

    init(data){

        this.session=data.session;

        this.energy=500;

        this.gridSize=40;
        this.cellSize=32;

        this.mapX=400;
        this.mapY=40;

        this.selected=null;

        this.grid=[];
        this.objects=[];

        this.items={
            shelf:{
                texture:"shelfGrid",
                name:"Shelf",
                price:20
            },
            exit:{
                texture:"exitGrid",
                name:"Exit",
                price:0
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

        this.createGround();
        this.createHUD();
        this.createMenu();
        this.createInput();
        this.createCamera();

    }


    createGround(){

        for(let x=0;x<this.gridSize;x++){

            for(let y=0;y<this.gridSize;y++){

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


    createHUD(){

        this.energyText=this.add.text(
            20,
            20,
            "⚡ Energie : "+this.energy,
            {
                fontSize:"28px",
                color:"#ffff00"
            }
        )
        .setScrollFactor(0);


        const button=this.add.text(
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


        button.on(
            "pointerdown",
            ()=>{
                console.log(this.level());
            }
        );

    }


    createMenu(){

        let y=120;


        Object.entries(this.items)
        .forEach(([key,item])=>{

            const box=this.add.rectangle(
                120,
                y,
                220,
                70,
                0x333333
            )
            .setInteractive()
            .setScrollFactor(0);


            this.add.image(
                65,
                y,
                item.texture
            )
            .setDisplaySize(
                45,
                45
            )
            .setScrollFactor(0);


            this.add.text(
                100,
                y-18,
                item.name,
                {
                    fontSize:"20px",
                    color:"#ffffff"
                }
            )
            .setScrollFactor(0);


            this.add.text(
                100,
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
                    this.selected=key;
                }
            );


            y+=90;

        });

    }


    createInput(){

        this.input.on(
            "pointerdown",
            pointer=>{


                if(pointer.rightButtonDown()){

                    this.removeObject(
                        pointer.worldX,
                        pointer.worldY
                    );

                    return;
                }


                if(!this.selected)
                    return;


                this.placeObject(
                    pointer.worldX,
                    pointer.worldY
                );

            }
        );

    }


    placeObject(x,y){

        const gx=Math.floor(
            (x-this.mapX)/this.cellSize
        );

        const gy=Math.floor(
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


        if(
            this.selected==="exit" &&
            this.objects.some(
                o=>o.type==="exit"
            )
        )
            return;


        const item=this.items[this.selected];


        if(this.energy < item.price)
            return;


        this.energy-=item.price;


        this.energyText.setText(
            "⚡ Energie : "+this.energy
        );


        const sprite=this.add.image(
            this.mapX+gx*this.cellSize+16,
            this.mapY+gy*this.cellSize+16,
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
            (x-this.mapX)/this.cellSize
        );

        const gy=Math.floor(
            (y-this.mapY)/this.cellSize
        );


        const object=this.grid[gx]?.[gy];


        if(!object)
            return;


        this.energy+=object.price;


        this.energyText.setText(
            "⚡ Energie : "+this.energy
        );


        object.sprite.destroy();


        this.grid[gx][gy]=null;


        this.objects=this.objects.filter(
            o=>!(
                o.x===gx &&
                o.y===gy
            )
        );

    }


    level(){

        return {
            width:this.gridSize,
            height:this.gridSize,
            energy:this.energy,
            objects:this.objects
        };

    }


    createCamera(){

        this.cameras.main.setZoom(0.5);


        this.input.on(
            "wheel",
            (pointer,objects,dx,dy)=>{

                let zoom=this.cameras.main.zoom-dy*0.001;


                zoom=Phaser.Math.Clamp(
                    zoom,
                    0.25,
                    1
                );


                this.cameras.main.setZoom(
                    zoom
                );

            }
        );

    }

}