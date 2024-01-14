'use client'

import React from 'react'
import CalendarScheduler from '../../Components/contactsManager/CalendarScheduler'
import { useContactsContext } from '@/app/context/UseContactsContextProvider';
import { useQuery } from '@tanstack/react-query';
import { getUserContactsFromDatabase } from '../../utils/firebase'
import { useAuthUserContext } from '../../context/UseAuthContextProvider'



export default function CalendarPage() {
    const { currentUser } = useAuthUserContext()

    const contactsContextValue = useContactsContext()

    console.log("contactsContextValue : ", contactsContextValue)

    const [allContacts, setAllContacts] = React.useState<Contact[]>([])

    console.log("allContacts : ", allContacts)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['contacts'],
        queryFn: () => getUserContactsFromDatabase(currentUser?.uid),
    });

    React.useEffect(() => {
        if (data) {
            setAllContacts(data);
        }
    }, [data]);

    return (
        <CalendarScheduler
            contacts={allContacts}
            //displayContactCardToUpdate={contactsContextValue.displayContactCardToUpdate}
            updateContactInContactsAndDB={contactsContextValue.updateContactInContactsAndDB}
        />
    )
}
