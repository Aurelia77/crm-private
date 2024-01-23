import React from 'react'
import { FormControl, FormHelperText, Input, InputLabel, TextField, Typography, MenuItem, Checkbox, FormGroup, FormControlLabel, OutlinedInput, ListItemText, Box, Paper } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getUniqueSortedValues } from '../../utils/toolbox';
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
import { getCategoriesFromDatabase, getCatLabelFromId } from '../../utils/firebase'

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


export default function SearchContactsForm({ contacts, currentUserId, emptySearchCriteria, onSearchChange }: SearchFormProps) {

    const [search, setSearch] = React.useState<SearchContactCriteria>(emptySearchCriteria);

    const [categoriesList, setCategoriesList] = React.useState<ContactCategorieType[]>([]);

    const [selectedCatIds, setCatSelectedIds] = React.useState<string[]>([]);
    const [selectedCatLabels, setCatSelectedLabels] = React.useState<string[]>([]);

    const muiTheme = useTheme();

    const allDifferentsBusinessCategoryValues = getUniqueSortedValues(contacts, 'businessCategoryId')
    const allDifferentsBusinessCitiesValues = getUniqueSortedValues(contacts, 'businessCity', false)
    const allDifferentsContactTypesValues = getUniqueSortedValues(contacts, 'contactType')

    React.useEffect(() => {
        getCategoriesFromDatabase(currentUserId).then((categories: ContactCategorieType[]) => {
            // Pas besoin de l'attribut userId donc on garde juste ce qu'on veut
            const newCategoriesList = categories.map(category => ({
                id: category.id,
                label: category.label
            }));
            setCategoriesList(newCategoriesList);
        })
    }, [currentUserId]);

   
    React.useEffect(() => {
        onSearchChange(search)
    }, [search, onSearchChange])

    React.useEffect(() => {
        if (selectedCatIds.length > 0) {
            Promise.all(selectedCatIds.map(catId => getCatLabelFromId(catId)))
                .then(labels => {
                    return setCatSelectedLabels(labels)
                });
        } else {
            setCatSelectedLabels([]);
        }
    }, [selectedCatIds]);

    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.name, event.target.value)
        setSearch({ ...search, [event.target.name]: event.target.value });
    }

    const handleMultipleChangeSelect = (event: SelectChangeEvent<string[]>, attribut: keyof SearchContactCriteria) => {
        const value = event.target.value;

        attribut === "businessCategoryId" &&  setCatSelectedIds(value as string[]);

        setSearch({ ...search, [attribut]: typeof value === 'string' ? [value] : value });
    };

    const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch({ ...search, isClient: event.target.value as "yes" | "no" | "all" });
    }

    const resetSearch = () => {
        setSearch(emptySearchCriteria);
        onSearchChange(emptySearchCriteria);
    }

    return (
        <Paper sx={{ margin: "0 1em 0 1em", padding: "0.6em", bgcolor: 'primary.light', }} >
            <FormControl sx={{
                position: "relative",
                bgcolor: 'lightCyan.light',
                padding: "1%",
                width: "98%",
            }} >
                <Typography 
                    variant="body1" 
                    component="div" 
                    sx={{ 
                        mb: 1, 
                        mt: -1.5, //-11, 
                        ml: -1, //-6, 
                        color: "grey" 
                    }}>
                    Recherche dans mes contacts
                </Typography>
                <Tooltip title="Supprimer la recherche">
                    <Fab
                        size="small"
                        color="error"
                        sx={{
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

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={search.isClient}
                            onChange={handleChangeRadio}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Clients" sx={{ height: "25px" }} />
                            <FormControlLabel value="no" control={<Radio />} label="Prospects" sx={{ height: "25px" }} />
                            <FormControlLabel value="all" control={<Radio />} label="TOUS" sx={{ height: "25px" }} />
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
                            marginRight: "30px"
                        }} />


                    {/* //////////// CAT ///////////// */}
                    <FormControl sx={{ width: "20%" }} >
                        <InputLabel id="multiple-checkbox-type-label">Catégorie(s)</InputLabel>
                        <Select
                            id="multiple-checkbox-type-label"
                            multiple={true}
                            value={search.businessCategoryId}
                            onChange={(e) => handleMultipleChangeSelect(e, "businessCategoryId")}
                            input={<OutlinedInput label="Catégories"
                            />}                            
                            renderValue={() => selectedCatLabels.join(', ')}
                            sx={{ width: '100%' }}
                            MenuProps={MenuSelectProps}
                        >
                            <MenuItem key="0" value="0">
                                {contacts.length === 0
                                    ? <ListItemText primary="Aucun contact à chercher" />
                                    : contacts.some(contact => contact.businessCategoryId === "0") && <>
                                        <Checkbox checked={search.businessCategoryId.includes("0")} />
                                        <ListItemText primary="NON DEFINIE" />
                                    </>
                                }
                            </MenuItem>

                            {/* {contacts.length > 0 && <MenuItem key="0" value="0">
                                <Checkbox checked={search.businessCategoryId.includes("0")} />
                                <ListItemText primary="NON DEFINIE" />
                            </MenuItem>} */}
                         
                            {categoriesList
                                .filter(cat => allDifferentsBusinessCategoryValues.includes(cat.id))
                                .sort((a, b) => a.label.localeCompare(b.label))
                                .map((cat, index) => (
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
                    </FormControl>



                    {/* //////////// VILLE ///////////// */}
                    <FormControl sx={{ width: "20%" }} >
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
                            {contacts.length === 0 && <MenuItem key="0" value="0">
                                <ListItemText primary="Aucun contact à chercher" />
                            </MenuItem>
                            }
                            {allDifferentsBusinessCitiesValues.map((city) => (
                                <MenuItem key={city} value={city}>
                                    <Checkbox checked={search.businessCity.indexOf(city) > -1} />
                                    <ListItemText primary={city} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* //////////// TYPE ///////////// */}
                    <FormControl sx={{ width: "20%" }} >
                        <InputLabel>Type(s)</InputLabel>
                        <Select
                            multiple={true}
                            value={search.contactType}
                            onChange={(e) => handleMultipleChangeSelect(e, "contactType")}
                            input={<OutlinedInput label="Types"  
                            />}                          
                            renderValue={(selected) => selected.join(', ')}
                            sx={{ width: '100%' }}
                            MenuProps={MenuSelectProps}
                        >
                            {contacts.length === 0 && <MenuItem key="0" value="0">
                                <ListItemText primary="Aucun contact à chercher" />
                            </MenuItem>
                            }
                            {allDifferentsContactTypesValues.map((type) => (
                                <MenuItem key={type} value={type}>
                                    <Checkbox checked={search.contactType.indexOf(type) > -1} />
                                    <ListItemText primary={type} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </FormControl>
        </Paper>
    )
}