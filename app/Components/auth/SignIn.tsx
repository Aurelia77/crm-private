import { Button, FormControl, TextField } from '@mui/material'
import { auth } from './../../utils/firebase'

import React from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'

const SignIn = () => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const signIn = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Sign In")
        e.preventDefault()  // Pour éviter le rechargement de la page et donc garder les données dans les champs
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                console.log(error)
                // const errorCode = error.code;
                // const errorMessage = error.message;
            });
    }
 
    return (
        <div>
            <FormControl>
                <h1>Se connecter</h1>
                <TextField type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField id="standard-basic" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" color="primary" onClick={signIn}>Connexion</Button>
            </FormControl>
        </div>
    )
}

export default SignIn



