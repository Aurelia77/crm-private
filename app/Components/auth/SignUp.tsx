import { Button, FormControl, Paper, TextField, Typography } from '@mui/material'
import { auth } from '../../utils/firebase'

import React from 'react'
import { useAuthUserContext } from '../../context/UseAuthContext'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { set } from 'firebase/database'
import Link from 'next/link'
import Box from '@mui/material'

const SignUp = () => {  
   
    const {error, signUp, currentUser} = useAuthUserContext()

    console.log("error", error)
    console.log("currentUser", currentUser)
    //console.log("currentUser email", currentUser?.email) 

    const [authUserInfoSignUp, setAuthUserInfoSignUp] = React.useState<any>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    }) 
    
    // En faire en 1 seul !!!!!!!!!!!!!!!!
    const [frontError, setFrontError] = React.useState<any>("")  // Front error (password moins de 6 caractères par exemple)
    const [backError, setBackError] = React.useState<any>("")   // Backup error

    React.useEffect(() => {
        console.log("I am in")
        if (error) {
            setInterval(() => {
                setBackError("")
            }, 5000)
            setBackError(error)
        }
    },[error, currentUser])     // voir si faut mettre currentUser.xxx ????????

    const authUserInfoSignUpHandler = (e: any) => {
        console.log(e)
        console.log(e.target)
        console.log(e.target.value)
        console.log(e.target.name)
        const [name, value] = [e.target.name, e.target.value]   // => car on a mis name="email" et name="password" dans les TextField

        // console.log("name", name)
        // console.log("value", value)

        // setAuthUserInfoSignUp({...authUserInfoSignUp, [name]: value})
        setAuthUserInfoSignUp((pre: any) => {
            return {
                ...pre,
                [name]: value
            }
        })
    }

    const submitHandler = (e: any) => {
        e.preventDefault()
        const { name, email, password, confirmPassword } = authUserInfoSignUp

        console.log(authUserInfoSignUp)

        if (password === "" || confirmPassword === "" || email === "" || name === "") {
            // setInterval(() => {
            //     setFrontError("")
            // }, 5000)
            return setFrontError("Veuillez remplir tous les champs")     // Copilote met le RETURN ligne suivante !          
        } else if (password !== confirmPassword) {
            // setInterval(() => {
            //     setFrontError("")
            // }, 5000)
            return setFrontError("Les mots de passe ne correspondent pas")            
        } else if (password.length < 6 || confirmPassword.length < 6) {       // Le fait pas automatiquement ???????
            // setInterval(() => {
            //     setFrontError("")
            // }, 5000)
            return setFrontError("Le mot de passe doit contenir au moins 6 caractères")            
        } else {            
            signUp(email, password, name)
            // { currentUser && setAuthUserInfoSignUp({ fullName: '', email: '', password: '', confirmPassword: '' }) }     // on remet les champs à vide, ne sert à rien car on va sortir d'ici qd connecté !!!
        }
    }




    // const signUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     console.log("Sign Up")
    //     e.preventDefault()  // Pour éviter le rechargement de la page et donc garder les données dans les champs
    //     createauthUserInfoSignUpWithEmailAndPassword(auth, authUserInfoSignUp.email, authUserInfoSignUp.password)
    //         .then((authUserInfoSignUpCredential) => {
    //             console.log(authUserInfoSignUpCredential)
    //             // Signed in 
    //             const authUserInfoSignUp = authUserInfoSignUpCredential.authUserInfoSignUp;
    //             // ...
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //             // const errorCode = error.code;
    //             // const errorMessage = error.message;
    //         });
    // }
 
    return (
        <Paper sx={{ padding: "40px" }} elevation={5} >
            {frontError
            ? (frontError && <Typography color="error">{frontError}</Typography>)
            : (backError && <Typography variant="body2" color="error">{backError}</Typography>
            )}
            <FormControl>
                <Typography variant='h3' component='h2' color='secondary' sx={{ textShadow: "1px 1px 2px blue", marginBottom:"25px" }} >Création de compte</Typography>

                <TextField 
                    type="email" 
                    label="Email" 
                    name="email" 
                    value={authUserInfoSignUp.email} onChange={authUserInfoSignUpHandler} />

                <TextField
                    type="password" 
                    label="Password" 
                    name="password" 
                    value={authUserInfoSignUp.password} 
                    onChange={authUserInfoSignUpHandler} 
                />

                <TextField 
                    type="password" 
                    label="Confirm Password" 
                    name="confirmPassword" 
                    value={authUserInfoSignUp.confirmPassword} 
                    onChange={authUserInfoSignUpHandler}
                />

                <TextField 
                    label="Name" 
                    name="name" 
                    value={authUserInfoSignUp.name} 
                    onChange={authUserInfoSignUpHandler} 
                />

                <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ marginTop:"25px" }} 
                    onClick={submitHandler}
                >Valider</Button>    
                          
            </FormControl>



            {/* <FormControl>
                <h1>Création de compte</h1>
                <TextField type="email" label="Email" value={authUserInfoSignUp.email} onChange={(e) => setAuthUserInfoSignUp({...authUserInfoSignUp, email: e.target.value})} />
                <TextField id="standard-basic" label="Password" value={authUserInfoSignUp.password} onChange={(e) => setAuthUserInfoSignUp({...authUserInfoSignUp, password: e.target.value})} />
                <Button variant="contained" color="primary" onClick={signUp}>Valider</Button>
            </FormControl> */}
        </Paper>
    )
}

export default SignUp

