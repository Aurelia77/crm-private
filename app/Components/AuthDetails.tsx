import React from 'react'
import { auth } from './../utils/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Sign } from 'crypto'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

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
            //console.log("Déconnexion réussie")
            // on redirige vers la page d'accueil
            window.location.href = "/"
        }).catch((error) => {
            console.log("Déconnexion échouée", error)
        });
    }

    return (
        <Box>
            {authUserInfo
                && <Box sx={{ display: "flex", justifyContent: 'space-between', height: "30px" }} >
                    <Typography
                        variant="h6"
                        color="primary"
                        sx={{ ml: 2 }}
                    >{authUserInfo.email}</Typography>

                    <Tooltip title="Déconnexion" placement="left">
                        <IconButton onClick={userSignOut} color="error" >
                            <ExitToAppIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            }
        </Box>
    )
}
