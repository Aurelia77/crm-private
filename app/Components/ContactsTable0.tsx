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




import {StyledTableCell} from './StyledComponents';
import ContactRow from './ContactRow';
import { Box, Typography } from '@mui/material';
import { Timestamp } from 'firebase/firestore';


interface Column {
  id: 'logo' | 'businessName' | 'contactPhone' | 'contactName' | 'contactEmail' | 'hasBeenCalled' | 'hasBeenSentEmail' | 'hasReceivedEmail' | 'dateOfNextCall' | 'comments' | 'fileSent' | 'interestGauge' | 'supprimer'
  label: string
  minWidth?: number | string
  //align?: 'right'
  format?: (value: number) => string
}

const NB_COL = 12
const colWidth = 100 / (NB_COL + 2) + "vw"

const columns : readonly Column[] = [               // readonly ???
   
  { id: 'logo', label: '', minWidth: "5em",
},
  { id: 'businessName', label: 'Entreprise', minWidth: "15em",
},
  { id: 'contactPhone', label: 'Téléphone', minWidth: "15em",
},
  { id: 'contactName', label: 'Contact' // (responsalbe/directeur)'
  , minWidth: "15em",
    //align: 'right', 
    //format: (value: number) => value.toLocaleString('en-US'),
  },
  { id: 'contactEmail', label: 'Email', minWidth: "15em",
    //align: 'right', 
    //format: (value: number) => value.toLocaleString('en-US'),
  },
  { id: 'hasBeenCalled', label: 'Appel ?'// (prospection)'
  , minWidth: "5em",
    //align: 'right', 
    //format: (value: number) => value.toFixed(2),
  },
 { id: 'hasBeenSentEmail', label: 'Mail envoyé ?', minWidth: "5em",
 },
 { id: 'hasReceivedEmail', label: 'Mail reçu ?', minWidth: "5em",
},
 { id: 'dateOfNextCall', label: 'Relance (date)', minWidth: "18em",
},
 { id: 'comments', label: 'Commentaires', minWidth: "10em",
},
 { id: 'fileSent', label: 'Document(s) envoyé(s)', minWidth: "10em",
},
 { id: 'interestGauge', label: 'Intéressés', minWidth: "5em",
 },
 { id: 'supprimer', label: 'Supprimer ?', minWidth: "5em",
 },
];


type ContactsTableProps = { 
    contacts: Contact[] ,
    //selectedContact: Contact,
    selectedContactId: string,
    setSelectedContact: (contact: Contact) => void
    handleUpdateContact: (id: string, keyAndValue: {key: string, value: string | number | boolean | File[] | Timestamp | null   }) => void   // obligé de mettre NULL pour la date ! (???)
    // handleUpdateContact: (updatingContact: Contact) => void
    handleDeleteContact: (id: string) => void

    //setSelectedContactId: (id: string) => void
    //setContacts: (contacts: Contact[]) => void
}

export default function ContactsTable0({ contacts, selectedContactId, setSelectedContact, handleUpdateContact, handleDeleteContact
    //setContacts
 }: ContactsTableProps) {

    console.log("xxxContacts0 = ", contacts)

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

            <Typography variant="h5" component="div" sx={{ p: 2 }}>Liste des contacts ({contacts.length})</Typography>
            <TableContainer 
                //sx={{ maxHeight: document.documentElement.clientHeight * 0.88 }}   //vh = 1% de la hauteur du viewport (la zone d'affichage).// Ok mais problème avec Vercel !!!               
                sx={{ maxHeight:  "calc(100vh - 320px)" }} 
                // sx={{ maxHeight:  "calc(100vh - 185px)" }} 
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
                    </TableHead>               
                    <TableBody>
                        {contacts && contacts.map((contact: Contact) => (
                            <ContactRow key={contact.id}
                                contact={contact}
                                selectedContactId={selectedContactId}
                                setSelectedContact={setSelectedContact}
                                handleUpdateContact={handleUpdateContact}
                                handleDeleteContact={() => handleDeleteContact(contact.id)}
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