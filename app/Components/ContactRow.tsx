import React from 'react'
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

import { StyledTableRow, StyledTableCell } from './StyledComponents';

type ContactRowProps = {
    contact: Contact
    selectedContactId: string,
    setSelectedContact: (contact: Contact) => void       // (contact: Contact) => () => void    =>    (autre proposition copilot)   ???
    handleUpdateContact: (contact: Contact) => void
}




export default function ContactRow({ contact, selectedContactId, setSelectedContact, handleUpdateContact,
}: ContactRowProps) {

    const muiTheme = useTheme();

    const handleChangeCheckbox = (contact: Contact, attribut: keyof Contact) => {
        console.log("contact", contact)
        handleUpdateContact({ ...contact, [attribut]: !contact[attribut] })
    }
    const handleChangeDate = (newDate: Dayjs | null, attribut: keyof Contact) => {      // Obligé de mettre NULL ???
        console.log("newDate", newDate)
        handleUpdateContact({ ...contact, [attribut]: newDate })
    }
    // const handleChangeFile = (newFiles : File[] | []) => {
    //     console.log("newFile", newFiles)
    //     newFiles && handleUpdateContact({...contact, fileSent: newFiles})
    // }
    const handleChangeFile = (files: File[] | null) => {
        console.log("files", files)
        files && handleUpdateContact({ ...contact, filesSent: [...contact.filesSent, ...files] })  
        //newFile && handleUpdateContact({ ...contact, fileSent: [...contact.fileSent, newFile] })   
        //  newFile && handleUpdateContact({ ...contact, fileSent: newFile })
    }
    const handleChangeText = (attribut: keyof Contact) => (event: React.ChangeEvent<HTMLInputElement>) => {
        //console.log("event.target.value", event.target.value)
        handleUpdateContact({ ...contact, [attribut]: event.target.value })
    }

    const [openDialogue, setOpenDialogue] = React.useState(false);
    const handleClickOpen = () => {
        setOpenDialogue(true);
    };
    const handleClose = () => {
        setOpenDialogue(false);
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
 

    return (

        <StyledTableRow
            //hover 
            key={contact.id}  selected={selectedContactId === contact.id ? true : false}
            //className={selectedContactId === contact.id ? 'tableRowSelected bg-cyan-400 ' : 'bg-yellow-200'}      // CYAN ne s'affiche pas, mais jaune oui
            onClick={() => setSelectedContact(contact)}
        >
            {/* <p>{contact.id}</p> */}
            <StyledTableCell component="th" scope="row" >
                <TextField id="standard-basic" //label="Nom de l'entreprise"                     
                    value={contact.businessName}  onChange={handleChangeText('businessName')}
                    variant="standard"
                    InputProps={{
                        startAdornment: <AccountCircle />, 
                        disableUnderline: true,
                    }} 
                    // sx={{ textAlign: 'left' }}                 
                />    
            </StyledTableCell>

            <StyledTableCell>
                <TextField id="standard-basic" //label="Téléphone" 
                    value={contact.businessPhone}  onChange={handleChangeText('businessPhone')}  variant="standard"
                    InputProps={{
                        disableUnderline: true,
                    }}                  
                />
            </StyledTableCell>

            <StyledTableCell>
                <TextField id="standard-basic" //label="Nom du contact" 
                    value={contact.contactName}  onChange={handleChangeText('contactName')} variant="standard"
                    InputProps={{
                        disableUnderline: true,
                    }}                  
                />
            </StyledTableCell>

            <StyledTableCell 
                //align="right"
            >
                <Box sx={{ display:"flex", gap:2 }}>
                    <MailOutlineOutlinedIcon />
                    <TextField id="standard-basic" //label="Email du contact" 
                        value={contact.contactEmail}  onChange={handleChangeText('contactEmail')} variant="standard"
                        InputProps={{
                            disableUnderline: true, 
                        }}                  
                />
                </Box>
            </StyledTableCell>

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

            {/* The general recommendation is to declare the LocalizationProvider once, wrapping your entire application. Then, you don't need to repeat the boilerplate code for every Date and Time Picker in your application. */}
            <StyledTableCell align="left">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Container 
                    //components={['DateTimePicker']}
                    >
                        <NotificationsNoneOutlinedIcon //color="pink" 
                         sx={{ color: pink[800] }}    />
                        <DateTimePicker
                            //label="Date de relance"
                            ampm= {false}
                            format="DD/MM/YYYY HH:mm"
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                            value={dayjs(contact.dateOfNextCall)}
                            onChange={(newDate) => handleChangeDate(newDate, "dateOfNextCall")}
                            slotProps={{ textField: { variant: 'standard', } }}     
                        />                                             
                    </ Container>
                </LocalizationProvider>
                {/* {contact.dateOfNextCall.toLocaleDateString()} {contact.dateOfNextCall.getHours().toString().padStart(2, '0')}:{contact.dateOfNextCall.getMinutes().toString().padStart(2, '0')} */}
            </StyledTableCell>

            <StyledTableCell align="center"
            //onClick={}
            > 
                {/* <Button variant="outlined" onClick={handleClickOpen}>Modifier</Button> */}
                <IconButton aria-label="comment" color="primary" onClick={handleClickOpen}>
                    {/* <TextsmsTwoToneIcon onClick={handleClickOpen} /> */}
                    <ModeEditOutlineOutlinedIcon />
                </IconButton>
                 {/* Fonction presque identique : {contact.comments.slice(0, 10)}...*/}               
                <Typography
                    sx={{overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: 14,}}
                >{contact.comments.length < COMMENT_DISPLAY_LENGTH ? contact.comments : contact.comments.substring(0, COMMENT_DISPLAY_LENGTH) + "..."}</Typography>
                {/* Dialog pour modifier */}
                <Dialog open={openDialogue} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth
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
                        <Button variant="contained" color='primary' onClick={handleClose}>Valider</Button>
                        <Button variant="contained" color='warning' onClick={handleClose}>Annuler</Button>
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

            <StyledTableCell align="right">
                <MuiFileInput 
                    value={contact.filesSent}
                    multiple={true}
                    //onChange={ (file) => handleChangeFile(file)} />
                    onChange={handleChangeFile} />
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

{/* https://bernii.github.io/gauge.js/#! ??? Avec CANVAS ??? */}
            <StyledTableCell align="center"> 
                <Box sx={{ width: contact.interestGauge * 10 + "px", bgcolor:"primary.light" }}>
                    {contact.interestGauge} 
                </Box>
                {/* <GaugeComponent
                    arc={{
                        subArcs: [
                            {
                                limit: 20,
                                color: '#EA4228',
                                showTick: true
                            },
                            {
                                limit: 40,
                                color: '#F58B19',
                                showTick: true
                            },
                            {
                                limit: 60,
                                color: '#F5CD19',
                                showTick: true
                            },
                            {
                                limit: 100,
                                color: '#5BE12C',
                                showTick: true
                            },
                        ]
                    }}
                    value={50}
                /> */}
            </StyledTableCell>
        </StyledTableRow>
    )
}
