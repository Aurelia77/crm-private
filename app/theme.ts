import { createTheme, PaletteOptions } from '@mui/material/styles';

interface CustomPaletteOptions extends PaletteOptions {
    ochre?: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
    };
}

const muiTheme = createTheme({
    palette: {
        ochre: {
            main: '#E3D026',
            light: '#E9DB5D',
            dark: '#A29415',
            contrastText: '#242105',
        },
    } as CustomPaletteOptions,
});

const primary = {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#fff',
  };