'use client'

import React from "react";
import { Timestamp } from 'firebase/firestore';



const ContactsContext = React.createContext<{ 
        //allContacts: Contact[],
        //displayContactCardToUpdate: (contact: Contact) => void,
        updateContactInContactsAndDB: (id: string, keyAndValue: { key: string; value: string | number | boolean | Timestamp | File[] | null; }) => void,
        deleteDataOnFirebaseAndReload: (id: string) => void,
        updateWholeContactInContactsAndDB: (contact: Contact) => void,
        areContactChangesSaved: boolean,
        setAreContactChangesSaved: React.Dispatch<React.SetStateAction<boolean>>,
    }>
    ({      
        //allContacts: [],
        //displayContactCardToUpdate: (contact: Contact) => {},
        updateContactInContactsAndDB: (id: string, keyAndValue: { key: string; value: string | number | boolean | Timestamp | File[] | null; }) => {},
        deleteDataOnFirebaseAndReload: (id: string) => {},
        updateWholeContactInContactsAndDB: (contact: Contact) => {},
        areContactChangesSaved: true,
        setAreContactChangesSaved: () => {},
});

export default ContactsContext


// export default function ContactsContextProvider({ children }: { children: React.ReactNode }) { 

//     return (
//         <ContactsContext.Provider 
//         value={{coucou: "heyyyy!!"}} 
//         >{children}</ContactsContext.Provider>
//     )
// }

export const useContactsContext = () => React.useContext(ContactsContext);


