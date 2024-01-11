'use client'

import React from "react";
import { Timestamp } from 'firebase/firestore';



const ContactsContext = React.createContext<{ 
        allContacts: Contact[],
        displayContactCardToUpdate: (contact: Contact) => void,
        updateContactInContactsAndDB: (id: string, keyAndValue: { key: string; value: Timestamp; }) => void
    }>
    ({      
        allContacts: [],
        displayContactCardToUpdate: (contact: Contact) => {},
        updateContactInContactsAndDB: (id: string, keyAndValue: { key: string; value: Timestamp; }) => {}
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


