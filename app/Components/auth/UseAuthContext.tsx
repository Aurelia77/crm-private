import React from "react";

import { AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, fireStoreDb } from "../../utils/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const UserContext = React.createContext({});

//export const userAuth = () => React.useContext(UserContext);

export default function UseAuthContext({ children }: { children: React.ReactNode }) {
    const [error, setError] = React.useState<string>("");
    const [currentUser, setCurrentUser] = React.useState<any>();

    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log(user)
            if (user) {
                setCurrentUser(user);
                console.log('Logging !!!')
            } else {


                setCurrentUser(null);
                console.log('Not logging !!!')
            }
        })
    }, [currentUser])

    const signUp = async (email: string, password: string, fullName: string) => {
        setError("");

        createUserWithEmailAndPassword(auth, email, password)
            .then(
                async (result) => {
                    console.log(result)
                    try {
                        const docRef = await addDoc(collection(fireStoreDb, "users"), {
                            fullName,
                            userId: result.user.uid,
                            // uid: result.user.uid,
                            // email: result.user.email,
                            // fullName: fullName,
                            // createdAt: new Date(),
                        });
                        alert('User created !')
                        console.log("Document written with ID: ", docRef.id);
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                }
            ).catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    setInterval(() => {
                        setError('')
                    }, 5000)
                    setError('That email address is already in use!');
                    // COPILOT
                    // } else if (error.code === 'auth/invalid-email') {
                    //     setInterval(() => {
                    //         setError('')
                    //     }, 5000 )                   
                    //     setError('That email address is invalid!');
                } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
                    // } else if (error.code === 'auth/weak-password') {
                    setInterval(() => {
                        setError('')
                    }, 5000)
                    setError('Password should be at least 6 characters');
                } else {
                    setError(error.message);
                }
            })
    }

    const value = {
        currentUser,
        signUp,
        error,
    }

    return (
        <UserContext.Provider value= { value } >{children}</UserContext.Provider>
  )
}
