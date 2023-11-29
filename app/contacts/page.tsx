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
import { Container, Tooltip, Paper } from '@mui/material';
import { TextField, Select, MenuItem, Autocomplete, ListItem, List, InputLabel, Tabs, Tab, Box as CustomBox } from '@mui/material'


import NewContactSearchForm from '../Components/NewContactSearchForm';
import ContactCard from '../Components/ContactCard';
import ContactsTable from '../Components/ContactsTable';
import SignIn from '../Components/auth/SignIn';
import SignUp from '../Components/auth/SignUp';
import AuthDetails from '../Components/AuthDetails';
import SearchContactsForm from '../Components/SearchContactsForm';
import Calendar from '../Components/Calendar';
import Admin from '../Components/Admin';

import fakeContactsData from '../utils/contactsTest'
import contactsLaurianeCampings from '../utils/contactsLauriane';
import contactsLaurianeCampings_x10 from '../utils/contactsLauriane x10';
//import getContacts from '../utils/firebase'
//import writeContactData from '../utils/firebase'
//import firebase from 'firebase/app'
//import firebaseConfig from '../utils/firebaseConfig'
import { storage, addFakeDataOnFirebaseAndReload, addContactOnFirebaseAndReload, deleteAllDatasOnFirebaseAndReload, updatDataOnFirebase, updatDataWholeContactOnFirebase, deleteDataOnFirebaseAndReload, getContactsFromDatabase } from '../utils/firebase'
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

import Fade from '@mui/material';
import Collapse from '@mui/material';

import { unsubscribe } from 'diagnostics_channel';

