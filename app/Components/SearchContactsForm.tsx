import React from 'react'
import { FormControl, FormHelperText, Input, InputLabel, TextField, Typography, MenuItem, Checkbox, FormGroup, FormControlLabel, OutlinedInput, ListItemText, Box } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {getUniqueSortedValues} from '../utils/functionsToolbox';
import contacts from '../utils/contacts';


interface SearchFormProps {
    onSearchChange: (search: SearchContact) => void;
}

const MenuSelectProps = {
    PaperProps: {
        style: {
            maxHeight: 300,
            width: 250,
        },
    },
};


export default function SearchContactsForm({ onSearchChange }: SearchFormProps) {
    const [search, setSearch] = React.useState<SearchContact>({ businessName: '', businessCity: '', businessType: [] });

    // const businessTypes = ["Camping", "Hôtel", "Congiergerie", "Agence Event", "Agence Artistique", "Mairie", "Lieu de réception", "Wedding Planer", "Restaurant Plage", "Piscine Municipale", "Yacht", "Plage Privée", "Agence Location Villa Luxe", "Aquarium", "Centre de Loisirs", "Centre de Plongée", "Agence Communication Audio Visuel", "Autre"];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.name, event.target.value)
        setSearch({ ...search, [event.target.name]: event.target.value });
        //onSearchChange({ ...search, [event.target.name]: event.target.value });
        // setSearch({ ...search, [event.target.name]: event.target.checked });
    }

    const handleChangeType = (event: SelectChangeEvent<string[]>) => {
        // const { target: { value }, } = event;
        const value = event.target.value;

        setSearch({ ...search, businessType: typeof value === 'string' ? [value] : value });
        //setSearch({ ...search, businessType: value });            // me dit que Value peut être de type String mais pourtant je ne vois pas quand c'est possible !!!???

        // setSearch(typeof value === 'string' ? value.split(',') : value, );
    };

    const allDifferentsBusinessTypeValues = getUniqueSortedValues(contacts, 'businessType')




    // Je me demandais s'il ne fallait pas mieux mettre onSearchChange dans handleChange et handleChangeType, mais apparemment non !!!
    // Si vous déplacez l'appel à onSearchChange dans handleChange et handleChangeType, il sera appelé avant que l'état search ne soit mis à jour, car setState est asynchrone. Cela signifie que onSearchChange recevrait l'ancien état search, pas le nouvel état.
    // => Mais non !!!!!!!!!!!!!!!!! ?????????????
    React.useEffect(() => {
        onSearchChange(search)
    }, [search, onSearchChange])

    return (
        <FormControl >
            <Typography variant="h6" gutterBottom component="div">Recherche</Typography>
            {/* <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText> */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <TextField id="search-name" label="Nom" name='businessName' value={search.businessName} onChange={handleChange}
                    sx={{ width: '200px', marginRight: "30px" }} />
                <TextField id="search-city" label="Ville" name='businessCity' value={search.businessCity} onChange={handleChange}
                    sx={{ width: '200px', marginRight: "30px" }} />

                <FormControl >
                    <InputLabel id="demo-multiple-checkbox-label">Type de contact</InputLabel>
                    <Select
                        id="demo-multiple-checkbox-label"
                        multiple={true}
                        value={search.businessType}
                        onChange={handleChangeType}
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