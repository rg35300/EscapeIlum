import SocketManager from "../network/SocketManager.js";


export default class LobbyScene extends Phaser.Scene {


    constructor(){

        super("LobbyScene");

    }



    init(data){

        this.session = data.session;

        this.chatTexts = [];

        this.playerObjects = [];

        this.avatarTextures = [];

    }





    create(){


        const width = this.scale.width;

        const height = this.scale.height;



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
            height * 0.30,
            "Players",
            {
                fontSize:"32px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);





        this.displayPlayers();







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







        SocketManager.onChatMessage(
            (data)=>{


                this.addChatMessage(
                    data.player +
                    " : " +
                    data.message
                );


            }
        );






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



        this.playerObjects=[];



        let y =
        this.scale.height * 0.40;






        this.session.players.forEach(
            (player)=>{



                this.createPlayerAvatar(
                    player,
                    this.scale.width * 0.12,
                    y
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









    createPlayerAvatar(player,x,y){



        if(player.avatar){



            const key =
            "avatar_" + player.id;





            if(!this.textures.exists(key)){


                this.textures.addBase64(
                    key,
                    player.avatar
                );


            }





            const image =
            this.add.image(
                x,
                y,
                key
            );



            image.setDisplaySize(
                50,
                50
            );






            const maskShape =
            this.make.graphics();



            maskShape.fillCircle(
                x,
                y,
                25
            );



            image.setMask(
                maskShape.createGeometryMask()
            );



            this.playerObjects.push(
                image
            );



        }
        else{



            const circle =
            this.add.circle(
                x,
                y,
                25,
                0x555555
            );



            this.playerObjects.push(
                circle
            );


        }


    }









    createChatHTML(){



        const input =
        document.createElement("input");

        input.placeholder =
        "Message...";

        input.style.position =
        "absolute";

        input.style.left =
        "65%";

        input.style.top =
        "70%";

        input.style.width =
        "300px";

        input.style.height =
        "40px";


        document.body.appendChild(
            input
        );





        const button =
        document.createElement("button");


        button.innerText =
        "Envoyer";


        button.style.position =
        "absolute";


        button.style.left =
        "65%";


        button.style.top =
        "77%";



        document.body.appendChild(
            button
        );







        button.onclick =
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



        this.chatInput=input;

        this.chatButton=button;


    }









    addChatMessage(message){



        const text =
        this.add.text(
            this.scale.width * 0.75,
            this.scale.height * 0.40 +
            this.chatTexts.length * 30,
            message,
            {
                fontSize:"20px",
                color:"#ffffff"
            }
        );



        this.chatTexts.push(
            text
        );


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





            reader.readAsDataURL(file);



        };



        this.avatarInput=fileInput;


    }








    shutdown(){



        if(this.chatInput)
            this.chatInput.remove();



        if(this.chatButton)
            this.chatButton.remove();



        if(this.avatarInput)
            this.avatarInput.remove();


    }



}