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



        // ILUM

        this.add.text(
            width * 0.25,
            180,
            "ILUM",
            {
                fontSize:"32px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);



        this.ilumBackground =
        this.add.rectangle(
            width * 0.25,
            290,
            350,
            180,
            0xd8b4ff
        );



        this.ilumContainer =
        this.add.container(
            width * 0.25,
            270
        );



        this.drawIlum(
            this.session.ilum
        );



        // EMPLOYEES

        this.add.text(
            width * 0.25,
            420,
            "EMPLOYEES",
            {
                fontSize:"32px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);



        this.employeesContainer =
        this.add.container(
            width * 0.25,
            480
        );



        this.drawEmployees(
            this.session.employees
        );



        this.createReadyButton();


        this.createStartButton();



        // CHAT

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



        this.createChatBox();

        this.createChatInput();



        SocketManager.onPlayersUpdated(
            (session)=>{


                this.session = session;


                this.drawIlum(
                    session.ilum
                );


                this.drawEmployees(
                    session.employees
                );


            }
        );



        SocketManager.onStartGame(
            (session)=>{


                if(
                    session.ilum.id === SocketManager.socket.id
                ){

                    this.scene.start(
                        "IlumScene",
                        {
                            session:session
                        }
                    );


                }
                else{


                    this.scene.start(
                        "EmployeeScene",
                        {
                            session:session
                        }
                    );

                }


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

    drawIlum(player){


        this.ilumContainer.removeAll(
            true
        );


        if(!player)
            return;



        const avatar =
        this.add.image(
            -120,
            0,
            player.avatar || "SAMOYED_1"
        );


        avatar.setDisplaySize(
            60,
            60
        );



        const name =
        this.add.text(
            -50,
            0,
            player.name || "Ilum",
            {
                fontSize:"26px",
                color:"#000000"
            }
        )
        .setOrigin(
            0,
            0.5
        );



        const ready =
        this.add.text(
            100,
            0,
            player.ready ? "READY" : "WAIT",
            {
                fontSize:"22px",
                color:"#000000"
            }
        )
        .setOrigin(
            0,
            0.5
        );



        this.ilumContainer.add([
            avatar,
            name,
            ready
        ]);

    }





    drawEmployees(players){


        this.employeesContainer.removeAll(
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
                    50,
                    50
                );



                const name =
                this.add.text(
                    -60,
                    y,
                    player.name || "Employee",
                    {
                        fontSize:"24px",
                        color:"#ffffff"
                    }
                )
                .setOrigin(
                    0,
                    0.5
                );



                const ready =
                this.add.text(
                    120,
                    y,
                    player.ready ? "READY" : "WAIT",
                    {
                        fontSize:"20px",
                        color:"#00ff00"
                    }
                )
                .setOrigin(
                    0,
                    0.5
                );



                this.employeesContainer.add([
                    avatar,
                    name,
                    ready
                ]);



                y += 65;


            }
        );


    }





    createReadyButton(){


        this.readyButton =
        this.add.text(
            this.scale.width * 0.25,
            this.scale.height - 80,
            "READY",
            {
                fontSize:"30px",
                backgroundColor:"#008800",
                padding:{
                    x:20,
                    y:10
                }
            }
        )
        .setOrigin(0.5)
        .setInteractive();



        this.readyButton.on(
            "pointerdown",
            ()=>{


                SocketManager.playerReady();


                this.readyButton.setText(
                    "READY !"
                );


            }
        );


    }





    createStartButton(){


        this.startButton =
        this.add.text(
            this.scale.width / 2,
            this.scale.height - 40,
            "START GAME",
            {
                fontSize:"35px",
                backgroundColor:"#0055ff",
                padding:{
                    x:25,
                    y:10
                }
            }
        )
        .setOrigin(0.5)
        .setInteractive();



        this.startButton.setVisible(
            false
        );



        this.startButton.on(
            "pointerdown",
            ()=>{


                SocketManager.playerReady();


            }
        );


    }





    createChatBox(){


        const chatBox =
        document.createElement("div");


        chatBox.style.position =
        "absolute";


        chatBox.style.left =
        "calc(75% - 225px)";


        chatBox.style.top =
        "250px";


        chatBox.style.width =
        "450px";


        chatBox.style.height =
        "260px";


        chatBox.style.background =
        "#222";


        chatBox.style.color =
        "white";


        chatBox.style.fontSize =
        "20px";


        chatBox.style.padding =
        "10px";


        chatBox.style.boxSizing =
        "border-box";


        chatBox.style.overflowY =
        "auto";


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
        "calc(75% - 225px)";


        input.style.top =
        "520px";


        input.style.width =
        "350px";


        input.style.height =
        "35px";


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
        "calc(75% + 130px)";


        button.style.top =
        "520px";


        button.style.height =
        "35px";


        button.style.width =
        "90px";


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


                if(event.key === "Enter")
                    sendMessage();


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