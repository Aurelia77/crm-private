'use client'

import React from 'react'

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import Edit from '@mui/icons-material/Edit';
import LocationOn from '@mui/icons-material/LocationOn';
import { grey } from '@mui/material/colors';
import Image from 'next/image'

type ContactCardProps = {
    contact: Contact ; //| {} ;     // Pourtant dans ContactEditForm.tsx, j'ai bien mis la condition "Object.entries(infosContact).length > 0" donc ne doit JAMAIS passer d'objet VIDE !!! Mais je suis obligé ici de gérer le cas où contact est un objet vide. Comment faire autrement ???
}

export default function ContactCard({ contact }: ContactCardProps) {

    const findLabelNafCodes = (code: string) => {
        const codesNaf = require('../nafCodes.json');       // donc codesNaf = à ce qu'on a dans nafCodes.json => un tableau d'objets
        const naf: CodeNaf = codesNaf.find((codeAndLabel: CodeNaf) => codeAndLabel.id === code);

        //naf && console.log("----------", naf.id)
        //naf && console.log(naf.label)

        return naf ? naf.label : ''
    }

    return (
        //JSON.stringify(contact) === '{}' ? <div></div> :
        <Card key={contact.id}
        //className=' my-2'
        //sx={{ my: 2 }}        // my = 0.5rem (donc 1/2 taille de la police de la racine (em pour l'élément))
        >
            <Box sx={{ p: 2, display: 'flex' }} >
                {/* <img src={contact.logo} alt="" /> */}
                {/* Invalid src prop (https://www.pierreetvacances.com/medias/sys_master/images/images/hf1/hf7/8805202177566.jpg) on `next/image`, hostname "www.pierreetvacances.com" is not configured under images in your `next.config.js` */}
                <Image
                    alt="Random image"
                    src={contact.logo}
                    width={50}
                    height={50}
                    style={{
                        //maxWidth: '100%',
                        //height: '200px',
                        objectFit: 'cover',
                    }}
                />
                <Avatar variant="rounded" src="avatar1.jpg" />
                <Stack spacing={0.5}>
                    <Typography fontWeight={700}>{contact.businessName}</Typography>
                    <Typography fontWeight={700}>{contact.businessCity}</Typography>
                    {/* <Typography fontWeight={700}>{contact.activity}</Typography> */}
                    <Typography fontWeight={700}>{findLabelNafCodes(contact.businessActivity)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        <LocationOn sx={{ color: grey[500] }} />{contact.businessAddress}
                    </Typography>
                </Stack>
                <IconButton>
                    <Edit sx={{ fontSize: 14 }} />
                </IconButton>
            </Box>
            <Divider />
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 2, py: 1, bgcolor: 'background.default' }}
            >
                <Chip></Chip>
                <Switch />
            </Stack>
        </Card>
    )
}
