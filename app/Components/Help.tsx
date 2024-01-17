import { Paper, Typography } from '@mui/material'
import React from 'react'
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';


export default function Help() {
    return (
        <Paper elevation={5} sx={{ padding: "40px", marginTop: "30px", maxWidth: "1000px", mx: "auto" }} >
            <Typography variant='h3' component='h2' color='secondary' sx={{ textShadow: "1px 1px 2px blue", marginBottom: "25px" }} >Aide</Typography>
            <List sx={{ marginTop: "20px" }}>
                <ListItem>
                    <ListItemText primary="Dans cette aplication, vous pouvez créer et gérer des contacts :" />
                </ListItem>
                <ListItem>
                    <ListItemText primary={
                        <>
                            Dans l'onglet NOUVEAU CONTACT <PersonAddIcon color="primary" /> grâce à une recherche INSEE ou à partir de zéro.
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemText primary={
                        <Typography>
                            Dans l'onglet LISTE DES CONTACTS <Diversity3Icon color="primary" /> vous pouvez voir tous les contacts que vous avez créés et les modifier directement dans le tableau (sauf le logo et les fichiers) ou lors de la vue d'un contact, qui s'ouvre en cliquant sur son logo dans le tableau.
                        </Typography>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemText primary={
                        <>
                            Dans cette onglet vous pouvez aussi classer les contacts par titre de colonne (nom, date...) en cliquant dessus, et faire des recherches selon si les contacts sont des clients / prospects, leur catégorie, ville et type (dans la recherche, les propositions seront celles que contiennent vos contacts, par exemple si vous n'avez que des contacts de Paris et Marseille, dans ville(s) vous n'aurez que ces deux propositions).
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemText primary={
                        <>
                            Pour ajouter des catégories et des fichiers qui seront ensuite disponibles pour chaque contact, c'est dans l'onglet ADMIN <SettingsIcon color="primary" />.<br/>
                            Vous pouvez renommer les fichiers et catégories, et supprimer seulement les catégories.
                        </>
                    } />
                </ListItem>     
                <ListItem>
                    <ListItemText primary={
                        <>
                            Lors du clic sur le logo d'un contact dans le tableau, la VUE DU CONTACT s'ouvre <PersonIcon color="primary" /> et vous pouvez modifier toutes les informations du contact, par exemple ajouter / modifier le logo ou associer des fichiers à ce contact (fichiers qui existent déjà ou nouveaux fichiers, qui seront ensuite disponibles aussi pour les autres contacts).
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemText primary={
                        <>
                            Grâce au CALENDRIER <CalendarMonthIcon color="primary" /> vous pouvez voir les dates de relances de vos contacts, les modifier (glisser-déposer) et voir le contact (au clic).
                        </>
                    } />
                </ListItem>
            </List>
        </Paper>
    )
}
