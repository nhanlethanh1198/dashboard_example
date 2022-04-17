// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import Slide from '@mui/material/Slide';
// Redux
import {StoreProvider} from 'easy-peasy';
import GlobalModel from './globalmodel';

//
import App from './App';
// import CustomSnackbar from "./components/CustomSnackbar";
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import {SnackbarProvider} from 'notistack';

// ----------------------------------------------------------------------

ReactDOM.render(
  <StoreProvider store={GlobalModel}>
    <HelmetProvider>
      <SnackbarProvider
        maxSnack={5}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        autoHideDuration={5000}
        disableWindowBlurListener
        preventDuplicate
        TransitionComponent={(props) => <Slide {...props} direction="right" />}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SnackbarProvider>
    </HelmetProvider>
  </StoreProvider>,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
