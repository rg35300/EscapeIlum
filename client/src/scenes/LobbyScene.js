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
            "CHAT",
            {
                fontSize:"32px",
                color:"#ffffff"
            }
        )
        .setOrigin(0.5);



        this.createChatBox();

        this.createChatInput();



        this.playersListener =
        (session)=>{


            this.session =
            session;


            this.drawPlayers();


            this.updateRoleButtons();


        };



        this.chatListener =
        (data)=>{


            this.addMessage(
                data
            );


        };



        this.countdownListener =
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


        };



        this.startGameListener =
        (session)=>{


            const me =
            session.players.find(
                p=>p.id === SocketManager.socket.id
            );



            if(!me)
                return;



            if(me.role === "ilum"){


                this.scene.start(
"GameScene",
{
session:session,
role:me.role
}
);


            }
            else{


                this.scene.start(
                    "GameScene",
                    {
                    session:session,
                    role:me.role
                    }
                    );


            }


        };



        SocketManager.onPlayersUpdated(
            this.playersListener
        );


        SocketManager.onChatMessage(
            this.chatListener
        );


        SocketManager.onGameCountdown(
            this.countdownListener
        );


        SocketManager.onStartGame(
            this.startGameListener
        );



        this.events.once(
            "shutdown",
            ()=>{
                this.cleanup();
            }
        );


        this.events.once(
            "destroy",
            ()=>{
                this.cleanup();
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


    }





    updateRoleButtons(){


        const me =
        this.session.players.find(
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
        else if(me.role === "employee"){


            this.employeeButton.setText(
                "EMPLOYEE ✓"
            );


            this.ilumButton.setText(
                "DEVENIR ILUM"
            );


        }
        else{


            this.ilumButton.setText(
                "DEVENIR ILUM"
            );


            this.employeeButton.setText(
                "DEVENIR EMPLOYEE"
            );


        }


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


        this.chatBox =
        document.createElement("div");


        this.chatBox.style.position =
        "absolute";


        this.chatBox.style.left =
        "calc(75% - 225px)";


        this.chatBox.style.top =
        "250px";


        this.chatBox.style.width =
        "450px";


        this.chatBox.style.height =
        "260px";


        this.chatBox.style.background =
        "#222";


        this.chatBox.style.color =
        "white";


        this.chatBox.style.padding =
        "10px";


        this.chatBox.style.fontSize =
        "20px";


        this.chatBox.style.overflowY =
        "auto";


        document.body.appendChild(
            this.chatBox
        );


    }





    createChatInput(){


        this.chatInput =
        document.createElement("input");


        this.chatInput.placeholder =
        "Message...";


        this.chatInput.style.position =
        "absolute";


        this.chatInput.style.left =
        "calc(75% - 225px)";


        this.chatInput.style.top =
        "520px";


        this.chatInput.style.width =
        "350px";


        document.body.appendChild(
            this.chatInput
        );



        this.chatButton =
        document.createElement("button");


        this.chatButton.innerText =
        "SEND";


        this.chatButton.style.position =
        "absolute";


        this.chatButton.style.left =
        "calc(75% + 130px)";


        this.chatButton.style.top =
        "520px";


        document.body.appendChild(
            this.chatButton
        );



        const send =
        ()=>{


            const message =
            this.chatInput.value.trim();



            if(message === "")
                return;



            SocketManager.sendChatMessage(
                message
            );


            this.chatInput.value =
            "";


        };



        this.chatButton.onclick =
        send;



        this.chatInput.addEventListener(
            "keydown",
            e=>{


                if(e.key === "Enter")
                    send();


            }
        );


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





    cleanup(){


        this.removeHTML();



        if(this.playersListener)
            SocketManager.socket.off(
                "players_updated",
                this.playersListener
            );


        if(this.chatListener)
            SocketManager.socket.off(
                "chat_message",
                this.chatListener
            );


        if(this.countdownListener)
            SocketManager.socket.off(
                "game_countdown",
                this.countdownListener
            );


        if(this.startGameListener)
            SocketManager.socket.off(
                "start_game",
                this.startGameListener
            );


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