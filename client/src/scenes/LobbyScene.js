import SocketManager from "../network/SocketManager.js";


export default class LobbyScene extends Phaser.Scene {


    constructor(){

        super("LobbyScene");

    }




    init(data){


        this.session = data.session;

        this.playerObjects = [];

    }





    create(){


        const width =
        this.scale.width;


        const height =
        this.scale.height;






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







        // JOUEURS


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




        this.displayPlayers();








        // CHAT TITRE


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





        this.createChatHTML();


        this.createAvatarHTML();







        // RECEPTION CHAT


        SocketManager.onChatMessage(
            (data)=>{


                this.addChatMessage(
                    data.player +
                    " : " +
                    data.message
                );


            }
        );








        // UPDATE JOUEURS


        SocketManager.onPlayersUpdated(
            (players)=>{


                this.session.players =
                players;


                this.displayPlayers();


            }
        );




    }









    displayPlayers(){



        this.playerObjects.forEach(
            obj=>obj.destroy()
        );



        this.playerObjects = [];



        let y =
        this.scale.height * 0.40;





        this.session.players.forEach(
            (player)=>{



                const circle =
                this.add.circle(
                    this.scale.width * 0.12,
                    y,
                    25,
                    0x555555
                );



                this.playerObjects.push(
                    circle
                );







                const name =
                this.add.text(
                    this.scale.width * 0.25,
                    y,
                    player.name,
                    {
                        fontSize:"28px",
                        color:"#ffffff"
                    }
                )
                .setOrigin(0.5);



                this.playerObjects.push(
                    name
                );



                y += 60;


            }
        );



    }









    createChatHTML(){



        const box =
        document.createElement("div");



        box.style.position =
        "absolute";


        box.style.left =
        "65%";


        box.style.top =
        "38%";


        box.style.width =
        "350px";


        box.style.height =
        "250px";


        box.style.background =
        "rgba(20,20,20,0.95)";


        box.style.border =
        "2px solid #555";


        box.style.borderRadius =
        "15px";


        box.style.padding =
        "10px";


        box.style.display =
        "flex";


        box.style.flexDirection =
        "column";



        document.body.appendChild(
            box
        );








        const messages =
        document.createElement("div");



        messages.style.flex =
        "1";


        messages.style.overflowY =
        "auto";


        messages.style.color =
        "white";


        messages.style.fontSize =
        "18px";



        messages.style.padding =
        "5px";



        box.appendChild(
            messages
        );








        const bottom =
        document.createElement("div");



        bottom.style.display =
        "flex";


        bottom.style.gap =
        "5px";



        box.appendChild(
            bottom
        );








        const input =
        document.createElement("input");



        input.placeholder =
        "Message...";



        input.style.flex =
        "1";


        input.style.height =
        "35px";


        input.style.borderRadius =
        "8px";


        input.style.border =
        "none";


        input.style.padding =
        "5px";



        bottom.appendChild(
            input
        );








        const button =
        document.createElement("button");



        button.innerText =
        "Envoyer";



        button.style.height =
        "35px";


        button.style.borderRadius =
        "8px";


        button.style.border =
        "none";


        button.style.background =
        "#00ff00";


        button.style.cursor =
        "pointer";


        button.style.fontWeight =
        "bold";



        bottom.appendChild(
            button
        );









        const send =
        ()=>{


            if(input.value.trim()==="")
                return;




            SocketManager.sendChatMessage({

                sessionId:this.session.id,

                player:
                SocketManager.player.name,

                message:
                input.value

            });



            input.value="";


        };






        button.onclick =
        send;



        input.addEventListener(
            "keydown",
            (event)=>{


                if(event.key==="Enter"){


                    send();


                }


            }
        );





        this.chatBox =
        box;


        this.chatMessagesContainer =
        messages;


    }









    addChatMessage(message){



        const line =
        document.createElement("div");



        line.innerText =
        message;



        line.style.marginBottom =
        "5px";



        this.chatMessagesContainer.appendChild(
            line
        );



        this.chatMessagesContainer.scrollTop =
        this.chatMessagesContainer.scrollHeight;


    }









    createAvatarHTML(){



        const fileInput =
        document.createElement("input");



        fileInput.type =
        "file";


        fileInput.accept =
        "image/*";



        fileInput.style.position =
        "absolute";


        fileInput.style.left =
        "65%";


        fileInput.style.top =
        "82%";



        document.body.appendChild(
            fileInput
        );





        fileInput.onchange =
        ()=>{


            const file =
            fileInput.files[0];



            if(!file)
                return;





            const reader =
            new FileReader();





            reader.onload =
            ()=>{


                SocketManager.sendAvatar({

                    sessionId:this.session.id,

                    avatar:reader.result

                });


            };




            reader.readAsDataURL(
                file
            );


        };



        this.avatarInput =
        fileInput;


    }









    shutdown(){



        if(this.chatBox)
            this.chatBox.remove();



        if(this.avatarInput)
            this.avatarInput.remove();



    }



}