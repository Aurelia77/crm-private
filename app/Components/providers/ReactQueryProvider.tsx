'use client'
import React from 'react'

import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {    
    const [queryClient] = React.useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools 
                initialIsOpen={false}   // pour que la fenêtre s'ouvre seulement quand on clic sur l'icone en bas
            />
        </QueryClientProvider>
    )
}