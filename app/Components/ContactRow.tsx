import React from 'react'
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import {StyledTableRow, StyledTableCell} from './StyledComponents';

type ContactRowProps = {
    contact: Contact
    selectedContactId: string,
    setSelectedContact: (contact: Contact) => void       // (contact: Contact) => () => void    =>    (autre proposition copilot)   ???
   // handleUpdateContact: (contact: Contact) => void
}




export default function ContactRow({contact, selectedContactId,  setSelectedContact
    //handleUpdateContact,
} : ContactRowProps) {

    const handleChangeHasBeenCalledCheckbox = (contact: Contact) => {
        //handleUpdateContact(contact)

        //setContacts(sortArrayBy(updatedMovies, orderedBy))
        //setSelectedContact({...contact, hasBeenCalled: !contact.hasBeenCalled})
    }

    return (
        <StyledTableRow hover key={contact.id}         
            //sx={{ '&:last-child td, &:last-child th': { border: 0 } }}        // ???
            color='primary.main'
            selected= {selectedContactId === contact.id ? true : false}
            //className={selectedContactId === contact.id ? 'selected bg-cyan-400 ' : 'bg-yellow-200'}
            onClick={() => setSelectedContact(contact)}
        >
            {/* <p>{contact.id}</p> */}
            <StyledTableCell component="th" scope="row"
                //</StyledTableRow>onClick={() => setSelectedContact(contact)} 
                 ><ModeEditOutlineOutlinedIcon /></StyledTableCell>
            <StyledTableCell component="th" scope="row">{contact.businessName}</StyledTableCell>
            <StyledTableCell align="right">{contact.businessPhone}</StyledTableCell>
            <StyledTableCell align="right">{contact.contactName}</StyledTableCell>
            <StyledTableCell align="right">{contact.contactEmail}</StyledTableCell>
            <StyledTableCell align="right">
                <Checkbox checked={contact.hasBeenCalled}
                    onChange={(e) => console.log(e)}               //{handleChangeHasBeenCalledCheckbox(contact)}
                    inputProps={{ 'aria-label': 'controlled' }} />
                {/* {contact.hasBeenCalled} */}
            </StyledTableCell>
            <StyledTableCell align="right">
                <Checkbox checked={contact.hasBeenSentEmail}
                    //onChange={handleChange} 
                    inputProps={{ 'aria-label': 'controlled' }} />
            </StyledTableCell>
            <StyledTableCell align="right">
                <Checkbox checked={contact.hasReceivedEmail}
                    //onChange={handleChange} 
                    inputProps={{ 'aria-label': 'controlled' }} />
            </StyledTableCell>
            <StyledTableCell align="right">{contact.dateOfNextCall.toLocaleDateString()} {contact.dateOfNextCall.getHours().toString().padStart(2, '0')}:{contact.dateOfNextCall.getMinutes()}</StyledTableCell>
            <StyledTableCell align="right">{contact.comments}</StyledTableCell>
            <StyledTableCell align="right">{contact.fileSent}</StyledTableCell>
            <StyledTableCell align="right">{contact.interestGauge}</StyledTableCell>
        </StyledTableRow>
    )
}
