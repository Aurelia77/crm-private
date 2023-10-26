// API INSEE Sirene V3 (entreprises et les établissements enregistrés au répertoire interadministratif Sirene depuis sa création en 1973, y compris les unités fermées. La recherche peut être unitaire, multicritère, phonétique et porter sur les données courantes et historisées.) => Voir l'aide si besoin
// https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3&provider=insee#!/Etablissement/findSiretByQ

'use client'

import React, { ChangeEvent } from 'react'
import { TextField, Stack, Button, FormControl,Autocomplete, Chip, ListItem, List } from '@mui/material'
import { ListItemButton, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DialpadRoundedIcon from '@mui/icons-material/DialpadRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import Typography from '@mui/material/Typography';

// Components
import ContactCard from './../ContactCard'

export default function TestFetchx2({
    //contacts, setContacts }: { contacts: Contact[], setContacts: Function 
}) {
    const token = '0c806183-de69-3607-8e2e-750ca0b7b382'
    const apiAccessUrl = "https://api.insee.fr/entreprises/sirene/V3/siret?q="
    
    const codesNaf = require('../../nafCodes.json');       // donc codesNaf = à ce qu'on a dans nafCodes.json => un tableau d'objets   


  
    // On crée cet objet car un ou plusieurs champs sont vides (au début ET quand on supprime les données saisies => le requête est faite avec des **)
    const emptyQuery: Query = { // ** : recherche sur une partie du mot (le SIRET, lui, doit être exact)
        name: '**',
        siret: '',
        city: '**',
        CP: '**',
        businessActivity: '**',
    }
    const [query, setQuery] = React.useState<Query>(emptyQuery)
    const [resultInseeSearch, setResultInseeSearch] = React.useState<any>([])           // changer ANY par le type de l'API ??? 
    // Juste ce qu'on a besoin de resultInseeSearch
    const [resultInseeSearchToKeep, setResultInseeSearchToKeep] = React.useState<Contact[]>([])   
    //  + domaine + logo
    const [resultInseeSearchToKeepPlusDomainAndLogo, setResultInseeSearchToKeepPlusDomainAndLogo] = React.useState<Contact[]>([])   

   
    const [resultInseeSearchDomainAndLogo, setResultInseeSearchDomainAndLogo] = React.useState<any>([])           // changer ANY par le type de l'API ??? 
    
    console.log('%c    *123 - RACINE', 'color: tomato')
    console.log("*123////////////////resultInsee/////////////////",resultInseeSearch)
    console.log("*/*123////////////////resultInseeSearchDomainAndLogo/////////////////",resultInseeSearchDomainAndLogo)
    console.log("*/*123////////////////resultInseeSearchToKeep/////////////////",resultInseeSearchToKeep)
    console.log("*/*123////////////////resultInseeSearchToKeepPlusDomainAndLogo/////////////////",resultInseeSearchToKeepPlusDomainAndLogo)

    const [infosContact, setInfosContact] = React.useState<Contact | {}>({})  
   
    const isFormEmpty = () => JSON.stringify(query) === JSON.stringify(emptyQuery)
    const isSearchOnSiret = () => query.siret !== ''
    const thereIsListToDisplay = () => !isSearchOnSiret() && resultInseeSearch.length > 0 

    React.useEffect(() => {
        console.log("*123-USEEFFECT_1 QUERY")// : query", query)

        const multiCriteriaSearch = "denominationUniteLegale:" + query.name + " AND libelleCommuneEtablissement:" + query.city + " AND codePostalEtablissement:" + query.CP + " AND activitePrincipaleUniteLegale:" + query.businessActivity
        
        const searchApiUrl = isSearchOnSiret() 
            ? apiAccessUrl + "siret:" + query.siret
            //: apiAccessUrl + "denominationUniteLegale:prox&nombre=5"
             : apiAccessUrl + multiCriteriaSearch + "&nombre=30"

        isFormEmpty() 
            ? setResultInseeSearch([])
            : fetch(searchApiUrl, {
                method: 'GET',
                headers: {
                    AUTHORIZATION: 'Bearer ' + token,
                }
            }).then(response => {
                console.log(response)
                //console.log(response.url)
                //console.log(response.json())       // si on met ça erreur ! Car ne peut pas être appelé 2 fois ! (error TypeError: Failed to execute 'json' on 'Response': body stream already read at eval)                
                return response.json();
            }).then(data => {
                //console.log(data)
                console.log("123123data.etablissements", data.etablissements)
                data.etablissements ? setResultInseeSearch(data.etablissements) : setResultInseeSearch([])    // si ne trouve rien donc response.status = 404 => alors resultInseeSearch = null
            }).catch(error => console.log('error', error))

            //console.log("resultInseeSearch", resultInseeSearch)        
    }, 
    [query])


    React.useEffect(() => {
        console.log("*123**3***-USEEFFECT_2 RESULTINSEE : resultInseeSearch", resultInseeSearch)

        let tempTab : Contact[] = []
        let tempTabLogoAndDomain : any[] = []

        let urls : any[] = []



        resultInseeSearch.forEach((business: any, index: number) => {

            console.log("123-NAME", business.uniteLegale.denominationUniteLegale)
            console.log("*123-SIRET",index,  business.siret)    
            console.log("*123-URL LOGO",`https://autocomplete.clearbit.com/v1/companies/suggest?query=${business.uniteLegale.denominationUniteLegale}`)


            urls.push({id: business.siret, url: `https://autocomplete.clearbit.com/v1/companies/suggest?query=${business.uniteLegale.denominationUniteLegale}`})
                
        console.log("0*123123*-urls", urls )


        // fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${business.uniteLegale.denominationUniteLegale}`, {
        //     //fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query="Les Trésors de Lily"`, {
        //     }).then(response => {
        //         console.log("*1*123-SIRET-Dans FETCH Logo",index,  business.siret)

        //         console.log(response)
        //         //console.log(response.url)
        //         //console.log(response.json())       // si on met ça erreur ! Car ne peut pas être appelé 2 fois ! (error TypeError: Failed to execute 'json' on 'Response': body stream already read at eval)                
        //         return response.json();
        //     }).then(data => {
        //         console.log("*2*123-SIRET-Dans FETCH Logo",index,  business.siret)
        //         console.log("123!!!!!!!!!!data", data)
        //         console.log("123", index)
        //         //console.log("123",data[0].logo)
    
        //         // logo = 22//data[0].logo
        //         // domain = 33//data[0].domain
                
        //         //data[0].logo && tempTabLogoAndDomain.push({[index]: 1 })  //data[0].logo})
        //         tempTabLogoAndDomain.push( {id : business.siret, logo: data[0]?.logo ??  1} )
        //         //tempTab.push( {[logo]: data[0]?.logo ??  1} )
        //         console.log("123tempTabLogoAndDomain", tempTabLogoAndDomain)        // se rempli
        //         setResultInseeSearchDomainAndLogo(tempTabLogoAndDomain)
        //     }).catch(error => console.log('error', error)) 
           

            console.log("123-----------------------------------tempTabLogoAndDomain", tempTabLogoAndDomain) // tjs vide (car après le fetch qui est asynchrone ???) => attendre la sorti du map pour retrouver les données dans resultInseeSearchDomainAndLogo (où on les a enregistrées)
      

            tempTab.push({
                id : business.siret.toString(), 
                logo : "logo", //TESTgetLogoAndDomainTEST(business.uniteLegale.denominationUniteLegale).test,
                businessName : business.uniteLegale.denominationUniteLegale, 
                denominationUsuelleEtablissement  : [],            
                businessActivity: business.uniteLegale.activitePrincipaleUniteLegale, 
                businessAddress: business.adresseEtablissement.numeroVoieEtablissement + " " + business.adresseEtablissement.typeVoieEtablissement + " " + business.adresseEtablissement.libelleVoieEtablissement ,
                businessWebsite: "",
                businessPhone: "",
                businessEmail : "",
                businessCity : "",
                contactName : "",
                contactPhone : "",
                contactEmail : "",
                contactPosition : "",
                tag : [],
                interestGauge : 0, // Marche pas ???    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, 
                dateOfFirstCall : new Date("2021-05-01"),
                dateOfLastCall : new Date("2021-05-01"),
                dateOfNextCall : new Date("2021-05-01"),
                comments : "",
            })   

            console.log("123-----------------------------------tempTab", tempTab)

                // LOGO ET DOMAIN !!!
                //denominationUsuelleEtablissement
        })
        console.log("123tempTab", tempTab)    
        console.log("123tempTabLogoAndDomain", tempTabLogoAndDomain)    // tjs vide (car remis à 0 près le FETCH ???)



        console.log("*123123*-urls", urls )
        let ccc = []
        Promise.all(urls.map(url =>
            // do something with this response like parsing to JSON
            fetch(url.url).then(response => {
                //console.log("*1*123-SIRET-Dans FETCH Logo",index,  business.siret)

                console.log("*/*123response",response)
                //console.log(response.url)
                //console.log(response.json())       // si on met ça erreur ! Car ne peut pas être appelé 2 fois ! (error TypeError: Failed to execute 'json' on 'Response': body stream already read at eval)                
                return response.json();
            }))).then(data => {
                //console.log("*2*123-SIRET-Dans FETCH Logo",index,  business.siret)
                console.log("*/*123!!!!!!!!!!data", data)
                //console.log("123", index)
                //console.log("123",data[0].logo)
    
                // logo = 22//data[0].logo
                // domain = 33//data[0].domain
                
                //data[0].logo && tempTabLogoAndDomain.push({[index]: 1 })  //data[0].logo})
                //tempTabLogoAndDomain.push( {id : business.siret, logo: data[0]?.logo ??  1} )
                //tempTab.push( {[logo]: data[0]?.logo ??  1} )
                //console.log("123tempTabLogoAndDomain", tempTabLogoAndDomain)        // se rempli

                data.forEach((logoAndDomain: any, index: number) => {                    
                    ccc.push( logoAndDomain[0] )
                    console.log("*/*123 data 0", logoAndDomain[0])
                    console.log("*/*123resultInseeSearchDomainAndLogo", resultInseeSearchDomainAndLogo)
                })
                setResultInseeSearchDomainAndLogo(ccc)
            }).catch(error => console.log('error', error)) 

        setResultInseeSearchToKeep(tempTab)   
    },[resultInseeSearch])


    React.useEffect(() => {
        const tempsTab3 : Contact[] = []

        // console.log("**123_USEEFFECT_3_resultInseeSearchToKeep", resultInseeSearchToKeep)
        // console.log("**123_USEEFFECT_3_resultInseeSearchDomainAndLogo", resultInseeSearchDomainAndLogo)

        let tempTab3 = []
        let tempsElement = {}


        resultInseeSearchToKeep.forEach((element,index) => {
            console.log("*/*123123-element*",element)
            //tempsElement = Object.assign(element, resultInseeSearchDomainAndLogo[index])
            console.log(`*/*123123-resultInseeSearchDomainAndLogo[${index}]*`,resultInseeSearchDomainAndLogo[index])
            tempsElement = resultInseeSearchDomainAndLogo[index] === undefined ? {...element} : {...element, logo: resultInseeSearchDomainAndLogo[index].logo}
            console.log("*/*123123-tempsElement*",tempsElement)

            tempTab3.push(tempsElement)

        console.log("*/*123123 tempTab3", tempTab3)

        });

        console.log("*/*123123 tempTab3", tempTab3)

        setResultInseeSearchToKeepPlusDomainAndLogo(tempTab3)




        // resultInseeSearchToKeep.map((business1: Contact, index1: number) => {
        //     // console.log("*123123business1", index1, business1)

        //     // Ajouter RETURN si condition ok !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! A VOIR 
        //     resultInseeSearchDomainAndLogo.map((business2: Contact, index2: number) => {
        //         console.log("**123123business1.id", index1, business1.id)
        //         // console.log("*123123business2", index2, business2)
        //         console.log("**123123business2.id",index2,  business2.id)
        //         console.log("**123 égale ???", business1.id === business2.id)

        //         //business1.id === business2.id && tempsTab3.push(Object.assign(business1, business2))
        //     })
        //     console.log("**123123123-1-tempsTab3", tempsTab3)
        // })
        // console.log("**123123123-tempsTab3", tempsTab3)




        // resultInseeSearchToKeep.forEach((business1: Contact, index1: number) => {
        //     // console.log("*123123business1", index1, business1)

        //     // Ajouter RETURN si condition ok !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! A VOIR 
        //     resultInseeSearchDomainAndLogo.forEach((business2: Contact, index2: number) => {
        //         console.log("**123123business1.id", index1, business1.id)
        //         // console.log("*123123business2", index2, business2)
        //         console.log("**123123business2.id",index2,  business2.id)
        //         console.log("**123 égale ???", business1.id === business2.id)

        //         //business1.id === business2.id && tempsTab3.push(Object.assign(business1, business2))
        //     })
        //     console.log("**123123123-1-tempsTab3", tempsTab3)
        // })
        // console.log("**123123123-tempsTab3", tempsTab3)




        //setResultInseeSearchToKeepPlusDomainAndLogo(tempsTab3)

    }, [resultInseeSearchDomainAndLogo]) // resultInseeSearchToKeep ???

    //console.log("123123- resultInseeSearchToKeepPlusDomainAndLogo", resultInseeSearchToKeepPlusDomainAndLogo)
    
    const handleOnChangbusinessActivitySearch = (e: any) => {  
        const codebusinessActivity = e.target.dataset.code_businessActivity     
        //console.log("codebusinessActivity", codebusinessActivity)
        //setQuery({ ...query, businessActivity: `*${e.target.value.trim().replaceAll(" ", "* AND activitePrincipaleUniteLegale:*")}*` })
        codebusinessActivity ? setQuery({ ...query, businessActivity: e.target.dataset.code_businessActivity }) : setQuery({ ...query, businessActivity: '**' })
    }

    const handleOnClickBusiness = (business: Contact) => {
        setInfosContact(business)
    }

    /*
    

/////////////////////
        setItems(prevItems => [...prevItems, {count: counter, type: 'synchronize'}])
        // idem ?
        setItems(prevItems => {
            ...prevItems, 
            count: counter, 
            type: 'synchronize'
        })
        // idem
        setItems(prevItems => {
            return {...prevItems,       // return an object 
            count: counter, 
            type: 'synchronize'}
        })

        // idem
        setItems(...items, {count: counter, type: 'synchronize'})

////////////////////
*/

        // const [testUseState, setTestUseState] = React.useState<any>({name: "rien", year: 2000})

        // const handleOnClickTestUstateButton = () => {
        //     // setTestUseState({year: 2222})   // => Non car ne garde pas les autres attributs
        //     // Ces 3 façons sont OK : (la 1ère est la mieux ! Utiliser PREV que si besoin de la valeur qui vient d'être SETTER)
        //     setTestUseState({...testUseState, year : 2222})      // BIEN !!!
        //     // Pas utile généralement :
        //     // setTestUseState((prev: { name: string; year: number }) => ({ ...prev, year: 2222 }));
        //     // setTestUseState((prev: any) => {
        //     //      return {...prev, year: 2222}   // On retourne un objet
        //     // });
        //     // Utiliser PREV par ex ici :
        //     setTestUseState({...testUseState, year : 2222})
        //     setTestUseState((prev: any) => ({...testUseState, year : prev.year + 1}))
        //     // idem
        //     setTestUseState((prev: any) => {
        //         console.log("prev.year", prev.year)
        //         return {...testUseState, year : prev.year + 1}
        //         //return ({...testUseState, year : prev.year + 1}) // (idem)
        //     })               
        // }
        //console.log("testUseState", testUseState)

    return (
        <React.Fragment>         
            <div>
                <Button variant="contained" color="ochre" >Coucou ma Lauriane !!</Button> 
            </div>
            {/* <div 
            className=' mt-3 bg-cyan-300 '      // Marche pas !!! PK ???
            style={{ marginTop:'20px', marginLeft: '20px', marginBottom:'20px'}}  // Marche
            >
                <Button variant="contained" color="ochre" value={testUseState} onClick={handleOnClickTestUstateButton}  >Test UseState</Button> 
                <TextField type="text" variant='outlined' color='primary' label="Test UseState NOM" value={testUseState.name} />
                <TextField type="text" variant='outlined' color='primary' label="Test UseState YEAR" value={testUseState.year} />
            </div> */}

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
                    backgroundColor: "primary.light", 
                    padding: 2,
                }} >
                    <p>La recherche se fait sur le siret OU sur le reste (enlever le SIRET pour qu'elle se fasse sur le reste)</p>
                    <Box my={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <DialpadRoundedIcon id='siret' sx={{ color: 'action.active', mr: 1, mb: 2 }} />
                        {/* {withLabelAndOnchangeTexfield("SIRET", `e => setQuery({ ...query, siret: e.target.value.trim().replaceAll(" ", "") })`)} */}
                        {/* Avant */}
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
                        {/* <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <BusinessRoundedIcon sx={{ color: 'action.active', mr: 1, mb: 2 }} />
                            <TextField type="text" variant='outlined' color='primary' label="Activité" onChange={handleOnChangbusinessActivitySearch} fullWidth                      
                            // inputProps={{ maxLength: 5 }}    // Non car compte les espaces
                            />
                        </Box> */}
                        <p>Commencer à écrire (ex : spectacle)</p>
                        <Autocomplete id="combo-box-demo" options={codesNaf} sx={{ width: 300 }}                           
                            //onInputChange={(e) => handleOnChangbusinessActivitySearch(codesNaf.id)}       // NON
                            onInputChange={handleOnChangbusinessActivitySearch}
                            renderOption={(props:any, businessActivity:any) => {  // options qui s'affichent 
                                // Je rajoute la propriété data-codeId pour pouvoir récupérer l'id de l'option sélectionnée avec e.target.dataset.code_businessActivity (à mettre en minuscule !!!)                                 
                                return <li {...props} key={businessActivity.id} data-code_businessActivity = {businessActivity.id} color="primary.main" >{businessActivity.label}</li>
                            }}                          
                            renderInput={(params) => <TextField {...params} label="Activité" placeholder="FilmPlaceholder" />}     // si le paramètre options est un objet => affiche les labels de l'objet
                        /> 
                    </Stack>
                </FormControl>

                {thereIsListToDisplay() &&
                <Box sx={{ width: Object.entries(infosContact).length > 0 ? "33.33%" : "66.66%", }}                 
                border={2} color='primary.dark' borderColor={'secondary.main'} bgcolor={'secondary.light'} >
                    <List>
                        {resultInseeSearchToKeepPlusDomainAndLogo.map((business: any, index: number) => (
                            <ListItem key={business.id} disablePadding onClick= {() => handleOnClickBusiness(business)}>
                                <ListItemButton>
                                    <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    {/* <ListItemIcon><BusinessIcon /></ListItemIcon> */}
                                    {/* Pourquoi IMAGE ne marche pas ??? */}
                                    <img src={business.logo} alt="" width={50} height={50}/>
                                    {/* <img src={getLogoAndDomain(business.businessName).logo} alt="" width={50} height={50}/>  */}
                                    {/* <Image alt="Random image" src={getLogoAndDomain(contact.businessName).logo} width={50} height={50} style={{
                                            //maxWidth: '100%',
                                            //height: '200px',
                                            objectFit: 'cover',
                                        }} /> */}
                                    <ListItemText primary={business.businessName} />
                                    <div>
                                        {/* <DialpadRoundedIcon id='siret' sx={{ color: 'action.active', mr: 1, mb: 1 }} /> */}
                                        {business.id} - 
                                        {/* <LocationCityRoundedIcon sx={{ color: 'action.active', mx: 1, mb: 1 }} /> */}
                                        {/* {business.businessAddress} */}
                                    </div>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                }              

                {Object.entries(infosContact).length > 0 &&                
                <Box width= {thereIsListToDisplay() ? "33.33%" : "50%"} >
                    {/* Est-ce bien de faire ça ci-dessous ? Car sans le "as Contact", memê si je mets ci-dessus la condition "Object.entries(infosContact).length > 0" (ifosContact n'est pas un objet vide, donc selon comme il est typé (Contact | {}) il est forcement de type Contact) => me met un erreur Impossible d'assigner le type '{} | Contact' au type 'Contact'.   */}
                    <ContactCard contact={infosContact as Contact} />
                      {
                    //(searchContactName !== '') && resultInseeSearch && 
                    // resultInseeSearch.map((business: any, index: number) => (
                        // <div key={tempsContactInfo.id}>
                        //     {/* <p>{index+1} - denominationUniteLegale - {business.uniteLegale.denominationUniteLegale} -</p> */}
                        //     <p>DenominationUniteLegale :  --- {tempsContactInfo.uniteLegale.denominationUniteLegale} -</p>
                        //     <p>activitePrincipaleUniteLegale :  --- {tempsContactInfo.uniteLegale.activitePrincipaleUniteLegale} -</p>
                        //     <p>adresseEtabt :  --- {tempsContactInfo.adresseEtablissement.numeroVoieEtablissement} {tempsContactInfo.adresseEtablissement.libellnumeroVoieEtablissementeCommuneEtablissement} {tempsContactInfo.adresseEtablissement.typeVoieEtablissement} {tempsContactInfo.adresseEtablissement.libelleVoieEtablissement} {tempsContactInfo.adresseEtablissement.codePostalEtablissement} {tempsContactInfo.adresseEtablissement.libelleCommuneEtablissement} - </p>
                        //     <p>denominationUsuelle1UniteLegale : - {tempsContactInfo.uniteLegale.denominationUsuelle1UniteLegale} -</p>
                        //     <p>denominationUsuelle2UniteLegale : - {tempsContactInfo.uniteLegale.denominationUsuelle2UniteLegale} -</p>
                        //     <p>denominationUsuelle3UniteLegale : - {tempsContactInfo.uniteLegale.denominationUsuelle3UniteLegale} -</p>
                        //     <p>Siret : {tempsContactInfo.id}</p>
                        //     <p>Siren : {tempsContactInfo.siren} </p>
                        //     <p>============PERIODES D'ETABLISSEMENT============</p>
                        //     {tempsContactInfo.periodesEtablissement.map((periode: any, index: number) => (
                        //         <div key={index}>
                        //             <p>{index+1} - denominationUsuelleEtablissement :  --- {periode.denominationUsuelleEtablissement} -</p>
                        //             <p>DU {periode.dateDebut} AU {periode.dateFin}</p>
                        //             <p>enseigne1Etablissement :  --- {periode.enseigne1Etablissement} -</p>
                        //             <p>enseigne2Etablissement :  --- {periode.enseigne2Etablissement} -</p>
                        //             <p>enseigne3Etablissement :  --- {periode.enseigne3Etablissement} -</p>
                        //         </div>
                        //     ))}
                        // </div>
                    // ))
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
