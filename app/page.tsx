'use client'  // pour utiliser STYLE dans le BOUTON

import * as React from 'react';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';

const PurpleButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}));

export default function Home() {
  return (
      <Stack spacing={2} direction="row" justifyContent="center" className=' mt-28' mt={20} >
        <PurpleButton 
          variant="contained"
          href= '/contacts'>
          Contacts
        </PurpleButton>
        <Button variant="contained" href= '/'>CRM</Button>
        <Button variant="contained" color="secondary"  href= '/testPages/testUseEffectPage' >Test Page</Button>
        <Button variant="contained" color="ochre" href= '/testPages/testAutocompletePage'>Autocomplete</Button> 
        <Button variant="contained" color="primary" href= '/testPages/TestFetchx2'>TestFetchx2</Button> 
      </Stack>      
  )
}
