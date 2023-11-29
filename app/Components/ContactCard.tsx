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
import { TextField, Stack, Button, FormControl, InputLabel, MenuItem, Autocomplete, Chip, ListItem, List , OutlinedInput, Checkbox, ListItemText} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';



type ContactCardProps = {
    contact: Contact ; 
    addContact?: (contact: Contact) => void
    updateContact?: (contact: Contact) => void
    //contactCardDisplayStatus?: boolean
    //setContactCardDisplayStatus?: (status: boolean) => void
}

export default function ContactCard({ contact, addContact, updateContact, 
    //contactCardDisplayStatus=true, 
    //setContactCardDisplayStatus
 }: ContactCardProps) {

    const [contactToAddOrUpdate, setContactToAdd] = React.useState<Contact>(contact)

    const businessCategories: BusinessCatType[] = ["NON DEFINI", "Camping", "Hôtel", "Congiergerie", "Agence Event", "Agence Artistique", "Mairie", "Lieu de réception", "Wedding Planer", "Restaurant Plage", "Piscine Municipale", "Yacht", "Plage Privée", "Agence Location Villa Luxe", "Aquarium", "Centre de Loisirs", "Centre de Plongée", "Agence Communication Audio Visuel", "Autre"];


    React.useEffect(() => {
        setContactToAdd(contact)    // Sinon quand on clic ne change rien !
    }, [contact])

    //console.log(contactToAdd)

    const handleChangeText = (attribut: keyof Contact) => (event: React.ChangeEvent<HTMLInputElement>) => {
        //console.log("event.target.value", event.target.value)
        setContactToAdd({...contactToAddOrUpdate, [attribut]: event.target.value })
        // handleUpdateContact({ ...contact, [attribut]: event.target.value })
    }
    const handleChangeSelectType = (event: SelectChangeEvent) => { 
        const type: BusinessCatType = event.target.value as BusinessCatType       // obligé de mettre as businessCategory car sinon type = string, on peut faire autrement ???
        setContactToAdd({...contactToAddOrUpdate, businessCategory: type })
    };


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
        sx={{ 
            //my: 2
            position: "relative",
         }}        // my = 0.5rem (donc 1/2 taille de la police de la racine (em pour l'élément))
        >
            {/* A changer !!!!!!!! Mettre cette val de partout !!! */}
            {/* <Box sx={{ position: "absolute", right: "200px", top: 0,
                zIndex: 1000,
             }} >
                    <IconButton aria-label="edit" color="primary" 
                    onClick={() => setContactCardDisplayStatus(!contactCardDisplayStatus)}
                    >
                        <Typography>Fermer</Typography>
                    </IconButton>
            </Box> */}
            <FormControl
                sx={{ p: 2, 
                display: 'flex'
             }}
            >           
                {contact.logo
                    ? <Avatar variant="rounded" src={contactToAddOrUpdate.logo} />
                    : <Avatar variant="rounded" sx={{ bgcolor: grey[500], fontSize:"9px" }} >{contactToAddOrUpdate.businessName}</Avatar>
                }
                <TextField id="outlined-basic" label="Nom de l'entreprise à ajouter aux contacts" variant="outlined" value={contactToAddOrUpdate.businessName}
                onChange={handleChangeText("businessName")} />
                {/* <TextField id="outlined-basic" label="Secteur d'activité" variant="outlined" value={findLabelNafCodes(contactToAdd.businessActivity)} /> */}
               
                <FormControl >
                    <InputLabel id="checkbox-type-label">Type de contact</InputLabel>
                    <Select
                        id="checkbox-type-label"
                        value={contactToAddOrUpdate.businessCategory}
                        //onChange={(e) => handleChangeSelect(e, "businessCategory")}
                        onChange={handleChangeSelectType}
                    >
                         {businessCategories.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}                       
                    </Select>
                </FormControl>

                <TextField id="outlined-basic" label="Ville" variant="outlined" value={contactToAddOrUpdate.businessCity} onChange={handleChangeText("businessCity")} />
                <TextField id="outlined-basic" label="Adresse" variant="outlined" value={contactToAddOrUpdate.businessAddress} onChange={handleChangeText("businessAddress")} />
                <TextField id="outlined-basic" label="Téléphone" variant="outlined" value={contactToAddOrUpdate.businessPhone} onChange={handleChangeText("businessPhone")} />
                <TextField id="outlined-basic" label="Website" variant="outlined" value={contactToAddOrUpdate.businessWebsite} onChange={handleChangeText("businessWebsite")} />
                <TextField id="outlined-basic" label="Email" variant="outlined" value={contactToAddOrUpdate.businessEmail} onChange={handleChangeText("businessEmail")} />
                {/* <TextField id="outlined-basic" label="Nom du contact" variant="outlined" value={contactToAdd.contactName} onChange={handleChangeText("contactName")} />
                <TextField id="outlined-basic" label="Téléphone du contact" variant="outlined" value={contactToAdd.contactPhone} onChange={handleChangeText("contactPhone")} />
                <TextField id="outlined-basic" label="Email du contact" variant="outlined" value={contactToAdd.contactEmail} onChange={handleChangeText("contactEmail")} />
                <TextField id="outlined-basic" label="Poste du contact" variant="outlined" value={contactToAdd.contactPosition} onChange={handleChangeText("contactPosition")} />
                <TextField id="outlined-basic" label="Commentaires" variant="outlined" value={contactToAdd.comments} onChange={handleChangeText("comments")} />       */}

         
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
            {addContact && <Button variant="contained" sx={{ width: '100%', mt: 1, mb: 2 }} onClick={() => addContact(contactToAddOrUpdate)} >Ajouter comme contact</Button>}
            {updateContact && <Button variant="contained" color='secondary' sx={{ width: '100%', mt: 1, mb: 2 }} onClick={() => updateContact(contactToAddOrUpdate)} >Mettre à jour le contact</Button>}
        </Card>
    )
}
