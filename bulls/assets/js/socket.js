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

let channel = socket.channel("game:1",{});

let state = {
    name: "",
    secret: "",
    guesses: [],
    results: [],
    text: "",
    status: "",
    playing: true,
};
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

export function ch_reset() {
  channel.push("reset", {})
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

export function ch_login(name) {
    channel.push("login",{name: name})
           .receive("ok", state_update)
           .receive("error",resp => {
           console.log("Unable to push", resp)
           });
}

channel.join()
       .receive("ok",state_update)
       .receive("error",resp => {console.log("Unable to join",resp)});

channel.on("view",state_update);

export default socket

