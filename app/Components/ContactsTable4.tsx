import * as React from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
// Si beaucoup de contacts => très long à charger !!! Donc j'utilise la virtualisation avec react-window => pnpm install react-window
// Aussi intaller les types de définitions pour TS ! (sinon erreur: Le fichier de déclaration du module 'react-window' est introuvable.) => pnpm install @types/react-window
// Ensuite on importe et on utilise List à la place de Table

import { FixedSizeList, FixedSizeListProps } from 'react-window';


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
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

import Checkbox from '@mui/material/Checkbox';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
// Pour le DATE PICKER => npm install @mui/x-date-pickers
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { pink } from '@mui/material/colors';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Popover from '@mui/material/Popover';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import StarUnchecked from '@mui/icons-material/StarOutline';
import StarCheckedFilled from '@mui/icons-material/Star';

// ??? GaugeChart => npm install react-gauge-chart + dependency : npm i d3 (marche pas !!!)
import Container from '@mui/material/Container';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import TextsmsTwoToneIcon from '@mui/icons-material/TextsmsTwoTone';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Image from 'next/image'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearIcon from '@mui/icons-material/Clear';
import Modal from '@mui/material/Modal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CallIcon from '@mui/icons-material/Call';
import Switch from '@mui/material/Switch';
import HandshakeIcon from '@mui/icons-material/Handshake';
import Avatar from '@mui/material/Avatar';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { InputLabel,  } from '@mui/material'
import  { SelectChangeEvent } from '@mui/material/Select';
import { grey } from '@mui/material/colors';

import { contactTypes } from '../utils/toolbox'
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { StyledTableRow } from '../utils/StyledComponents';

import Rating, { IconContainerProps } from '@mui/material/Rating';
import SettingsIcon from '@mui/icons-material/Settings';

import { timeStamp } from 'console';

import { timeStampObjToTimeStamp } from '../utils/toolbox';

import { storage, getCategoriesFromDatabase } from '../utils/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { handleOpenFile } from '../utils/firebase'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import {modalStyle, StyledRating, StyledRatingStars, customIcons, IconContainer} from '../utils/StyledComponents'
import { parse } from 'path';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import {isDatePassed, isDateSoon} from '../utils/toolbox'


import { StyledTableCell } from '../utils/StyledComponents';
import { Box, FormControl, ListItem, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import ContactRow from './ContactRow';
//const ContactRow = React.lazy(() => import('./ContactRow'));          // Pour utiliser LAZY mais pas bien ici car 9 sec pour charger la page + 10 sec pour charger tous les ROW, sinon 12 sec pour tout charger !

import { Column as ColumnVirtualized, Table as TableVirtualized, TableRowProps, TableCellProps } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once


const ContactRowMemo = React.memo(ContactRow)


interface Column {
    id: keyof Contact   // | "supprimer"
    label: string | JSX.Element
    width?: number
    minWidth?: number | string
    //align?: 'right'
    format?: (value: number) => string
}



const headCells: readonly Column[] = [               // readonly ???
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
        //align: 'right',
        //format: (value: number) => value.toLocaleString('en-US'),
    },
    { id: 'contactEmail', label: <MailIcon fontSize='large' />, minWidth: "10em", },
    { id: 'businessCity', label: 'Ville', minWidth: "10em", },
    { id: 'hasBeenCalled', label: <Box><CallRoundedIcon fontSize='large' /><QuestionMarkIcon /></Box>, minWidth: "5em", },
    {
        id: 'hasBeenSentEmailOrMeetUp', label:
            //'mail/rencontre ?',
            <Box><MailIcon /><HandshakeTwoToneIcon /><QuestionMarkIcon /></Box>, minWidth: "6em",
    },
    { id: 'comments', label: <CommentRoundedIcon fontSize='large' />, minWidth: "5em", },
    { id: 'interestGauge', label: <FavoriteRoundedIcon fontSize='large' />, minWidth: "5em", },
    { id: 'filesSent', label: <AttachFileRoundedIcon fontSize='large' />, minWidth: "10em", },
    { id: 'dateOfFirstCall', label: 'Premier appel', minWidth: "9em", },
    { id: 'dateOfLastCall', label: 'Dernier appel', minWidth: "9em", },
    { id: 'contactType', label: 'Type', minWidth: "7em", },
    // { id: 'supprimer', label: 'Supprimer ?', minWidth: "5em", },
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

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//     if (b[orderBy] < a[orderBy]) {
//         return -1;
//     }
//     if (b[orderBy] > a[orderBy]) {
//         return 1;
//     }
//     return 0;
// }

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
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you only support modern browsers you can replace stableSort(exampleArray, exampleComparator) with exampleArray.slice().sort(exampleComparator)
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
                        scope="col"
                        //align={headCell.numeric ? 'right' : 'left'}
                        //padding={headCell.disablePadding ? 'none' : 'normal'}
                        //align="center"
                        style={{
                            height: "40px",
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
                >
                    <Box>
                        <DeleteForeverRoundedIcon />
                        <QuestionMarkIcon />
                    </Box>
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
                <table style={{ top, position: 'absolute', width: '100%' }}>
                    {header}
                    <tbody>{children}</tbody>
                    {footer}
                </table>
            </div>
        )
    }
)







