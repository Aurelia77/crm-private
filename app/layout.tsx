'use client'    // Pour pouvoir utiliser le contexte

import './globals.css'

import UserAuthContextProvider from './context/UseAuthContextProvider';
import MuiProviders from './Components/providers/MuiProviders';
import { ErrorBoundary } from 'react-error-boundary'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ReactQueryProvider from './Components/providers/ReactQueryProvider';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body >
        <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
          <div>
            <h1>Une erreur s'est produite</h1>
            <button onClick={resetErrorBoundary}>Réessayer</button>
          </div>
        )}>
          <MuiProviders>
            <UserAuthContextProvider>
              <ReactQueryProvider>
                {/* The general recommendation is to declare the LocalizationProvider once, wrapping your entire application. Then, you don't need to repeat the boilerplate code for every Date and Time Picker in your application. */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  {children}
                </LocalizationProvider>
              </ReactQueryProvider>
            </UserAuthContextProvider>
          </MuiProviders>
        </ErrorBoundary>
      </body>
    </html>
  )
}
