import React, { ChangeEvent } from 'react'
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
// Pour le DATE PICKER => npm install @mui/x-date-pickers
import dayjs, { Dayjs } from 'dayjs';       // npm install dayjs
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MuiFileInput } from 'mui-file-input'
import { pink } from '@mui/material/colors';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import StarUnchecked from '@mui/icons-material/StarOutline';
import StarCheckedFilled from '@mui/icons-material/Star';
import { darken } from '@mui/material/styles';
import { lighten } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import GaugeComponent from 'react-gauge-component'  // npm install react-gauge-component --save
// ??? GaugeChart => npm install react-gauge-chart + dependency : npm i d3 (marche pas !!!)
import Container from '@mui/material/Container';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextsmsTwoToneIcon from '@mui/icons-material/TextsmsTwoTone';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Image from 'next/image'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearIcon from '@mui/icons-material/Clear';
import Modal from '@mui/material/Modal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


import { StyledTableRow, StyledTableCell } from './StyledComponents';
import { Timestamp } from 'firebase/firestore';

import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

const customIcons: {
  [index: string]: {
    icon: React.ReactElement;
    label: string;
  };
} = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}



const COMMENT_DISPLAY_LENGTH = 60

// For the FILE INPUT Button
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


type ContactRowProps = {
    contact: Contact
    selectedContactId: string,
    setSelectedContact: (contact: Contact) => void       // (contact: Contact) => () => void    =>    (autre proposition copilot)   ???
    handleUpdateContact: (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => void   // obligé de mettre NULL pour la date ! (???)
    //handleUpdateContact: (contact: Contact) => void
    handleDeleteContact: () => void
}



export default function ContactRow({ contact, selectedContactId, setSelectedContact, handleUpdateContact, handleDeleteContact
}: ContactRowProps) {

    //console.log(contact)
    console.log("xxxhandleUpdateContact", handleUpdateContact)

    const muiTheme = useTheme();

    const handleChangeText = (attribut: keyof Contact) => (event: React.ChangeEvent<HTMLInputElement>) => {
        //console.log("event.target.value", event.target.value)
        handleUpdateContact(contact.id, { key: attribut, value: event.target.value })
        // handleUpdateContact({ ...contact, [attribut]: event.target.value })
    }
    const handleChangeCheckbox = (contact: Contact, attribut: keyof Contact) => {
        console.log("contact", contact)
        handleUpdateContact(contact.id, { key: attribut, value: !contact[attribut] })
        //handleUpdateContact({ ...contact, [attribut]: !contact[attribut] })
    }
    const handleChangeDate = (newDate: Dayjs | null, attribut: keyof Contact) => {      // Obligé de mettre NULL ???        // On pt faire comme handleChangeText qui renvoie un EVENT ??? et ne pas avoir à passer l'arg ???
        console.log(contact.dateOfNextCall)     // Timestamp {seconds: 1700147570, nanoseconds: 377000000}
        contact.dateOfNextCall && console.log(contact.dateOfNextCall.toDate())    // Thu Nov 16 2023 16:12:50 GMT+0100 (heure normale d’Europe centrale)
        contact.dateOfNextCall && console.log(dayjs(contact.dateOfNextCall.toDate())) // M {$L: 'en', $u: undefined, $d: Thu Nov 16 2023 16:12:50 GMT+0100 (heure normale d’Europe centrale), $y: 2023, $M: 10, …}
        // On revient en arrière :
        console.log("newDate", newDate) // M {$L: 'en', $u: undefined, $d: Wed Nov 01 2023 16:12:50 GMT+0100 (heure normale d’Europe centrale), $y: 2023, $M: 10, …}
        console.log(newDate?.toDate()) // Wed Nov 01 2023 16:12:50 GMT+0100 (heure normale d’Europe centrale)
        // console.log((newDate?.toDate())?.getTime())      // Non car c'est un TIMESTAMP mais pas l'objet Timestamp de firebase
        newDate && console.log(Timestamp.fromDate(newDate.toDate()))
        //console.log("parse ?", Date.parse(newDate))
        // Si on ne veut pas de date => newDate = null
        handleUpdateContact(contact.id, { key: attribut, value: newDate === null ? newDate : Timestamp.fromDate(newDate.toDate()) })
        //handleUpdateContact({ ...contact, [attribut]: newDate })
    }
    // const handleChangeFile = (newFiles : File[] | []) => {
    //     console.log("newFile", newFiles)
    //     newFiles && handleUpdateContact({...contact, fileSent: newFiles})
    // }
    const handleChangeFile = (files: File[] | null, attribut: keyof Contact) => {
        // const handleChangeFile = (files: File[] | null) => {
        console.log("files", files)
        //files && handleUpdateContact(contact.id, {key: attribut, value: files } )
        //files && handleUpdateContact({ ...contact, filesSent: [...contact.filesSent, ...files] })  
        //newFile && handleUpdateContact({ ...contact, fileSent: [...contact.fileSent, newFile] })   
        //  newFile && handleUpdateContact({ ...contact, fileSent: newFile })
    }
    const handleChangeLogo = (image: ChangeEvent<HTMLInputElement> | null) => {
        console.log("image", image)
        console.log("image", image?.target.value)
        //image && handleUpdateContact(contact.id, {key: attribut, value: !contact[attribut] } )
        //image && handleUpdateContact({ ...contact, logo: image.target.value })
        //image && handleUpdateContact({ ...contact, logo: image })
    }
    // const handleChangeLogo = (event: React.MouseEvent<HTMLImageElement>) => {
    //     const newLogo = prompt('Enter new logo URL:');
    //     if (newLogo !== null) {
    //         handleUpdateContact({ ...contact, logo: newLogo })
    //     }
    // };

    const handleChangeInterestGauge = (newGauge: number | null) => {
        //newGauge && console.log(newGauge)

        (newGauge && (newGauge > 5 || newGauge < 0))
            ?  alert("Doit être entre 0 et 5 !")
            :  handleUpdateContact(contact.id, { key: "interestGauge", value: newGauge })
    }
    // const handleChangeInterestGauge2 = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    //     console.log(event.target.value)
    //     handleUpdateContact(contact.id, {key: "interestGauge", value: event.target.value } )
    // }

    const [openCommentDialogue, setOpenCommentDialogue] = React.useState(false);
    const handleClickOpenCommentDialog = () => {
        setOpenCommentDialogue(true);
    };
    const handleCloseCommentDialog = () => {
        setOpenCommentDialogue(false);
    };


    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClosePop = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',     // ???
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
      
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const handleOpenDeleteModal = () => setOpenDeleteModal(true);
    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleClickDeleteContact = () => {
        handleDeleteContact()
        handleCloseCommentDialog()
    }


    return (

        <StyledTableRow
            //hover 
            key={contact.id} selected={selectedContactId === contact.id ? true : false}
            //className={selectedContactId === contact.id ? 'tableRowSelected bg-cyan-400 ' : 'bg-yellow-200'}      // CYAN ne s'affiche pas, mais jaune oui
            onClick={() => setSelectedContact(contact)}
        >
            {/* LOGO */}
            <StyledTableCell component="th" scope="row" >
                {/* <TextField type="file" onChange={handleChangeLogo2} /> */}
                {contact.logo && <Image src={contact.logo} alt={contact.businessName} width={50} height={50} />}
                {/* <MuiFileInput
                    value={contact.logo}
                    //onChange={ (file) => handleChangeFile(file)} />
                    onChange={handleChangeLogo} />                 */}
            </StyledTableCell>

            {/* businessName */}
            <StyledTableCell component="th" scope="row" >
                <TextField id="standard-basic" //label="Nom de l'entreprise"    
                    value={contact.businessName}
                    onChange={handleChangeText('businessName')}
                    variant="standard"
                    InputProps={{
                        startAdornment: <AccountCircle />,
                        disableUnderline: true,
                    }}
                />
                <TextField id="standard-basic"
                    value={contact.businessCity}
                    onChange={handleChangeText('businessCity')}
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                    }}
                    inputProps={{ style: { fontSize: "0.8em", color: "gray" } }}
                />
            </StyledTableCell>

            {/* businessPhone */}
            <StyledTableCell align="center">
                <TextField id="standard-basic" //label="Téléphone" 
                    value={contact.businessPhone} onChange={handleChangeText('businessPhone')} variant="standard"
                    InputProps={{
                        disableUnderline: true,
                    }}
                    inputProps={{ style: { textAlign: 'center' } }}
                />
            </StyledTableCell>

            {/* ContactName */}
            <StyledTableCell>
                <TextField id="standard-basic" //label="Nom du contact" 
                    value={contact.contactName} onChange={handleChangeText('contactName')} variant="standard"
                    InputProps={{
                        disableUnderline: true,
                    }}
                />
                <TextField id="standard-basic" //label="Nom du contact" 
                    value={contact.contactPosition} onChange={handleChangeText('contactPosition')} variant="standard"
                    InputProps={{
                        disableUnderline: true,
                    }}
                    inputProps={{ style: { fontSize: "0.8em", color: "gray" } }}
                />
            </StyledTableCell>

            {/* contactEmail */}
            <StyledTableCell
            //align="right"
            >
                <Box sx={{ display: "flex", gap: 2 }}>
                    <MailOutlineOutlinedIcon />
                    <TextField id="standard-basic" //label="Email du contact" 
                        value={contact.contactEmail} onChange={handleChangeText('contactEmail')} variant="standard"
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                </Box>
            </StyledTableCell>

            {/* hasBeenSentEmail */}
            <StyledTableCell align="center">
                <Checkbox checked={contact.hasBeenCalled}       // Par défaut quand checked = true, la couleur est la primary (.light ?)
                    //color='primary'           // Si on met la couleur ici => quand non coché c'est gris !
                    sx={{
                        color: "primary.main",     // Alors qu'ici ça prend la couleur qu'on lui donne si coché ou non !
                        "&.Mui-disabled": {     // On ajoute ça pour mettre une couleur quand disabled, sinon gris !
                            color: lighten(muiTheme.palette.primary.main, 0.5)
                        },
                    }}
                    disabled={contact.hasBeenSentEmail ? true : false}
                    onChange={() => handleChangeCheckbox(contact, "hasBeenCalled")} // onChange={handleChangeCheckbox(contact, "hasBeenCalled")} ???
                    inputProps={{ 'aria-label': 'controlled' }} />
                {/* {contact.hasBeenCalled} */}
            </StyledTableCell>

            {/* hasBeenSentEmail */}
            <StyledTableCell align="center">
                <Checkbox checked={contact.hasBeenSentEmail}
                    icon={<RadioButtonUncheckedIcon />}
                    //checkedIcon={<RadioButtonCheckedIcon />}
                    checkedIcon={<TaskAltIcon />}
                    sx={{
                        color: "secondary.main",
                        '&.Mui-checked': { color: "secondary.main" },      // Sinon ça met la PRIMARY Color
                        "&.Mui-disabled": {     // On ajoute ça pour mettre une couleur quand disabled, sinon gris !
                            color: lighten(muiTheme.palette.secondary.main, 0.5)
                        },
                    }}
                    disabled={(contact.hasReceivedEmail || !contact.hasBeenCalled) ? true : false}
                    //disabled={!contact.hasBeenCalled ? true : false}
                    // disabled={(contact.hasBeenCalled || contact.hasBeenSentEmail === false) ? false : true}
                    onChange={() => handleChangeCheckbox(contact, "hasBeenSentEmail")}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </StyledTableCell>

            {/* hasBeenSentEmail */}
            <StyledTableCell align="center">
                <Checkbox checked={contact.hasReceivedEmail}
                    icon={<StarUnchecked />}
                    checkedIcon={<StarCheckedFilled />}
                    sx={{
                        color: pink[800], '&.Mui-checked': { color: pink[600] },
                        "&.Mui-disabled": {     // On ajoute ça pour mettre une couleur quand disabled, sinon gris !
                            color: lighten(pink[800], 0.5)
                        },
                    }}
                    // disabled={(contact.hasBeenSentEmail && contact.hasBeenCalled) ? false : true}
                    disabled={(!contact.hasBeenSentEmail) ? true : false}
                    onChange={() => handleChangeCheckbox(contact, "hasReceivedEmail")}
                    inputProps={{ 'aria-label': 'controlled' }} />
            </StyledTableCell>

            {/* dateOfNextCall */}
            {/* The general recommendation is to declare the LocalizationProvider once, wrapping your entire application. Then, you don't need to repeat the boilerplate code for every Date and Time Picker in your application. */}
            <StyledTableCell align="left">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Container
                    //components={['DateTimePicker']}       // ???
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom:"10px" }}> {/* Sinon on pouvait mettre un float:right sur le bouton ci-dessous */}
                            <NotificationsNoneOutlinedIcon //color="pink" 
                                sx={{ color: pink[800]  }} />
                            <IconButton aria-label="comment" color="primary" sx = {{ padding: 0 }}       // Car les boutons ont automatiquement un padding
                            onClick={() => handleChangeDate(null, "dateOfNextCall")} >
                                <ClearIcon color='warning' />
                            </IconButton>
                        </Box>
                        <DateTimePicker
                            //defaultValue={null}
                            //label="Date de relance"
                            ampm={false}
                            format="DD/MM/YYYY HH:mm"                            
                            minDate={dayjs(new Date())}
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                            //value={dayjs(contact.dateOfNextCall)}   // => Avant FIREBASE ça fonctionnait avec ça (car FIREBASE transforme les dates en objet Timestamp(?))
                            //{dayjs(new Date("01/01/2000"))}
                            //value={dayjs(contact.dateOfNextCall.toDate())}        // Erreur si date = null
                            //value={contact.dateOfNextCall !== null ? dayjs(contact.dateOfNextCall.toDate()) : undefined}  // Si on met UNDEFINED =>  A component is changing the uncontrolled value of a picker to be controlled. Elements should not switch from uncontrolled to controlled (or vice versa). It's considered controlled if the value is not `undefined`.
                            // Impossible de mettre une date vide ???
                            //value={contact.dateOfNextCall !== null ? dayjs(contact.dateOfNextCall.toDate()) : dayjs(new Date("01/01/2023"))}
                            value={contact.dateOfNextCall !== null ? dayjs(contact.dateOfNextCall.toDate()) : null}
                            onChange={(newDate: Dayjs | null) => handleChangeDate(newDate, "dateOfNextCall")}
                            slotProps={{ textField: { variant: 'standard', } }}
                        />
                    </ Container>
                </LocalizationProvider>
                {/* {contact.dateOfNextCall.toLocaleDateString()} {contact.dateOfNextCall.getHours().toString().padStart(2, '0')}:{contact.dateOfNextCall.getMinutes().toString().padStart(2, '0')} */}
            </StyledTableCell>

            {/* comments */}
            <StyledTableCell align="center"
            //onClick={}
            >
                {/* <Button variant="outlined" onClick={handleClickOpen}>Modifier</Button> */}
                <IconButton aria-label="comment" color="primary" onClick={handleClickOpenCommentDialog}>
                    {/* <TextsmsTwoToneIcon onClick={handleClickOpen} /> */}
                    <ModeEditOutlineOutlinedIcon />
                </IconButton>
                {/* Fonction presque identique : {contact.comments.slice(0, 10)}...*/}
                <Typography
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: 14,
                    }}
                >
                    {contact.comments.length < COMMENT_DISPLAY_LENGTH ? contact.comments : contact.comments.substring(0, COMMENT_DISPLAY_LENGTH) + "..."}
                </Typography>
                {/* Dialog pour modifier */}
                <Dialog open={openCommentDialogue} onClose={handleCloseCommentDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth
                    disableRestoreFocus // sinon le focus ne se fait pas sur le TextField
                >
                    <DialogTitle id="alert-dialog-title">Commentaires</DialogTitle>
                    <DialogContent
                        dividers
                    >
                        <TextField id="alert-dialog-description" autoFocus margin="dense"
                            //label="Commentaires" 
                            type="comment" fullWidth variant="standard"
                            multiline
                            value={contact.comments}
                            onChange={handleChangeText('comments')}
                            sx={{ textAlign: 'left' }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color='primary' onClick={handleCloseCommentDialog}>Valider</Button>
                        {/* <Button variant="contained" color='warning' onClick={handleCloseCommentDialog}>Annuler</Button> */}
                    </DialogActions>
                </Dialog>

                {/* Popover pour voir */}
                {/* <Button aria-describedby={id} variant="contained" onClick={handleClick}>Voir</Button>
                <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClosePop} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} >
                    <Typography sx={{ p: 2 }}>
                        {contact.comments.split('\n').map((line, index) => (
                            <React.Fragment key={index}>{line}<br /></React.Fragment>       // On remplace /n par <br /> car sinon Typography ne le prend pas en compte le retour à la ligne
                        ))}
                    </Typography>
                </Popover> */}
            </StyledTableCell>

            {/* filesSent */}
            <StyledTableCell align="right">
                <MuiFileInput
                    value={contact.filesSent}
                    multiple={true}
                    onChange={(files) => handleChangeFile(files, "filesSent")}
                //onChange={handleChangeFile} 
                />
                {/* <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Upload file
                    <VisuallyHiddenInput type="file" />
                </Button> */}
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {contact.filesSent.length} fichier(s)<br />
                    {contact.filesSent.map((file, index) => (
                        <React.Fragment key={index}>
                            {file.name}<br />
                        </React.Fragment>
                    ))}
                </Typography>
            </StyledTableCell>

            {/* interestGauge */}
            {/* https://bernii.github.io/gauge.js/#! ??? Avec CANVAS ??? */}
            <StyledTableCell align="center">
                <IconButton aria-label="comment" color="primary" sx={{ padding: 0, float: "right" }}       // Car les boutons ont automatiquement un padding
                    onClick={() => handleChangeInterestGauge(null)} >
                    <ClearIcon color='warning' />
                </IconButton>
                <TextField id="standard-basic" 
                    type="number"                    
                    value={contact.interestGauge ?? ""} onChange={(newGauge) => handleChangeInterestGauge(parseFloat(newGauge.target.value))} variant="standard"
                    InputProps={{
                        disableUnderline: true,
                        inputProps: { min: 0, max: 5, step: 0.5 },                        
                    }}         
                />
                <Box sx={{ width: contact.interestGauge ? contact.interestGauge * 30 + "px" : "0px", height: "15px", bgcolor: "primary.light" }} />
                <Rating
                    name="simple-controlled"
                    precision={0.5}
                    value={contact.interestGauge}
                    onChange={(event, newValue) => handleChangeInterestGauge(newValue)}
                    icon={<FavoriteIcon fontSize="inherit" 
                        sx={{ color: pink[800]  }}
                        //color="primary"
                     />}
                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                />
                <StyledRating
                    name="highlight-selected-only"
                    //defaultValue={2}
                    value={contact.interestGauge}
                    onChange={(event, newValue) => handleChangeInterestGauge(newValue)}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value: number) => customIcons[value].label}
                    highlightSelectedOnly
                />
                {/* <GaugeComponent
                    arc={{
                        subArcs: [
                            { limit: 20, color: '#EA4228', showTick: true },
                            { limit: 40, color: '#F58B19', showTick: true },
                            { limit: 60, color: '#F5CD19', showTick: true },
                            { limit: 100, color: '#5BE12C', showTick: true },
                        ]
                    }}
                    value={50}
                /> */}
            </StyledTableCell>

            {/* Supprimer contact ? */}
            <StyledTableCell align="center" >

                <IconButton aria-label="comment" color="primary"  onClick={handleOpenDeleteModal}>
                    <DeleteForeverIcon color='warning' />
                </IconButton>
                <Modal
                    open={openDeleteModal}
                    onClose={handleCloseDeleteModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Supprimer le contact {contact.businessName} ?
                        </Typography>
                        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</Typography> */}
                        <Button variant="contained" color='warning' onClick={handleClickDeleteContact} >Oui !</Button>
                        <Button variant="contained" color='primary' onClick={handleCloseDeleteModal} >Non</Button>
                    </Box>
                </Modal>           
            </StyledTableCell>
        </StyledTableRow>
    )
}
