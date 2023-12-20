import * as React from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
// Si beauocup de contacts => très long à charger !!! Donc j'utilise la virtualisation avec react-window => pnpm install react-window
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


import { StyledTableCell } from '../utils/StyledComponents';
import { Box, ListItem, Typography } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import ContactRow from './ContactRow';
//const ContactRow = React.lazy(() => import('./ContactRow'));          // Pour utiliser LAZY mais pas bien ici car 9 sec pour charger la page + 10 sec pour charger tous les ROW, sinon 12 sec pour tout charger !


interface Column {
    id: keyof Contact   // | "supprimer"
    label: string | JSX.Element
    minWidth?: number | string
    //align?: 'right'
    format?: (value: number) => string
}



const headCells: readonly Column[] = [               // readonly ???
    { id: 'isClient', label: <HandshakeOutlinedIcon />, minWidth: "2em", },
    { id: 'businessCategoryId', label: 'Catégorie', minWidth: "8em", },
    {
        id: 'dateOfNextCall', label: <Box sx={{ display: 'flex', alignItems: 'center', }}
        ><AccessAlarmRoundedIcon fontSize='large' sx={{ marginRight: "20px" }} />Relance</Box>, minWidth: "9em",
    },
    { id: 'logo', label: 'Logo', minWidth: "4em", },
    { id: 'businessName', label: 'Nom', minWidth: "10em", },
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
    selectedContactId: string,
    setSelectedContact: (contact: Contact) => void
    handleUpdateContact: (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => void   // obligé de mettre NULL pour la date ! (???)
    // handleUpdateContact: (updatingContact: Contact) => void
    handleDeleteContact: (id: string) => void
    diplayContactCard: (contact: Contact) => void
    getPriorityTextAndColor: (priority: number | null) => { text: string, color: string }
    //setSelectedContactId: (id: string) => void
}
const ContactsTable = ({ contacts, currentUserId, selectedContactId, setSelectedContact, handleUpdateContact, handleDeleteContact, diplayContactCard, getPriorityTextAndColor
}: ContactsTableProps) => {

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
                {/* Utilisation de lazy et Suspense mais pas très bien !!! => car 9 sec pour charger la page + 10 sec pour charger tous les ROW, sinon 12 sec pour tout charger ! */}
                {/* React.Suspense => obligé de le mettre en dehors du tableau sinon erreur */}
                {/* <React.Suspense fallback={<div>Loading...</div>}> */}
                {/* <Table stickyHeader> */}
                    <VirtualTable
                        height={600}
                        width="100%"
                        itemCount={visibleRows.length}
                        itemSize={100}
                        header={ 
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                //onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                            //rowCount={rows.length}
                            />  
                            // <thead>
                            //     <tr>
                            //         <th>Index</th>
                            //         <th>Header 2</th>
                            //         <th>Header 3</th>
                            //         <th>Header 4</th>
                            //     </tr>
                            // </thead>
                        }                        
                                                   
                        
                        //row={Row}
                        
                        row={({ index, style }) => {
                            const rowData = visibleRows[index];
                            return (
                            //<div>{rowData.businessName}</div>;
                            <ContactRow
                                    //style={style}     // ???
                                    key={rowData.id}
                                    contact={rowData}
                                    currentUserId={currentUserId}
                                    selectedContactId={selectedContactId}
                                    setSelectedContact={setSelectedContact}
                                    handleUpdateContact={handleUpdateContact}
                                    handleDeleteContact={() => handleDeleteContact(rowData.id)}
                                    diplayContactCard={diplayContactCard}
                                    getPriorityTextAndColor={getPriorityTextAndColor}
                                //setContacts={setContacts} 
                                />)
                          }}


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
                        //             diplayContactCard={diplayContactCard}
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
                    />

                    {/* <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        //onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                    //rowCount={rows.length}
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
                                    diplayContactCard={diplayContactCard}
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
                    </TableHead>     */}

                 

                    {/* <TableBody>
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
                                        handleDeleteContact={() => handleDeleteContact(row.id)}
                                        diplayContactCard={diplayContactCard}
                                        getPriorityTextAndColor={getPriorityTextAndColor}
                                    //setContacts={setContacts} 
                                    />
                                );
                            })}
                        </TableBody> */}




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

export default React.memo(ContactsTable)