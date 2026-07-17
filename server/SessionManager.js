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

            players:[]

        };


        return this.sessions[id];

    }





    getSession(id){


        return this.sessions[id];


    }





    joinSession(id, player){


        const session =
        this.sessions[id];



        if(!session){

            return null;

        }



        session.players.push(player);



        return session;

    }


}


module.exports = SessionManager;