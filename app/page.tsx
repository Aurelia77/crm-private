'use client'

import React from 'react'

import Box from '@mui/material/Box';
import SignIn from './Components/authentification/SignIn';
import SignUp from './Components/authentification/SignUp';
import { useAuthUserContext } from './context/UseAuthContextProvider'
import { useRouter, redirect } from 'next/navigation';        // et non 'next/router' depuis Next 12
import { CircularProgress, Container } from '@mui/material';


export default function Contacts() {
    const { currentUser, isLoading } = useAuthUserContext()


    const router = useRouter();



    // Si on met pas le REDIRECT tout en bas
    // React.useEffect(() => {
    //     if (currentUser) {
    //         redirect('/gestionContacts/contactsTable');
    //     }
    // }, [currentUser]);

    // if (currentUser) {
    //     return null;
    // }

    

    return (
        <Box sx={{
            position: "relative",
        }}>
            {isLoading
                ? <Container sx={{ ml: "50%", mt: "20%" }} >
                    <CircularProgress />
                </Container>

                : !currentUser
                    // {/* ///////// CONNEXION / INSCRIPTION ///////// */}
                    ?
                    <Box sx={{
                        display: "flex", justifyContent: "space-around",
                        margin: "20px",
                        padding: "20px",
                    }}>
                        <SignIn />
                        <SignUp />
                    </Box>

                    // {/* // /////////////////////// ONGLETS (Tabs) ///////////////////////*/}
                    : redirect('/gestionContacts/contactsTable')
            }
        </Box>
    )
}
