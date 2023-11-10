import { Button, FormControl, TextField, Typography } from '@mui/material'
import { auth } from '../../utils/firebase'

import React from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { set } from 'firebase/database'
import Link from 'next/link'

const SignUp = () => {
    const [user, setUser] = React.useState<any>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    }) 
    const [error, setError] = React.useState<any>("")       // Front error (password moins de 6 caractères par exemple)
    const [backError, setBackError] = React.useState<any>("")   // Backup error

    React.useEffect(() => {
        console.log("I am in")
        if (error) {
            setInterval(() => {
                setBackError("")
            }, 5000)
            setBackError(error)
        }
    },[error, 
        //currentUser
    ])

    const userHandler = (e: any) => {
        const [name, value] = e.target      //[e.target.name, e.target.value]

        console.log("name", name)
        console.log("value", value)

        // setUser({...user, [name]: value})
        setUser((pre: any) => {
            return {
                ...pre,
                [name]: value
            }
        })
    }

    const submitHandler = (e: any) => {
        e.preventDefault()
        const { fullName, email, password, confirmPassword } = user

        if (password === "" || confirmPassword === "" || email === "" || fullName === "") {
            setInterval(() => {
                setError("")
            }, 5000)
            return setError("Veuillez remplir tous les champs")     // Copilote met le RETURN ligne suivante !          
        } else if (password !== confirmPassword) {
            setInterval(() => {
                setError("")
            }, 5000)
            return setError("Les mots de passe ne correspondent pas")            
        } else if (password.length < 6 || confirmPassword.length < 6) {       // Le fait pas automatiquement ???????
            setInterval(() => {
                setError("")
            }, 5000)
            return setError("Le mot de passe doit contenir au moins 6 caractères")            
        } else {
            //signUp(email, password, fullName)
        }
    }





    const signUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Sign Up")
        e.preventDefault()  // Pour éviter le rechargement de la page et donc garder les données dans les champs
        createUserWithEmailAndPassword(auth, user.email, user.password)
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
                <h1>Création de compte</h1>
                <TextField type="email" label="Email" value={user.email} onChange={userHandler} />
                <TextField id="standard-basic" label="Password" value={user.password} onChange={userHandler} />
                <Button variant="contained" color="primary" onClick={signUp}>Valider</Button>
                <Typography variant="body2" color="error">
                    Pas encore de compte ? 
                    <Link href="/auth/signIn">Se connecter</Link>
                </Typography>
            </FormControl>
            <FormControl>
                <h1>Création de compte</h1>
                <TextField type="email" label="Email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} />
                <TextField id="standard-basic" label="Password" value={user.password} onChange={(e) => setUser({...user, password: e.target.value})} />
                <Button variant="contained" color="primary" onClick={signUp}>Valider</Button>
            </FormControl>
        </div>
    )
}

export default SignUp

