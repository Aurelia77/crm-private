import React, { ChangeEvent } from 'react'
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
// Pour le DATE PICKER => npm install @mui/x-date-pickers
import dayjs, { Dayjs } from 'dayjs';       // npm install dayjs
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
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
import CallIcon from '@mui/icons-material/Call';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import Switch from '@mui/material/Switch';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import Avatar from '@mui/material/Avatar';
import MailIcon from '@mui/icons-material/Mail';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';



import { StyledTableRow, StyledTableCell } from './StyledComponents';
import { Timestamp } from 'firebase/firestore';

import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import Tooltip from '@mui/material/Tooltip';
import { timeStamp } from 'console';

import { timeStampObjToTimeStamp } from '../utils/toolbox';

import { storage } from '../utils/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Pour les smileys du RATING 
// => (dans le composant car besoin de connaitre la donnée pour ajuster la taille en fonction)  NON car sinon il faut cliquer 2 fois pour que ça valide !!!  
const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}))
const customIcons: {
    [index: string]: { icon: React.ReactElement; label: string; };
} = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon color="error"
        //fontSize={contact.interestGauge === 1 ? 'large' : 'small'} 
        />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon color="warning"
        //fontSize={contact.interestGauge === 2 ? 'large' : 'small'} 
        />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon color="secondary"
        //fontSize={contact.interestGauge === 3 ? 'large' : 'small'} 
        />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon color="primary"
        //fontSize={contact.interestGauge === 4 ? 'large' : 'small'} 
        />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon color="success"
        //fontSize={contact.interestGauge === 5 ? 'large' : 'small'} 
        />,
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
    diplayContactCard: (contact: Contact) => void
}
export default function ContactRow({ contact, selectedContactId, setSelectedContact, handleUpdateContact, handleDeleteContact, diplayContactCard}: ContactRowProps) {

    //console.log("CONTACT ROW")
    //console.log(alerts.alerts)

    const [contactInfo, setContactInfo] = React.useState<Contact>(contact)


    const muiTheme = useTheme();

    const isDatePassed = (timeStampObj: Timestamp) => {
        const nowTimestamp = new Date().getTime()
        return timeStampObj && timeStampObjToTimeStamp(timeStampObj) < nowTimestamp
    }
    const isDateSoon = (timeStampObj: Timestamp | null) => {
        if (timeStampObj) {
            const date = timeStampObj?.toDate().toString()
            const timeStamp = Date.parse(date)
            const nowTimestamp = Date.parse(new Date().toString())
            const inAWeekTimeStamp = new Date().setDate(new Date().getDate() + 7)//.toString()           

            return (timeStamp > nowTimestamp) && (timeStamp < inAWeekTimeStamp)
        }
    }

    

    //console.log(contact)
    //console.log("xxxhandleUpdateContact", handleUpdateContact)

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
                color: "black" //muiTheme.palette.gray.main 
            }} />
        }
    }
    const getPhoneIconColor = (hasBeenCalled: 0 | 1 | 2) => {
        //console.log("xxxusePhoneIconStyle")
        switch (hasBeenCalled) {
            case 1:
                return muiTheme.palette.success.main;
            case 2:
                return muiTheme.palette.ochre.main;
            default:
                return "black"    //muiTheme.palette.gray.main;
        }
    };
    const getEmailIconColor = (hasBeenSentEmailOrMeetUp: 0 | 1 | 2 | 3) => {
        //console.log("xxxusePhoneIconStyle")
        switch (hasBeenSentEmailOrMeetUp) {
            case 2:
            case 3:
                return muiTheme.palette.success.main;
            case 1:
                return muiTheme.palette.ochre.main;
            default:
                return "black"    //muiTheme.palette.gray.main;
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

    // Pour utiliser un icon différent selon hasBeenCalled = 0, 1 ou 2
    // const RightPhoneIcon = ({ hasBeenCalled }: { hasBeenCalled: 0 | 1 | 2 }) => {
    //     switch (hasBeenCalled) {
    //         case 2:
    //             return <Avatar sx={{
    //                 bgcolor: "white",
    //                 border: `3px solid ${muiTheme.palette.success.main}`,
    //             }} >
    //                 <CallRoundedIcon //color='gray'      // fonctionne mais me souligne en rouge !!!
    //                     sx={{
    //                         color: muiTheme.palette.success.main,
    //                     }}
    //                 />
    //             </Avatar>
    //         case 1:
    //             return <Avatar sx={{
    //                 //bgcolor: deepOrange[500] 
    //                 border: `3px solid ${muiTheme.palette.ochre.main}`,
    //             }} >
    //                 <CallRoundedIcon  //color='gray'      // fonctionne mais me souligne en rouge !!!
    //                     sx={{
    //                         color: muiTheme.palette.ochre.main,
    //                     }}
    //                 />
    //             </Avatar>
    //         case 0:
    //             return <Avatar sx={{
    //                 //bgcolor: deepOrange[500] 
    //                 border: "1px solid gray",
    //             }} >
    //                 <CallRoundedIcon //color='gray'      // fonctionne mais me souligne en rouge !!!
    //                     sx={{
    //                         color: muiTheme.palette.gray.main,
    //                     }}
    //                 />
    //             </Avatar>
    //         // default:     // Pas besoin car seulement 3 cas possibles !

    //     }
    // }

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
  

    // const handleChangeText = (attribut: keyof Contact) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>, attribut: keyof Contact) => {
        
        console.log("event.target.value", event.target.value)
        console.log(attribut)
        handleUpdateContact(contact.id, { key: attribut, value: event.target.value })
        // handleUpdateContact({ ...contact, [attribut]: event.target.value })
    } 
    const handleChangeCheckbox = (contact: Contact, attribut: keyof Contact) => {
        console.log("contact", contact)
        handleUpdateContact(contact.id, { key: attribut, value: !contact[attribut] })
        //handleUpdateContact({ ...contact, [attribut]: !contact[attribut] })
    }
    const handleChangeDate = (newDate: Dayjs | null, attribut: keyof Contact) => {      // Obligé de mettre NULL ???        // On pt faire comme handleChangeText qui renvoie un EVENT ??? et ne pas avoir à passer l'arg ???
       
        console.log("newDate", newDate) // M {$L: 'en', $u: undefined, $d: Wed Nov 01 2023 16:12:50 GMT+0100 (heure normale d’Europe centrale), $y: 2023, $M: 10, …}
        console.log(typeof newDate) // object
        console.log(newDate?.toDate()) // Wed Nov 01 2023 16:12:50 GMT+0100 (heure normale d’Europe centrale)
        // // console.log((newDate?.toDate())?.getTime())      // Non car c'est un TIMESTAMP mais pas l'objet Timestamp de firebase
        // newDate && console.log(Timestamp.fromDate(newDate.toDate()))
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
    
    const handleChangeLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("image", event)
        console.log("image", event.target.getAttribute('data-loaded-src'))
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
        console.log(newGauge);      // Obligé de mettre ; sinon erreur !!! (Uncaught TypeError: console.log(...) is not a function)
        //newGauge && console.log(newGauge)

        (newGauge && (newGauge > 5 || newGauge < 0))
            ? alert("Doit être entre 0 et 5 !")
            : handleUpdateContact(contact.id, { key: "interestGauge", value: newGauge })
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

  
    // J'ai voulu créer un composant commun pour tous les TextField, mais ça ne fonctionne pas => problème de onChange et de focus
    type CustomTextFieldProps = {
        attribut: keyof Contact
        startAdornment?: any
        //inputProps?: any
        center?:boolean
        smallLighter?:boolean
    }
    const CustomTextField = ({attribut, startAdornment='', 
    //inputProps= {}, 
    center=false, smallLighter=false }: CustomTextFieldProps) => {

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

        return <TextField  //label="Nom de l'entreprise"
            // value={contact[attribut]}
            // onChange={(e) => handleChangeText(e, attribut)}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            InputProps={{
                startAdornment:startAdornment,
                disableUnderline: contact[attribut].length > 0,
                //inputProps: inputProps,
                // {{ style: { textAlign: 'center', color: "gray", fontSize: "0.8em" } }}
            }}
            inputProps= {{ style: { textAlign: center ? 'center' : 'left', fontSize: smallLighter ? "0.8em" : "1em", color: smallLighter ? "gray" : ""  } }}
        />
    }


    // const [imgUrl, setImgUrl] = React.useState<string>("");
    // const [progresspercent, setProgresspercent] = React.useState(0);

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     const file = e.target[0]?.files[0]
    //     if (!file) return;
    //     const storageRef = ref(storage, `files/${file.name}`);
    //     const uploadTask = uploadBytesResumable(storageRef, file);

    //     uploadTask.on("state_changed",
    //         (snapshot) => {
    //             const progress =
    //                 Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    //             setProgresspercent(progress);
    //         },
    //         (error) => {
    //             alert(error);
    //         },
    //         () => {
    //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                 setImgUrl(downloadURL)
    //             });
    //         }
    //     );
    // }

    return (
        <StyledTableRow
            // className= "tableRowSelected"
            //hover 
            key={contact.id} selected={selectedContactId === contact.id ? true : false}
            //className={selectedContactId === contact.id ? 'tableRowSelected bg-cyan-400 ' : 'bg-yellow-200'}      // CYAN ne s'affiche pas, mais jaune oui
            onClick={() => setSelectedContact(contact)}
            onDoubleClick={() => diplayContactCard(contact)}
            style={{
                //backgroundColor: contact.isClient ? muiTheme.palette.primary.light : muiTheme.palette.ochre.light 
                //color: "blue" //contact.isClient ? "primary.main" : "secondary.main"
            }}
        //className='demo'
        >
            {/* Client ? */}
            <StyledTableCell component="td" scope="row" >
                <Switch
                    checked={contact.isClient}
                    onChange={() => handleUpdateContact(contact.id, { key: "isClient", value: !contact.isClient })}
                    color="success"
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </StyledTableCell>

            {/* dateOfNextCall */}           
            <StyledTableCell
                style={{
                    backgroundColor: isDatePassed(contact.dateOfNextCall)
                        ? muiTheme.palette.warning.light
                        : isDateSoon(contact.dateOfNextCall)
                            ? muiTheme.palette.ochre.light
                            : ""
                }}
            >
                {/* {contact.dateOfNextCall && <Typography variant="caption" display="block" gutterBottom>{Date.parse(contact.dateOfNextCall.toDate())}</Typography>}
                {contact.dateOfNextCall && <Typography variant="caption" display="block" gutterBottom>{Date.parse(new Date().toString())}</Typography> } */}

                {isDatePassed(contact.dateOfNextCall) && <NotificationsNoneOutlinedIcon color="error"
                    //sx={{ color: pink[800] }} 
                    fontSize='large' />}

 {/* The general recommendation is to declare the LocalizationProvider once, wrapping your entire application. Then, you don't need to repeat the boilerplate code for every Date and Time Picker in your application. */}
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                <Container
                //components={['DateTimePicker']}       // ???
                >
                    <Box sx={{
                        display: "flex",
                        justifyContent: "end",           //"space-between", 
                        marginBottom: "10px"
                    }}> {/* Sinon on pouvait mettre un float:right sur le bouton ci-dessous */}
                        {/* <NotificationsNoneOutlinedIcon sx={{ color: pink[800] }} /> */}
                        <Tooltip title="Supprimer la date">
                            <IconButton color="primary" sx={{ padding: 0 }}       // Car les boutons ont automatiquement un padding
                                onClick={() => handleChangeDate(null, "dateOfNextCall")} >
                                <ClearIcon
                                //color='warning'
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <DatePicker
                        // <DateTimePicker
                        //defaultValue={null}
                        //label="Date de relance"
                        //ampm={false}          // Si on met TIME aussi
                        // format="DD/MM/YYYY HH:mm"
                        format="DD MMM YYYY"

                        //minDate={dayjs(new Date())}   // à remettre !!!!!!!!!!!

                        // viewRenderers={{  hours: renderTimeViewClock,
                        //     minutes: renderTimeViewClock,
                        //     seconds: renderTimeViewClock, }}
                        //value={dayjs(contact.dateOfNextCall)}   // => Avant FIREBASE ça fonctionnait avec ça (car FIREBASE transforme les dates en objet Timestamp(?))
                        //{dayjs(new Date("01/01/2000"))}
                        //value={dayjs(contact.dateOfNextCall.toDate())}        // Erreur si date = null
                        //value={contact.dateOfNextCall !== null ? dayjs(contact.dateOfNextCall.toDate()) : undefined}  // Si on met UNDEFINED =>  A component is changing the uncontrolled value of a picker to be controlled. Elements should not switch from uncontrolled to controlled (or vice versa). It's considered controlled if the value is not `undefined`.
                        // Impossible de mettre une date vide ???
                        //value={contact.dateOfNextCall !== null ? dayjs(contact.dateOfNextCall.toDate()) : dayjs(new Date("01/01/2023"))}
                        value={contact.dateOfNextCall !== null ? dayjs(contact.dateOfNextCall.toDate()) : null}
                        onChange={(newDate: Dayjs | null) => handleChangeDate(newDate, "dateOfNextCall")}
                        slotProps={{
                            //textField: { variant: 'standard', }       // Fait quoi ?
                        }}
                    />
                </ Container>
                {/* </LocalizationProvider> */}
                {/* {contact.dateOfNextCall.toLocaleDateString()} {contact.dateOfNextCall.getHours().toString().padStart(2, '0')}:{contact.dateOfNextCall.getMinutes().toString().padStart(2, '0')} */}
            </StyledTableCell>

            {/* LOGO */}
            <StyledTableCell component="td" scope="row"
            //sx={{ padding:0 }}  
            >
                {/* <TextField type="file" onChange={handleChangeLogo2} /> */}
                {contact.logo && <Image src={contact.logo} alt={contact.businessName} width={100} height={100} style={{ borderRadius: "10%" }}
                //onClick={handleChangeLogo} 
                />}
                {/* <MuiFileInput
                    value={contact.logo}
                    //onChange={ (file) => handleChangeFile(file)} />
                    onChange={handleChangeLogo} />
                <div className="App">
                    {!imgUrl && <div className='outerbar'>
                        <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
                    </div>
                    }
                    <form onSubmit={handleSubmit} className='form'>
                        <input type='file' />
                        <button type='submit'>Upload</button>
                    </form>
                    <div style={{ display: "flex" }}>

                        {imgUrl && <img src={imgUrl} alt='uploaded file' height={200} />}
                    </div>
                </div> */}
            </StyledTableCell>

            {/* businessName */}
            <StyledTableCell component="td" scope="row" >
                  <TextField  //label="Nom de l'entreprise"    
                    value={contact.businessName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessName')}
                    InputProps={{
                        startAdornment: contact.isClient ? <HandshakeOutlinedIcon color='success' fontSize='large' /> : <PsychologyAltIcon
                            //color='gray'      // foncitonne mais me souligne en rouge !!!
                            sx={{
                                color: muiTheme.palette.gray.main,
                            }}
                            fontSize='large' />,
                        disableUnderline: contact.businessName.length > 0,
                    }}
                />
                {/* <CustomTextField attribut="businessName"  startAdornment={contact.isClient 
                        ? <HandshakeOutlinedIcon color='success' fontSize='large' /> 
                        : <PsychologyAltIcon sx={{ color: muiTheme.palette.gray.main, }} fontSize='large' />} 
                />             */}
            </StyledTableCell>

            {/* contactPhone + businessPhone */}
            <StyledTableCell align="center">
                <TextField id="standard-basic" //label="Téléphone" 
                    value={contact.contactPhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'contactPhone')}
                    InputProps={{
                        startAdornment: "Direct ",
                        disableUnderline: contact.businessPhone.length > 0
                    }}
                    inputProps={{ style: { textAlign: 'center' } }}
                /> 
                <TextField id="standard-basic" //label="Téléphone" 
                    value={contact.businessPhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessPhone')}
                    color="secondary"
                    size='small'
                    InputProps={{
                        // startAdornment: "Standard: ",
                        startAdornment: <span style={{ color: 'gray', fontSize: "0.8em" }}>Standard </span>,
                        disableUnderline: contact.businessPhone.length > 0
                    }}
                    inputProps={{ style: { textAlign: 'center', color: "gray", fontSize: "0.8em" } }}
                />
                 {/* <CustomTextField attribut="contactPhone" startAdornment="Direct" center={true} />
                 <CustomTextField attribut="businessPhone" startAdornment= {<span style={{ color: 'gray', fontSize: "0.8em" }}>Standard </span>} center smallLighter /> */}
            </StyledTableCell>

            {/* ContactName */}
            <StyledTableCell>
                <TextField id="standard-basic" //label="Nom du contact" 
                    value={contact.contactName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'contactName')}
                    InputProps={{
                        disableUnderline: contact.contactName.length > 0
                    }}
                />
                <TextField id="standard-basic" //label="Nom du contact" 
                    value={contact.contactPosition} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'contactPosition')}
                    InputProps={{
                        disableUnderline: contact.contactPosition.length > 0
                    }}
                    inputProps={{ style: { fontSize: "0.8em", color: "gray" } }}
                />
                {/* <CustomTextField attribut="contactName"  />
                <CustomTextField attribut="contactPosition" smallLighter /> */}
            </StyledTableCell>

            {/* contactEmail */}
            <StyledTableCell
            //align="right"
            >
                {/* <Box sx={{ display: "flex", gap: 2 }}> */}
                {/* <MailOutlineOutlinedIcon /> */}
                <Tooltip title="Contact direct">
                    <TextField id="standard-basic" //label="Email du contact" 
                        value={contact.contactEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'contactEmail')}
                        InputProps={{
                            disableUnderline: contact.contactEmail.length > 0
                        }}
                    />
                    {/*  Je met le CustomTextField dans une DIV car le composant enfant de Tooltip doit être capable d'accepter une ref */}
                    {/* <Box><CustomTextField attribut="contactEmail"/></Box> */}
                </Tooltip>
                {/* </Box> */}
                <Tooltip title="Contact entreprise">
                    <TextField id="standard-basic"
                        value={contact.businessEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessEmail')}
                        InputProps={{
                            startAdornment: contact.businessEmail.length === 0 && "...",
                            disableUnderline: true//contact.businessEmail.length > 0
                        }}
                        inputProps={{ style: { fontSize: "0.8em", color: "gray" } }}
                    />
                    {/* <Box><CustomTextField attribut="businessEmail" smallLighter /></Box> */}
                </Tooltip>
                <Tooltip title="Site Web de l'entreprise">
                    <TextField id="standard-basic"
                        value={contact.businessWebsite} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessWebsite')}
                        InputProps={{
                            startAdornment: contact.businessWebsite.length === 0 && "...",
                            disableUnderline: true//contact.businessWebsite.length > 0
                        }}
                        inputProps={{ style: { fontSize: "0.8em", color: "gray" } }}
                    />
                    {/* <Box><CustomTextField attribut="businessWebsite" smallLighter />  </Box> */}
                </Tooltip>
            </StyledTableCell>

            {/* businessCity */}
            <StyledTableCell component="td" scope="row" >
                <TextField id="standard-basic"
                    value={contact.businessCity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessCity')}
                    InputProps={{
                        disableUnderline: contact.businessCity.length > 0
                    }}
                    inputProps={{
                        style: {
                            //fontSize: "0.8em", 
                            //color: "gray"
                        }
                    }}
                />
                {/* <CustomTextField attribut="businessCity" />                     */}

                <TextField id="standard-basic"
                    value={contact.businessAddress} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessAddress')}
                    InputProps={{
                        disableUnderline: contact.businessAddress.length > 0
                    }}
                    inputProps={{ style: { fontSize: "0.8em", color: "gray" } }}
                />
                {/* <CustomTextField attribut="businessAddress" smallLighter />                     */}

            </StyledTableCell>

            {/* hasBeenCalled */}
            <StyledTableCell align="center">
                {/* Obligé de mettre dans une BOX pour centrer */}
                <Box display="flex"
                    // alignItems="center" 
                    justifyContent="center"
                >
                    <Avatar
                        sx={{ bgcolor: getPhoneIconColor(contact.hasBeenCalled), border: `4px solid ${getPhoneIconColor(contact.hasBeenCalled)}`, }}
                    // sx={{ bgcolor: "white", border: `4px solid ${getIconStyle(contact.hasBeenCalled)}`, }}
                    //className={classes.avatar}
                    >
                        <Tooltip title={getPhoneIconText(contact.hasBeenCalled)}>
                            <IconButton color="primary" onClick={handleClickHasBeenCalled}>
                                <CallRoundedIcon fontSize="large"
                                    sx={{
                                        color: "white",
                                        //backgroundColor:getIconStyle(contact.hasBeenCalled), 
                                    }}
                                // color={usePhoneIconStyle(contact.hasBeenCalled)}
                                />
                                {/* hasBeenCalled={contact.hasBeenCalled} /> */}
                                {/* {contact.hasBeenCalled === false ? <CallIcon /> : <CallRoundedIcon />}  */}
                            </IconButton>
                        </Tooltip>
                    </Avatar>
                </Box>
                {/* <Checkbox checked={contact.hasBeenCalled}       // Par défaut quand checked = true, la couleur est la primary (.light ?)
                    //color='primary'           // Si on met la couleur ici => quand non coché c'est gris !
                    sx={{
                        color: "primary.main",     // Alors qu'ici ça prend la couleur qu'on lui donne si coché ou non !
                        "&.Mui-disabled": {     // On ajoute ça pour mettre une couleur quand disabled, sinon gris !
                            color: lighten(muiTheme.palette.primary.main, 0.5)
                        },
                    }}
                    disabled={contact.hasBeenSentEmailOrMeetUp ? true : false}
                    onChange={() => handleChangeCheckbox(contact, "hasBeenCalled")} // onChange={handleChangeCheckbox(contact, "hasBeenCalled")} ???
                    inputProps={{ 'aria-label': 'controlled' }} /> */}

                {/* {contact.hasBeenCalled} */}
            </StyledTableCell>

            {/* hasBeenSentEmailOrMeetUp */}
            {/* <StyledTableCell align="center"> */}
            <StyledTableCell>
                {/* Obligé de mettre dans une BOX pour centrer */}
                <Box display="flex"
                    // alignItems="center" 
                    justifyContent="center"
                >
                    <Avatar
                        sx={{
                            bgcolor: "white",
                            //bgcolor: getEmailIconColor(contact.hasBeenSentEmailOrMeetUp),     //"white", 
                            border: `4px solid ${getEmailIconColor(contact.hasBeenSentEmailOrMeetUp)}`,
                        }}
                    //className={classes.avatar}
                    >
                        <Tooltip title={getEmailIconText(contact.hasBeenSentEmailOrMeetUp)}>
                            <IconButton color="primary" onClick={handleClickhasBeenSentEmailOrMeetUp}>
                                <RightMailIcon hasBeenSentEmailOrMeetUp={contact.hasBeenSentEmailOrMeetUp} />
                                {/* <MailOutlineIcon fontSize="large" sx={{ color: "white" }} /> */}
                            </IconButton>
                        </Tooltip>
                    </Avatar>
                </Box>

                {/* <Checkbox checked={contact.hasBeenSentEmailOrMeetUp}
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
                    // disabled={(contact.hasBeenCalled || contact.hasBeenSentEmailOrMeetUp === false) ? false : true}
                    onChange={() => handleChangeCheckbox(contact, "hasBeenSentEmailOrMeetUp")}
                    inputProps={{ 'aria-label': 'controlled' }}
                /> */}
            </StyledTableCell>          

            {/* comments */}
            <StyledTableCell align="center"
            //onClick={}
            >
                {/* <Button variant="outlined" onClick={handleClickOpen}>Modifier</Button> */}
                <IconButton aria-label="comment" color="primary" onClick={handleClickOpenCommentDialog}>
                    {/* <TextsmsTwoToneIcon onClick={handleClickOpen} /> */}
                    <ModeEditOutlineOutlinedIcon />
                    <Typography
                    // sx={{ overflow: "hidden", textOverflow: "ellipsis", fontSize: 14, }}
                    >
                        {contact.comments.length > 0 ? "..." : "x"}
                        {/* Pour tronquer */}
                        {/* {contact.comments.length < COMMENT_DISPLAY_LENGTH ? contact.comments : contact.comments.substring(0, COMMENT_DISPLAY_LENGTH) + "..."} */}
                    </Typography>
                </IconButton>
                {/* Fonction presque identique : {contact.comments.slice(0, 10)}...*/}

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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'comments')}
                            sx={{ textAlign: 'left' }}
                        />
                        {/* <CustomTextField attribut="comments"  />                     */}                        
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

            {/* interestGauge */}
            {/* https://bernii.github.io/gauge.js/#! ??? Avec CANVAS ??? */}
            <StyledTableCell align="center">
                {/* <IconButton aria-label="comment" color="primary" sx={{ padding: 0, float: "right" }}       // Car les boutons ont automatiquement un padding
                    onClick={() => handleChangeInterestGauge(null)} >
                    <ClearIcon color='warning' />
                </IconButton>
                <TextField id="standard-basic" 
                    type="number"                    
                    value={contact.interestGauge ?? ""} onChange={(newGauge) => handleChangeInterestGauge(parseFloat(newGauge.target.value))} 
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
                /> */}
                <StyledRating
                    name="highlight-selected-only"
                    //defaultValue={2}
                    sx={{ alignItems: 'center' }}
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

            {/* dateOfFirstCall */}
            <StyledTableCell >  
                <Container>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "end", 
                        marginBottom: "10px"
                    }}>
                        <Tooltip title="Supprimer la date">
                            <IconButton color="primary" sx={{ padding: 0 }}       // Car les boutons ont automatiquement un padding
                                onClick={() => handleChangeDate(null, "dateOfFirstCall")} >
                                <ClearIcon
                                //color='warning'
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <DatePicker
                        //format="DD/MM/YYYY"
                        format="DD MMM YYYY"
                        value={contact.dateOfFirstCall !== null ? dayjs(contact.dateOfFirstCall.toDate()) : null}
                        onChange={(newDate: Dayjs | null) => handleChangeDate(newDate, "dateOfFirstCall")}
                    />
                </ Container>
            </StyledTableCell>

            {/* type */}
            <StyledTableCell component="td" scope="row" >
                <TextField id="standard-basic"   
                    value={contact.businessType}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessType')}
                    InputProps={{
                        startAdornment: contact.businessType.length === 0 && "...",
                        disableUnderline: true
                    }}
                />               
                {/* <CustomTextField attribut="businessType" /> */}
            </StyledTableCell>

            {/* Supprimer contact ? */}
            <StyledTableCell align="center" >
                <Tooltip title="Supprimer le contact"
                // placement="top"
                >
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
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Supprimer le contact : <br /> <span style={{ fontWeight: "bold" }}>{contact.businessName}</span> ?
                        </Typography>
                        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</Typography> */}
                        <Button variant="contained" color='warning' onClick={handleClickDeleteContact} sx={{ marginRight: "15px" }} >Oui !</Button>
                        <Button variant="contained" color='primary' onClick={handleCloseDeleteModal} >Non</Button>
                    </Box>
                </Modal>
            </StyledTableCell>
        </StyledTableRow>
    )
}
