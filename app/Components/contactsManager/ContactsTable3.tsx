// Test avec VirtualTable qui utilise FixedSizeList (react-window) => mieux car ne rerender pas tout, mais pas fluide, le header ne reste pas en haut 
// Je ne peux pas utiliser memo pour les ContactRow car FixedSizeList est rerender à chaque défilement car la props style change (utilisée pour positionner les éléments dans la liste et change donc à chaque défilement)

import * as React from 'react';
// Si beaucoup de contacts => très long à charger !!! Donc j'utilise la virtualisation avec react-window => pnpm install react-window
// Aussi intaller les types de définitions pour TS ! (sinon erreur: Le fichier de déclaration du module 'react-window' est introuvable.) => pnpm install @types/react-window
// Ensuite on importe et on utilise FixedSizeList à la place de Table
import { FixedSizeList, FixedSizeListProps } from 'react-window';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
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
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { StyledTableCell } from '../../utils/StyledComponents';
import { Box, } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import {getUserContactsFromDatabase} from '../../utils/firebase'
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
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler =
        (property: keyof Contact) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };
    return (
        // On bloque le header et le positionne en premier plan (sinon tBody passe par dessus quand on scroll)
        <TableHead style={{ position: 'sticky', top: 0, zIndex: 99 }}>
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


// Pour améliorer les performances car très long ! => On utilise la virtualisation avec React Window
/** Context for cross component communication */
const VirtualTableContext = React.createContext<{
    top: number
    setTop: (top: number) => void
    header: React.ReactNode
    footer: React.ReactNode
}>({
    top: 0,
    setTop: (value: number) => { },
    header: <></>,
    footer: <></>,
})
/**
 * The Inner component of the virtual list. This is the "Magic".
 * Capture what would have been the top elements position and apply it to the table.
 * Other than that, render an optional header and footer.
 **/
const Inner = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
    function Inner({ children, ...rest }, ref) {
        const { header, footer, top } = React.useContext(VirtualTableContext)
        return (
            <div {...rest} ref={ref}>
                <table style={{ top, position: 'absolute', width: '100%', }}>
                    {header}
                    <tbody>{children}</tbody>
                    {footer}
                </table>
            </div>
        )
    }
)
/** The virtual table. It basically accepts all of the same params as the original FixedSizeList.*/
function VirtualTable({
    row,
    header,
    footer,
    ...rest
}: {
    header?: React.ReactNode
    footer?: React.ReactNode
    row: FixedSizeListProps['children']
} & Omit<FixedSizeListProps, 'children' | 'innerElementType'>) {
    const listRef = React.useRef<FixedSizeList | null>()
    const [top, setTop] = React.useState(0)

    return (
        <VirtualTableContext.Provider value={{ top, setTop, header, footer }}>
            <FixedSizeList
                {...rest}
                innerElementType={Inner}
                onItemsRendered={props => {
                    const style =
                        listRef.current &&
                        // @ts-ignore private method access
                        listRef.current._getItemStyle(props.overscanStartIndex)
                    setTop((style && style.top) || 0)

                    // Call the original callback
                    rest.onItemsRendered && rest.onItemsRendered(props)
                }}
                ref={el => (listRef.current = el)}
            >
                {row}
            </FixedSizeList>
        </VirtualTableContext.Provider>
    )
}
/** The Row component. This should be a table row, and noted that we don't use the style that regular `react-window` examples pass in.*/
function Row({ index }: { index: number }) {
    return (
        <tr>
            {/** Make sure your table rows are the same height as what you passed into the list... */}
            <td style={{ height: '36px' }}>Row {index}</td>
            <td>Col 2</td>
            <td>Col 3</td>
            <td>Col 4</td>
        </tr>
    )
}


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

    // useCallback ne devrait pas être utilisé pour mémoriser les fonctions de mise à jour de l'état, car ces fonctions ne changent pas entre les rendus. Vous pouvez simplement passer les fonctions de mise à jour de l'état directement à vos composants.
    //const memoizedSetSelectedContactId = React.useCallback(setSelectedContactId, [setSelectedContactId])
    const memoizedHandleUpdateContact = React.useCallback(handleUpdateContact, [handleUpdateContact])
    const memoizedHandleDeleteContact = React.useCallback(handleDeleteContact, [handleDeleteContact])
    //const memoizedDisplayContactCard = React.useCallback(displayContactCard, [displayContactCard])
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

    const visibleRows: Contact[] = React.useMemo(
        () => stableSort(contacts, getComparator(order, orderBy)),
        [order, orderBy, contacts],
    );



    return (
        <Paper sx={{
            width: '100%',
        }} elevation={3} >
            <TableContainer >
                <VirtualTable
                    height={window.innerHeight - 195}
                    width="100%"
                    itemCount={visibleRows.length}
                    itemSize={100}
                    header={
                        <SortableTableHeader
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                    }
                    //row={Row}

                    row={({ index, style }) => {
                        const rowData = visibleRows[index];
                        return (
                            // ContactRow mémoïsé + fonctions Callback
                            <ContactRow
                                key={rowData.id}
                                contact={rowData}
                                currentUserId={currentUserId}
                                handleUpdateContact={memoizedHandleUpdateContact}
                                handleDeleteContact={memoizedHandleDeleteContact}
                                //displayContactCard={memoizedDisplayContactCard}
                                getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                            />
                        )
                    }}
                />
            </TableContainer>
        </Paper>
    );
}

// Pour que le tableau ne se recharche pas à chaque changement d'onglet (que s'il y a un changement)
export default React.memo(ContactsTable)