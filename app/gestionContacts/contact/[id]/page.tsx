'use client'
import React from 'react'
// UTILS
import { useGetPriorityTextAndColor, modalStyle } from '@/app/utils/toolbox'
// FIREBASE
import { getContactInfoInDatabaseFromId } from '@/app/utils/firebase';
// CONTEXTS
import { useAuthUserContext } from '@/app/context/UseAuthContextProvider'
import { useContactsContext } from '@/app/context/UseContactsContextProvider';
// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Modal } from '@mui/material'
// NEXT
import { useParams } from 'next/navigation';
// Deployement VERCEL : erreur "document is not defined" => on import DYNAMIC pour que le composant ContactCard soit rendu que côté client, où l'objet document est disponible. ('use client' ne fonctionne pas)
import dynamic from 'next/dynamic';
const ContactCard = dynamic(() => import('@/app/Components/contactsManager/ContactCard'), { ssr: false });

export default function ContactCardPage() {
    const [isModalContactNotExistOpen, setIsModalContactNotExistOpen] = React.useState(false);
    const [contactToDisplay, setContactToDisplay] = React.useState<Contact | null>(null)

    const { currentUser } = useAuthUserContext()
    const deleteDataOnFirebaseAndReload = useContactsContext().deleteDataOnFirebaseAndReload
    const updateWholeContactInContactsAndDB = useContactsContext().updateWholeContactInContactsAndDB
    const setAreContactChangesSaved = useContactsContext().setAreContactChangesSaved

    const getPriorityTextAndColor = useGetPriorityTextAndColor();
    const params = useParams()
    const contactId = params.id

    //console.log("typeof contactId : ", typeof contactId) // c'est bien une string pourtant erreur si pas ligne ci-dessous
    const contactIdStr = Array.isArray(contactId) ? contactId[0] : contactId;

    React.useEffect(() => {
        getContactInfoInDatabaseFromId(contactIdStr).then((contact: Contact | null) => {
            console.log("contact : ", contact)
            if (contact) {
                setContactToDisplay(contact);
            } else {
                setIsModalContactNotExistOpen(true);
            }
        });
    }, [contactIdStr])

    // J'ai enlevé l'utilisation de react-query car quand je faisait une modif d'un contact (dans le tableau ou sur une vue d'un contact, quand je recliquais sur un contact les changement n'étaient pas enregistrés ! (au 1er ou au 3ème clic c'était bon... J'ai essayé d'utiliser le staleTime à 0 mais ça ne changeait rien (je crois qu'il y est déjà par défaut), j'ai essayé aussi avec useMutation mais j'y arrive pas... ))    
    // const { data: contact, isLoading, isError } = useQuery({
    //     queryKey: ['contacts', contactId],
    //     queryFn: () => getContactInfoInDatabaseFromId(contactIdStr),
    //     enabled: contactIdStr !== undefined,
    //     staleTime: 0
    // });

    return (
        <Box sx={{
            position: "relative",
        }}>
            {
                contactToDisplay && <ContactCard
                    contact={contactToDisplay}
                    currentUserId={currentUser?.uid}
                    getPriorityTextAndColor={getPriorityTextAndColor}
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
