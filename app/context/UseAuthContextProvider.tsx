import React from "react";

import { AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { auth, fireStoreDb } from "../utils/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const UserContext = React.createContext<{ 
        currentUser: User | null;
        signUp: (email: string, password: string, fullName: string) => void;
        error: string;}
    >({      
        currentUser: null,
        signUp: (email: string, password: string, fullName: string) => { }, 
        error: ""
});

export default function UserAuthContextProvider({ children }: { children: React.ReactNode }) { 
    const [error, setError] = React.useState<string>("");
    const [currentUser, setCurrentUser] = React.useState<User | null>(null);

    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            //console.log(user)
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        })
    }, [currentUser])


    const signUp = async (email: string, password: string, fullName: string) => {       // mettre 1 seul arg pour le user (objet avec les 3 champs)
        setError("");

        createUserWithEmailAndPassword(auth, email, password)
        .then(async (result) => {
            console.log(result)
            try {
                const docRef = await addDoc(collection(fireStoreDb, "users"), {
                    fullName,
                    userId: result.user.uid,
                });

                alert('Nouvel utilisateur créé !')
                console.log("Document écrit avec ID: ", docRef.id);
            } catch (e) {
                console.error("Erreur dans ajout document : ", e);
            }
        }).catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                setInterval(() => {
                    setError('')
                }, 5000)
                setError('Cette adresse mail existe déjà !');
            } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
                setInterval(() => {
                    setError('')
                }, 5000)
                setError('Le mot de passe doit faire au minimum 6 caractères !');
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
        <UserContext.Provider value={value} >{children}</UserContext.Provider>
    )
}

export const useAuthUserContext = () => React.useContext(UserContext);


