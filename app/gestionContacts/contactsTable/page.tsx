'use client'

import React from 'react'

import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';
import { TABS_WIDTH, emptyContact } from '../../utils/toolbox'
//import { useSearchParams } from "next/navigation";
import { useAuthUserContext } from '../../context/UseAuthContextProvider'
import { addContactOnFirebaseAndReload, deleteAllDatasOnFirebaseAndReload, updatDataOnFirebase, updatDataWholeContactOnFirebase, deleteDataOnFirebaseAndReload, getUserContactsFromDatabase } from '../../utils/firebase'
import { countContactsByAlertDates, updatedContactsInLocalList, updatedContactsInLocalListWithWholeContact, useGetPriorityTextAndColor } from '../../utils/toolbox';
import { Timestamp } from 'firebase/firestore';

import SearchContactsForm from '../../Components/contactsManager/SearchContactsForm';
import ContactsTable from '@/app/Components/contactsManager/ContactsTable';
import { CircularProgress, Container, Tooltip } from '@mui/material';
import { useContactsContext } from '@/app/context/UseContactsContextProvider';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
//import { Link } from 'react-router-dom';  // to au lieu de href, recharche même le layout ! Et ici me met une erreur : Cannot update a component (`HotReload`) while rendering a different component (`Link`)
import Link from 'next/link';


export default function ContactsTablePage() {

  const { currentUser } = useAuthUserContext()

  const muiTheme = useTheme()

  const updateContactInContactsAndDB = useContactsContext().updateContactInContactsAndDB

  const updateContactInContactsAndDBAndFilteredContacts = (id: string, keyAndValue: { key: string; value: string | number | boolean | Timestamp | File[] | null; }) => {
    updateContactInContactsAndDB(id, keyAndValue)
    setAllContacts(updatedContactsInLocalList(filteredContacts, id, keyAndValue))
  }

  //const searchParams = useSearchParams();
  //const allContacts = JSON.parse(searchParams.get("allContacts") || "[]");
  //const [allContacts, setAllContacts] = React.useState<Contact[]>(JSON.parse(localStorage.getItem('allContacts') || '[]'))
  //const [allContacts, setAllContacts] = React.useState<Contact[]>(contactsContextValue.allContacts)
  const [allContacts, setAllContacts] = React.useState<Contact[]>([
    // {...emptyContact, id: "1", businessName: "coucou1"}, 
    // {...emptyContact, id: "2", businessName: "coucou2 2"},
    // {...emptyContact, id: "3", businessName: "coucou3 3 3"},
    // {...emptyContact, id: "4", businessName: "coucou4"},
    // {...emptyContact, id: "5", businessName: "coucou5"},
    // {...emptyContact, id: "6", businessName: "coucou6"},
    // {...emptyContact, id: "7", businessName: "coucou7"},
    // {...emptyContact, id: "8", businessName: "coucou8"},
    // {...emptyContact, id: "9", businessName: "coucou1"}, 
    // {...emptyContact, id: "10", businessName: "coucou2"},
    // {...emptyContact, id: "11", businessName: "coucou3"},
    // {...emptyContact, id: "12", businessName: "coucou4"},
    // {...emptyContact, id: "13", businessName: "coucou5"},
    // {...emptyContact, id: "14", businessName: "coucou6"},
    // {...emptyContact, id: "15", businessName: "coucou7"},
    // {...emptyContact, id: "16", businessName: "coucou8"},
    // {...emptyContact, id: "17", businessName: "coucou1"},
    // {...emptyContact, id: "18", businessName: "coucou2"},
    // {...emptyContact, id: "19", businessName: "coucou3"},
    // {...emptyContact, id: "20", businessName: "coucou4"},
    // {...emptyContact, id: "21", businessName: "coucou5"},
    // {...emptyContact, id: "22", businessName: "coucou6"},
    // {...emptyContact, id: "23", businessName: "coucou7"},
    // {...emptyContact, id: "24", businessName: "coucou8"},
    // {...emptyContact, id: "25", businessName: "coucou1"},
    // {...emptyContact, id: "26", businessName: "coucou2"},
    // {...emptyContact, id: "27", businessName: "coucou3"},
    // {...emptyContact, id: "28", businessName: "coucou4"},
    // {...emptyContact, id: "29", businessName: "coucou5"},
    // {...emptyContact, id: "30", businessName: "coucou6"},
    // {...emptyContact, id: "31", businessName: "coucou7"},
    // {...emptyContact, id: "32", businessName: "coucou8"},
    // {...emptyContact, id: "33", businessName: "coucou1"},
    // {...emptyContact, id: "34", businessName: "coucou2"},
    // {...emptyContact, id: "35", businessName: "coucou3"},
    // {...emptyContact, id: "36", businessName: "coucou4"},
    // {...emptyContact, id: "37", businessName: "coucou5"},
    // {...emptyContact, id: "38", businessName: "coucou6"},
    // {...emptyContact, id: "39", businessName: "coucou7"},
    // {...emptyContact, id: "40", businessName: "coucou8"},
    // {...emptyContact, id: "41", businessName: "coucou1"},
    // {...emptyContact, id: "42", businessName: "coucou2"},
    // {...emptyContact, id: "43", businessName: "coucou3"},
    // {...emptyContact, id: "44", businessName: "coucou4"},
    // {...emptyContact, id: "45", businessName: "coucou5"},
    // {...emptyContact, id: "46", businessName: "coucou6"},
    // {...emptyContact, id: "47", businessName: "coucou7"},
    // {...emptyContact, id: "48", businessName: "coucou8"},
    // {...emptyContact, id: "49", businessName: "coucou1"},
    // {...emptyContact, id: "50", businessName: "coucou2"},
  ])

  //console.log("allContacts : ", allContacts)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => getUserContactsFromDatabase(currentUser?.uid),
  });

  React.useEffect(() => {
    if (data) {
      setAllContacts(data);
    }
  }, [data]);

  const [filteredContacts, setFilteredContacts] = React.useState<Contact[]>([])
  //console.log("filteredContacts : ", filteredContacts)

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

  const getPriorityTextAndColor = useGetPriorityTextAndColor();

  React.useEffect(() => {
    setAlerts(countContactsByAlertDates(allContacts))
    setFilteredContacts(allContacts);
  }, [currentUser, allContacts])

  React.useEffect(() => {
    setAlerts(countContactsByAlertDates(filteredContacts))
  }, [filteredContacts])

  React.useEffect(() => {

    console.log("searchCriteria : ", contactsSearchCriteria)

    if (JSON.stringify(contactsSearchCriteria) !== JSON.stringify(emptySearchCriteria)) {


      const searchIsClient = contactsSearchCriteria.isClient === "yes"
        ? true
        : contactsSearchCriteria.isClient === "no"
          ? false
          : null
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
  }, [contactsSearchCriteria, allContacts, 
    //emptySearchCriteria
  ])



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

        {filteredContacts && <>
          <Box sx={{ display: "flex", alignItems: "center", margin: "13px 0 7px 15px", }}
          >{allContacts.length > 0
            ? <Typography variant="h5">
              {!isSearchCriteriaEmpty && <Tooltip title="Selon votre recherche">
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
              <Link
                href="/gestionContacts/newContact"
              //to="/gestionContacts/newContact" 
              >
                <Button variant="contained" color="primary"
                  //onClick={() => {redirect('/gestionContacts/newContact')}}
                  sx={{ ml: 2 }}
                >
                  Nouveau contact
                </Button>
              </Link>
            </Typography>
            }
          </Box>
          {/* Tableau normal mais très long dès qu'il y a plus de 20 contacts */}
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
