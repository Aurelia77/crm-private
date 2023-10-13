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


import ContactEditForm from '../Components/ContactEditForm';

import contactsData from '../contacts'

export default function Contacts() {

    const [contacts, setContacts] = React.useState<Contact[]>(contactsData)

    return (
        <div>
            {/* <Stack spacing={2} direction="row"
                // ajouter marge bottom
                sx={{ my: 2 }}
            >
                <Button variant="text">Text</Button>
                <Button variant="contained">Nouveau Contact</Button>
                <Button variant="outlined">Outlined</Button>
            </Stack> */}
            
            <ContactEditForm />

            {/* <Accordion sx={{ my: 2 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Nouveau Contact</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>Informations du contact</Typography>
                    
                    
                </AccordionDetails>
            </Accordion>

            <Stack
                //spacing={2} 
                gap={2}
                direction="row" flexWrap="wrap" justifyContent="center"
            //alignItems="center"
            >

                {contacts.map((contact) => (

                    <Card key={contact.id}
                    //className=' my-2'
                    //sx={{ my: 2 }}        // my = 0.5rem (donc 1/2 taille de la police de la racine (em pour l'élément))
                    >
                        <Box sx={{ p: 2, display: 'flex' }} >
                            <Image
                                alt="Random image"
                                src="https://source.unsplash.com/random"
                                width={50}
                                height={50}
                                style={{
                                    //maxWidth: '100%',
                                    //height: '200px',
                                    objectFit: 'cover',
                                }}
                            />
                            <Avatar variant="rounded" src="avatar1.jpg" />
                            <Stack spacing={0.5}>
                                <Typography fontWeight={700}>{contact.businessName}</Typography>
                                <Typography fontWeight={700}>{contact.businessCity}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <LocationOn sx={{ color: grey[500] }} />{contact.businessAddress}
                                </Typography>
                            </Stack>
                            <IconButton>
                                <Edit sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Box>
                        <Divider />
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ px: 2, py: 1, bgcolor: 'background.default' }}
                        >
                            <Chip></Chip>
                            <Switch />
                        </Stack>
                    </Card>
                ))}
            </Stack> */}

        </div>
    )
}