import { countContactsByAlertDates, updatedContactsInLocalList, updatedContactsInLocalListWithWholeContact } from '../utils/toolbox';
import { MuiFileInput } from 'mui-file-input';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{ width: "calc(100vw - 120px)" }}
            {...other}
        >
            {value === index && (
                <Box
                // sx={{ p: 3 }}
                >
                    <Typography component={"div"}
                    >{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}



export default function Contacts() {
    const [contacts, setContacts] = React.useState<Contact[]>([])
    const [filteredContacts, setFilteredContacts] = React.useState<Contact[]>([])
    //const [selectedContact, setSelectedContact] = React.useState<Contact | undefined>()   
    const [selectedContact, setSelectedContact] = React.useState<Contact | { id: string }>({ id: "0" })
    const [loading, setLoading] = React.useState(true)
    const [alerts, setAlerts] = React.useState<Alerts>({ nbContactsWithDatePassed: 0, nbContactsWithDateSoon: 0 })


    const [displayNewContactForms, setDisplayNewContactForms] = React.useState(false)
    const [contactToDisplay, setContactToDisplay] = React.useState<Contact>(emptyContact)
    const [isContactCardDisplay, setIsContactCardDisplay] = React.useState(false)

   // console.log(isContactCardDisplay)

    const emptySearchCriteria: SearchContactCriteria = {
        isClient: "all",
        contactType: [],
        businessName: '',
        businessCity: [],
        businessCategory: []
    }
    const [contactsSearchCriteria, setContactsSearchCriteria] = React.useState<SearchContactCriteria>(emptySearchCriteria)
    //const [contactsSearchCriteria, setContactsSearchCriteria] = React.useState({})

    const isSearchCriteriaEmpty = JSON.stringify(contactsSearchCriteria) !== JSON.stringify(emptySearchCriteria)

    const [tabValue, setTabValue] = React.useState(0);
    const [tabNewContactValue, setTabNewContactValue] = React.useState(0);
                                    

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    const handleChangeTabNewContact = (event: React.SyntheticEvent, newValue: number) => {
        setTabNewContactValue(newValue);
    };

    const titles = [
        { label: "Contacts", icon: <Diversity3Icon /> },
        { label: "Calendrier", icon: <CalendarMonthIcon /> },
        { label: "Nouveau", icon: <PersonAddIcon /> },
        { label: "Contact", icon: <PersonIcon /> },
        // { label: "Admin", icon: <SettingsIcon /> },
    ]
   

    //console.log("PAGE Contacts",contacts)
    //console.log(selectedContact)
    //console.log("contacts", contacts)
    //console.log("filteredContacts", filteredContacts)
    //console.log(contactsSearchCriteria)

    const { currentUser } = useAuthUserContext()
    // console.log(currentUser)
    // console.log(currentUser?.uid)


    //const updateContactInContactsAndDB = (updatingContact: Contact) => {     // ou selectedContact
    const updateContactInContactsAndDB = (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => {
        console.log("updatingContact", id, keyAndValue)

        setContacts(updatedContactsInLocalList(contacts, id, keyAndValue))
        setFilteredContacts(updatedContactsInLocalList(filteredContacts, id, keyAndValue))
        updatDataOnFirebase(id, keyAndValue)
    }

    const updateWholeContactInContactsAndDB = (contactToUpdate: Contact) => {
        setContacts(updatedContactsInLocalListWithWholeContact(contacts, contactToUpdate))
        setFilteredContacts(updatedContactsInLocalListWithWholeContact(contacts, contactToUpdate))
        updatDataWholeContactOnFirebase(contactToUpdate)

        setTabValue(0)
        setContactToDisplay(emptyContact)
        //setIsContactCardDisplay(false)
    }

    const diplayContactCardToUpdate = (contact: Contact) => {
        setContactToDisplay(contact)
        setIsContactCardDisplay(true)
        setTabValue(3)
    }
    const diplayContactCardNew = () => {
        setContactToDisplay(emptyContact)
        setIsContactCardDisplay(true)
    }


    React.useEffect(() => {
        //console.log("User Effect READ")

        getContactsFromDatabase(currentUser).then((contactsList) => {
            setContacts(contactsList);
            setFilteredContacts(contactsList);
            setAlerts(countContactsByAlertDates(contactsList))
            setLoading(false);
        });

    }, [currentUser])
    // }, [currentUser?.uid])


    React.useEffect(() => {
        setAlerts(countContactsByAlertDates(filteredContacts))
    }, [filteredContacts])


    React.useEffect(() => {
        console.log("User Effect RECHERCHE")
        console.log(contactsSearchCriteria)

        //if (contactsSearchCriteria && (contactsSearchCriteria?.businessName !== '' || contactsSearchCriteria.businessCity !== '' || contactsSearchCriteria.businessCategory.length > 0)) {      // metre diff de empty !!!!!!!!!!
        if (JSON.stringify(contactsSearchCriteria) !== JSON.stringify(emptySearchCriteria)) {
            //const searchIsClient = switch (contactsSearchCriteria.isClient)

            // let searchIsClient: string
            // switch (contactsSearchCriteria.isClient) {
            //     case true:
            //         searchIsClient = 'Client';
            //         break;
            //     case false:
            //         searchIsClient = 'Non client';
            //         break;
            //     default:
            //         searchIsClient = 'Indéterminé';
            // }

            const searchIsClient = contactsSearchCriteria.isClient === "yes" ? true : contactsSearchCriteria.isClient === "no" ? false : null
            const searchOnCity = contactsSearchCriteria.businessCity.length > 0 ? contactsSearchCriteria.businessCity : ['']
            const searchOnCategory = contactsSearchCriteria.businessCategory.length > 0 ? contactsSearchCriteria.businessCategory : ['']
            const searchOnType = contactsSearchCriteria.contactType.length > 0 ? contactsSearchCriteria.contactType : ['']


            //console.log(searchOnCategory)

            const searchedContacts: Contact[] = contacts.filter((contact) => {
               
                return (
                    // Dans la méthode filter, si une condition est fausse pour un élément spécifique (dans ce cas, un contact), le reste des conditions pour cet élément ne sera pas vérifié.
                    contact.businessName.toLowerCase().includes(contactsSearchCriteria.businessName.toLowerCase())
                    //&& contact.businessCity.toLowerCase().includes(contactsSearchCriteria.businessCity.toLowerCase()

                    // Dans cette condition, si searchIsClient est null, la condition searchIsClient === null || contact.isClient === searchIsClient sera toujours vraie, donc elle n'affectera pas les résultats de la recherche. Si searchIsClient est true ou false, la condition vérifiera si contact.isClient est égal à searchIsClient.
                    && (searchIsClient === null || contact.isClient === searchIsClient)

                    // SOME() => au moins une des valeurs du tableau doit être vraie                    
                    // && searchOnCity.some((city) => {
                    //     console.log(city)
                    //     console.log(contact.businessCity)
                    //     console.log(contact.businessCity.toLowerCase().includes(city.toLowerCase()))
                    //     return contact.businessCity.toLowerCase().includes(city.toLowerCase())
                    // })         // On met INCLUDES et non === pour gérer le cas où  searchOnCity = [""]   
                    && searchOnCity.some((city) => contact.businessCity.toLowerCase().includes(city.toLowerCase()))         // On met INCLUDES et non === pour gérer le cas où searchOnCity = [""]   

                    && searchOnCategory.some((cat) => contact.businessCategory.includes(cat)) 
                    // && searchOnCategory.some((cat) =>{ 
                    //     console.log("cat", cat)
                    //     console.log(contact.businessCategory)
                    //     console.log(contact.businessCategory === cat)
                    //     return contact.businessCategory.includes(cat) 
                    // }) 


                    && searchOnType.some((type) => {
                        console.log("type", type)
                        console.log(contact.contactType)
                        console.log(contact.contactType.includes(type))
                        return contact.contactType.includes(type)
                    })
                )
            })
            console.log(searchedContacts)
            setFilteredContacts(searchedContacts)
        } else {
            setFilteredContacts(contacts)
        }
    }, [
        //emptySearchCriteria,      // Boucle infinie !!! Pourquoi ??? Pourtant sa valeur ne change jamais... 
        contactsSearchCriteria,
        //contacts  
    ])      // !!!!!!!!!!!!!!! laisser contact ? car si modif ça peut disparaitre !!!!!! NON on ne veut pas ! + boucle infinie !!!

    // React.useEffect(() => {

    //     console.log("USE EFFECT contactToDisplay")
    //     let newContacts: Contact[] = contacts.map(contact => {
    //         return contact.id === contactToDisplay.id ? contactToDisplay : contact
    //     })
    //     setContacts(newContacts)
    // }, [contactToDisplay])





    const [file, setFile] = React.useState<Blob | Uint8Array | ArrayBuffer | null>(null);

    const storageRef = ref(storage);
    // //console.log(storageRef)
    const guadeloupeRef = ref(storage, 'guadeloupe.jpg');

    // uploadBytes(guadeloupeRef, file).then((snapshot) => {
    //     console.log('Uploaded a blob or file!');
    // });

   


    return (
        <Box sx={{
            position: "relative",
            //marginTop:"2em"
        }}>

           

            {/* <MuiFileInput
                    value={file}
                    //multiple={true}
                    onChange={(file) => setFile(file)}
                //onChange={handleChangeFile} 
            /> */}
            {/* <Image src={guadeloupeRef} alt="Guadeloupe" layout="fill" objectFit="cover" quality={100} /> */}

            {/* <React.Fragment sx={{ position:"absolute" }}> */}

            {/* /////////////////////// ContactCart /////////////////////// */}
            {/* {isContactCardDisplay && <ContactCard contact={contactToDisplay}
                //updateContact={setContactToDisplay} 
                updateContact={updateWholeContactInContactsAndDB}
                // updateContact={() => {console.log("updateContact")}} 
                contactCardDisplayStatus={isContactCardDisplay} setContactCardDisplayStatus={setIsContactCardDisplay} />} */}



            {/* <Typography variant="h3" component="h1" sx={{
                //margin:"50px"
                marginLeft:"20px" 
            }} >Application de gestion de contacts</Typography> */}

            {/* /////////////////////// Info USER /////////////////////// */}
            <Box sx={{ position: "absolute", right: "5px", top: 0 }} ><AuthDetails /></Box>
            {/* On affiche le nom de l'utilisateur */}
            {/* <Typography variant="h3" component="div" gutterBottom>User Auth = {currentUser?.email}</Typography> */}

            {loading
                ? <Container>Chargement...</Container>
                : !currentUser
                    //  {/* ///////// CONNEXION / INSCRIPTION ///////// */}
                    ? <Box sx={{
                        display: "flex", justifyContent: "space-around", margin: "20px", padding: "20px",
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
                    
                    : <Box sx={{ marginTop: "20px" }} >

                        {/* /////////////////////// Pour Version ESSAI /////////////////////// */}
                        <Box sx={{ display: "flex", justifyContent: "space-around", padding: "10px", border: "solid 3px blue", borderRadius: "10px", marginBottom:"10px", width:"calc(100vw - 200px)" }}>
                            <Typography component="div" style={{ display: "block", 
                            //width: "360px" 
                            }} >Pour Version TEST : </Typography>
                            <Button variant="contained" color='ochre' onClick={() => addFakeDataOnFirebaseAndReload(currentUser, fakeContactsData)}>Ajouter Contacts Test</Button>
                            <Button variant="contained" color='primary' onClick={() => addFakeDataOnFirebaseAndReload(currentUser, contactsLaurianeCampings_x10)}>Ajouter Contacts Camping x10</Button>
                            <Button variant="contained" color='pink' onClick={() => addFakeDataOnFirebaseAndReload(currentUser, contactsLaurianeCampings)}>Ajouter Contacts Camping (tous : x57)</Button>
                            <Button variant="contained" color='error' sx={{ width: "300px" }} onClick={() => deleteAllDatasOnFirebaseAndReload(currentUser)}>Supprimer tous mes contacts</Button>
                            {/* <Button variant="contained" color='warning' onClick={() => deleteAllDatasOnFirebaseAndReload()}>Supprimer toutes les données !!!</Button> */}
                        </Box>

                        {/* /////////////////////// Pour REALTIME DB /////////////////////// */}
                        {/* <input type="text" value={todo} onChange={handleTodoChange} />
                    <Button variant="contained" onClick={writeContactData2}>Ajouter dans REALTIME DB</Button> */}

    {/* ///////////////////////ONGLETS- Tabs /////////////////////// */}
                        <Box
                            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100vh'
                        }}
                        >
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={tabValue}
                                onChange={handleChange}
                                aria-label="Vertical tabs"
                                sx={{ borderRight: 1, borderColor: 'divider', width: "120px" }}
                            >
                                {titles.map((title, index) => (
                                    <Tab key={index} label={title.label} icon={title.icon} {...a11yProps(index)} />
                                ))}                                
                            </Tabs>

                            {/* ///////// LISTE DE CONTACTS + recherche) ///////// */}
                            <TabPanel key="0" value={tabValue} index={0}  >
                                <Box sx={{ display: "flex", alignItems: "center", margin: "25px", }}>
                                    <Typography variant="h5">
                                        {isSearchCriteriaEmpty
                                            ? `Recherche : ${filteredContacts.length} contacts trouvé(s) (sur ${contacts.length})`
                                            : `${contacts.length} contacts : `
                                        }
                                    </Typography>
                                    <Typography color="warning.main" sx={{ px: 2 }}>
                                        {alerts.nbContactsWithDatePassed} relance(s) passée(s)
                                    </Typography>
                                    <Typography color="primary.main">
                                        et {alerts.nbContactsWithDateSoon} relance(s) à faire dans les 7 jour(s)
                                    </Typography>
                                </Box>
                                <SearchContactsForm onSearchChange={setContactsSearchCriteria} emptySearchCriteria={emptySearchCriteria} contacts={contacts} />

                                <ContactsTable
                                    //contacts={contacts}
                                    contacts={filteredContacts}
                                    selectedContactId={selectedContact.id}
                                    setSelectedContact={setSelectedContact}
                                    handleUpdateContact={updateContactInContactsAndDB}
                                    handleDeleteContact={deleteDataOnFirebaseAndReload}
                                    diplayContactCard={diplayContactCardToUpdate}
                                />
                            </TabPanel>

                            {/* ///////// CALENDRIER ///////// */}
                            <TabPanel key="1" value={tabValue} index={1}>
                                <Calendar
                                    //contacts={fakeContactsData}
                                    //contacts={filteredContacts}   // ????????? 
                                    contacts={contacts}
                                    diplayContactCardToUpdate={diplayContactCardToUpdate}
                                />
                            </TabPanel>

                            {/* ///////// RECHERCHE DE CONTACTS ///////// */}
                            <TabPanel key="2" value={tabValue} index={2}>
                                <Tabs
                                    //orientation="vertical"
                                    // variant="scrollable"
                                    value={tabNewContactValue}
                                    onChange={handleChangeTabNewContact}
                                    aria-label="Horizontal tabs"
                                    //sx={{ borderRight: 1, borderColor: 'divider', width: "120px" }}
                                >

                                    <Tab key={0} label="Recherche INSEE"
                                    //icon={title.icon}
                                    // {...a11yProps(index)} 
                                    />
                                    <Tab key={1} label="Recherche de zéro"
                                    //icon={title.icon}
                                    // {...a11yProps(index)} 
                                    />
                                </Tabs>

                                {/* ///////// Recherche INSEE ///////// */}
                                <TabPanel key="0" value={tabNewContactValue} index={0}  >
                                    <NewContactSearchForm emptyContact={emptyContact} addContact={(e) => addContactOnFirebaseAndReload(currentUser, e)} />
                                </TabPanel>

                                {/* ///////// Recherche de ZERO ///////// */}
                                <TabPanel key="1" value={tabNewContactValue} index={1}  >
                                    <ContactCard addContact={(e) => addContactOnFirebaseAndReload(currentUser, e)} contact={emptyContact} />
                                </TabPanel>
                            </TabPanel>

                            {/* ///////// Un CONTACT ///////// */}
                            <TabPanel key="3" value={tabValue} index={3}>
                                <ContactCard contact={contactToDisplay}
                                    //updateContact={setContactToDisplay} 
                                    updateContact={updateWholeContactInContactsAndDB}
                                    // updateContact={() => {console.log("updateContact")}} 
                                    //contactCardDisplayStatus={isContactCardDisplay} 
                                    //setContactCardDisplayStatus={setIsContactCardDisplay} 
                                />
                            </TabPanel>
    
                            {/* ///////// ADMIN ///////// */}
                            {/* <TabPanel key="4" value={tabValue} index={4}>
                                <Admin />
                                <Typography variant="h5" component="div" sx={{ p: 2 }}>ADMIN</Typography>
                                <Typography variant="h5" component="div" sx={{ p: 2 }}>{currentUser.displayName}</Typography>
                                <Typography variant="h5" component="div" sx={{ p: 2 }}>{currentUser.email}</Typography>                               
                            </TabPanel> */}
                        </Box>


                        {/* /////////////////////// On affiche les FORMULAIRES DE CREATION CONTACTS -ou- LA RECHERCHE + LISTE DE CONTACTS /////////////////////// */}
                        {displayNewContactForms
                            ? <Box>
                                {/* <Accordion sx={{
                                    //my: 2
                                }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header" >
                                        <Typography
                                            color="secondary.light"
                                            sx={{ bgcolor: 'primary.main', p: 2, borderRadius: 1 }}
                                        >Nouveau Contact avec recherche (cliquer pour ouvrir et pour fermer)</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ContactForm emptyContact={emptyContact} addContact={(e) => addContactOnFirebaseAndReload(currentUser, e)} />
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion sx={{ my: 2 }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header" >
                                        <Typography
                                            color="secondary.light"
                                            sx={{ bgcolor: 'primary.main', p: 2, borderRadius: 1 }}
                                        >Nouveau Contact en partant de zéro (cliquer pour ouvrir et pour fermer)</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ContactCard addContact={(e) => addContactOnFirebaseAndReload(currentUser, e)} contact={emptyContact} />
                                    </AccordionDetails>
                                </Accordion>
                                <Button variant="contained" color="secondary" onClick={() => setDisplayNewContactForms(!displayNewContactForms)}>Tableau des contacts</Button> */}
                            </Box>

                            : <Box sx={{ marginTop: "2em", position: "relative" }} >

                                {/* ///////// CALENDRIER ///////// */}
                                {/* <Accordion sx={{
                                    bgcolor: 'ochre.dark', //width:"80%", margin:"auto",
                                    //my: 2
                                }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header" >
                                        Calendrier (cliquer pour ouvrir et pour fermer)
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Paper sx={{
                                            //margin: "2em", 
                                            padding: "1em",
                                            bgcolor: 'ochre.light',
                                            //position: "relative" 
                                        }}
                                        >
                                            <Calendar
                                                //contacts={fakeContactsData}
                                                //contacts={filteredContacts}   // ????????? 
                                                contacts={contacts}
                                                diplayContactCardToUpdate={diplayContactCardToUpdate}
                                            />
                                        </Paper>
                                    </AccordionDetails>
                                </Accordion> */}

                                {/* ///////// RECHERCHE DE CONTACTS ///////// */}
                                {/* <Accordion sx={{
                                    bgcolor: 'primary.light', //width:"80%", margin:"auto",
                                    //my: 2
                                }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header" >
                                        Recherche (cliquer pour ouvrir et pour fermer)
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Paper sx={{
                                            //margin: "2em", 
                                            padding: "1em",
                                            bgcolor: 'lightCyan.light',
                                            //position: "relative" 
                                        }}
                                        >
                                            <SearchContactsForm onSearchChange={setContactsSearchCriteria} emptySearchCriteria={emptySearchCriteria} contacts={contacts} />
                                        </Paper>
                                    </AccordionDetails>
                                </Accordion> */}



                                {/* /////////////////////// Pour EFFETS ????? /////////////////////// */}
                                {/* <Fade component="p" in={!displayNewContactForms}>
                            <Typography variant="h5" component="div" sx={{ p: 2 }}>Vous avez ({contacts.length}) contacts</Typography>
                        </Fade>
                        <Collapse orientation="horizontal" in={!displayNewContactForms}>
                            <Typography variant="h5" component="div" sx={{ p: 2 }}>Vous avez ({contacts.length}) contacts</Typography>
                        </Collapse> */}

                                <Box sx={{
                                    marginTop: "20px",
                                    position: "relative"
                                }} >
                                    

                                    {/* <Box sx={{ position: "absolute", right: 0, top: 0 }} >
                                        <Tooltip title="Ajouter un contact (avec ou sans recherche)" placement="left">
                                            <IconButton aria-label="edit" color="primary"
                                                onClick={() => setDisplayNewContactForms(!displayNewContactForms)}
                                            //onClick={diplayContactCardNew}
                                            >
                                                <Typography>A voir quel icon on garde : </Typography>
                                        <PersonAddRoundedIcon fontSize="large" />                             
                                        <PersonSearchRoundedIcon fontSize="large" />
                                        <AddIcon fontSize="large" />
                                                <Typography>Nouveau contact</Typography>
                                                <AddCircleOutlineIcon fontSize="large" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box> */}

                                    {/* ///////// LISTE DE CONTACTS (avec ou sans recherche) ///////// */}
                                    {/* <ContactsTable
                                        //contacts={contacts}
                                        contacts={filteredContacts}
                                        selectedContactId={selectedContact.id}
                                        setSelectedContact={setSelectedContact}
                                        handleUpdateContact={updateContactInContactsAndDB}
                                        handleDeleteContact={deleteDataOnFirebaseAndReload}
                                        diplayContactCard={diplayContactCardToUpdate}
                                    //setContacts={setContacts}
                                    //orderedBy={orderedBy} 
                                    /> */}
                                    {/* <TestTableSortLabel2 contacts={contacts} selectedContactId={selectedContact.id} setSelectedContact={setSelectedContact} handleUpdateContact={updateContactInContactsAndDB} handleDeleteContact={deleteContact} /> */}
                                </Box>
                            </Box>
                        }
                    </Box>

                   
            }

        </Box>
    )
}
