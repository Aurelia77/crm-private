// API INSEE Sirene V3 (entreprises et les établissements enregistrés au répertoire interadministratif Sirene depuis sa création en 1973, y compris les unités fermées. La recherche peut être unitaire, multicritère, phonétique et porter sur les données courantes et historisées.) => Voir l'aide si besoin
// https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3&provider=insee#!/Etablissement/findSiretByQ

// pas obligé de mettre USE CLIENT !!! Car c'est dans une page qui l'est déjà ???

import React, { ChangeEvent } from 'react'
import { TextField, Stack, Button, FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip, ListItem, List } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import BusinessIcon from '@mui/icons-material/Business';
import DialpadRoundedIcon from '@mui/icons-material/DialpadRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import Typography from '@mui/material/Typography';

import ContactCard from './ContactCard'

const CustomedTextField = ({ contactInfo, value, setValue }: { contactInfo: Contact, value: string, setValue: Function }) => {
    return <TextField type="text" variant='outlined' color='secondary' label="First Name" onChange={e => setValue({ ...contactInfo, value: e.target.value })} value={value} fullWidth required />
}

export default function ContactEditForm({
    //contacts, setContacts }: { contacts: Contact[], setContacts: Function 
}) {
    const token = 'b7745aa5-1ae3-30ec-885f-b73276a1a02c'
    const apiAccessUrl = "https://api.insee.fr/entreprises/sirene/V3/siret?q="

    // Utiliser un USEREDUCER ???
    // const [searchContact, setSearchContact] = React.useState<any>({
    //     name: '',
    //     siret: '',
    //     city: '',
    //     CP: '',
    // })  

  
    const emptyQuery: Query = { // ** : recherche sur une partie du mot (le SIRET, lui, doit être exact)
        name: '**',
        siret: '',
        city: '**',
        CP: '**',
    }
    const [query, setQuery] = React.useState<Query>(emptyQuery)
    const [resultSearch, setResultSearch] = React.useState<any>([])           // changer ANY par le type de l'API ??? 
    
    const emptyContact: Contact = {     // existe-t-il un moyen de créer un objet avec toutes les valeurs à '' ou 0 sans tout réécrire ???
        id : 0,
        businessName : "",
        activity : "",
        businessPhone : "", 
        businessEmail :  "",
        businessAddress : "", 
        businessCity :  "",
        contactName :  "",
        contactPhone : "", 
        contactEmail : "", 
        contactPosition: "",
        tag: [],
        interestGauge: 0,
        dateOfFirstCall: new Date(0),
        dateOfLastCall: new Date(0),
        dateOfNextCall: new Date(0),
        comments: ""
    }
    const [infosContact, setInfosContact] = React.useState<Contact>(emptyContact)  

    console.log("resultSearch", resultSearch)
   
    const isFormEmpty = () => JSON.stringify(query) === JSON.stringify(emptyQuery)
    const isSearchOnSiret = () => query.siret !== ''
    const thereIsListToDisplay = () => !isSearchOnSiret() && resultSearch.length > 0
    const thereIsContactToDisplay = () => JSON.stringify(infosContact) !== JSON.stringify(emptyContact)


    console.log("isSearchOnSiret", isSearchOnSiret())

    const fillUpContactWithResult = (resultThatWillUpdateInfosContact : any) => {
        setInfosContact({...infosContact,
            id: 0,
            businessName: resultThatWillUpdateInfosContact.uniteLegale.denominationUniteLegale,
            activity: resultThatWillUpdateInfosContact.uniteLegale.activitePrincipaleUniteLegale,
            businessPhone: "",
            businessEmail: "",
            businessAddress: resultThatWillUpdateInfosContact.adresseEtablissement.numeroVoieEtablissement + " " + resultThatWillUpdateInfosContact.adresseEtablissement.typeVoieEtablissement + " " + resultThatWillUpdateInfosContact.adresseEtablissement.libelleVoieEtablissement,
            businessCity: resultThatWillUpdateInfosContact.adresseEtablissement.libelleCommuneEtablissement,
            contactName: "",
            contactPhone: "",
            contactEmail: "",
            contactPosition: "",
            tag: [],
            interestGauge: 0,
            dateOfFirstCall: new Date(),
            dateOfLastCall: new Date(),
            dateOfNextCall: new Date(),
            comments: ""
        })
    }


    React.useEffect(() => {
        const multiCriteriaSearch = "denominationUniteLegale:" + query.name + " AND libelleCommuneEtablissement:" + query.city + " AND codePostalEtablissement:" + query.CP

        console.log(query)
        // console.log(query.city)
        console.log(query.siret)
        console.log(query.CP)   // Je mets CP en majuscule ? Ou c'est pas une bonne convention ???
        console.log("search", multiCriteriaSearch)
        // console.log(`.../siret?q=${search}`)

        console.log("isFormEmpty", isFormEmpty())
        
        const searchApiUrl = isSearchOnSiret() 
            ? apiAccessUrl + "siret:" + query.siret
            : apiAccessUrl + multiCriteriaSearch

        isFormEmpty() ? setResultSearch([])
            : fetch(searchApiUrl, {
                method: 'GET',
                headers: {
                    AUTHORIZATION: 'Bearer ' + token,
                }
            }).then(response => {
                console.log(response)
                console.log(response.url)
                //console.log(response.json())       // si on met ça erreur ! Car ne peut pas être appelé 2 fois ! (error TypeError: Failed to execute 'json' on 'Response': body stream already read at eval)                
                return response.json();
            }).then(data => {
                //console.log(data)
                console.log("data.etablissements", data.etablissements)
                data.etablissements ? setResultSearch(data.etablissements) : setResultSearch([])    // si ne trouve rien donc response.status = 404 => alors resultSearch = null
            }).catch(error => console.log('error', error))

            console.log("resultSearch", resultSearch)        
    }, 
    /*eslint-disable-next-line react-hooks/exhaustive-deps*/
    [query])
    //[query, isFormEmpty, isSearchOnSiret])    // Boucle infinie dès le départ !!! Pourquoi ??? ces fonctions ne change pourtant pas...

    React.useEffect(() => {
        console.log(resultSearch.length)
        resultSearch.length === 1 ? fillUpContactWithResult(resultSearch[0]) : setInfosContact(emptyContact)
    },
    /*eslint-disable-next-line react-hooks/exhaustive-deps*/
    [resultSearch])
    //[resultSearch, fillUpContactWithResult, emptyContact])  // Boucle infinie dès le départ !!! Pourquoi ??? ces fonctions ne change pourtant pas...

    

    return (
        <React.Fragment>
            {/* <Box sx={{
                width: '50%',
                border: 1,
                borderColor: 'primary.main',
                bgcolor: 'primary.light',	    // OU backgroundColor :"blue" (en entier) ms par ex dans FormControle, obligé de le mettre en entier (car ce n’est pas un props???)
            }}
                width={1 / 3}
                border={2}
                color='primary'
                borderColor={'secondary.main'}
                bgcolor={'secondary.light'}
            >COUCOU</Box> */}

            {/* <p>Query Name : {query.name} </p>
            <p>Query City : {query.city} </p>
            <p>Query Dep : {query.CP} </p> */}
            <Button variant="contained" color="ochre" href= '/testPages/testAutocompletePage'>Ajouter</Button> 
            <div>Coucou ma Lauriane !!</div>

            <Typography variant="h3" gutterBottom>Recherche de contact</Typography>
            <Stack sx={{ border: 3, borderColor: 'primary.main' }}
            //sx={{ justifyContent:"space-around" }} 
            justifyContent="flex-start" direction="row" 
            color='primary'   // marche pas !!!
             >
                <FormControl 
                variant='filled'  
                sx={{ 
                    width: thereIsListToDisplay() ? "33.33%" : "50%",
                    backgroundColor :"primary.light", 
                    padding: 2,
                }} >
                    <Box my={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <DialpadRoundedIcon id='siret' sx={{ color: 'action.active', mr: 1, mb: 2 }} />
                        <TextField id='siret' type="text" variant='outlined' color='primary' label="SIRET" onChange={e => setQuery({ ...query, siret: e.target.value.trim().replaceAll(" ", "") })} fullWidth />
                    </Box>
                    <Stack spacing={2}
                        //direction="row" 
                        sx={{ mb: 4 }} >
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <BadgeRoundedIcon sx={{ color: 'action.active', mr: 1, mb: 2 }} />
                            <TextField type="text" variant='outlined' color='primary' label="Nom" onChange={e => setQuery({ ...query, name: `*${e.target.value.trim().replaceAll(" ", "* AND denominationUniteLegale:*")}*` })}
                                //value={searchContact.name} // Pas besoin de mettre valeur !!!???
                                fullWidth />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <LocationCityRoundedIcon sx={{ color: 'action.active', mr: 1, mb: 2 }} />
                            <TextField type="text" variant='outlined' color='primary' label="Ville" onChange={e => setQuery({ ...query, city: `*${e.target.value.trim().replaceAll(" ", "* AND libelleCommuneEtablissement:*")}*` })} fullWidth />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <BusinessRoundedIcon sx={{ color: 'action.active', mr: 1, mb: 2 }} />
                            <TextField type="text" variant='outlined' color='primary' label="Département ou CP" onChange={e => setQuery({ ...query, CP: `*${e.target.value.trim()}*` })} fullWidth
                            // inputProps={{ maxLength: 5 }}    // Non car compte les espaces
                            />
                        </Box>
                    </Stack>
                </FormControl>

                {thereIsListToDisplay() &&
                <Box sx={{ width: thereIsContactToDisplay() ? "33.33%" : "66.66%", }}                
                border={2} color='primary.dark' borderColor={'secondary.main'} bgcolor={'secondary.light'} >
                    <List>
                        {resultSearch.map((business: any, index: number) => (
                            <ListItem key={business.siret} disablePadding onClick= {() => fillUpContactWithResult(business)}>
                                <ListItemButton>
                                    <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    {/* <ListItemIcon><BusinessIcon /></ListItemIcon> */}
                                    <ListItemText primary={business.uniteLegale.denominationUniteLegale} />
                                    <div>
                                        {/* <DialpadRoundedIcon id='siret' sx={{ color: 'action.active', mr: 1, mb: 1 }} /> */}
                                        {business.siret} - 
                                        {/* <LocationCityRoundedIcon sx={{ color: 'action.active', mx: 1, mb: 1 }} /> */}
                                        {business.adresseEtablissement.libelleCommuneEtablissement} ({business.adresseEtablissement.codePostalEtablissement}) 
                                    </div>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                }              

                {thereIsContactToDisplay() &&
                <Box width="33.33%" >
                    <ContactCard contact={infosContact} />
                      {
                    //(searchContactName !== '') && resultSearch && 
                    resultSearch.map((business: any, index: number) => (
                        <div key={business.siret}>
                            <p>{index+1} - denominationUniteLegale - {business.uniteLegale.denominationUniteLegale} -</p>
                            <p>activitePrincipaleUniteLegale - {business.uniteLegale.activitePrincipaleUniteLegale} -</p>
                            <p>adresseEtabt - {business.adresseEtablissement.numeroVoieEtablissement} {business.adresseEtablissement.libellnumeroVoieEtablissementeCommuneEtablissement} {business.adresseEtablissement.typeVoieEtablissement} {business.adresseEtablissement.libelleVoieEtablissement} {business.adresseEtablissement.codePostalEtablissement} {business.adresseEtablissement.libelleCommuneEtablissement} - </p>
                            <p>denominationUsuelle1UniteLegale : - {business.uniteLegale.denominationUsuelle1UniteLegale} -</p>
                            <p>denominationUsuelle2UniteLegale : {business.uniteLegale.denominationUsuelle2UniteLegale}</p>
                            <p>denominationUsuelle3UniteLegale : {business.uniteLegale.denominationUsuelle3UniteLegale}</p>
                            <p>Siret : {business.siret}</p>
                            <p>Siren : {business.siren} </p>
                            <p>==========================PERIODES D'ETABLISSEMENT===================================================</p>
                            {business.periodesEtablissement.map((periode: any, index: number) => (
                                <div key={index}>
                                    <p>{index+1} - denominationUsuelleEtablissement - {periode.denominationUsuelleEtablissement} - enseigne1Etablissement - {periode.enseigne1Etablissement} DU {periode.dateDebut} AU {periode.dateFin}</p>
                                    <p>enseigne2Etablissement - {periode.enseigne2Etablissement}</p>
                                    <p>enseigne3Etablissement - {periode.enseigne3Etablissement}</p>
                                </div>
                            ))}
                        </div>
                    ))
                }
                </Box>
                }

                {/* <Button variant="outlined" color="secondary" type="submit"
                 onClick={() => set} >Clear</Button>  */}


                {/* <Button variant="outlined" color="secondary" type="submit">Ajouter</Button>  */}

              
            </Stack>

        </React.Fragment >
    )
}
