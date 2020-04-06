import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'tabler-react/dist/Tabler.css';
import GlobalStyle from './styles/global';
import './styles/custom.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <GlobalStyle />
  </React.StrictMode>,
  document.getElementById('root')
);
