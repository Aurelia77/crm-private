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
import { contactTypes } from '../utils/toolbox'
import dayjs, { Dayjs } from 'dayjs';       // npm install dayjs
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
//import { ClearIcon, DatePicker } from '@mui/x-date-pickers';      // Bizarre ça a l'air de marcher aussi comme ça !!!???
import { Timestamp } from 'firebase/firestore';
import { useTheme } from '@mui/material/styles';
import { storage, addFileOnFirebaseDB, getCategoriesFromDatabase } from '../utils/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { MuiFileInput } from 'mui-file-input';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import { Input } from '@mui/material';
import {handleOpenFile} from '../utils/firebase'
import { Tab, Tabs } from '@mui/material';
import { TabPanel } from '../utils/StyledComponents';
import {getFilesFromDatabase} from '../utils/firebase'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';


type ContactCardProps = {
    contact: Contact;
    currentUserId: any
    addContact?: (contact: Contact) => void
    updateContact?: (contact: Contact) => void
    //contactCardDisplayStatus?: boolean
    //setContactCardDisplayStatus?: (status: boolean) => void
}

export default function ContactCard({ contact, currentUserId, addContact, updateContact, 
    //contactCardDisplayStatus=true, 
    //setContactCardDisplayStatus
}: ContactCardProps) {

    const [contactToAddOrUpdate, setContactToAddOrUpdate] = React.useState<Contact>(contact)
    const [tabValue, setTabValue] = React.useState(0);


    console.log("contactToAddOrUpdate", contactToAddOrUpdate)

    const muiTheme = useTheme();

    const [progresspercentLogo, setProgresspercentLogo] = React.useState(0);
    const [progresspercentFile, setProgresspercentFile] = React.useState(0);
    const [filesFirebaseArray, setFilesFirebaseArray] = React.useState<FileNameAndRefType[]>([])
    const [firebaseFileSelected, setFirebaseFileSelected] = React.useState<FileNameAndRefType>({fileName:"", fileRef:""})
    const [categoriesList, setCategoriesList] = React.useState<string[]>([]);
  
  
    React.useEffect(() => {
     
      getCategoriesFromDatabase(currentUserId).then((categories: string[]) => {
        setCategoriesList(categories.sort((a, b) => a.localeCompare(b)));
      })
    }, [currentUserId]);



    React.useEffect(() => {
        //console.log("User Effect READ")

        getFilesFromDatabase(currentUserId).then((filesList) => {
            setFilesFirebaseArray(filesList)
            filesList.length > 0 && setFirebaseFileSelected({fileName:filesList[0].fileName, fileRef:filesList[0].fileRef})
        });

    }, [currentUserId])


    console.log("filesArray", filesFirebaseArray)

    ///////////// Encore besoin ??????????
    React.useEffect(() => {
        setContactToAddOrUpdate(contact)    // Sinon quand on clic ne change rien !
    }, [contact])

    console.log("contactToAddOrUpdate", contactToAddOrUpdate)
    //console.log("files", contactToAddOrUpdate.filesSent)
    //console.log(typeof contactToAddOrUpdate.filesSent)
    //contactToAddOrUpdate.filesSent.length > 0 && console.log(typeof contactToAddOrUpdate.filesSent[0])
    // console.log("dateOfNextCall", contactToAddOrUpdate.dateOfNextCall)
    // console.log("dateOfNextCall?.toDate()", contactToAddOrUpdate.dateOfNextCall?.toDate())

    const handleChangeText = (attribut: keyof Contact) => (event: React.ChangeEvent<HTMLInputElement>) => {
        //console.log("event.target.value", event.target.value)
        setContactToAddOrUpdate({ ...contactToAddOrUpdate, [attribut]: event.target.value })
        // handleUpdateContact({ ...contact, [attribut]: event.target.value })
    }
    const handleChangeSelect = (event: SelectChangeEvent, attribut: keyof Contact) => {
        const type: string = event.target.value as string       // obligé de mettre as businessCategory car sinon type = string, on peut faire autrement ???
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



   

    const handleSubmitFiles = (e: any, attribut: string) => {
        e.preventDefault()
        console.log("e", e)
        console.log("e.target", e.target)
        console.log("e.target", e.target.elements)
        console.log("e.target", e.target.elements[0])
        console.log("e.target", e.target.elements[0].files)
        console.log("e.target", e.target.elements[0].files[0])
        //const file = e.target[0]?.files[0]
        const file = e.target.elements[0].files[0]
        if (!file) return;
        const storageRef = ref(storage, `${attribut}/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        console.log(uploadTask)


        uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    attribut === "logo"
                        ? setProgresspercentLogo(progress)
                        : setProgresspercentFile(progress)
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    addFileOnFirebaseDB(currentUserId, { fileName: file.name, fileRef: downloadURL })
                    
                    console.log("downloadURL", downloadURL)
                    attribut === "logo"
                        ? setContactToAddOrUpdate({ ...contactToAddOrUpdate, [attribut]: downloadURL })
                        : setContactToAddOrUpdate({ ...contactToAddOrUpdate, [attribut]: [...contactToAddOrUpdate.filesSent, { fileName: file.name, fileRef: downloadURL }] })
                });
            }
        );
    }

    const handleChangeSelectFirebaseFile = () => {

        setContactToAddOrUpdate({ ...contactToAddOrUpdate, filesSent: [...contactToAddOrUpdate.filesSent, { fileName: firebaseFileSelected.fileName, fileRef: firebaseFileSelected.fileRef }] })
    }

    const removeFile = (file: FileNameAndRefType) => {
        console.log(file.fileRef)
        console.log(file.fileName)
        setContactToAddOrUpdate({ ...contactToAddOrUpdate, filesSent: contactToAddOrUpdate.filesSent.filter((oneFile: FileNameAndRefType) => oneFile.fileRef !== file.fileRef) })
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 7,
                }}
            >
                {/* ///////// NOM et LOGO ///////// */}
                <Box sx={{
                    display: 'flex', justifyContent: "space-between" //width:"100%"
                    //alignItems: 'center', gap: 2, 
                }}
                >
                    <TextField
                        required
                        id="outlined-basic"
                        label="Nom"
                        variant="outlined"
                        value={contactToAddOrUpdate.businessName}
                        onChange={handleChangeText("businessName")} sx={{ width: "40%" }}
                        inputProps={{
                            style: { color: muiTheme.palette.primary.dark, }
                        }}
                        color={contactToAddOrUpdate.businessName ? "success" : "error"}
                    />

                    {/* <TextField id="outlined-basic" label="Secteur d'activité" variant="outlined" value={findLabelNafCodes(contactToAdd.businessActivity)} /> */}

                    <Box sx={{ display: "flex", width: "50%" }} >
                        <Box sx={{ marginRight: "10px" }}>
                            {/* => FormControl n'est pas conçu pour gérer les soumissions de formulaire. */}

                            <form onSubmit={(e) => handleSubmitFiles(e, "logo")} >
                                {/* <TextField
                                    color="secondary"
                                    name="upload-photo"
                                    type="file"
                                //onChange={handleChangeLogo}
                                /> */}

                                <Input type="file" />

                                <Button
                                    sx={{ marginTop: "10px" }}
                                    //component="label"
                                    type="submit"
                                    variant="contained" startIcon={<CloudUploadIcon />}
                                //onClick={handleChangeLogo}
                                >
                                    Télécharger le logo
                                    {/* <VisuallyHiddenInput type="file" /> */}
                                </Button>
                            </form>
                            {/* <Box className='innerbar' sx={{ width: `${progresspercent}%`, backgroundColor: "red" }}>{progresspercent}%</Box>
                        </Box> */}
                            <LinearProgress variant="determinate" value={progresspercentLogo} sx={{ marginTop: "10px" }} />

                            {contactToAddOrUpdate.logo &&
                                <Button variant="contained" color="error" sx={{ marginTop: "10px" }} onClick={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, logo: "" })} >Supprimer le logo</Button>}
                        </Box>
                        <Avatar
                            variant="rounded"
                            src={contactToAddOrUpdate.logo
                                ? contactToAddOrUpdate.logo
                                : ""}
                            sx={{ width: "150px", height: "150px" }}
                        >
                            {contactToAddOrUpdate.logo ? "" : "Pas de logo"}
                        </Avatar>
                    </Box>
                </Box>

                {/* ///////// DATES ///////// */}
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

                {/* ///////// CLIENT - TYPE - CAT ///////// */}
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
                            {categoriesList.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* ///////// VILLE et ADRESSE ///////// */}
                <Box sx={{ display: 'flex', justifyContent: "space-between" }} >
                    <TextField id="outlined-basic" label="Ville" variant="outlined" value={contactToAddOrUpdate.businessCity} onChange={handleChangeText("businessCity")} sx={{ width: "40%" }} />
                    <TextField id="outlined-basic" label="Adresse" variant="outlined" value={contactToAddOrUpdate.businessAddress} onChange={handleChangeText("businessAddress")} sx={{ width: "55%" }} />
                </Box>

                {/* ///////// NOM Contact, POSITION ///////// */}
                <Box sx={{ display: 'flex', justifyContent: "space-between" }} >
                    <TextField id="outlined-basic" label="Nom Contact DIRECT" variant="outlined" value={contactToAddOrUpdate.contactName} onChange={handleChangeText("contactName")} sx={{ width: "60%" }} />
                    <TextField id="outlined-basic" label="Position" variant="outlined" value={contactToAddOrUpdate.contactPosition} onChange={handleChangeText("contactPosition")} sx={{ width: "30%" }} />
                </Box>

                {/* ///////// Tel Contact, Email ///////// */}
                <Box sx={{ display: 'flex', justifyContent: "space-between" }} >
                    <TextField id="outlined-basic" label="Téléphone DIRECT" variant="outlined" value={contactToAddOrUpdate.contactPhone} onChange={handleChangeText("contactPhone")} sx={{ width: "45%" }} />
                    <TextField id="outlined-basic" label="Email DIRECT" variant="outlined" value={contactToAddOrUpdate.contactEmail} onChange={handleChangeText("businessEmail")} sx={{ width: "45%" }} />
                </Box>

                {/* ///////// Tel STANDARD, Email STANDARD et SITE WEB ///////// */}
                <Box sx={{ display: 'flex', justifyContent: "space-between" }} >
                    <TextField id="outlined-basic" label="Téléphone STANDARD" variant="outlined" value={contactToAddOrUpdate.businessPhone} onChange={handleChangeText("businessPhone")} sx={{ width: "30%" }} />
                    <TextField id="outlined-basic" label="Email ENTREPRISE" variant="outlined" value={contactToAddOrUpdate.businessEmail} onChange={handleChangeText("businessEmail")} sx={{ width: "30%" }} />
                    <TextField id="outlined-basic" label="Site WEB" variant="outlined" value={contactToAddOrUpdate.businessWebsite} onChange={handleChangeText("businessWebsite")} sx={{ width: "30%" }} />
                </Box>

                {/* ///////// COMMENTAIRES ///////// */}
                <TextField
                    multiline
                    id="outlined-basic"
                    label="Commentaires"
                    variant="outlined"
                    value={contactToAddOrUpdate.comments}
                    onChange={handleChangeText("comments")}
                />

                {/* ///////// FICHIERS ///////// */}
                <Box sx={{ marginRight: "10px", position:"relative" }}>
                    <Typography variant="h6">Fichiers associés au contact ({contactToAddOrUpdate.filesSent.length})</Typography>

                    <Typography 
                        //variant="caption" 
                        component="div"
                        sx={{ color: "text.secondary" }}
                    >
                        {contactToAddOrUpdate.filesSent.map((file, index) => (
                            <Box key={index} sx={{ display:"flex", alignItems:"center" }} >
                                <ArrowRightIcon sx={{ color: "text.secondary" }} />
                                <Button
                                    onClick={() => handleOpenFile(file.fileRef)}
                                >
                                    {index + 1} - {file.fileName}<br />
                                </Button>
                                <Tooltip title="Désassocier ce fichier du contact">
                                    <IconButton
                                        size="small" 
                                        color="error"                                         
                                        onClick={() => removeFile(file)} 
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ))}
                    </Typography>

                    {/* <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {contactToAddOrUpdate.filesSent.length} fichier(s)<br />
                        {contactToAddOrUpdate.filesSent.map((file, index) => (
                            <React.Fragment key={index}>
                                --{file instanceof File ? <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer">{file.name}</a> : file.name}<br />
                            </React.Fragment>
                        ))}
                    </Typography> */}

                    {/* <MuiFileInput
                        value={contactToAddOrUpdate.filesSent}
                        onChange={handleChangeFile}
                    /> */}


                    <Tabs
                        sx={{ marginTop:"30px" }}
                        value={tabValue}
                        onChange={(e, newValue: number) => setTabValue(newValue)}
                        aria-label="Horizontal tabs"
                    //sx={{ borderRight: 1, borderColor: 'divider', width: "120px" }}
                    >

                        <Tab key={0} label="Ajout fichier existant"
                        //icon={title.icon}
                        // {...a11yProps(index)} 
                        />
                        <Tab key={1} label="Ajout nouveau fichier"
                        //icon={title.icon}
                        // {...a11yProps(index)} 
                        />                       
                    </Tabs>

                    <TabPanel key="0" value={tabValue} index={0}  >
                        <FormControl sx={{ margin:"30px", width: "50%"}} >
                            <InputLabel id="checkbox-type-label">Choisir un fichier existant</InputLabel>
                            <Select
                                id="checkbox-type-label"
                                //sx={{ width: "200px" }}
                                value={firebaseFileSelected.fileRef}
                                name={firebaseFileSelected.fileName}
                                onChange={(e) => setFirebaseFileSelected({fileName:e.target.name, fileRef:e.target.value})}                               
                            >
                                {filesFirebaseArray.map((file) => (
                                 
                                   
                                    //     <Tooltip title="Associer au contact">
                                    //         <IconButton color="secondary" sx={{
                                    //             //padding: 0, 
                                    //             //marginLeft:"10px" 
                                    //         }}       // Car les boutons ont automatiquement un padding
                                    //         //</Tooltip>onClick={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, dateOfNextCall: null })} 
                                    //         >
                                    //             <AddIcon
                                    //             //fontSize='small' sx={{ marginRight: "10px" }} 
                                    //             />
                                    //         </IconButton>
                                    //     </Tooltip>

                                    <MenuItem
                                        key={file.fileRef}
                                        value={file.fileRef}
                                    //onClick={() => handleOpenFile(file.fileRef)}
                                    >
                                        {/* <Box>
                                            <Tooltip title="Voir le fichier">
                                                <IconButton
                                                    onClick={() => handleOpenFile(file.fileRef)}
                                                    color="primary" sx={{
                                                        //padding: 0, 
                                                        //marginLeft:"10px" 
                                                    }}       // Car les boutons ont automatiquement un padding
                                                >
                                                    <VisibilityIcon
                                                    //fontSize='small'
                                                    // sx={{ marginRight: "10px" }} 
                                                    />
                                                </IconButton>
                                            </Tooltip> */}
                                            {file.fileName}
                                        {/* </Box> */}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Box sx={{ display:"flex", justifyContent:"space-between" }} >
                                <Button
                                    sx={{ marginTop: "10px" }}
                                    color= "secondary"
                                    //component="label"
                                    type="submit"
                                    variant="contained" startIcon={<VisibilityIcon />}
                                    onClick={() => handleOpenFile(firebaseFileSelected.fileRef)}
                                >
                                    Voir le fichier
                                </Button>
                                <Button
                                    sx={{ marginTop: "10px" }}
                                    //component="label"
                                    type="submit"
                                    variant="contained" startIcon={<AddIcon />}
                                    onClick={handleChangeSelectFirebaseFile}
                                >
                                    Associer ce fichier
                                </Button>
                            </Box>
                        </FormControl>                       
                    </TabPanel>

                    <TabPanel key="1" value={tabValue} index={1}  >
                         {/* => FormControl n'est pas conçu pour gérer les soumissions de formulaire. */}
                        <form style={{ margin:"30px"}} onSubmit={(e) => handleSubmitFiles(e, "filesSent")} >
                            <Input type="file" />
                            <Button
                                sx={{ marginTop: "10px" }}
                                //component="label"
                                type="submit"
                                variant="contained" startIcon={<CloudUploadIcon />}
                            //onClick={handleChangeLogo}
                            >
                                Télécharger le fichier
                            </Button>
                        </form>
                        <LinearProgress
                            variant="determinate"
                            value={progresspercentFile}
                            sx={{ marginTop: "10px" }} />                       
                    </TabPanel>
                   
                    {contactToAddOrUpdate.filesSent &&
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ marginTop: "10px", position:"absolute", top:0, right:0 }}
                            onClick={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, filesSent: [] })} >Supprimer tous les fichiers associés</Button>} 
                </Box>


                {/* <IconButton>
                    <Edit sx={{ fontSize: 14 }} />
                </IconButton> */}

                {addContact && <Button variant="contained" sx={{ width: '100%', mt: 1, mb: 2 }} onClick={() => addContact(contactToAddOrUpdate)} >Ajouter comme contact</Button>}
                {updateContact && <Button variant="contained" color='pink' sx={{ width: '100%', mt: 1, mb: 2 }} onClick={() => updateContact(contactToAddOrUpdate)} >Mettre à jour le contact</Button>}
            </Box>

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
