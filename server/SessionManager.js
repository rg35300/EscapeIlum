class SessionManager {

    constructor(){

        this.sessions = {};

    }


    createSession(map){

        const id =
        Math.random()
        .toString(36)
        .substring(2,8)
        .toUpperCase();


        this.sessions[id] = {

            id:id,

            map:map,

            players:[],

            ilum:null,

            employees:[],

            messages:[],

            starting:false

        };


        return this.sessions[id];

    }


    getSession(id){

        return this.sessions[id];

    }


    joinSession(id, player){

        const session =
        this.sessions[id];


        if(!session)
            return null;



        if(!session.ilum){

            player.role =
            "ilum";

            player.ready =
            false;

            session.ilum =
            player;


        } else {


            if(session.employees.length >= 4)
                return null;



            player.role =
            "employee";


            player.ready =
            false;


            session.employees.push(
                player
            );

        }



        session.players.push(
            player
        );


        return session;

    }


    setReady(sessionId, socketId){

        const session =
        this.sessions[sessionId];


        if(!session)
            return null;



        const player =
        session.players.find(
            p=>p.id === socketId
        );



        if(player){

            player.ready =
            true;

        }



        return session;

    }


    allReady(sessionId){

        const session =
        this.sessions[sessionId];


        if(!session || !session.ilum)
            return false;



        if(!session.ilum.ready)
            return false;



        return session.employees.every(
            player=>player.ready
        );

    }


    setStarting(sessionId){

        const session =
        this.sessions[sessionId];


        if(!session)
            return null;



        if(session.starting)
            return null;



        session.starting =
        true;



        return session;

    }


    addMessage(id,message){

        const session =
        this.sessions[id];


        if(!session)
            return null;



        session.messages.push(
            message
        );



        if(session.messages.length > 50)
            session.messages.shift();



        return session.messages;

    }


    removePlayer(socketId){

        for(
            const id in this.sessions
        ){

            const session =
            this.sessions[id];



            const index =
            session.players.findIndex(
                p=>p.id === socketId
            );



            if(index !== -1){


                const player =
                session.players[index];



                session.players.splice(
                    index,
                    1
                );



                if(player.role === "ilum"){


                    session.ilum =
                    null;


                } else {


                    session.employees =
                    session.employees.filter(
                        p=>p.id !== socketId
                    );

                }



                if(session.players.length === 0){


                    delete this.sessions[id];


                    return {

                        session:null,

                        player:player

                    };

                }



                return {

                    session:session,

                    player:player

                };


            }

        }



        return null;

    }


}


module.exports = SessionManager;