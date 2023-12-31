// Utilisation de FixedSizeList de react-window mais je n'arrive pas à gérer avec le header et de toute façon je vois que toutes les lignes se rerender à chaque scroll !

import * as React from 'react';

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


import { StyledTableCell } from '../utils/StyledComponents';
import { Box, FormControl, ListItem, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import ContactRow from './ContactRow';

//import 'react-virtualized/styles.css';


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
    // selectedContactId: string,
    // setSelectedContactId: (id: string) => void
    handleUpdateContact: (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => void 
    handleDeleteContact: (id: string) => void
    displayContactCard: (contact: Contact) => void
    getPriorityTextAndColor: (priority: number | null) => { text: string, color: string }
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




    const keys = contacts && Object.keys(contacts[0]);


    // Comme ROW est un objet => il change à chaque Rerender, donc on fait ça... Mais va être utilisé dans une boucle mais impossible d'utiliser les Hook dans une boucle donc je le mets en dehors
    const renderRow = React.useCallback((row: Contact) => {
        return (
            <ContactRowMemo
                key={row.id}
                contact={row}
                currentUserId={currentUserId}
                // selectedContactId={selectedContactId}
                // setSelectedContactId={setSelectedContactId}
                handleUpdateContact={memoizedHandleUpdateContact}
                handleDeleteContact={memoizedHandleDeleteContact}
                displayContactCard={memoizedDisplayContactCard}
                getPriorityTextAndColor={memoizedGetPriorityTextAndColor}
            />
        );
    }, [currentUserId, 
        //selectedContactId, setSelectedContactId, 
        memoizedHandleUpdateContact, memoizedHandleDeleteContact, memoizedDisplayContactCard, memoizedGetPriorityTextAndColor]);


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
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        //onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                    //rowCount={rows.length}
                    />
                    <FixedSizeList
                        height={document.documentElement.clientHeight * 0.3} // ou la hauteur de votre conteneur
                        width='100%'
                        itemCount={visibleRows.length}
                        itemSize={5}
                    >
                        {({ index, style }) => {
                            const row = visibleRows[index];
                            return renderRow(row)

                                // <ContactRow
                                //     //style={style}
                                //     key={row.id}
                                //     contact={row}
                                //     currentUserId={currentUserId}
                                //     selectedContactId={selectedContactId}
                                //     setSelectedContact={setSelectedContact}
                                //     handleUpdateContact={handleUpdateContact}
                                //     handleDeleteContact={() => handleDeleteContact(row.id)}
                                //     displayContactCard={displayContactCard}
                                //     getPriorityTextAndColor={getPriorityTextAndColor}
                                // />
                        }}
                    </FixedSizeList>








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
// Vraiment besoin maintenant qu'on a mémoisé els ROWs ???????
export default ContactsTable