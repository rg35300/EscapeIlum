import SAMOYED_1 from "../../assets/sprites/avatars/SAMOYED_1.png";
import SAMOYED_2 from "../../assets/sprites/avatars/SAMOYED_2.png";
import SAMOYED_3 from "../../assets/sprites/avatars/SAMOYED_3.png";
import SAMOYED_4 from "../../assets/sprites/avatars/SAMOYED_4.png";
import SAMOYED_5 from "../../assets/sprites/avatars/SAMOYED_5.png";
import SAMOYED_6 from "../../assets/sprites/avatars/SAMOYED_6.png";
import SAMOYED_7 from "../../assets/sprites/avatars/SAMOYED_7.png";

import wall from "../../assets/images/ilum/wall.png";
import enemy from "../../assets/images/ilum/Ennemy.png";
import ground from "../../assets/images/ilum/Ground.png";
import latexPit from "../../assets/images/ilum/LatexPit.png";
import squeakIlum from "../../assets/images/ilum/SqueakIlum.png";
import gliderUp from "../../assets/images/ilum/GliderUp.png";
import gliderDown from "../../assets/images/ilum/GliderDown.png";
import gliderLeft from "../../assets/images/ilum/GliderLeft.png";
import gliderRight from "../../assets/images/ilum/GliderRight.png";

import player from "../../assets/images/employee/player.png";
import playerCorrupted from "../../assets/images/employee/PlayerCorrupted.png";

export default class BootScene extends Phaser.Scene {

    constructor(){
        super("BootScene");
    }

    preload(){

        const avatars = {
            SAMOYED_1,
            SAMOYED_2,
            SAMOYED_3,
            SAMOYED_4,
            SAMOYED_5,
            SAMOYED_6,
            SAMOYED_7
        };

        Object.entries(avatars).forEach(
            ([key,value])=>{
                this.load.image(key,value);
            }
        );


        const assets = {
            wall,
            enemy,
            ground,
            latexPit,
            squeakIlum,
            gliderUp,
            gliderDown,
            gliderLeft,
            gliderRight,
            player,
            playerCorrupted
        };

        Object.entries(assets).forEach(
            ([key,value])=>{
                this.load.image(key,value);
            }
        );

    }

    create(){
        this.scene.start("MenuScene");
    }

}