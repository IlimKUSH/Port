import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {ToastContainer} from "react-toastify";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from "./theme/default";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer autoClose={3000} />
    </ThemeProvider>,
);