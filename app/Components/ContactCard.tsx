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
import { TextField, Stack, Button, FormControl, InputLabel, MenuItem, Autocomplete, Chip, ListItem, List, OutlinedInput, Checkbox, ListItemText, FormControlLabel, Tooltip, Modal, Rating, Link, InputAdornment, Alert } from '@mui/material'
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import { Input } from '@mui/material';
import { handleOpenFile } from '../utils/firebase'
import { Tab, Tabs } from '@mui/material';
import { TabPanel } from '../utils/StyledComponents';
import { getFilesFromDatabase } from '../utils/firebase'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { modalStyle } from '../utils/StyledComponents'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import MailIcon from '@mui/icons-material/Mail';
import LanguageIcon from '@mui/icons-material/Language';
import PsychologyAlt from '@mui/icons-material/PsychologyAlt';
import { StyledRating, StyledRatingStars, IconContainer, customIcons } from '../utils/StyledComponents';
import SettingsIcon from '@mui/icons-material/Settings';

import Zoom from '@mui/material/Zoom';

import { isDatePassed, isDateSoon } from '../utils/toolbox'
import { truncate } from 'fs';


type ContactCardProps = {
    contact: Contact
    currentUserId: any
    getPriorityTextAndColor: (priority: number | null) => { text: string, color: string }
    setHasContactInfoChanged: (status: boolean) => void
    handleDeleteContact?: (id: string) => void
    addContact?: (contact: Contact) => void
    updateContact?: (contact: Contact) => void
    //contactCardDisplayStatus?: boolean
    //setContactCardDisplayStatus?: (status: boolean) => void
}

