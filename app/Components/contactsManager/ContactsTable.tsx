import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledTableCell } from '../../utils/StyledComponentsAndUtilities';
//import ContactRow from './ContactRow';
import { Box, FormControlLabel, Switch, TableCell, TextField, Tooltip, Typography } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import MailIcon from '@mui/icons-material/Mail';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import AccessAlarmRoundedIcon from '@mui/icons-material/AccessAlarmRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import GradeIcon from '@mui/icons-material/Grade';

// Deployement VERCEL : erreur "document is not defined" causée par l'utilisation de la bibliothèque react-quill, qui utilise l'objet document du navigateur, qui n'est pas disponible lors du rendu côté serveur (SSR) ou lors de la génération de pages statiques (SSG) avec Next.js. => Pour résoudre ce problème, utiliser l'API next/dynamic pour charger dynamiquement le composant qui utilise react-quill avec l'option { ssr: false }. Cela garantit que le composant n'est rendu que côté client, où l'objet document est disponible.
import dynamic from 'next/dynamic';

const ContactRow = dynamic(() => import('./ContactRow'), { ssr: false });

interface Column {
    id: keyof Contact   // | "supprimer"
    label: string | JSX.Element
    minWidth?: number | string
    //align?: 'right'
    format?: (value: number) => string
}

const headCells: readonly Column[] = [
    { id: 'isClient', label: <Tooltip title="Client ou Prospect ?"><HandshakeOutlinedIcon /></Tooltip>, minWidth: "2em", },
    { id: 'businessCategoryId', label: 'Catégorie', minWidth: "8em", },
    {
        id: 'dateOfNextCall', label: <Box sx={{ display: 'flex', alignItems: 'center', }}
        ><AccessAlarmRoundedIcon fontSize='large' sx={{ marginRight: "20px" }} />Relance</Box>, minWidth: "9em",
    },
    { id: 'logo', label: 'Logo', minWidth: "4em", },
    { id: 'businessName', label: 'Nom', minWidth: "10em", },
    { id: 'priority', label: <Tooltip title="Priorité"><GradeIcon /></Tooltip>, minWidth: "2em", },
    { id: 'contactPhone', label: <CallRoundedIcon fontSize='large' />, minWidth: "10em", },
    { id: 'contactName', label: <AccountCircleRoundedIcon fontSize='large' />, minWidth: "10em", },
    { id: 'contactEmail', label: <MailIcon fontSize='large' />, minWidth: "10em", },
    { id: 'businessCity', label: 'Ville', minWidth: "10em", },
    { id: 'hasBeenCalled', label: <Tooltip title="Contact appelé ?"><Box><CallRoundedIcon fontSize='large' /><QuestionMarkIcon /></Box></Tooltip>, minWidth: "5em", },
    { id: 'hasBeenSentEmailOrMeetUp', label: <Tooltip title="Contact joint par mail ou rencontré ?"><Box><MailIcon /><HandshakeTwoToneIcon /><QuestionMarkIcon /></Box></Tooltip>, minWidth: "6em", },
    { id: 'comments', label: <Tooltip title="Commentaires"><CommentRoundedIcon fontSize='large' /></Tooltip>, minWidth: "5em", },
    { id: 'interestGauge', label: <Tooltip title="Niveau d'intéressement"><FavoriteRoundedIcon fontSize='large' /></Tooltip>, minWidth: "5em", },
    { id: 'filesSentRef', label: <Tooltip title="Fichier(s) associés"><AttachFileRoundedIcon fontSize='large' /></Tooltip>, minWidth: "10em", },
    { id: 'dateOfFirstCall', label: 'Premier appel', minWidth: "9em", },
    { id: 'dateOfLastCall', label: 'Dernier appel', minWidth: "9em", },
    { id: 'contactType', label: 'Type', minWidth: "7em", },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {

    if (typeof orderBy === 'string' && orderBy.includes('date')) {
    
        // On ne veut pas les date null en premier donc : Si la date est null, on la considère comme étant infiniment grande
        const dateA = a[orderBy] ? (a[orderBy] as Timestamp).toDate().getTime() : Infinity;
        const dateB = b[orderBy] ? (b[orderBy] as Timestamp).toDate().getTime() : Infinity;

        return dateB - dateA;
    }

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
function stableSort(array: Contact[], comparator: (a: any, b: any) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [any, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface SortableTableHeaderProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Contact) => void;
    order: Order;
    orderBy: string;
}
function SortableTableHeader(props: SortableTableHeaderProps) {
    const {
        order, orderBy,
        onRequestSort } = props;
    const createSortHandler =
        (property: keyof Contact) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        scope="col"
                        style={{
                            height: "40px",
                            minWidth: headCell.minWidth,
                            padding: 0
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
                    align="center"
                ><Box><DeleteForeverRoundedIcon /><QuestionMarkIcon /></Box>
                </StyledTableCell>
            </TableRow>
        </TableHead>
    );
}


type ContactsTableProps = {
    contacts: Contact[],
    currentUserId: string,
    handleUpdateContact: (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => void
    handleDeleteContact: (id: string) => void
    getPriorityTextAndColor: (priority: number | null) => { text: string, color: string }
}
const ContactsTable = ({ contacts, currentUserId, handleUpdateContact, handleDeleteContact, getPriorityTextAndColor }: ContactsTableProps) => {

    //console.log("filteredContacts : ", contacts)
    
    // A garder si on veut utiliser un contact sélectionné
    //const [selectedContactId, setSelectedContactId] = React.useState("");

    const [page, setPage] = React.useState(0);
    //const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(7);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Contact>('businessName');

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Contact,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };   

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setDense(event.target.checked);
    // };

    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows =
    //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contacts.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(contacts, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, contacts],
    ); 
   
    return (
        <Paper sx={{ width: '100%', }} elevation={3} >
            <TableContainer
                sx={{ maxHeight: "calc(100vh - 185px)" }}
            >
                <Table stickyHeader>
                    <SortableTableHeader
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {visibleRows.map((row) => (
                            <ContactRow
                                key={row.id}
                                contact={row}
                                currentUserId={currentUserId}
                                handleUpdateContact={handleUpdateContact}
                                handleDeleteContact={handleDeleteContact}
                                getPriorityTextAndColor={getPriorityTextAndColor}
                            />
                        ))}
                        {/* {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )} */}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 7, 10, 15, 20, 25]}
                component="div"
                count={contacts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                // On change le texte pour le mettre en français 
                labelRowsPerPage="Lignes par page :"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
                getItemAriaLabel={(type) => {
                    if (type === 'previous') return 'Page précédente';
                    if (type === 'next') return 'Page suivante';
                    if (type === 'first') return 'Aller à la première page';
                    if (type === 'last') return 'Aller à la dernière page';
                    return '';
                }}
                showFirstButton
                showLastButton
            />
            {/* <FormControlLabel
                control={<Switch 
                    checked={dense} 
                    onChange={handleChangeDense} />}
                label="Dense padding"
            /> */}
        </Paper>

    );
}

export default ContactsTable