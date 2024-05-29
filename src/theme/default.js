import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#80A9F8',
        },
        secondary: {
            main: '#ACB1C0',
        },
        error: {
            main: red.A400,
        },
    },
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif',
    },
});

export default theme;