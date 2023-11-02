'use client'

import React from 'react'

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import Edit from '@mui/icons-material/Edit';
import LocationOn from '@mui/icons-material/LocationOn';
import { grey } from '@mui/material/colors';
import Image from 'next/image'
import { TextField, Stack, Button, FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip, ListItem, List } from '@mui/material'

type ContactCardProps = {
    contact: Contact ; 
    addContact: (contact: Contact) => void
}

export default function ContactCard({ contact, addContact }: ContactCardProps) {

    const findLabelNafCodes = (code: string) => {
        const codesNaf = require('../nafCodes.json');       // donc codesNaf = à ce qu'on a dans nafCodes.json => un tableau d'objets
        const naf: CodeNaf = codesNaf.find((codeAndLabel: CodeNaf) => codeAndLabel.id === code);

        //naf && console.log("----------", naf.id)
        //naf && console.log(naf.label)

        return naf ? naf.label : ''
    }   

    return (
        //JSON.stringify(contact) === '{}' ? <div></div> :
        <Card key={contact.id}
        //className=' my-2'
        //sx={{ my: 2 }}        // my = 0.5rem (donc 1/2 taille de la police de la racine (em pour l'élément))
        >
            <FormControl
                sx={{ p: 2, 
                display: 'flex'
             }}
            >           
                {contact.logo
                    ? <Avatar variant="rounded" src={contact.logo} />
                    : <Avatar variant="rounded" sx={{ bgcolor: grey[500], fontSize:"9px" }} >{contact.businessName}</Avatar>
                }
                <TextField id="outlined-basic" label="Nom de l'entreprise" variant="outlined" value={contact.businessName} />
                <TextField id="outlined-basic" label="Secteur d'activité" variant="outlined" value={findLabelNafCodes(contact.businessActivity)} />
                <TextField id="outlined-basic" label="Ville" variant="outlined" value={contact.businessCity} />
                <TextField id="outlined-basic" label="Adresse" variant="outlined" value={contact.businessAddress} />
                <TextField id="outlined-basic" label="Téléphone" variant="outlined" value={contact.businessPhone} />
                <TextField id="outlined-basic" label="Website" variant="outlined" value={contact.businessWebsite} />
                <TextField id="outlined-basic" label="Email" variant="outlined" value={contact.businessEmail} />
                <TextField id="outlined-basic" label="Nom du contact" variant="outlined" value={contact.contactName} />
                <TextField id="outlined-basic" label="Téléphone du contact" variant="outlined" value={contact.contactPhone} />
                <TextField id="outlined-basic" label="Email du contact" variant="outlined" value={contact.contactEmail} />
                <TextField id="outlined-basic" label="Poste du contact" variant="outlined" value={contact.contactPosition} />
                <TextField id="outlined-basic" label="Commentaires" variant="outlined" value={contact.comments} />      

         
                {/* <IconButton>
                    <Edit sx={{ fontSize: 14 }} />
                </IconButton> */}
            </FormControl>
            
            {/* <Divider />
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 2, py: 1, bgcolor: 'background.default' }}
            >
                <Chip></Chip>
                <Switch />
            </Stack> */}
            <Button variant="contained" sx={{ width: '100%', mt: 1, mb: 2 }} onClick={() => addContact(contact)} >Ajouter comme contact</Button>
        </Card>
    )
}
