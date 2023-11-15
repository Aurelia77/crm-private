import React from 'react'
import { FormControl, FormHelperText, Input, InputLabel, TextField, Typography } from '@mui/material'

export default function FilterContacts({ onTextChange }: { onTextChange: (text: string) => void }) {

    const handleChange = (text: any) => {
        onTextChange(text.target.value)     // on remonte la val au niveau suppérieur
    }

    return (
        <FormControl>
            <Typography variant="h6" gutterBottom component="div">Recherche</Typography>
            <TextField id="standard-basic" label="Nom" onChange={handleChange} />
            {/* <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText> */}
        </FormControl>
    )
}