import React from 'react'
import { auth } from './../utils/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Sign } from 'crypto'
import { Box, Button, Typography } from '@mui/material'

export default function AuthDetails() {
    const [authUserInfo, setAuthUserInfo] = React.useState<any>(null)

    React.useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            user ? setAuthUserInfo(user) : setAuthUserInfo(null)
        })
        return () => listen()
    }, [])

    const userSignOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Déconnexion réussie")
        }).catch((error) => {
            // An error happened.
            console.log("Déconnexion échouée")
        });
    }

    return (
        <Box>
            {authUserInfo
            ? <React.Fragment>
                    <Typography variant="h6" color="primary">{authUserInfo.email}</Typography>
                    {/* <Button variant="contained" color="primary" onClick={() => auth.signOut()}>Déconnexion</Button> Marche aussi !!!*/}
                    <Button variant="contained" color="warning" onClick={userSignOut}>Déconnexion</Button>  
                </React.Fragment>          
            : <Typography variant="h6" color="warning">Déconnecté</Typography>}
        </Box>
    )
}
