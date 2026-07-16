import SocketManager from "../network/SocketManager.js";


export default class MenuScene extends Phaser.Scene {


    constructor(){

        super("MenuScene");

    }



    create(){


        const centerX =
        this.scale.width / 2;



        // =====================
        // TITRE
        // =====================


        this.add.text(
            centerX,
            80,
            "ESCAPE ILUM FACTORY",
            {
                fontSize:"48px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);



        // Création du conteneur HTML

        const container =
        document.createElement("div");


        container.style.position =
        "absolute";


        container.style.left =
        "50%";


        container.style.top =
        "50%";


        container.style.transform =
        "translate(-50%, -35%)";


        container.style.display =
        "flex";


        container.style.flexDirection =
        "column";


        container.style.alignItems =
        "center";


        container.style.gap =
        "25px";



        document.body.appendChild(
            container
        );



        // =====================
        // NOM
        // =====================


        const nameLabel =
        document.createElement("div");


        nameLabel.innerText =
        "Player's Name";


        nameLabel.style.color =
        "white";


        nameLabel.style.fontSize =
        "28px";


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



        // =====================
        // CREER
        // =====================


        const createButton =
        this.createHTMLButton(
            "Host",
            "#00ff00"
        );


        container.appendChild(
            createButton
        );



        // =====================
        // CODE
        // =====================


        const codeLabel =
        document.createElement("div");


        codeLabel.innerText =
        "Lobby's Code";


        codeLabel.style.color =
        "white";


        codeLabel.style.fontSize =
        "28px";


        container.appendChild(
            codeLabel
        );



        const codeInput =
        document.createElement("input");


        this.styleInput(
            codeInput
        );


        container.appendChild(
            codeInput
        );



        // =====================
        // REJOINDRE
        // =====================


        const joinButton =
        this.createHTMLButton(
            "Join",
            "#00ffff"
        );


        container.appendChild(
            joinButton
        );



        // =====================
        // ACTION CREER
        // =====================


        createButton.onclick =
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

                name:nameInput.value

            });


        };



        // =====================
        // ACTION REJOINDRE
        // =====================


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
                codeInput.value
                .toUpperCase(),


                name:
                nameInput.value

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


}