type ContactsTableProps = {
    contacts: Contact[],
    currentUserId: string,
    //selectedContact: Contact,
    // selectedContactId: string,
    // setSelectedContactId: (id: string) => void
    handleUpdateContact: (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => void   // obligé de mettre NULL pour la date ! (???)
    // handleUpdateContact: (updatingContact: Contact) => void
    handleDeleteContact: (id: string) => void
    displayContactCard: (contact: Contact) => void
    getPriorityTextAndColor: (priority: number | null) => { text: string, color: string }
    //setSelectedContactId: (id: string) => void
}
const ContactsTable = ({ contacts, currentUserId, 
    //selectedContactId, setSelectedContactId, 
    handleUpdateContact, handleDeleteContact, displayContactCard, getPriorityTextAndColor
}: ContactsTableProps) => {

    const [selectedContactId, setSelectedContactId] = React.useState("");


    // useCallback ne devrait pas être utilisé pour mémoriser les fonctions de mise à jour de l'état, car ces fonctions ne changent pas entre les rendus. Vous pouvez simplement passer les fonctions de mise à jour de l'état directement à vos composants.
    //const memoizedSetSelectedContactId = React.useCallback(setSelectedContactId, [setSelectedContactId])
    const memoizedHandleUpdateContact = React.useCallback(handleUpdateContact, [handleUpdateContact])
    const memoizedHandleDeleteContact = React.useCallback(handleDeleteContact, [handleDeleteContact])
    const memoizedDisplayContactCard = React.useCallback(displayContactCard, [displayContactCard])
    const memoizedGetPriorityTextAndColor = React.useCallback(getPriorityTextAndColor, [getPriorityTextAndColor])


    //console.log("CONTACT TABLE")
    console.log("CONTACT TABLE Contacts = ", contacts)

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Contact>('businessName');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    //const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    //const [rowsPerPage, setRowsPerPage] = React.useState(5);

    //console.log(alerts)

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Contact,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


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

    const list = [
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
        { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    ];

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


    // function rowRenderer({
    //     key, // Unique key within array of rows
    //     index // Index of row within collection
    // }: { key: number, index: number }) {
    //     return (
    //         <div
    //             key={key}
    //             className="ReactVirtualized__Table__row"
    //             role="row"
    //             style={{
    //                 height: "40px",
    //                 width: "800px",
    //                 overflow: "hidden",
    //                 paddingRight: "12px"
    //             }}
    //         >
    //             {
    //                 <>
    //                     <div
    //                         className="ReactVirtualized__Table__rowColumn"
    //                         role="gridcell"
    //                         style={{ overflow: "hidden", flex: "0 1 200px" }}
    //                     >
    //                         {list[index].name}
    //                     </div>
    //                     <div
    //                         className="ReactVirtualized__Table__rowColumn"
    //                         role="gridcell"
    //                         style={{ overflow: "hidden", flex: "0 1 300px" }}
    //                     >
    //                         {list[index].description}
    //                     </div>
    //                     <div
    //                         className="ReactVirtualized__Table__rowColumn"
    //                         role="gridcell"
    //                         style={{ overflow: "hidden", flex: "0 1 300px" }}
    //                     >
    //                         {list[index].coucou}
    //                     </div>
    //                 </>
    //             }
    //         </div>
    //     );
    // }

    function rowRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        style, // Style object to be applied to row (to position it)
        //parent // Reference to the parent List (instance)
    }: TableRowProps) {
        return (
            <ContactRow
                //style={style}
                key={key}
                //key={contacts[index].id}
                contact={contacts[index]}
                currentUserId={currentUserId}
                // selectedContactId={selectedContactId}
                // setSelectedContactId={setSelectedContactId}
                handleUpdateContact={handleUpdateContact}
                handleDeleteContact={handleDeleteContact}
                displayContactCard={displayContactCard}
                getPriorityTextAndColor={getPriorityTextAndColor}
            />
        );
    }


    


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
            //console.log("value = ", cellData)
            setInputValue(cellData);
        }, [cellData]);

        return <TextField
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            //onBlur={() => onBlur(inputValue)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            //style={{backgroundColor: 'yellow'}}
            style={isEditing ? { backgroundColor: 'yellow' } : {}}

            //onChange={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e.target.value)}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeText(e, 'businessName')}
            //onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleUpdateContact(contactId, { key: 'businessName', value: event.target.value })}

            InputProps={{
                //contacts[rowIndex].isClient
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
        // On peut récupérer cellData (la données qui correspond à dataKay de Column) ou rowData (tout le contact)
        const contact = contacts[rowIndex];

        // const handleOnBlur = (newValue: string) => {
        //     handleUpdateContact(contacts[rowIndex].id, { key: 'businessName', value: newValue })
        // };

        return (
            <MemoizedNameTextField
                cellData={cellData}
                // cellData={row.businessName}
                onBlur={(newValue: string) => handleUpdateContact(contacts[rowIndex].id, { key: 'businessName', value: newValue })}
                isClient={rowData.isClient}
                priority={rowData.priority}
                contactId={rowData.id}
            />
        );
    };

    
    const [categoriesList, setCategoriesList] = React.useState<ContactCategorieType[] | null>(null);

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
                    //overflow: 'auto',
                    //maxHeight: "50vh",
                }}
                >{cat.label}</MenuItem>
            ))}
        </Select>}
    </FormControl>
    });
    MemoizedCat.displayName = 'MemoizedCat';   

    const cellRendererCat = ({ cellData, rowIndex, rowData }: TableCellProps) => {
        // On peut récupérer cellData (la données qui correspond à dataKey de Column) ou rowData (tout le contact)
        const contact = contacts[rowIndex];
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
        // On peut récupérer cellData (la données qui correspond à dataKey de Column) ou rowData (tout le contact)
        const contact = contacts[rowIndex];
        return (
            <MemoizedIsClientSwitch
                cellData={cellData}
                contactId={rowData.id}
            />
        );
    };

    // const cellRendererContact = ({ cellData, rowIndex }: TableCellProps) => {
    //     const contact = contacts[rowIndex];

    //     return (
    //         <MemoizedTextFieldContact
    //             cellData={cellData}
    //             onBlur={handleOnBlur}
    //             position={contact.contactPosition}
    //             director={contact.directorName}
    //         />
    //     );
    // };








    const cellsRendernerData = [
        {
            label: 'Nom',
            dataKey: 'businessName',
            width: 300,
            cellRenderer: cellRendererName,
        },
        // {
        //     label: 'Type',
        //     dataKey: 'contactType',
        //     width: 300,
        //     cellRenderer: cellRendererType,
        // },        
    ]
    

    



    const handleOnChange = (newValue: string) => {        
        //handleUpdateContact(contacts[0].id, { key: 'businessName', value: newValue })
    };
  
  
   
    const keys = contacts && Object.keys(contacts[0]);


    return (
        <Paper sx={{
            width: '100%',
        }} elevation={3} >         

            {/* <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} />
            </div> */}

            {/* <Typography variant="h5" component="div" sx={{ p: 2 }}>Liste des contacts ({contacts.length})</Typography> */}
            <TableContainer
                //sx={{ maxHeight: document.documentElement.clientHeight * 0.88 }}   //vh = 1% de la hauteur du viewport (la zone d'affichage).// Ok mais problème avec Vercel !!!
                //   sx={{ maxHeight: "calc(100vh - 175px)" }}

                sx={{ maxHeight: "calc(100vh - 200px)" }}
            >
                {/* Utilisation de lazy et Suspense mais pas très bien !!! => car 9 sec pour charger la page + 10 sec pour charger tous les ROW, sinon 12 sec pour tout charger ! S'utilise plutôt pour les composant qu'on n'a pas besoin de voir tout de suite. */}
                {/* React.Suspense => obligé de le mettre en dehors du tableau sinon erreur */}
                {/* <React.Suspense fallback={<div>Loading...</div>}> */}

                {/* <Table stickyHeader> */}
                <TableVirtualized
                    width={1300}    //{1800}
                    height={200}
                    headerHeight={40}
                    rowHeight={40}
                    rowCount={contacts.length}
                    rowGetter={({ index }) => contacts[index]}
                //rowRenderer={rowRenderer}
                >
                    {/* {headCells.map((column, index) => (
                        <ColumnVirtualized
                            key={index}
                            label={column.label}
                            dataKey={column.id}
                            width={100}       //{column.width ? column.width : 100}
                            cellRenderer={cellRenderer}
                        />
                    ))} */}

                    {/* {keys.map(key => (
                        <ColumnVirtualized
                            key={key}
                            label={key}
                            dataKey={key}
                            width={300}
                            cellRenderer={cellRendererXXX}
                        />
                    ))} */}


   
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
                    
                </TableVirtualized>



                {/* <TableVirtualized
                        width={2000}
                        height={600}
                        headerHeight={50}
                        rowHeight={80}
                        rowCount={visibleRows.length}
                        rowGetter={({ index }) => visibleRows[index]}
                        rowRenderer={({ key, index, style }) => {
                        // Récupérez les données pour cette ligne
                        const row: Contact = visibleRows[index];

                        return (
                            // un tableau
                            <TableBody>
                                <tr key={key} style={style}>
                                    <td>{row.businessName}</td>
                                    <td>{row.contactType}</td>
                                </tr> 
                            </TableBody> 

                            // <ContactRowMemo
                            //         key={row.id}
                            //         contact={row}
                            //         currentUserId={currentUserId}
                            //         selectedContactId={selectedContactId}
                            //         setSelectedContact={memoizedSetSelectedContact}
                            //         handleUpdateContact={memoizedHandleUpdateContact}
                            //         handleDeleteContact={memoizedHandleDeleteContact}
                            //         displayContactCard={memoizedDisplayContactCard}
                            //         getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
                            //     />
                        );
                      }}
                > */}
                {/* {headCells.map((column, index) => (
                        <ColumnVirtualized
                            key={index}
                            label={column.label}
                            dataKey={column.id}
                            width={column.width ? column.width : 100}
                        />
                    ))} */}
                {/* <ColumnVirtualized
                        label='Name'
                        dataKey='businessName'
                        width={100}
                    />
                    <ColumnVirtualized
                        width={200}
                        label='Type'
                        dataKey='contactType'
                    />
                    </TableVirtualized> */}




                {/* <VirtualTable
                        height={300}
                        width="100%"
                        itemCount={visibleRows.length}
                        itemSize={100}
                        header={
                            // <EnhancedTableHead
                            //     numSelected={selected.length}
                            //     order={order}
                            //     orderBy={orderBy}
                            //     //onSelectAllClick={handleSelectAllClick}
                            //     onRequestSort={handleRequestSort}
                            // //rowCount={rows.length}
                            // />

                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>Header 2</th>
                                    <th>Header 3</th>
                                    <th>Header 4</th>
                                </tr>
                            </thead>
                        }


                        row={Row}

                    // row={({ index, style }) => {
                    //     const rowData = visibleRows[index];
                    //     return (
                    //         //<div>{rowData.businessName}</div>;
                    //         <ContactRow
                    //             //style={style}     // ???
                    //             key={rowData.id}
                    //             contact={rowData}
                    //             currentUserId={currentUserId}
                    //             selectedContactId={selectedContactId}
                    //             setSelectedContact={setSelectedContact}
                    //             handleUpdateContact={handleUpdateContact}
                    //             handleDeleteContact={() => handleDeleteContact(rowData.id)}
                    //             displayContactCard={displayContactCard}
                    //             getPriorityTextAndColor={getPriorityTextAndColor}
                    //         //setContacts={setContacts}
                    //         />)
                    // }}



                        // row={({ index, style }) => {  // Utilisez une fonction pour générer chaque ligne
                        //     const item = visibleRows[index];  // Accédez à l'objet correspondant dans le tableau
                        //     console.log("item = ", item)
                        //     return (
                        //         <ContactRow
                        //             //style={style}     // ???
                        //             key={item.id}
                        //             contact={item}
                        //             currentUserId={currentUserId}
                        //             selectedContactId={selectedContactId}
                        //             setSelectedContact={setSelectedContact}
                        //             handleUpdateContact={handleUpdateContact}
                        //             handleDeleteContact={() => handleDeleteContact(item.id)}
                        //             displayContactCard={displayContactCard}
                        //             getPriorityTextAndColor={getPriorityTextAndColor}
                        //         //setContacts={setContacts}
                        //         />
                        //     );
                        // }}

                        footer={
                            <tfoot>
                                <tr>
                                    <td>Footer 1</td>
                                    <td>Footer 2</td>
                                    <td>Footer 3</td>
                                    <td>Footer 4</td>
                                </tr>
                            </tfoot>
                        }
                    /> */}





                {/* <FixedSizeList
                        height={document.documentElement.clientHeight * 0.88} // ou la hauteur de votre conteneur
                        itemCount={visibleRows.length}
                        itemSize={5}
                        width='100%'
                    >
                        {({ index, style }) => {
                            const row = visibleRows[index];
                            return (
                                <ContactRow
                                    style={style}
                                    key={row.id}
                                    contact={row}
                                    currentUserId={currentUserId}
                                    selectedContactId={selectedContactId}
                                    setSelectedContact={setSelectedContact}
                                    handleUpdateContact={handleUpdateContact}
                                    handleDeleteContact={() => handleDeleteContact(row.id)}
                                    displayContactCard={displayContactCard}
                                    getPriorityTextAndColor={getPriorityTextAndColor}
                                />
                            );
                        }}
                    </FixedSizeList> */}








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
                    </TableHead> */}


                {/* ///// Ok ///////// */}


                {/* <Table stickyHeader>
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        //onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                    //rowCount={rows.length}
                    />
                    <TableBody>
                        {visibleRows.map((row, index) => {
                            //const isItemSelected = isSelected(row.id);
                            //const labelId = `enhanced-table-checkbox-${index}`;
                            //console.log(row)

                            return (
                                <ContactRow
                                    key={row.id}
                                    contact={row}
                                    currentUserId={currentUserId}
                                    selectedContactId={selectedContactId}
                                    setSelectedContact={setSelectedContact}
                                    handleUpdateContact={handleUpdateContact}
                                    handleDeleteContact={handleDeleteContact}
                                    displayContactCard={displayContactCard}
                                    getPriorityTextAndColor={getPriorityTextAndColor}
                                //setContacts={setContacts}
                                />
                            );
                        })}
                    </TableBody>
                    </Table> */}




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
                {/* </Table> */}
                {/* </React.Suspense> */}
            </TableContainer>
        </Paper>
    );
}

// Pour que le tableau ne se recharche pas à chaque changement d'onglet (que s'il y a un changement)
// export default React.memo(ContactsTable)
// Vraiment besoin maintenant qu'on a mémoisé les ROWs ???????
export default ContactsTable