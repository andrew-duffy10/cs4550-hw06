// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.

// Credit to Nat Tuck's 07 Lecture notes
// https://github.com/NatTuck/scratch-2021-01/blob/master/notes-4550/07-phoenix/notes.md

import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: ""}})
socket.connect();

//let channel = socket.channel("game:1",{});

let state = {
    name: "",
    secret: "",
    guesses: [],
    results: [],
    text: "",
    status: "",
    playing: true,
    players: [],
    ready: [],
    observers: [],
    game_started: false,
    current_guesses: [],
    current_results: [],
    winners: [],
};
let channel = null;
let callback = null;

function state_update(new_state) {
    console.log("New state:",new_state);
    state = new_state;
    if (callback) {
        callback(new_state);
    }
}

export function ch_join(cb) {
    callback = cb;
    callback(state);
}

export function ch_push(guess) {
    channel.push("guess",guess)
           .receive("ok",state_update)
           .receive("error",resp => {console.log("Unable to push:",resp)});
}

export function ch_reset(user_name) {
  channel.push("reset", {user_name: user_name})
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

export function ch_ready_up(user_name) {
    channel.push("ready",{user_name: user_name})
           .receive("ok", state_update)
           .receive("error",resp => {
           console.log("Unable to push", resp)
           });
}

export function ch_observe(user_name) {
    channel.push("observe",{user_name: user_name})
           .receive("ok", state_update)
           .receive("error",resp => {
           console.log("Unable to push", resp)
           });
}

export function ch_leave(user_name) {
   channel.push("leave",{user_name: user_name})
           .receive("ok", state_update({
    name: "",
    secret: "",
    guesses: [],
    results: [],
    text: "",
    status: "",
    playing: true,
    players: [],
    ready: [],
    observers: [],
    game_started: false,
    current_guesses: [],
    current_results: [],
    winners: [],
    }))
           .receive("error",resp => {
           console.log("Unable to push", resp)
           });

}


export function ch_login(user_name,game_name) {
    channel = socket.channel("game:"+game_name,{})
    channel.join()
       .receive("ok",resp => {state_update(resp); channel.on("view",state_update);})
       .receive("error",resp => {console.log("Unable to join",resp)});

    channel.push("login",{game_name: game_name, user_name: user_name})
           .receive("ok", state_update)
           .receive("error",resp => {
           console.log("Unable to push", resp)
           });
}



export default socket

