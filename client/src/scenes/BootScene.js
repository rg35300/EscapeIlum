import Phaser from "phaser";

import SAMOYED_1 from "../../assets/sprites/avatars/SAMOYED_1.png";
import SAMOYED_2 from "../../assets/sprites/avatars/SAMOYED_2.png";
import SAMOYED_3 from "../../assets/sprites/avatars/SAMOYED_3.png";
import SAMOYED_4 from "../../assets/sprites/avatars/SAMOYED_4.png";
import SAMOYED_5 from "../../assets/sprites/avatars/SAMOYED_5.png";
import SAMOYED_6 from "../../assets/sprites/avatars/SAMOYED_6.png";
import SAMOYED_7 from "../../assets/sprites/avatars/SAMOYED_7.png";

import Ground from "../../assets/images/ilum/Ground.png";
import GroundGrid from "../../assets/images/ilum/GroundGrid.png";

import Shelf from "../../assets/images/ilum/Shelf.png";
import ShelfGrid from "../../assets/images/ilum/ShelfGrid.png";

import Exit from "../../assets/images/ilum/Exit.png";
import ExitGrid from "../../assets/images/ilum/ExitGrid.png";

import Wall from "../../assets/images/ilum/Wall.png";
import WallGrid from "../../assets/images/ilum/WallGrid.png";

import LatexPit from "../../assets/images/ilum/LatexPit.png";
import LatexPitGrid from "../../assets/images/ilum/LatexPitGrid.png";

import Glider from "../../assets/images/ilum/Glider.png";
import GliderUpGrid from "../../assets/images/ilum/GliderUpGrid.png";
import GliderDownGrid from "../../assets/images/ilum/GliderDownGrid.png";
import GliderLeftGrid from "../../assets/images/ilum/GliderLeftGrid.png";
import GliderRightGrid from "../../assets/images/ilum/GliderRightGrid.png";

import SqueakIlumGrid from "../../assets/images/ilum/SqueakIlumGrid.png";

import player from "../../assets/images/employee/player.png";
import playerCorrupted from "../../assets/images/employee/PlayerCorrupted.png";


export default class BootScene extends Phaser.Scene{

    constructor(){
        super("BootScene");
    }


    preload(){

        const assets={

            SAMOYED_1,
            SAMOYED_2,
            SAMOYED_3,
            SAMOYED_4,
            SAMOYED_5,
            SAMOYED_6,
            SAMOYED_7,

            ground:Ground,
            groundGrid:GroundGrid,

            shelf:Shelf,
            shelfGrid:ShelfGrid,

            exit:Exit,
            exitGrid:ExitGrid,

            wall:Wall,
            wallGrid:WallGrid,

            latexPit:LatexPit,
            latexPitGrid:LatexPitGrid,

            glider:Glider,
            gliderUpGrid:GliderUpGrid,
            gliderDownGrid:GliderDownGrid,
            gliderLeftGrid:GliderLeftGrid,
            gliderRightGrid:GliderRightGrid,

            squeakIlumGrid:SqueakIlumGrid,

            player,
            playerCorrupted

        };


        Object.entries(assets)
        .forEach(([key,value])=>{

            this.load.image(
                key,
                value
            );

        });


        const loading=this.add.text(
            this.scale.width/2,
            this.scale.height/2,
            "Chargement...",
            {
                fontSize:"32px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);


        this.load.on(
            "progress",
            value=>{

                loading.setText(
                    "Chargement "+Math.floor(value*100)+"%"
                );

            }
        );


        this.load.on(
            "complete",
            ()=>{
                loading.destroy();
            }
        );

    }


    create(){

        this.scene.start(
            "MenuScene"
        );

    }

}