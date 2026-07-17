import SocketManager from "../network/SocketManager.js";


export default class LobbyScene extends Phaser.Scene {


    constructor(){

        super("LobbyScene");

    }



    init(data){

        this.session = data.session;

    }





    create(){


        const width = this.scale.width;



        this.add.text(
            width / 2,
            60,
            "LOBBY",
            {
                fontSize:"50px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);





        this.add.text(
            width / 2,
            130,
            "Session code : " + this.session.id,
            {
                fontSize:"30px",
                color:"#00ff00"
            }
        )
        .setOrigin(0.5);






        this.add.text(
            width * 0.25,
            220,
            "Players",
            {
                fontSize:"32px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);





        this.playersContainer =
        this.add.container(
            width * 0.25,
            280
        );





        this.drawPlayers(
            this.session.players
        );







        this.add.text(
            width * 0.75,
            220,
            "Chat",
            {
                fontSize:"32px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);







        SocketManager.onPlayersUpdated(
            (players)=>{


                this.drawPlayers(
                    players
                );


            }
        );


    }







    drawPlayers(players){


        this.playersContainer.removeAll(
            true
        );



        let y = 0;



        players.forEach(
            (player)=>{


                const avatar =
                this.add.image(
                    -120,
                    y,
                    player.avatar || "SAMOYED_1"
                );



                avatar.setDisplaySize(
                    70,
                    70
                );





                const name =
                this.add.text(
                    -60,
                    y,
                    player.name || "Player",
                    {
                        fontSize:"28px",
                        color:"#ffffff"
                    }
                )
                .setOrigin(
                    0,
                    0.5
                );





                this.playersContainer.add(
                    [
                        avatar,
                        name
                    ]
                );



                y += 100;


            }
        );


    }



}