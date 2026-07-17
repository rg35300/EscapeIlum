import SocketManager from "../network/SocketManager.js";


export default class LobbyScene extends Phaser.Scene {


    constructor(){

        super("LobbyScene");

    }




    init(data){

        this.session = data.session;

        this.messages = [];

    }







    create(){


        const width =
        this.scale.width;


        const height =
        this.scale.height;








        this.add.text(
            width / 2,
            50,
            "LOBBY",
            {
                fontSize:"50px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);








        this.add.text(
            width / 2,
            120,
            "Session code : " + this.session.id,
            {
                fontSize:"30px",
                color:"#00ff00"
            }
        )
        .setOrigin(0.5);










        // =========================
        // PLAYERS
        // =========================



        this.add.text(
            width * 0.25,
            210,
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
            270
        );







        this.drawPlayers(
            this.session.players
        );












        // =========================
        // CHAT
        // =========================




        this.add.text(
            width * 0.75,
            210,
            "Chat",
            {
                fontSize:"32px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);







        this.chatBackground =
        this.add.rectangle(
            width * 0.75,
            380,
            450,
            260,
            0x222222
        );



        this.chatBackground.setDepth(
            0
        );








        this.chatText =
        this.add.text(
            width * 0.75 - 200,
            260,
            "",
            {
                fontSize:"22px",
                color:"#ffffff",
                wordWrap:{
                    width:390
                }
            }
        );



        this.chatText.setDepth(
            5
        );








        this.createChatInput();









        SocketManager.onPlayersUpdated(
            (players)=>{


                this.drawPlayers(
                    players
                );


            }
        );









        SocketManager.onChatMessage(
            (data)=>{


                this.addMessage(
                    data
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
                    55,
                    55
                );








                const name =
                this.add.text(
                    -50,
                    y,
                    player.name || "Player",
                    {
                        fontSize:"26px",
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







                y += 75;



            }
        );


    }












    createChatInput(){



        const input =
        document.createElement("input");



        input.placeholder =
        "Message...";




        input.style.position =
        "absolute";



        input.style.left =
        "62%";



        input.style.top =
        "570px";



        input.style.width =
        "280px";



        input.style.height =
        "40px";



        input.style.fontSize =
        "20px";



        input.style.borderRadius =
        "5px";




        document.body.appendChild(
            input
        );









        const button =
        document.createElement("button");



        button.innerText =
        "SEND";





        button.style.position =
        "absolute";



        button.style.left =
        "82%";



        button.style.top =
        "570px";



        button.style.width =
        "90px";



        button.style.height =
        "40px";



        button.style.fontSize =
        "18px";



        button.style.cursor =
        "pointer";





        document.body.appendChild(
            button
        );









        const sendMessage =
        ()=>{


            const message =
            input.value.trim();





            if(message === "")
                return;






            SocketManager.sendChatMessage(
                message
            );






            input.value = "";



        };









        button.onclick =
        sendMessage;







        input.addEventListener(
            "keydown",
            (event)=>{


                if(
                    event.key === "Enter"
                ){


                    sendMessage();


                }


            }
        );







        this.chatInput =
        input;



        this.chatButton =
        button;



    }












    addMessage(data){



        const line =
        data.name + " : " + data.message;





        this.messages.push(
            line
        );







        if(
            this.messages.length > 10
        ){

            this.messages.shift();

        }








        this.chatText.setText(
            this.messages.join("\n")
        );



    }









    shutdown(){



        if(this.chatInput)
            this.chatInput.remove();



        if(this.chatButton)
            this.chatButton.remove();



    }




}