'use client'

import * as React from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Tooltip, Paper, Modal, styled, TabProps } from '@mui/material';
import { TextField, Select, MenuItem, Autocomplete, ListItem, List, ListItemIcon, InputLabel, Tabs, Tab, Box as CustomBox } from '@mui/material'
import { Fab } from '@mui/material'
import NewContactSearchForm from '../Components/contactsManager/NewContactSearchForm';
import ContactCard from '../Components/contactsManager/ContactCard';
import ContactsTable from '../Components/contactsManager/ContactsTable';
import ContactsTable2 from '../Components/contactsManager/ContactsTable2';
import ContactsTable3 from '../Components/contactsManager/ContactsTable3';
import ContactsTable4 from '../Components/contactsManager/ContactsTable4';
import ContactsTable5 from '../Components/contactsManager/ContactsTable5';
import AuthDetails from './../Components/AuthDetails';
import SearchContactsForm from '../Components/contactsManager/SearchContactsForm';
import Admin from './../Components/Admin';
import Help from './../Components/Help';
import SearchIcon from '@mui/icons-material/Search';
import { modalStyle } from './../utils/StyledComponents'

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { TABS_WIDTH, emptyContact } from './../utils/toolbox'
import { countContactsByAlertDates, updatedContactsInLocalList, updatedContactsInLocalListWithWholeContact } from './../utils/toolbox';
import { Timestamp } from 'firebase/firestore';

import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarScheduler from '../Components/contactsManager/CalendarScheduler';
import { TabPanel } from './../utils/StyledComponents';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

import { useAuthUserContext } from './../context/UseAuthContextProvider'
import ContactsContext from './../context/UseContactsContextProvider';
import Link from 'next/link';
//import { Link } from 'react-router-dom' // to au lieu de href, recharche même le layout ! Et ici me met une erreur : Cannot update a component (`HotReload`) while rendering a different component (`Link`)

