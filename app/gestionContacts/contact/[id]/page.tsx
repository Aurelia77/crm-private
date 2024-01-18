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
import { TextField, Stack, Button, FormControl, InputLabel, MenuItem, Autocomplete, Chip, ListItem, List, OutlinedInput, Checkbox, ListItemText, FormControlLabel, Tooltip, Modal, Rating, Link, InputAdornment, Alert, Container, CircularProgress } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { contactTypes, emptyContact, useGetPriorityTextAndColor, modalStyle } from '@/app/utils/toolbox'
import dayjs, { Dayjs } from 'dayjs';       // npm install dayjs
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import { Timestamp } from 'firebase/firestore';
import { useTheme } from '@mui/material/styles';
import { storage, addFileOnFirebaseDB, getCategoriesFromDatabase } from '@/app/utils/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import { Input } from '@mui/material';
import { handleOpenFile } from '@/app/utils/firebase'
import { Tab, Tabs } from '@mui/material';
import { TabPanel } from '@/app/utils/StyledComponentsAndUtilities';
import { getFilesFromDatabase } from '@/app/utils/firebase'
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
import { StyledRating, StyledRatingStars, IconContainer, customIcons } from '@/app/utils/StyledComponentsAndUtilities';
import SettingsIcon from '@mui/icons-material/Settings';
import CallRoundedIcon from '@mui/icons-material/CallRounded';

import Zoom from '@mui/material/Zoom';

import { isDatePassed, isDateSoon } from '@/app/utils/toolbox'
import { truncate } from 'fs';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useNavigate, useLocation, useBlocker } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { useAuthUserContext } from '@/app/context/UseAuthContextProvider'
import { useContactsContext } from '@/app/context/UseContactsContextProvider';
import { getContactInfoInDatabaseFromId } from '@/app/utils/firebase';
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
    const deleteDataOnFirebaseAndReload = useContactsContext().deleteDataOnFirebaseAndReload
    const updateWholeContactInContactsAndDB = useContactsContext().updateWholeContactInContactsAndDB
    const setAreContactChangesSaved = useContactsContext().setAreContactChangesSaved

    const [isModalContactNotExistOpen, setIsModalContactNotExistOpen] = React.useState(false);


    const params = useParams()
    const contactId = params.id

    console.log("typeof contactId : ", typeof contactId) // c'est bien une string pourtant erreur si pas ligne ci-dessous
    const contactIdStr = Array.isArray(contactId) ? contactId[0] : contactId;


    const { data: contact, isLoading, isError } = useQuery({
        queryKey: ['contacts', contactId],
        queryFn: () => getContactInfoInDatabaseFromId(contactIdStr),
        enabled: contactIdStr !== undefined,
    });

    console.log("contactInfo : ", contact)

    // Si les données ont chargées et que le contact n'existe pas => modal
    React.useEffect(() => {
        if (!isLoading && !contact) {
            setIsModalContactNotExistOpen(true);
        }
    }, [isLoading, contact]);





    // const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
    // const navigate = useNavigate();
    // const location = useLocation();




    // React.useEffect(() => {
    //     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    //         //if (hasContactInfoChanged) {
    //             e.preventDefault();
    //             e.returnValue = 'Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter cette page ?';
    //         //}
    //     };

    //     const handleNavigation = (path: any) => {
    //         if (
    //             //hasUnsavedChanges && 
    //             !window.confirm('Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter cette page ?')) {
    //             return;
    //         }
    //         navigate(path);
    //     };

    //     //window.addEventListener('beforeunload', handleBeforeUnload);
    //     window.addEventListener('beforeunload', handleNavigation);

    //     return () => {
    //         //window.removeEventListener('beforeunload', handleBeforeUnload);
    //         window.removeEventListener('beforeunload', handleNavigation);
    //     };
    // }, []);
    // // }, [hasContactInfoChanged]);




    return (
        <Box sx={{
            position: "relative",
        }}>
            {isLoading
                ? <Container sx={{ ml: "50%", mt: "20%" }} >
                    <CircularProgress color='info' />
                </Container>
                : isError
                    ? <Typography>Une erreur s'est produite</Typography>
                    : contact && <ContactCard
                        contact={contact}
                        currentUserId={currentUser?.uid}
                        getPriorityTextAndColor={getPriorityTextAndColor}
                        //setHasContactInfoChanged={setHasContactInfoChanged}
                        setAreContactChangesSaved={setAreContactChangesSaved}
                        handleDeleteContact={deleteDataOnFirebaseAndReload}
                        updateContact={updateWholeContactInContactsAndDB}
                    />}

            <Modal open={isModalContactNotExistOpen} onClose={() => setIsModalContactNotExistOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography color="error" >Ce contact n'existe pas.</Typography>
                </Box>
            </Modal>
        </Box>
    );
}
