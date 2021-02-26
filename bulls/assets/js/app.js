// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss"

import "phoenix_html";
import React from 'react';
import ReactDOM from 'react-dom';

import Bulls from './Bulls';


ReactDOM.render(
<React.StrictMode>
<Bulls />
</React.StrictMode>,
document.getElementById('root')
);