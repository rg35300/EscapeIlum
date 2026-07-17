import { io } from "socket.io-client";


class SocketManager {


    constructor(){

        this.socket = null;

    }



    connect(){

        if(this.socket)
            return;


        this.socket =
        io("https://escapeilum.onrender.com/");


        this.socket.on(
            "connect",
            ()=>{

                console.log(
                    "Connecté :",
                    this.socket.id
                );

            }
        );

    }





    createSession(data){

        this.socket.emit(
            "create_session",
            data
        );

    }





    onSessionCreated(callback){

        this.socket.on(
            "session_created",
            callback
        );

    }





    joinSession(data){

        this.socket.emit(
            "join_session",
            data
        );

    }





    onSessionJoined(callback){

        this.socket.on(
            "session_joined",
            callback
        );

    }





    onPlayersUpdated(callback){

        this.socket.on(
            "players_updated",
            callback
        );

    }





    changeRole(role){

        this.socket.emit(
            "change_role",
            {
                role:role
            }
        );

    }





    playerReady(){

        this.socket.emit(
            "player_ready"
        );

    }





    onGameCountdown(callback){

        this.socket.on(
            "game_countdown",
            callback
        );

    }





    onStartGame(callback){

        this.socket.on(
            "start_game",
            callback
        );

    }





    sendChatMessage(message){

        this.socket.emit(
            "chat_message",
            message
        );

    }





    onChatMessage(callback){

        this.socket.on(
            "chat_message",
            callback
        );

    }


}


export default new SocketManager();