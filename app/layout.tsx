'use client'

// CSS
import './globals.css'

import UserAuthContextProvider from './context/UseAuthContext';
import MuiProviders from './Components/MuiProviders';
import { ErrorBoundary } from 'react-error-boundary'// + pnpm install --save react-error-boundary

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';



//import { makeStyles } from '@mui/styles';     // npm install @mui/styles




// Pour ça : import { makeStyles }
// const useStyles = makeStyles((muiTheme: any) => ({
//   // your other styles
//   tableRowRoot: {
//     "&$tableRowSelected, &$tableRowSelected:hover": {
//       backgroundColor: muiTheme.palette.primary.main
//     }
//   },
//   tableRowSelected: {
//     backgroundColor: muiTheme.palette.primary.main
//   }
// }));
// => Et mettre ça sur le component voulu :   // classes={{ root: classes.tableRowRoot,  selected: classes. tableRowSelected,   }}




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
        {/* ErrorBoundary => sinon erreur dans les tests */}
        <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
          <div>
            <h1>Une erreur s'est produite</h1>
            <button onClick={resetErrorBoundary}>Réessayer</button>
          </div>
        )}>
          <MuiProviders>
            <UserAuthContextProvider>
               {/* The general recommendation is to declare the LocalizationProvider once, wrapping your entire application. Then, you don't need to repeat the boilerplate code for every Date and Time Picker in your application. */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {children}
              </LocalizationProvider>
            </UserAuthContextProvider>
          </MuiProviders>
        </ErrorBoundary>
      </body>
    </html>
  )
}
