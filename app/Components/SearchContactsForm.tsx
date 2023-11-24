import React from 'react'
import { FormControl, FormHelperText, Input, InputLabel, TextField, Typography, MenuItem, Checkbox, FormGroup, FormControlLabel, OutlinedInput, ListItemText, Box } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {getUniqueSortedValues} from '../utils/toolbox';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';


interface SearchFormProps {
    onSearchChange: (search: SearchContactCriteria) => void;
    emptySearchCriteria: SearchContactCriteria;
    contacts: Contact[];
}

const MenuSelectProps = {
    PaperProps: {
        style: {
            maxHeight: 300,
            width: 250,
        },
    },
};


export default function SearchContactsForm({ onSearchChange, emptySearchCriteria, contacts }: SearchFormProps) {
    const [search, setSearch] = React.useState<SearchContactCriteria>({ businessName: '', businessCity: [], businessType: [] });

    // const businessTypes = ["Camping", "Hôtel", "Congiergerie", "Agence Event", "Agence Artistique", "Mairie", "Lieu de réception", "Wedding Planer", "Restaurant Plage", "Piscine Municipale", "Yacht", "Plage Privée", "Agence Location Villa Luxe", "Aquarium", "Centre de Loisirs", "Centre de Plongée", "Agence Communication Audio Visuel", "Autre"];

    const allDifferentsBusinessTypeValues = getUniqueSortedValues(contacts, 'businessType')
    const allDifferentsBusinessCitiesValues = getUniqueSortedValues(contacts, 'businessCity')

    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.name, event.target.value)
        setSearch({ ...search, [event.target.name]: event.target.value });
        //onSearchChange({ ...search, [event.target.name]: event.target.value });
        // setSearch({ ...search, [event.target.name]: event.target.checked });
    }

    const handleChangeMultipleSelect = (event: SelectChangeEvent<string[]>, attribut: keyof SearchContactCriteria) => {
        // const { target: { value }, } = event;
        const value = event.target.value;

        setSearch({ ...search, [attribut]: typeof value === 'string' ? [value] : value });
        //setSearch({ ...search, businessType: value });            // me dit que Value peut être de type String mais pourtant je ne vois pas quand c'est possible !!!???

        // setSearch(typeof value === 'string' ? value.split(',') : value, );
    };

    const resetSearch = () => {
        setSearch(emptySearchCriteria);
        onSearchChange(emptySearchCriteria);
    }

   




    // Je me demandais s'il ne fallait pas mieux mettre onSearchChange dans handleChange et handleChangeType, mais apparemment non !!!
    // Si vous déplacez l'appel à onSearchChange dans handleChange et handleChangeType, il sera appelé avant que l'état search ne soit mis à jour, car setState est asynchrone. Cela signifie que onSearchChange recevrait l'ancien état search, pas le nouvel état.
    // => Mais non !!!!!!!!!!!!!!!!! ?????????????
    React.useEffect(() => {
        onSearchChange(search)
    }, [search, onSearchChange])

    return (
        <FormControl sx={{ position: "relative" }} >
            <Typography variant="h6" gutterBottom component="div">Recherche</Typography>
            {/* <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText> */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', }}>
                <TextField id="search-name" label="Nom" name='businessName' value={search.businessName} onChange={handleChangeText}
                    sx={{ width: '200px', marginRight: "30px" }} />
                {/* <TextField id="search-city" label="Ville" name='businessCity' value={search.businessCity} onChange={handleChange} 
                    sx={{ width: '200px', marginRight: "30px" }} />*/}

                <FormControl >
                    <InputLabel id="multiple-checkbox-city-label">Ville</InputLabel>
                    <Select
                        id="multiple-checkbox-city-label"
                        multiple={true}
                        value={search.businessCity}
                        onChange={(e) => handleChangeMultipleSelect(e, "businessCity")}
                        input={<OutlinedInput label="Type" 
                        sx={{ width: '300px', border: "solid 1px black" }} 
                        />}
                        renderValue={(selected) => selected.join(', ')}
                        //sx={{ width: '33%', border: "solid 1px black" }}
                        MenuProps={MenuSelectProps}
                    >
                        {allDifferentsBusinessCitiesValues.map((city) => (
                            <MenuItem key={city} value={city}>
                                <Checkbox checked={search.businessCity.indexOf(city) > -1} />
                                <ListItemText primary={city} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl >
                    <InputLabel id="multiple-checkbox-type-label">Type de contact</InputLabel>
                    <Select
                        id="multiple-checkbox-type-label"
                        multiple={true}
                        value={search.businessType}
                        onChange={(e) => handleChangeMultipleSelect(e, "businessType")}
                        input={<OutlinedInput label="Type" 
                        sx={{ width: '300px', border: "solid 1px black" }} 
                        />}
                        renderValue={(selected) => selected.join(', ')}
                        //sx={{ width: '33%', border: "solid 1px black" }}
                        MenuProps={MenuSelectProps}
                    >
                        {allDifferentsBusinessTypeValues.map((type) => (
                            <MenuItem key={type} value={type}>
                                <Checkbox checked={search.businessType.indexOf(type) > -1} />
                                <ListItemText primary={type} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

               


                {/* <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={personName}
                    onChange={handleChange2}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {names.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={personName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select> */}
            </Box>

            <Tooltip title="Supprimer la recherche">
                <IconButton color="error" sx={{
                    //padding: 0 
                    position: "absolute",
                    top: 0,
                    right: 0
                }}       // Car les boutons ont automatiquement un padding
                    onClick={resetSearch} >
                    <ClearIcon />
                </IconButton>
            </Tooltip>


            {/* <FormControl component="fieldset">
                   <Typography component="legend">Type</Typography>
                <FormGroup>
                    {businessTypes.map((type) => (
                        <FormControlLabel
                            key={type}
                            control={<Checkbox 
                                // checked={search[type] || false} 
                                checked={false}   //{search[type]} 
                                onChange={handleChange} 
                                //name={type}
                                name='businessType'
                                value={type}
                                 />}
                            label={type}
                        />
                    ))}
                </FormGroup> */}

            {/*          <InputLabel id="search-type-label">Type</InputLabel>
                 <Select
                     labelId="search-type-label"
                     id="search-type"
                     value={search.type}
                     onChange={handleChange('type')}
                 >
                     {businessTypes.map((type) => (
                         <MenuItem key={type} value={type}>{type}</MenuItem>
                     ))}
                 </Select>
            </FormControl> */}
        </FormControl>

    )
}