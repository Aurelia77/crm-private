'use client'

import { Box } from '@mui/material'
import React from 'react'
import { useAuthUserContext } from '../../context/UseAuthContextProvider'
import { addContactOnFirebaseAndReload } from '../../utils/firebase'
import { emptyContact } from '../../utils/toolbox'
import { useGetPriorityTextAndColor, modalStyle } from '../../utils/toolbox'
import NewContactSearchForm from '../../Components/contactsManager/NewContactSearchForm'
import ContactCard from '../../Components/contactsManager/ContactCard'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TabPanel } from '../../utils/StyledComponentsAndUtilities'
import { useContactsContext } from '@/app/context/UseContactsContextProvider';
import { redirect } from 'next/navigation';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';


export default function NewContactPage() {

  const { currentUser } = useAuthUserContext()
  const getPriorityTextAndColor = useGetPriorityTextAndColor()

  const [tabNewContactValue, setTabNewContactValue] = React.useState(0);
  // const [tabValueWithoutSavingInfoChanges, setTabValueWithoutSavingInfoChanges] = React.useState(0);
  // const [openWarningModal, setOpenWarningModal] = React.useState(false);

  const setAreContactChangesSaved = useContactsContext().setAreContactChangesSaved

  // A VOIR !!
  // const router = useRouter();   // Si Warning: Cannot update a component (`HotReload`) while rendering a different component (`NewContactPage`).

  // React.useEffect(() => {
  //   const handleRouteChange = (url: string) => {
  //     if (hasContactInfoChanged) {
  //       setOpenWarningModal(true);
  //       router.events.off('routeChangeStart', handleRouteChange);
  //     }
  //   };

  //   router.events.on('routeChangeStart', handleRouteChange);

  //   return () => {
  //     router.events.off('routeChangeStart', handleRouteChange);
  //   };
  // }, [hasContactInfoChanged, router.events])


  // const handleNotSaveContactInfo = () => {
  //   setOpenWarningModal(false)
  //   //setTabValue(tabValueWithoutSavingInfoChanges)
  //   setAreContactChangesSaved(false)
  // }

  return (
    currentUser
      ? <Box>
        {/* <Modal
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
        </Modal> */}
        <Tabs
          value={tabNewContactValue}
          onChange={(e, newValue) => setTabNewContactValue(newValue)}
          aria-label="Horizontal tabs"
        >
          <Tab key={0} label="Recherche INSEE"
          />
          <Tab key={1} label="Ajout à partir de zéro"
          />
        </Tabs>

        {/* ///////// Recherche INSEE ///////// */}
        <TabPanel key="0" value={tabNewContactValue} index={0}  >
          <NewContactSearchForm
            emptyContact={emptyContact}
            currentUserId={currentUser.uid}
            getPriorityTextAndColor={getPriorityTextAndColor}
            setAreContactChangesSaved={setAreContactChangesSaved}
            addContact={(e) => addContactOnFirebaseAndReload(currentUser.uid, e)}
          />
        </TabPanel>

        {/* ///////// Recherche de ZERO ///////// */}
        <TabPanel key="1" value={tabNewContactValue} index={1} >
          <ContactCard
            contact={emptyContact}
            currentUserId={currentUser.uid}
            getPriorityTextAndColor={getPriorityTextAndColor}
            setAreContactChangesSaved={setAreContactChangesSaved}
            addContact={(e) => addContactOnFirebaseAndReload(currentUser.uid, e)}
          />
        </TabPanel>
      </Box>
      : redirect('/')
  )
}
