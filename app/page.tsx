'use client'

import * as React from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Tooltip, Paper, Modal } from '@mui/material';
import { TextField, Select, MenuItem, Autocomplete, ListItem, List, InputLabel, Tabs, Tab, Box as CustomBox } from '@mui/material'
import { Fab } from '@mui/material'
import NewContactSearchForm from './Components/NewContactSearchForm';
import ContactCard from './Components/ContactCard';
import ContactsTable from './Components/ContactsTable';
import ContactsTable2 from './Components/ContactsTable2';
import ContactsTable3 from './Components/ContactsTable3';
import ContactsTable4 from './Components/ContactsTable4';
import ContactsTable5 from './Components/ContactsTable5';
import SignIn from './Components/auth/SignIn';
import SignUp from './Components/auth/SignUp';
import AuthDetails from './Components/AuthDetails';
import SearchContactsForm from './Components/SearchContactsForm';
import Admin from './Components/Admin';
import Help from './Components/Help';
import SearchIcon from '@mui/icons-material/Search';
import { modalStyle } from './utils/StyledComponents'
import { addContactOnFirebaseAndReload, deleteAllDatasOnFirebaseAndReload, updatDataOnFirebase, updatDataWholeContactOnFirebase, deleteDataOnFirebaseAndReload, getContactsFromDatabase } from './utils/firebase'
import { Timestamp } from 'firebase/firestore';
import { emptyContact } from './utils/toolbox'
import { useAuthUserContext } from './context/UseAuthContext'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { countContactsByAlertDates, updatedContactsInLocalList, updatedContactsInLocalListWithWholeContact } from './utils/toolbox';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarLittle from './Components/CalendarLittle';
import CalendarFull from './Components/CalendarFull';
import CalendarScheduler from './Components/CalendarScheduler';
import { TabPanel, TABS_WIDTH } from './utils/StyledComponents';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';


