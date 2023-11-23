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


import ContactForm from '../Components/ContactForm';
import ContactCard from '../Components/ContactCard';
import ContactsTable from '../Components/ContactsTable';
import SignIn from '../Components/auth/SignIn';
import SignUp from '../Components/auth/SignUp';
import AuthDetails from '../Components/AuthDetails';
import SearchContactsForm from '../Components/SearchContactsForm';
import Calendar from '../Components/Calendar';

import fakeContactsData from '../utils/contacts'
import contactsLaurianeCampings from '../utils/contactsLauriane';
//import getContacts from '../utils/firebase'
//import writeContactData from '../utils/firebase'
//import firebase from 'firebase/app'
//import firebaseConfig from '../utils/firebaseConfig'
import { storage, addFakeDataOnFirebaseAndReload, addContactOnFirebaseAndReload, deleteAllDatasOnFirebaseAndReload, updatDataOnFirebase, updatDataWholeContactOnFirebase, deleteDataOnFirebaseAndReload, getContactsFromDatabase } from '../utils/firebase'
import { Timestamp } from 'firebase/firestore';
import { addDoc, collection, query, where, getDocs, onSnapshot, QuerySnapshot, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

import { uid } from 'uid';
import { Dayjs } from 'dayjs';       // npm install dayjs

import {emptyContact} from '../utils/toolbox'

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


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}





