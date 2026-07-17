import Phaser from "phaser";

import MenuScene from "./scenes/MenuScene.js";
import LobbyScene from "./scenes/LobbyScene.js";
import BootScene from "./scenes/BootScene.js";
import IlumScene from "./scenes/IlumScene.js";
import EmployeeScene from "./scenes/EmployeeScene.js";


const config = {

    type: Phaser.AUTO,


    scale:{

        mode: Phaser.Scale.FIT,

        autoCenter: Phaser.Scale.CENTER_BOTH,

        width:1280,

        height:720

    },


    backgroundColor:"#000000",


    scene:[

        BootScene,

        MenuScene,

        LobbyScene,

        IlumScene,

        EmployeeScene

    ]

};


new Phaser.Game(config);