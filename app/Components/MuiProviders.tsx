import { ThemeProvider, createTheme, PaletteOptions } from "@mui/material/styles";
import { cyan, grey, pink, yellow, deepOrange, lightGreen, green, teal, lime } from "@mui/material/colors";

   // Pour ajouter une nouvelle couleur à la palette
   declare module '@mui/material/styles' {
    interface Palette {    // Pour pouvoir récupérer ces couleurs dans les composants en faisant par exemple : color=muiTheme.palette.ochre.main
        ochre: Palette['primary'];
        gray: Palette['primary'];
        pink: Palette['primary'];
        lightCyan: Palette['primary'];
    }
    interface PaletteOptions {
        ochre?: PaletteOptions['primary'];
        gray?: PaletteOptions['primary'];
        pink?: PaletteOptions['primary'];
        lightCyan?: PaletteOptions['primary'];
    }

}
// Pour ajouter une nouvelle couleur au options de Button
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        ochre: true;
        gray: true;
        pink: true;
        lightCyan: true;
    }
}



export default function MuiProviders({ children }: { children: React.ReactNode }) {

 

const muiTheme = createTheme({    // Tout ce qu'on ne redéfinit pas reste par défaut
    palette: {
        // Généralement PRIMARY = bleu et SECONDARY = rose
        primary: cyan,
        secondary: deepOrange,
        // primary: {
        //   main: cyan[500], // A partir de 700 la couleur du texte devient blanche pour les boutons MUI sur CYAN...
        //   //main: pink[700], 
        // },
        // secondary: {
        //   main: yellow[800]
        // },
        success: green,  //lime, // teal,
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
            main: pink[700],
        },
        lightCyan: {
            light: cyan[50],
            main: cyan[100],
        },
    },
    typography: {
        fontFamily: 'comic sans ms, Roboto, Arial',
        //fontSize: 20,
        //fontFamily: 'Roboto, Arial',
        // fontFamily: 'Raleway, Arial',
        // h3: {
        //     color: 'red',
        // }
    },
    components: {
        // Demande d'ajouter 3 petits points à la fin du texte si il est trop long
        MuiTextField: {
            defaultProps: {
                variant: "standard",
                InputProps: {
                    //disableUnderline: true,
                },
            },
            styleOverrides: {
                "root": {
                    //variant:"standard",        
                    "& .MuiInputBase-input": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        //textAlign: "center",
                    },
                },
            }
        },
        MuiTableRow: {
            defaultProps: {
                // The props to change the default for.
                //style: { backgroundColor: "blue" }, 
            },
            styleOverrides: {
                "root": {
                    "&:nth-of-type(odd)": {
                        //"backgroundColor": "#EEE", // Pas possible car écrase la couleur de fond de la ligne sélectionnée !
                        //"backgroundColor": "gray.light",
                        //opacity: 0.5,
                    },
                    "&:hover": {
                        //"backgroundColor": "#DDD",
                        "backgroundColor": "muiTheme.gray.main",   // Marche pas
                        //"color": "#242105"
                    },
                    "&.Mui-selected": {
                        // "backgroundColor": "blue",    // Marche pas, utilise tout le temps la couleur primaire très claire
                        // "backgroundColor": "secondary.main",    // Marche pas, utilise tout le temps la couleur primaire très claire
                        // "color": "#CCC",                         // Marche pas non plus
                        // "border": "2px solid #CCC",
                        // "&:hover": {"backgroundColor": "secondary.dark", },
                        //"&.Mui-focusVisible": { background: "orange" }     // Marche pas non plus !
                    },
                },
            }
        },
    },
    // components: {
    //   MuiCssBaseline: {
    //     styleOverrides: `
    //       @font-face {
    //         font-family: 'Raleway';
    //         font-style: normal;
    //         font-display: swap;
    //         font-weight: 400;
    //         src: local('Raleway'), local('Raleway-Regular'), url(${RalewayWoff2}) format('woff2');
    //         unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
    //       }
    //     `,
    //   },
    // },
});

// J'arrive pas à l'ajouter à muiTheme à cause de la donnée muiTheme, quoi mettre à la place ???
muiTheme.typography.h3 = {
    // fontSize: '1.2rem',
    // '@media (min-width:600px)': {
    //   fontSize: '1.5rem',
    // },
    [muiTheme.breakpoints.up('xs')]: {    // xs = 0px
        fontSize: '1.8rem',
        display: 'none'
    },
    [muiTheme.breakpoints.up('sm')]: {   // sm = 600px
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
