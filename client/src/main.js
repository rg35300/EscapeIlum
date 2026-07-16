import Phaser from "phaser";

import MenuScene from "./scenes/MenuScene.js";

import LobbyScene from "./scenes/LobbyScene.js";



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

        MenuScene,

        LobbyScene

    ]

};



new Phaser.Game(config);