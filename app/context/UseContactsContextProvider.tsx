'use client'
import React from "react";
import { Timestamp } from 'firebase/firestore';

const ContactsContext = React.createContext<{
    updateContactInContactsAndDB: (id: string, keyAndValue: { key: string; value: string | number | boolean | Timestamp | File[] | null; }) => void,
    deleteDataOnFirebaseAndReload: (id: string) => void,
    updateWholeContactInContactsAndDB: (contact: Contact) => void,
    areContactChangesSaved: boolean,
    setAreContactChangesSaved: React.Dispatch<React.SetStateAction<boolean>>,
}>
    ({
        updateContactInContactsAndDB: (id: string, keyAndValue: { key: string; value: string | number | boolean | Timestamp | File[] | null; }) => { },
        deleteDataOnFirebaseAndReload: (id: string) => { },
        updateWholeContactInContactsAndDB: (contact: Contact) => { },
        areContactChangesSaved: true,
        setAreContactChangesSaved: () => { },
    });

export default ContactsContext

export const useContactsContext = () => React.useContext(ContactsContext);


