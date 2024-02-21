import React from 'react'
// UTILS
import { getUniqueSortedValues } from '@/app/utils/toolbox';
import { getCategoriesFromDatabase, getCatLabelFromId } from '@/app/utils/firebase'
// MUI
import { FormControl, InputLabel, TextField, Typography, MenuItem, Checkbox, FormControlLabel, OutlinedInput, ListItemText, Box, Paper } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import BusinessIcon from '@mui/icons-material/Business';
import { Fab } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import Tooltip from '@mui/material/Tooltip';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

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
    const [selectedCatLabels, setSelectedCatLabels] = React.useState<string[]>([]);
    const [allDifferentsBusinessCategoryIds, setAllDifferentsBusinessCategoryIds] = React.useState<{ value: string, count: number }[]>([]);
    const [allDifferentsBusinessCitiesValues, setAllDifferentsBusinessCitiesValues] = React.useState<{ value: string, count: number }[]>([]);
    const [allDifferentsContactTypesValues, setAllDifferentsContactTypesValues] = React.useState<{ value: ContactTypeType, count: number }[]>([]);

    const muiTheme = useTheme();

    const typeIcons: { [key: string]: JSX.Element } = {
        "Partenaire": <PeopleIcon color='secondary' />,
        "Entreprise": <BusinessIcon color='primary' />,
        "Particulier": <AccessibilityIcon sx={{ color: muiTheme.palette.ochre.main }} />,
    };

    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch({ ...search, [event.target.name]: event.target.value });
    }

    const handleMultipleChangeSelect = (event: SelectChangeEvent<string[]>, attribut: keyof SearchContactCriteria) => {
        const value = event.target.value;
        setSearch({ ...search, [attribut]: typeof value === 'string' ? [value] : value });
    };

    const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch({ ...search, isClient: event.target.value as "yes" | "no" | "all" });
    }

    const resetSearch = () => {
        setSearch(emptySearchCriteria);
        onSearchChange(emptySearchCriteria);
    }

    React.useEffect(() => {
        setAllDifferentsBusinessCategoryIds(getUniqueSortedValues(contacts, 'businessCategoryId'));
        setAllDifferentsBusinessCitiesValues(getUniqueSortedValues(contacts, 'businessCity', false));
        setAllDifferentsContactTypesValues(getUniqueSortedValues(contacts, 'contactType') as { value: ContactTypeType, count: number }[]);
    }, [contacts]);

    // On met à jour la recherche de CATEGORIE et TYPE quand les valeurs correspondantes des contacts changent
    React.useEffect(() => {
        setSearch({...search, contactTypes: search.contactTypes.filter(type => allDifferentsContactTypesValues.map(item => item.value).includes(type))})
    }, [allDifferentsContactTypesValues])

    React.useEffect(() => {
        setSearch({
            ...search, businessCategoryIds: search.businessCategoryIds.filter(catId => allDifferentsBusinessCategoryIds.map(item => {
                return item.value
            }
            ).includes(catId))
        })
    }, [allDifferentsBusinessCategoryIds])

    React.useEffect(() => {
        getCategoriesFromDatabase(currentUserId).then((categories: ContactCategorieType[]) => {
            // Pas besoin de l'attribut userId donc on garde juste ce qu'on veut
            const updatedCategoriesList = categories.map(category => ({
                id: category.id,
                label: category.label
            }));
            setCategoriesList(updatedCategoriesList);
        })
    }, [currentUserId]);

    React.useEffect(() => {
        onSearchChange(search)
    }, [search, onSearchChange])

    React.useEffect(() => {
        if (search.businessCategoryIds.length > 0) {
            Promise.all(search.businessCategoryIds.map(catId => getCatLabelFromId(catId)))
                .then(labels => {
                    return setSelectedCatLabels(labels)
                });
        } else {
            setSelectedCatLabels([]);
        }
    }, [search.businessCategoryIds]);   

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
                        mt: -1.5, 
                        ml: -1,  
                        color: "grey"
                    }}>
                    Recherche dans mes contacts
                </Typography>
                <Tooltip title="Supprimer la recherche et afficher TOUS mes contacts">
                    <Fab
                        size="small"
                        color="error"
                        sx={{
                            position: "absolute",
                            bottom: -15,
                            right: -15,
                            padding: 0 
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
                            <FormControlLabel value="yes" control={<Radio />} label={`Clients (${contacts.filter(contact => contact.isClient === true).length})`} sx={{ height: "25px" }} />
                            <FormControlLabel value="no" control={<Radio />} label={`Prospects (${contacts.filter(contact => contact.isClient === false).length})`} sx={{ height: "25px" }} />
                            <FormControlLabel value="all" control={<Radio />} label="TOUS" sx={{ height: "25px" }} />
                        </RadioGroup>
                    </FormControl>

                    {/* //////////// NOM ///////////// */}
                    <TextField
                        id="search-name"
                        label="Nom"
                        name='businessNames'
                        value={search.businessNames}
                        onChange={handleChangeText}
                        sx={{
                            marginRight: "30px"
                        }} 
                    />

                    {/* //////////// CAT ///////////// */}
                    <FormControl sx={{ width: "20%" }} >
                        <InputLabel id="multiple-checkbox-type-label">Catégorie(s)</InputLabel>
                        <Select
                            id="multiple-checkbox-type-label"
                            multiple={true}
                            value={search.businessCategoryIds}
                            onChange={(e) => handleMultipleChangeSelect(e, "businessCategoryIds")}
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
                                        <Checkbox checked={search.businessCategoryIds.includes("0")} />
                                        <ListItemText primary={`NON DEFINIE (${contacts.filter(contact => contact.businessCategoryId === "0").length})`} />
                                    </>
                                }
                            </MenuItem>

                            {/* {contacts.length > 0 && <MenuItem key="0" value="0">
                                <Checkbox checked={search.businessCategoryId.includes("0")} />
                                <ListItemText primary="NON DEFINIE" />
                            </MenuItem>} */}

                            {categoriesList
                                .filter(cat => allDifferentsBusinessCategoryIds.map(item => item.value).includes(cat.id))
                                .sort((a, b) => a.label.localeCompare(b.label))
                                .map((cat, index) => (
                                    <MenuItem
                                        key={cat.id}
                                        value={cat.id}
                                        sx={{ backgroundColor: index % 2 === 0 ? muiTheme.palette.gray.light : '' }}
                                    >
                                        <Checkbox checked={search.businessCategoryIds.indexOf(cat.id) > -1} />
                                        <ListItemText primary={`${cat.label} (${allDifferentsBusinessCategoryIds.find(item => item.value === cat.id)?.count || 0})`}
                                        />
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
                            value={search.businessCities}
                            onChange={(e) => handleMultipleChangeSelect(e, "businessCities")}
                            input={<OutlinedInput label="Ville(s)"  // label utilisé pour l'accessibilité non l'affichage.                            
                            />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuSelectProps}
                        >
                            {contacts.length === 0 && <MenuItem key="0" value="0">
                                <ListItemText primary="Aucun contact à chercher" />
                            </MenuItem>
                            }
                            {allDifferentsBusinessCitiesValues.map((city, index) => (
                                city.value === ""
                                    ? <MenuItem key={0} value="-Vide(s)" sx={{ backgroundColor: index % 2 === 0 ? muiTheme.palette.gray.light : '' }} >
                                        <Checkbox checked={search.businessCities.indexOf(city.value) > -1} />
                                        <ListItemText primary={`-Vide(s) (${city.count})`} />
                                    </MenuItem>
                                    : <MenuItem key={city.value} value={city.value} sx={{ backgroundColor: index % 2 === 0 ? muiTheme.palette.gray.light : '' }} >
                                        <Checkbox checked={search.businessCities.indexOf(city.value) > -1} />
                                        <ListItemText primary={`${city.value} (${city.count})`} />
                                    </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* //////////// TYPE ///////////// */}
                    <FormControl sx={{ width: "20%" }} >
                        <InputLabel>Type(s)</InputLabel>
                        <Select
                            multiple={true}
                            value={search.contactTypes}
                            onChange={(e) => handleMultipleChangeSelect(e, "contactTypes")}
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
                            {allDifferentsContactTypesValues.map((type, index) => (
                                <MenuItem key={type.value} value={type.value} sx={{ backgroundColor: index % 2 === 0 ? muiTheme.palette.gray.light : '' }}>
                                    <Checkbox checked={search.contactTypes.indexOf(type.value) > -1} />
                                    <ListItemText primary={`${type.value} (${type.count})`} />
                                    <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 1 }} >
                                        {typeIcons[type.value]}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </FormControl>
        </Paper>
    )
}