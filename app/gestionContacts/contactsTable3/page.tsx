'use client'

import React from 'react'

import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';
import { TABS_WIDTH, emptyContact } from './../../utils/toolbox'
//import { useSearchParams } from "next/navigation";
import { useAuthUserContext } from './../../context/UseAuthContextProvider'
import { redirect } from 'next/navigation';
import { addContactOnFirebaseAndReload, deleteAllDatasOnFirebaseAndReload, updatDataOnFirebase, updatDataWholeContactOnFirebase, deleteDataOnFirebaseAndReload, getUserContactsFromDatabase } from './../../utils/firebase'
import { countContactsByAlertDates, updatedContactsInLocalList, updatedContactsInLocalListWithWholeContact, useGetPriorityTextAndColor } from './../../utils/toolbox';
import { Timestamp } from 'firebase/firestore';

import SearchContactsForm from './../../Components/SearchContactsForm';
import ContactsTable3 from '@/app/Components/ContactsTable3';
import { Tooltip } from '@mui/material';
import { useContactsContext } from '@/app/context/UseContactsContextProvider';
import { useQuery } from '@tanstack/react-query';


export default function ContactsTablePage() {

  const { currentUser } = useAuthUserContext()

  const muiTheme = useTheme()

  const contactsContextValue = useContactsContext()

  const displayContactCardToUpdate = useContactsContext().displayContactCardToUpdate
  const updateContactInContactsAndDB = useContactsContext().updateContactInContactsAndDB

  const updateContactInContactsAndDBAndFilteredContacts = (id: string, keyAndValue: { key: string; value: string | number | boolean | Timestamp | File[] | null; }) => {
    updateContactInContactsAndDB(id, keyAndValue)
    setFilteredContacts(updatedContactsInLocalList(filteredContacts, id, keyAndValue))
  }


  useContactsContext().updateContactInContactsAndDB


  //const searchParams = useSearchParams();
  //const allContacts = JSON.parse(searchParams.get("allContacts") || "[]");
  //const [allContacts, setAllContacts] = React.useState<Contact[]>(JSON.parse(localStorage.getItem('allContacts') || '[]'))
  const [allContacts, setAllContacts] = React.useState<Contact[]>(contactsContextValue.allContacts)
  console.log("allContacts : ", allContacts)

  const [filteredContacts, setFilteredContacts] = React.useState<Contact[]>([])
  console.log("filteredContacts : ", filteredContacts)

  const [alerts, setAlerts] = React.useState<Alerts>({ nbContactsWithDatePassed: 0, nbContactsWithDateSoon: 0 })

  const emptySearchCriteria: SearchContactCriteria = {
    isClient: "all",
    contactType: [],
    businessName: '',
    businessCity: [],
    businessCategoryId: []
  }
  const [contactsSearchCriteria, setContactsSearchCriteria] = React.useState<SearchContactCriteria>(emptySearchCriteria)

  const isSearchCriteriaEmpty = JSON.stringify(contactsSearchCriteria) === JSON.stringify(emptySearchCriteria)



  //const memoizedUpdateContactInContactsAndDB = React.useCallback(updateContactInContactsAndDB, [filteredContacts])
  const memoizedUpdateContactInContactsAndDB = React.useCallback(updateContactInContactsAndDBAndFilteredContacts, [filteredContacts])
  const memoizedDeleteDataOnFirebaseAndReload = React.useCallback(deleteDataOnFirebaseAndReload, []);
  //REMETTRE !!!
  const memoizeddisplayContactCardToUpdate = React.useCallback(displayContactCardToUpdate, [])

  const getPriorityTextAndColor = useGetPriorityTextAndColor();
  const memoizedGetPriorityTextAndColor = React.useCallback(getPriorityTextAndColor, [])

  React.useEffect(() => {
    console.log("useEffect 1")
    setFilteredContacts(allContacts);
    setAlerts(countContactsByAlertDates(allContacts))
  }, [currentUser, allContacts])

  React.useEffect(() => {
    console.log("useEffect 2")

    setAlerts(countContactsByAlertDates(filteredContacts))
  }, [filteredContacts])

  React.useEffect(() => {
    console.log("useEffect 3")

    if (JSON.stringify(contactsSearchCriteria) !== JSON.stringify(emptySearchCriteria)) {

      const searchIsClient = contactsSearchCriteria.isClient === "yes" ? true : contactsSearchCriteria.isClient === "no" ? false : null
      const searchOnCity = contactsSearchCriteria.businessCity.length > 0 ? contactsSearchCriteria.businessCity : ['']

      const searchOnCategory = contactsSearchCriteria.businessCategoryId.length > 0 ? contactsSearchCriteria.businessCategoryId : ['']
      const searchOnType = contactsSearchCriteria.contactType.length > 0 ? contactsSearchCriteria.contactType : ['']

      const searchedContacts: Contact[] = allContacts.filter((contact: Contact) => {

        return (
          contact.businessName.toLowerCase().includes(contactsSearchCriteria.businessName.toLowerCase())
          && (searchIsClient === null || contact.isClient === searchIsClient)
          && searchOnCity.some((city) => contact.businessCity.toLowerCase().includes(city.toLowerCase()))
          && searchOnCategory.some((cat) => contact.businessCategoryId.includes(cat))
          && searchOnType.some((type) => {
            return contact.contactType.includes(type)
          })
        )
      })
      setFilteredContacts(searchedContacts)
    } else {
      setFilteredContacts(allContacts)
    }
  }, [contactsSearchCriteria, allContacts])



  // const { data, isLoading, isError } = useQuery<Contact[]>({
  //   queryKey: ['userContacts'],
  //   queryFn: () => getUserContactsFromDatabase(currentUser?.uid),
  //   // onSuccess: (contactsList: Contact[]) => {
  //   //     setAllContacts(contactsList);
  //   //     localStorage.setItem('allContacts', JSON.stringify(contactsList));
  //   //     setLoading(false);
  //   // }
  // });

  return (
    currentUser
      ? <Box width="100%"
      >
        <SearchContactsForm
          contacts={allContacts}
          currentUserId={currentUser.uid}
          emptySearchCriteria={emptySearchCriteria}
          onSearchChange={setContactsSearchCriteria}
        />
        <Box sx={{ display: "flex", alignItems: "center", margin: "13px 0 7px 15px", }}
        >{allContacts.length > 0
          ? <Typography variant="h5">

            {!isSearchCriteriaEmpty && <Tooltip title="Selon votre recherche">
              {/* On enveloppe le bouton (Fab) dans un <span> pour que le Tooltip fonctionne (ne foncitonne pas sur un bouton désactivé (Fab) */}
              <span>
                <Fab disabled size="small" color="primary" sx={{
                  mr: 2
                }} >
                  <SearchIcon />
                </Fab>
              </span>
            </Tooltip>
            }
            {filteredContacts.length} contacts :
            <Typography variant="h5" component="span" color="warning.main" sx={{ px: 2 }}>
              {alerts.nbContactsWithDatePassed} relance(s) passée(s)
            </Typography>
            <Typography variant="h5" component="span" color="primary.main">
              et {alerts.nbContactsWithDateSoon} relance(s) à faire dans les 7 jours.
            </Typography>

          </Typography>
          : <Typography variant="h5" color="error.main">
            Aucun contact pour l'instant, veuillez en ajouter ici :
            <Button variant="contained" color="primary"
              onClick={() => {
                // REMETTRE ???
                //setTabValue(2); setTabNewContactValue(0) 
              }}
              sx={{ ml: 2 }}>Nouveau contact</Button>
          </Typography>
          }
        </Box>
        {/* Tableau VIRTUALISé */}
        <ContactsTable3
          contacts={filteredContacts}
          currentUserId={currentUser ? currentUser.uid : ""}
          handleUpdateContact={memoizedUpdateContactInContactsAndDB}
          handleDeleteContact={memoizedDeleteDataOnFirebaseAndReload}
          displayContactCard={memoizeddisplayContactCardToUpdate}
          getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
        />
      </Box>
      : redirect('/')
  )
}
