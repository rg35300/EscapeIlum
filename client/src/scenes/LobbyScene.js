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








        this.add.rectangle(
            width * 0.75,
            380,
            450,
            260,
            0x222222
        );





        this.createChatBox();

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







        this.events.once(
            "shutdown",
            ()=>{
                this.removeHTML();
            }
        );


        this.events.once(
            "destroy",
            ()=>{
                this.removeHTML();
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












    createChatBox(){



        const chatBox =
        document.createElement("div");



        chatBox.style.position =
        "absolute";



        chatBox.style.left =
        "calc(75% - 220px)";



        chatBox.style.top =
        "250px";



        chatBox.style.width =
        "430px";



        chatBox.style.height =
        "250px";



        chatBox.style.background =
        "#222";



        chatBox.style.color =
        "#fff";



        chatBox.style.fontSize =
        "20px";



        chatBox.style.padding =
        "10px";



        chatBox.style.boxSizing =
        "border-box";



        chatBox.style.overflowY =
        "auto";



        chatBox.style.borderRadius =
        "5px";



        document.body.appendChild(
            chatBox
        );



        this.chatBox =
        chatBox;



    }












    createChatInput(){



        const input =
        document.createElement("input");



        input.placeholder =
        "Message...";



        input.style.position =
        "absolute";



        input.style.left =
        "calc(75% - 220px)";



        input.style.top =
        "410px";



        input.style.width =
        "320px";



        input.style.height =
        "35px";



        input.style.fontSize =
        "18px";



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
        "calc(75% + 105px)";



        button.style.top =
        "410px";



        button.style.width =
        "75px";



        button.style.height =
        "35px";



        button.style.cursor =
        "pointer";



        document.body.appendChild(
            button
        );









        const sendMessage =
        ()=>{



            const message =
            input.value.trim();



            if(
                message === ""
            )
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
        document.createElement("div");



        line.innerText =
        data.name + " : " + data.message;



        this.chatBox.appendChild(
            line
        );



        this.chatBox.scrollTop =
        this.chatBox.scrollHeight;



    }









    removeHTML(){



        if(this.chatBox)
            this.chatBox.remove();



        if(this.chatInput)
            this.chatInput.remove();



        if(this.chatButton)
            this.chatButton.remove();



    }




}