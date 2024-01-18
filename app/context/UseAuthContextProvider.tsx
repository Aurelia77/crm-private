import * as React from 'react';
import { AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { auth, fireStoreDb } from "../utils/firebase";
import { addDoc, collection } from "firebase/firestore";

const UserContext = React.createContext<{
    currentUser: User | null;
    signUp: (email: string, password: string, fullName: string) => void;
    error: string;
    isLoading: boolean;
}
>({
    currentUser: null,
    signUp: (email: string, password: string, fullName: string) => { },
    error: "",
    isLoading: true,
});

const errorMessages: { [key: string]: string } = {
    [AuthErrorCodes.EMAIL_EXISTS]: 'Cet email est déjà utilisé par un autre compte.',
    [AuthErrorCodes.WEAK_PASSWORD]: 'Le mot de passe doit faire au minimum 6 caractères.',
};


export default function UserAuthContextProvider({ children }: { children: React.ReactNode }) {
    const [errorTimeoutId, setErrorTimeoutId] = React.useState<NodeJS.Timeout | null>(null);
    const [error, setError] = React.useState<string>("")
    const [currentUser, setCurrentUser] = React.useState<User | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
            setIsLoading(false)
        })
    }, [currentUser])


    // Au démontage du composant, on supprime le timeout
    React.useEffect(() => {
        return () => {
            if (errorTimeoutId) {
                clearTimeout(errorTimeoutId);
            }
        };
    }, [errorTimeoutId]);


    const signUp = async (email: string, password: string, fullName: string) => {
        setError("");

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (result) => {
                try {
                    const docRef = await addDoc(collection(fireStoreDb, "users"), {
                        fullName,
                        userId: result.user.uid,
                    });

                    //alert('Nouvel utilisateur créé !')
                    console.log("Document écrit avec ID: ", docRef.id);
                } catch (e) {
                    console.error("Erreur dans ajout document : ", e);
                }
            }).catch((error) => {
                setError(errorMessages[error.code] || error.message);
            })
    }

    const value = {
        currentUser,
        signUp,
        error,
        isLoading,
    }

    return (
        <UserContext.Provider value={value} >{children}</UserContext.Provider>
    )
}

export const useAuthUserContext = () => React.useContext(UserContext);


