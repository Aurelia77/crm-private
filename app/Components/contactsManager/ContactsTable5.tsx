// Idem 4 ('react-virtualized') mais sans mémoîser les cellules (car j'ai l'impression que ce n'est pas utilie...?)

import * as React from 'react';

import { Column as ColumnVirtualized, Table as TableVirtualized, TableRowProps, TableCellProps } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

import TableContainer from '@mui/material/TableContainer';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import { getCategoriesFromDatabase } from '../../utils/firebase'
import { isDatePassed, isDateSoon, stringAvatar, stringToColor } from '../../utils/toolbox'
import { StyledTableCell } from '../../utils/StyledComponents';
import { Paper, Box, FormControl, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';


type ContactsTableProps = {
    contacts: Contact[],
    currentUserId: string,
    handleUpdateContact: (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => void
    handleDeleteContact: (id: string) => void
    //displayContactCard: (contact: Contact) => void
    getPriorityTextAndColor: (priority: number | null) => { text: string, color: string }
}
const ContactsTable = ({ contacts, currentUserId, handleUpdateContact, handleDeleteContact, 
    //displayContactCard, 
    getPriorityTextAndColor
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


    const cellRendererPhone = ({ cellData, rowIndex, rowData }: TableCellProps) => {
        return <Tooltip arrow title="Tél direct" placement='top'>
                    <TextField id="standard-basic"
                        value={cellData}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleUpdateContact(contacts[rowIndex].id, { key: 'contactPhone', value: event.target.value })}
                        InputProps={{
                            disableUnderline: cellData.length > 0
                        }}
                        inputProps={{ style: { textAlign: 'center' } }}
                    />
                </Tooltip>
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
                        startAdornment: rowData.businessPhone.length === 0 && <span style={{ color: 'gray', fontSize: "0.8em", marginLeft: "40%" }}>... </span>,
                        disableUnderline: true
                    }}
                    inputProps={{ style: { textAlign: 'center', color: "gray", fontSize: "0.8em" } }}
                />
            </Tooltip> */}
    }

  
    const cellRendererName = ({ cellData, rowIndex, rowData }: TableCellProps) => {
        return (
            <TextField
                value={cellData}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateContact(contacts[rowIndex].id, { key: 'businessName', value: event.target.value })}
                InputProps={{
                    startAdornment: rowData.isClient ? <HandshakeOutlinedIcon color='success' fontSize='large' /> : <PsychologyAltIcon
                        sx={{
                            color: muiTheme.palette.gray.main,
                        }}
                        fontSize='large' />,
                    disableUnderline: cellData.length > 0,
                }}
                inputProps={{
                    style:
                    {
                        color: getPriorityTextAndColor(rowData.priority).color
                    }
                }}
            />
        );
    };
    const cellRendererLogo = ({ cellData, rowData, rowIndex }: TableCellProps) => {
        // On peut récupérer cellData (la données qui correspond à dataKey de Column) ou rowData (tout le contact)
        const contact = contacts[rowIndex];

        return <Link
            href={`/gestionContacts/contact/${contact.id}`}
            style={{ textDecoration: "none" }}
        >
            <Avatar
                //onDoubleClick={() => displayContactCard(contact)} 
                variant="rounded"
                src={cellData
                    ? cellData
                    : ""}
                {...stringAvatar(rowData.businessName, cellData)}
            />
        </Link>
    };
    const cellRendererCat = ({ cellData, rowData }: TableCellProps) => {
        return (
            <FormControl >
                {/* Si on ne fait pas cette vérification, les options n'étant pas chargées au premier rendu => on a une indication (en jaune) dans la console : You have provided an out-of-range value for the select component" */}
                {categoriesList && <Select
                    id="checkbox-type-label"
                    value={cellData}
                    variant="standard"
                    disableUnderline={true}
                    //onChange={(e) => handleChangeSelect(e, "businessCategoryId")}
                    onChange={(e) => handleUpdateContact(rowData.id, { key: "businessCategoryId", value: e.target.value })}
                    sx={{ width: 180 }}
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
                                sx={{
                                    backgroundColor: index % 2 === 0 ? muiTheme.palette.gray.light : '',
                                    //overflow: 'auto',
                                    //maxHeight: "50vh",
                                }}
                            >{cat.label}</MenuItem>
                        ))}
                </Select>}
            </FormControl>

        );
    };
    const cellRendererIsClientSwitch = ({ cellData, rowIndex, rowData }: TableCellProps) => {
        return (
            <Switch
                checked={cellData}
                onChange={() => handleUpdateContact(rowData.id, { key: "isClient", value: !cellData })}
                color="success"
                inputProps={{ 'aria-label': 'controlled' }}
            />
        );
    };


    return (
        <Paper sx={{ width: '100%', }} elevation={3} >
            <TableContainer>
                <TableVirtualized
                    width={1800}    
                    height={400} //{window.innerHeight - 190}
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