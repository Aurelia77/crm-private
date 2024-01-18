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
import { contactTypes, emptyContact } from '../../utils/toolbox'
import dayjs, { Dayjs } from 'dayjs';       // npm install dayjs
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import { Timestamp } from 'firebase/firestore';
import { useTheme } from '@mui/material/styles';
import { storage, addFileOnFirebaseDB, getCategoriesFromDatabase } from '../../utils/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import { Input } from '@mui/material';
import { handleOpenFile } from '../../utils/firebase'
import { Tab, Tabs } from '@mui/material';
import { TabPanel } from '../../utils/StyledComponentsAndUtilities';
import { getFilesFromDatabase } from '../../utils/firebase'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import MailIcon from '@mui/icons-material/Mail';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';
import LanguageIcon from '@mui/icons-material/Language';
import PsychologyAlt from '@mui/icons-material/PsychologyAlt';
import { StyledRating, StyledRatingStars, IconContainer, customIcons, useRightMailIcon, useIconUtilities, useHandleClickHasBeenCalledAndHasBeenSentEmailOrMeetUp  } from '@/app/utils/StyledComponentsAndUtilities';

import SettingsIcon from '@mui/icons-material/Settings';
import CallRoundedIcon from '@mui/icons-material/CallRounded';

import Zoom from '@mui/material/Zoom';

import { isDatePassed, isDateSoon, modalStyle } from '../../utils/toolbox'
import { truncate } from 'fs';
import { useNavigate, useLocation, useBlocker } from 'react-router-dom';


type ContactCardProps = {
    contact: Contact
    currentUserId: any
    getPriorityTextAndColor: (priority: number | null) => { text: string, color: string, bgColor: string }
    setAreContactChangesSaved: (status: boolean) => void
    handleDeleteContact?: (id: string) => void
    addContact?: (contact: Contact) => void
    updateContact?: (contact: Contact) => void
}

