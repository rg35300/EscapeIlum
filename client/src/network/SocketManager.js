import { io } from "socket.io-client";


class SocketManager {


    constructor(){

        this.socket = null;

        this.player = null;

    }



    connect(){


        if(this.socket){

            return;

        }



        this.socket =
        io("https://escapeilum.onrender.com/");



        this.socket.on(
            "connect",
            ()=>{


                console.log(
                    "Connecté au serveur :",
                    this.socket.id
                );


            }
        );


    }






    createSession(data){


        this.player = {

            name:data.name

        };


        this.socket.emit(
            "create_session",
            data
        );


    }






    onSessionCreated(callback){


        this.socket.on(
            "session_created",
            (session)=>{


                this.player =
                session.players.find(
                    p=>p.id === this.socket.id
                );


                callback(session);


            }
        );


    }






    joinSession(data){


        this.player = {

            name:data.name

        };


        this.socket.emit(
            "join_session",
            data
        );


    }







    onSessionJoined(callback){


        this.socket.on(
            "session_joined",
            (session)=>{


                this.player =
                session.players.find(
                    p=>p.id === this.socket.id
                );


                callback(session);


            }
        );


    }






    // CHAT


    sendChatMessage(data){


        this.socket.emit(
            "chat_message",
            data
        );


    }





    onChatMessage(callback){


        this.socket.on(
            "chat_message",
            callback
        );


    }







    // AVATAR


    sendAvatar(data){


        this.socket.emit(
            "avatar_update",
            data
        );


    }







    onPlayersUpdated(callback){


        this.socket.on(
            "players_updated",
            (players)=>{


                this.player =
                players.find(
                    p=>p.id === this.socket.id
                ) || this.player;



                callback(players);


            }
        );


    }




}


export default new SocketManager();