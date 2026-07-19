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

        this.menuWidth=Math.floor(this.scale.width*0.25);

        this.mapX=this.menuWidth;
        this.mapY=0;

        this.selected=null;

        this.grid=[];
        this.objects=[];

        this.menuContainer=null;
        this.menuMask=null;

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

        this.createGrid();

        this.createWorld();

        this.createUI();

        this.createMenu();

        this.createInput();

        this.createCamera();

    }


    createGrid(){

        for(let x=0;x<this.gridSize;x++){

            this.grid[x]=[];

            for(let y=0;y<this.gridSize;y++){
                this.grid[x][y]=null;
            }

        }

    }


    createWorld(){

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


    createUI(){

        const panel=this.add.rectangle(
            this.menuWidth/2,
            this.scale.height/2,
            this.menuWidth,
            this.scale.height,
            0x111111
        );

        panel.setScrollFactor(0);


        this.energyText=this.add.text(
            20,
            20,
            "⚡ Energie : "+this.energy,
            {
                fontSize:"26px",
                color:"#ffff00"
            }
        );

        this.energyText.setScrollFactor(0);


        this.add.text(
            20,
            75,
            "ELEMENTS",
            {
                fontSize:"24px",
                color:"#ffffff"
            }
        )
        .setScrollFactor(0);


        this.add.line(
            20,
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

        const menuTop=130;
        const menuHeight=this.scale.height-menuTop-20;


        this.menuContainer=this.add.container(
            0,
            menuTop
        );

        this.menuContainer.setScrollFactor(0);


        const maskShape=this.make.graphics();

        maskShape.fillStyle(0xffffff);

        maskShape.fillRect(
            0,
            menuTop,
            this.menuWidth,
            menuHeight
        );


        this.menuMask=maskShape.createGeometryMask();


        this.menuContainer.setMask(
            this.menuMask
        );


        let y=40;


        Object.entries(this.items)
        .forEach(([key,item])=>{


            const box=this.add.rectangle(
                this.menuWidth/2,
                y,
                this.menuWidth-40,
                80,
                0x333333
            )
            .setInteractive();


            const image=this.add.image(
                60,
                y,
                item.texture
            )
            .setDisplaySize(
                50,
                50
            );


            const name=this.add.text(
                100,
                y-20,
                item.name,
                {
                    fontSize:"20px",
                    color:"#ffffff"
                }
            );


            const price=this.add.text(
                100,
                y+10,
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


            y+=100;

        });


        this.menuMaxScroll=
        Math.max(
            0,
            y-menuHeight
        );


        this.menuScroll=0;

    }


    createCamera(){

        this.cameras.main.setZoom(0.6);


        this.cameras.main.setBounds(
            this.mapX,
            this.mapY,
            this.gridSize*this.cellSize,
            this.gridSize*this.cellSize
        );


        this.input.on(
            "wheel",
            (pointer,objects,dx,dy)=>{

                if(pointer.x<this.menuWidth){

                    this.menuScroll-=dy;


                    this.menuScroll=
                    Phaser.Math.Clamp(
                        this.menuScroll,
                        0,
                        this.menuMaxScroll
                    );


                    this.menuContainer.y=
                    130-this.menuScroll;


                    return;

                }


                let zoom=
                this.cameras.main.zoom-dy*0.001;


                zoom=
                Phaser.Math.Clamp(
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


    createInput(){

        this.input.mouse.disableContextMenu();


        this.input.on(
            "pointerdown",
            pointer=>{


                if(pointer.x<this.menuWidth)
                    return;


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


        if(this.energy<item.price)
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
            objects:this.objects
        };

    }

}