export default function ContactCard({ contact, currentUserId, getPriorityTextAndColor, setAreContactChangesSaved, handleDeleteContact, addContact, updateContact,
}: ContactCardProps) {

    const [contactToAddOrUpdate, setContactToAddOrUpdate] = React.useState<Contact>(contact)
    const [tabValue, setTabValue] = React.useState<number>(0);
    const [logoChoosen, setIsLogoChoosen] = React.useState(false);  
    
    console.log("contactToAddOrUpdate : ", contactToAddOrUpdate)
    console.log("hasBeenCalled : ", contactToAddOrUpdate.hasBeenCalled)
    console.log("hasBeenSentEmailOrMeetUp : ", contactToAddOrUpdate.hasBeenSentEmailOrMeetUp)


    const muiTheme = useTheme();

    const inputFileRef = React.useRef<HTMLInputElement>(null);

    const [progresspercentLogo, setProgresspercentLogo] = React.useState(0);
    const [progresspercentFile, setProgresspercentFile] = React.useState(0);
    const [filesFirebaseArray, setFilesFirebaseArray] = React.useState<FileNameAndRefType[]>([])
    const [firebaseFileSelected, setFirebaseFileSelected] = React.useState<FileNameAndRefType>({ fileName: "", fileRef: "" })

    const [newFileName, setNewFileName] = React.useState<string | null>(null);

    const [categoriesList, setCategoriesList] = React.useState<ContactCategorieType[] | null>(null);

    const [openDeleteContactModal, setOpenDeleteContactModal] = React.useState(false);
    const [openDeleteContactFileModal, setOpenDeleteContactFileModal] = React.useState(false);
    const [openDeleteContactFilesModal, setOpenDeleteContactFilesModal] = React.useState(false);
    const [openContactIsUpdatedModal, setOpenContactIsUpdatedModal] = React.useState(false);

    const [alertFileText, setAlertFileText] = React.useState("");

   

    const RightMailIcon = useRightMailIcon();    
    const { getPhoneIconColor, getEmailIconColor, getEmailIconText, getPhoneIconText } = useIconUtilities(); 
    
    const { handleClickHasBeenCalled, handleClickhasBeenSentEmailOrMeetUp } = useHandleClickHasBeenCalledAndHasBeenSentEmailOrMeetUp(contactToAddOrUpdate, undefined, setContactToAddOrUpdate);

    const handleClickDeleteContact = () => {
        handleDeleteContact && handleDeleteContact(contact.id)
    }

    const handleChangeExistingFile = (e: any) => {
        const selectedFileRef = e.target.value;
        const selectedFile = filesFirebaseArray.find(file => file.fileRef === selectedFileRef);

        setFirebaseFileSelected({ fileName: selectedFile?.fileName ?? "", fileRef: selectedFileRef })
    }

    const handleWholeUpdateContact = () => {
        setAreContactChangesSaved(true)
        updateContact && updateContact(contactToAddOrUpdate)
        setOpenContactIsUpdatedModal(true)
    } 

    React.useEffect(() => {

        getFilesFromDatabase(currentUserId).then((filesList) => {
            setFilesFirebaseArray(filesList)
        });

        getCategoriesFromDatabase(currentUserId).then((categories: ContactCategorieType[]) => {
            const newCategoriesList = categories.map(category => ({
                id: category.id,
                label: category.label
            }));
            setCategoriesList(newCategoriesList);
        })

    }, [currentUserId]);


    React.useEffect(() => {
        console.log("****Comparaison des contacts")
        //JSON.stringify(contact) !== JSON.stringify(contactToAddOrUpdate) && console.log("****CHANGE")
        JSON.stringify(contact) !== JSON.stringify(contactToAddOrUpdate) && setAreContactChangesSaved(false)
    }, [contactToAddOrUpdate])
   

    const handleChangeText = (attribut: keyof Contact) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setContactToAddOrUpdate({ ...contactToAddOrUpdate, [attribut]: event.target.value })
    }
    const handleChangeSelect = (event: SelectChangeEvent, attribut: keyof Contact) => {
        const type: string = event.target.value as string  
        setContactToAddOrUpdate({ ...contactToAddOrUpdate, [attribut]: type })
    };
    const handleChangeInputFile = (e: any) => {
        console.log(e.target.files[0])
        setNewFileName(e.target.files[0].name)
    }
    const handleSubmitFiles = (e: any, attribut: string) => {
        e.preventDefault()

        if (newFileName === "") {
            setAlertFileText("Le nom du fichier doit contenir au moins un caractère !")
            return
        }
        setAlertFileText("")

        const file = e.target.elements[0].files[0]

        if (!file) return;
        const storageRef = ref(storage, `${attribut}/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

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
        setContactToAddOrUpdate({ ...contactToAddOrUpdate, [attribut]: number })
    }

     


    // const location = useLocation();
    // console.log("location : ", location)
    // console.log("location.pathname : ", location.pathname)

    // React.useEffect(() => {
    //     // execute on location change
    //     console.log('Location changed!', location.pathname);
    //     alert("!!!!!!!!!")
    // }, [location]);

    // const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
    // const navigate = useNavigate();
    // const location = useLocation();

    // const handleNavigation = (path: any) => {
    //     if (
    //         //hasUnsavedChanges && 
    //         !window.confirm('Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter cette page ?')) {
    //         return;
    //     }

    //     navigate(path);
    // };

    // React.useEffect(() => {
    //     // execute on location change
    //     console.log('Location changed!', location.pathname);
    //     //if (hasUnsavedChanges) {
    //         handleNavigation(location.pathname);
    //         //alert("Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter cette page ?");
    //     //}
    // }, [location, ]);


    return (
        <Card key={contact.id} elevation={3}
            sx={{
                margin: "auto",
                position: "relative",
                padding: "2% 4%",
                bgcolor: getPriorityTextAndColor(contactToAddOrUpdate.priority).bgColor,
                height: "100%", 
            }}     
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
                }} >
                    {/* ///////// CLIENT */}
                    <Box
                        sx={{
                            width: "80px"
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
                    

                    {/* ////////////// SMILEYS */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                            }}
                        >                            
                            <StyledRating
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
                        }}
                    >          
                        <Box>                           
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

                {/* ///////// CAT- TYPE - FICHIERS ///////// */}
                <Box sx={{
                    display: 'flex', justifyContent: "space-around",
                }} >
                    {/* ///////// CAT */}
                    <FormControl sx={{ width: "auto", backgroundColor: muiTheme.palette.primary.main, borderRadius: "50px" }} >
                        <InputLabel id="checkbox-type-label" sx={{ marginLeft: '20px' }} >Catégorie</InputLabel>
                      {categoriesList &&  <Select
                            sx={{
                                color: 'white',
                                textAlign: 'center',
                                margin: "auto",
                                padding: "15px 10px 25px 30px",
                                marginTop: 0
                            }}
                            id="checkbox-type-label"
                            value={contactToAddOrUpdate.businessCategoryId}
                            onChange={(e) => handleChangeSelect(e, "businessCategoryId")}
                            variant="standard"
                            disableUnderline={true}
                        >
                            <MenuItem key="0" value="0">NON DEFINIE</MenuItem>
                            {categoriesList.length === 0 && <Typography variant="caption" >
                                Aucune catégorie créée pour l'instant, veuillez le faire dans Admin (onglet <SettingsIcon fontSize='small' /> )
                            </Typography>
                            }
                            {categoriesList.sort((a, b) => a.label.localeCompare(b.label)).map((cat, index) => (
                                <MenuItem
                                    key={cat.id}
                                    value={cat.id}
                                    sx={{ backgroundColor: index % 2 === 0 ? muiTheme.palette.gray.light : '' }}
                                >{cat.label}</MenuItem>
                            ))}
                        </Select>}
                    </FormControl>

                    {/* ///////// TYPE */}
                    <FormControl sx={{
                        width: "auto", backgroundColor: muiTheme.palette.purple.dark,
                        borderRadius: "50px"
                    }} >
                        <InputLabel id="checkbox-type-label" sx={{ marginLeft: '20px' }}>Type</InputLabel>
                        <Select
                            sx={{
                                color: 'white',
                                textAlign: 'center',
                                margin: "auto",
                                padding: "15px 10px 25px 30px"
                            }}
                            id="checkbox-type-label"
                            value={contactToAddOrUpdate.contactType}
                            onChange={(e) => handleChangeSelect(e, "contactType")}
                            variant="standard"
                            disableUnderline={true} 
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
                                <form onSubmit={(e) => handleSubmitFiles(e, "logo")} >
                                    <Button variant="contained" component="label" sx={{ color: "white", display: 'none' }} >
                                        <Input
                                            type="file"
                                            ref={inputFileRef}
                                            onChange={handleChangeInputLogo}
                                        />
                                    </Button>

                                    {logoChoosen &&
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }} >
                                            <Button
                                                color="pink"
                                                type="submit"
                                                variant="contained" startIcon={<CloudUploadIcon />}
                                            >
                                                Télécharger / afficher
                                            </Button>
                                            <LinearProgress variant="determinate" value={progresspercentLogo} sx={{ marginTop: "10px" }} />
                                        </Box>
                                    }

                                </form>

                                {contactToAddOrUpdate.logo && <Button variant="contained" color="error" sx={{
                                    margin: "auto"
                                }} onClick={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, logo: "" })} >Supprimer logo</Button>}
                            </Box>
                        </Box>

                        {/* ///////// NOM, tel, mail et DATES */}
                        <Box sx={{ width: "80%" }} >

                            {/* ///////// NOM, tel, mail */}
                            <Box>
                                <TextField
                                    sx={{ width: "100%" }}
                                    required
                                    id="outlined-basic"
                                    //label="Nom"
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
                                />
                                <Avatar
                                    sx={{ bgcolor: getPhoneIconColor(contactToAddOrUpdate.hasBeenCalled), border: `4px solid ${getPhoneIconColor(contactToAddOrUpdate.hasBeenCalled)}`, }}
                                >
                                    <Tooltip arrow title={getPhoneIconText(contactToAddOrUpdate.hasBeenCalled)}>
                                        <IconButton color="primary" onClick={handleClickHasBeenCalled}>
                                            <CallRoundedIcon fontSize="large"
                                                sx={{
                                                    color: "white",
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </Avatar>
                                <Avatar
                                    sx={{
                                        bgcolor: "white",
                                        border: `4px solid ${getEmailIconColor(contactToAddOrUpdate.hasBeenSentEmailOrMeetUp)}`,
                                    }}
                                >
                                    <Tooltip arrow title={getEmailIconText(contactToAddOrUpdate.hasBeenSentEmailOrMeetUp)}>
                                        <IconButton color="primary" onClick={handleClickhasBeenSentEmailOrMeetUp}>
                                            <RightMailIcon hasBeenSentEmailOrMeetUp={contactToAddOrUpdate.hasBeenSentEmailOrMeetUp} />
                                        </IconButton>
                                    </Tooltip>
                                </Avatar>
                            </Box>


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
                        sx={{
                            width: contactToAddOrUpdate.comments.length > 0 ? "48%" : "86%",
                            display: 'flex', justifyContent: "space-between", gap: "4%"
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: "space-between", gap: "15px", width: "48%" }} >
                            <TextField
                                id="outlined-basic" label="Nom DIRIGEANT"
                                value={contactToAddOrUpdate.directorName}
                                onChange={handleChangeText("directorName")}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Nom Contact DIRECT"
                                value={contactToAddOrUpdate.contactName}
                                onChange={handleChangeText("contactName")}
                                sx={{ backgroundColor: muiTheme.palette.pink.main }}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Poste occupé"
                                value={contactToAddOrUpdate.contactPosition}
                                onChange={handleChangeText("contactPosition")}
                                sx={{ backgroundColor: muiTheme.palette.pink.main }}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Téléphone DIRECT"
                                value={contactToAddOrUpdate.contactPhone}
                                onChange={handleChangeText("contactPhone")}
                                sx={{ backgroundColor: muiTheme.palette.pink.main }}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Email DIRECT"
                                value={contactToAddOrUpdate.contactEmail}
                                onChange={handleChangeText("contactEmail")}
                                sx={{ backgroundColor: muiTheme.palette.pink.main }}
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

                        <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: "space-between", gap: "15px", width: "48%" }} >
                            <TextField
                                id="outlined-basic"
                                label="Ville"
                                value={contactToAddOrUpdate.businessCity}
                                onChange={handleChangeText("businessCity")}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Adresse"
                                value={contactToAddOrUpdate.businessAddress}
                                onChange={handleChangeText("businessAddress")}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Site WEB"
                                value={contactToAddOrUpdate.businessWebsite}
                                onChange={handleChangeText("businessWebsite")}
                                InputProps={{
                                    startAdornment: contactToAddOrUpdate.businessWebsite && <Link
                                        href={contactToAddOrUpdate.businessWebsite}
                                        target="_blank"
                                        underline="none" 
                                        sx={{
                                            mr: 1,
                                        }}
                                    >
                                        <LanguageIcon style={{ color: muiTheme.palette.gray.dark }} />
                                    </Link>
                                }}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Téléphone STANDARD"
                                value={contactToAddOrUpdate.businessPhone}
                                onChange={handleChangeText("businessPhone")}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Email ENTREPRISE"
                                value={contactToAddOrUpdate.businessEmail}
                                onChange={handleChangeText("businessEmail")}
                                InputProps={{
                                    startAdornment: contactToAddOrUpdate.businessEmail && <Link href={`mailto:${contactToAddOrUpdate.businessEmail}`} underline="none" 
                                        target="_blank"
                                        sx={{
                                            mr: 1,
                                        }}
                                    >
                                        <MailIcon color="secondary" />
                                    </Link>
                                }}
                            />
                        </Box>
                    </Box>

                    {/* ///////// COMMENTAIRES ///////// */}
                    <TextField
                        sx={{
                            width: contactToAddOrUpdate.comments.length > 0 ? "48%" : "10%",
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
                                            onClick={() => setOpenDeleteContactFileModal(true)}  
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
                                                <Button variant="contained" color='primary' sx={{ color: "white" }} onClick={() => setOpenDeleteContactFileModal(false)} >Non</Button>
                                            </Box>
                                        </Box>
                                    </Modal>
                                </Box>

                            ))}
                        </Typography>
                       

                        <Tabs
                            sx={{ marginTop: "30px" }}                           
                            value={tabValue}
                            onChange={(e, newValue: number) => setTabValue(newValue)}
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
                                width: "100%",
                            }} >
                                {filesFirebaseArray.length > 0
                                    ? <InputLabel id="type-label">Choisir un fichier existant</InputLabel>
                                    : <InputLabel id="type-label">Aucun fichier pour l'instant, veuillez en ajouter (onglet de droite : AJOUT NOUVEAU FICHIER) ou dans l'onglet ADMIN <SettingsIcon /></InputLabel>
                                }

                                <Select
                                    id="type-label"
                                    value={firebaseFileSelected.fileRef}
                                    onChange={handleChangeExistingFile}
                                >                                   
                                    {filesFirebaseArray.map((file, index) => (
                                        <MenuItem
                                            key={file.fileRef}
                                            value={file.fileRef}
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? muiTheme.palette.lightCyan.light : '',
                                                color: index % 2 === 1 ? muiTheme.palette.primary.dark : '',
                                            }}
                                        >                                            
                                            {file.fileName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {firebaseFileSelected.fileRef !== "" &&
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                                        <Button
                                            sx={{ marginTop: "10px" }}
                                            color="secondary"
                                            type="submit"
                                            variant="contained" startIcon={<VisibilityIcon />}
                                            onClick={() => handleOpenFile(firebaseFileSelected.fileRef)}
                                        >
                                            Voir le fichier
                                        </Button>
                                        <Button
                                            sx={{ marginTop: "10px", color: "white" }}
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
                                                type="submit"
                                                variant="contained" startIcon={<CloudUploadIcon />}
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
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                                            <Button
                                                variant="contained"
                                                color='warning'
                                                onClick={() => setContactToAddOrUpdate({ ...contactToAddOrUpdate, filesSent: [] })}
                                                sx={{ marginRight: "15px" }}
                                            >
                                                Oui !
                                            </Button>
                                            <Button variant="contained" color='primary' sx={{ color: "white" }} onClick={() => setOpenDeleteContactFilesModal(false)} >Non</Button>
                                        </Box>
                                    </Box>
                                </Modal>
                            </Box>
                        }
                    </Box>

                    {addContact && <Button variant="contained" sx={{ width: '30%', height: "200px", mt: 3, }} onClick={() => addContact(contactToAddOrUpdate)} >Ajouter comme contact</Button>}
                    {updateContact && <Button variant="contained" color='secondary' sx={{ width: '30%', height: "200px", mt: 3 }} onClick={handleWholeUpdateContact} >Mettre à jour le contact</Button>}
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
                        <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                            <Button variant="contained" color='warning' onClick={handleClickDeleteContact} sx={{ marginRight: "15px" }} >Oui !</Button>
                            <Button variant="contained" color='primary' sx={{ color: "white" }} onClick={() => setOpenDeleteContactModal(false)} >Non</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>}
        </Card>
    )
}

