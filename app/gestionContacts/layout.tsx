'use client'

import * as React from 'react';
// UTILS
import { TABS_WIDTH, modalStyle, updatedContactsInLocalList, updatedContactsInLocalListWithWholeContact } from '@/app/utils/toolbox'
// CONTEXTS
import { useAuthUserContext } from '@/app/context/UseAuthContextProvider'
import ContactsContext from '@/app/context/UseContactsContextProvider';
// FIREBASE
import { updatDataOnFirebase, updatDataWholeContactOnFirebase, deleteDataOnFirebaseAndReload } from '@/app/utils/firebase'
import { Timestamp } from 'firebase/firestore';
// COMPONENTS
import AuthDetails from '@/app/Components/AuthDetails';
// MUI
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Tooltip, Modal } from '@mui/material';
import { ListItem, List, ListItemIcon, Box } from '@mui/material'
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// NEXT
import Link from 'next/link';
//import { Link } from 'react-router-dom' // to au lieu de href, recharche même le layout ! Et ici me met une erreur : Cannot update a component (`HotReload`) while rendering a different component (`Link`)
import {  usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';

export default function ContactsLayout({
    children,
}: {
    children: React.ReactNode
}) {    
    const [allContacts, setAllContacts] = React.useState<Contact[]>([])
    const [areContactChangesSaved, setAreContactChangesSaved] = React.useState(true)
    const [newPathname, setNewPathname] = React.useState("")
    const [shouldRedirect, setShouldRedirect] = React.useState<boolean>(false)
    const [isWarningModalOpen, setIsWarningModalOpen] = React.useState<boolean>(false);
    const [tabValue, setTabValue] = React.useState(0);
    
    const pathname = usePathname()

    const titles = [
        { label: "Liste des contacts", icon: <Diversity3Icon />, href: "/gestionContacts/contactsTable" },
        { label: "Calendrier", icon: <CalendarMonthIcon />, href: "/gestionContacts/calendar" },
        { label: "Nouveau contact", icon: <PersonAddIcon />, href: "/gestionContacts/newContact" },
        { label: "Vu d'un contact (cliquez sur un logo dans la liste des contacts)", icon: <PersonIcon />, href: "/" },
        { label: "Admin", icon: <SettingsIcon />, href: "/gestionContacts/admin" },
        { label: "Aide", icon: <HelpOutlineIcon />, href: "/gestionContacts/help" },
    ]

    const updateContactInContactsAndDB = (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => {
        setAllContacts(updatedContactsInLocalList(allContacts, id, keyAndValue))
        updatDataOnFirebase(id, keyAndValue)
    }

    const updateWholeContactInContactsAndDB = (contactToUpdate: Contact) => {
        setAllContacts(updatedContactsInLocalListWithWholeContact(allContacts, contactToUpdate))
        updatDataWholeContactOnFirebase(contactToUpdate)
    }

    const handleNotSaveContactInfo = () => {
        setIsWarningModalOpen(false)
        setAreContactChangesSaved(true)
        //redirect(newPathname) // impossible ici ! Donc je l'ai mis dans un useEffect
        setShouldRedirect(true)
    }

    React.useEffect(() => {
        if (shouldRedirect) {
            setShouldRedirect(false)
            redirect(newPathname)
        }
    }, [shouldRedirect])

    return (
        <Box sx={{
            position: "relative",
        }}>
            <Box>
                <Box>
                    <AuthDetails />
                </Box>

                {/* ///////////////////////ONGLETS - Tabs /////////////////////// */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        height: '100vh',
                    }}
                >
                    <List
                        sx={{
                            borderRight: 1,
                            borderColor: 'divider',
                            width: TABS_WIDTH,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {titles.map((title, index) => (                            
                            <Link
                                key={index}
                                href={title.href}
                                passHref    // utilisé pour passer l'attribut href à son enfant
                                onClick={(e) => {
                                    if (!areContactChangesSaved) {
                                        setNewPathname(title.href)
                                        setIsWarningModalOpen(true)
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <ListItem sx={{ mt: 3 }} >
                                    <Tooltip title={title.label} placement="right">
                                        <ListItemIcon
                                            sx={{
                                                minWidth: "23px",
                                                // Pour savoir sur quel onglet on est (pour la vue d'un contact on compare les chaines de caractères)
                                                color: (pathname === title.href || (pathname.startsWith("/gestionContacts/contact/") && title.href === '/'))
                                                    ? 'primary.main'
                                                    : ''
                                            }}
                                        >
                                            {title.icon}
                                        </ListItemIcon>
                                    </Tooltip>
                                </ListItem>
                            </Link>
                        ))}
                    </List>

                    <Box
                        width={`calc(100vw - ${TABS_WIDTH}px)`}
                    >
                        <ContactsContext.Provider
                            value={{
                                updateContactInContactsAndDB: updateContactInContactsAndDB,
                                deleteDataOnFirebaseAndReload: deleteDataOnFirebaseAndReload,
                                updateWholeContactInContactsAndDB: updateWholeContactInContactsAndDB,
                                areContactChangesSaved: areContactChangesSaved,
                                setAreContactChangesSaved: setAreContactChangesSaved,
                            }}
                        >
                            {children}
                        </ContactsContext.Provider>
                    </Box>
                </Box>

                <Modal
                    open={isWarningModalOpen}
                    onClose={() => setIsWarningModalOpen(false)}
                >
                    <Box sx={modalStyle} >
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{
                                mb: 5, overflow: "visible", textOverflow: "clip",
                                whiteSpace: "normal"
                            }}
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
                            <Button variant="contained" color='primary' sx={{ color: "white" }} onClick={() => setIsWarningModalOpen(false)} >Non</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Box>
    )
}
