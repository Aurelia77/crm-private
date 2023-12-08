import React from 'react'
import { FormControl, FormHelperText, Input, InputLabel, TextField, Typography, MenuItem, Checkbox, FormGroup, FormControlLabel, OutlinedInput, ListItemText, Box, Paper } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getUniqueSortedValues } from '../utils/toolbox';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Switch from '@mui/material/Switch';
import { FormLabel, Radio, RadioGroup } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';
import { useTheme } from '@mui/material/styles';
import {getCategoriesFromDatabase, getCatLabelFromId} from '../utils/firebase'

interface SearchFormProps {
    contacts: Contact[];
    currentUserId: string;
    emptySearchCriteria: SearchContactCriteria;
    onSearchChange: (search: SearchContactCriteria) => void;
}

const MenuSelectProps = {
    PaperProps: {
        style: {
            maxHeight: 300,
            width: 250,
        },
    },
};


export default function SearchContactsForm({ contacts, currentUserId, emptySearchCriteria, onSearchChange  }: SearchFormProps) {

    const [search, setSearch] = React.useState<SearchContactCriteria>(emptySearchCriteria);

    const [categoriesList, setCategoriesList] = React.useState<ContactCategorieType[]>([]);

    const [selectedCatIds, setCatSelectedIds] = React.useState<string[]>([]);
    const [selectedCatLabels, setCatSelectedLabels] = React.useState<string[]>([]);

    console.log("search", search)

    React.useEffect(() => {
        if (selectedCatIds.length > 0) {
            Promise.all(selectedCatIds.map(catId => getCatLabelFromId(catId)))
                .then(labels => setCatSelectedLabels(labels));
        } else {
            setCatSelectedLabels([]);
        }
    }, [selectedCatIds]);

    const muiTheme = useTheme();

  
   

    console.log(search)

    // const businessCategorys = ["Camping", "Hôtel", "Congiergerie", "Agence Event", "Agence Artistique", "Mairie", "Lieu de réception", "Wedding Planer", "Restaurant Plage", "Piscine Municipale", "Yacht", "Plage Privée", "Agence Location Villa Luxe", "Aquarium", "Centre de Loisirs", "Centre de Plongée", "Agence Communication Audio Visuel", "Autre"];

    const allDifferentsBusinessCategoryValues = getUniqueSortedValues(contacts, 'businessCategoryId')

    //console.log(allDifferentsBusinessCategoryValues)

    const allDifferentsBusinessCitiesValues = getUniqueSortedValues(contacts, 'businessCity')
    const allDifferentsContactTypesValues = getUniqueSortedValues(contacts, 'contactType')

    React.useEffect(() => {

        getCategoriesFromDatabase(currentUserId).then((categories: ContactCategorieType[]) => {
            //console.log("categories", categories)
      
            // Pas besoin de l'attribut userId donc on garde juste ce qu'on veut
            const newCategoriesList = categories.map(category => ({
              id: category.id,
              label: category.label
            }));
            setCategoriesList(newCategoriesList);
          })
       
    }, [currentUserId]);


    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.name, event.target.value)
        setSearch({ ...search, [event.target.name]: event.target.value });
        //onSearchChange({ ...search, [event.target.name]: event.target.value });
        // setSearch({ ...search, [event.target.name]: event.target.checked });
    }

    const handleMultipleChangeSelect = (event: SelectChangeEvent<string[]>, attribut: keyof SearchContactCriteria) => {
        // const { target: { value }, } = event;
        const value = event.target.value;

        console.log(value)

        setCatSelectedIds(value as string[]);

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
        <Paper sx={{ margin: "0 1em 0 1em", padding: "0.6em", bgcolor: 'primary.light', }} >
            <FormControl sx={{
                position: "relative", 
                bgcolor: 'lightCyan.light', 
                padding: "1%",
                width: "98%",
                //maxWidth: "1200px"    // A voir si très grand écran !!!
            }} >
                {/* <Fab disabled size="small" color="primary" sx={{
                    position: "absolute",
                    top: "5px",
                    left: "5px"
                }} >
                    <SearchIcon />
                </Fab> */}

                <Tooltip title="Supprimer la recherche">
                    <Fab 
                        size="small" 
                        color="error" 
                        sx={{
                            //width:"20px",
                            //height:"20px",
                            position: "absolute",
                            bottom: -15,
                            right: -15,
                            padding: 0   // Car les boutons ont automatiquement un padding
                        }}
                        onClick={resetSearch} 
                    >
                        <ClearIcon fontSize='small' />
                    </Fab>
                </Tooltip>

                {/* <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText> */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-around'// 
                   // gap: "5%"
                }}>
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="radio-buttons-group-label"
                            //defaultValue="both"
                            name="radio-buttons-group"
                            value={search.isClient}
                            onChange={handleChangeRadio}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Clients" sx={{ height:"21px" }} />
                            <FormControlLabel value="no" control={<Radio />} label="Prospects" sx={{ height:"21px" }} />
                            <FormControlLabel value="all" control={<Radio />} label="TOUS" sx={{ height:"21px" }} />
                        </RadioGroup>
                    </FormControl>

                    {/* //////////// NOM ///////////// */}
                    <TextField
                        id="search-name"
                        label="Nom"
                        name='businessName'
                        value={search.businessName}
                        onChange={handleChangeText}
                        sx={{ 
                            //width: '100%', 
                            marginRight: "30px" }} />
                    {/* <TextField id="search-city" label="Ville" name='businessCity' value={search.businessCity} onChange={handleChange} 
                            sx={{ width: '200px', marginRight: "30px" }} />*/}

                    
                      {/* //////////// CAT ///////////// */}
                      <FormControl sx={{width:"20%"}} >
                        <InputLabel id="multiple-checkbox-type-label">Catégorie(s)</InputLabel>
                        {categoriesList.length > 0 
                        ?  <Select
                            id="multiple-checkbox-type-label"
                            multiple={true}
                            value={search.businessCategoryId}
                            // value={search.businessCategoryId.map(
                            //         (catId: string) => getCatLabelFromId(catId)                            
                            //     ) }
                            onChange={(e) => handleMultipleChangeSelect(e, "businessCategoryId")}
                            input={<OutlinedInput label="Catégories"
                            //sx={{ width: '300px', border: "solid 1px black" }} 
                            />}



                            //renderValue={(selected) => selected).join(', ')}
                            renderValue={(selectedIds) => selectedCatLabels.join(', ')  }
                            sx={{ width: '100%' }}
                            MenuProps={MenuSelectProps}
                        >


                            {/* <MenuItem key="0" value="">NON DEFINIE</MenuItem> */}                       

                                {categoriesList
                                    .filter(cat => allDifferentsBusinessCategoryValues.includes(cat.id))
                                    .sort((a, b) => a.label.localeCompare(b.label))
                                    .map((cat, index) => (
                            //{categoriesList.filter(cat => allDifferentsBusinessCategoryValues.includes(cat.id)).map((cat, index) => (
                            // {categoriesList.sort((a, b) => a.label.localeCompare(b.label)).map((cat, index) => (
                                <MenuItem
                                    key={cat.id}
                                    value={cat.id}
                                    sx={{ backgroundColor: index % 2 === 0 ? muiTheme.palette.gray.light : '' }}
                                >                                    
                                    <Checkbox checked={search.businessCategoryId.indexOf(cat.id) > -1} />
                                    <ListItemText primary={cat.label} />                                    
                                </MenuItem>
                            ))}
                        </Select>
                        : null
                    }
                    </FormControl>



                    {/* //////////// VILLE ///////////// */}
                    <FormControl sx={{width:"20%"}} >
                        <InputLabel id="multiple-checkbox-city-label">Ville(s)</InputLabel>
                        <Select
                            id="multiple-checkbox-city-label"
                            multiple={true}
                            value={search.businessCity}
                            onChange={(e) => handleMultipleChangeSelect(e, "businessCity")}
                            input={<OutlinedInput label="Villes"         // ici le label est utilisé pour l'accessibilité et non pour l'affichage.                            
                            />}
                            renderValue={(selected) => selected.join(', ')}
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

                    {/* //////////// TYPE ///////////// */}
                    <FormControl sx={{width:"20%"}} >
                        <InputLabel>Type(s)</InputLabel>
                        <Select
                            multiple={true}
                            value={search.contactType}
                            onChange={(e) => handleMultipleChangeSelect(e, "contactType")}
                            input={<OutlinedInput label="Types"         // ici le label est utilisé pour l'accessibilité et non pour l'affichage.
                            //sx={{ width: '300px' }} 
                            />}
                            renderValue={(selected) => selected.join(', ')}
                            sx={{ width: '100%' }}
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