// Utilisation de FixedSizeList de react-window mais je n'arrive pas à gérer avec le header (que les cellules soient de la même taille que le body) et de toute façon je vois que toutes les lignes se rerender à chaque scroll ! => Pas d'optimisation de perf
// Aussi je n'arrive pas à gérer l'architecture du tableau car j'ai toujours une erreur :  <tr> cannot appear as a child of <div>.. (FixedSizeList est un div qui doit contenir les lignes : ContactRow, qui lui est un <tr>)

import * as React from 'react';
// Si beaucoup de contacts => très long à charger !!! Donc j'utilise la virtualisation avec react-window => pnpm install react-window
// Aussi intaller les types de définitions pour TS ! (sinon erreur: Le fichier de déclaration du module 'react-window' est introuvable.) => pnpm install @types/react-window
// Ensuite on importe et on utilise FixedSizeList à la place de Table
import { FixedSizeList } from 'react-window';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { StyledTableCell } from '../utils/StyledComponents';
import { Box, Table, TableBody, } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import ContactRow from './ContactRow';

interface Column {
    id: keyof Contact
    label: string | JSX.Element
    width?: number
    minWidth?: number | string
    format?: (value: number) => string
}

const headCells: readonly Column[] = [
    { id: 'isClient', label: <HandshakeOutlinedIcon />, minWidth: "2em", width: 60, },
    { id: 'businessCategoryId', label: 'Catégorie', minWidth: "8em", width: 88, },
    {
        id: 'dateOfNextCall', label: <Box sx={{ display: 'flex', alignItems: 'center', }}
        ><AccessAlarmRoundedIcon fontSize='large' sx={{ marginRight: "20px" }} />Relance</Box>, minWidth: "9em",
    },
    { id: 'logo', label: 'Logo', minWidth: "4em", },
    { id: 'businessName', label: 'Nom', minWidth: "11em", },
    { id: 'priority', label: <GradeIcon />, minWidth: "2em", },
    { id: 'contactPhone', label: <CallRoundedIcon fontSize='large' />, minWidth: "10em", },
    {
        id: 'contactName', label: <AccountCircleRoundedIcon fontSize='large' />, minWidth: "10em",
    },
    { id: 'contactEmail', label: <MailIcon fontSize='large' />, minWidth: "10em", },
    { id: 'businessCity', label: 'Ville', minWidth: "10em", },
    { id: 'hasBeenCalled', label: <Box><CallRoundedIcon fontSize='large' /><QuestionMarkIcon /></Box>, minWidth: "5em", },
    {
        id: 'hasBeenSentEmailOrMeetUp', label: <Box><MailIcon /><HandshakeTwoToneIcon /><QuestionMarkIcon /></Box>, minWidth: "6em",
    },
    { id: 'comments', label: <CommentRoundedIcon fontSize='large' />, minWidth: "5em", },
    { id: 'interestGauge', label: <FavoriteRoundedIcon fontSize='large' />, minWidth: "5em", },
    { id: 'filesSent', label: <AttachFileRoundedIcon fontSize='large' />, minWidth: "10em", },
    { id: 'dateOfFirstCall', label: 'Premier appel', minWidth: "9em", },
    { id: 'dateOfLastCall', label: 'Dernier appel', minWidth: "9em", },
    { id: 'contactType', label: 'Type', minWidth: "7em", },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (typeof a[orderBy] === 'string' && typeof b[orderBy] === 'string') {
        // Convertir en minuscules avant de comparer
        const lowerA = (a[orderBy] as string).toLowerCase();
        const lowerB = (b[orderBy] as string).toLowerCase();

        if (lowerB < lowerA) {
            return -1;
        }
        if (lowerB > lowerA) {
            return 1;
        }
    } else {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
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
    numSelected: number;
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
                >
                    <Box>
                        <DeleteForeverRoundedIcon />
                        <QuestionMarkIcon />
                    </Box>
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
    displayContactCard: (contact: Contact) => void
    getPriorityTextAndColor: (priority: number | null) => { text: string, color: string }
}
const ContactsTable = ({ contacts, currentUserId, handleUpdateContact, handleDeleteContact, displayContactCard, getPriorityTextAndColor
}: ContactsTableProps) => {

    // A garder si on veut utiliser un contact sélectionné
    const [selectedContactId, setSelectedContactId] = React.useState("");

    // useCallback ne devrait pas être utilisé pour mémoriser les fonctions de mise à jour de l'état, car ces fonctions ne changent pas entre les rendus. Vous pouvez simplement passer les fonctions de mise à jour de l'état directement à vos composants.
    //const memoizedSetSelectedContactId = React.useCallback(setSelectedContactId, [setSelectedContactId])
    const memoizedHandleUpdateContact = React.useCallback(handleUpdateContact, [handleUpdateContact])
    const memoizedHandleDeleteContact = React.useCallback(handleDeleteContact, [handleDeleteContact])
    const memoizedDisplayContactCard = React.useCallback(displayContactCard, [displayContactCard])
    const memoizedGetPriorityTextAndColor = React.useCallback(getPriorityTextAndColor, [getPriorityTextAndColor])


    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Contact>('businessName');
    const [selected, setSelected] = React.useState<readonly number[]>([]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Contact,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const visibleRows = React.useMemo(
        () => stableSort(contacts, getComparator(order, orderBy)),
        [order, orderBy, contacts],
    );


    return (
        <Paper sx={{
            width: '100%',
        }} elevation={3} >
            <TableContainer
                sx={{ maxHeight: "calc(100vh - 200px)" }}
            >

                {/* <Table stickyHeader> */}
                <Table>
                    <SortableTableHeader
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        <FixedSizeList
                            height={document.documentElement.clientHeight * 0.5}
                            width='100%'
                            itemCount={visibleRows.length}
                            itemSize={5}
                        >
                            {({ index, style }) => {
                                const row = visibleRows[index];
                                // ContactRow mémoïsé + fonctions Callback
                                return <ContactRow
                                    key={row.id}
                                    contact={row}
                                    currentUserId={currentUserId}
                                    handleUpdateContact={memoizedHandleUpdateContact}
                                    handleDeleteContact={memoizedHandleDeleteContact}
                                    displayContactCard={memoizedDisplayContactCard}
                                    getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                                />
                            }}
                        </FixedSizeList>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

// Pour que le tableau ne se recharche pas à chaque changement d'onglet (que s'il y a un changement)
export default React.memo(ContactsTable)