export default function ContactCard({ contact, currentUserId, getPriorityTextAndColor, setHasContactInfoChanged, handleDeleteContact, addContact, updateContact,
    //contactCardDisplayStatus=true, 
    //setContactCardDisplayStatus
}: ContactCardProps) {

    const [contactToAddOrUpdate, setContactToAddOrUpdate] = React.useState<Contact>(contact)
    const [tabValue, setTabValue] = React.useState<number>(0);
    const [logoChoosen, setIsLogoChoosen] = React.useState(false);

    console.log("tabValue x", tabValue)
    console.log("tabValue x", typeof tabValue)

    //console.log("contactToAddOrUpdate", contactToAddOrUpdate)
    //console.log("LOGO", contactToAddOrUpdate.logo)

    const muiTheme = useTheme();

    const inputFileRef = React.useRef<HTMLInputElement>(null);

    //console.log("inputFileRef", inputFileRef)


    const [progresspercentLogo, setProgresspercentLogo] = React.useState(0);
    const [progresspercentFile, setProgresspercentFile] = React.useState(0);
    const [filesFirebaseArray, setFilesFirebaseArray] = React.useState<FileNameAndRefType[]>([])
    const [firebaseFileSelected, setFirebaseFileSelected] = React.useState<FileNameAndRefType>({ fileName: "", fileRef: "" })

    const [newFileName, setNewFileName] = React.useState<string | null>(null);



    console.log("newFileName", newFileName)

    //console.log("firebaseFileSelected", firebaseFileSelected)

    const [categoriesList, setCategoriesList] = React.useState<ContactCategorieType[]>([]);


    const [openDeleteContactModal, setOpenDeleteContactModal] = React.useState(false);
    const [openDeleteContactFileModal, setOpenDeleteContactFileModal] = React.useState(false);
    const [openDeleteContactFilesModal, setOpenDeleteContactFilesModal] = React.useState(false);
    const [openContactIsUpdatedModal, setOpenContactIsUpdatedModal] = React.useState(false);

    const [alertFileText, setAlertFileText] = React.useState("");



    const handleClickDeleteContact = () => {
        handleDeleteContact && handleDeleteContact(contact.id)
    }

    const handleChangeExistingFile = (e: any) => {
        const selectedFileRef = e.target.value;
        const selectedFile = filesFirebaseArray.find(file => file.fileRef === selectedFileRef);

        setFirebaseFileSelected({ fileName: selectedFile?.fileName ?? "", fileRef: selectedFileRef })
    }   

    React.useEffect(() => {

        //console.log("USE EFFECT !!!!!!!")

        getFilesFromDatabase(currentUserId).then((filesList) => {
            setFilesFirebaseArray(filesList)
            // filesList.length > 0 && setFirebaseFileSelected({ fileName: filesList[0].fileName, fileRef: filesList[0].fileRef })
        });

        getCategoriesFromDatabase(currentUserId).then((categories: ContactCategorieType[]) => {
            //console.log("categories", categories)

            // Pas besoin de l'attribut userId donc on garde juste ce qu'on veut
            const newCategoriesList = categories.map(category => ({
                id: category.id,
                label: category.label
            }));
            setCategoriesList(newCategoriesList);
        })

    }, [currentUserId]);


    React.useEffect(() => {
        console.log("****Comparaison des contacts")
        JSON.stringify(contact) !== JSON.stringify(contactToAddOrUpdate) && console.log("****CHANGE")
        JSON.stringify(contact) !== JSON.stringify(contactToAddOrUpdate) && setHasContactInfoChanged(true)
    }, [contactToAddOrUpdate])


    ///////////// Encore besoin ??????????
    // React.useEffect(() => {
    //     setContactToAddOrUpdate(contact)    // Sinon quand on clic ne change rien !
    // }, [contact])

    //console.log("contactToAddOrUpdate", contactToAddOrUpdate)
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


    const handleChangeInputFile = (e: any) => {
        console.log(e.target.files[0])
        setNewFileName(e.target.files[0].name)
    }


    const handleSubmitFiles = (e: any, attribut: string) => {
        e.preventDefault()
        // console.log("e", e)
        // console.log("e.target", e.target)
        // console.log("e.target", e.target.elements)
        // console.log("e.target", e.target.elements[0])
        // console.log("e.target", e.target.elements[0].files)
        // console.log("e.target", e.target.elements[0].files[0])
        //const file = e.target[0]?.files[0]

        if (newFileName === "") {
            setAlertFileText("Le nom du fichier doit contenir au moins un caractère !")
            return
        }

        setAlertFileText("")


        const file = e.target.elements[0].files[0]

        if (!file) return;
        const storageRef = ref(storage, `${attribut}/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        console.log(uploadTask)


        uploadTask.on("state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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
                    if (attribut === "logo") {
                        setContactToAddOrUpdate({ ...contactToAddOrUpdate, [attribut]: downloadURL })
                        setIsLogoChoosen(false)
                        setProgresspercentLogo(0)
                    } else {
                        setContactToAddOrUpdate({ ...contactToAddOrUpdate, [attribut]: [...contactToAddOrUpdate.filesSent, { fileName: newFileName, fileRef: downloadURL }] })
                        setProgresspercentFile(0)
                        setNewFileName(null);
                    }
                });
            }
        );
    }



    const handleChangeInputLogo = () => {
        setIsLogoChoosen(true)
        setContactToAddOrUpdate({ ...contactToAddOrUpdate, logo: "" })
    }

    const handleChangeSelectFirebaseFile = () => {

        setContactToAddOrUpdate({ ...contactToAddOrUpdate, filesSent: [...contactToAddOrUpdate.filesSent, { fileName: firebaseFileSelected.fileName, fileRef: firebaseFileSelected.fileRef }] })
        setFirebaseFileSelected({ fileName: "", fileRef: "" })
    }

    const removeFile = (file: FileNameAndRefType) => {
        console.log(file.fileRef)
        console.log(file.fileName)
        setContactToAddOrUpdate({ ...contactToAddOrUpdate, filesSent: contactToAddOrUpdate.filesSent.filter((oneFile: FileNameAndRefType) => oneFile.fileRef !== file.fileRef) })
        setOpenDeleteContactFileModal(false)
    }

    const handleChangeNumber = (number: number | null, attribut: string) => {
        //console.log(number);      // Obligé de mettre ; sinon erreur !!! (Uncaught TypeError: console.log(...) is not a function)
        //newGauge && console.log(newGauge)

        // (number && (number > 5 || number < 0))
        //     ? alert("Doit être entre 0 et 5 !")
        //    : 
        setContactToAddOrUpdate({ ...contactToAddOrUpdate, [attribut]: number })
    }

    const handleUpdateContact = () => {
        setHasContactInfoChanged(false)
        updateContact && updateContact(contactToAddOrUpdate)
        setOpenContactIsUpdatedModal(true)
    }






    return (
        // <Zoom in={transition} // Non car erreur avec Tabs !!!
        // //timeout={500}   
        // //style={{ transitionDelay: transition ? '500ms' : '0ms' }}        
        // >
        <Card key={contact.id} elevation={3}
            sx={{
                margin: "auto",
                //m: "1%",
                position: "relative",
                //mx: "auto",
                padding: "2% 4%",
                //maxWidth: "850px",
                bgcolor: 'lightCyan.light',
                //backgroundColor: muiTheme.palette.primary.light,
            }}        // my = 0.5rem (donc 1/2 taille de la police de la racine (em pour l'élément))
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                }}
            >
                {/* ///////// CLIENT - SMILEYS - PRIORITY ///////// */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: "space-between"
                    //flexDirection: 'column',
                    //gap: 10,
                }} >
                    {/* ///////// CLIENT */}
                    <Box
                        sx={{
                            width: "80px"
                            //     cursor: "pointer",
                            //     position: "absolute",
                            //     top: 10,
                            //     left: 10
                        }}
                        onClick={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, isClient: !contactToAddOrUpdate.isClient })}
                    >
                        <Tooltip arrow title={`${contactToAddOrUpdate.isClient ? "Client" : "Prospect"} (Cliquer pour changer)`}>
                            {contactToAddOrUpdate.isClient
                                ? <HandshakeOutlinedIcon color='success' //fontSize='large' 
                                    sx={{ width: 60, height: 60 }}
                                />
                                : <PsychologyAltIcon
                                    sx={{
                                        color: muiTheme.palette.gray.main,
                                        width: 60, height: 60,
                                    }}
                                //fontSize='large' 
                                />
                            }
                        </Tooltip>
                    </Box>
                    {/* <FormControlLabel
                            control={<Switch
                                checked={contactToAddOrUpdate.isClient}
                                onChange={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, isClient: !contactToAddOrUpdate.isClient })}
                                color="success"
                                inputProps={{ 'aria-label': 'controlled' }}
                            />}
                            label={contactToAddOrUpdate.isClient ? "Client" : "Prospect"} /> */}


                    {/* {addContact && <Button variant="contained" sx={{ width: '30%', height: "50px", mt: 1, mb: 2 }} onClick={() => addContact(contactToAddOrUpdate)} >Ajouter comme contact</Button>}
                        {updateContact && <Button variant="contained" color='pink' sx={{ width: '30%', height: "50px", mt: 1, mb: 2 }} onClick={() => updateContact(contactToAddOrUpdate)} >Mettre à jour le contact</Button>} */}

                    {/* ////////////// SMILEYS */}
                    <Box
                        sx={{
                            //mt: 8,
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                            }}
                        >

                            {/* {contactToAddOrUpdate.interestGauge && <Tooltip
                                            arrow
                                            title="Supprimer la gauge d'intérêt"
                                            placement='left'
                                        >
                                            <IconButton color="primary" sx={{ padding: 0, position: "absolute", top: -5, right: -15 }}        // Car les boutons ont automatiquement un padding
                                                onClick={() => handleChangeNumber(null, "interestGauge")} >
                                                <ClearIcon fontSize='small' color='error' />
                                            </IconButton>
                                        </Tooltip>} */}
                            <StyledRating
                                //defaultValue={2}
                                sx={{
                                    alignItems: 'center',
                                }}
                                value={contactToAddOrUpdate.interestGauge}
                                onChange={(e, newValue) => handleChangeNumber(newValue, "interestGauge")}
                                IconContainerComponent={IconContainer}
                                getLabelText={(value: number) => customIcons[value].label}
                                highlightSelectedOnly
                            />

                        </Box>
                    </Box>

                    {/* ///////// PRIORITY  */}
                    <FormControl
                        sx={{
                            width: "auto"
                            //     cursor: "pointer",
                            //     position: "absolute",
                            //     top: 10,
                            //     right: 40
                        }}
                    >
                        {/* {contactToAddOrUpdate.priority && <Tooltip
                                arrow
                                title="Supprimer la priorité"
                                placement='left'
                            >
                                <IconButton color="primary" sx={{ padding: 0, position: "absolute", top: 0, right: -25 }}        // Car les boutons ont automatiquement un padding
                                    onClick={() => handleChangeNumber(null, "priority")} >
                                    <ClearIcon fontSize='small' color='error' />
                                </IconButton>
                            </Tooltip>} */}

                        <Box sx={{
                            //'& > legend': { mt: 2 }, 
                            //width:"auto" 
                        }} >
                            {/* <Rating
                                    sx={{ fontSize: '3rem' }}
                                    name="customized-10"
                                    value={contactToAddOrUpdate.priority ?? 0}
                                    onChange={(e, newValue) => handleChangeNumber(newValue, "priority")}
                                    max={3}
                                /> */}
                            <StyledRatingStars
                                sx={{ fontSize: '3rem' }}
                                value={contactToAddOrUpdate.priority ?? 0}
                                onChange={(e, newValue) => handleChangeNumber(newValue, "priority")}
                                max={3}
                                color={getPriorityTextAndColor(contactToAddOrUpdate.priority).color}
                            />
                        </Box>
                    </FormControl>

                </Box>

                {/* ///////// TYPE - CAT- FICHIERS ///////// */}
                <Box sx={{
                    display: 'flex', justifyContent: "space-around",
                    //position:"relative" 
                }} >
                    {/* ///////// CAT */}
                    <FormControl sx={{ width: "auto", backgroundColor: muiTheme.palette.primary.main, borderRadius: "50px" }} >
                        {/* <InputLabel id="checkbox-type-label">Catégorie</InputLabel> */}
                        {categoriesList.length > 0
                            ? <Select
                                sx={{
                                    color: 'white',
                                    textAlign: 'center',
                                    // display: 'flex',
                                    // alignItems: 'center'
                                    margin: "auto",
                                    padding: "25px 10px 25px 30px"
                                }}
                                id="checkbox-type-label"
                                value={contactToAddOrUpdate.businessCategoryId}
                                onChange={(e) => handleChangeSelect(e, "businessCategoryId")}
                                variant="standard"
                                disableUnderline={true}
                            >
                                <MenuItem key="0" value="0">NON DEFINIE</MenuItem>
                                {categoriesList.sort((a, b) => a.label.localeCompare(b.label)).map((cat, index) => (
                                    <MenuItem
                                        key={cat.id}
                                        value={cat.id}
                                        sx={{ backgroundColor: index % 2 === 0 ? muiTheme.palette.gray.light : '' }}
                                    >{cat.label}</MenuItem>
                                ))}
                            </Select>
                            : null
                        }
                    </FormControl>

                    {/* ///////// TYPE */}
                    <FormControl sx={{
                        width: "auto", backgroundColor: muiTheme.palette.purple.dark,
                        borderRadius: "50px"
                    }} >
                        {/* <InputLabel id="checkbox-type-label">Type</InputLabel> */}
                        <Select
                            sx={{
                                color: 'white', 
                                textAlign: 'center',
                                // display: 'flex',
                                // alignItems: 'center'
                                margin: "auto",
                                padding: "25px 10px 25px 30px"
                            }}
                            id="checkbox-type-label"
                            value={contactToAddOrUpdate.contactType}
                            onChange={(e) => handleChangeSelect(e, "contactType")}
                            variant="standard"
                            disableUnderline={true} // {contactToAddOrUpdate.contactType === "NON DEFINI" ? false : true}  
                        >
                            {contactTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* ///////// FICHIERS */}
                    <Box  >
                        <Typography variant="h6">Fichiers associés au contact ({contactToAddOrUpdate.filesSent.length})</Typography>
                        <Typography
                            //variant="caption" 
                            component="div"
                            sx={{ color: "text.secondary" }}
                        >
                            {contactToAddOrUpdate.filesSent.map((file, index) => (
                                <Box key={index} sx={{ display: "flex", alignItems: "center" }} >
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
                    </Box>

                </Box>


                {/* ///////// LOGO et NOM + dates + Boutons TELECHARGEMENT fichier LOGO et SMILEYS  ///////// */}
                <Box>
                    {/* ///////// LOGO et NOM + dates  ///////// */}
                    <Box sx={{
                        display: 'flex', justifyContent: "space-between"
                        //alignItems: 'center', gap: 2, 
                    }}>
                        {/* ///////// LOGO  */}
                        <Box sx={{ width: "15%", mb: "auto", aspectRatio: "1/1" }} >
                            <Tooltip arrow title="Ajouter/modifier le logo puis cliquer sur TELECHARGER pour l'afficher" placement='top' >
                                <Avatar
                                    variant="rounded"
                                    onClick={() => inputFileRef.current?.click()}
                                    //onClick={() => inputFileRef && inputFileRef.current && inputFileRef.current.click()}
                                    src={contactToAddOrUpdate.logo
                                        ? contactToAddOrUpdate.logo
                                        : ""}
                                    sx={{ width: "100%", height: "100%", cursor: "pointer", border: `solid ${getPriorityTextAndColor(contactToAddOrUpdate.priority).color}`, marginTop: "5%" }}
                                >
                                    {contactToAddOrUpdate.logo ? "" : "Aucun logo"}
                                </Avatar>
                            </Tooltip>

                            {/*  Boutons TELECHARGEMENT */}
                            <Box sx={{
                                marginTop: "5px", display: "flex", alignItems: "center",
                            }}>
                                {/* => FormControl n'est pas conçu pour gérer les soumissions de formulaire. */}
                                <form onSubmit={(e) => handleSubmitFiles(e, "logo")}
                                //style={{ display:"flex", alignItems:"center", gap:"50px" }} 
                                >
                                    {/* <TextField
                                            color="secondary"
                                            name="upload-photo"
                                            type="file"
                                        //onChange={handleChangeLogo}
                                        /> */}


                                    <Button variant="contained" component="label" sx={{ color: "white", display: 'none' }} >
                                        <Input
                                            type="file"
                                            ref={inputFileRef}
                                            //sx={{ display: 'none' }}
                                            onChange={handleChangeInputLogo}
                                        />
                                        {/* 1- Choisir */}
                                    </Button>

                                    {logoChoosen &&
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }} >
                                            <Button
                                                color="pink"
                                                //sx={{ p:1 }}
                                                //component="label"
                                                type="submit"
                                                variant="contained" startIcon={<CloudUploadIcon />}
                                            //onClick={handleChangeLogo}
                                            >
                                                Télécharger / afficher
                                                {/* <VisuallyHiddenInput type="file" /> */}
                                            </Button>
                                            <LinearProgress variant="determinate" value={progresspercentLogo} sx={{ marginTop: "10px" }} />
                                        </Box>
                                    }

                                </form>
                                {/* <Box className='innerbar' sx={{ width: `${progresspercent}%`, backgroundColor: "red" }}>{progresspercent}%</Box>
                                </Box> */}

                                {contactToAddOrUpdate.logo && <Button variant="contained" color="error" sx={{
                                    margin: "auto"
                                    //marginTop: "5px" 
                                }} onClick={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, logo: "" })} >Supprimer</Button>}
                            </Box>
                        </Box>

                        {/* ///////// NOM et DATES */}
                        <Box sx={{ width: "80%" }} >

                            {/* ///////// NOM */}
                            <TextField
                                sx={{ width: "100%" }}
                                required
                                id="outlined-basic"
                                //label="Nom"
                                //
                                value={contactToAddOrUpdate.businessName}
                                onChange={handleChangeText("businessName")}
                                inputProps={{
                                    style: {
                                        //color: muiTheme.palette.primary.dark, 
                                        color: getPriorityTextAndColor(contactToAddOrUpdate.priority).color,
                                        fontSize: "2.5em",
                                        fontWeight: "bold",
                                        textAlign: "center"
                                    }
                                }}
                                color={contactToAddOrUpdate.businessName ? "success" : "error"}
                                InputProps={{
                                    startAdornment: contactToAddOrUpdate.businessName.length === 0 && <span style={{ fontSize: "2.5em", marginLeft: "40%" }}>... </span>,
                                    disableUnderline: true
                                    //contactToAddOrUpdate.businessName.length > 0,
                                }}
                            // inputProps={{ 
                            //     style: 
                            //         {color: getPriorityTextAndColor(contact.priority).color ?? ""}
                            // }}
                            />

                            {/* <TextField id="outlined-basic" label="Secteur d'activité"  value={findLabelNafCodes(contactToAdd.businessActivity)} /> */}

                            {/* ///////// DATES ///////// */}
                            <Box sx={{ display: 'flex', justifyContent: "space-around", mt: 8 }} >
                                {/* ///////// 1er APPEL */}
                                <Box sx={{ width: "25%" }} >
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        //marginBottom: "10px"
                                    }}>
                                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>PREMIER appel</Typography>
                                        <Tooltip title="Supprimer la date" placement='top' >
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
                                </Box>

                                {/* ///////// Dernier APPEL */}
                                <Box sx={{ width: "25%" }} >
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "10px"
                                    }}>
                                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>DERNIER appel</Typography>
                                        <Tooltip title="Supprimer la date" placement='top' >
                                            <IconButton color="primary" sx={{ padding: 0 }}       // Car les boutons ont automatiquement un padding
                                                onClick={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, dateOfLastCall: null })} >
                                                <ClearIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <DatePicker
                                        format="DD MMM YYYY"
                                        value={contactToAddOrUpdate.dateOfLastCall !== null ? dayjs(contactToAddOrUpdate.dateOfLastCall.toDate()) : null}
                                        onChange={(newDate: Dayjs | null) => setContactToAddOrUpdate({ ...contactToAddOrUpdate, dateOfLastCall: newDate ? Timestamp.fromDate(newDate.toDate()) : null })}
                                        slotProps={{
                                        }}
                                        label={contactToAddOrUpdate.dateOfLastCall === null ? "JJ mmm AAAA" : ""}
                                    />
                                </Box>

                                {/* ///////// RELANCE */}
                                <Box sx={{
                                    width: "25%",
                                    border: "solid 5px darkRed",
                                    borderRadius: "10px",
                                    p: 1,
                                    //padding:0,
                                    backgroundColor: isDatePassed(contactToAddOrUpdate.dateOfNextCall)
                                        ? muiTheme.palette.warning.light
                                        : isDateSoon(contactToAddOrUpdate.dateOfNextCall)
                                            ? muiTheme.palette.ochre.light
                                            : ""
                                }}
                                >
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "10px",
                                    }}> {/* Sinon on pouvait mettre un float:right sur le bouton ci-dessous */}
                                        {/* <NotificationsNoneOutlinedIcon sx={{ color: pink[800] }} /> */}
                                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: "darkRed", fontWeight: "bold" }}>RELANCE</Typography>
                                        <Tooltip title="Supprimer la date" placement='top' >
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
                                    <Typography variant="caption" sx={{ color: "text.warning" }}>
                                        {isDatePassed(contactToAddOrUpdate.dateOfNextCall)
                                            ? "Attention : La date est passée !!!"
                                            : isDateSoon(contactToAddOrUpdate.dateOfNextCall)
                                                ? "Attention : Relance dans les 7 jours !"
                                                : ""
                                        }
                                    </Typography>
                                </Box>
                            </Box>


                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: "space-between", gap: "4%" }} >
                    {/* ///////// NOM Contact, POSITION, VILLE et ADRESSE ///////// */}
                    <Box
                        sx={{ width: "48%" }}
                    >
                        <Box>
                            <TextField
                                id="outlined-basic" label="Nom DIRIGEANT"
                                value={contactToAddOrUpdate.directorName}
                                onChange={handleChangeText("directorName")}
                                //onChange={handleChangeText("contactName")}
                                sx={{ width: "48%" }}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Site WEB"
                                value={contactToAddOrUpdate.businessWebsite}
                                onChange={handleChangeText("businessWebsite")}
                                sx={{ width: "48%", ml: "4%" }}
                                InputProps={{
                                    startAdornment: contactToAddOrUpdate.businessWebsite && <Link
                                        href={contactToAddOrUpdate.businessWebsite}
                                        target="_blank"
                                        underline="none" //color="inherit" 
                                        sx={{
                                            mr: 1,
                                            //fontSize: "0.8em" 
                                        }}
                                    >
                                        <LanguageIcon style={{ color: muiTheme.palette.gray.dark }} />
                                        {/* <LanguageIcon style={{ color: 'red' }} /> */}
                                    </Link>
                                }}
                            />
                        </Box>

                        <Box sx={{ mt: 2 }} >
                            <TextField id="outlined-basic" label="Nom Contact DIRECT" value={contactToAddOrUpdate.contactName} onChange={handleChangeText("contactName")}
                                sx={{ width: "48%" }}
                            />
                            <TextField id="outlined-basic" label="Poste occupé" value={contactToAddOrUpdate.contactPosition} onChange={handleChangeText("contactPosition")}
                                sx={{ width: "48%", ml: "4%" }}
                            />
                        </Box>

                        <Box sx={{ mt: 2 }} >
                            <TextField id="outlined-basic" label="Ville" value={contactToAddOrUpdate.businessCity} onChange={handleChangeText("businessCity")} sx={{ width: "48%" }} />
                            <TextField id="outlined-basic" label="Adresse" value={contactToAddOrUpdate.businessAddress} onChange={handleChangeText("businessAddress")} sx={{ width: "48%", ml: "4%" }} />
                        </Box>

                        <Box sx={{ mt: 2 }} >
                            <TextField id="outlined-basic" label="Téléphone STANDARD" value={contactToAddOrUpdate.businessPhone} onChange={handleChangeText("businessPhone")} sx={{ width: "48%" }} />
                            <TextField
                                id="outlined-basic"
                                label="Téléphone DIRECT"

                                value={contactToAddOrUpdate.contactPhone}
                                onChange={handleChangeText("contactPhone")}
                                sx={{ width: "48%", ml: "4%" }}
                            />
                        </Box>

                        <Box sx={{ mt: 2 }} >
                            <TextField
                                id="outlined-basic"
                                label="Email ENTREPRISE"

                                value={contactToAddOrUpdate.businessEmail}
                                onChange={handleChangeText("businessEmail")}
                                sx={{ width: "48%" }}
                                InputProps={{
                                    startAdornment: contactToAddOrUpdate.businessEmail && <Link href={`mailto:${contactToAddOrUpdate.businessEmail}`} underline="none" //color="inherit"                                        
                                        target="_blank"
                                        sx={{
                                            mr: 1,
                                            //fontSize: "0.8em" 
                                        }}
                                    >
                                        <MailIcon color="secondary" />
                                    </Link>
                                }}
                            />

                            <TextField
                                id="outlined-basic"
                                label="Email DIRECT"

                                value={contactToAddOrUpdate.contactEmail}
                                onChange={handleChangeText("businessEmail")}
                                sx={{ width: "48%", ml: "4%" }}
                                InputProps={{
                                    startAdornment: contactToAddOrUpdate.contactEmail && <Link href={`mailto:${contactToAddOrUpdate.contactEmail}`} underline="none" //color="inherit"                                       
                                        target="_blank"
                                        sx={{
                                            mr: 1,
                                            fontSize: "0.8em"
                                        }}
                                    >
                                        <MailIcon />
                                    </Link>
                                }}
                            />

                        </Box>



                    </Box>

                    {/* ///////// COMMENTAIRES ///////// */}
                    <TextField
                        //variant="outlined"
                        sx={{
                            width: "48%",
                            overflow: 'auto',
                            maxHeight: "40vh",
                            boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                            p: 1
                        }}
                        multiline
                        id="outlined-basic"
                        label="Commentaires"
                        value={contactToAddOrUpdate.comments}
                        onChange={handleChangeText("comments")}
                        InputProps={{
                            disableUnderline: true
                        }}
                    />
                </Box>


                {/* ///////// FICHIERS + BOUTON MAJ ou AJOUTER ///////// */}
                <Box sx={{ display: 'flex', justifyContent: "space-between", gap: "4%" }} >

                    {/* ///////// FICHIERS ///////// */}
                    <Box sx={{ width: "70%" }}>
                        <Typography variant="h6">Fichiers associés au contact ({contactToAddOrUpdate.filesSent.length})</Typography>
                        <Typography
                            //variant="caption" 
                            component="div"
                            sx={{ color: "text.secondary" }}
                        >
                            {contactToAddOrUpdate.filesSent.map((file, index) => (
                                <Box key={index} sx={{ display: "flex", alignItems: "center" }} >
                                    <ArrowRightIcon sx={{ color: "text.secondary" }} />
                                    <Button
                                        onClick={() => handleOpenFile(file.fileRef)}
                                    >
                                        {index + 1} - {file.fileName}<br />
                                    </Button>
                                    <Tooltip arrow title="Désassocier ce fichier du contact">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => setOpenDeleteContactFileModal(true)}    // () => removeFile(file)}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Modal
                                        open={openDeleteContactFileModal}
                                        onClose={() => setOpenDeleteContactFileModal(false)}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={modalStyle} >
                                            <Typography
                                                id="modal-modal-title"
                                                variant="h6"
                                                component="h2"
                                                sx={{ mb: 5 }}
                                            >
                                                Supprimer le fichier associé : <span style={{ fontWeight: "bold" }}>{file.fileName}</span> ?
                                            </Typography>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                                                <Button
                                                    variant="contained"
                                                    color='warning'
                                                    onClick={() => removeFile(file)}
                                                    sx={{ marginRight: "15px" }}
                                                >
                                                    Oui !
                                                </Button>
                                                <Button variant="contained" color='primary' sx={{color:"white"}} onClick={() => setOpenDeleteContactFileModal(false)} >Non</Button>
                                            </Box>
                                        </Box>
                                    </Modal>
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
                            sx={{ marginTop: "30px" }}
                            //value={false}       // Sinon avec "value={tabValue}" => erreur dans Console : The `value` provided to the Tabs component is invalid. The Tab with this `value` ("0") is not part of the document layout. !!! (alors que dans page (contact) ça marche !!!???)
                            value={tabValue}
                            onChange={(e, newValue: number) => setTabValue(newValue)}
                        //sx={{ borderRight: 1, borderColor: 'divider', width: "120px" }}
                        >
                            <Tab
                                key={0}
                                label="Ajout fichier existant"
                                value={0}
                            />
                            <Tab
                                key={1}
                                label="Ajout nouveau fichier"
                                value={1}
                            />
                        </Tabs>

                        <TabPanel key={0} value={tabValue} index={0}  >
                            <FormControl sx={{
                                marginTop: "30px",
                                //margin: "5%",
                                width: "100%",
                                //maxWidth: "800px",
                            }} >
                                {filesFirebaseArray.length > 0
                                    ? <InputLabel id="type-label">Choisir un fichier existant</InputLabel>
                                    : <InputLabel id="type-label">Aucun fichier pour l'instant, veuillez en ajouter (onglet de droite : AJOUT NOUVEAU FICHIER) ou dans l'onglet ADMIN <SettingsIcon /></InputLabel>
                                }

                                <Select
                                    id="type-label"
                                    //sx={{ width: "200px" }}
                                    value={firebaseFileSelected.fileRef}
                                    //name={firebaseFileSelected.fileName}  // SERT A RIEN !!!
                                    onChange={handleChangeExistingFile}
                                >
                                    {/* <MenuItem key="0" value="0">Choisir dans la liste</MenuItem> */}
                                    {filesFirebaseArray.map((file, index) => (

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
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? muiTheme.palette.lightCyan.light : '',
                                                color: index % 2 === 1 ? muiTheme.palette.primary.dark : '',
                                            }}
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
                                {firebaseFileSelected.fileRef !== "" &&
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                                        <Button
                                            sx={{ marginTop: "10px" }}
                                            color="secondary"
                                            //component="label"
                                            type="submit"
                                            variant="contained" startIcon={<VisibilityIcon />}
                                            onClick={() => handleOpenFile(firebaseFileSelected.fileRef)}
                                        >
                                            Voir le fichier
                                        </Button>
                                        <Button
                                            sx={{ marginTop: "10px", color: "white" }}
                                            //component="label"
                                            type="submit"
                                            variant="contained" startIcon={<AddIcon />}
                                            onClick={handleChangeSelectFirebaseFile}
                                        >
                                            Associer ce fichier
                                        </Button>
                                    </Box>
                                }
                            </FormControl>
                        </TabPanel>

                        <TabPanel key={1} value={tabValue} index={1}  >
                            {/* => FormControl n'est pas conçu pour gérer les soumissions de formulaire. */}

                            <form
                                style={{
                                    marginTop: "30px",
                                    //margin: "5%",
                                    //width: "80%", 
                                    display: "flex",
                                    gap: "5%"
                                }}
                                onSubmit={(e) => handleSubmitFiles(e, "filesSent")}
                            >

                                <Input
                                    id="fileInput"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleChangeInputFile}
                                />
                                <label htmlFor="fileInput">
                                    <Button variant='contained' component="span" sx={{ color: "white" }} >
                                        1- Choisir un fichier à ajouter
                                    </Button>
                                </label>

                                {(newFileName !== null) && <Box>
                                    <Box sx={{
                                        display: "flex",
                                        gap: "5%"
                                    }} >
                                        <TextField
                                            value={newFileName}
                                            onChange={(e) => setNewFileName(e.target.value)}
                                            label="Fichier à ajouter"
                                            variant="outlined"
                                            sx={{ width: "60%" }}
                                        />
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}  >
                                            <Button
                                                color="pink"
                                                //sx={{ marginLeft: "10px" }}
                                                //component="label"
                                                type="submit"
                                                variant="contained" startIcon={<CloudUploadIcon />}
                                            //onClick={handleChangeLogo}
                                            >
                                                2- Télécharger/ajouter le fichier
                                            </Button>

                                        </Box>
                                    </Box>
                                    <Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={progresspercentFile}
                                            sx={{
                                                marginTop: "10px",
                                                //width: "90%"
                                            }}
                                        />
                                        {alertFileText && <Alert
                                            sx={{ marginTop: "10px", }} 
                                            severity="warning">{alertFileText}</Alert>}
                                    </Box>

                                </Box>
                                }
                            </form>
                        </TabPanel>

                        {contactToAddOrUpdate.filesSent.length > 0 &&
                            <Box>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{
                                        marginTop: "50px",
                                        //position: "absolute", top: 0, right: 0 
                                    }}
                                    onClick={() => setOpenDeleteContactFilesModal(true)} >
                                    Supprimer tous les fichiers associés
                                </Button>

                                <Modal
                                    open={openDeleteContactFilesModal}
                                    onClose={() => setOpenDeleteContactFilesModal(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={modalStyle} >
                                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 5 }} >
                                            Supprimer tous les fichiers associés au contact : <span style={{ fontWeight: "bold" }}>{contactToAddOrUpdate.businessName}</span> ?
                                        </Typography>
                                        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</Typography> */}
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                                            <Button
                                                variant="contained"
                                                color='warning'
                                                onClick={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, filesSent: [] })}
                                                sx={{ marginRight: "15px" }}
                                            >
                                                Oui !
                                            </Button>
                                            <Button variant="contained" color='primary' sx={{color:"white"}} onClick={() => setOpenDeleteContactFilesModal(false)} >Non</Button>
                                        </Box>
                                    </Box>
                                </Modal>
                            </Box>
                        }
                    </Box>


                    {/* <IconButton>
                            <Edit sx={{ fontSize: 14 }} />
                        </IconButton> */}

                    {addContact && <Button variant="contained" sx={{ width: '25%', height: "200px", mt: 3, }} onClick={() => addContact(contactToAddOrUpdate)} >Ajouter comme contact</Button>}
                    {updateContact && <Button variant="contained" color='secondary' sx={{ width: '25%', height: "200px", mt: 3 }} onClick={handleUpdateContact} >Mettre à jour le contact</Button>}
                    <Modal
                        open={openContactIsUpdatedModal}
                        onClose={() => setOpenContactIsUpdatedModal(false)}
                    >
                        <Box sx={modalStyle} >
                            <Typography
                                id="modal-modal-title"
                                variant="h6"
                                component="h2"
                                sx={{ mb: 5 }}
                            >
                                Contact <span style={{ fontWeight: "bold" }}>{contactToAddOrUpdate.businessName}</span> mis à jour !
                            </Typography>                            
                        </Box>
                    </Modal>
                </Box>
            </Box>

            {/* ///////// SUPPRIMER ///////// */}
            {handleDeleteContact && <Box sx={{ display: "flex", marginTop: "100px" }} >
                <Button
                    variant="contained"
                    color='error'
                    onClick={() => setOpenDeleteContactModal(true)}
                    sx={{ mr: 0, ml: "auto", }}
                >
                    <DeleteForeverIcon />
                    Supprimer le contact
                </Button>

                <Modal
                    open={openDeleteContactModal}
                    onClose={() => setOpenDeleteContactModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle} >
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 5 }} >
                            Supprimer le contact : <span style={{ fontWeight: "bold" }}>{contact.businessName}</span> ?
                        </Typography>
                        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</Typography> */}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                            <Button variant="contained" color='warning' onClick={handleClickDeleteContact} sx={{ marginRight: "15px" }} >Oui !</Button>
                            <Button variant="contained" color='primary' sx={{color:"white"}} onClick={() => setOpenDeleteContactModal(false)} >Non</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>}

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
        // </Zoom>
    )
}
