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
import { ch_join, ch_push, ch_reset, ch_login } from './socket';

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
    let {name, guesses, results, status, playing, players } = state;
    return (
    <div>
           <h1>GameLobby</h1>
           <p>{players}</p>
           <button onClick={() => ch_login(username)}>Ready Up</button>
    </div>
    )
}

function Play({state}) {
    let {name, guesses, results, status, playing, players, ready } = state;
    const [text,setText] = useState("");

    function makeGuess() {
        ch_push({numbers: text});
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

    // Counts the number of bulls and cows are present in the current guess (if valid).
    // Clears the textbox and updates our state arrays.

    function makeGuess() {
        // I left in my valid test just for better UI, it doesn't break the
        // elixir code if a non-valid answer is submitted.
        if (!isValidGuess()) {
            return
        }

        ch_push({numbers: text});
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
        ch_reset();

        name= "",
        guesses = [],
        results= [],
        status = "",
        playing = true,
        players = [],
        ready = 0

    }

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
            <button onClick={makeGuess} disabled={!state.playing}>Guess</button>
            </p>

            <p>
            <button onClick={resetGame}>Reset</button>
            </p>
            <h2>{state.status}</h2>

            <table>
            <tbody>
            <tr><th></th><th>Guess</th><th>Result</th></tr>
            <tr><td>1</td><td>{getVal(guesses,1)}</td><td>{getVal(results,1)}</td></tr>
            <tr><td>2</td><td>{getVal(guesses,2)}</td><td>{getVal(results,2)}</td></tr>
            <tr><td>3</td><td>{getVal(guesses,3)}</td><td>{getVal(results,3)}</td></tr>
            <tr><td>4</td><td>{getVal(guesses,4)}</td><td>{getVal(results,4)}</td></tr>
            <tr><td>5</td><td>{getVal(guesses,5)}</td><td>{getVal(results,5)}</td></tr>
            <tr><td>6</td><td>{getVal(guesses,6)}</td><td>{getVal(results,6)}</td></tr>
            <tr><td>7</td><td>{getVal(guesses,7)}</td><td>{getVal(results,7)}</td></tr>
            <tr><td>8</td><td>{getVal(guesses,8)}</td><td>{getVal(results,8)}</td></tr>
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
        ready: 0
    });


    useEffect(() => {
        ch_join(setState);
    });

    let body = null;

    if (state.name == "") {
        body = <Login />;
    } else if (state.ready != state.players.length){
        body = <Setup state = {state} />;
    }
    else {
        body = <Play state = {state} />;
    }

    return (
        <div>{body}</div>
    );

}
export default Bulls;

