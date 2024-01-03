// Ici pas d'utilisation du composant ContactRow => On gère le tableau par ligne et non colonne => utilisation de 'react-virtualized'
// Long car je dois tout regérer + Par contre le tri ne fonctionne plus... Et je ne sais pas comment mettre et pouvoir modifier plusieurs info dans la même cellule
//Je n'ai pas terminé car je me demande si c'est la peine car chaque modification sur un contact est très long et on a un render à chaque scroll.


import * as React from 'react';

import { Column as ColumnVirtualized, Table as TableVirtualized, TableRowProps, TableCellProps } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

import TableContainer from '@mui/material/TableContainer';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import { getCategoriesFromDatabase } from '../utils/firebase'
import {isDatePassed, isDateSoon, stringAvatar, stringToColor} from '../utils/toolbox'
import { StyledTableCell } from '../utils/StyledComponents';
import { Paper, Box, FormControl, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { useTheme } from '@mui/material/styles';



type ContactsTableProps = {
    contacts: Contact[],
    currentUserId: string,
    handleUpdateContact: (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => void  
    handleDeleteContact: (id: string) => void
    displayContactCard: (contact: Contact) => void
    getPriorityTextAndColor: (priority: number | null) => { text: string, color: string }
}
const ContactsTable = ({ contacts, currentUserId, handleUpdateContact, handleDeleteContact, displayContactCard, getPriorityTextAndColor
}: ContactsTableProps) => {

    // A garder si on veut utiliser un contact sélectionné
    const [selectedContactId, setSelectedContactId] = React.useState("");

    const [categoriesList, setCategoriesList] = React.useState<ContactCategorieType[] | null>(null);

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


    const muiTheme = useTheme();

   
    const MemoizedPhoneTextField = React.memo(({ cellData, onBlur, businessPhone }: { cellData: string,onBlur : (value: string) => void, businessPhone: string }) => {
        // Obligé de mettre à jour le contact lors du onBlur et donc de gérer l'état du TextField ici, car sinon à chaque changement le curseur revient à la fin => ajout du useEffect ! (si TextField non mémorisé pas besoin de faire tout ça)
        const [inputValue, setInputValue] = React.useState(cellData);
        // J'ajoute aussi cette variable qui fait que le TextField est coloré lors de l'édition, et se décolore lors de son enregistrement => car sinon si on quitte l'appli avant le onBlur => ça n'enregistre pas ! (mais si on change d'onglet oui)
        const [isEditing, setIsEditing] = React.useState(false);

        const handleBlur = () => {
            onBlur(inputValue);
            setIsEditing(false);
        };

        const handleFocus = () => {
            setIsEditing(true);
        };

        React.useEffect(() => {
            setInputValue(cellData);
        }, [cellData]);
    

        return <Tooltip arrow title="Tél direct" placement='top'>
                <TextField id="standard-basic"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    style={isEditing ? { backgroundColor: 'yellow' } : {}}
                    InputProps={{
                        disableUnderline: cellData.length > 0
                    }}
                    inputProps={{ style: { textAlign: 'center' } }}
                />
            </Tooltip>
            {/* Impossible de mettre une autre info dans la même cellule ..? */}
            {/* <Tooltip arrow title="Tél standard">
                <TextField id="standard-basic"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    style={isEditing ? { backgroundColor: 'yellow' } : {}}
                    color="secondary"
                    size='small'
                    InputProps={{
                        startAdornment: businessPhone.length === 0 && <span style={{ color: 'gray', fontSize: "0.8em", marginLeft: "40%" }}>... </span>,
                        disableUnderline: true
                    }}
                    inputProps={{ style: { textAlign: 'center', color: "gray", fontSize: "0.8em" } }}
                />
            </Tooltip> */}
    });
    MemoizedPhoneTextField.displayName = 'MemoizedPhoneTextField';

    const cellRendererPhone = ({ cellData, rowIndex, rowData }: TableCellProps) => {
        return (
            <MemoizedPhoneTextField
                cellData={cellData}
                onBlur={(newValue: string) => handleUpdateContact(contacts[rowIndex].id, { key: 'contactPhone', value: newValue })}             
                businessPhone={rowData.businessPhone}
            />
        );
    };   


    const MemoizedNameTextField = React.memo(({ cellData, onBlur, isClient, priority, contactId }: { cellData: string,onBlur : (value: string) => void, isClient: boolean, priority: number | null, contactId: string }) => {
        // Obligé de mettre à jour le contact lors du onBlur et donc de gérer l'état du TextField ici, car sinon à chaque changement le curseur revient à la fin => ajout du useEffect ! (si TextField non mémorisé pas besoin de faire tout ça)
        const [inputValue, setInputValue] = React.useState(cellData);
        // J'ajoute aussi cette variable qui fait que le TextField est coloré lors de l'édition, et se décolore lors de son enregistrement => car sinon si on quitte l'appli avant le onBlur => ça n'enregistre pas ! (mais si on change d'onglet oui)
        const [isEditing, setIsEditing] = React.useState(false);

        const handleBlur = () => {
            onBlur(inputValue);
            setIsEditing(false);
        };

        const handleFocus = () => {
            setIsEditing(true);
        };

        React.useEffect(() => {
            setInputValue(cellData);
        }, [cellData]);

        return <TextField
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            style={isEditing ? { backgroundColor: 'yellow' } : {}}
            InputProps={{
                startAdornment: isClient ? <HandshakeOutlinedIcon color='success' fontSize='large' /> : <PsychologyAltIcon
                    sx={{
                        color: muiTheme.palette.gray.main,
                    }}
                    fontSize='large' />,
                disableUnderline: cellData.length > 0,
            }}
            inputProps={{
                style:
                {
                    color: getPriorityTextAndColor(priority).color
                }
            }}
        />
    });
    MemoizedNameTextField.displayName = 'MemoizedNameTextField';

    const cellRendererName = ({ cellData, rowIndex, rowData }: TableCellProps) => {
       
        return (
            <MemoizedNameTextField
                cellData={cellData}
                onBlur={(newValue: string) => handleUpdateContact(contacts[rowIndex].id, { key: 'businessName', value: newValue })}
                isClient={rowData.isClient}
                priority={rowData.priority}
                contactId={rowData.id}
            />
        );
    };   

    
    const MemoizedLogo = React.memo(({ cellData, businessName, rowIndex }: { cellData: string, businessName: string, rowIndex:number }) => {
        // On peut récupérer cellData (la données qui correspond à dataKey de Column) ou rowData (tout le contact)
        const contact = contacts[rowIndex];

        return <Avatar
            onDoubleClick={() => displayContactCard(contact)} 
            variant="rounded"
            src={cellData
                ? cellData
                : ""}
            {...stringAvatar(businessName, cellData)}
        />
    });
    MemoizedLogo.displayName = 'MemoizedLogo';   

    const cellRendererLogo = ({ cellData, rowData, rowIndex }: TableCellProps) => {
        return (
            <MemoizedLogo
                cellData={cellData}
                businessName={rowData.businessName}
                rowIndex={rowIndex}
            />
        );
    };


    const MemoizedCat = React.memo(({ cellData, contactId }: { cellData: boolean, contactId: string }) => {
        return <FormControl >
        {/* Si on ne fait pas cette vérification, les options n'étant pas chargées au premier rendu => on a une indication (en jaune) dans la console : You have provided an out-of-range value for the select component" */}
        {categoriesList && <Select
            id="checkbox-type-label"
            value={cellData}
            variant="standard"
            disableUnderline={true}
            //onChange={(e) => handleChangeSelect(e, "businessCategoryId")}
            onChange={(e) => handleUpdateContact(contactId, { key: "businessCategoryId", value: e.target.value })}
            sx={{  width: 180 }}
        >
            <MenuItem key="0" value="0">NON DEFINIE</MenuItem>
            {categoriesList.length === 0 && <Typography variant="caption" >
                Aucune catégorie créée pour l'instant, veuillez le faire dans Admin (onglet <SettingsIcon fontSize='small' /> )
                </Typography>
            }
            {categoriesList
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((cat, index) => (
                <MenuItem
                    key={cat.id}
                    value={cat.id}
                    sx={{ backgroundColor: index % 2 === 0 ? muiTheme.palette.gray.light : '' ,  
                }}
                >{cat.label}</MenuItem>
            ))}
        </Select>}
    </FormControl>
    });
    MemoizedCat.displayName = 'MemoizedCat';   

    const cellRendererCat = ({ cellData, rowData }: TableCellProps) => {
        return (
            <MemoizedCat
                cellData={cellData}
                contactId={rowData.id}
            />
        );
    };

    const MemoizedIsClientSwitch = React.memo(({ cellData, contactId }: { cellData: boolean, contactId: string }) => {

        return <Switch
            checked={cellData}
            onChange={() => handleUpdateContact(contactId, { key: "isClient", value: !cellData })}
            color="success"
            inputProps={{ 'aria-label': 'controlled' }}
        />
    });
    MemoizedIsClientSwitch.displayName = 'MemoizedIsClientSwitch';   

    const cellRendererIsClientSwitch = ({ cellData, rowIndex, rowData }: TableCellProps) => {        
        return (
            <MemoizedIsClientSwitch
                cellData={cellData}
                contactId={rowData.id}
            />
        );
    };

   
    return (
        <Paper sx={{
            width: '100%',
        }} elevation={3} > 
            <TableContainer sx={{ maxHeight: "calc(100vh - 200px)" }} >              
                <TableVirtualized
                    width={1800}   
                    height={200}
                    headerHeight={40}
                    rowHeight={40}
                    rowCount={contacts.length}
                    rowGetter={({ index }) => contacts[index]}
                >   
                    <ColumnVirtualized
                        label={<HandshakeOutlinedIcon />}
                        dataKey='isClient'
                        width={100}
                        cellRenderer={cellRendererIsClientSwitch}
                    />
                    <ColumnVirtualized
                        label='Catégorie'
                        dataKey='businessCategoryId'
                        width={200}
                        cellRenderer={cellRendererCat}
                    />   
                    <ColumnVirtualized
                        label='Name'
                        dataKey='businessName'
                        width={300}
                        cellRenderer={cellRendererName}
                    />
                    <ColumnVirtualized
                        label='Logo'
                        dataKey='logo'
                        width={100}
                        cellRenderer={cellRendererLogo}
                    />
                    <ColumnVirtualized
                        label='Phone'
                        dataKey='contactPhone'
                        width={300}
                        cellRenderer={cellRendererPhone}
                    />                    
                </TableVirtualized>
            </TableContainer>
        </Paper>
    );
}

// Pour que le tableau ne se recharche pas à chaque changement d'onglet (que s'il y a un changement)
 export default React.memo(ContactsTable)