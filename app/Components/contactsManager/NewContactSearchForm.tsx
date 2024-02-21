

import React from 'react'
// MUI
import { TextField, Stack,  FormControl, ListItem, List } from '@mui/material'
import { ListItemButton, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DialpadRoundedIcon from '@mui/icons-material/DialpadRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import Typography from '@mui/material/Typography';
// NEXT
import Image from 'next/image';
// Deployement VERCEL : erreur "document is not defined" => on import DYNAMIC pour que le composant ContactCard soit rendu que côté client, où l'objet document est disponible. ('use client' ne fonctionne pas)
import dynamic from 'next/dynamic';
const ContactCard = dynamic(() => import('@/app/Components/contactsManager/ContactCard'), { ssr: false });

type DomainAndLogo = {
    name: string,
    domain: string,
    logo: string
}

type NewContactSearchForm = {
    emptyContact: Contact
    addContact: (contact: Contact) => void
    currentUserId: string
    getPriorityTextAndColor: (priority: number | null) => { text: string, color: string, bgColor: string }
    setAreContactChangesSaved: (status: boolean) => void
}

export default function NewContactSearchForm({
    emptyContact,
    addContact,
    currentUserId,
    getPriorityTextAndColor,
    setAreContactChangesSaved
}: NewContactSearchForm) {

    // On crée cet objet car un ou plusieurs champs sont vides (au début ET quand on supprime les données saisies => le requête est faite avec des **)
    const emptyQuery: Query = { // ** : recherche sur une partie du mot (le SIRET, lui, doit être exact)
        name: '**',
        siret: '',
        city: '**',
        CP: '**',
        businessActivity: '**',
    }

    const [query, setQuery] = React.useState<Query>(emptyQuery)
    const [resultInseeSearch, setResultInseeSearch] = React.useState<any>([])
    // Juste ce qu'on a besoin de resultInseeSearch
    const [resultInseeSearchToKeep, setResultInseeSearchToKeep] = React.useState<Contact[]>([])
    const [resultInseeSearchToKeepPlusDomainAndLogo, setResultInseeSearchToKeepPlusDomainAndLogo] = React.useState<Contact[]>([])
    const [resultInseeSearchDomainAndLogo, setResultInseeSearchDomainAndLogo] = React.useState<DomainAndLogo[]>([])
    const [infosContact, setInfosContact] = React.useState<Contact | {}>({})

    
    const token = '613dca81-d71e-3b02-ac1a-b2170d2084c6'
    const nbResultInsee = 50
    const apiAccessUrl = `https://api.insee.fr/entreprises/sirene/V3/siret?nombre=${nbResultInsee}&q=`    
    const isFormEmpty = () => JSON.stringify(query) === JSON.stringify(emptyQuery)
    const isSearchOnSiret = () => query.siret !== ''
    const thereIsListToDisplay = () => !isSearchOnSiret() && resultInseeSearch.length > 0

    const handleOnClickBusiness = (business: Contact) => {
        setInfosContact(business)
    }

    React.useEffect(() => {
        const multiCriteriaSearch = "denominationUniteLegale:" + query.name + " AND libelleCommuneEtablissement:" + query.city + " AND codePostalEtablissement:" + query.CP + " AND activitePrincipaleUniteLegale:" + query.businessActivity

        const searchApiUrl = isSearchOnSiret()
            ? apiAccessUrl + "siret:" + query.siret
            : apiAccessUrl + multiCriteriaSearch

        isFormEmpty()
            ? setResultInseeSearch([])
            : fetch(searchApiUrl, {
                method: 'GET',
                headers: {
                    AUTHORIZATION: 'Bearer ' + token,
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                data.etablissements ? setResultInseeSearch(data.etablissements) : setResultInseeSearch([])
            }).catch(error => console.log('error', error))
    },
        /*eslint-disable-next-line react-hooks/exhaustive-deps*/
        [query])

    React.useEffect(() => {
        let tempTabResultInseeSearchToKeep: Contact[] = []
        let urls: any[] = []

        resultInseeSearch.forEach((business: any, index: number) => {
            urls.push({ id: business.siret, url: `https://autocomplete.clearbit.com/v1/companies/suggest?query=${business.uniteLegale.denominationUniteLegale}` })

            tempTabResultInseeSearchToKeep.push({
                ...emptyContact,
                id: business.siret.toString(),
                logo: '',
                businessName: business.uniteLegale.denominationUniteLegale,
                businessActivity: business.uniteLegale.activitePrincipaleUniteLegale,
                // On concatène les différents champs de l'adresse, s'ils existent
                businessAddress: ''.concat(business.adresseEtablissement.numeroVoieEtablissement ?? '', ' ', business.adresseEtablissement.typeVoieEtablissement ?? '', ' ', business.adresseEtablissement.libelleVoieEtablissement ?? '', ' ', business.adresseEtablissement.codePostalEtablissement ?? '', ' ', business.adresseEtablissement.libelleCommuneEtablissement ?? ''),
                businessCity: business.adresseEtablissement.libelleCommuneEtablissement,
            })
        })

        let ccc: any = []
        Promise.all(urls.map(url =>
            fetch(url.url).then(response => {
                return response.json();
            }))).then(data => {
                data.forEach((logoAndDomain: any, index: number) => {
                    ccc.push(logoAndDomain[0])
                })
                setResultInseeSearchDomainAndLogo(ccc)
            }).catch(error => console.log('error', error))
        setResultInseeSearchToKeep(tempTabResultInseeSearchToKeep)
    }, [resultInseeSearch])

    React.useEffect(() => {
        let tempTabResultInseeSearchToKeep3: Contact[] = []
        let tempsElement: Contact

        resultInseeSearchToKeep.forEach((element: any, index: number) => {
            tempsElement = resultInseeSearchDomainAndLogo[index] === undefined ? { ...element } : { ...element, logo: resultInseeSearchDomainAndLogo[index].logo, businessWebsite: resultInseeSearchDomainAndLogo[index].domain }
            tempTabResultInseeSearchToKeep3.push(tempsElement)
        });
        setResultInseeSearchToKeepPlusDomainAndLogo(tempTabResultInseeSearchToKeep3)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultInseeSearchDomainAndLogo]) 

    React.useEffect(() => {
        resultInseeSearchToKeepPlusDomainAndLogo.length === 1 ? setInfosContact(resultInseeSearchToKeepPlusDomainAndLogo[0]) : setInfosContact({})
    }, [resultInseeSearchToKeepPlusDomainAndLogo])
   
    return (
        <React.Fragment>
            <Stack justifyContent="flex-start" direction="row"  >
                {/* ////////////////// RECHERCHE ////////////////// */}
                <FormControl
                    variant='filled'
                    sx={{
                        width: thereIsListToDisplay() ? "20%" : "50%",
                        backgroundColor: "#ccc", //"primary.light",
                        padding: 2,
                    }} >
                    <Stack spacing={2}
                        sx={{ my: 4 }} >
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <BadgeRoundedIcon sx={{ color: 'action.active', mr: 1, mb: 2 }} />
                            <TextField type="text" variant='outlined' color='primary' label="Nom" onChange={e => setQuery({ ...query, name: `*${e.target.value.trim().replaceAll(/ |'/g, "* AND denominationUniteLegale:*")}*` })}
                                fullWidth />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <LocationCityRoundedIcon sx={{ color: 'action.active', mr: 1, mb: 2 }} />
                            <TextField type="text" variant='outlined' color='primary' label="Ville" onChange={e => setQuery({ ...query, city: `*${e.target.value.trim().replaceAll(/ |'/g, "* AND libelleCommuneEtablissement:*")}*` })} fullWidth />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <BusinessRoundedIcon sx={{ color: 'action.active', mr: 1, mb: 2 }} />
                            <TextField type="text" variant='outlined' color='primary' label="Département ou CP" onChange={e => setQuery({ ...query, CP: `*${e.target.value.trim()}*` })} fullWidth
                            />
                        </Box>
                    </Stack>
                    <p>Si recherche par SIRET le reste n'est pas pris en compte<br />
                        (enlever le SIRET pour qu'elle se fasse sur le reste)
                    </p>
                    <Box
                        sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <DialpadRoundedIcon id='siret' sx={{ color: 'action.active', mr: 1, mb: 2 }} />
                        <TextField id='siret' type="text" variant='outlined' color='primary' label="SIRET" onChange={e => setQuery({ ...query, siret: e.target.value.trim().replaceAll(" ", "") })} fullWidth />
                    </Box>
                </FormControl>

                {/* ////////////////// RESULTATS ////////////////// */}
                {thereIsListToDisplay() &&
                    <Box sx={{
                        width: Object.entries(infosContact).length > 0 ? "20%" : "80%",
                    }}
                        bgcolor={'pink.light'}
                    >
                        <Typography variant="h6" sx={{ p: 2, bgcolor: 'background.default' }}>
                            {resultInseeSearchToKeepPlusDomainAndLogo.length === nbResultInsee
                                ? "Plus de " + nbResultInsee + " résultats, veuillez affiner votre recherche"
                                : resultInseeSearchToKeepPlusDomainAndLogo.length + " résultats"
                            }
                        </Typography>
                        <List
                            sx={{
                                overflow: 'auto',
                                maxHeight: "100vh",
                            }}
                            subheader={<li />}
                        >
                            {resultInseeSearchToKeepPlusDomainAndLogo.map((business: Contact) => (
                                <ListItem key={business.id} disablePadding onClick={() => handleOnClickBusiness(business)}>
                                    <ListItemButton>
                                        {business.logo
                                            ? <Image alt="Random image" src={business.logo} width={50} height={50} style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover',
                                            }} />
                                            : <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        }
                                        <ListItemText sx={{
                                            width: "100%",
                                            ml: 1,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}
                                        >{business.businessName}
                                            <span style={{ color: 'gray', fontSize: '0.8em' }}> ({business.businessCity})</span>
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                }

                {/* ////////////////// Affichage d'UN CONTACT ////////////////// */}
                {Object.entries(infosContact).length > 0 &&
                    <Box width="60%" >
                        <ContactCard
                            contact={infosContact as Contact}
                            currentUserId={currentUserId}
                            addContact={addContact}
                            getPriorityTextAndColor={getPriorityTextAndColor}
                            setAreContactChangesSaved={setAreContactChangesSaved}
                        />
                    </Box>
                }
            </Stack>
        </ React.Fragment>
    )
}
