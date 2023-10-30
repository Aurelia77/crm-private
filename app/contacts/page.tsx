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


import ContactForm from '../Components/ContactForm';
import ContactCard from '../Components/ContactCard';
import ContactsTable from '../Components/ContactsTable';

import contactsData from '../contacts'
import { Container } from '@mui/material';

export default function Contacts() {

    const [contacts, setContacts] = React.useState<Contact[]>(contactsData)
    //const [selectedContact, setSelectedContact] = React.useState<Contact | undefined>()   
    const [selectedContact, setSelectedContact] = React.useState<Contact | {id: string}>({id: "0"}) 
    
    //console.log(selectedContact)

    const handleUpdateContact = (updatingContact: Contact) => {     // ou selectedContact
        console.log("updatingContact", updatingContact)
        // if (movieEdited.name === '') {
        //     alert("Ajouter un nom de film")
        // }
        // else if (movieEdited.category === '') {
        //     alert("Ajouter une catégorie de film")
        // }
        // else if (movieEdited.year === 0) {
        //     alert("Ajouter une année de visionnage")
        // }
        // else {
            // On met à jour le tableau en remplaçant le film qui a le même id que celui qu'on a sélectionné par le film sélectionné
            let updatedContacts = contacts.map(contact => contact.id === updatingContact.id ? updatingContact : contact)
            //setmoviesList(sortArrayBy(updatedMovies, orderedBy))
            setContacts(updatedContacts)
        // }
    }

   

    return (
        <Container maxWidth="xl"         // Si on veut des marges
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
            

            <Accordion sx={{ my: 2 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header" >
                    <Typography>Nouveau Contact</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>Informations du contact</Typography>
                    <ContactForm />                
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
                handleUpdateContact={handleUpdateContact}
                //setContacts={setContacts}
            //orderedBy={orderedBy} 
            />

        {/* </div> */}
        </Container> 
    )
}
