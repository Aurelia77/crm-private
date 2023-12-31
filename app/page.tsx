'use client'  // pour utiliser STYLE dans le BOUTON

import * as React from 'react';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';


const PurpleButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}));

export default function Home() {
  // const muiTheme = useTheme();
  // console.log("muiTheme", muiTheme)

  return (
    // <div>     
    //    <input type='button' value='Contacts' onClick={() => {window.location.href = '/contacts'}} />
    //    <Button variant="contained" href= '/'>CRM</Button>
    // </div>
      <Stack spacing={2} direction="row" justifyContent="center" marginTop={20} >     
        {/* <Button variant="contained" href= '/contacts'>Contacts</Button> */}
        <PurpleButton 
          variant="contained"
          href= '/contacts'>
          Contacts
        </PurpleButton>
        {/* <Button variant="contained" href= '/calendar'>Calendrier</Button> */}
        <Button variant="contained" color="secondary"  href= '/testPages/testUseEffectPage' >Test Page</Button>
        <Button variant="contained" color="ochre" href= '/testPages/testAutocompletePage'>Autocomplete</Button> 
        <Button variant="contained" color="primary" href= '/testPages/testTableSortLabel'>TestTableSortLabel OK</Button>
        <PurpleButton variant="contained" href= '/testPages/testFuncAsyncAndReRender'>Test ASYNC and RERENDER !</PurpleButton>
        <Button variant="contained" color="secondary" href= '/testPages/TestVirtualizedWithReactWindowsPage'>Test Virtualized with React Windows</Button>
        <Button variant="contained" color="success" href= '/testPages/TestVirtualization2'>Test Virtualization 2</Button>
      </Stack>      
  )
}
