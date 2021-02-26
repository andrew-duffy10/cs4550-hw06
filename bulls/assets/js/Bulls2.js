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


import React, { useState, useEffect } from 'react';

function Bulls() {

    const [state, setState] =useState({
        secret: generateSecretCode(),
        guesses: [],
        results: [],
        text: "",
        status: "",
        playing: true,
    });

    useEffect(() => {
    cb_join(setState);
    })
    
    function makeGuess(guess) {
    cb_push(guess);
    }

    // Generates a random 4 digit string with each character between 0 and 9.
    function generateSecretCode() {
        let code = "";
        while (code.length < 4) {
            let x = Math.floor(Math.random()*10).toString();
            if (!code.includes(x)) {
                code+=x;
            }
        }

        return code;

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
        let state1 = Object.assign({},state,{text:ev.target.value});
        setState(state1);
    }

    // Verifies if a guess is valid. Returns true if the guess is valid, displays a message and returns false if not.
    function isValidGuess() {
        let len = state.text.length;
        if (len != state.secret.length) { // If the guess isn't the right length, not valid.
            let state1 = Object.assign({},state,{text:"",status:"Guesses must be "+state.secret.length+" characters long."});
            setState(state1);
            return false;
        } else if (new Set(state.text).size != state.text.length) { // Checks if the digits in the guess are unique
            let state1 = Object.assign({},state,{text:"",status:"Guesses must contain unique digits (no duplicates)."});
            setState(state1);
            return false;
        } else if (isNaN(state.text) || state.text.includes(" ") || state.text.includes(".")) { // Checks if the guess only contains digits.
            let state1 = Object.assign({},state,{text:"",status:"Guesses must only contain numbers."});
            setState(state1);
            return false;
        } else {
            return true;
        }
    }

    // Counts the number of bulls and cows are present in the current guess (if valid).
    // Clears the textbox and updates our state arrays.
    function makeGuess() {
        if (!isValidGuess()) {
            return
        }

        // Counts bulls and cows
        let bulls = 0;
        let cows = 0;
        for (let i = 0; i < state.secret.length; i++) {
            if (state.text[i] == state.secret[i]) {
                bulls++;
            } else if (state.secret.includes(state.text[i])) {
                cows++;
            }
        }

        // calculates new state values based on the guess
        let out = bulls+'A'+cows+'B';
        let newguesses = state.guesses.concat(state.text);
        let newresults = state.results.concat(out);

        // updates the state values based on the game's status
        if (bulls == state.secret.length) {
            let state2 = Object.assign({},state,{guesses:newguesses,results:newresults,text:"",status:"You won!",playing:false});
            setState(state2);
        } else if ((state.guesses.length+1) >= 8){
            let state2 = Object.assign({},state,{guesses:newguesses,results:newresults,text:"",status:"Game Over. Answer: "+state.secret,playing:false});
            setState(state2);
        } else {
            let state2 = Object.assign({},state,{guesses:newguesses,results:newresults,text:"",status:""});
            setState(state2);
        }

    }

    // Used by the DOM to pull values from our saved states, namely "guesses" and "results"
    function getVal(from_array,idx) {
        if (from_array.length >= idx) {
            return from_array[idx-1];
        } else {
            return;
        }
    }

    // Resets the game to default values
    function resetGame() {
        let secret = generateSecretCode();
        let guesses = [];
        let results = [];
        let text = "";
        let status = "";
        let playing = true;

        let state7 = Object.assign({}, state, {secret, guesses, results, text, status, playing});

        setState(state7);
    }

    return (
        <div className="Bulls">
            <h1>4digits</h1>
            <p>
            <input type="text"
                value={state.text}
                onChange={updateText}
                onKeyPress={keyPress}
                disabled={!state.playing}/>
            <button onClick={makeGuess} disabled={!state.playing}>Guess</button>
            </p>

            <p>
            <button onClick={resetGame}>Reset</button>
            </p>
            <h2>{state.status}</h2>
            <p>
            <table>
            <tr><th></th><th>Guess</th><th>Result</th></tr>
            <tr><td>1</td><td>{getVal(state.guesses,1)}</td><td>{getVal(state.results,1)}</td></tr>
            <tr><td>2</td><td>{getVal(state.guesses,2)}</td><td>{getVal(state.results,2)}</td></tr>
            <tr><td>3</td><td>{getVal(state.guesses,3)}</td><td>{getVal(state.results,3)}</td></tr>
            <tr><td>4</td><td>{getVal(state.guesses,4)}</td><td>{getVal(state.results,4)}</td></tr>
            <tr><td>5</td><td>{getVal(state.guesses,5)}</td><td>{getVal(state.results,5)}</td></tr>
            <tr><td>6</td><td>{getVal(state.guesses,6)}</td><td>{getVal(state.results,6)}</td></tr>
            <tr><td>7</td><td>{getVal(state.guesses,7)}</td><td>{getVal(state.results,7)}</td></tr>
            <tr><td>8</td><td>{getVal(state.guesses,8)}</td><td>{getVal(state.results,8)}</td></tr>

            </table>
            </p>

        </div>
    );

}

export default Bulls;

