'use client'

// CSS
import './globals.css'

import { ThemeProvider, createTheme, PaletteOptions } from "@mui/material/styles";
import { cyan, pink } from "@mui/material/colors";

// Pour ajouter une nouvelle couleur à la palette
// Augment the palette to include an ochre color
declare module '@mui/material/styles' {
  interface Palette {
    ochre: Palette['primary'];
  }
  interface PaletteOptions {
    ochre?: PaletteOptions['primary'];
  }
}
// Update the Button's color options to include an ochre option
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    ochre: true;
  }
}

const muiTheme = createTheme({    // Tout ce qu'on ne redéfinit pas reste par défaut
  palette: {
    // primary: {
    //   main: cyan[700], // A partir de 700 la couleur du text devient blanche
    // },
    // secondary: {
    //   main: pink[700] 
    // },
    ochre: {
      main: '#E3D026',
      light: '#E9DB5D',
      dark: '#A29415',
      contrastText: '#242105',
    },
  },  
  typography: {
    fontFamily: 'comic sans ms, Roboto, Arial',
    //fontSize: 20,
    //fontFamily: 'Roboto, Arial',
    // fontFamily: 'Raleway, Arial',
    
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


muiTheme.typography.h3 = {
  // fontSize: '1.2rem',
  // '@media (min-width:600px)': {
  //   fontSize: '1.5rem',
  // },
  // J'arrive pas à l'ajouter à muiTheme à cause de la donnée muiTheme, quoi mettre à la place ???
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


const primary = {
  main: '#1976d2',
  light: '#42a5f5',
  dark: '#1565c0',
  contrastText: '#fff',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body 
      //</html>className={inter.className}
      >
        <ThemeProvider theme={muiTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