//import { useRouter } from 'next/router';
import { useRouter, usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';
import { addContactOnFirebaseAndReload, deleteAllDatasOnFirebaseAndReload, updatDataOnFirebase, updatDataWholeContactOnFirebase, deleteDataOnFirebaseAndReload, getUserContactsFromDatabase } from './../utils/firebase'
import ReactQueryProvider from '../Components/providers/ReactQueryProvider';

import { useQuery } from '@tanstack/react-query';

export default function ContactsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { currentUser } = useAuthUserContext()

    //const ContactsContext = React.createContext("")

    const muiTheme = useTheme()
    const pathname = usePathname()

    const [allContacts, setAllContacts] = React.useState<Contact[]>([])
    // const [contactToDisplay, setContactToDisplay] = React.useState<Contact>(emptyContact)
    // const [selectedContactId, setSelectedContactId] = React.useState<string>("")
    // const [loading, setLoading] = React.useState(true)
    const [tabValue, setTabValue] = React.useState(0);
    //const [tabCalendarValue, setTabCalendarValue] = React.useState(0);

    const titles = [
        { label: "Liste des contacts", icon: <Diversity3Icon />, href: "/gestionContacts/contactsTable" },
        { label: "Calendrier", icon: <CalendarMonthIcon />, href: "/gestionContacts/calendar" },
        { label: "Nouveau contact", icon: <PersonAddIcon />, href: "/gestionContacts/newContact" },
        { label: "Vu d'un contact (double cliquer sur un logo dans la liste)", icon: <PersonIcon />, href: "/gestionContacts/" },
        { label: "Admin", icon: <SettingsIcon />, href: "/gestionContacts/admin" },
        { label: "Aide", icon: <HelpOutlineIcon />, href: "/gestionContacts/help" },
        // { label: "Liste des contacts2 (virtualisée)", icon: <Diversity3Icon color="error" />, href: "/gestionContacts/contactsTableVirtualized2" },
        // { label: "Liste des contacts3 (virtualisée)", icon: <Diversity3Icon color="error" />, href: "/gestionContacts/contactsTableVirtualized3" },
        // { label: "Liste des contacts4 (virtualisée)", icon: <Diversity3Icon color="error" />, href: "/gestionContacts/contactsTableVirtualized4" },
        // { label: "Liste des contacts5 (virtualisée)", icon: <Diversity3Icon color="error" />, href: "/gestionContacts/contactsTableVirtualized5" },
    ]


    // const displayContactCardToUpdate = (contact: Contact) => {
    //     setContactToDisplay(contact)
    //     setTabValue(3)  // On reste sur le même onglet                                     // Voir ce que ça fait si on enlève ça
    // }

    const updateContactInContactsAndDB = (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => {
        setAllContacts(updatedContactsInLocalList(allContacts, id, keyAndValue))
        //localStorage.setItem('allContacts', JSON.stringify(updatedContactsInLocalList(allContacts, id, keyAndValue)))
        //setFilteredContacts(updatedContactsInLocalList(filteredContacts, id, keyAndValue))
        updatDataOnFirebase(id, keyAndValue)
    }

    const updateWholeContactInContactsAndDB = (contactToUpdate: Contact) => {
        setAllContacts(updatedContactsInLocalListWithWholeContact(allContacts, contactToUpdate))
        //localStorage.setItem('allContacts', JSON.stringify(updatedContactsInLocalListWithWholeContact(allContacts, contactToUpdate)))

        // Je l'ai enlevé (01/2024) ùais voir si besoin car de toutes façon filterContacts est calculé à partir de allContacts
        //setFilteredContacts(updatedContactsInLocalListWithWholeContact(allContacts, contactToUpdate))
        updatDataWholeContactOnFirebase(contactToUpdate)
    }

    // React.useEffect(() => {
    //     currentUser && getUserContactsFromDatabase(currentUser.uid).then((contactsList: Contact[]) => {
    //         setAllContacts(contactsList);
    //         //localStorage.setItem('allContacts', JSON.stringify(contactsList));
    //         setLoading(false);
    //     })
    // }, [currentUser])


    // const onChangeTabValue = (newValue: number) => {
    //     setTabValueWithoutSavingInfoChanges(newValue)

    //     if ([2, 3].includes(tabValue) && hasContactInfoChanged) {
    //         setOpenWarningModal(true)
    //         return
    //     }
    //     setTabValue(newValue)
    // }


    React.useEffect(() => {
        //redirect('/gestionContacts/contactsTable')

        //     const queryParamString = new URLSearchParams(query).toString();
        //    return redirect(`${url}?${queryParamString}`);

        // if (router.isReady) {
        //     if (currentUser) {
        //         const stringifiedAllContacts = JSON.stringify(allContacts);
        //         router.push({
        //             pathname: '/gestionContacts/contactsTable', 
        //             query: { allContacts: stringifiedAllContacts },
        //         });
        //     }
        // }
    }, []);



    // const { data, isLoading, isError } = useQuery<Contact[]>({
    //     queryKey: ['userContacts'],
    //     queryFn: () => getUserContactsFromDatabase(currentUser?.uid),
    //     // onSuccess: (contactsList: Contact[]) => {
    //     //     setAllContacts(contactsList);
    //     //     localStorage.setItem('allContacts', JSON.stringify(contactsList));
    //     //     setLoading(false);
    //     // }
    // });





    return (
        <Box sx={{
            position: "relative",
        }}>
            {
                // isLoading ? (
                //     <Container sx={{ ml: "50%", mt: "20%" }} >
                //         <CircularProgress />
                //     </Container>
                // ) : isError ? (
                //     <Typography>Une erreur s'est produite</Typography>
                // ) : data && 
                <Box>
                    <Box>
                        <AuthDetails />
                    </Box>

                    {/* ///////////////////////ONGLETS - Tabs /////////////////////// */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            //bgcolor: 'background.paper', 
                            display: 'flex',
                            height: '100vh',
                        }}
                    >
                        <List 
                            sx={{ 
                                borderRight: 1, 
                                borderColor: 'divider', 
                                width: TABS_WIDTH, 
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            {titles.map((title, index) => (
                                // passHref est utilisé pour passer l'attribut href à son enfant
                                <Link key={index} href={title.href} passHref >
                                    <ListItem sx={{ mt: 3 }} >
                                        <Tooltip title={title.label} placement="right">
                                        <ListItemIcon
                                            sx={{
                                                minWidth:"23px",
                                                color: pathname === title.href ? 'primary.main' : '' 
                                            }}
                                        >
                                            {title.icon}
                                        </ListItemIcon>
                                        </Tooltip>
                                    </ListItem>
                                </Link>
                            ))}
                        </List>

                        {/* <Tabs
                        orientation="vertical"
                        value={tabValue}
                        // onChange={(e, newValue) => onChangeTabValue(newValue)}
                        onChange={(e, newValue) => setTabValue(newValue)}
                        aria-label="Vertical tabs"
                        sx={{ borderRight: 1, borderColor: 'divider', width: TABS_WIDTH }}
                    >
                        {titles.map((title, index) => (
                            <Tab
                                key={index}
                                //href={title.href}     // Le href recharge le layout, pas le routeur !
                                onClick={() => router.push(title.href)}
                                title={title.label}
                                icon={title.icon}
                                value={index}
                                sx={{ margin: '10px 0 10px 0' }}
                                disabled={index === 3}
                            />

                        // Si j'utilise next/LINK j'ai une erreur : Warning: React does not recognize the `fullWidth` prop on a DOM element et avec le LINK de react-router : ERREUR !
                        // <Link 
                        //     href={title.href} 
                        //     key={index}
                        // >
                        //     <Tab
                        //         title={title.label}
                        //         icon={title.icon}
                        //         value={index}
                        //         sx={{ margin: '10px 0 10px 0' }}
                        //         disabled={index === 3}
                        //     />
                        // </Link>
                      
                        ))}                        
                    </Tabs> */}

                        <Box
                            width={`calc(100vw - ${TABS_WIDTH}px)`}
                        //width= '100%'
                        >
                            {/* <ReactQueryProvider> */}
                            <ContactsContext.Provider
                                value={{
                                    //allContacts: allContacts,
                                    //displayContactCardToUpdate: displayContactCardToUpdate,
                                    updateContactInContactsAndDB: updateContactInContactsAndDB,
                                    deleteDataOnFirebaseAndReload: deleteDataOnFirebaseAndReload,
                                    updateWholeContactInContactsAndDB: updateWholeContactInContactsAndDB,

                                }}
                            >
                                {children}
                            </ContactsContext.Provider>
                            {/* </ReactQueryProvider> */}
                            {/* <ContactsContextProvider>
                                {children}
                            </ContactsContextProvider> */}
                        </Box>
                    </Box>
                </Box>
            }
        </Box>
    )
}
