// API INSEE Sirene V3 (entreprises et les établissements enregistrés au répertoire interadministratif Sirene depuis sa création en 1973, y compris les unités fermées. La recherche peut être unitaire, multicritère, phonétique et porter sur les données courantes et historisées.) => Voir l'aide si besoin
// https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3&provider=insee#!/Etablissement/findSiretByQ

'use client'

import React from 'react'
import { TextField, Stack, Button, FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select';

export default function TestAutocompleteComponent({}) {

    const token = 'b7745aa5-1ae3-30ec-885f-b73276a1a02c'
   
    const [resultSearch, setResultSearch] = React.useState<any>([])  
     //const [searchContact, setSearchContact] = React.useState<string>('denominationUniteLegale:xxxxxxxxxxxxxx')
    //const [searchContact, setSearchContact] = React.useState<string>(`denominationUniteLegale:prox AND siren:058812397`)  // PROX-HYDRO 
    //      ***denominationUniteLegale - PROX-HYDRO - ***denominationUsuelle1UniteLegale - - ***denominationUsuelleEtablissement - - ***enseigne1Etablissement - -)
    //const [searchContact, setSearchContact] = React.useState<string>(`siret:81149311300013`) // camping les palmiers à SAINT-PHILIBERT
    //      ***denominationUniteLegale - F B *** denominationUsuelle1UniteLegale : - - *** denominationUsuelleEtablissement - CAMPING LES PALMIERS - ***enseigne1Etablissement - CAMPING LES PALMIERS
    //const [searchContact, setSearchContact] = React.useState<string>(`siret:44029161500027`) // camping les palmiers à Hyères
    //      ***denominationUniteLegale - SARL LES PALMIERS - ***denominationUsuelle1UniteLegale : - ENSEIGNE : CAMPING LES PALMIERS - ***denominationUsuelleEtablissement - - ***enseigne1Etablissement - -
    //const [searchContact, setSearchContact] = React.useState<string>(`siret:83055140400015`) // FREYA
    //      ***denominationUniteLegale - - ***denominationUsuelle1UniteLegale : - - ***denominationUsuelleEtablissement - LES TRESORS DE FREYA - ***enseigne1Etablissement - -)
    //const [searchContact, setSearchContact] = React.useState<string>(`siren:830551404`) // FREYA (idem)
    //const [searchContact, setSearchContact] = React.useState<string>(`siren:058812397`)  // PROX (idem)
    //const [searchContact, setSearchContact] = React.useState<string>(`denominationUniteLegale:"camping les palmiers"`)  // A carqueiranne (ne trouve pas l'autre !)
    //      ***denominationUniteLegale - SCI CAMPING LES PALMIERS - ***denominationUsuelle1UniteLegale : - - ***denominationUsuelleEtablissement - - enseigne1Etablissement - -
    //const [searchContact, setSearchContact] = React.useState<string>(`denominationUniteLegale:"prox-hydro"`)   // PROX-HYDRO
    // const [searchContact, setSearchContact] = React.useState<string>(`denominationUniteLegale:"*prox-hydro*"`)   // PROX-HYDRO
    //const [searchContact, setSearchContact] = React.useState<string>(`denominationUniteLegale:"*prox-hydr*"`)   // RIEN !!!!!!!!!!!!!
    //const [searchContact, setSearchContact] = React.useState<string>(`denominationUniteLegale:"*prox*"`)   // PLEIN DE CHOSES avec PROX (WE-PROX, PROX'IMM, WATT PROX...)
    //const [searchContact, setSearchContact] = React.useState<string>(`denominationUniteLegale:"camping les palmier*"`)  // RIEN !!!
    //const [searchContact, setSearchContact] = React.useState<string>(`denominationUniteLegale:*rox* AND libelleCommuneEtablissement:marseille`)  // ROX en plein milieu ok !!! => ne pas mettre les "" 
    //const [searchContact, setSearchContact] = React.useState<string>(`denominationUniteLegale:prxoh~ AND libelleCommuneEtablissement:marseille`)  // on peut mettre un chiffre après ~ (2 = val par def)
    //const [searchContact, setSearchContact] = React.useState<string>(`denominationUsuelleEtablissement:freya`)  // on peut pas chercher avec ça !!!
    //const [searchContact, setSearchContact] = React.useState<string>(`denominationUniteLegale:freya OR denominationUsuelleEtablissement:freya`)  
   

    console.log("resultSearch", resultSearch)

    const apiFetch = (search:string) => {
         //fetch(`https://api.insee.fr/entreprises/sirene/V3/siret?q=${searchContact}`, {
            //fetch(`https://api.insee.fr/entreprises/sirene/V3/siret?${search}`, {
                //fetch(`https://api.insee.fr/entreprises/sirene/V3/siret?q=denominationUniteLegale:*a* AND denominationUniteLegale:*a*`, {
                //url: 'https://api.insee.fr/entreprises/sirene/V3/siret?q…iteLegale:*a*%20AND%20denominationUniteLegale:*a*'
                //https://api.insee.fr/entreprises/sirene/V3/siret?q=denominationUniteLegale:*a*%20AND%20denominationUniteLegale:*a*
                //'https://api.insee.fr/entreprises/sirene/V3/siret?q…eLegale:*a*%20AND%20q=denominationUniteLegale:*a*'
                // https://api.insee.fr/entreprises/sirene/V3/siret?q=denominationUniteLegale:*a*%20AND%20q=denominationUniteLegale:*a*
    
                //(searchContact !== '') && fetch(`https://api.insee.fr/entreprises/sirene/V3/siret?q=denominationUniteLegale:"*${searchContact}*"`, {        // entre "" pour prendre en compte l'espace
    
                //(searchContact !== '') && fetch(`https://api.insee.fr/entreprises/sirene/V3/siret?q=denominationUniteLegale:"*prox-h*"`, {        
                // entre "" pour prendre en compte l'espace
                // * pour remplacer une chaîne de caractères de taille quelconque
    
                //(searchContact !== '') && fetch(`https://api.insee.fr/entreprises/sirene/V3/siret?q=denominationUniteLegale:"${searchContact}~1"`, {
            fetch(`https://api.insee.fr/entreprises/sirene/V3/siret?${search}`, {
            method: 'GET',
            headers: {
                AUTHORIZATION: 'Bearer ' + token,
            }
        })
            .then(response => {
                console.log(response)
                console.log(response.url)
                //console.log(response.json())       // si on met ça erreur ! Car ne peut pas être appelé 2 fois ! (error TypeError: Failed to execute 'json' on 'Response': body stream already read at eval)                
                return response.json();
            })
            .then(data => {
                //console.log(data)
                console.log("data.etablissements", data.etablissements)
                data.etablissements ? setResultSearch(data.etablissements) : setResultSearch([])    // si ne trouve rien donc response.status = 404 => alors resultSearch = null
            })
            .catch(error => console.log('error', error))
    }  

    // Quand on écrit dans l'Input ou quand on Sélectionne une option dans le Select
    const handleChangeAutocomplete = (event: any, newValue: any) => {
        //console.log("event.target.value", event.target)
        console.log(`newValue : "${newValue}"`)
        
        newValue = newValue.trim().replaceAll(" ", "* AND denominationUniteLegale:*")
        
        console.log(`newValue2 : "${newValue}"`)
       
        apiFetch(`q=denominationUniteLegale:*${newValue}*`)  
    }
    
    const topFilms = [
        { id: 1, title: 'The Shawshank Redemption', year: 1994 },
        { id: 2, title: 'The Godfather', year: 1972 },
        { id: 3, title: 'The Godfather: Part II', year: 1974 },
        { id: 4, title: 'The Dark Knight', year: 2008 },
        { id: 5, title: '12 Angry Men', year: 1957 },
        { id: 6, title: "Schindler's List", year: 1993 },
        { id: 7, title: 'Pulp Fiction', year: 1994 },
        { id: 8, title: 'The Lord of the Rings: The Return of the King', year: 2003 },
      ];

    return (
        <React.Fragment> 
            <FormControl fullWidth> 
                <Autocomplete id="combo-box-demo" options={resultSearch} sx={{ width: 300 }}
                    // Ajouter renderOption and renderTags de Autocomplete pour ne pas avoir l'erreur : "Warning: A props object containing a "key" prop is being spread into JSX" => https://stackoverflow.com/questions/75818761/material-ui-autocomplete-warning-a-props-object-containing-a-key-prop-is-be + https://mui.com/material-ui/api/autocomplete/
                    freeSolo        // pour qu'on puisse mettre autre chose que ce qui est proposé
                    getOptionLabel={(option) => option.uniteLegale.denominationUniteLegale}   // ce qui s'affiche qd on sélectionne
                    onInputChange={handleChangeAutocomplete}
                    //autoComplete={false}      // Je comprends pas à quoi ça sert !
                    renderOption={(props:any, option:any) => {  // options qui s'affichent 
                        return <li {...props} key={option.siret}>{option.uniteLegale.denominationUniteLegale}</li>
                    }}
                    // Pas utilie en fait ???
                    // renderTags={(tagValue, getTagProps) => {
                    //     return tagValue.map((option, index) => <Chip {...getTagProps({ index })} key={option.id}  label={option.id} />)
                    // }}                    
                    isOptionEqualToValue={(option, value) => {
                         console.log("option", option)
                         console.log("value", value)
                        return option.uniteLegale.denominationUniteLegale=== value.uniteLegale.denominationUniteLegale}}      // sinon erreur : useAutocomplete.js:210 MUI: The value provided to Autocomplete is invalid. None of the options match with `{"label":"The Shawshank Redemption","year":1994,"id":1}`. You can use the `isOptionEqualToValue` prop to customize the equality test. 
                    renderInput={(params) => <TextField {...params} label="ResultatsBusinessLabel" placeholder="ResultatsBusinessPlaceholder" />}     // si le paramètre options est un objet => affiche les labels de l'objet
                />              
                <Autocomplete id="combo-box-demo" options={topFilms} sx={{ width: 300 }}
                    // Ajouter renderOption and renderTags de Autocomplete pour ne pas avoir l'erreur : "Warning: A props object containing a "key" prop is being spread into JSX" => https://stackoverflow.com/questions/75818761/material-ui-autocomplete-warning-a-props-object-containing-a-key-prop-is-be + https://mui.com/material-ui/api/autocomplete/
                    freeSolo        // pour qu'on puisse mettre autre chose que ce qui est proposé
                    getOptionLabel={(option) => option.title}   // ce qui s'affiche qd on sélectionne
                    //onInputChange={handleChangeAutocomplete}
                    renderOption={(props:any, option:any) => {  // options qui s'affichent 
                        return <li {...props} key={option.id}>{option.title}</li>
                    }}
                    // Pas utilie en fait ???
                    // renderTags={(tagValue, getTagProps) => {
                    //     return tagValue.map((option, index) => <Chip {...getTagProps({ index })} key={option.id}  label={option.id} />)
                    // }}                    
                    // isOptionEqualToValue={(option, value) => {
                    //      console.log("option", option)
                    //      console.log("value", value)
                    //     return option.uniteLegale.denominationUniteLegale=== value.uniteLegale.denominationUniteLegale}}      // sinon erreur : useAutocomplete.js:210 MUI: The value provided to Autocomplete is invalid. None of the options match with `{"label":"The Shawshank Redemption","year":1994,"id":1}`. You can use the `isOptionEqualToValue` prop to customize the equality test. 
                    renderInput={(params) => <TextField {...params} label="FilmLabel" placeholder="FilmPlaceholder" />}     // si le paramètre options est un objet => affiche les labels de l'objet
                />              
                
            </FormControl>         
        </React.Fragment>
    )
}
