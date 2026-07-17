import SocketManager from "../network/SocketManager.js";


export default class MenuScene extends Phaser.Scene {


    constructor(){

        super("MenuScene");

    }




    create(){


        this.selectedAvatar = "SAMOYED_1";



        const centerX =
        this.scale.width / 2;






        this.add.text(
            centerX,
            50,
            "ESCAPE ILUM FACTORY",
            {
                fontSize:"48px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);









        const container =
        document.createElement("div");



        container.style.position =
        "absolute";


        container.style.left =
        "50%";


        container.style.top =
        "45%";


        container.style.transform =
        "translate(-50%, -50%)";


        container.style.display =
        "flex";


        container.style.flexDirection =
        "column";


        container.style.alignItems =
        "center";


        container.style.gap =
        "15px";



        document.body.appendChild(
            container
        );









        const nameLabel =
        document.createElement("div");


        nameLabel.innerText =
        "Player name";


        nameLabel.style.color =
        "white";


        nameLabel.style.fontSize =
        "24px";


        container.appendChild(
            nameLabel
        );








        const nameInput =
        document.createElement("input");


        nameInput.value =
        "Player";


        this.styleInput(
            nameInput
        );


        container.appendChild(
            nameInput
        );









        const avatarTitle =
        document.createElement("div");


        avatarTitle.innerText =
        "Choose your avatar";


        avatarTitle.style.color =
        "white";


        avatarTitle.style.fontSize =
        "24px";


        container.appendChild(
            avatarTitle
        );








        const avatarContainer =
        document.createElement("div");



        avatarContainer.style.display =
        "flex";


        avatarContainer.style.gap =
        "10px";


        avatarContainer.style.flexWrap =
        "wrap";


        avatarContainer.style.width =
        "350px";


        avatarContainer.style.justifyContent =
        "center";



        container.appendChild(
            avatarContainer
        );








        const avatars = [

            "SAMOYED_1",
            "SAMOYED_2",
            "SAMOYED_3",
            "SAMOYED_4",
            "SAMOYED_5",
            "SAMOYED_6",
            "SAMOYED_7"

        ];







        avatars.forEach(
            (avatar)=>{


                const img =
                document.createElement("img");



                img.src =
                this.textures
                .get(avatar)
                .getSourceImage()
                .src;



                img.style.width =
                "70px";


                img.style.height =
                "70px";


                img.style.objectFit =
                "cover";


                img.style.borderRadius =
                "50%";


                img.style.cursor =
                "pointer";


                img.style.border =
                avatar === this.selectedAvatar
                ?
                "4px solid #00ff00"
                :
                "2px solid white";





                img.onclick =
                ()=>{


                    this.selectedAvatar =
                    avatar;



                    document
                    .querySelectorAll(
                        ".avatarChoice"
                    )
                    .forEach(
                        el=>
                        el.style.border =
                        "2px solid white"
                    );



                    img.style.border =
                    "4px solid #00ff00";


                };



                img.className =
                "avatarChoice";



                avatarContainer.appendChild(
                    img
                );


            }
        );









        const hostButton =
        this.createHTMLButton(
            "Host",
            "#00ff00"
        );


        container.appendChild(
            hostButton
        );








        const codeInput =
        document.createElement("input");


        codeInput.placeholder =
        "Lobby code";


        this.styleInput(
            codeInput
        );


        container.appendChild(
            codeInput
        );








        const joinButton =
        this.createHTMLButton(
            "Join",
            "#00ffff"
        );


        container.appendChild(
            joinButton
        );









        hostButton.onclick =
        ()=>{


            SocketManager.connect();



            SocketManager.onSessionCreated(
                (session)=>{


                    container.remove();



                    this.scene.start(
                        "LobbyScene",
                        {
                            session:session
                        }
                    );


                }
            );



            SocketManager.createSession({

                map:"factory_01",

                name:nameInput.value,

                avatar:this.selectedAvatar

            });


        };









        joinButton.onclick =
        ()=>{


            SocketManager.connect();



            SocketManager.onSessionJoined(
                (session)=>{


                    container.remove();



                    this.scene.start(
                        "LobbyScene",
                        {
                            session:session
                        }
                    );


                }
            );



            SocketManager.joinSession({

                sessionId:
                codeInput.value.toUpperCase(),


                name:
                nameInput.value,


                avatar:
                this.selectedAvatar


            });


        };



    }









    styleInput(input){


        input.style.width =
        "300px";


        input.style.height =
        "45px";


        input.style.fontSize =
        "24px";


        input.style.textAlign =
        "center";


    }









    createHTMLButton(text,color){


        const button =
        document.createElement("button");


        button.innerText =
        text;


        button.style.width =
        "300px";


        button.style.height =
        "50px";


        button.style.fontSize =
        "28px";


        button.style.color =
        color;


        button.style.background =
        "#222";


        button.style.cursor =
        "pointer";


        return button;


    }




    shutdown(){


        document
        .querySelectorAll(
            "body > div"
        )
        .forEach(
            el=>el.remove()
        );


    }


}