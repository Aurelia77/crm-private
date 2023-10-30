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


import {StyledTableCell} from './StyledComponents';
import ContactRow from './ContactRow';
import { Box, Typography } from '@mui/material';

// ???
interface Column {
  id: 'businessName' | 'contactPhone' | 'contactName' | 'contactEmail' | 'hasBeenCalled' | 'hasBeenSentEmail' | 'hasReceivedEmail' | 'dateOfNextCall' | 'comments' | 'fileSent' | 'interestGauge'
  label: string
  minWidth?: number
  //align?: 'right'
  format?: (value: number) => string
}

const columns : readonly Column[] = [               // ???
  { id: 'businessName', label: 'Entreprise'
  , minWidth: 170 
},
  { id: 'contactPhone', label: 'Téléphone'
  , minWidth: 100 
},
  { id: 'contactName', label: 'Contact (responsalbe/directeur)', 
  minWidth: 170,
    //align: 'right', 
    //format: (value: number) => value.toLocaleString('en-US'),
  },
  { id: 'contactEmail', label: 'Email', 
  minWidth: 170,
    //align: 'right', 
    //format: (value: number) => value.toLocaleString('en-US'),
  },
  { id: 'hasBeenCalled', label: 'Appel (prospection)', 
  //minWidth: 170,
    //align: 'right', 
    //format: (value: number) => value.toFixed(2),
  },
 { id: 'hasBeenSentEmail', label: 'Mail envoyé', 
 //minWidth: 170
 },
 { id: 'hasReceivedEmail', label: 'Mail reçu', 
 minWidth: 170 
},
 { id: 'dateOfNextCall', label: 'Relance (date)', 
 minWidth: 300 
},
 { id: 'comments', label: 'Commentaires', 
 minWidth: 270 
},
 { id: 'fileSent', label: 'Document(s) envoyé(s)', 
 minWidth: 270 
},
 { id: 'interestGauge', label: 'Intéressés', 
 minWidth: 170
 },
];

// interface Data {
//   name: string;
//   code: string;
//   population: number;
//   size: number;
//   density: number;
// }

// function createData(
//   name: string,
//   code: string,
//   population: number,
//   size: number,
// ): Data {
//   const density = population / size;
//   return { name, code, population, size, density };
// }

// const rows = [
//   createData('India', 'IN', 1324171354, 3287263),
//   createData('China', 'CN', 1403500365, 9596961),
//   createData('Italy', 'IT', 60483973, 301340),
//   createData('United States', 'US', 327167434, 9833520),
//   createData('Canada', 'CA', 37602103, 9984670),
//   createData('Australia', 'AU', 25475400, 7692024),
//   createData('Germany', 'DE', 83019200, 357578),
//   createData('Ireland', 'IE', 4857000, 70273),
//   createData('Mexico', 'MX', 126577691, 1972550),
//   createData('Japan', 'JP', 126317000, 377973),
//   createData('France', 'FR', 67022000, 640679),
//   createData('United Kingdom', 'GB', 67545757, 242495),
//   createData('Russia', 'RU', 146793744, 17098246),
//   createData('Nigeria', 'NG', 200962417, 923768),
//   createData('Brazil', 'BR', 210147125, 8515767),
// ];


type ContactsTableProps = { 
    contacts: Contact[] ,
    //selectedContact: Contact,
    selectedContactId: string,
    setSelectedContact: (contact: Contact) => void
    handleUpdateContact: (updatingContact: Contact) => void
    //setSelectedContactId: (id: string) => void
    //setContacts: (contacts: Contact[]) => void
}

export default function ContactsTable({ contacts, selectedContactId, setSelectedContact, handleUpdateContact,
    //setContacts
 }: ContactsTableProps) {

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

    

    return (
        <Paper sx={{ width: '100%', 
        //overflow: 'hidden' 
        }}
        elevation={3}
        >            
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
            <TableContainer 
                //sx={{ maxHeight: document.documentElement.clientHeight * 0.88 }}
                // max height = 100px
                sx={{ maxHeight: "calc(100vh - 100px)" }}
                     //"1200px" }}
                >
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        {/* <TableRow>
                            <StyledTableCell>Entreprise</StyledTableCell>
                            <StyledTableCell align="right">Téléphone</StyledTableCell>
                            <StyledTableCell align="right">Contact (responsalbe/directeur)</StyledTableCell>
                            <StyledTableCell align="right">Email</StyledTableCell>
                            <StyledTableCell align="right">Appel (prospection)</StyledTableCell>
                            <StyledTableCell align="right">Mail envoyé</StyledTableCell>
                            <StyledTableCell align="right">Mail reçu</StyledTableCell>
                            <StyledTableCell align="right">Relance (date)</StyledTableCell>
                            <StyledTableCell align="right">Commentaire</StyledTableCell>
                            <StyledTableCell align="right">Document envoyé</StyledTableCell>
                            <StyledTableCell align="right">Intéressés ?</StyledTableCell>
                        </TableRow> */}
                        <TableRow>
                            {columns.map((column) => (
                                <StyledTableCell
                                    key={column.id}
                                    align="center"
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>               
                    <TableBody>
                        {contacts && contacts.map((contact: Contact) => (
                            <ContactRow key={contact.id} 
                                contact={contact} 
                                selectedContactId={selectedContactId} 
                                setSelectedContact={setSelectedContact}
                                handleUpdateContact={handleUpdateContact} 
                                //setContacts={setContacts} 
                                />                 
                        ))}
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