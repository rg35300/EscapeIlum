export default class LobbyScene extends Phaser.Scene {


    constructor(){

        super("LobbyScene");

    }



    init(data){

        this.session = data.session;

    }



    create(){


        const width = this.scale.width;
        const height = this.scale.height;



        // TITRE

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




        // CODE SESSION

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





        // ZONE JOUEURS

        this.add.text(
            width * 0.25,
            height * 0.30,
            "Players",
            {
                fontSize:"32px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);



        let y = height * 0.40;



        this.session.players.forEach(
            (player)=>{


                this.add.text(
                    width * 0.25,
                    y,
                    "🟢 " + player.name,
                    {
                        fontSize:"28px",
                        color:"#ffffff"
                    }
                )
                .setOrigin(0.5);



                y += 45;


            }
        );





        // ZONE CHAT (PLACEHOLDER)

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



        this.add.text(
            width * 0.75,
            height * 0.45,
            "Chat coming soon...",
            {
                fontSize:"22px",
                color:"#aaaaaa"
            }
        )
        .setOrigin(0.5);







        // BOUTON START

        const startButton =
        this.add.text(
            width / 2,
            height * 0.85,
            "START",
            {
                fontSize:"36px",
                color:"#ffff00",
                backgroundColor:"#222222",
                padding:{
                    x:20,
                    y:10
                }
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





        // ADAPTATION AU REDIMENSIONNEMENT

        this.scale.on(
            "resize",
            ()=>{

                this.scene.restart({
                    session:this.session
                });

            }
        );


    }


}