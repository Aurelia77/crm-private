import React from 'react'
import { auth } from './../../utils/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Button, FormControl, TextField, Paper, Typography } from '@mui/material'

const SignIn = () => {
    const [authUserInfoSignIn, setAuthUserInfoSignIn] = React.useState<any>({
        email: '',
        password: '',
    })

    const signIn = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Sign In", e)
        e.preventDefault()
        signInWithEmailAndPassword(auth, authUserInfoSignIn.email, authUserInfoSignIn.password)
            .then((userCredential) => {
                console.log(userCredential)
                console.log(userCredential.user)
            })
            .catch((error) => {
                console.log(error)
                console.log(error.code)
                console.log(error.message)
            });
    }

    return (
        <Paper sx={{ padding: "40px" }} elevation={5} >

            <FormControl>
                <Typography
                    variant='h3'
                    component='h2'
                    color='primary'
                    sx={{ textShadow: "1px 1px 2px blue", marginBottom: "25px" }}
                >
                    Connexion
                </Typography>

                <TextField
                    type="email"
                    label="Email"
                    value={authUserInfoSignIn.email}
                    onChange={(e) => setAuthUserInfoSignIn({ ...authUserInfoSignIn, email: e.target.value })}
                />
                <TextField
                    id="standard-basic"
                    type="password"
                    label="Mot de passe"
                    value={authUserInfoSignIn.password}
                    onChange={(e) => setAuthUserInfoSignIn({ ...authUserInfoSignIn, password: e.target.value })}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "25px" }}
                    onClick={signIn}
                >Connexion</Button>
            </FormControl>
        </Paper>
    )
}

export default SignIn



