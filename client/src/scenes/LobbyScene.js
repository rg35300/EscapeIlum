import SocketManager from "../network/SocketManager.js";


export default class LobbyScene extends Phaser.Scene {


    constructor(){

        super("LobbyScene");

    }



    init(data){

        this.session =
        data.session;


        this.localReady =
        false;

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



        this.add.text(
            width * 0.25,
            170,
            "ROLES",
            {
                fontSize:"35px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);



        this.add.rectangle(
            width * 0.25,
            270,
            400,
            150,
            0xd8b4ff
        );



        this.add.text(
            width * 0.25,
            220,
            "ILUM",
            {
                fontSize:"30px",
                color:"#000000"
            }
        )
        .setOrigin(0.5);



        this.ilumContainer =
        this.add.container(
            width * 0.25,
            280
        );



        this.add.text(
            width * 0.25,
            390,
            "EMPLOYEES",
            {
                fontSize:"30px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);



        this.employeesContainer =
        this.add.container(
            width * 0.25,
            470
        );



        this.drawPlayers();



        this.createRoleButtons();

        this.createReadyButton();



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


                this.session =
                session;


                this.drawPlayers();


            }
        );



        SocketManager.onChatMessage(
            (data)=>{

                this.addMessage(
                    data
                );

            }
        );



        SocketManager.onGameCountdown(
            (time)=>{


                if(this.countdownText)
                    this.countdownText.destroy();



                this.countdownText =
                this.add.text(
                    width / 2,
                    height - 80,
                    "START IN " + time,
                    {
                        fontSize:"45px",
                        color:"#ff0000"
                    }
                )
                .setOrigin(0.5);


            }
        );



        SocketManager.onStartGame(
            (session)=>{


                const me =
                session.players.find(
                    p=>p.id === SocketManager.socket.id
                );



                if(!me)
                    return;



                if(me.role === "ilum"){


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

    drawPlayers(){


        this.ilumContainer.removeAll(
            true
        );


        this.employeesContainer.removeAll(
            true
        );



        const ilum =
        this.session.players.find(
            p=>p.role === "ilum"
        );



        const employees =
        this.session.players.filter(
            p=>p.role === "employee"
        );



        if(ilum){


            const avatar =
            this.add.image(
                -120,
                0,
                ilum.avatar || "SAMOYED_1"
            );


            avatar.setDisplaySize(
                60,
                60
            );



            const name =
            this.add.text(
                -50,
                0,
                ilum.name,
                {
                    fontSize:"26px",
                    color:"#000000"
                }
            )
            .setOrigin(
                0,
                0.5
            );



            const status =
            this.add.text(
                130,
                0,
                ilum.ready
                ? "READY"
                : "WAIT",
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
                status
            ]);


        }



        let y = 0;



        employees.forEach(
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
                    player.name,
                    {
                        fontSize:"24px",
                        color:"#ffffff"
                    }
                )
                .setOrigin(
                    0,
                    0.5
                );



                const status =
                this.add.text(
                    130,
                    y,
                    player.ready
                    ? "READY"
                    : "WAIT",
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
                    status
                ]);



                y += 65;


            }
        );


    }





    createRoleButtons(){


        const width =
        this.scale.width;



        this.ilumButton =
        this.add.text(
            width * 0.12,
            620,
            "DEVENIR ILUM",
            {
                fontSize:"22px",
                backgroundColor:"#c084fc",
                color:"#000000",
                padding:{
                    x:15,
                    y:10
                }
            }
        )
        .setOrigin(0.5)
        .setInteractive();



        this.employeeButton =
        this.add.text(
            width * 0.38,
            620,
            "DEVENIR EMPLOYEE",
            {
                fontSize:"22px",
                backgroundColor:"#555555",
                color:"#ffffff",
                padding:{
                    x:15,
                    y:10
                }
            }
        )
        .setOrigin(0.5)
        .setInteractive();



        this.ilumButton.on(
            "pointerdown",
            ()=>{


                SocketManager.changeRole(
                    "ilum"
                );


            }
        );



        this.employeeButton.on(
            "pointerdown",
            ()=>{


                SocketManager.changeRole(
                    "employee"
                );


            }
        );



        SocketManager.onPlayersUpdated(
            (session)=>{


                const me =
                session.players.find(
                    p=>p.id === SocketManager.socket.id
                );



                if(!me)
                    return;



                if(me.role === "ilum"){


                    this.ilumButton.setText(
                        "ILUM ✓"
                    );


                    this.employeeButton.setText(
                        "DEVENIR EMPLOYEE"
                    );


                }



                if(me.role === "employee"){


                    this.employeeButton.setText(
                        "EMPLOYEE ✓"
                    );


                    this.ilumButton.setText(
                        "DEVENIR ILUM"
                    );


                }


            }
        );


    }





    createReadyButton(){


        this.readyButton =
        this.add.text(
            this.scale.width / 2,
            this.scale.height - 40,
            "READY",
            {
                fontSize:"30px",
                backgroundColor:"#008800",
                padding:{
                    x:25,
                    y:10
                }
            }
        )
        .setOrigin(0.5)
        .setInteractive();



        this.readyButton.on(
            "pointerdown",
            ()=>{


                if(this.localReady)
                    return;



                SocketManager.playerReady();



                this.localReady =
                true;



                this.readyButton.setText(
                    "READY ✓"
                );


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
        "calc(75% - 225px)";


        input.style.top =
        "520px";


        input.style.width =
        "350px";


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
        "calc(75% + 130px)";


        button.style.top =
        "520px";


        button.style.width =
        "90px";


        button.style.height =
        "35px";



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