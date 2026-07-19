import Phaser from "phaser";

import MenuScene from "./scenes/MenuScene.js";
import LobbyScene from "./scenes/LobbyScene.js";
import BootScene from "./scenes/BootScene.js";
import GameScene from "./scenes/GameScene.js";


const config={

    type:Phaser.AUTO,

    scale:{

        mode:Phaser.Scale.FIT,

        autoCenter:Phaser.Scale.CENTER_BOTH,

        width:1280,

        height:720

    },

    backgroundColor:"#000000",

    physics:{

        default:"arcade",

        arcade:{

            debug:false

        }

    },

    scene:[

        BootScene,

        MenuScene,

        LobbyScene,

        GameScene

    ]

};


new Phaser.Game(config);