import React from 'react'
import { useAuthUserContext } from '@/app/context/UseAuthContextProvider'
import { Button, FormControl, Paper, TextField, Typography } from '@mui/material'

const SignUp = () => {
    const { error, signUp, currentUser } = useAuthUserContext()
    const [frontError, setFrontError] = React.useState<any>("")
    const [backError, setBackError] = React.useState<any>("")
    const [authUserInfoSignUp, setAuthUserInfoSignUp] = React.useState<any>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    React.useEffect(() => {
        error && setBackError(error)
    }, [error, currentUser])

    const authUserInfoSignUpHandler = (e: any) => {
        const [name, value] = [e.target.name, e.target.value]

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

        if (password === "" || confirmPassword === "" || email === "" || name === "") {
            return setFrontError("Veuillez remplir tous les champs")
        } else if (password !== confirmPassword) {
            return setFrontError("Les mots de passe ne correspondent pas")
        } else if (password.length < 6 || confirmPassword.length < 6) {
            return setFrontError("Le mot de passe doit contenir au moins 6 caractères")
        } else {
            signUp(email, password, name)
            setFrontError("")
        }
    }

    return (
        <Paper sx={{ padding: "40px" }} elevation={5} >
            {frontError
                ? (frontError && <Typography color="error">{frontError}</Typography>)
                : (backError && <Typography color="error">{backError}</Typography>
                )}
            <FormControl>
                <Typography
                    variant='h3' 
                    component='h2' 
                    color='secondary' 
                    sx={{ textShadow: "1px 1px 2px blue", marginBottom: "25px" }} 
                >
                    Création de compte
                </Typography>
                <TextField
                    type="email"
                    label="Email"
                    name="email"
                    value={authUserInfoSignUp.email} onChange={authUserInfoSignUpHandler}
                />
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
                    sx={{ marginTop: "25px" }}
                    onClick={submitHandler}
                >
                    Valider
                </Button>
            </FormControl>
        </Paper>
    )
}

export default SignUp

