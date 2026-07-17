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




    joinSession(id,player){


        const session =
        this.sessions[id];


        if(!session)
            return null;



        session.players.push(
            player
        );



        player.role = null;

        player.ready = false;



        return session;

    }




    changeRole(sessionId,socketId,role){


        const session =
        this.sessions[sessionId];


        if(!session)
            return null;



        const player =
        session.players.find(
            p=>p.id === socketId
        );



        if(!player)
            return null;



        if(session.ilum?.id === socketId){

            session.ilum = null;

        }



        session.employees =
        session.employees.filter(
            p=>p.id !== socketId
        );



        if(role === "ilum"){


            if(session.ilum)
                return null;



            player.role =
            "ilum";



            session.ilum =
            player;


        }



        if(role === "employee"){


            if(session.employees.length >= 4)
                return null;



            player.role =
            "employee";



            session.employees.push(
                player
            );

        }



        return session;

    }





    setReady(sessionId,socketId){


        const session =
        this.sessions[sessionId];


        if(!session)
            return null;



        const player =
        session.players.find(
            p=>p.id === socketId
        );



        if(player)
            player.ready = true;



        return session;

    }





    allReady(sessionId){


        const session =
        this.sessions[sessionId];



        if(!session)
            return false;



        if(!session.ilum)
            return false;



        if(session.employees.length === 0)
            return false;



        if(!session.ilum.ready)
            return false;



        return session.employees.every(
            p=>p.ready
        );

    }





    setStarting(sessionId){


        const session =
        this.sessions[sessionId];



        if(!session)
            return null;



        if(session.starting)
            return null;



        session.starting = true;



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


        for(const id in this.sessions){



            const session =
            this.sessions[id];



            const player =
            session.players.find(
                p=>p.id === socketId
            );



            if(player){



                session.players =
                session.players.filter(
                    p=>p.id !== socketId
                );



                if(session.ilum?.id === socketId){

                    session.ilum = null;

                }



                session.employees =
                session.employees.filter(
                    p=>p.id !== socketId
                );



                if(session.players.length === 0){

                    delete this.sessions[id];


                    return null;

                }



                return session;


            }


        }


        return null;

    }


}


module.exports = SessionManager;