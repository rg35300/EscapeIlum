import SocketManager from "../network/SocketManager.js";


export default class MenuScene extends Phaser.Scene {


    constructor(){

        super("MenuScene");

    }





    create(){


        this.selectedAvatar = "SAMOYED_1";


        const width =
        this.scale.width;


        const height =
        this.scale.height;



        this.add.text(
            width / 2,
            60,
            "ESCAPE ILUM FACTORY",
            {
                fontSize:"48px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);







        // TITRE AVATAR

        this.add.text(
            width / 2,
            260,
            "Choose your avatar",
            {
                fontSize:"28px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);








        this.avatarImages = [];



        const avatars = [

            "SAMOYED_1",
            "SAMOYED_2",
            "SAMOYED_3",
            "SAMOYED_4",
            "SAMOYED_5",
            "SAMOYED_6",
            "SAMOYED_7"

        ];






        let startX =
        width / 2 - 210;


        let y =
        340;






        avatars.forEach(
            (avatar,index)=>{


                const img =
                this.add.image(
                    startX + index * 70,
                    y,
                    avatar
                );



                img.setDisplaySize(
                    60,
                    60
                );



                img.setInteractive();



                img.setMask(
                    this.createCircleMask(
                        startX + index * 70,
                        y,
                        30
                    )
                );



                img.on(
                    "pointerdown",
                    ()=>{


                        this.selectedAvatar =
                        avatar;



                        this.updateAvatarSelection(
                            avatar
                        );


                    }
                );



                this.avatarImages.push({

                    name:avatar,

                    image:img


                });


            }
        );





        this.updateAvatarSelection(
            "SAMOYED_1"
        );









        // MENU HTML

        const container =
        document.createElement("div");



        container.style.position =
        "absolute";


        container.style.left =
        "50%";


        container.style.top =
        "150px";


        container.style.transform =
        "translateX(-50%)";


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








        const hostButton =
        this.createHTMLButton(
            "HOST",
            "#00ff00"
        );


        container.appendChild(
            hostButton
        );








        const codeInput =
        document.createElement("input");


        codeInput.placeholder =
        "Lobby Code";


        this.styleInput(
            codeInput
        );


        container.appendChild(
            codeInput
        );








        const joinButton =
        this.createHTMLButton(
            "JOIN",
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


                name:nameInput.value,


                avatar:this.selectedAvatar


            });


        };




    }









    createCircleMask(x,y,radius){


        const graphics =
        this.make.graphics();


        graphics.fillStyle(
            0xffffff
        );


        graphics.fillCircle(
            x,
            y,
            radius
        );


        return graphics.createGeometryMask();


    }









    updateAvatarSelection(selected){



        this.avatarImages.forEach(
            (data)=>{


                if(
                    data.name === selected
                ){


                    data.image.setScale(
                        0.9
                    );


                }
                else{


                    data.image.setScale(
                        0.7
                    );


                }


            }
        );


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