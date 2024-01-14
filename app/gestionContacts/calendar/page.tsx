'use client'

import React from 'react'
import CalendarScheduler from '../../Components/contactsManager/CalendarScheduler'
import { useContactsContext } from '@/app/context/UseContactsContextProvider';


export default function CalendarPage() {
    const contactsContextValue = useContactsContext()

    console.log("contactsContextValue : ", contactsContextValue)

    return (
        <CalendarScheduler
            contacts={contactsContextValue.allContacts}
            displayContactCardToUpdate={contactsContextValue.displayContactCardToUpdate}
            updateContactInContactsAndDB={contactsContextValue.updateContactInContactsAndDB}
        />
    )
}
