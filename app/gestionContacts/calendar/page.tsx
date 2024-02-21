'use client'
import React from 'react'

import { getUserContactsFromDatabase } from '@/app/utils/firebase'

import CalendarScheduler from '@/app/Components/contactsManager/CalendarScheduler'

import { useContactsContext } from '@/app/context/UseContactsContextProvider';
import { useAuthUserContext } from '@/app/context/UseAuthContextProvider'

import { redirect, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

export default function CalendarPage() {
    const [allContacts, setAllContacts] = React.useState<Contact[]>([])

    const { currentUser } = useAuthUserContext()
    const updateContactInContactsAndDB = useContactsContext().updateContactInContactsAndDB

    const { data, isLoading, isError } = useQuery({
        queryKey: ['contacts'],
        queryFn: () => getUserContactsFromDatabase(currentUser?.uid),
    });

    const router = useRouter();

    const redirectToContact = (contactId: string) => {
        router.push(`/gestionContacts/contact/${contactId}`)
    }

    React.useEffect(() => {
        if (data) {
            setAllContacts(data);
        }
    }, [data]);    

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