export default function Contacts() {
    const [contacts, setContacts] = React.useState<Contact[]>([])
    const [filteredContacts, setFilteredContacts] = React.useState<Contact[]>([])
    //const [selectedContact, setSelectedContact] = React.useState<Contact | undefined>()   
    const [selectedContact, setSelectedContact] = React.useState<Contact | { id: string }>({ id: "0" })
    const [loading, setLoading] = React.useState(true)
    const [alerts, setAlerts] = React.useState<Alerts>({ nbContactsWithDatePassed: 0, nbContactsWithDateSoon: 0})

    
    const [displayNewContactForms, setDisplayNewContactForms] = React.useState(false)
    const [contactToDisplay, setContactToDisplay] = React.useState<Contact>(emptyContact)
    const [isContactCardDisplay, setIsContactCardDisplay] = React.useState(false)

    console.log(isContactCardDisplay)
    
     const emptySearchCriteria: SearchContactCriteria = {
        businessName: '',
        businessCity: [],
        businessType: []
    }
    const [contactsSearchCriteria, setContactsSearchCriteria] = React.useState<SearchContactCriteria>(emptySearchCriteria)
    //const [contactsSearchCriteria, setContactsSearchCriteria] = React.useState({})
  
    const isSearchCriteriaEmpty = JSON.stringify(contactsSearchCriteria) !== JSON.stringify(emptySearchCriteria)

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

        setIsContactCardDisplay(false)
    }  

    const diplayContactCardToUpdate = (contact: Contact) => {
        setContactToDisplay(contact)
        setIsContactCardDisplay(true)
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
       // console.log("User Effect RECHERCHE")
        
        //if (contactsSearchCriteria && (contactsSearchCriteria?.businessName !== '' || contactsSearchCriteria.businessCity !== '' || contactsSearchCriteria.businessType.length > 0)) {      // metre diff de empty !!!!!!!!!!
        if (JSON.stringify(contactsSearchCriteria) !== JSON.stringify(emptySearchCriteria)) {        
            const searchOnCity = contactsSearchCriteria.businessCity.length > 0 ? contactsSearchCriteria.businessCity : ['']
            const searchOnType = contactsSearchCriteria.businessType.length > 0 ? contactsSearchCriteria.businessType : ['']

            const searchedContacts: Contact[] = contacts.filter((contact) => {
                return (
                    contact.businessName.toLowerCase().includes(contactsSearchCriteria.businessName.toLowerCase()) 
                    //&& contact.businessCity.toLowerCase().includes(contactsSearchCriteria.businessCity.toLowerCase()

                    // SOME() => au moins une des valeurs du tableau doit être vraie
                    && searchOnCity.some((city) => contact.businessCity.toLowerCase().includes(city.toLowerCase()))       // toLowerCase ???
                    && searchOnType.some((type) => contact.businessType.toLowerCase().includes(type.toLowerCase()))
                        // {
                        //     console.log(type)
                        //     console.log(contact.businessType)
                        //     return contact.businessType.toLowerCase().includes(type.toLowerCase())
                        // }
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




    const storageRef = ref(storage);
    //console.log(storageRef)



    return (
        <Box sx={{ position:"relative", 
        //marginTop:"2em"
         }}>
        {/* <React.Fragment sx={{ position:"absolute" }}> */} 

            {/* /////////////////////// ContactCart /////////////////////// */}
            {isContactCardDisplay  && <ContactCard contact={contactToDisplay} 
            //updateContact={setContactToDisplay} 
            updateContact={updateWholeContactInContactsAndDB}
            // updateContact={() => {console.log("updateContact")}} 
            contactCardDisplayStatus={isContactCardDisplay} setContactCardDisplayStatus={setIsContactCardDisplay} />  }
           


            {/* <Image */}
            <Typography variant="h3" component="h1" sx={{ 
                //margin:"50px" 
            }} >Application de gestion de contacts</Typography>

            {/* /////////////////////// Info USER /////////////////////// */}
            <Box sx={{ position:"absolute", right:0, top:0  }} ><AuthDetails /></Box>            
            {/* On affiche le nom de l'utilisateur */}
            {/* <Typography variant="h3" component="div" gutterBottom>User Auth = {currentUser?.email}</Typography> */}

            {loading
            ? <Container>Chargement...</Container>
            : currentUser
                ? <Box sx={{ marginTop:"20px" }} >
                    
                    {/* /////////////////////// Pour Version ESSAI /////////////////////// */}
                    <Box sx={{ display: "flex", justifyContent: "space-around", padding: "10px", border: "solid 3px blue", borderRadius: "10px" }}>
                        <Typography component="div" style={{ display: "block", width: "500px" }} >Version TEST : Ajouter contacts TEST ou TOUT supprimer : </Typography>
                        <Button variant="contained" color='ochre' onClick={() => addFakeDataOnFirebaseAndReload(currentUser, fakeContactsData)}>Ajouter Contacts Test</Button>
                        <Button variant="contained" color='secondary' onClick={() => addFakeDataOnFirebaseAndReload(currentUser, contactsLaurianeCampings)}>Ajouter Contacts Camping</Button>
                        <Button variant="contained" color='primary' sx={{ width:"300px" }} onClick={() => deleteAllDatasOnFirebaseAndReload(currentUser)}>Supprimer tout mes contacts</Button>
                        {/* <Button variant="contained" color='warning' onClick={() => deleteAllDatasOnFirebaseAndReload()}>Supprimer toutes les données !!!</Button> */}
                    </Box>

                    {/* /////////////////////// Pour REALTIME DB /////////////////////// */}
                    {/* <input type="text" value={todo} onChange={handleTodoChange} />
                    <Button variant="contained" onClick={writeContactData2}>Ajouter dans REALTIME DB</Button> */}

                    {/* /////////////////////// Pour faire des ONGLETS /////////////////////// */}
                    {/* Impossible mettre ce qu'on veut dans les TAB car => ERROR => app-index.js:31 Warning: validateDOMNesting(...): <p> cannot appear as a descendant of <p>.*/}
                    {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Item One" {...a11yProps(0)} />
                            <Tab label="Item Two" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <FormControl sx={{ my: 2 }}>
                            <TextField id="outlined-basic" label="Nom de l'entreprise à ajouter aux contacts" variant="outlined" value="coucou" />
                        </FormControl>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <FormControl sx={{ my: 2 }}>
                            <TextField id="outlined-basic" label="Nom de l'entreprise à ajouter aux contacts" variant="outlined" value="coucou2" />
                        </FormControl>
                    </CustomTabPanel> */}


                    {/* /////////////////////// On affiche les FORMULAIRES DE CREATION CONTACTS -ou- LA RECHERCHE + LISTE DE CONTACTS /////////////////////// */}
                    {displayNewContactForms
                    ? <Box>              
                        <Accordion sx={{
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
                                <ContactForm emptyContact={emptyContact} addContact={(e) => addContactOnFirebaseAndReload (currentUser, e)} />
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
                                <ContactCard addContact={(e) => addContactOnFirebaseAndReload (currentUser, e)} contact={emptyContact} />
                            </AccordionDetails>
                        </Accordion>
                        <Button variant="contained" color="secondary" onClick={() => setDisplayNewContactForms(!displayNewContactForms)}>Tableau des contacts</Button>
                    </Box>

                    : <Box sx={{ marginTop:"2em", position:"relative"}} >
                    
                         {/* ///////// CALENDRIER ///////// */}
                         <Accordion sx={{ bgcolor: 'ochre.dark', //width:"80%", margin:"auto",
                            //my: 2
                        }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header" >
                                    Calendrier (cliquer pour ouvrir et pour fermer)
                                {/* <Typography  //color="secondary.light"
                                    sx={{ p: 2, borderRadius: 1 }} >Recherche (cliquer pour ouvrir et pour fermer)</Typography> */}
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
                                      />
                                </Paper>
                            </AccordionDetails>
                        </Accordion>
                       
                       {/* ///////// RECHERCHE DE CONTACTS ///////// */}
                        <Accordion sx={{ bgcolor: 'primary.light', //width:"80%", margin:"auto",
                            //my: 2
                        }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header" >
                                    Recherche (cliquer pour ouvrir et pour fermer)
                                {/* <Typography  //color="secondary.light"
                                    sx={{ p: 2, borderRadius: 1 }} >Recherche (cliquer pour ouvrir et pour fermer)</Typography> */}
                            </AccordionSummary>
                            <AccordionDetails>
                                <Paper sx={{ 
                                    //margin: "2em", 
                                    padding: "1em", 
                                    bgcolor: 'lightCyan.light',
                                    //position: "relative" 
                                    }}
                                >
                                    <SearchContactsForm onSearchChange={setContactsSearchCriteria} emptySearchCriteria = {emptySearchCriteria} />                                   
                                    {/* <Typography variant="h5" component="div" sx={{ p: 2 }}>{filteredContacts.length} contacts trouvés (sur {contacts.length})</Typography> */}
                                </Paper>
                            </AccordionDetails>
                        </Accordion>

                       

                        {/* /////////////////////// Pour EFFETS ????? /////////////////////// */}
                        {/* <Fade component="p" in={!displayNewContactForms}>
                            <Typography variant="h5" component="div" sx={{ p: 2 }}>Vous avez ({contacts.length}) contacts</Typography>
                        </Fade>
                        <Collapse orientation="horizontal" in={!displayNewContactForms}>
                            <Typography variant="h5" component="div" sx={{ p: 2 }}>Vous avez ({contacts.length}) contacts</Typography>
                        </Collapse> */}                       

                        <Box sx={{ 
                            marginTop:"20px", 
                            position:"relative"}} >
                            <Box sx={{ display:"flex", alignItems:"center", marginBottom:"10px", }}>
                                <Typography variant="h5">
                                    {isSearchCriteriaEmpty
                                        ? `Recherche : ${filteredContacts.length} contacts trouvé(s) (sur ${contacts.length})`
                                        : `${contacts.length} contacts : `
                                    }
                                </Typography>
                                <Typography color="warning.main"  sx={{ px: 2 }}>
                                    {alerts.nbContactsWithDatePassed} relance(s) passée(s)
                                </Typography>
                                <Typography color="primary.main">
                                    et {alerts.nbContactsWithDateSoon} relance(s) à faire dans les 7 jour(s)
                                </Typography>
                            </Box>
                            
                            <Box sx={{ position:"absolute", right:0, top:0  }} >
                                <Tooltip title="Ajouter un contact (avec ou sans recherche)" placement="left">
                                    <IconButton aria-label="edit" color="primary" 
                                        onClick={() => setDisplayNewContactForms(!displayNewContactForms)}
                                        //onClick={diplayContactCardNew}
                                    >
                                        {/* <Typography>A voir quel icon on garde : </Typography>
                                        <PersonAddRoundedIcon fontSize="large" />                             
                                        <PersonSearchRoundedIcon fontSize="large" />
                                        <AddIcon fontSize="large" /> */}
                                        <Typography>Nouveau contact</Typography>
                                        <AddCircleOutlineIcon fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            {/* ///////// LISTE DE CONTACTS (avec ou sans recherche) ///////// */}
                            <ContactsTable
                                //contacts={contacts}
                                contacts={filteredContacts}
                                selectedContactId={selectedContact.id}
                                setSelectedContact={setSelectedContact}
                                handleUpdateContact={updateContactInContactsAndDB}
                                handleDeleteContact={deleteDataOnFirebaseAndReload}
                                diplayContactCard={diplayContactCardToUpdate}
                            //setContacts={setContacts}
                            //orderedBy={orderedBy} 
                            />
                            {/* <TestTableSortLabel2 contacts={contacts} selectedContactId={selectedContact.id} setSelectedContact={setSelectedContact} handleUpdateContact={updateContactInContactsAndDB} handleDeleteContact={deleteContact} /> */}
                        </Box>
                    </Box>
                    }
                </Box>

                : <Box sx={{ display: "flex", justifyContent: "space-around", margin: "20px", padding: "20px", 
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
            }

        </Box>
    )
}
