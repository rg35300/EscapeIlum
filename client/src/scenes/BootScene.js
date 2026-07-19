import Phaser from "phaser";

import SAMOYED_1 from "../../assets/sprites/avatars/SAMOYED_1.png";
import SAMOYED_2 from "../../assets/sprites/avatars/SAMOYED_2.png";
import SAMOYED_3 from "../../assets/sprites/avatars/SAMOYED_3.png";
import SAMOYED_4 from "../../assets/sprites/avatars/SAMOYED_4.png";
import SAMOYED_5 from "../../assets/sprites/avatars/SAMOYED_5.png";
import SAMOYED_6 from "../../assets/sprites/avatars/SAMOYED_6.png";
import SAMOYED_7 from "../../assets/sprites/avatars/SAMOYED_7.png";

import ground from "../../assets/images/ilum/Ground.png";
import groundGrid from "../../assets/images/ilum/GroundGrid.png";
import shelf from "../../assets/images/ilum/Shelf.png";
import shelfGrid from "../../assets/images/ilum/ShelfGrid.png";
import exit from "../../assets/images/ilum/Exit.png";
import exitGrid from "../../assets/images/ilum/ExitGrid.png";

import player from "../../assets/images/employee/player.png";
import playerCorrupted from "../../assets/images/employee/PlayerCorrupted.png";

export default class BootScene extends Phaser.Scene {

    constructor(){
        super("BootScene");
    }

    preload(){

        const avatars={
            SAMOYED_1,
            SAMOYED_2,
            SAMOYED_3,
            SAMOYED_4,
            SAMOYED_5,
            SAMOYED_6,
            SAMOYED_7
        };

        Object.entries(avatars).forEach(([key,value])=>{
            this.load.image(key,value);
        });

        const assets={
            ground,
            groundGrid,
            shelf,
            shelfGrid,
            exit,
            exitGrid,
            player,
            playerCorrupted
        };

        Object.entries(assets).forEach(([key,value])=>{
            this.load.image(key,value);
        });
    }

    create(){
        this.scene.start("MenuScene");
    }
}