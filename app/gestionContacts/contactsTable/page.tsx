'use client'
import React from 'react'
// UTILS
import { countContactsByAlertDates, updatedContactsInLocalList, useGetPriorityTextAndColor } from '@/app/utils/toolbox';
import { deleteDataOnFirebaseAndReload, getUserContactsFromDatabase } from '@/app/utils/firebase'
// FIREBASE
import { Timestamp } from 'firebase/firestore';
// CONTEXTS
import { useAuthUserContext } from '@/app/context/UseAuthContextProvider'
import { useContactsContext } from '@/app/context/UseContactsContextProvider';
// COMPONENTS
import SearchContactsForm from '@/app/Components/contactsManager/SearchContactsForm';
import ContactsTable from '@/app/Components/contactsManager/ContactsTable';
// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, Container, Tooltip } from '@mui/material';

import { redirect } from 'next/navigation';
import Link from 'next/link';
//import { Link } from 'react-router-dom';  // to au lieu de href, recharche même le layout ! Et ici me met une erreur : Cannot update a component (`HotReload`) while rendering a different component (`Link`)

export default function ContactsTablePage() {
  const emptySearchCriteria: SearchContactCriteria = {
    isClient: "all",
    contactTypes: [],
    businessNames: '',
    businessCities: [],
    businessCategoryIds: []
  }

  const [allContacts, setAllContacts] = React.useState<Contact[] | null>(null)
  const [filteredContacts, setFilteredContacts] = React.useState<Contact[] | null>(null)
  const [isLoading, setLoading] = React.useState<boolean>(true)
  const [alerts, setAlerts] = React.useState<Alerts>({ nbContactsWithDatePassed: 0, nbContactsDateSoon: 0 })
  const [contactsSearchCriteria, setContactsSearchCriteria] = React.useState<SearchContactCriteria>(emptySearchCriteria)

  const { currentUser } = useAuthUserContext()
  const updateContactInContactsAndDB = useContactsContext().updateContactInContactsAndDB

  const isSearchCriteriaEmpty = JSON.stringify(contactsSearchCriteria) === JSON.stringify(emptySearchCriteria)
  const getPriorityTextAndColor = useGetPriorityTextAndColor();

  const updateContactInContactsAndDBAndFilteredContacts = (id: string, keyAndValue: { key: string; value: string | number | boolean | Timestamp | File[] | null; }) => {
    updateContactInContactsAndDB(id, keyAndValue)
    allContacts && setAllContacts(updatedContactsInLocalList(allContacts, id, keyAndValue))
  }

  // Avec REACT QUERY => Pbm qd on actualise => plus aucun contact !!! 
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ['contacts'],
  //   queryFn: () => getUserContactsFromDatabase(currentUser?.uid),
  //   //staleTime: 2*60,    // Change rien !!???
  //   //refetchOnReconnect: false,
  // });

  React.useEffect(() => {
    currentUser && getUserContactsFromDatabase(currentUser.uid).then((contactsList) => {
      setAllContacts(contactsList);
      //setFilteredContacts(contactsList);
      //setAlerts(countContactsByAlertDates(contactsList))
      setLoading(false);
    })
  }, [currentUser])

  React.useEffect(() => {
    allContacts && setAlerts(countContactsByAlertDates(allContacts))
    allContacts && setFilteredContacts(allContacts);
  }, [allContacts])

  React.useEffect(() => {
    filteredContacts && setAlerts(countContactsByAlertDates(filteredContacts))
  }, [filteredContacts])

  React.useEffect(() => {
    if (allContacts && JSON.stringify(contactsSearchCriteria) !== JSON.stringify(emptySearchCriteria)) {
      const searchIsClient = contactsSearchCriteria.isClient === "yes"
        ? true
        : contactsSearchCriteria.isClient === "no"
          ? false
          : null
      const searchOnCity = contactsSearchCriteria.businessCities.length > 0
        ? contactsSearchCriteria.businessCities
        : ['']
      const searchOnCategory = contactsSearchCriteria.businessCategoryIds.length > 0
        ? contactsSearchCriteria.businessCategoryIds
        : ['']
      const searchOnType = contactsSearchCriteria.contactTypes.length > 0
        ? contactsSearchCriteria.contactTypes
        : ['']

      const searchedContacts: Contact[] = allContacts.filter((contact: Contact) => {
        return (
          contact.businessName.toLowerCase().includes(contactsSearchCriteria.businessNames.toLowerCase())
          // si searchIsClient est null, on ne filtre pas sur ce critère
          && (searchIsClient === null || contact.isClient === searchIsClient)
          // Si aucune recherche sur la VILLE on ne fait rien et si recherche = "-Vide(s)" on recherche les villes = "" 
          && (JSON.stringify(searchOnCity) === JSON.stringify(['']) || searchOnCity.includes('-Vide(s)') && contact.businessCity === '' || searchOnCity.some((city) => contact.businessCity.toLowerCase() === city.toLowerCase()))
          // Si aucune recherche sur la CATEGORIE on ne fait rien   
          && (JSON.stringify(searchOnCategory) === JSON.stringify(['']) || searchOnCategory.some((cat) => contact.businessCategoryId === cat))
          // Si aucune recherche sur le TYPE on ne fait rien
          && (JSON.stringify(searchOnType) === JSON.stringify(['']) || searchOnType.some((type) => {
            return contact.contactType === type
          }))
        )
      })
      setFilteredContacts(searchedContacts)
    }
    else {
      setFilteredContacts(allContacts)
    }
  }, [contactsSearchCriteria, allContacts,])// si on met emptySearchCriteria, ça boucle à l'infini

  return (
    isLoading
      ? <Container sx={{ ml: "50%", mt: "20%" }} >
        <CircularProgress color='secondary' />
      </Container>
      // : isError
      //   ? <Typography>Une erreur s'est produite</Typography>
      : currentUser
        ? <Box width="100%"
        >
          <SearchContactsForm
            contacts={allContacts || []}
            currentUserId={currentUser.uid}
            emptySearchCriteria={emptySearchCriteria}
            onSearchChange={setContactsSearchCriteria}
          />
          {(filteredContacts && allContacts) && <>
            <Box sx={{ display: "flex", alignItems: "center", margin: "13px 0 7px 15px", }}
            >
              {allContacts.length > 0
                ? <Typography variant="h5">
                  {!isSearchCriteriaEmpty && <Tooltip title="Résultat de recherche">
                    {/* On enveloppe le bouton (Fab) dans un <span> pour que le Tooltip fonctionne (Fab ne fonctionne pas sur un bouton désactivé) */}
                    <span>
                      <Fab disabled size="small" color="primary" sx={{
                        mr: 2
                      }} >
                        <SearchIcon />
                      </Fab>
                    </span>
                  </Tooltip>
                  }
                  {filteredContacts.length} contacts
                  {filteredContacts.length > 0 && <Typography variant="h5" component="span" color="warning.main" sx={{ px: 2 }}>
                    {alerts.nbContactsWithDatePassed} relance(s) passée(s)
                  </Typography>}
                  {filteredContacts.length > 0 && <Typography variant="h5" component="span" color="primary.main">
                    et {alerts.nbContactsDateSoon} relance(s) à faire dans les 7 jours.
                  </Typography>}
                </Typography>

                : <Typography variant="h5" color="error.main">
                  Aucun contact pour l'instant, veuillez en ajouter ici :
                  <Link
                    href="/gestionContacts/newContact"
                  //to="/gestionContacts/newContact" 
                  >
                    <Button variant="contained" color="primary"
                      sx={{ ml: 2 }}
                    >
                      Nouveau contact
                    </Button>
                  </Link>
                </Typography>
              }
            </Box>
            {filteredContacts.length > 0 && <ContactsTable
              contacts={filteredContacts}
              currentUserId={currentUser ? currentUser.uid : ""}
              handleUpdateContact={updateContactInContactsAndDBAndFilteredContacts}
              handleDeleteContact={deleteDataOnFirebaseAndReload}
              getPriorityTextAndColor={getPriorityTextAndColor}
            />}
          </>}
        </Box >
        : redirect('/')
  )
}
