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
import { Container, Tooltip } from '@mui/material';
import { TextField, Select, MenuItem, Autocomplete, ListItem, List, InputLabel, Tabs, Tab, Box as CustomBox } from '@mui/material'


import ContactForm from '../Components/ContactForm';
import ContactCard from '../Components/ContactCard';
import ContactsTable from '../Components/ContactsTable';
import SignIn from '../Components/auth/SignIn';
import SignUp from '../Components/auth/SignUp';
import AuthDetails from '../Components/AuthDetails';
import FilterContacts from '../Components/FilterContacts';

import fakeContactsData from '../utils/contacts'
//import getContacts from '../utils/firebase'
//import writeContactData from '../utils/firebase'
//import firebase from 'firebase/app'
//import firebaseConfig from '../utils/firebaseConfig'
import { storage, readDataFromFirebaseAndSetContact, addFakeDataOnFirebaseAndReload, addContactOnFirebaseAndReload, deleteAllDatasOnFirebaseAndReload, updatDataOnFirebase, deleteDataOnFirebaseAndReload } from '../utils/firebase'
import { Timestamp } from 'firebase/firestore';
import { addDoc, collection, query, where, getDocs, onSnapshot, QuerySnapshot, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

import { uid } from 'uid';
import { Dayjs } from 'dayjs';       // npm install dayjs
import TestTableSortLabel2 from '../Components/TestComponents/TestTableSortLabel2';

import { useAuthUserContext } from '../context/UseAuthContext'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import Fade from '@mui/material';
import Collapse from '@mui/material';

import { unsubscribe } from 'diagnostics_channel';



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
    //const [selectedContact, setSelectedContact] = React.useState<Contact | undefined>()   
    const [selectedContact, setSelectedContact] = React.useState<Contact | { id: string }>({ id: "0" })
    const [loading, setLoading] = React.useState(true)

    //console.log("xxxContacts",contacts)

    const emptyContact: Contact = {
        id: '',
        isClient: false,
        logo: '',
        businessName: '',
        denominationUsuelleEtablissement: [],
        businessType: '',
        businessActivity: '',
        businessAddress: '',
        businessWebsite: '',
        businessPhone: '',
        businessEmail: '',
        businessCity: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        contactPosition: '',
        hasBeenCalled: 0,
        hasBeenSentEmailOrMeetUp: 0,
        filesSent: [],
        tag: [],
        interestGauge: null, // Marche ps ???1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, 
        dateOfFirstCall: null,
        dateOfLastCall: null,
        dateOfNextCall: null,
        comments: '',
        userId: ''
    }

    const [displayNewContactForms, setDisplayNewContactForms] = React.useState(false)

    const [filterName, setFilterName] = React.useState('')


    //console.log(selectedContact)
    //console.log(contacts)

    const { currentUser } = useAuthUserContext()
    // console.log(currentUser)
    // console.log(currentUser?.uid)
   

    React.useEffect(() => { 
        readDataFromFirebaseAndSetContact(currentUser, setLoading, setContacts)
    }, [currentUser])
    // }, [currentUser?.uid])


 
    
    const updatingLocalContacts = (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => {
        console.log("xxxLOCAL", keyAndValue.key, keyAndValue.value)

        let tempUpdatedContacts = contacts.map(contact => {
            return contact.id === id ? { ...contact, [keyAndValue.key]: keyAndValue.value } : contact
        })
        //setmoviesList(sortArrayBy(updatedMovies, orderedBy))
        setContacts(tempUpdatedContacts)
    }
    //const updateContactInContactsAndDB = (updatingContact: Contact) => {     // ou selectedContact
    const updateContactInContactsAndDB = (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => {
        console.log("updatingContact", id, keyAndValue)
        // 1-On met à jour le tableau en remplaçant l'attribut voulu dans le contact qui a le même id que celui qu'on a sélectionné
        updatingLocalContacts(id, keyAndValue)
        // 2-On met à jour le contact dans la BDD fireStore : firestoreDB
        updatDataOnFirebase(id, keyAndValue)
    }  




    const filter = (searchText: string) => {
        console.log(searchText)

        setFilterName(searchText)
    }



    const storageRef = ref(storage);
    //console.log(storageRef)



    return (
        <Box sx={{ position:"relative", marginTop:"2em" }}>
        {/* <React.Fragment sx={{ position:"absolute" }}> */}

            {/* <Image */}
            <Typography variant="h3" component="h1" sx={{ 
                //margin:"50px" 
            }} >Application de gestion de contacts</Typography>

            <Box sx={{ position:"absolute", right:0, top:0  }} >
                <AuthDetails />
            </Box>

            {loading
                ? <Container>Chargement...</Container>
                : currentUser
                    ? <Box sx={{ marginTop:"50px" }} >
                        {/* On affiche le nom de l'utilisateur */}
                        {/* <Typography variant="h3" component="div" gutterBottom>User Auth = {currentUser?.email}</Typography> */}

                        {/* <FormControl sx={{ my: 2 }}> */}
                        <Box sx={{ display: "flex", justifyContent: "space-around", padding: "10px", border: "solid 3px blue", borderRadius: "10px" }}>
                            <Typography component="div" style={{ display: "block", width: "500px" }} >Pour version d'essai : Pour ajouter des contacts TEST ou tout supprimer : </Typography>
                            <Button variant="contained" color='ochre' onClick={() => addFakeDataOnFirebaseAndReload(currentUser, fakeContactsData)}>Ajouter Contacts Test</Button>
                            <Button variant="contained" color='primary' sx={{ width:"300px" }} onClick={() => deleteAllDatasOnFirebaseAndReload(currentUser, false)}>Supprimer tout mes contacts</Button>
                            {/* <Button variant="contained" color='warning' onClick={() => deleteAllDatas(true)}>Supprimer toutes les données !!!</Button> */}
                        </Box>
                        {/* </FormControl> */}
                        {/* <FormControl sx={{ my: 2 }}>
                        <input type="text" value={todo} onChange={handleTodoChange} />
                        <Button variant="contained" onClick={writeContactData2}>Ajouter dans REALTIME DB</Button>
                    </FormControl> */}


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

                        : 
                        <Box sx={{ marginTop:"40px", position:"relative"}} >
                            
                            {/* <FilterContacts onTextChange={filter}  /> */}

                            {/* <Fade component="p" in={!displayNewContactForms}>
                                <Typography variant="h5" component="div" sx={{ p: 2 }}>Vous avez ({contacts.length}) contacts</Typography>
                            </Fade>
                            <Collapse orientation="horizontal" in={!displayNewContactForms}>
                                <Typography variant="h5" component="div" sx={{ p: 2 }}>Vous avez ({contacts.length}) contacts</Typography>
                            </Collapse> */}
                            <Typography variant="h5" component="div" sx={{ p: 2 }}>Vous avez ({contacts.length}) contacts</Typography>
                            <Box sx={{ position:"absolute", right:0, top:0  }} >
                                <Tooltip title="Ajouter un contact (avec ou sans recherche)" placement="left">
                                    <IconButton aria-label="edit" color="primary" onClick={() => setDisplayNewContactForms(!displayNewContactForms)}>
                                        {/* <Typography>A voir quel icon on garde : </Typography>
                                        <PersonAddRoundedIcon fontSize="large" />                             
                                        <PersonSearchRoundedIcon fontSize="large" />
                                        <AddIcon fontSize="large" /> */}
                                        <AddCircleOutlineIcon fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <ContactsTable
                                contacts={contacts}
                                selectedContactId={selectedContact.id}
                                setSelectedContact={setSelectedContact}
                                handleUpdateContact={updateContactInContactsAndDB}
                                handleDeleteContact={deleteDataOnFirebaseAndReload}
                            //setContacts={setContacts}
                            //orderedBy={orderedBy} 
                            />
                            {/* <TestTableSortLabel2 contacts={contacts} selectedContactId={selectedContact.id} setSelectedContact={setSelectedContact} handleUpdateContact={updateContactInContactsAndDB} handleDeleteContact={deleteContact} /> */}
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
