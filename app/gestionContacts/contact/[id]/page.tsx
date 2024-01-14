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
import { contactTypes, emptyContact, useGetPriorityTextAndColor } from '../../../utils/toolbox'
import dayjs, { Dayjs } from 'dayjs';       // npm install dayjs
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import { Timestamp } from 'firebase/firestore';
import { useTheme } from '@mui/material/styles';
import { storage, addFileOnFirebaseDB, getCategoriesFromDatabase } from '../../../utils/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import { Input } from '@mui/material';
import { handleOpenFile } from '../../../utils/firebase'
import { Tab, Tabs } from '@mui/material';
import { TabPanel } from '../../../utils/StyledComponents';
import { getFilesFromDatabase } from '../../../utils/firebase'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { modalStyle } from '../../../utils/StyledComponents'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import MailIcon from '@mui/icons-material/Mail';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';
import LanguageIcon from '@mui/icons-material/Language';
import PsychologyAlt from '@mui/icons-material/PsychologyAlt';
import { StyledRating, StyledRatingStars, IconContainer, customIcons } from '../../../utils/StyledComponents';
import SettingsIcon from '@mui/icons-material/Settings';
import CallRoundedIcon from '@mui/icons-material/CallRounded';

import Zoom from '@mui/material/Zoom';

import { isDatePassed, isDateSoon } from '../../../utils/toolbox'
import { truncate } from 'fs';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useAuthUserContext } from './../../../context/UseAuthContextProvider'



import { getContactInfoInDatabaseFromId } from './../../../utils/firebase';
import ContactCard from '@/app/Components/contactsManager/ContactCard';

// const getUser = (userId: string) =>
//   fetch(`/api/users/${userId}`)
//     .then((res) => res.json())
//     .then(UserResponseSchema.parse);

// const getUserPosts = (userId: string) =>
//   fetch(`/api/users/${userId}/posts`)
//     .then((res) => res.json())
//     .then(PostsResponseSchema.parse);

export default function ContactCardPage() {

    const { currentUser } = useAuthUserContext()
    const getPriorityTextAndColor = useGetPriorityTextAndColor();



    const params = useParams()
    const contactId = params.id

    console.log("params : ", params)
    console.log("contactId : ", contactId)
    console.log("typeof contactId : ", typeof contactId) // c'est bien une string pourtant erreur si pas ligne ci-dessous

    const contactIdStr = Array.isArray(contactId) ? contactId[0] : contactId;


    const { data: contact, isLoading, isError } = useQuery({
        queryKey: ['contacts', contactId],
        queryFn: () => getContactInfoInDatabaseFromId(contactIdStr),
        enabled: contactIdStr !== undefined,
    });

    console.log("contactInfo : ", contact)

    const [hasContactInfoChanged, setHasContactInfoChanged] = React.useState(false)
    const [openWarningModal, setOpenWarningModal] = React.useState(false);


    const handleNotSaveContactInfo = () => {
        setOpenWarningModal(false)
        //setTabValue(tabValueWithoutSavingInfoChanges)
        setHasContactInfoChanged(false)
    }



    // React.useEffect(() => {
    //     const handleBeforeUnload = (event) => {
    //         if (hasContactInfoChanged) { 
    //             event.preventDefault();
    //             event.returnValue = '';
    //             setOpenWarningModal(true)
    //         }
    //     };

    //     window.addEventListener('beforeunload', handleBeforeUnload);

    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, [hasContactInfoChanged]); 






    //   if (isLoading) {
    //     return <Loader />;
    //   }

    //   if (isError) {
    //     return <div>Something went wrong</div>;
    //   }

    return (
        <Box sx={{
            position: "relative",
        }}>
            <Modal
                open={openWarningModal}
                onClose={() => setOpenWarningModal(false)}
            >
                <Box sx={modalStyle} >
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ mb: 5 }}
                    >
                        Attention, vous avez fait des changements non sauvegardés : êtes vous sûr de vouloir quitter ?
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                        <Button
                            variant="contained"
                            color='warning'
                            onClick={handleNotSaveContactInfo}
                            sx={{ marginRight: "15px" }}
                        >
                            Oui !
                        </Button>
                        <Button variant="contained" color='primary' sx={{ color: "white" }} onClick={() => setOpenWarningModal(false)} >Non</Button>
                    </Box>
                </Box>
            </Modal>

            {contact && <ContactCard
                contact={contact}
                currentUserId={currentUser?.uid}
                getPriorityTextAndColor={getPriorityTextAndColor}
                setHasContactInfoChanged={setHasContactInfoChanged}
            //handleDeleteContact={deleteDataOnFirebaseAndReload}
            //updateContact={updateWholeContactInContactsAndDB}
            />}

        </Box>

    );
}
