import SocketManager from "../network/SocketManager.js";


export default class LobbyScene extends Phaser.Scene {


    constructor(){

        super("LobbyScene");

    }





    init(data){

        this.session = data.session;

    }







    create(){


        const width =
        this.scale.width;


        const height =
        this.scale.height;



        this.avatarMasks = [];







        this.add.text(
            width / 2,
            height * 0.08,
            "LOBBY",
            {
                fontSize:"50px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);








        this.add.text(
            width / 2,
            height * 0.18,
            "Session code : " + this.session.id,
            {
                fontSize:"30px",
                color:"#00ff00"
            }
        )
        .setOrigin(0.5);









        this.add.text(
            width * 0.25,
            height * 0.28,
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
            height * 0.38
        );





        this.drawPlayers(
            this.session.players
        );









        this.add.text(
            width * 0.75,
            height * 0.30,
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



        this.avatarMasks.forEach(
            (mask)=>{

                mask.destroy();

            }
        );



        this.avatarMasks = [];





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
                    60,
                    60
                );







                const mask =
                this.make.graphics();



                mask.fillStyle(
                    0xffffff
                );



                mask.fillCircle(
                    -120,
                    y,
                    30
                );



                avatar.setMask(
                    mask.createGeometryMask()
                );



                this.avatarMasks.push(
                    mask
                );









                const name =
                this.add.text(
                    -50,
                    y,
                    player.name,
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





                y += 80;



            }
        );


    }






}