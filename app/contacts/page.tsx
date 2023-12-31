// Authentification aide de : https://www.youtube.com/watch?v=f3Whk3hfd7I&ab_channel=LikeWD
'use client'

import * as React from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import Edit from '@mui/icons-material/Edit';
import LocationOn from '@mui/icons-material/LocationOn';
import { grey } from '@mui/material/colors';
import Image from 'next/image'
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormControl from '@mui/material/FormControl';
import { Container, Tooltip, Paper, Modal } from '@mui/material';
import { TextField, Select, MenuItem, Autocomplete, ListItem, List, InputLabel, Tabs, Tab, Box as CustomBox } from '@mui/material'

import fakeContactsData from '../utils/contactsTest'
import TESTcontactsTest from '../utils/TESTcontactsTest'
import { Fab } from '@mui/material'
import NewContactSearchForm from '../Components/NewContactSearchForm';
import ContactCard from '../Components/ContactCard';
import ContactsTable from '../Components/ContactsTable';
import ContactsTable2 from '../Components/ContactsTable2';
import ContactsTable3 from '../Components/ContactsTable3';
import ContactsTable4 from '../Components/ContactsTable4';
import SignIn from '../Components/auth/SignIn';
import SignUp from '../Components/auth/SignUp';
import AuthDetails from '../Components/AuthDetails';
import SearchContactsForm from '../Components/SearchContactsForm';
import Admin from '../Components/Admin';
import Help from '../Components/Help';
import SearchIcon from '@mui/icons-material/Search';
import { modalStyle } from '../utils/StyledComponents'
import { storage, addFakeDataOnFirebaseAndReload, addFakeDataOnFirebase, addCategoriesOnFirebaseAndReload, addContactOnFirebaseAndReload, deleteAllDatasOnFirebaseAndReload, updatDataOnFirebase, updatDataWholeContactOnFirebase, deleteDataOnFirebaseAndReload, getContactsFromDatabase } from '../utils/firebase'
import { Timestamp } from 'firebase/firestore';
import { addDoc, collection, query, where, getDocs, onSnapshot, QuerySnapshot, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";

import { uid } from 'uid';
import { Dayjs } from 'dayjs';       // npm install dayjs

import { emptyContact } from '../utils/toolbox'

import { useAuthUserContext } from '../context/UseAuthContext'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Fade from '@mui/material';
import Collapse from '@mui/material';

import { unsubscribe } from 'diagnostics_channel';

import { countContactsByAlertDates, updatedContactsInLocalList, updatedContactsInLocalListWithWholeContact } from '../utils/toolbox';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarLittle from '../Components/CalendarLittle';
import CalendarFull from '../Components/CalendarFull';
import CalendarScheduler from '../Components/CalendarScheduler';
import { TabPanel, TABS_WIDTH } from '../utils/StyledComponents';
import CircularProgress from '@mui/material/CircularProgress';
import { getCatIdFromLabel } from '../utils/firebase'
import { useTheme } from '@mui/material/styles';


import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


export default function Contacts() {
    const [allContacts, setAllContacts] = React.useState<Contact[]>([])
    const [filteredContacts, setFilteredContacts] = React.useState<Contact[]>([])
    const [selectedContactId, setSelectedContactId] = React.useState<string>("")

    console.log("selectedContactId", selectedContactId)

    const memoizedSetSelectedContactId = React.useCallback(setSelectedContactId, [])
    const [loading, setLoading] = React.useState(true)
    const [alerts, setAlerts] = React.useState<Alerts>({ nbContactsWithDatePassed: 0, nbContactsWithDateSoon: 0 })
    const [isContactTableFilled, setIsContactTableFilled] = React.useState(0)

    // const [displayNewContactForms, setDisplayNewContactForms] = React.useState(false)
    const [contactToDisplay, setContactToDisplay] = React.useState<Contact>(emptyContact)

    const [messageNoContact, setMessageNoContact] = React.useState("") //Aucun contact pour l'instant, veuillez en ajouter ici :")
    const [hasContactInfoChanged, setHasContactInfoChanged] = React.useState(false)
    const [openWarningModal, setOpenWarningModal] = React.useState(false);


    //console.log("****allContacts", allContacts)

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

    console.log("tabValue", tabValue)

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
        { label: "Liste des contacts3", icon: <Diversity3Icon color="error"  /> },
        { label: "Liste des contacts4", icon: <Diversity3Icon color="error"  /> },
    ]


    const updateContactInContactsAndDB = (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => {
        //console.log("updatingContact", id, keyAndValue)

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
            // default: return { text: "Aucune", color: "black" }
        }
    }
    const memoizedGetPriorityTextAndColor = React.useCallback(getPriorityTextAndColor, [])




    // Créez une référence pour suivre le premier rendu
    const firstRender = React.useRef(true);



    React.useEffect(() => {
        // setAllContacts(TESTcontactsTest);
        // setFilteredContacts(TESTcontactsTest);
        // setAlerts(countContactsByAlertDates(TESTcontactsTest))
        // setLoading(false); 

        currentUser && getContactsFromDatabase(currentUser.uid).then((contactsList) => {
            setAllContacts(contactsList);
            setFilteredContacts(contactsList);
            setAlerts(countContactsByAlertDates(contactsList))
            setLoading(false);
        })
    }, [currentUser])
    // }, [currentUser?.uid])



    const onChangeTabValue = (newValue: number) => {
        setTabValueWithoutSavingInfoChanges(newValue)

        if ([2, 3].includes(tabValue) && hasContactInfoChanged) {
            setOpenWarningModal(true)
            return
        }
        setTabValue(newValue)
    }

    const handleNotSaveContactInfo = () => {
        console.log("********")
        setOpenWarningModal(false)

        setTabValue(tabValueWithoutSavingInfoChanges)

        setHasContactInfoChanged(false)
    }


    // React.useEffect(() => {
    //     // Si c'est le premier rendu, ne faites rien et mettez à jour firstRender pour les rendus suivants

    //     console.log("1111111111111")
    //     if (firstRender) {
    //         firstRender = false;
    //         return;
    //     }

    //     console.log("2222222222222222222")



    //     // Mettez à jour votre variable ici
    //     setIsContactTableFilled(isContactTableFilled + 1);
    // }, [contacts]);


    //   React.useEffect(() => {
    //       // Si c'est le premier rendu, ne faites rien et mettez à jour firstRender pour les rendus suivants
    //       if (firstRender) {
    //           firstRender = false;
    //           return;
    //       }
    //   }, [contacts]);     // 



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
                    // Dans la méthode filter, si une condition est fausse pour un élément spécifique (dans ce cas, un contact), le reste des conditions pour cet élément ne sera pas vérifié.
                    contact.businessName.toLowerCase().includes(contactsSearchCriteria.businessName.toLowerCase())
                    //&& contact.businessCity.toLowerCase().includes(contactsSearchCriteria.businessCity.toLowerCase()

                    // Dans cette condition, si searchIsClient est null, la condition searchIsClient === null || contact.isClient === searchIsClient sera toujours vraie, donc elle n'affectera pas les résultats de la recherche. Si searchIsClient est true ou false, la condition vérifiera si contact.isClient est égal à searchIsClient.
                    && (searchIsClient === null || contact.isClient === searchIsClient)
                    && searchOnCity.some((city) => contact.businessCity.toLowerCase().includes(city.toLowerCase()))
                    && searchOnCategory.some((cat) => contact.businessCategoryId.includes(cat))
                    && searchOnType.some((type) => {
                        return contact.contactType.includes(type)
                    })
                )
            })
            //console.log(searchedContacts)
            setFilteredContacts(searchedContacts)
        } else {
            setFilteredContacts(allContacts)
        }
    }, [contactsSearchCriteria, allContacts])




    return (
        <Box sx={{
            position: "relative",
            //marginTop:0
        }}>
            {/* <Box hidden={tabValue !== 1} >
            <ContactsTable
                contacts={filteredContacts}
                currentUserId={currentUser ? currentUser.uid : ""}
                selectedContactId={selectedContact.id}

                setSelectedContact={memoizedSetSelectedContact}
                handleUpdateContact={memoizedUpdateContactInContactsAndDB}
                handleDeleteContact={memoizedDeleteDataOnFirebaseAndReload}
                displayContactCard={memoizeddisplayContactCardToUpdate}
                getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
            />
            </Box> */}



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
                //position: "absolute", right: "5px", top: 0 
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
                        //border: "solid 3px blue", borderRadius: "10px" 
                    }}>
                        {/* https://www.youtube.com/watch?v=f3Whk3hfd7I&ab_channel=LikeWD */}
                        {/* Connexion */}
                        <SignIn />
                        {/* Inscription */}
                        {/* <UserAuthContextProvider> */}
                        <SignUp />
                        {/* </UserAuthContextProvider> */}
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
                                //variant="scrollable"
                                value={tabValue}
                                onChange={(e, newValue) => onChangeTabValue(newValue)}
                                aria-label="Vertical tabs"
                                sx={{ borderRight: 1, borderColor: 'divider', width: TABS_WIDTH }}
                            >
                                {/* J'ai voulu ajouter un DIVIDER mais pour ça j'ai ajouter une BOX et alors plus poss de cliquer sur les tab => rien ne se passe !!! */}
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
                            {/* Je ne met pas le premier onglet dans un TAB sinon ça rerender à chaque fois qu'on revient dessus ! Même avec useCallback et useMemo !!!??? */}
                            <Box hidden={tabValue !== 0} width={`calc(100vw - ${TABS_WIDTH}px)`}  >
                                <Box width="100%"
                                //flexGrow={1} overflow="auto"
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
                                                et {alerts.nbContactsWithDateSoon} relance(s) à faire dans les 7 jour(s)
                                            </Typography>
                                            {!isSearchCriteriaEmpty && <Fab disabled size="small" color="primary" sx={{
                                                ml: 2
                                            }} >
                                                <SearchIcon />
                                            </Fab>
                                            }
                                        </Typography>
                                        : <Typography variant="h5" color="error.main">
                                            {messageNoContact}
                                            Aucun contact pour l'instant, veuillez en ajouter ici :
                                            <Button variant="contained" color="primary"

                                                onClick={() => { setTabValue(2); setTabNewContactValue(0) }}

                                                sx={{ ml: 2 }}>Nouveau contact</Button>
                                        </Typography>
                                        }
                                    </Box>
                                    <ContactsTable
                                        contacts={filteredContacts}
                                        currentUserId={currentUser ? currentUser.uid : ""}
                                        //selectedContactId={selectedContactId}
                                        //setSelectedContactId={memoizedSetSelectedContactId}
                                        handleUpdateContact={memoizedUpdateContactInContactsAndDB}
                                        handleDeleteContact={memoizedDeleteDataOnFirebaseAndReload}
                                        displayContactCard={memoizeddisplayContactCardToUpdate}
                                        getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                                    />
                                </Box>
                            </Box>
                            {/* <TabPanel
                                key="0"
                                value={tabValue}
                                index={0}
                                width={`calc(100vw - ${TABS_WIDTH}px)`}
                            >
                                <Box display="flex" flexDirection="column" style={{ height: '100vh', }}
                                >
                                    <Box flexGrow={1} overflow="auto"
                                        width="500px"
                                    >
                                        <ContactsTable
                                            contacts={filteredContacts}
                                            currentUserId={currentUser ? currentUser.uid : ""}
                                            selectedContactId={selectedContact.id}

                                            setSelectedContact={memoizedSetSelectedContact}
                                            handleUpdateContact={memoizedUpdateContactInContactsAndDB}
                                            handleDeleteContact={memoizedDeleteDataOnFirebaseAndReload}
                                            displayContactCard={memoizeddisplayContactCardToUpdate}
                                            getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                                        />
                                    </Box>
                                </Box>
                            </TabPanel> */}
                            {/* <ContactsTable
                                            contacts={filteredContacts}
                                            currentUserId={currentUser.uid}
                                            selectedContactId={selectedContact.id}
                                            setSelectedContact={setSelectedContact}
                                            handleUpdateContact={updateContactInContactsAndDB}
                                            handleDeleteContact={deleteDataOnFirebaseAndReload}
                                            displayContactCard={displayContactCardToUpdate}
                                            getPriorityTextAndColor={getPriorityTextAndColor}
                                        /> */}

                            {/* ///////// CALENDRIER ///////// */}
                            <TabPanel key="1" value={tabValue} index={1} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                <Tabs
                                    value={tabCalendarValue}
                                    onChange={(e, newValue: number) => setTabCalendarValue(newValue)}
                                //sx={{ borderRight: 1, borderColor: 'divider', width: "120px" }}
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
                            <TabPanel key="4" value={tabValue} index={4} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                <Admin currentUserId={currentUser.uid} />
                            </TabPanel>

                            {/* /////////////////////// Aide /////////////////////// */}
                            <TabPanel key="5" value={tabValue} index={5} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                <Help />
                            </TabPanel>

                            {/* /////////////////////// 2 /////////////////////// */}
                            <TabPanel key="6" value={tabValue} index={6} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                <ContactsTable2
                                    contacts={filteredContacts}
                                    currentUserId={currentUser ? currentUser.uid : ""}
                                    // selectedContactId={selectedContactId}
                                    // setSelectedContactId={memoizedSetSelectedContactId}
                                    handleUpdateContact={memoizedUpdateContactInContactsAndDB}
                                    handleDeleteContact={memoizedDeleteDataOnFirebaseAndReload}
                                    displayContactCard={memoizeddisplayContactCardToUpdate}
                                    getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                                />
                            </TabPanel>

                            {/* /////////////////////// 3 /////////////////////// */}
                            <TabPanel key="7" value={tabValue} index={7} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                <ContactsTable3
                                    contacts={filteredContacts}
                                    currentUserId={currentUser ? currentUser.uid : ""}
                                    // selectedContactId={selectedContactId}
                                    // setSelectedContactId={memoizedSetSelectedContactId}
                                    handleUpdateContact={memoizedUpdateContactInContactsAndDB}
                                    handleDeleteContact={memoizedDeleteDataOnFirebaseAndReload}
                                    displayContactCard={memoizeddisplayContactCardToUpdate}
                                    getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                                />
                            </TabPanel>

                            {/* /////////////////////// 4 /////////////////////// */}
                            <TabPanel key="8" value={tabValue} index={8} width={`calc(100vw - ${TABS_WIDTH}px)`} >
                                <ContactsTable4
                                    contacts={filteredContacts}
                                    currentUserId={currentUser ? currentUser.uid : ""}
                                    // selectedContactId={selectedContactId}
                                    // setSelectedContactId={memoizedSetSelectedContactId}
                                    handleUpdateContact={memoizedUpdateContactInContactsAndDB}
                                    handleDeleteContact={memoizedDeleteDataOnFirebaseAndReload}
                                    displayContactCard={memoizeddisplayContactCardToUpdate}
                                    getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                                />
                            </TabPanel>
                        </Box>
                    </Box>
            }
        </Box>
    )
}
