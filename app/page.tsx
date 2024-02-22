'use client'
import React from 'react'

import SignIn from './Components/authentification/SignIn';
import SignUp from './Components/authentification/SignUp';

import { useAuthUserContext } from './context/UseAuthContextProvider'

import { CircularProgress, Container } from '@mui/material';
import Box from '@mui/material/Box';

import { useRouter, redirect } from 'next/navigation';   // et non 'next/router' depuis Next 12

export default function Contacts() {
    const { currentUser, isLoading } = useAuthUserContext()    

    return (
        <Box sx={{
            position: "relative",
        }}>
            {isLoading
                ? <Container sx={{ ml: "50%", mt: "20%" }} >
                    <CircularProgress />
                </Container>

                : !currentUser
                    ?
                    <Box sx={{
                        display: "flex", justifyContent: "space-around",
                        margin: "100px auto",
                    }}>
                        <SignIn />
                        <SignUp />
                    </Box>

                    : redirect('/gestionContacts/contactsTable')
            }
        </Box>
    )
}
