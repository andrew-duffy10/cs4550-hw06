// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
//import "../css/app.scss"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
//import "phoenix_html"

//import React, {useState } from 'react';
//import ReactDOM from 'react-dom';

// Credit to Nat Tuck's 06/07 Lecture notes
// https://github.com/NatTuck/scratch-2021-01/blob/master/notes-4550/07-phoenix/notes.md

import React, { useState, useEffect } from 'react';
import { ch_join, ch_push, ch_reset, ch_login, ch_ready_up, ch_leave, ch_observe } from './socket';

function Login() {

    const [names, setNames] =useState({
        username: "",
        gamename: ""
    });
    let {username, gamename} = names;

    function check_values() {
        if(!(gamename == "" || username == "")) {
            ch_login(username,gamename);
        }
    }

    return (
    <div>
           <h1>Enter Username:</h1>
           <input type="text"
                value = {username}
                onChange ={(ev) => setNames(
                {username: ev.target.value, gamename: gamename})} />
           <h1>Enter Gamename:</h1>
           <input type="text"
                value = {gamename}
                onChange ={(ev) => setNames({username: username, gamename: ev.target.value})} />
          <button onClick={() => check_values()}>Enter</button>
    </div>
    )
}

function Setup({state}) {
    let {name, guesses, results, status, playing, players, ready, observers, game_started } = state;
    function isReady(player) {
    if (ready.indexOf(player) != -1) {
    return "Ready";
    } else if (observers.indexOf(player) != -1) {
    return "Observer";
    } else {
    return "Not Ready";
    }
    }

    const playerlist = players.map((player) =>
    <tr><td>{player}</td><td>{isReady(player)}</td></tr>);


    return (
    <div>
           <h1>GameLobby</h1>

           <table>
           <tbody>
           <tr><th>Username</th><th>Ready?</th></tr>
           {playerlist}
           </tbody>
           </table>
           <button onClick={() => ch_ready_up(name)}>Ready Up</button>
           <button onClick={() => ch_observe(name)}>Become Observer</button>
    </div>
    )

}

