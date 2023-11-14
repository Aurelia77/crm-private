import * as React from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { darken } from '@mui/material/styles';
import { lighten } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { Dayjs } from 'dayjs';       // npm install dayjs
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';    // pnpm install @mui/utils
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import MailIcon from '@mui/icons-material/Mail';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import AccessAlarmRoundedIcon from '@mui/icons-material/AccessAlarmRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';



import { StyledTableCell } from './StyledComponents';
import ContactRow from './ContactRow';
import { Box, Typography } from '@mui/material';
import { Timestamp } from 'firebase/firestore';


interface Column {
    id: keyof Contact   // | "supprimer"
    label: string | JSX.Element
    minWidth?: number | string
    //align?: 'right'
    format?: (value: number) => string
}


const headCells: readonly Column[] = [               // readonly ???
    { id: 'isClient', label: 'Client ?', minWidth: "7em", },    
    { id: 'dateOfNextCall', label: <AccessAlarmRoundedIcon fontSize='large' />, minWidth: "18em", },
    { id: 'logo', label: '', minWidth: "5em", },
    { id: 'businessName', label: 'Entreprise', minWidth: "15em", },
    { id: 'contactPhone', label: <CallRoundedIcon fontSize='large' />, minWidth: "15em", },
    { id: 'contactName', label: <AccountCircleRoundedIcon fontSize='large' />, minWidth: "15em",
        //align: 'right', 
        //format: (value: number) => value.toLocaleString('en-US'),
    },
    { id: 'contactEmail', label: <MailIcon fontSize='large' />, minWidth: "15em", },    
    { id: 'businessCity', label: 'Ville', minWidth: "10em", },
    { id: 'hasBeenCalled', label: <Box><CallRoundedIcon fontSize='large' /><QuestionMarkIcon /></Box>
        , minWidth: "5em", },
    { id: 'hasBeenSentEmailorMeetUp', label: 
    //'mail/rencontre ?',
    <Box><MailIcon /><HandshakeTwoToneIcon /><QuestionMarkIcon /></Box>,
     minWidth: "6em", },
    { id: 'comments', label: <CommentRoundedIcon fontSize='large' />, minWidth: "5em", },
    { id: 'interestGauge', label: <FavoriteRoundedIcon fontSize='large' />, minWidth: "5em", },
    { id: 'filesSent', label: <AttachFileRoundedIcon fontSize='large' />, minWidth: "10em", },
    // { id: 'supprimer', label: 'Supprimer ?', minWidth: "5em", },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
type Order = 'asc' | 'desc';
function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array: Contact[], comparator: (a: any, b: any) => number) {   // j'ai enlevé T sinon erreur !!!
    // function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [any, number]);
    // const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Contact) => void;
    //onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    //rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
    const {
        //onSelectAllClick,
        order, orderBy, numSelected,
        //rowCount,
        onRequestSort } = props;
    const createSortHandler =
        (property: keyof Contact) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };
    return (
        <TableHead>
            <TableRow>
                {/*<TableCell padding="checkbox">
          <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell> */}
                {headCells.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        //align={headCell.numeric ? 'right' : 'left'}
                        //padding={headCell.disablePadding ? 'none' : 'normal'}
                        //align="center"
                        style={{
                            minWidth: headCell.minWidth,
                            padding: 0
                            //minWidth: colWidth,
                        }}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </StyledTableCell>
                ))}
                <StyledTableCell
                    key="supprimer"
                    //align={headCell.numeric ? 'right' : 'left'}
                    //padding={headCell.disablePadding ? 'none' : 'normal'}
                    align="center"
                // style={{
                //     minWidth: headCell.minWidth,
                //     padding: 0
                //     //minWidth: colWidth,
                // }}
                // sortDirection={orderBy === headCell.id ? order : false}
                ><Box><DeleteForeverRoundedIcon /><QuestionMarkIcon /></Box>
                </StyledTableCell>
                {/* {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        //align={headCell.numeric ? 'right' : 'left'}
                        //padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))} */}
            </TableRow>
        </TableHead>
    );
}


