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
import { Container } from '@mui/material';


import ContactForm from '../Components/ContactForm';
import ContactCard from '../Components/ContactCard';
import ContactsTable from '../Components/ContactsTable';

import contactsData from '../utils/contacts'
//import getContacts from '../utils/firebase'
//import writeContactData from '../utils/firebase'
//import firebase from 'firebase/app'
//import firebaseConfig from '../utils/firebaseConfig'
import { realtimeDb, fireStoreDb } from '../utils/firebase'
import { uid } from 'uid';
import { onValue, ref, set } from "firebase/database";
import { addDoc, collection, query, where, getDocs, onSnapshot, QuerySnapshot, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { Dayjs } from 'dayjs';       // npm install dayjs
import { Timestamp } from 'firebase/firestore';




export default function Contacts() {
    // const [contacts, setContacts] = React.useState<Contact[]>(contactsData)
    const [contacts, setContacts] = React.useState<Contact[]>([])
    //const [selectedContact, setSelectedContact] = React.useState<Contact | undefined>()   
    const [selectedContact, setSelectedContact] = React.useState<Contact | { id: string }>({ id: "0" })
    const [loading, setLoading] = React.useState(true)


    //console.log(selectedContact)
    console.log(contacts)

    


    // 1-REALTIME DB
    //const [todo, setTodo] = React.useState<string>('')
    // Read
    // React.useEffect(() => {
    //     console.log("**UseEffect**")

    //     // const contactRef = ref(realtimeDb, 'contacts/');
    //     const contactRef = ref(realtimeDb);
    //     onValue(contactRef, (snapshot) => {
    //         const data = snapshot.val();
    //         //console.log("data", data)
    //         console.log(typeof data)

    //         Object.values(data).map((contact: any) => {     // mettre type Contact
    //             console.log(contact)
    //             setContacts(prev => [...prev, contact])   // Pour pas avoir l'erreur : missing dependency: 'contacts'
    //             //setContacts([...contacts, contact])      // Ne met que le dernier !!!
    //             setLoading(false)
    //         })
    //         // const contacts = Object.values(data)
    //         // console.log("contacts", contacts)
    //         // setContacts(contacts)
    //     });       
    // }, [])
    // => !!! Warning: Encountered two children with the same key, `1`. !!!

    // const handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setTodo(event.target.value)
    // }
    // // Write
    // function writeContactData2(
    //     //contactId: string, name: string, email: string, imageUrl: string
    // ) {
    //     const id = uid()
    //     // set(ref(db, 'contacts/' + uuid), { todo, uuid });
    //     set(ref(realtimeDb, `/${id}`), { todo, id });
    //     setTodo('')
    // }
    // function writeContactData(contact: any) {       // mettre type Contact !!!!!!
    //     const id = contact.id
    //     const businessName = contact.businessName
    //     console.log("id", id)
    //     console.log("businessName", businessName)
    //     set(ref(realtimeDb, `/${id}`), { id, businessName });
    // }
    //writeContactData("andrew", "Andrew", "and@eee.fr", "https://blabla.com")



    // 2-FIRESTORE DB

    // Quand on ajoute / supprime un contact => on le fait dans le BDD firebase + on recharche la page.
    // Mais quand on modifie un contact => on le fait dans le BDD firebase + on modifie le state contacts (pour pas recharger la page)  (bien ???)

    //Write  
    const addData = () => {
        contactsData.map((contact: Contact) => {
            console.log(contact)
            console.log({ ...contact, id: uid() })
            addDoc(collection(fireStoreDb, "contacts"), { ...contact, id: uid() })
                //addDoc(collection(fireStoreDb, "contacts"), {contact})
                .then((docRef) => { console.log("Document written with ID: ", docRef.id); })
                .catch((error) => { console.error("Error adding document: ", error); });
        })
        window.location.reload()    // On rafraichit => re-render => useEffect avec la lecture des données
    }

    const addContact = (contact: Contact) => {

        console.log("add contact", contact)

        console.log({ ...contact, id: uid() })
        addDoc(collection(fireStoreDb, "contacts"), { ...contact, id: uid() })
            //addDoc(collection(fireStoreDb, "contacts"), {contact})
            .then((docRef) => { console.log("Document written with ID: ", docRef.id); })
            .catch((error) => { console.error("Error adding document: ", error); });
        window.location.reload()    // On rafraichit => re-render => useEffect avec la lecture des données
    }


    const deleteAllDatas = () => {
        const q = query(collection(fireStoreDb, "contacts"));
        getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data())
                console.log(doc.ref)
                deleteDoc(doc.ref)
            })
        }).then(() => {
            window.location.reload()    // On rafraichit => re-render => useEffect avec la lecture des données
        })

        //Marche pas !!!
        // fireStoreDb.collection("contacts").document("DC").delete() { err in
        //     if let err = err {
        //         print("Error removing document: \(err)")
        //     } else {
        //         print("Document successfully removed!")
        //     }
        // }

        // collection(fireStoreDb, "contacts").get().then((querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //         deleteDoc(doc.ref)
        //     });
        // });
    }


    // Read  
    React.useEffect(() => {
        // DOC Firebase : https://firebase.google.com/docs/firestore/query-data/get-data?hl=fr
        // const querySnapshot = await getDocs(collection(db, "cities"));
        // querySnapshot.forEach((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     console.log(doc.id, " => ", doc.data());
        // });

        let contactsArr: Contact[] = []

        getDocs(collection(fireStoreDb, "contacts")).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                //console.log(doc.data())
                contactsArr.push({ ...doc.data() as Contact })  // On indique que doc.data() est de type Contact           
                //setContacts([...contacts, doc.data()])        // Non
                //setContacts(prev => [...prev, doc.data()])    // Non
            })
            setLoading(false)
            setContacts(contactsArr)
        });
    }, [])




    // const updateContactInContactsAndDB = (updatingContact: Contact) => {     // ou selectedContact
    //     console.log("updatingContact", updatingContact)
    //
    //     // if (movieEdited.name === '') {
    //     //     alert("Ajouter un nom de film")
    //     // }
    //     // else if (movieEdited.category === '') {
    //     //     alert("Ajouter une catégorie de film")
    //     // }
    //     // else if (movieEdited.year === 0) {
    //     //     alert("Ajouter une année de visionnage")
    //     // }
    //     // else {
    //
    //     // On met à jour le tableau en remplaçant le contact qui a le même id que celui qu'on a sélectionné par le film sélectionné
    //     let updatedContacts = contacts.map(contact => contact.id === updatingContact.id ? updatingContact : contact)
    //     //setmoviesList(sortArrayBy(updatedMovies, orderedBy))
    //     setContacts(updatedContacts)

    //     //writeContactData(updatingContact)
    //     // On met à jour le contact dans la BDD fireStore : firestoreDB
    //     const q = query(collection(fireStoreDb, "contacts"), where("id", "==", updatingContact.id));
    //     let docID = '';
    //
    //     getDocs(q).then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             console.log(doc.data())
    //             console.log(doc.ref)
    //
    //             docID = doc.id;
    //             //set(doc.ref, updatingContact)
    //         })
    //         const contact = doc(fireStoreDb, "contacts", docID);
    //
    //         // Set the "capital" field of the city 'DC'
    //         updateDoc(contact, {
    //             ...updatingContact
    //         });
    //     })   
    // }

    const updatingLocalContacts = (id: string, keyAndValue: { key: string, value: string | boolean | File[] | Timestamp }) => {
        let tempUpdatedContacts = contacts.map(contact => {
            return contact.id === id ? { ...contact, [keyAndValue.key]: keyAndValue.value } : contact
        })
        //setmoviesList(sortArrayBy(updatedMovies, orderedBy))
        setContacts(tempUpdatedContacts)
    }
    const updatingRemoteContacts = (id: string, keyAndValue: { key: string, value: string | boolean | File[] | Timestamp }) => {

        // const contactToUpdateRef = doc(fireStoreDb, "contacts", id);
        // console.log(contactToUpdateRef)

        // // Set the "capital" field of the city 'DC'
        // updateDoc(contactToUpdateRef, {
        //     [keyAndValue.key]: keyAndValue.value
        // });

        const q = query(collection(fireStoreDb, "contacts"), where("id", "==", id));

        getDocs(q).then((querySnapshot) => {         
            querySnapshot.forEach((doc) => {        // besoin du FOREACH alors qu'il n'y en a qu'un ???
                    //console.log(doc.data())
                    //console.log(doc.ref)
                    //console.log(doc.id)
                    console.log(keyAndValue.key, keyAndValue.value)
                //docID = doc.id;
                updateDoc(doc.ref, {        // doc.ref est une ref à chaque enregistrement dans FIREBASE
                    [keyAndValue.key]: keyAndValue.value
                });
                //set(doc.ref, updatingContact)
            })          
        })     
    }

    //const updateContactInContactsAndDB = (updatingContact: Contact) => {     // ou selectedContact
    const updateContactInContactsAndDB = (id: string, keyAndValue: { key: string, value: string | boolean | File[] | Timestamp }) => { 
        // 1-On met à jour le tableau en remplaçant l'attribut voulu dans le contact qui a le même id que celui qu'on a sélectionné
        updatingLocalContacts(id, keyAndValue)
        // 2-On met à jour le contact dans la BDD fireStore : firestoreDB
        updatingRemoteContacts(id, keyAndValue)
    }




    return (
        <React.Fragment>
            {loading
                ? null //<Container>Chargement...</Container>
                :
                <Box //maxWidth="xl"         // Si on veut des marges
                //sx={{ mt: 4, mb: 4 }}
                >
                    {/* <div> */}
                    {/* <Stack spacing={2} direction="row"
                    // ajouter marge bottom
                    sx={{ my: 2 }}
                >
                    <Button variant="text">Text</Button>
                    <Button variant="contained">Nouveau Contact</Button>
                    <Button variant="outlined">Outlined</Button>
                </Stack> */}

                    <FormControl sx={{ my: 2 }}>
                        <Button variant="contained" onClick={deleteAllDatas}>Supprimer tout !!!</Button>
                        <Button variant="contained" onClick={addData}>Ajouter Contacts du fichier</Button>
                    </FormControl>
                    {/* <FormControl sx={{ my: 2 }}>
                    <input type="text" value={todo} onChange={handleTodoChange} />
                    <Button variant="contained" onClick={writeContactData2}>Ajouter dans REALTIME DB</Button>
                </FormControl> */}



                    <Accordion sx={{ my: 2 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header" >
                            <Typography>Nouveau Contact</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Informations du contact</Typography>
                            <ContactForm addContact={addContact} />
                        </AccordionDetails>
                    </Accordion>

                    {/* <Stack
                    //spacing={2} 
                    gap={2}
                    direction="row" flexWrap="wrap" justifyContent="center"
                //alignItems="center"
                >
                    {contacts.map((contact: Contact) => (
                        <ContactCard key={contact.id} contact={contact} />                   
                    ))}
                </Stack> */}
                    <ContactsTable
                        contacts={contacts}
                        selectedContactId={selectedContact.id}
                        setSelectedContact={setSelectedContact}
                        handleUpdateContact={updateContactInContactsAndDB}
                    //setContacts={setContacts}
                    //orderedBy={orderedBy} 
                    />

                    {/* </div> */}
                </Box>
            }
        </React.Fragment>
    )
}
