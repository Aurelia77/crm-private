import React, { ChangeEvent } from 'react'
import { styled } from '@mui/material/styles';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearIcon from '@mui/icons-material/Clear';
import Modal from '@mui/material/Modal';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import Switch from '@mui/material/Switch';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import Avatar from '@mui/material/Avatar';
import MailIcon from '@mui/icons-material/Mail';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';
import { InputLabel, MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { contactTypes } from '../../utils/toolbox'
import ZoomInIcon from '@mui/icons-material/ZoomIn';

import { StyledTableRow, StyledTableCell } from '../../utils/StyledComponents';
import { Timestamp } from 'firebase/firestore';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';

import { getCategoriesFromDatabase } from '../../utils/firebase'
import { FormControl } from '@mui/material';
import { handleOpenFile } from '../../utils/firebase'
import { modalStyle, StyledRating, StyledRatingStars, customIcons, IconContainer } from '../../utils/StyledComponents'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { isDatePassed, isDateSoon, stringAvatar, stringToColor } from '../../utils/toolbox'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
//import {Link} from 'react-router-dom';


type ContactRowProps = {
    contact: Contact
    // J'enlève le selectedContactId car sinon à chaque clic sur une ligne => toutes les lignes se re-rendent pour savoir quelle est la ligne séléctionnée (de toute façon c'était juste pour mettre une couleur à la ligne sélectionnée)
    // selectedContactId: string,
    // setSelectedContactId: (id: string) => void 
    handleUpdateContact: (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => void
    handleDeleteContact: (id: string) => void
    currentUserId: string
    getPriorityTextAndColor: (priority: number | null) => { text: string, color: string }
}

const ContactRow = ({ contact, handleUpdateContact, handleDeleteContact, currentUserId, getPriorityTextAndColor }: ContactRowProps) => {

    const [categoriesList, setCategoriesList] = React.useState<ContactCategorieType[] | null>(null);

    const muiTheme = useTheme();
    const router = useRouter();


    React.useEffect(() => {
        getCategoriesFromDatabase(currentUserId).then((categories: ContactCategorieType[]) => {
            const newCategoriesList = categories.map(category => ({
                id: category.id,
                label: category.label
            }));
            setCategoriesList(newCategoriesList);
        })
    }, [currentUserId]);


    // GESTION DES ICONES MAIL ET TELEPHONE
    // hasBeenCalled => 0="no" | 1="yes but no answer" | 2="yes and answered",
    // hasBeenSentEmailOrMeetUp =>  0="nothing" | 1="email sent" | 2="email sent and received" | 3="met up",

    // Renvoie la bonne icone selon l'état de hasBeenCalled (non envoyé, envoyé, lu...)
    const RightMailIcon = ({ hasBeenSentEmailOrMeetUp }: { hasBeenSentEmailOrMeetUp: 0 | 1 | 2 | 3 }) => {
        switch (hasBeenSentEmailOrMeetUp) {
            case 1: return <MailIcon sx={{ color: muiTheme.palette.ochre.main }} />
            case 2: return <MarkEmailReadIcon color='success' />
            case 3: return <HandshakeTwoToneIcon color="success" />
            default: return <MailOutlineIcon sx={{
                color: "black"
            }} />
        }
    }
    const getPhoneIconColor = (hasBeenCalled: 0 | 1 | 2) => {
        switch (hasBeenCalled) {
            case 1:
                return muiTheme.palette.success.main;
            case 2:
                return muiTheme.palette.ochre.main;
            default:
                return "black"
        }
    };
    const getEmailIconColor = (hasBeenSentEmailOrMeetUp: 0 | 1 | 2 | 3) => {
        switch (hasBeenSentEmailOrMeetUp) {
            case 2:
            case 3:
                return muiTheme.palette.success.main;
            case 1:
                return muiTheme.palette.ochre.main;
            default:
                return "black"
        }
    };
    const getEmailIconText = (hasBeenSentEmailOrMeetUp: 0 | 1 | 2 | 3) => {
        switch (hasBeenSentEmailOrMeetUp) {
            case 1:
                return "Mail envoyé"
            case 2:
                return "Mail reçu"
            case 3:
                return "Rencontre physique"
            default:
                return "Mail non envoyé"
        }
    };
    const getPhoneIconText = (hasBeenCalled: 0 | 1 | 2) => {
        switch (hasBeenCalled) {
            case 1:
                return "J'ai parlé à quelqu'un"
            case 2:
                return "J'ai appélé mais pas de réponse"
            default:
                return "Pas appelé"
        }
    };
    const handleClickHasBeenCalled = () => {
        handleUpdateContact(contact.id, {
            key: "hasBeenCalled", value: contact.hasBeenCalled === 0
                ? 1
                : contact.hasBeenCalled === 1
                    ? 2
                    : 0
        })
    }
    const handleClickhasBeenSentEmailOrMeetUp = () => {
        handleUpdateContact(contact.id, {
            key: "hasBeenSentEmailOrMeetUp", value: contact.hasBeenSentEmailOrMeetUp === 0
                ? 1
                : contact.hasBeenSentEmailOrMeetUp === 1
                    ? 2
                    : contact.hasBeenSentEmailOrMeetUp === 2
                        ? 3
                        : 0
        })
    }

    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>, attribut: keyof Contact) => {
        handleUpdateContact(contact.id, { key: attribut, value: event.target.value })
    }
    const handleChangeSelect = (event: SelectChangeEvent, attribut: keyof Contact) => {
        handleUpdateContact(contact.id, { key: attribut, value: event.target.value })
    }
    const handleChangeDate = (newDate: Dayjs | null, attribut: keyof Contact) => {
        handleUpdateContact(contact.id, { key: attribut, value: newDate === null ? newDate : Timestamp.fromDate(newDate.toDate()) })
    }
    const handleChangeNumber = (number: number | null, attribut: string) => {
        handleUpdateContact(contact.id, { key: attribut, value: number })
    }

    const [openCommentDialogue, setOpenCommentDialogue] = React.useState(false);
    const handleClickOpenCommentDialog = () => {
        setOpenCommentDialogue(true);
    };
    const handleCloseCommentDialog = () => {
        setOpenCommentDialogue(false);
    };
    const [openFilesDialogue, setOpenFilesDialogue] = React.useState(false);
    const handleClickOpenFilesDialog = () => {
        setOpenFilesDialogue(true);
    };
    const handleCloseFilesDialog = () => {
        setOpenFilesDialogue(false);
    };
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const handleOpenDeleteModal = () => setOpenDeleteModal(true);
    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleClickDeleteContact = () => {
        handleDeleteContact(contact.id)
    }

    // J'ai voulu créer un composant commun pour tous les TextField, mais ça ne fonctionne pas => problème de onChange et de focus
    type CustomTextFieldProps = {
        attribut: keyof Contact
        startAdornment?: any
        //inputProps?: any
        center?: boolean
        smallLighter?: boolean
    }
    const CustomTextField = ({ attribut, startAdornment = '',
        //inputProps= {}, 
        center = false, smallLighter = false }: CustomTextFieldProps) => {

        const [value, setValue] = React.useState(contact[attribut]);

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setValue(event.target.value);
        };
        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            // Mettez à jour l'état du composant parent ici
            console.log("ON BLUR !!")
            console.log(e)
            console.log(e.target.value)
            handleChangeText(e, attribut);
        };

        return <TextField
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            InputProps={{
                startAdornment: startAdornment,
                disableUnderline: contact[attribut].length > 0,
            }}
            inputProps={{ style: { textAlign: center ? 'center' : 'left', fontSize: smallLighter ? "0.8em" : "1em", color: smallLighter ? "gray" : "" } }}
        />
    }
   

    return (
        <StyledTableRow
            key={contact.id}
            //////////////////// Je dois les enlever sinon créé un rerender à chaque clic sur un contact !!!
            // selected={selectedContactId === contact.id ? true : false}
            // onClick={() => setSelectedContactId(contact.id)}
        >
            {/* Client ? */}
            <StyledTableCell
                component="td"
                scope="row"
            >
                <Switch
                    checked={contact.isClient}
                    onChange={() => handleUpdateContact(contact.id, { key: "isClient", value: !contact.isClient })}
                    color="success"
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </StyledTableCell>

            {/* catégorie */}
            <StyledTableCell component="td" scope="row" >               
                <FormControl >
                    {categoriesList && <Select
                        id="checkbox-type-label"
                        value={contact.businessCategoryId}
                        variant="standard"
                        disableUnderline={true}
                        onChange={(e) => handleChangeSelect(e, "businessCategoryId")}
                        sx={{ width: 180 }}
                    >
                        <MenuItem key="0" value="0">NON DEFINIE</MenuItem>
                        {categoriesList.length === 0 && <Typography variant="caption" >
                            Aucune catégorie créée pour l'instant, veuillez le faire dans Admin (onglet <SettingsIcon fontSize='small' /> )
                        </Typography>
                        }
                        {categoriesList
                            .sort((a, b) => a.label.localeCompare(b.label))
                            .map((cat, index) => (
                                <MenuItem
                                    key={cat.id}
                                    value={cat.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? muiTheme.palette.gray.light : '',
                                    }}
                                >{cat.label}</MenuItem>
                            ))}
                    </Select>}
                </FormControl>
            </StyledTableCell>

            {/* dateOfNextCall */}
            <StyledTableCell
                sx={{
                    backgroundColor: isDatePassed(contact.dateOfNextCall)
                        ? muiTheme.palette.warning.light
                        : isDateSoon(contact.dateOfNextCall)
                            ? muiTheme.palette.ochre.light
                            : "",
                }}
            >               
                <Box sx={{ pl: 0 }}
                >
                    <Box sx={{
                        display: "flex",
                        justifyContent: "end",
                    }}> 
                        {isDatePassed(contact.dateOfNextCall) && <NotificationsNoneOutlinedIcon color="error"
                            sx={{ marginRight: "70%" }}
                        />}
                        {contact.dateOfNextCall && <Tooltip arrow title="Supprimer la date" placement='left' >
                            <IconButton color="primary" sx={{ padding: 0 }}  
                                onClick={() => handleChangeDate(null, "dateOfNextCall")} >
                                <ClearIcon />
                            </IconButton>
                        </Tooltip>}
                    </Box>
                    <Tooltip arrow title={isDatePassed(contact.dateOfNextCall)
                        ? "Attention : La date est passée !!!"
                        : isDateSoon(contact.dateOfNextCall)
                            ? "Attention : Relance dans les 7 jours !"
                            : ""
                    } placement='right' >
                        <Box
                            sx={{
                                '& .MuiInput-underline:before': {
                                    display:
                                        contact.dateOfNextCall === null ? "block" : "none"
                                }
                            }}>
                            <DatePicker
                                format="DD MMM YYYY"
                                value={contact.dateOfNextCall !== null ? dayjs(contact.dateOfNextCall.toDate()) : null}
                                label=" "
                                sx={{
                                    '& .MuiInputBase-root': {
                                        padding: 0, 
                                        margin: 0, 
                                    },
                                }}
                                onChange={(newDate: Dayjs | null) => handleChangeDate(newDate, "dateOfNextCall")}
                                slotProps={{
                                }}
                            />
                        </Box>
                    </Tooltip>
                </ Box>             
            </StyledTableCell>

            {/* LOGO */}
            <StyledTableCell component="td" scope="row" sx={{ padding: 0 }}             
            >
                <Link 
                    href={`/gestionContacts/contact/${contact.id}`}
                    style={{ textDecoration: "none" }}
                >
                    <Avatar
                        //onDoubleClick={() => displayContactCard(contact)}    
                        //onClick={() => router.push(`/gestionContacts/contact/${contact.id}`)}
                        variant="rounded"
                        src={contact.logo
                            ? contact.logo
                            : ""}
                        {...stringAvatar(contact.businessName, contact.logo)}
                    />
                </Link>  
            </StyledTableCell>

            {/* businessName */}
            <StyledTableCell component="td" scope="row" >
                <TextField 
                    value={contact.businessName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessName')}
                    InputProps={{
                        startAdornment: contact.isClient ? <HandshakeOutlinedIcon color='success' fontSize='large' /> : <PsychologyAltIcon
                            sx={{
                                color: muiTheme.palette.gray.main,
                            }}
                            fontSize='large' />,
                        disableUnderline: contact.businessName.length > 0,
                    }}
                    inputProps={{
                        style:
                            { color: getPriorityTextAndColor(contact.priority).color }
                    }}
                />              
            </StyledTableCell>

            {/* Priorité */}
            <StyledTableCell component="td" scope="row"
                sx={{
                    position: "relative",
                }}
            >         

                <Box sx={{ '& > legend': { mt: 2 }, }} >
                    <StyledRatingStars
                        value={contact.priority ?? 0}
                        onChange={(e, newValue) => handleChangeNumber(newValue, "priority")}
                        max={3}
                        color={getPriorityTextAndColor(contact.priority).color}
                    />                  
                </Box>              
            </StyledTableCell>

            {/* contactPhone + businessPhone */}
            <StyledTableCell component="td" align="center">
                <Tooltip arrow title="Tél direct" placement='top'>
                    <TextField id="standard-basic" 
                        value={contact.contactPhone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'contactPhone')}
                        InputProps={{
                            disableUnderline: contact.contactPhone.length > 0
                        }}
                        inputProps={{ style: { textAlign: 'center' } }}
                    />
                </Tooltip>
                <Tooltip arrow title="Tél standard">
                    <TextField id="standard-basic"
                        value={contact.businessPhone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessPhone')}
                        color="secondary"
                        size='small'
                        InputProps={{
                            startAdornment: contact.businessPhone.length === 0 && <span style={{ color: 'gray', fontSize: "0.8em", marginLeft: "40%" }}>... </span>,
                            disableUnderline: true
                        }}
                        inputProps={{ style: { textAlign: 'center', color: "gray", fontSize: "0.8em" } }}
                    />
                </Tooltip>             
            </StyledTableCell>

            {/* ContactName */}
            <StyledTableCell
                sx={{ py: 0 }}
            >
                <Tooltip arrow title="Contact direct" placement='bottom'>
                    <TextField id="standard-basic" 
                        value={contact.contactName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'contactName')}
                        InputProps={{
                            disableUnderline: contact.contactName.length > 0
                        }}
                    />
                </Tooltip>
                <TextField id="standard-basic" 
                    value={contact.contactPosition} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'contactPosition')}
                    InputProps={{
                        startAdornment: contact.contactPosition.length === 0 && <span style={{ color: 'gray', fontSize: "0.8em", marginLeft: "40%" }}>... </span>,
                        disableUnderline: true
                    }}
                    inputProps={{ style: { fontSize: "0.8em", color: "gray" } }}
                />
                <Tooltip arrow title="Dirigeant" placement='bottom'>
                    <TextField id="standard-basic" 
                        value={contact.directorName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'directorName')}
                        InputProps={{
                            startAdornment: contact.directorName.length === 0 ? <span style={{ color: 'gray', fontSize: "0.8em", marginLeft: "40%" }}>... </span> : <ArrowCircleUpIcon color='primary' fontSize="small" />,
                            disableUnderline: true
                        }}
                        inputProps={{ style: { fontSize: "0.8em", color: "gray" } }}
                    />
                </Tooltip>
            </StyledTableCell>

            {/* contactEmail */}
            <StyledTableCell component="td"
                sx={{ py: 0 }}
            >               
                <Tooltip arrow title="Contact direct" placement='top'>
                    <TextField id="standard-basic" 
                        value={contact.contactEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'contactEmail')}
                        InputProps={{
                            disableUnderline: contact.contactEmail.length > 0
                        }}
                        inputProps={{ style: { padding: 0 } }}
                    />
                </Tooltip>
                <Tooltip arrow title="Contact entreprise" placement='left'>
                    <TextField id="standard-basic"
                        value={contact.businessEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessEmail')}
                        InputProps={{
                            startAdornment: contact.businessEmail.length === 0 && <span style={{ color: 'gray', fontSize: "0.8em", marginLeft: "40%" }}>... </span>,
                            disableUnderline: true//contact.businessEmail.length > 0
                        }}
                        inputProps={{ style: { fontSize: "0.8em", color: "gray", padding: 0, margin: 'auto' } }}
                    />
                </Tooltip>
                <Tooltip arrow title="Site Web">
                    <TextField id="standard-basic"
                        value={contact.businessWebsite}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessWebsite')}
                        InputProps={{
                            startAdornment: contact.businessWebsite.length === 0 && <span style={{ color: 'gray', fontSize: "0.8em", marginLeft: "40%" }}>... </span>,
                            disableUnderline: true
                        }}
                        inputProps={{ style: { fontSize: "0.8em", color: "gray", padding: 0 } }}
                    />
                </Tooltip>
            </StyledTableCell>

            {/* businessCity */}
            <StyledTableCell
                component="td" scope="row" >
                <TextField id="standard-basic"
                    value={contact.businessCity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessCity')}
                    InputProps={{
                        disableUnderline: contact.businessCity.length > 0
                    }}
                />
                <TextField id="standard-basic"
                    value={contact.businessAddress} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessAddress')}
                    InputProps={{
                        startAdornment: contact.businessAddress.length === 0 && <span style={{ color: 'gray', fontSize: "0.8em", marginLeft: "40%" }}>... </span>,
                        disableUnderline: true
                    }}
                    inputProps={{ style: { fontSize: "0.8em", color: "gray" } }}
                />
            </StyledTableCell>

            {/* hasBeenCalled */}
            <StyledTableCell align="center">
                <Box display="flex"
                    justifyContent="center"
                >
                    <Avatar
                        sx={{ bgcolor: getPhoneIconColor(contact.hasBeenCalled), border: `4px solid ${getPhoneIconColor(contact.hasBeenCalled)}`, }}
                    >
                        <Tooltip arrow title={getPhoneIconText(contact.hasBeenCalled)}>
                            <IconButton color="primary" onClick={handleClickHasBeenCalled}>
                                <CallRoundedIcon fontSize="large"
                                    sx={{
                                        color: "white",
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Avatar>                
                </Box>               
            </StyledTableCell>

            {/* hasBeenSentEmailOrMeetUp */}
            <StyledTableCell>
                <Box display="flex"
                    justifyContent="center"
                >
                    <Avatar
                        sx={{
                            bgcolor: "white",
                            border: `4px solid ${getEmailIconColor(contact.hasBeenSentEmailOrMeetUp)}`,
                        }}
                    >
                        <Tooltip arrow title={getEmailIconText(contact.hasBeenSentEmailOrMeetUp)}>
                            <IconButton color="primary" onClick={handleClickhasBeenSentEmailOrMeetUp}>
                                <RightMailIcon hasBeenSentEmailOrMeetUp={contact.hasBeenSentEmailOrMeetUp} />
                            </IconButton>
                        </Tooltip>
                    </Avatar>
                </Box>              
            </StyledTableCell>

            {/* comments */}
            <StyledTableCell align="center"
            >
                <IconButton aria-label="comment" color="primary" onClick={handleClickOpenCommentDialog}>
                    <ModeEditOutlineOutlinedIcon />
                    <Typography >
                        {contact.comments.length > 0 ? "..." : "x"}
                    </Typography>
                </IconButton>

                {/* Dialog pour modifier */}
                <Dialog open={openCommentDialogue} onClose={handleCloseCommentDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth
                    disableRestoreFocus // sinon le focus ne se fait pas sur le TextField
                >
                    <DialogTitle id="alert-dialog-title">Commentaires pour {contact.businessName}</DialogTitle>
                    <DialogContent
                        dividers
                    >
                        <TextField id="alert-dialog-description" autoFocus margin="dense"
                            //label="Commentaires" 
                            type="comment" fullWidth variant="standard"
                            multiline
                            value={contact.comments}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'comments')}
                            sx={{ textAlign: 'left' }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color='primary' onClick={handleCloseCommentDialog}>Valider</Button>
                    </DialogActions>
                </Dialog>            
            </StyledTableCell>

            {/* interestGauge */}
            <StyledTableCell align="center" sx={{ position: 'relative' }}>
                <StyledRating
                    name="highlight-selected-only"
                    sx={{ alignItems: 'center' }}
                    value={contact.interestGauge}
                    onChange={(e, newValue) => handleChangeNumber(newValue, "interestGauge")}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value: number) => customIcons[value].label}
                    highlightSelectedOnly
                />
            </StyledTableCell>

            {/* filesSent */}
            <StyledTableCell align="right">
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {contact.filesSent.length} fichier(s)
                </Typography>

                {contact.filesSent[0] && <Typography
                    onClick={() => handleOpenFile(contact.filesSent[0].fileRef)}
                    sx={{ cursor: "pointer" }}
                    align="left"
                >
                    {contact.filesSent[0].fileName.length < 15
                        ? contact.filesSent[0].fileName
                        : contact.filesSent[0].fileName.substring(0, 15) + "..."
                    }
                </Typography>
                }

                {contact.filesSent[1] && <Typography
                    onClick={() => handleOpenFile(contact.filesSent[1].fileRef)}
                    sx={{ cursor: "pointer" }}
                    align="left"
                >
                    {contact.filesSent[1].fileName.length < 15
                        ? contact.filesSent[1].fileName
                        : contact.filesSent[1].fileName.substring(0, 15) + "..."
                    }
                </Typography>
                }

                {contact.filesSent.length > 2 && <IconButton aria-label="files" color="primary" onClick={handleClickOpenFilesDialog}>
                    <ZoomInIcon />
                    <Typography >
                        + {contact.filesSent.length - 2}
                    </Typography>
                </IconButton>
                }

                {/* Dialog pour modifier */}
                <Dialog open={openFilesDialogue} onClose={handleCloseFilesDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth
                    disableRestoreFocus // sinon le focus ne se fait pas sur le TextField
                >
                    <DialogTitle id="alert-dialog-title">Commentaires pour {contact.businessName}</DialogTitle>
                    <DialogContent
                        dividers
                    >
                        {contact.filesSent.map((file, index) => (
                            <Box key={index} sx={{ display: "flex" }} >
                                <Avatar sx={{ width: 40, height: 40, backgroundColor: stringToColor(file.fileName.slice(-3)), }} >{file.fileName.slice(-3)}</Avatar>
                                <Typography
                                    onClick={() => handleOpenFile(file.fileRef)}
                                    sx={{ cursor: "pointer" }}
                                >
                                    {file.fileName}
                                </Typography>
                            </Box>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color='primary' onClick={handleCloseFilesDialog}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </StyledTableCell>

            {/* dateOfFirstCall */}
            <StyledTableCell>
                <Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "end",
                    }}>
                        {contact.dateOfFirstCall && <Tooltip arrow title="Supprimer la date" placement='left' >
                            <IconButton color="primary" sx={{ padding: 0 }} 
                                onClick={() => handleChangeDate(null, "dateOfFirstCall")} >
                                <ClearIcon />
                            </IconButton>
                        </Tooltip>}
                    </Box>

                    <Box
                        sx={{
                            '& .MuiInput-underline:before': {
                                display:
                                    contact.dateOfFirstCall === null ? "block" : "none"
                            }
                        }}>
                        <DatePicker
                            format="DD MMM YYYY"
                            value={contact.dateOfFirstCall !== null ? dayjs(contact.dateOfFirstCall.toDate()) : null}
                            onChange={(newDate: Dayjs | null) => handleChangeDate(newDate, "dateOfFirstCall")}    
                            label=" "
                            sx={{
                                '& .MuiInputBase-root': {
                                    padding: 0,
                                    margin: 0,
                                },
                            }}
                        />
                    </Box>
                </Box>
            </StyledTableCell>

            {/* dateOfLastCall */}
            <StyledTableCell>
                <Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "end",
                    }}>
                        {contact.dateOfLastCall && <Tooltip arrow title="Supprimer la date" placement='left' >
                            <IconButton color="primary" sx={{ padding: 0 }}  
                                onClick={() => handleChangeDate(null, "dateOfLastCall")} >
                                <ClearIcon />
                            </IconButton>
                        </Tooltip>}
                    </Box>

                    <Box
                        sx={{
                            '& .MuiInput-underline:before': {
                                display:
                                    contact.dateOfLastCall === null ? "block" : "none"
                            }
                        }}>
                        <DatePicker
                            format="DD MMM YYYY"
                            value={contact.dateOfLastCall !== null ? dayjs(contact.dateOfLastCall.toDate()) : null}
                            onChange={(newDate: Dayjs | null) => handleChangeDate(newDate, "dateOfLastCall")}    
                            label=" "
                            sx={{
                                '& .MuiInputBase-root': {
                                    padding: 0,
                                    margin: 0,
                                },
                            }}
                        />
                    </Box>
                </Box>
            </StyledTableCell>

            {/* Type */}
            <StyledTableCell
                component="td"
                scope="row"
                sx={{
                    backgroundColor: contact.contactType === "Entreprise"
                        ? muiTheme.palette.primary.light
                        : contact.contactType === "Particulier"
                            ? muiTheme.palette.ochre.light
                            : contact.contactType === "Partenaire"
                                ? muiTheme.palette.secondary.light
                                : muiTheme.palette.gray.light
                }}
            >
                <FormControl >
                    <Select
                        variant="standard"
                        disableUnderline={true}
                        value={contact.contactType}
                        onChange={(e) => handleChangeSelect(e, "contactType")}
                    >
                        {contactTypes.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </StyledTableCell>

            {/* Supprimer contact ? */}
            <StyledTableCell align="center" >
                <Tooltip arrow title="Supprimer le contact" >
                    <IconButton onClick={handleOpenDeleteModal}>
                        <DeleteForeverIcon color='error' />
                    </IconButton>
                </Tooltip>
                <Modal
                    open={openDeleteModal}
                    onClose={handleCloseDeleteModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 5 }} >
                            Supprimer le contact : <span style={{ fontWeight: "bold" }}>{contact.businessName}</span> ?
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                            <Button variant="contained" color='warning' onClick={handleClickDeleteContact} sx={{ marginRight: "15px" }} >Oui !</Button>
                            <Button variant="contained" color='primary' onClick={handleCloseDeleteModal} >Non</Button>
                        </Box>
                    </Box>
                </Modal>
            </StyledTableCell>
        </StyledTableRow>
    )
}

export default React.memo(ContactRow)  
