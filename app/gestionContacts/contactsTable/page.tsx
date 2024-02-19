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
import { countContactsByAlertDates, updatedContactsInLocalList, useGetPriorityTextAndColor } from '../../utils/toolbox';
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



  //const searchParams = useSearchParams();
  //const allContacts = JSON.parse(searchParams.get("allContacts") || "[]");
  //const [allContacts, setAllContacts] = React.useState<Contact[]>(JSON.parse(localStorage.getItem('allContacts') || '[]'))
  //const [allContacts, setAllContacts] = React.useState<Contact[]>(contactsContextValue.allContacts)

  // J'initialise allContacts et filteredContacts à null pour éviter l'affichage (rapide) du tableau VIDE (avant que les données ne soient chargées)
  const [allContacts, setAllContacts] = React.useState<Contact[] | null>(null)
  //console.log("allContacts : ", allContacts)
  // allContacts && allContacts[0] && console.log("allContacts 1 : ", allContacts[0].id[0] , allContacts[0].isClient )
  // allContacts && allContacts[1] && console.log("allContacts 2 : ", allContacts[1].id[0], allContacts[1].isClient )

  const [filteredContacts, setFilteredContacts] = React.useState<Contact[] | null>(null)
  //console.log("filteredContacts : ", filteredContacts)
  // filteredContacts && filteredContacts[0] && console.log("filteredContacts 1 : ", filteredContacts[0].id[0], filteredContacts[0].isClient )
  // filteredContacts && filteredContacts[1] && console.log("filteredContacts 2 : ", filteredContacts[1].id[0] , filteredContacts[1].isClient)

  const updateContactInContactsAndDB = useContactsContext().updateContactInContactsAndDB

  const updateContactInContactsAndDBAndFilteredContacts = (id: string, keyAndValue: { key: string; value: string | number | boolean | Timestamp | File[] | null; }) => {
    //console.log("modif allContact :", id, keyAndValue)

    updateContactInContactsAndDB(id, keyAndValue)
    allContacts && setAllContacts(updatedContactsInLocalList(allContacts, id, keyAndValue))
    //filteredContacts && setAllContacts(updatedContactsInLocalList(filteredContacts, id, keyAndValue))

  }



  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ['contacts'],
  //   queryFn: () => getUserContactsFromDatabase(currentUser?.uid),
  //   //staleTime: 2*60,    // Change rien !!???
  //   //refetchOnReconnect: false,
  // });

  // React.useEffect(() => {
  //   if (data) {
  //     setAllContacts(data);
  //   }
  // }, [data]);


  // console.log("isLoading : ", isLoading)
  // console.log("data : ", data)


  // Pbm qd on actualise => plus aucun contact !!!!!!!!! J'essaie sans le useQuery

  const [isLoading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    currentUser && getUserContactsFromDatabase(currentUser.uid).then((contactsList) => {
      setAllContacts(contactsList);
      //setFilteredContacts(contactsList);
      //setAlerts(countContactsByAlertDates(contactsList))
      setLoading(false);
    })
  }, [currentUser])


  const [alerts, setAlerts] = React.useState<Alerts>({ nbContactsWithDatePassed: 0, nbContactsDateSoon: 0 })

  const emptySearchCriteria: SearchContactCriteria = {
    isClient: "all",
    contactTypes: [],
    businessNames: '',
    businessCities: [],
    businessCategoryIds: []
  }
  const [contactsSearchCriteria, setContactsSearchCriteria] = React.useState<SearchContactCriteria>(emptySearchCriteria)
  const isSearchCriteriaEmpty = JSON.stringify(contactsSearchCriteria) === JSON.stringify(emptySearchCriteria)
  const getPriorityTextAndColor = useGetPriorityTextAndColor();


  React.useEffect(() => {
    allContacts && setAlerts(countContactsByAlertDates(allContacts))
    allContacts && setFilteredContacts(allContacts);
  }, [allContacts])

  React.useEffect(() => {
    filteredContacts && setAlerts(countContactsByAlertDates(filteredContacts))
  }, [filteredContacts])

  React.useEffect(() => {
    //console.log("searchCriteria : ", contactsSearchCriteria)

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
          //&& (JSON.stringify(searchOnCity) === JSON.stringify(['']) ||  searchOnCity.some((city) => contact.businessCity.toLowerCase() === city.toLowerCase())) 
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


      // BESOIN DU ELSE ??????????????????????????????????????????????? OUI !!!!!!!! PK ???????? => qd on fait un modif
    }
    else {
      setFilteredContacts(allContacts)
    }
  }, [contactsSearchCriteria, allContacts,
    //emptySearchCriteria
  ])

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
            >{allContacts.length > 0
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
                    //onClick={() => {redirect('/gestionContacts/newContact')}}
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
