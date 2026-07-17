import SocketManager from "../network/SocketManager.js";


export default class MenuScene extends Phaser.Scene {


    constructor(){

        super("MenuScene");

    }






    create(){


        this.selectedAvatar =
        "SAMOYED_1";



        const width =
        this.scale.width;







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










        this.add.text(
            width / 2,
            250,
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









        const startX =
        width / 2 - 225;



        const y =
        320;









        avatars.forEach(
            (avatar,index)=>{





                const img =
                this.add.image(
                    startX + index * 75,
                    y,
                    avatar
                );







                img.setDisplaySize(
                    60,
                    60
                );








                img.setInteractive();







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








        this.createHTMLMenu();



    }













    createHTMLMenu(){





        const container =
        document.createElement("div");





        this.htmlContainer =
        container;








        container.style.position =
        "absolute";



        container.style.left =
        "50%";



        container.style.top =
        "345px";



        container.style.transform =
        "translateX(-50%)";



        container.style.display =
        "flex";



        container.style.flexDirection =
        "column";



        container.style.alignItems =
        "center";



        container.style.gap =
        "8px";








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





                    this.cleanHTML();





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





                    this.cleanHTML();





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












    updateAvatarSelection(selected){





        this.avatarImages.forEach(
            (data)=>{






                if(
                    data.name === selected
                ){





                    data.image.setDisplaySize(
                        80,
                        80
                    );





                    data.image.setDepth(
                        10
                    );




                }
                else{





                    data.image.setDisplaySize(
                        60,
                        60
                    );





                    data.image.setDepth(
                        0
                    );




                }



            }
        );




    }













    styleInput(input){



        input.style.width =
        "300px";



        input.style.height =
        "40px";



        input.style.fontSize =
        "22px";



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
        "45px";



        button.style.fontSize =
        "26px";



        button.style.color =
        color;





        button.style.background =
        "#222";





        button.style.cursor =
        "pointer";







        return button;



    }












    cleanHTML(){



        if(
            this.htmlContainer
        ){


            this.htmlContainer.remove();


        }



    }









    shutdown(){


        this.cleanHTML();


    }





}