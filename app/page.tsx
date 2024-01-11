'use client'

import * as React from 'react';

import Box from '@mui/material/Box';
import TabsContainer from './Components/TabsContainer';
import SignIn from './Components/authentification/SignIn';
import SignUp from './Components/authentification/SignUp';
import { useAuthUserContext } from './context/UseAuthContextProvider'
import { useRouter } from 'next/navigation';        // et non 'next/router' !?
import { redirect } from 'next/navigation';


export default function Contacts() {
    const { currentUser } = useAuthUserContext()

    const router = useRouter();

    // React.useEffect(() => {
    //     if (currentUser) {
    //         redirect('/gestionContacts');
    //         // Idem :
    //         //router.push('/gestionContacts'); 
    //     }
    // }, [currentUser, router]);

    return (
        <Box sx={{
            position: "relative",
        }}>
            {!currentUser
               // {/* ///////// CONNEXION / INSCRIPTION ///////// */}
                ? <Box sx={{
                    display: "flex", justifyContent: "space-around",
                    margin: "20px",
                    padding: "20px",
                }}>
                    <SignIn />
                    <SignUp />
                </Box>

               // {/* // /////////////////////// ONGLETS (Tabs) ///////////////////////*/}
                : redirect('/gestionContacts')
                // <TabsContainer
                //     currentUser={currentUser}
                // />
            } 
        </Box>
    )
}
