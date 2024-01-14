

'use client'

import React from 'react'

import {
    // useQuery,
    // useMutation,
    // useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

// import { getTodos, postTodo } from '../my-api'

import {ReactQueryDevtools} from '@tanstack/react-query-devtools'


export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {

    // Vidéo : https://www.youtube.com/watch?v=G0BmM-L5FoE&t=86s&ab_channel=EricWinkDev (a fait un peu différent que la doc react query (tanstack) car il a trouvé des disfonctionnements...) (voir 5min30)
    //const queryClient = new QueryClient()
    
    const [queryClient] = React.useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* initialIsOpen={false} pour que la fenêtre s'ouvre quand on clic que l'icone en bas */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}




// // DOC TANSTACK (React Query) : Quick start

// // Create a client
// const queryClient = new QueryClient()

// function App() {
//     return (
//         // Provide the client to your App
//         <QueryClientProvider client={queryClient}>
//             <Todos />
//         </QueryClientProvider>
//     )
// }

// function Todos() {
//     // Access the client
//     const queryClient = useQueryClient()

//     // Queries
//     const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

//     // Mutations
//     const mutation = useMutation({
//         mutationFn: postTodo,
//         onSuccess: () => {
//             // Invalidate and refetch
//             queryClient.invalidateQueries({ queryKey: ['todos'] })
//         },
//     })

//     return (
//         <div>
//             <ul>{query.data?.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ul>

//             <button
//                 onClick={() => {
//                     mutation.mutate({
//                         id: Date.now(),
//                         title: 'Do Laundry',
//                     })
//                 }}
//             >
//                 Add Todo
//             </button>
//         </div>
//     )
// }

// render(<App />, document.getElementById('root'))

