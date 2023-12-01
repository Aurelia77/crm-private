import React from 'react'
import { FormControl, FormHelperText, Input, InputLabel, TextField, Typography, MenuItem, Checkbox, FormGroup, FormControlLabel, OutlinedInput, ListItemText, Box, Paper } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {getUniqueSortedValues} from '../utils/toolbox';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Switch from '@mui/material/Switch';
import {FormLabel, Radio, RadioGroup} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';


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
    const [search, setSearch] = React.useState<SearchContactCriteria>({ isClient: "all",  contactType: [], businessName: '', businessCity: [], businessCategory: [] });

    //console.log(search)
    // const businessCategorys = ["Camping", "Hôtel", "Congiergerie", "Agence Event", "Agence Artistique", "Mairie", "Lieu de réception", "Wedding Planer", "Restaurant Plage", "Piscine Municipale", "Yacht", "Plage Privée", "Agence Location Villa Luxe", "Aquarium", "Centre de Loisirs", "Centre de Plongée", "Agence Communication Audio Visuel", "Autre"];

    const allDifferentsBusinessCategoryValues = getUniqueSortedValues(contacts, 'businessCategory')
    const allDifferentsBusinessCitiesValues = getUniqueSortedValues(contacts, 'businessCity')
    const allDifferentsContactTypesValues = getUniqueSortedValues(contacts, 'contactType')


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
        //setSearch({ ...search, businessCategory: value });            // me dit que Value peut être de type String mais pourtant je ne vois pas quand c'est possible !!!???

        // setSearch(typeof value === 'string' ? value.split(',') : value, );
    };

    const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch({ ...search, isClient: event.target.value as "yes" | "no" | "all" });
    }

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
        <Paper sx={{ margin: "1em", marginTop:"2em", padding: "1em", bgcolor: 'primary.light', }} >
            <FormControl sx={{ position: "relative", bgcolor: 'lightCyan.light', padding:"25px", 
                width: "calc(100vw - 263px)" , 
                //maxWidth: "1200px"    // A voir si très grand écran !!!
            }} >             
                <Fab disabled size="small" color="primary" sx={{
                        position: "absolute",
                        top: "5px",
                        left: "5px" }} >
                    <SearchIcon />
                </Fab>

                <Tooltip title="Supprimer la recherche">
                        <Fab size="small" color="error" sx={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        padding:0   // Car les boutons ont automatiquement un padding
                    }}      
                        onClick={resetSearch} >
                            <ClearIcon />
                        </Fab>
                </Tooltip>

                {/* <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText> */}
                <Box sx={{ display: 'flex', justifyContent: 'space-around'// 
                //gap: "70px"
            }}>
                    {/* <Typography variant="h6" gutterBottom component="div">Recherche</Typography> */}
                    {/* <FormControlLabel 
                        control={
                            <Switch
                            checked={search.isClient}
                            onChange={handleChangeSwitchIsClient}
                            color="success"
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    } 
                        label="Clients ?" 
                    /> */}             
                

                    <FormControl>
                        <RadioGroup
                            aria-labelledby="radio-buttons-group-label"
                            //defaultValue="both"
                            name="radio-buttons-group"                        
                            value={search.isClient}
                            onChange={handleChangeRadio}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Clients" />
                            <FormControlLabel value="no" control={<Radio />} label="Prospects" />
                            <FormControlLabel value="all" control={<Radio />} label="TOUS" />
                        </RadioGroup>
                    </FormControl> 

                    <Box sx={{ display:"flex", flexDirection:"column", gap:"20px", width: '30%', 
                        //border:"1px solid black" 
                    }} >
                        <TextField id="search-name" label="Nom" name='businessName' value={search.businessName} onChange={handleChangeText}
                            sx={{ width: '100%', marginRight: "30px" }} />
                        {/* <TextField id="search-city" label="Ville" name='businessCity' value={search.businessCity} onChange={handleChange} 
                            sx={{ width: '200px', marginRight: "30px" }} />*/}    

                        <FormControl >
                            <InputLabel>Type</InputLabel>
                            <Select
                                multiple={true}
                                value={search.contactType}
                                onChange={(e) => handleChangeMultipleSelect(e, "contactType")}
                                input={<OutlinedInput label="Ville"         // ici le label est utilisé pour l'accessibilité et non pour l'affichage.
                                //sx={{ width: '300px' }} 
                                />}
                                renderValue={(selected) => selected.join(', ')}
                                sx={{ width: '100%'}}
                                MenuProps={MenuSelectProps}
                            >
                                {allDifferentsContactTypesValues.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        <Checkbox checked={search.contactType.indexOf(type) > -1} />
                                        <ListItemText primary={type} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box >

                    <Box sx={{ display:"flex", flexDirection:"column", gap:"20px", width: '30%', 
                        //border:"1px solid black" 
                    }} >
                        <FormControl >
                            <InputLabel id="multiple-checkbox-city-label">Ville</InputLabel>
                            <Select
                                id="multiple-checkbox-city-label"
                                multiple={true}
                                value={search.businessCity}
                                onChange={(e) => handleChangeMultipleSelect(e, "businessCity")}
                                input={<OutlinedInput label="Ville"         // ici le label est utilisé pour l'accessibilité et non pour l'affichage.
                                    //sx={{ width: '300px', border: "solid 1px black" }} 
                                />}
                                renderValue={(selected) => selected.join(', ')}
                                sx={{ width: '100%'}}
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
                            <InputLabel id="multiple-checkbox-type-label">Catégorie</InputLabel>
                            <Select
                                id="multiple-checkbox-type-label"
                                multiple={true}
                                value={search.businessCategory}
                                onChange={(e) => handleChangeMultipleSelect(e, "businessCategory")}
                                input={<OutlinedInput label="Catégorie de contact" 
                                    //sx={{ width: '300px', border: "solid 1px black" }} 
                                />}
                                renderValue={(selected) => selected.join(', ')}
                                sx={{ width: '100%'}}
                                MenuProps={MenuSelectProps}
                            >
                                {allDifferentsBusinessCategoryValues.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        <Checkbox checked={search.businessCategory.indexOf(cat) > -1} />
                                        <ListItemText primary={cat} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                


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

            


                {/* <FormControl component="fieldset">
                    <Typography component="legend">Type</Typography>
                    <FormGroup>
                        {businessCategorys.map((type) => (
                            <FormControlLabel
                                key={type}
                                control={<Checkbox 
                                    // checked={search[type] || false} 
                                    checked={false}   //{search[type]} 
                                    onChange={handleChange} 
                                    //name={type}
                                    name='businessCategory'
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
                        {businessCategorys.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl> */}
            </FormControl>
        </Paper>

    )
}