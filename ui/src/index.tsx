import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';
import { Provider } from "react-redux";
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { store } from './redux/store';
import firebase from 'firebase/compat/app'
import { CookiesProvider } from 'react-cookie';
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from './pages/ErrorPage';

const firebaseConfig = {
  apiKey: "AIzaSyDZfv8UqhzEugpv8zqqYavPP8NdQw_D-Pc",
  authDomain: "grad-research-4d949.firebaseapp.com",
  projectId: "grad-research-4d949",
  storageBucket: "grad-research-4d949.appspot.com",
  messagingSenderId: "310015956834",
  appId: "1:310015956834:web:777121a60e2060edaabe3b",
  measurementId: "G-N2RM0EJ57P"
}

firebase.initializeApp(firebaseConfig)

const THEME = createTheme({
  typography: {
    "fontFamily": `"Nunito Sans", sans-serif;`,
    "fontSize": 11,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: { color: "red" },
      },
    },
  },
});
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router>
    <ThemeProvider theme={THEME}>
      <React.StrictMode>
        <Provider store={store}>
          <CookiesProvider>
            <ErrorBoundary fallback={<ErrorPage></ErrorPage>}>
              <App />
            </ErrorBoundary>
          </CookiesProvider>
        </Provider>
      </React.StrictMode>
    </ThemeProvider>
  </Router>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
