import SAMOYED_1 from "../../assets/sprites/avatars/SAMOYED_1.png";
import SAMOYED_2 from "../../assets/sprites/avatars/SAMOYED_2.png";
import SAMOYED_3 from "../../assets/sprites/avatars/SAMOYED_3.png";
import SAMOYED_4 from "../../assets/sprites/avatars/SAMOYED_4.png";
import SAMOYED_5 from "../../assets/sprites/avatars/SAMOYED_5.png";
import SAMOYED_6 from "../../assets/sprites/avatars/SAMOYED_6.png";
import SAMOYED_7 from "../../assets/sprites/avatars/SAMOYED_7.png";


export default class BootScene extends Phaser.Scene {


    constructor(){

        super("BootScene");

    }




    preload(){


        this.load.image(
            "SAMOYED_1",
            SAMOYED_1
        );


        this.load.image(
            "SAMOYED_2",
            SAMOYED_2
        );


        this.load.image(
            "SAMOYED_3",
            SAMOYED_3
        );


        this.load.image(
            "SAMOYED_4",
            SAMOYED_4
        );


        this.load.image(
            "SAMOYED_5",
            SAMOYED_5
        );


        this.load.image(
            "SAMOYED_6",
            SAMOYED_6
        );


        this.load.image(
            "SAMOYED_7",
            SAMOYED_7
        );


    }





    create(){


        this.scene.start(
            "MenuScene"
        );


    }


}