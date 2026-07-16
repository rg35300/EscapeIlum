export default class LobbyScene extends Phaser.Scene {


    constructor(){

        super("LobbyScene");

    }



    init(data){

        this.session = data.session;

    }



    create(){


        this.add.text(
            400,
            80,
            "LOBBY",
            {
                fontSize:"50px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);



        this.add.text(
            400,
            160,
            "Session's code : " + this.session.id,
            {
                fontSize:"30px",
                color:"#00ff00"
            }
        )
        .setOrigin(0.5);



        this.add.text(
            400,
            230,
            "Players :",
            {
                fontSize:"30px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);



        let y = 300;


        this.session.players.forEach(
            (player)=>{


                this.add.text(
                    400,
                    y,
                    "🟢 " + player.name,
                    {
                        fontSize:"28px",
                        color:"#ffffff"
                    }
                )
                .setOrigin(0.5);


                y += 40;


            }
        );



        const startButton =
        this.add.text(
            400,
            500,
            "Start",
            {
                fontSize:"32px",
                color:"#ffff00",
                backgroundColor:"#222222"
            }
        )
        .setOrigin(0.5)
        .setInteractive();



        startButton.on(
            "pointerdown",
            ()=>{

                console.log(
                    "Lancement partie"
                );

            }
        );


    }


}