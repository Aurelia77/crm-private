import React from 'react'
import { auth } from './../utils/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Sign } from 'crypto'
import { Button } from '@mui/material'

export default function AuthDetails() {
    const [authUser, setAuthUser] = React.useState<any>(null)

    React.useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            user ? setAuthUser(user) : setAuthUser(null)
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
        <div>{authUser
            ? <p>
                Connecté : {authUser.email}
                {/* <Button variant="contained" color="primary" onClick={() => auth.signOut()}>Déconnexion</Button> Marche aussi !!!*/}
                <Button variant="contained" color="primary" onClick={userSignOut}>Déconnexion</Button>
            </p>

            : <p>Déconnecté</p>}</div>
    )
}
