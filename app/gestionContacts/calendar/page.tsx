'use client'

import React from 'react'
import CalendarScheduler from '../../Components/contactsManager/CalendarScheduler'
import { useContactsContext } from '@/app/context/UseContactsContextProvider';
import { useQuery } from '@tanstack/react-query';
import { getUserContactsFromDatabase } from '../../utils/firebase'
import { useAuthUserContext } from '../../context/UseAuthContextProvider'
import { redirect, useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';



export default function CalendarPage() {
    const { currentUser } = useAuthUserContext()
    const [allContacts, setAllContacts] = React.useState<Contact[]>([])

    //console.log("allContacts : ", allContacts)


    const updateContactInContactsAndDB = useContactsContext().updateContactInContactsAndDB

    const { data, isLoading, isError } = useQuery({
        queryKey: ['contacts'],
        queryFn: () => getUserContactsFromDatabase(currentUser?.uid),
    });

    React.useEffect(() => {
        if (data) {
            setAllContacts(data);
        }
    }, [data]);

    const router = useRouter();

    const redirectToContact = (contactId: string) => {
        router.push(`/gestionContacts/contact/${contactId}`)
        //redirect(`/gestionContacts/contact/${contactId}`) // marche pas
    }

    return (
        currentUser
            ? <CalendarScheduler
                contacts={allContacts}
                setContacts={setAllContacts}
                updateContactInContactsAndDB={updateContactInContactsAndDB}
                redirectToContact={redirectToContact}
            />
            : redirect('/')
    )
}
