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
import { TextField, Stack, Button, FormControl, InputLabel, MenuItem, Autocomplete, Chip, ListItem, List, OutlinedInput, Checkbox, ListItemText, FormControlLabel, Tooltip } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { sortedBusinessCategories, contactTypes } from '../utils/toolbox'
import dayjs, { Dayjs } from 'dayjs';       // npm install dayjs
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
//import { ClearIcon, DatePicker } from '@mui/x-date-pickers';      // Bizarre ça a l'air de marcher aussi comme ça !!!???
import { Timestamp } from 'firebase/firestore';
import { useTheme } from '@mui/material/styles';
import { storage } from '../utils/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { MuiFileInput } from 'mui-file-input';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';


type ContactCardProps = {
    contact: Contact;
    addContact?: (contact: Contact) => void
    updateContact?: (contact: Contact) => void
    //contactCardDisplayStatus?: boolean
    //setContactCardDisplayStatus?: (status: boolean) => void
}

export default function ContactCard({ contact, addContact, updateContact,
    //contactCardDisplayStatus=true, 
    //setContactCardDisplayStatus
}: ContactCardProps) {

    const [contactToAddOrUpdate, setContactToAddOrUpdate] = React.useState<Contact>(contact)


    const muiTheme = useTheme();

    ///////////// Encore besoin ??????????
    React.useEffect(() => {
        setContactToAddOrUpdate(contact)    // Sinon quand on clic ne change rien !
    }, [contact])

    console.log("contactToAddOrUpdate", contactToAddOrUpdate)
    console.log("dateOfNextCall", contactToAddOrUpdate.dateOfNextCall)
    console.log("dateOfNextCall?.toDate()", contactToAddOrUpdate.dateOfNextCall?.toDate())

    const handleChangeText = (attribut: keyof Contact) => (event: React.ChangeEvent<HTMLInputElement>) => {
        //console.log("event.target.value", event.target.value)
        setContactToAddOrUpdate({ ...contactToAddOrUpdate, [attribut]: event.target.value })
        // handleUpdateContact({ ...contact, [attribut]: event.target.value })
    }
    const handleChangeSelect = (event: SelectChangeEvent, attribut: keyof Contact) => {
        const type: BusinessCatType = event.target.value as BusinessCatType       // obligé de mettre as businessCategory car sinon type = string, on peut faire autrement ???
        setContactToAddOrUpdate({ ...contactToAddOrUpdate, [attribut]: type })
    };
    const handleChangeDate = (newDate: Dayjs | null, attribut: keyof Contact) => {
        console.log("newDate", newDate)
        //setContactToAddOrUpdate({...contactToAddOrUpdate, [attribut]: newDate ? Timestamp.fromDate(newDate.toDate()) : null })
    }



    const findLabelNafCodes = (code: string) => {
        const codesNaf = require('../nafCodes.json');       // donc codesNaf = à ce qu'on a dans nafCodes.json => un tableau d'objets
        const naf: CodeNaf = codesNaf.find((codeAndLabel: CodeNaf) => codeAndLabel.id === code);

        //naf && console.log("----------", naf.id)
        //naf && console.log(naf.label)

        return naf ? naf.label : ''
    }



    const [progresspercent, setProgresspercent] = React.useState(0);

    const handleSubmitLogo = (e: any) => {
        e.preventDefault()
        console.log("e", e)
        console.log("e.target", e.target)
        const file = e.target[0]?.files[0]
        if (!file) return;
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("downloadURL", downloadURL)
                    setContactToAddOrUpdate({ ...contactToAddOrUpdate, logo: downloadURL })
                });
            }
        );
    }


    return (
        //JSON.stringify(contact) === '{}' ? <div></div> :
        <Card key={contact.id} elevation={3}
            sx={{
                my: "3%",
                position: "relative",
                mx: "auto",
                padding: "5%",
                maxWidth: "850px",
                bgcolor: 'lightCyan.light',
                //backgroundColor: muiTheme.palette.primary.light,
            }}        // my = 0.5rem (donc 1/2 taille de la police de la racine (em pour l'élément))
        >
            <FormControl
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 7,
                }}
            >
                <Box sx={{
                    display: 'flex', justifyContent: "space-between" //width:"100%"
                    //alignItems: 'center', gap: 2, 
                }}
                >
                    <TextField required id="outlined-basic" label="Nom" variant="outlined" value={contactToAddOrUpdate.businessName}
                        onChange={handleChangeText("businessName")} sx={{ width: "40%" }}
                        inputProps={{
                            style: { color: muiTheme.palette.primary.dark, }
                        }}
                    />

                    {/* <TextField id="outlined-basic" label="Secteur d'activité" variant="outlined" value={findLabelNafCodes(contactToAdd.businessActivity)} /> */}

                    <Box sx={{ display: "flex", width: "50%" }} >
                        <Box sx={{ marginRight:"10px" }}>
                            {/* => FormControl n'est pas conçu pour gérer les soumissions de formulaire. */}

                            <form onSubmit={handleSubmitLogo} className='form'>
                                <TextField
                                    color="secondary"
                                    name="upload-photo"
                                    type="file"
                                //onChange={handleChangeLogo}
                                />
                                <Button
                                    sx={{marginTop:"10px"}}
                                    //component="label"
                                    type="submit"
                                    variant="contained" startIcon={<CloudUploadIcon />}
                                //onClick={handleChangeLogo}
                                >
                                    Télécharger le logo
                                    {/* <VisuallyHiddenInput type="file" /> */}
                                </Button>
                            </form>
                            {/* <Box >
                            <Box className='innerbar' sx={{ width: `${progresspercent}%`, backgroundColor: "red" }}>{progresspercent}%</Box>
                        </Box> */}
                            <LinearProgress variant="determinate" value={progresspercent} sx={{marginTop:"10px"}} />
                            {/* } */}
                        </Box>
                        {contact.logo
                            ? <Avatar variant="rounded" src={contactToAddOrUpdate.logo}
                                sx={{ width: 150, height: 150 }} />
                            : <Avatar variant="rounded" sx={{ bgcolor: grey[500], fontSize: "9px", width: 150, height: 150 }} >{contactToAddOrUpdate.businessName}</Avatar>
                        }



                    </Box>
                </Box>



                <Box sx={{ display: 'flex', justifyContent: "space-around", marginBottom: "30px" }} >
                    <Box sx={{}} >
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px"
                        }}> {/* Sinon on pouvait mettre un float:right sur le bouton ci-dessous */}
                            {/* <NotificationsNoneOutlinedIcon sx={{ color: pink[800] }} /> */}
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Date de RELANCE</Typography>
                            <Tooltip title="Supprimer la date">
                                <IconButton color="primary" sx={{ padding: 0 }}       // Car les boutons ont automatiquement un padding
                                    onClick={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, dateOfNextCall: null })} >
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <DatePicker
                            format="DD MMM YYYY"
                            value={contactToAddOrUpdate.dateOfNextCall !== null ? dayjs(contactToAddOrUpdate.dateOfNextCall?.toDate()) : null}
                            onChange={(newDate: Dayjs | null) => setContactToAddOrUpdate({ ...contactToAddOrUpdate, dateOfNextCall: newDate ? Timestamp.fromDate(newDate.toDate()) : null })}
                            slotProps={{
                            }}
                            label={contactToAddOrUpdate.dateOfNextCall === null ? "JJ mmm AAAA" : ""}
                        />
                    </ Box>
                    <Box>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px"
                        }}>
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Date du PREMIER appel</Typography>
                            <Tooltip title="Supprimer la date">
                                <IconButton color="primary" sx={{ padding: 0 }}       // Car les boutons ont automatiquement un padding
                                    onClick={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, dateOfFirstCall: null })} >
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <DatePicker
                            format="DD MMM YYYY"
                            value={contactToAddOrUpdate.dateOfFirstCall !== null ? dayjs(contactToAddOrUpdate.dateOfFirstCall.toDate()) : null}
                            onChange={(newDate: Dayjs | null) => setContactToAddOrUpdate({ ...contactToAddOrUpdate, dateOfFirstCall: newDate ? Timestamp.fromDate(newDate.toDate()) : null })}
                            slotProps={{
                            }}
                            label={contactToAddOrUpdate.dateOfFirstCall === null ? "JJ mmm AAAA" : ""}
                        />
                    </ Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: "space-between" }} >
                    <FormControlLabel control={<Switch
                        checked={contactToAddOrUpdate.isClient}
                        onChange={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, isClient: !contactToAddOrUpdate.isClient })}
                        color="success"
                        inputProps={{ 'aria-label': 'controlled' }}
                    />} label={contactToAddOrUpdate.isClient ? "Client" : "Prospect"} />

                    <FormControl sx={{ width: "40%" }} >
                        <InputLabel id="checkbox-type-label">Type</InputLabel>
                        <Select
                            id="checkbox-type-label"
                            value={contactToAddOrUpdate.contactType}
                            onChange={(e) => handleChangeSelect(e, "contactType")}

                            inputProps={{
                                style: { color: muiTheme.palette.primary.dark, }
                            }}
                        >
                            {contactTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: "40%" }} >
                        <InputLabel id="checkbox-type-label">Catégorie</InputLabel>
                        <Select
                            id="checkbox-type-label"
                            value={contactToAddOrUpdate.businessCategory}
                            onChange={(e) => handleChangeSelect(e, "businessCategory")}
                        >
                            {sortedBusinessCategories.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: "space-between" }} >
                    <TextField id="outlined-basic" label="Ville" variant="outlined" value={contactToAddOrUpdate.businessCity} onChange={handleChangeText("businessCity")} sx={{ width: "40%" }} />
                    <TextField id="outlined-basic" label="Adresse" variant="outlined" value={contactToAddOrUpdate.businessAddress} onChange={handleChangeText("businessAddress")} sx={{ width: "55%" }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: "space-between" }} >
                    <TextField id="outlined-basic" label="Téléphone DIRECT" variant="outlined" value={contactToAddOrUpdate.contactPhone} onChange={handleChangeText("businessPhone")} sx={{ width: "48%" }} />
                    <TextField id="outlined-basic" label="Téléphone STANDARD" variant="outlined" value={contactToAddOrUpdate.businessPhone} onChange={handleChangeText("businessPhone")} sx={{ width: "48%" }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: "space-between" }} >

                    <TextField id="outlined-basic" label="Email DIRECT" variant="outlined" value={contactToAddOrUpdate.contactEmail} onChange={handleChangeText("businessEmail")} sx={{ width: "32%" }} />
                    <TextField id="outlined-basic" label="Email ENTREPRISE" variant="outlined" value={contactToAddOrUpdate.businessEmail} onChange={handleChangeText("businessEmail")} sx={{ width: "32%" }} />
                    <TextField id="outlined-basic" label="Website" variant="outlined" value={contactToAddOrUpdate.businessWebsite} onChange={handleChangeText("businessWebsite")} sx={{ width: "32%" }} />
                </Box>
                {/* <TextField id="outlined-basic" label="Nom du contact" variant="outlined" value={contactToAdd.contactName} onChange={handleChangeText("contactName")} />
                <TextField id="outlined-basic" label="Téléphone du contact" variant="outlined" value={contactToAdd.contactPhone} onChange={handleChangeText("contactPhone")} />
                <TextField id="outlined-basic" label="Email du contact" variant="outlined" value={contactToAdd.contactEmail} onChange={handleChangeText("contactEmail")} />
                <TextField id="outlined-basic" label="Poste du contact" variant="outlined" value={contactToAdd.contactPosition} onChange={handleChangeText("contactPosition")} />
                <TextField id="outlined-basic" label="Commentaires" variant="outlined" value={contactToAdd.comments} onChange={handleChangeText("comments")} />       */}


                {/* <IconButton>
                    <Edit sx={{ fontSize: 14 }} />
                </IconButton> */}

                {addContact && <Button variant="contained" sx={{ width: '100%', mt: 1, mb: 2 }} onClick={() => addContact(contactToAddOrUpdate)} >Ajouter comme contact</Button>}
                {updateContact && <Button variant="contained" color='pink' sx={{ width: '100%', mt: 1, mb: 2 }} onClick={() => updateContact(contactToAddOrUpdate)} >Mettre à jour le contact</Button>}
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

        </Card>
    )
}