export default function Contacts() {
    const [allContacts, setAllContacts] = React.useState<Contact[]>([])
    const [filteredContacts, setFilteredContacts] = React.useState<Contact[]>([])
    const [selectedContactId, setSelectedContactId] = React.useState<string>("")

    console.log("selectedContactId", selectedContactId)

    const [loading, setLoading] = React.useState(true)
    const [alerts, setAlerts] = React.useState<Alerts>({ nbContactsWithDatePassed: 0, nbContactsWithDateSoon: 0 })

    const [contactToDisplay, setContactToDisplay] = React.useState<Contact>(emptyContact)

    const [hasContactInfoChanged, setHasContactInfoChanged] = React.useState(false)
    const [openWarningModal, setOpenWarningModal] = React.useState(false);

    const muiTheme = useTheme()
    const { currentUser } = useAuthUserContext()

    const emptySearchCriteria: SearchContactCriteria = {
        isClient: "all",
        contactType: [],
        businessName: '',
        businessCity: [],
        businessCategoryId: []
    }
    const [contactsSearchCriteria, setContactsSearchCriteria] = React.useState<SearchContactCriteria>(emptySearchCriteria)

    const isSearchCriteriaEmpty = JSON.stringify(contactsSearchCriteria) === JSON.stringify(emptySearchCriteria)

    const [tabValue, setTabValue] = React.useState(0);

    const [tabValueWithoutSavingInfoChanges, setTabValueWithoutSavingInfoChanges] = React.useState(0);
    const [tabNewContactValue, setTabNewContactValue] = React.useState(0);
    const [tabCalendarValue, setTabCalendarValue] = React.useState(0);

    const titles = [
        { label: "Liste des contacts", icon: <Diversity3Icon /> },
        { label: "Calendrier", icon: <CalendarMonthIcon /> },
        { label: "Nouveau contact", icon: <PersonAddIcon /> },
        { label: "Vu d'un contact", icon: <PersonIcon /> },
        { label: "Admin", icon: <SettingsIcon /> },
        { label: "Aide", icon: <HelpOutlineIcon /> },
        { label: "Liste des contacts2", icon: <Diversity3Icon color="error" /> },
        { label: "Liste des contacts3", icon: <Diversity3Icon color="error" /> },
        { label: "Liste des contacts4", icon: <Diversity3Icon color="error" /> },
        { label: "Liste des contacts5", icon: <Diversity3Icon color="error" /> },
    ]

    const updateContactInContactsAndDB = (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => {
        setAllContacts(updatedContactsInLocalList(allContacts, id, keyAndValue))
        setFilteredContacts(updatedContactsInLocalList(filteredContacts, id, keyAndValue))
        updatDataOnFirebase(id, keyAndValue)
    }
    const memoizedUpdateContactInContactsAndDB = React.useCallback(updateContactInContactsAndDB, [filteredContacts])
    const memoizedDeleteDataOnFirebaseAndReload = React.useCallback(deleteDataOnFirebaseAndReload, []);

    const updateWholeContactInContactsAndDB = (contactToUpdate: Contact) => {
        setAllContacts(updatedContactsInLocalListWithWholeContact(allContacts, contactToUpdate))
        setFilteredContacts(updatedContactsInLocalListWithWholeContact(allContacts, contactToUpdate))
        updatDataWholeContactOnFirebase(contactToUpdate)
    }

    const displayContactCardToUpdate = (contact: Contact) => {
        setContactToDisplay(contact)
        setTabValue(3)  // On reste sur le même onglet
    }

    const memoizeddisplayContactCardToUpdate = React.useCallback(displayContactCardToUpdate, [])


    // Je ne peux pas mettre ces fonctions dans ToolBox car je peux utiliser les thème seulement dans un composant  (React Hooks must be called in a React function component or a custom React Hook function.)
    const getPriorityTextAndColor = (priority: number | null) => {
        switch (priority) {
            case 1: return {
                text: "Faible",
                color: muiTheme.palette.error.main,
                bgColor: "#f3d0d0"
            }
            case 2: return {
                text: "Moyenne",
                color: "lightsalmon",
                bgColor: "lightgoldenrodyellow"
            }
            case 3: return {
                text: "Haute",
                color: muiTheme.palette.primary.dark,
                bgColor: muiTheme.palette.lightCyan.light
            }
            default: return {
                text: "Aucune",
                color: muiTheme.palette.gray.dark,
                bgColor: "muiTheme.palette.gray.light  "
            }
        }
    }
    const memoizedGetPriorityTextAndColor = React.useCallback(getPriorityTextAndColor, [])


    React.useEffect(() => {
        currentUser && getContactsFromDatabase(currentUser.uid).then((contactsList) => {
            setAllContacts(contactsList);
            setFilteredContacts(contactsList);
            setAlerts(countContactsByAlertDates(contactsList))
            setLoading(false);
        })
    }, [currentUser])


    const onChangeTabValue = (newValue: number) => {
        setTabValueWithoutSavingInfoChanges(newValue)

        if ([2, 3].includes(tabValue) && hasContactInfoChanged) {
            setOpenWarningModal(true)
            return
        }
        setTabValue(newValue)
    }

    const handleNotSaveContactInfo = () => {
        setOpenWarningModal(false)
        setTabValue(tabValueWithoutSavingInfoChanges)
        setHasContactInfoChanged(false)
    }

    React.useEffect(() => {
        setAlerts(countContactsByAlertDates(filteredContacts))
    }, [filteredContacts])


    React.useEffect(() => {
        if (JSON.stringify(contactsSearchCriteria) !== JSON.stringify(emptySearchCriteria)) {

            const searchIsClient = contactsSearchCriteria.isClient === "yes" ? true : contactsSearchCriteria.isClient === "no" ? false : null
            const searchOnCity = contactsSearchCriteria.businessCity.length > 0 ? contactsSearchCriteria.businessCity : ['']

            const searchOnCategory = contactsSearchCriteria.businessCategoryId.length > 0 ? contactsSearchCriteria.businessCategoryId : ['']
            const searchOnType = contactsSearchCriteria.contactType.length > 0 ? contactsSearchCriteria.contactType : ['']

            const searchedContacts: Contact[] = allContacts.filter((contact) => {

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


    return (
        <Box sx={{
            position: "relative",
        }}>
            <Modal
                open={openWarningModal}
                onClose={() => setOpenWarningModal(false)}
            >
                <Box sx={modalStyle} >
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ mb: 5 }}
                    >
                        Attention, vous avez fait des changements non sauvegardés : êtes vous sûr de vouloir quitter ?
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                        <Button
                            variant="contained"
                            color='warning'
                            onClick={handleNotSaveContactInfo}
                            sx={{ marginRight: "15px" }}
                        >
                            Oui !
                        </Button>
                        <Button variant="contained" color='primary' sx={{ color: "white" }} onClick={() => setOpenWarningModal(false)} >Non</Button>
                    </Box>
                </Box>
            </Modal>

            {/* /////////////////////// Info USER /////////////////////// */}
            <Box sx={{
            }} ><AuthDetails /></Box>
            {loading
                ? <Container sx={{ ml: "50%", mt: "20%" }} >
                    <CircularProgress />
                </Container>
                : !currentUser
                    //  {/* ///////// CONNEXION / INSCRIPTION ///////// */}
                    ? <Box sx={{
                        display: "flex", justifyContent: "space-around",
                        margin: "20px",
                        padding: "20px",
                    }}>
                        <SignIn />
                        <SignUp />
                    </Box>

                    : <Box sx={{}} >
                        {/* ///////////////////////ONGLETS - Tabs /////////////////////// */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                bgcolor: 'background.paper', display: 'flex', height: '100vh',
                            }}
                        >
                            <Tabs
                                orientation="vertical"
                                value={tabValue}
                                onChange={(e, newValue) => onChangeTabValue(newValue)}
                                aria-label="Vertical tabs"
                                sx={{ borderRight: 1, borderColor: 'divider', width: TABS_WIDTH }}
                            >
                                {titles.map((title, index) => (
                                    <Tab
                                        key={index}
                                        title={title.label}
                                        icon={title.icon}
                                        value={index}
                                        sx={{ margin: '10px 0 10px 0' }}
                                    />
                                ))}
                            </Tabs>

                            {/* ///////// LISTE DE CONTACTS + recherche) ///////// */}
                            {/* Je ne met pas les onglets mémoïsés dans des TAB sinon ça rerender à chaque fois qu'on revient dessus ! Même avec useCallback et useMemo !!! */}
                            <Box hidden={tabValue !== 0} width={`calc(100vw - ${TABS_WIDTH}px)`}  >
                                <Box width="100%"
                                >
                                    <SearchContactsForm
                                        contacts={allContacts}
                                        currentUserId={currentUser.uid}
                                        emptySearchCriteria={emptySearchCriteria}
                                        onSearchChange={setContactsSearchCriteria}
                                    />
                                    <Box sx={{ display: "flex", alignItems: "center", margin: "13px 0 7px 15px", }}
                                    >{filteredContacts.length > 0
                                        ? <Typography variant="h5">
                                            {filteredContacts.length} contacts :
                                            <Typography variant="h5" component="span" color="warning.main" sx={{ px: 2 }}>
                                                {alerts.nbContactsWithDatePassed} relance(s) passée(s)
                                            </Typography>
                                            <Typography variant="h5" component="span" color="primary.main">
                                                et {alerts.nbContactsWithDateSoon} relance(s) à faire dans les 7 jours
                                            </Typography>
                                            {!isSearchCriteriaEmpty && <Fab disabled size="small" color="primary" sx={{
                                                ml: 2
                                            }} >
                                                <SearchIcon />
                                            </Fab>
                                            }
                                        </Typography>
                                        : <Typography variant="h5" color="error.main">
                                            Aucun contact pour l'instant, veuillez en ajouter ici :
                                            <Button variant="contained" color="primary"
                                                onClick={() => { setTabValue(2); setTabNewContactValue(0) }}
                                                sx={{ ml: 2 }}>Nouveau contact</Button>
                                        </Typography>
                                        }
                                    </Box>
                                    {/* Tableau normal mais très long dès qu'il y a plus de 20 contacts */}
                                    <ContactsTable
                                        contacts={filteredContacts}
                                        currentUserId={currentUser ? currentUser.uid : ""}
                                        handleUpdateContact={memoizedUpdateContactInContactsAndDB}
                                        handleDeleteContact={memoizedDeleteDataOnFirebaseAndReload}
                                        displayContactCard={memoizeddisplayContactCardToUpdate}
                                        getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                                    />
                                </Box>
                            </Box>

                            {/* ///////// CALENDRIERS ///////// */}
                            {/* <Box hidden={tabValue !== 1} width={`calc(100vw - ${TABS_WIDTH}px)`}  > */}
                            <TabPanel key="1" value={tabValue} index={1} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                <Tabs
                                    value={tabCalendarValue}
                                    onChange={(e, newValue: number) => setTabCalendarValue(newValue)}
                                >
                                    <Tab key={0} label="Grand"
                                    />
                                    <Tab key={1} label="Petit"
                                    />
                                    {/* <Tab key={2} label="Grand Calendrier"
                                    //icon={title.icon}
                                    // {...a11yProps(index)} 
                                    /> */}
                                </Tabs>

                                {/* ///////// Petit Calendrier ///////// */}
                                <TabPanel key="0" value={tabCalendarValue} index={0} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                    <CalendarScheduler
                                        contacts={allContacts}
                                        displayContactCardToUpdate={displayContactCardToUpdate}
                                        updateContactInContactsAndDB={updateContactInContactsAndDB}
                                    />
                                </TabPanel>

                                {/* ///////// Scheduler Calendrier ///////// */}
                                <TabPanel key="1" value={tabCalendarValue} index={1} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                    <CalendarLittle
                                        contacts={allContacts}
                                        displayContactCardToUpdate={displayContactCardToUpdate}
                                    />
                                </TabPanel>

                                {/* ///////// Grand Calendrier ///////// */}
                                <TabPanel key="2" value={tabCalendarValue} index={2} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                    <CalendarFull
                                        contacts={allContacts}
                                        displayContactCardToUpdate={displayContactCardToUpdate}
                                        updateContactInContactsAndDB={updateContactInContactsAndDB}
                                    />
                                </TabPanel>
                            </TabPanel>

                            {/* ///////// Nouveau CONTACT ///////// */}
                            {/* <Box hidden={tabValue !== 2} width={`calc(100vw - ${TABS_WIDTH}px)`}  > */}
                            <TabPanel key="2" value={tabValue} index={2} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                <Tabs
                                    value={tabNewContactValue}
                                    onChange={(e, newValue) => setTabNewContactValue(newValue)}
                                    aria-label="Horizontal tabs"
                                >
                                    <Tab key={0} label="Recherche INSEE"
                                    />
                                    <Tab key={1} label="Ajout à partir de zéro"
                                    />
                                </Tabs>

                                {/* ///////// Recherche INSEE ///////// */}
                                <TabPanel key="0" value={tabNewContactValue} index={0}  >
                                    <NewContactSearchForm
                                        emptyContact={emptyContact}
                                        addContact={(e) => addContactOnFirebaseAndReload(currentUser.uid, e)}
                                        currentUserId={currentUser.uid}
                                        getPriorityTextAndColor={getPriorityTextAndColor}
                                        setHasContactInfoChanged={setHasContactInfoChanged}
                                    />
                                </TabPanel>

                                {/* ///////// Recherche de ZERO ///////// */}
                                <TabPanel key="1" value={tabNewContactValue} index={1} >
                                    <ContactCard
                                        contact={emptyContact}
                                        currentUserId={currentUser.uid}
                                        getPriorityTextAndColor={getPriorityTextAndColor}
                                        setHasContactInfoChanged={setHasContactInfoChanged}
                                        addContact={(e) => addContactOnFirebaseAndReload(currentUser.uid, e)}
                                    />
                                </TabPanel>
                            </TabPanel>

                            {/* ///////// Un CONTACT ///////// */}
                            {/* <Box hidden={tabValue !== 3} width={`calc(100vw - ${TABS_WIDTH}px)`}  > */}
                            {/* Ici on laisse dans un TAB sinon on a le modal du composant qui s'affiche tout le temps ! */}
                            <TabPanel key="3" value={tabValue} index={3} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                <ContactCard
                                    contact={contactToDisplay}
                                    currentUserId={currentUser.uid}
                                    getPriorityTextAndColor={getPriorityTextAndColor}
                                    setHasContactInfoChanged={setHasContactInfoChanged}
                                    handleDeleteContact={deleteDataOnFirebaseAndReload}
                                    updateContact={updateWholeContactInContactsAndDB}
                                />
                            </TabPanel>

                            {/* /////////////////////// Admin /////////////////////// */}
                            {/* <Box hidden={tabValue !== 4} width={`calc(100vw - ${TABS_WIDTH}px)`}  > */}
                            <TabPanel key="4" value={tabValue} index={4} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                <Admin currentUserId={currentUser.uid} />
                            </TabPanel>

                            {/* /////////////////////// Aide /////////////////////// */}
                            {/* <Box hidden={tabValue !== 5} width={`calc(100vw - ${TABS_WIDTH}px)`}  > */}
                            <TabPanel key="5" value={tabValue} index={5} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                <Help />
                            </TabPanel>

                            {/*  ///////////////////////////////////////////////////////////////////////// */}
                            {/*  ///////////////////////////////////////////////////////////////////////// */}
                            {/* /////////// Tests de moyens pour optimiser les performances :////////////  */}
                            {/*  ///////////////////////////////////////////////////////////////////////// */}
                            {/*  ///////////////////////////////////////////////////////////////////////// */}

                            {/* Utilisation de la virtualisation (chargement de la liste visible et non toute entière => mieux mais je n'arrive pas à utiliser Memo pour les ContactRow => donc les contacts déjà vus se rechargent à chaque fois qu'on revient dessus => (car FixedSizeList est rerender à chaque défilement car la props style change (utilisée pour positionner les éléments dans la liste et change donc à chaque défilement)) */}

                            {/* ///////////////////////////////////////////////////
                                /////////////////////// Test 2 ////////////////////////
                                ///////////////////////////////////////////////////  */}

                            {/* Utilisation de FixedSizeList de react-window mais je n'arrive pas à gérer avec le header (que les cellules soient de la même taille que le body) et de toute façon je vois que toutes les lignes se rerender à chaque scroll ! => Pas d'optimisation de perf !
Aussi je n'arrive pas à gérer l'architecture du tableau car j'ai toujours une erreur :  <tr> cannot appear as a child of <div>.. (FixedSizeList est un div qui doit contenir les lignes : ContactRow, qui lui est un <tr>) => Je mets donc le composant en commentaire */}
                            <Box hidden={tabValue !== 6} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                {/* <ContactsTable2
                                    contacts={filteredContacts}
                                    currentUserId={currentUser ? currentUser.uid : ""}
                                    handleUpdateContact={memoizedUpdateContactInContactsAndDB}
                                    handleDeleteContact={memoizedDeleteDataOnFirebaseAndReload}
                                    displayContactCard={memoizeddisplayContactCardToUpdate}
                                    getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                                /> */}
                            </Box>

                            {/* ///////////////////////////////////////////////////
                                /////////////////////// Test 3 //////////////////////// 
                                ///////////////////////////////////////////////////  */}

                            {/* Test avec VirtualTable qui utilise FixedSizeList (react-window) => Mieux mais pas fluide  */}
                            <Box hidden={tabValue !== 7} width={`calc(100vw - ${TABS_WIDTH}px)`}  >
                                <ContactsTable3
                                    contacts={filteredContacts}
                                    currentUserId={currentUser ? currentUser.uid : ""}
                                    handleUpdateContact={memoizedUpdateContactInContactsAndDB}
                                    handleDeleteContact={memoizedDeleteDataOnFirebaseAndReload}
                                    displayContactCard={memoizeddisplayContactCardToUpdate}
                                    getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                                />
                            </Box>

                            {/* Test 4+5 => pas d'utilisation du composant ContactRow => On va maintenant gèrer le tableau par colonne et non par ligne => utilisation de 'react-virtualized'.
                            => Long à faire car je dois tout regérer + Par contre le tri ne fonctionne plus... Et je ne sais pas comment mettre et pouvoir modifier plusieurs info dans la même cellule (ex: les téléphones, les mails...)
                            Je n'ai pas terminé car je me demande si c'est la peine car chaque modification sur un contact est très long et on a un render à chaque scroll.  */}

                            {/* ///////////////////////////////////////////////////
                                /////////////////////// Test 4 ////////////////////////
                                ///////////////////////////////////////////////////  */}

                            {/* Ici j'ai utilisé des composants mémoïsés  */}
                            <Box hidden={tabValue !== 8} width={`calc(100vw - ${TABS_WIDTH}px)`}  >
                                <ContactsTable4
                                    contacts={filteredContacts}
                                    currentUserId={currentUser ? currentUser.uid : ""}
                                    handleUpdateContact={memoizedUpdateContactInContactsAndDB}
                                    handleDeleteContact={memoizedDeleteDataOnFirebaseAndReload}
                                    displayContactCard={memoizeddisplayContactCardToUpdate}
                                    getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                                />
                            </Box>

                            {/* ///////////////////////////////////////////////////
                                /////////////////////// Test 5 //////////////////////// 
                                ///////////////////////////////////////////////////  */}  

                            {/* Idem mais sans mémoîser les cellules (car j'ai l'impression que ce n'est pas utile...?) */}
                            <Box hidden={tabValue !== 9} width={`calc(100vw - ${TABS_WIDTH}px)`}  >
                                <ContactsTable5
                                    contacts={filteredContacts}
                                    currentUserId={currentUser ? currentUser.uid : ""}
                                    handleUpdateContact={memoizedUpdateContactInContactsAndDB}
                                    handleDeleteContact={memoizedDeleteDataOnFirebaseAndReload}
                                    displayContactCard={memoizeddisplayContactCardToUpdate}
                                    getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                                />
                            </Box>
                        </Box>
                    </Box>
            }
        </Box>
    )
}