function Play({state}) {
    let {name, guesses, results, status, playing, players, ready, observers, game_started } = state;
    const [text,setText] = useState("");

    function makeGuess() {
        ch_push({numbers: text,user_name: name});
        setText("");
    }


    // If the user presses enter while selecting the input text box, make a guess.
    // Credit to Nat Tuck's 01-29-21 'hangman' lecture notes
    function keyPress(ev) {
        if (ev.key == "Enter") {
            makeGuess();
        }
    }

    // Update's our internal text representation when the user updates the input text field.
    // Credit to Nat Tuck's 01-29-21 'hangman' lecture notes
    function updateText(ev) {
        let vv = ev.target.value;
        setText(vv);
    }

    // Verifies if a guess is valid. Returns true if the guess is valid, displays a message and returns false if not.
    function isValidGuess() {
        let len = text.length;
        if (len != 4) { // If the guess isn't the right length, not valid.
            return false;
        } else if (new Set(text).size != text.length) { // Checks if the digits in the guess are unique
            return false;
        } else if (isNaN(text) || text.includes(" ") || text.includes(".")) { // Checks if the guess only contains digits.
            return false;
        } else {
            return true;
        }
    }

    function makePass() {
        ch_push({numbers: "Pass",user_name: name});
        setText("");
    }

    // Counts the number of bulls and cows are present in the current guess (if valid).
    // Clears the textbox and updates our state arrays.

    function makeGuess() {
        // I left in my valid test just for better UI, it doesn't break the
        // elixir code if a non-valid answer is submitted.
        if (!isValidGuess()) {
            return
        }

        ch_push({numbers: text,user_name: name});
        setText("");


    }

    // Used by the DOM to pull values from our saved states, namely "guesses" and "results"
    function getVal(from_array,idx) {
        if (from_array.length >= idx) {
            return from_array[(from_array.length-idx)];
        } else {
            return;
        }
    }

    // Resets the game to default values
    function resetGame() {
        ch_reset(name);

        name= "";
        guesses = [];
        results= [];
        status = "";
        playing = true;
        //players= [];
        current_guesses: [];
        current_results: [];
        //ready= [];
        //observers= [];
        //game_started= false;

    }

    function leaveGame() {
        ch_leave(name);

        name= "";
        guesses = [];
        results= [];
        status = "";
        playing = true;
        players= [];
        ready= [];
        observers= [];
        game_started= false;
        current_guesses: [];
        current_results: [];

    }
    function isObserver() {
     return (observers.indexOf(name) != -1)
    }
    let pi = 0
    let turn = guesses.length
    const playerlist = [];
    //playerlist.push(<tr><td>{getVal(ready,pi+1)}</td><td>{turn}</td><td>{getVal(guesses,index+1)}</td><td>{getVal(results,index+1)}</td></tr>)

    for (const [index, value] of guesses.entries()) {
        for (const [index2, value2] of value.entries()) {
             if (index2%2 == 0) { // its a players name
             playerlist.push(<tr><td>{value2}</td><td>{turn}</td><td>{value[index2+1]}</td><td>{results[index][index2+1]}</td></tr>)
             }
        }
        turn = turn - 1

        //pi = (pi+1)%(players.length)
    }
    //const playerlist_flat =
    //const playerlist = guesses.map((player) =>
    //<tr><td>1</td><td>{getVal(guesses,1)}</td><td>{getVal(results,1)}</td></tr>);
    //<tr><td>{player}</td><td>{isReady(player)}</td></tr>);

    /*
                <tr><td>1</td><td>{getVal(guesses,1)}</td><td>{getVal(results,1)}</td></tr>
            <tr><td>2</td><td>{getVal(guesses,2)}</td><td>{getVal(results,2)}</td></tr>
            <tr><td>3</td><td>{getVal(guesses,3)}</td><td>{getVal(results,3)}</td></tr>
            <tr><td>4</td><td>{getVal(guesses,4)}</td><td>{getVal(results,4)}</td></tr>
            <tr><td>5</td><td>{getVal(guesses,5)}</td><td>{getVal(results,5)}</td></tr>
            <tr><td>6</td><td>{getVal(guesses,6)}</td><td>{getVal(results,6)}</td></tr>
            <tr><td>7</td><td>{getVal(guesses,7)}</td><td>{getVal(results,7)}</td></tr>
            <tr><td>8</td><td>{getVal(guesses,8)}</td><td>{getVal(results,8)}</td></tr>
            */


    return (
        <div className="Bulls">
            <h1>4digits</h1>
            <h2>Username: {name}</h2>
            <p>

            <input type="text"
                value={text}
                onChange={updateText}
                onKeyPress={keyPress}
                disabled={!playing}/>
            <button onClick={makeGuess} disabled={!state.playing || isObserver()}>Guess</button>
            </p>
            <p>
            <button onClick={makePass} disabled={isObserver()}>Pass</button>
            </p>

            <p>
            <button onClick={resetGame} disabled={isObserver()}>Reset</button>
            </p>

            <p>
            <button onClick={leaveGame}>Leave</button>
            </p>
            <h2>{state.status}</h2>

            <table>
            <tbody>
            <tr><th>Player</th><th>Turn</th><th>Guess</th><th>Result</th></tr>
            {playerlist}
            </tbody>
            </table>


        </div>
    );

}

function Bulls() {
    const [state, setState] =useState({
        name: "",
        guesses: [],
        results: [],
        status: "",
        playing: true,
        players: [],
        ready: [],
        observers: [],
        game_started: false,
        current_guesses: [],
        current_results: [],
    });


    useEffect(() => {
        ch_join(setState);
    });

    let body = null;

    if (state.name == "") {
        body = <Login />;
    } else if (state.ready.length != state.players.length && !state.game_started){
        body = <Setup state = {state} />;
    }
    else if ((state.ready.length == state.players.length && state.ready.length != 0) || state.game_started){
        body = <Play state = {state} />;
    } else {
        body = <Login />;
    }

    return (
        <div>{body}</div>
    );

}
export default Bulls;

