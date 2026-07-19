import Phaser from "phaser";

import BootScene from "./scenes/BootScene.js";
import MenuScene from "./scenes/MenuScene.js";
import LobbyScene from "./scenes/LobbyScene.js";
import GameScene from "./scenes/GameScene.js";


const config={

    type:Phaser.AUTO,

    scale:{
        mode:Phaser.Scale.FIT,
        autoCenter:Phaser.Scale.CENTER_BOTH,
        width:1280,
        height:720
    },

    physics:{
        default:"arcade",
        arcade:{
            debug:false
        }
    },

    backgroundColor:"#000000",

    scene:[
        BootScene,
        MenuScene,
        LobbyScene,
        GameScene
    ]

};


new Phaser.Game(config);