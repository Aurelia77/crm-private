import React from "react";

import { AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { auth, fireStoreDb } from "../utils/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import firebase from "firebase/app";


// const emptyUserInfos: UserInfos = {
//     name: '',
//     email: '',
//     password: '',
// }

const UserContext = React.createContext<{ 
    currentUser: User | null;
    signUp: (email: string, password: string, fullName: string) => void;
    error: string;}>({           // obligé de remplir car sinon erreur !!!!!!!!!!!!!
    currentUser: null,
    signUp: (email: string, password: string, fullName: string) => { }, 
    error: ""
});
export const useAuthUserContext = () => React.useContext(UserContext);

export default function UserAuthContextProvider({ children }: { children: React.ReactNode }) { 
    const [error, setError] = React.useState<string>("");
    const [currentUser, setCurrentUser] = React.useState<User | null>(null);
    // const [currentUser, setCurrentUser] = React.useState<UserInfos>(emptyUserInfos);

    //////////////////////// UTIL ?????????? Si modif de compte ??? Deconnexion ?????????????
    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log(user)
            if (user) {
                setCurrentUser(user);
               // console.log('Logging !!!')
            } else {
                setCurrentUser(null);
                // console.log('Not logging !!!')
            }
        })
    }, [currentUser])




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

    const signUp = async (email: string, password: string, fullName: string) => {       // mettre 1 seul arg pour le user (objet avec les 3 champs)
        setError("");

        createUserWithEmailAndPassword(auth, email, password)
        .then(async (result) => {
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
                // Si on vt le même id pour le document que pour le user !!!!!!!!!!!!! (pas besoin je pense !!!) (18''00 vidéo)
                // const ref = doc(fireStoreDb, "users", result.user.uid);
                // const docRef = await setDoc(ref, {fullName});

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


// // A utiliser dans chaque enfant qui a besoin du CONTEXTE
// export const useMovieCacheContext = () => {
//     const context = React.useContext(MovieCacheContext)
  
//     //console.log("contexte : ",context)
  
//     if (!context) {     // Au cas où on n'utilise pas cette fonction dans un composant qui est enveloppé par le PROVIDER
//       throw new Error('useMovieCacheContext doit être utilisé avec MovieCacheContextProvider') // UTILE ?? comment faire cette erreur ???
//     }
//     return context
//   }
