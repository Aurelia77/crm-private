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
import { contactCategories } from '../utils/toolbox'

import { Fab } from '@mui/material'
import NewContactSearchForm from '../Components/NewContactSearchForm';
import ContactCard from '../Components/ContactCard';
import ContactsTable from '../Components/ContactsTable';
import SignIn from '../Components/auth/SignIn';
import SignUp from '../Components/auth/SignUp';
import AuthDetails from '../Components/AuthDetails';
import SearchContactsForm from '../Components/SearchContactsForm';
import Admin from '../Components/Admin';
import SearchIcon from '@mui/icons-material/Search';
import { modalStyle } from '../utils/StyledComponents'

import fakeContactsData from '../utils/contactsTest'
import contactsLaurianeCampings from '../utils/contactsLauriane';
import contactsLaurianeCampings_x10 from '../utils/contactsLauriane x10';
//import getContacts from '../utils/firebase'
//import writeContactData from '../utils/firebase'
//import firebase from 'firebase/app'
//import firebaseConfig from '../utils/firebaseConfig'
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
    const [contacts, setContacts] = React.useState<Contact[]>([])
    const [filteredContacts, setFilteredContacts] = React.useState<Contact[]>([])
    //const [selectedContact, setSelectedContact] = React.useState<Contact | undefined>()   
    const [selectedContact, setSelectedContact] = React.useState<Contact | { id: string }>({ id: "0" })
    const [loading, setLoading] = React.useState(true)
    const [alerts, setAlerts] = React.useState<Alerts>({ nbContactsWithDatePassed: 0, nbContactsWithDateSoon: 0 })
    const [isContactTableFilled, setIsContactTableFilled] = React.useState(0)
    // const [isContactTableFilled, setIsContactTableFilled] = React.useState(false)

    //console.log("isContactTableFilled", isContactTableFilled)

    // const [displayNewContactForms, setDisplayNewContactForms] = React.useState(false)
    const [contactToDisplay, setContactToDisplay] = React.useState<Contact>(emptyContact)

    const [messageNoContact, setMessageNoContact] = React.useState("") //Aucun contact pour l'instant, veuillez en ajouter ici :")
    const [hasContactInfoChanged , setHasContactInfoChanged ] = React.useState(false)
    const [openWarningModal, setOpenWarningModal] = React.useState(false);


    console.log("****hasContactInfoChanged", hasContactInfoChanged)

    const muiTheme = useTheme()

    // console.log(isContactCardDisplay)

    const { currentUser } = useAuthUserContext()
    //console.log(currentUser)
    // console.log(currentUser?.uid)



    const emptySearchCriteria: SearchContactCriteria = {
        isClient: "all",
        contactType: [],
        businessName: '',
        businessCity: [],
        businessCategoryId: []
    }
    const [contactsSearchCriteria, setContactsSearchCriteria] = React.useState<SearchContactCriteria>(emptySearchCriteria)
    //const [contactsSearchCriteria, setContactsSearchCriteria] = React.useState({})

    const isSearchCriteriaEmpty = JSON.stringify(contactsSearchCriteria) === JSON.stringify(emptySearchCriteria)

    const [tabValue, setTabValue] = React.useState(0);
    const [tabValueWithoutSavingInfoChanges, setTabValueWithoutSavingInfoChanges] = React.useState(0);
    const [tabNewContactValue, setTabNewContactValue] = React.useState(0);
    const [tabCalendarValue, setTabCalendarValue] = React.useState(0);

    //console.log("tabValue", tabValue)

    const titles = [
        { label: "Contacts", icon: <Diversity3Icon /> },
        { label: "Calendrier", icon: <CalendarMonthIcon /> },
        { label: "Nouveau", icon: <PersonAddIcon /> },
        { label: "Contact", icon: <PersonIcon /> },
        { label: "Admin", icon: <SettingsIcon /> },
        // { label: "Admin", icon: <SettingsIcon /> },
    ]


    //console.log("PAGE Contacts",contacts)
    //console.log(selectedContact)
    //console.log("contacts", contacts)
    //console.log("filteredContacts", filteredContacts)
    //console.log(contactsSearchCriteria)




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

        //setTabValue(0)
        //setContactToDisplay(emptyContact)
    }

    const diplayContactCardToUpdate = (contact: Contact) => {
        setContactToDisplay(contact)
        setTabValue(3)
    }
    // const diplayContactCardNew = () => {
    //     setContactToDisplay(emptyContact)
    //     setIsContactCardDisplay(true)
    // }

    const fakeContactsNameAndCatLabel = [
        {
            name: "Camping Hyères",
            catLabel: "Camping"
        },
        {
            name: "Camping St Tropez",
            catLabel: "Camping"
        },
        {
            name: "Plongeons ensemble !",
            catLabel: "Centre de Plongée"
        },
        {
            name: "Entreprise de maquillage GLOW",
            catLabel: "Autre"
        },
        {
            name: "Pierre et vacances",
            catLabel: "Centre de Loisirs"
        },
        {
            name: "Restaurant 5* LE BONHEUR",
            catLabel: "Restaurant Plage"
        },
    ]

    
    const addCatToFakeContacts = async (fakeContactsData: Contact[]) => {

        console.log("****start addCatToFakeContacts")
        let promises: any = [];

        for (const fakeContact of fakeContactsData) {
            for (const contactNameAndCatLabel of fakeContactsNameAndCatLabel) {

                console.log("***contact", fakeContact.businessName, " - " ,contactNameAndCatLabel.name)

                if (fakeContact.businessName === contactNameAndCatLabel.name) {

                    const catId = await getCatIdFromLabel(currentUser?.uid, contactNameAndCatLabel.catLabel);                    
                    console.log("***cat du contact", contactNameAndCatLabel.catLabel)
                    console.log("***catId", catId)


                    getContactsFromDatabase(currentUser).then((contactsList) => {
                        const updatePromises = contactsList.map((firebaseContact) => {
                            if (firebaseContact.businessName === fakeContact.businessName) {
                                console.log("***", firebaseContact, catId)
                                return updatDataOnFirebase(firebaseContact.id, { key: "businessCategoryId", value: catId })
                            }
                        });
                        promises.push((updatePromises));
                        console.log("***promises", promises)    
                    })

                }
            }
        }

        Promise.all(promises)
            .then(() => { 
                console.log("***Dans le THEN du PROMISE ALL")
                console.log("!!!!!!!!! CAT ATJOUTées !!!!!")
                window.location.reload() 
            })
            .catch((error) => { console.error("Error reloading page: ", error); });
    }

    const addFakeDataWithCat = async() => {
        await addFakeDataOnFirebase(currentUser, fakeContactsData)            
        addCatToFakeContacts(fakeContactsData)        
    }

    // Je ne peux pas mettre cette fonction dans ToolBox car je peux utiliser les thème seulement dans un composant  (React Hooks must be called in a React function component or a custom React Hook function.)
    const getPriorityTextAndColor = (priority: number | null) => {
        switch (priority) {
            case 1: return { 
                text: "Faible", 
                color: muiTheme.palette.error.main,
                bgColor: "#efb9b9"
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



 // Créez une référence pour suivre le premier rendu
    const firstRender = React.useRef(true);

    //console.log("firstRender", firstRender)
    //console.log("firstRender", firstRender.current)



    React.useEffect(() => {
        //console.log("User Effect READ")

        getContactsFromDatabase(currentUser).then((contactsList) => {
            setContacts(contactsList);
            setFilteredContacts(contactsList);
            setAlerts(countContactsByAlertDates(contactsList))
            setLoading(false); 
        })         

    }, [currentUser])
    // }, [currentUser?.uid])

    const onChangeTabValue = (newValue: number) => {
        setTabValueWithoutSavingInfoChanges(newValue)

        if ([2,3].includes(tabValue)  && hasContactInfoChanged) {
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
    //     if (firstRender.current) {
    //         firstRender.current = false;
    //         return;
    //     }

    //     console.log("2222222222222222222")

       

    //     // Mettez à jour votre variable ici
    //     setIsContactTableFilled(isContactTableFilled + 1);
    // }, [contacts]);
  

    //   React.useEffect(() => {
    //       // Si c'est le premier rendu, ne faites rien et mettez à jour firstRender pour les rendus suivants
    //       if (firstRender.current) {
    //           firstRender.current = false;
    //           return;
    //       }
    //   }, [contacts]);     // 

   

    React.useEffect(() => {
        setAlerts(countContactsByAlertDates(filteredContacts))
        //{filteredContacts.length === 0 && setMessageNoContact("Aucun contact trouvé")}
        
    }, [filteredContacts, 
    ])


    React.useEffect(() => {
        // console.log("User Effect RECHERCHE")
        // console.log(contactsSearchCriteria)

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

            const searchOnCategory = contactsSearchCriteria.businessCategoryId.length > 0 ? contactsSearchCriteria.businessCategoryId : ['']
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




                    && searchOnCategory.some((cat) => contact.businessCategoryId.includes(cat))
                    // && searchOnCategory.some((cat) =>{ 
                    //     console.log("cat", cat)
                    //     console.log(contact.businessCategory)
                    //     console.log(contact.businessCategory === cat)
                    //     return contact.businessCategory.includes(cat) 
                    // }) 


                    && searchOnType.some((type) => {
                        // console.log("type", type)
                        // console.log(contact.contactType)
                        // console.log(contact.contactType.includes(type))
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
        contacts
    ])      // !!!!!!!!!!!!!!! laisser contact ? car si modif ça peut disparaitre !!!!!! NON on ne veut pas ! + boucle infinie !!!

    // React.useEffect(() => {

    //     console.log("USE EFFECT contactToDisplay")
    //     let newContacts: Contact[] = contacts.map(contact => {
    //         return contact.id === contactToDisplay.id ? contactToDisplay : contact
    //     })
    //     setContacts(newContacts)
    // }, [contactToDisplay])




    return (
        <Box sx={{
            position: "relative",
            //marginTop:0
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
                //position: "absolute", right: "5px", top: 0 
            }} ><AuthDetails /></Box>
            {/* On affiche le nom de l'utilisateur */}
            {/* <Typography variant="h3" component="div" gutterBottom>User Auth = {currentUser?.email}</Typography> */}

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

                    : <Box sx={{
                        //marginTop: "20px" 
                    }} >
                        {/* /////////////////////// Pour REALTIME DB /////////////////////// */}
                        {/* <input type="text" value={todo} onChange={handleTodoChange} />
                    <Button variant="contained" onClick={writeContactData2}>Ajouter dans REALTIME DB</Button> */}

                        {/* ///////////////////////ONGLETS - Tabs /////////////////////// */}
                        <Box
                            sx={{
                                flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100vh',
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
                                        //label={title.label} 
                                        title={title.label}
                                        icon={title.icon}
                                        value={index}
                                        // {...a11yProps(index)}
                                        sx={{ margin: '10px 0 10px 0' }}
                                    //sx={{ marginBottom:"10px" }} 
                                    />
                                ))}
                            </Tabs>

                            {/* ///////// LISTE DE CONTACTS + recherche) ///////// */}
                            <TabPanel key="0" value={tabValue} index={0} width= {`calc(100vw - ${TABS_WIDTH}px`} >
                                <Box display="flex" flexDirection="column" style={{ height: '100vh' }}>
                                    <SearchContactsForm
                                        contacts={contacts}
                                        currentUserId={currentUser.uid}
                                        emptySearchCriteria={emptySearchCriteria}
                                        onSearchChange={setContactsSearchCriteria}
                                    />

                                    <Box sx={{ display: "flex", alignItems: "center", margin: "13px 0 7px 15px", }}
                                    >{filteredContacts.length > 0
                                        ? <Typography variant="h5">
                                            {filteredContacts.length} contacts :

                                            {/* {!isSearchCriteriaEmpty
                                                ? `Recherche : ${filteredContacts.length} contacts trouvé(s) (sur ${contacts.length})`
                                                : `${contacts.length} contacts : `
                                            } */}
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
                                        : //(isContactTableFilled >= 2) && 
                                        <Typography variant="h5" color="error.main">
                                            {messageNoContact}
                                            Aucun contact pour l'instant, veuillez en ajouter ici :
                                            <Button variant="contained" color="primary" onClick={() => { setTabValue(2); setTabNewContactValue(0) }} sx={{ ml: 2 }}>Nouveau contact</Button>
                                        </Typography>
                                        }
                                    </Box>

                                    <Box flexGrow={1} overflow="auto" >
                                        <ContactsTable
                                            contacts={filteredContacts}
                                            currentUserId={currentUser.uid}
                                            selectedContactId={selectedContact.id}
                                            setSelectedContact={setSelectedContact}
                                            handleUpdateContact={updateContactInContactsAndDB}
                                            handleDeleteContact={deleteDataOnFirebaseAndReload}
                                            diplayContactCard={diplayContactCardToUpdate}
                                            getPriorityTextAndColor={getPriorityTextAndColor}
                                        />
                                    </Box>

                                </Box>
                            </TabPanel>

                            {/* ///////// CALENDRIER ///////// */}
                            <TabPanel key="1" value={tabValue} index={1}  width= {`calc(100vw - ${TABS_WIDTH}px`} >
                                <Tabs
                                    value={tabCalendarValue}
                                    onChange={(e, newValue: number) => setTabCalendarValue(newValue)}
                                    aria-label="Horizontal tabs"
                                //sx={{ borderRight: 1, borderColor: 'divider', width: "120px" }}
                                >

                                    <Tab key={0} label="Grand"
                                    //icon={title.icon}
                                    // {...a11yProps(index)} 
                                    />
                                    <Tab key={1} label="Petit"   // Scheduler
                                    //icon={title.icon}
                                    // {...a11yProps(index)} 
                                    />
                                    {/* <Tab key={2} label="Grand Calendrier"
                                    //icon={title.icon}
                                    // {...a11yProps(index)} 
                                    /> */}
                                </Tabs>

                                {/* ///////// Petit Calendrier ///////// */}
                                <TabPanel key="0" value={tabCalendarValue} index={0}  width= {`calc(100vw - ${TABS_WIDTH}px`} >
                                    <CalendarScheduler
                                        //contacts={fakeContactsData}
                                        //contacts={filteredContacts}   // ????????? 
                                        contacts={contacts}
                                        diplayContactCardToUpdate={diplayContactCardToUpdate}
                                        updateContactInContactsAndDB={updateContactInContactsAndDB}
                                    />
                                </TabPanel>

                                {/* ///////// Scheduler Calendrier ///////// */}
                                <TabPanel key="1" value={tabCalendarValue} index={1}  width= {`calc(100vw - ${TABS_WIDTH}px`} >
                                    <CalendarLittle
                                        //contacts={fakeContactsData}
                                        //contacts={filteredContacts}   // ????????? 
                                        contacts={contacts}
                                        diplayContactCardToUpdate={diplayContactCardToUpdate}
                                    />
                                </TabPanel>

                                {/* ///////// Grand Calendrier ///////// */}
                                <TabPanel key="2" value={tabCalendarValue} index={2}  width= {`calc(100vw - ${TABS_WIDTH}px`} >
                                    <CalendarFull
                                        //contacts={fakeContactsData}
                                        //contacts={filteredContacts}   // ????????? 
                                        contacts={contacts}
                                        diplayContactCardToUpdate={diplayContactCardToUpdate}
                                        updateContactInContactsAndDB={updateContactInContactsAndDB}
                                    />
                                </TabPanel>
                            </TabPanel>

                            {/* ///////// Nouveau CONTACT ///////// */}
                            <TabPanel key="2" value={tabValue} index={2}  width= {`calc(100vw - ${TABS_WIDTH}px`} >
                                <Tabs
                                    //orientation="vertical"
                                    // variant="scrollable"
                                    value={tabNewContactValue}
                                    onChange={(e, newValue) => setTabNewContactValue(newValue)}
                                    // onChange={handleChangeTabNewContact}
                                    aria-label="Horizontal tabs"
                                //sx={{ borderRight: 1, borderColor: 'divider', width: "120px" }}
                                >

                                    <Tab key={0} label="Recherche INSEE"
                                    //icon={title.icon}
                                    // {...a11yProps(index)} 
                                    />
                                    <Tab key={1} label="Ajout à partir de zéro"
                                    //icon={title.icon}
                                    // {...a11yProps(index)} 
                                    />
                                </Tabs>

                                {/* ///////// Recherche INSEE ///////// */}
                                <TabPanel key="0" value={tabNewContactValue} index={0}  >
                                    <NewContactSearchForm
                                        emptyContact={emptyContact}
                                        addContact={(e) => addContactOnFirebaseAndReload(currentUser, e)}
                                        currentUserId={currentUser.uid}
                                        getPriorityTextAndColor={getPriorityTextAndColor}
                                        setHasContactInfoChanged={setHasContactInfoChanged }
                                    />
                                </TabPanel>

                                {/* ///////// Recherche de ZERO ///////// */}
                                <TabPanel key="1" value={tabNewContactValue} index={1} >
                                    <ContactCard
                                        contact={emptyContact}
                                        currentUserId={currentUser.uid}
                                        getPriorityTextAndColor={getPriorityTextAndColor}
                                        setHasContactInfoChanged={setHasContactInfoChanged }
                                        addContact={(e) => addContactOnFirebaseAndReload(currentUser, e)}
                                    />
                                </TabPanel>
                            </TabPanel>

                            {/* ///////// Un CONTACT ///////// */}
                            <TabPanel key="3" value={tabValue} index={3}  width= {`calc(100vw - ${TABS_WIDTH}px`} >
                                <ContactCard
                                    contact={contactToDisplay}
                                    currentUserId={currentUser.uid}
                                    getPriorityTextAndColor={getPriorityTextAndColor}
                                    setHasContactInfoChanged={setHasContactInfoChanged }
                                    handleDeleteContact={deleteDataOnFirebaseAndReload}
                                    updateContact={updateWholeContactInContactsAndDB}
                                // updateContact={() => {console.log("updateContact")}} 
                                //contactCardDisplayStatus={isContactCardDisplay} 
                                //setContactCardDisplayStatus={setIsContactCardDisplay} 
                                />
                            </TabPanel>

                            {/* /////////////////////// Admin /////////////////////// */}
                            <TabPanel key="4" value={tabValue} index={4}  width= {`calc(100vw - ${TABS_WIDTH}px`} >
                                <Admin currentUser={currentUser} />
                                <Box sx={{
                                    //display: "flex", justifyContent: "space-around", 
                                    padding: "10px", border: "solid 3px blue", borderRadius: "10px", marginTop: "100px", width: "calc(100vw - 200px)"
                                }}>
                                    <Typography
                                        component="div"
                                        textAlign="center"
                                        style={{
                                            //display: "block",
                                            marginBottom: "50px"
                                            //width: "360px" 
                                        }} >Pour Version TEST</Typography>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }} >
                                        <Button variant="contained" color='success' onClick={() => addCategoriesOnFirebaseAndReload(currentUser, contactCategories)}>1-Ajouter Catégories</Button>
                                        <Button variant="contained" color='ochre' onClick={addFakeDataWithCat}>2-Ajouter Contacts Test</Button>
                                        {/* <Button variant="contained" color='primary' onClick={() => addFakeDataOnFirebaseAndReload(currentUser, contactsLaurianeCampings_x10)}>Ajouter Contacts Camping x10</Button>
                                        <Button variant="contained" color='pink' onClick={() => addFakeDataOnFirebaseAndReload(currentUser, contactsLaurianeCampings)}>Ajouter Contacts Camping (tous : x57)</Button> */}
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-around", }} >
                                        <Button variant="contained" color='error' sx={{ width: "300px" }} onClick={() => deleteAllDatasOnFirebaseAndReload(currentUser)}>Supprimer tous mes contacts</Button>
                                        {/* <Button variant="contained" color='warning' onClick={() => deleteAllDatasOnFirebaseAndReload()}>Supprimer TOUS les contacts de l'appli !!!</Button> */}
                                    </Box>
                                </Box>
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
                        {/* {displayNewContactForms
                            ? <Box> */}
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
                            {/* </Box>

                            : <Box sx={{ marginTop: "2em", position: "relative" }} > */}

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

                                {/* <Box sx={{
                                    marginTop: "20px",
                                    position: "relative"
                                }} > */}


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
                                {/* </Box> */}
                            {/* </Box>
                        } */}
                    </Box>
            }
        </Box>
    )
}
