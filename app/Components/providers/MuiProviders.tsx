import { ThemeProvider, createTheme, PaletteOptions } from "@mui/material/styles";
import { cyan, grey, pink, yellow, deepOrange, lightGreen, green, teal, lime, purple } from "@mui/material/colors";

// Pour ajouter une nouvelle couleur à la palette
declare module '@mui/material/styles' {
    interface Palette {    // Pour pouvoir récupérer ces couleurs dans les composants faire par exemple : color=muiTheme.palette.ochre.main
        ochre: Palette['primary'];
        gray: Palette['primary'];
        pink: Palette['primary'];
        purple: Palette['primary'];
        lightCyan: Palette['primary'];
    }
    interface PaletteOptions {
        ochre?: PaletteOptions['primary'];
        gray?: PaletteOptions['primary'];
        pink?: PaletteOptions['primary'];
        purple?: PaletteOptions['primary'];
        lightCyan?: PaletteOptions['primary'];
    }
}
// Pour ajouter une nouvelle couleur au options de Button
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        ochre: true;
        gray: true;
        pink: true;
        purple: true;
        lightCyan: true;
    }
}

export default function MuiProviders({ children }: { children: React.ReactNode }) {
    const muiTheme = createTheme({    // Tout ce qu'on ne redéfinit pas reste par défaut
        palette: {
            // Généralement PRIMARY = bleu et SECONDARY = rose
            primary: cyan,
            secondary: deepOrange,
            success: green, 
            ochre: {
                main: '#E3D026',
                light: '#E9DB5D',
                dark: '#A29415',
                contrastText: '#242105',
            },
            gray: {
                main: '#CCC',
                light: '#EEE',
                dark: '#999',
                contrastText: '#242105',
            },
            pink: {
                main: pink[100],
                light: pink[50],
                dark: pink[200],
            },
            purple: {
                main: purple[200],
                light: purple[100],
                dark: purple[300],
            },
            lightCyan: {
                light: cyan[50],
                main: cyan[100],
            },
        },
        typography: {
            fontFamily: 'comic sans ms, Roboto, Arial',
        },
        components: {
            MuiTypography: {
                styleOverrides: {
                    "root": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",   // Ajout de 3 ... à la fin du texte si il est trop long
                        whiteSpace: 'nowrap'
                    },
                }
            },

            MuiTextField: {
                defaultProps: {
                    variant: "standard",
                    InputLabelProps: {
                        style: { color: 'gray', fontSize: '0.8rem' },
                    }
                },
                styleOverrides: {
                    "root": {    
                        "& .MuiInputBase-input": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",   // Ajout de 3 ... à la fin du texte si il est trop long
                        },
                    },
                }
            },          
            MuiButton: {
                defaultProps: {
                    style: {
                        fontWeight: 'bold',
                    },
                },
            },
        },
           });

  
    muiTheme.typography.h3 = {
        [muiTheme.breakpoints.up('xs')]: {   
            fontSize: '1.8rem',
            display: 'none'
        },
        [muiTheme.breakpoints.up('sm')]: { 
            fontSize: '2rem',
            overflow: 'auto',   // ajoute un scroll si on voit pas tout
            display: 'inline'
        },
        [muiTheme.breakpoints.up('md')]: {      // md = 900px
            fontSize: '2.4rem',
        },
        // [muiTheme.breakpoints.up('lg')]: {
        //   fontSize: '3rem',
        // },  
    };
    return (
        <ThemeProvider theme={muiTheme}>
            {children}
        </ThemeProvider>
    )
}
