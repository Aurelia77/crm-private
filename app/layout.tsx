'use client'    // Pour pouvoir utiliser le contexte
// import { Analytics } from "@vercel/analytics/react"
import './globals.css'
import UserAuthContextProvider from './context/UseAuthContextProvider';
import MuiProviders from './Components/providers/MuiProviders';
import ReactQueryProvider from './Components/providers/ReactQueryProvider';
import { ErrorBoundary } from 'react-error-boundary'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import "dayjs/locale/fr";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body >
        <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
          <div style={{ margin:7 }} >
            <h1>Une erreur s'est produite</h1>
            <pre style={{ whiteSpace: "pre-wrap" }} >{error.message}</pre>
            <button onClick={resetErrorBoundary}>Réessayer</button>
          </div>
        )}>
          <MuiProviders>
            <UserAuthContextProvider>
              <ReactQueryProvider>
                {/* Declare the LocalizationProvider once, wrapping your entire application */}
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr' >
                  {children}
                </LocalizationProvider>
              </ReactQueryProvider>
            </UserAuthContextProvider>
          </MuiProviders>
        </ErrorBoundary>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}