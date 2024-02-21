'use client'
import React from 'react'
// UTILS
import { useGetPriorityTextAndColor, emptyContact } from '@/app/utils/toolbox'
import { addContactOnFirebaseAndReload } from '@/app/utils/firebase'
import { TabPanel } from '@/app/utils/StyledComponentsAndUtilities'
// CONTEXTS
import { useAuthUserContext } from '@/app/context/UseAuthContextProvider'
import { useContactsContext } from '@/app/context/UseContactsContextProvider';
// COMPONENT
import NewContactSearchForm from '@/app/Components/contactsManager/NewContactSearchForm'
// MUI
import { Box } from '@mui/material'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// NEXT
import { redirect } from 'next/navigation';
// Deployement VERCEL : erreur "document is not defined" => on import DYNAMIC pour que le composant ContactCard soit rendu que côté client, où l'objet document est disponible. ('use client' ne fonctionne pas)
import dynamic from 'next/dynamic';
const ContactCard = dynamic(() => import('@/app/Components/contactsManager/ContactCard'), { ssr: false });

export default function NewContactPage() {
  const [tabNewContactValue, setTabNewContactValue] = React.useState(0);

  const { currentUser } = useAuthUserContext()
  const setAreContactChangesSaved = useContactsContext().setAreContactChangesSaved

  const getPriorityTextAndColor = useGetPriorityTextAndColor()

  return (
    currentUser
      ? <Box>
        <Tabs
          value={tabNewContactValue}
          onChange={(e, newValue) => setTabNewContactValue(newValue)}
          aria-label="Horizontal tabs"
        >
          <Tab key={0} label="Ajout à partir de zéro" />
          <Tab key={1} label="Recherche INSEE" />
        </Tabs>

        {/* ///////// Recherche de ZERO ///////// */}
        <TabPanel key="0" value={tabNewContactValue} index={0} >
          <ContactCard
            contact={emptyContact}
            currentUserId={currentUser.uid}
            getPriorityTextAndColor={getPriorityTextAndColor}
            setAreContactChangesSaved={setAreContactChangesSaved}
            addContact={(e) => addContactOnFirebaseAndReload(currentUser.uid, e)}
          />
        </TabPanel>

        {/* ///////// Recherche INSEE ///////// */}
        <TabPanel key="1" value={tabNewContactValue} index={1}  >
          <NewContactSearchForm
            emptyContact={emptyContact}
            currentUserId={currentUser.uid}
            getPriorityTextAndColor={getPriorityTextAndColor}
            setAreContactChangesSaved={setAreContactChangesSaved}
            addContact={(e) => addContactOnFirebaseAndReload(currentUser.uid, e)}
          />
        </TabPanel>
      </Box>
      : redirect('/')
  )
}