type ContactsTableProps = {
    contacts: Contact[],
    //selectedContact: Contact,
    selectedContactId: string,
    setSelectedContact: (contact: Contact) => void
    handleUpdateContact: (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => void   // obligé de mettre NULL pour la date ! (???)
    // handleUpdateContact: (updatingContact: Contact) => void
    handleDeleteContact: (id: string) => void

    //setSelectedContactId: (id: string) => void
    //setContacts: (contacts: Contact[]) => void
}
export default function ContactsTable({ contacts, selectedContactId, setSelectedContact, handleUpdateContact, handleDeleteContact
    //setContacts
}: ContactsTableProps) {

    //console.log("xxxContacts = ", contacts)

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Contact>('businessName');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    //const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    //const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Contact,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    //console.log(document.documentElement.clientHeight)

    const handleChangeHasBeenCalledCheckbox = () => {
        // console.log(contacts)

        // const a = [...contacts, contacts[selectedContactId].hasBeenCalled = !contacts[selectedContactId].hasBeenCalled]
        // console.log(a)

        //setContacts([...contacts, contacts[selectedContactId].hasBeenCalled = !contacts[selectedContactId].hasBeenCalled])

        //setSelectedContact({...selectedContact, hasBeenCalled: !selectedContact.hasBeenCalled})

        //dispatch({type : 'inputsChanging', payload : {...state.editingMovie, name: event.target.value}})
        //setEditingMovie({...editingMovie, hasBeenCalled: !editingMovie.hasBeenCalled})
        //}
    }

    const muiTheme = useTheme();

    const visibleRows = React.useMemo(
        () =>
            stableSort(contacts, getComparator(order, orderBy))
        //.slice(
        //page * rowsPerPage,
        //page * rowsPerPage + rowsPerPage,
        //)
        ,
        [order, orderBy, contacts
            //page, rowsPerPage
        ],
    );

    // // Pour tester les Grilles (Data Grid) car possibilité de filtrer, mais pas avec options ! Et on pt pas mettre d'icones dans les titres de colonnes je crois. Et puis je veux pas tout refaire donc je vais filtrer sur le tableau :)
    // const rows: GridRowsProp = contacts
    // const columns: GridColDef[] = [
    //     { field: 'isClient', headerName: 'Client ?', width: 150 },
    //     { field: 'logo', headerName: '', width: 150 },
    //     { field: 'businessName', headerName: 'Entreprise', },
    //     { field: 'businessCity', headerName: 'Ville', },
    //     { field: 'contactPhone', headerName: 'contactPhone', },
    //     { field: 'contactName', headerName: 'contactName', },
    //     { field: 'contactEmail', headerName: 'contactEmail', },
    //     { field: 'hasBeenCalled', headerName: 'hasBeenCalled', },
    //     { field: 'hasBeenSentEmail', headerName: 'hasBeenSentEmail', },
    //     { field: 'dateOfNextCall', headerName: 'dateOfNextCall', },
    //     { field: 'comments', headerName: 'comments', },
    //     { field: 'filesSent', headerName: 'filesSent', },
    //     { field: 'interestGauge', headerName: 'interestGauge', },
    // ];


    return (
        <Paper sx={{
            width: '100%',
            //overflow: 'hidden' 
        }}
            elevation={3}
        >
            {/* <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} />
            </div> */}
            
            {/* <Typography  color='text.main' >Coucou</Typography>
            <Typography  color='secondary.main' >Coucou</Typography> 
            <Typography  //color='secondary.main'
                sx={{ color: darken(muiTheme.palette.secondary.main, 0.2)  }}
            >Coucou</Typography>
            <Typography  //color='secondary.main'
                sx={{ color: muiTheme.palette.secondary.main }}
            >Coucou</Typography>
            <Typography  //color='secondary.main'
                sx={{ color: lighten(muiTheme.palette.secondary.main, 0.2)  }}
            >Coucou</Typography> */}

            {/* <div className=' bg-red-500' >Coucou</div>
            <div style={{ backgroundColor: "red" }} >Coucou</div>
            <Box sx={{ bgcolor: 'primary.main' }}>Coucou</Box>
            <Box sx={{ bgcolor: 'secondary.main' }}>Coucou</Box>
            <Box color="secondary.main" bgcolor="primary.main" >Coucou</Box>
            <Button variant="contained" color="ochre" href= '/testPages/testAutocompletePage'>Coucou !!</Button> 
            <Button variant="contained" color="primary" href= '/testPages/testAutocompletePage'>Coucou !!</Button> 
            <Button variant="contained" color="secondary" href= '/testPages/testAutocompletePage'>Coucou !!</Button>  */}

            {/* <Typography variant="h5" component="div" sx={{ p: 2 }}>Liste des contacts ({contacts.length})</Typography> */}
            <TableContainer
                //sx={{ maxHeight: document.documentElement.clientHeight * 0.88 }}   //vh = 1% de la hauteur du viewport (la zone d'affichage).// Ok mais problème avec Vercel !!!               
                sx={{ maxHeight: "calc(100vh - 320px)" }}
            // sx={{ maxHeight:  "calc(100vh - 185px)" }} 
            >
                <Table stickyHeader aria-label="sticky table">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        //onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                    //rowCount={rows.length}
                    />
                    {/* <TableHead>                      
                        <TableRow>
                            {headCells.map((column) => (
                                <StyledTableCell
                                    key={column.id}
                                    align="center"
                                    style={{ 
                                        minWidth: column.minWidth,
                                        padding: 0 
                                        //minWidth: colWidth,
                                    }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                        </TableRow> 
                    </TableHead>     */}
                    <TableBody>
                        {visibleRows.map((row, index) => {
                            //const isItemSelected = isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            //console.log(row)

                            return (
                                <ContactRow key={row.id}
                                    contact={row}
                                    selectedContactId={selectedContactId}
                                    setSelectedContact={setSelectedContact}
                                    handleUpdateContact={handleUpdateContact}
                                    handleDeleteContact={() => handleDeleteContact(row.id)}
                                //setContacts={setContacts} 
                                />
                            );
                        })}
                    </TableBody>
                    {/* <TableBody>
                        {contacts.map((contact) => {
                            return (
                                <StyledTableRow hover role="checkbox" 
                                    tabIndex={-1}       // ???
                                    key={contact.id}>
                                    {columns.map((column) => {
                                        const value = contact[column.id];
                                        return (
                                            <StyledTableCell key={column.id} 
                                            //align={column.align}
                                            >
                                                {column.format && typeof value === 'number'
                                                    ? column.format(value)
                                                    : value}
                                                  //  {value}
                                            </StyledTableCell>
                                        );
                                    })}
                                </StyledTableRow>
                            );
                        })}
                    </TableBody> */}
                </Table>
            </TableContainer>

        </Paper>
    );
}