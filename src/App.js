import React from 'react';
import { Router } from 'react-router-dom';
import { createHashHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import { chartjs } from './helpers';
import Adapter from './adapter';
import validate from 'validate.js';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';

const hashHistory = createHashHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

function App() {

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <Adapter>
          <Router history={hashHistory}>
            <Routes />
          </Router>
        </Adapter>
      </SnackbarProvider>
    </ThemeProvider>
  );

}

export default App;
