'use client'
import React from 'react'
// MUI
import { Paper, Typography } from '@mui/material'
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';

export default function Help() {
    const muiTheme = useTheme();

    return (
        <Paper elevation={5} sx={{ padding: "40px", marginTop: "30px", maxWidth: "1000px", mx: "auto" }} >
            <Typography variant='h3' component='h2' color='secondary' sx={{ textShadow: "1px 1px 2px blue", marginBottom: "25px" }} >Aide</Typography>
            <List sx={{ marginTop: "20px" }}>
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography
                                sx={{ textOverflow: "clip", whiteSpace: "normal" }}
                            >
                                Avec cette aplication, vous pouvez <span style={{ fontSize: "1.2em", fontWeight: "bold", color: muiTheme.palette.pink.dark }}>Créer</span> et <span style={{ fontSize: "1.2em", fontWeight: "bold", color: muiTheme.palette.purple.main }}>Gérer</span> des contacts :
                            </Typography>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography
                                sx={{ textOverflow: "clip", whiteSpace: "normal" }}
                            >
                                <span style={{ fontSize: "1.2em", fontWeight: "bold", color: muiTheme.palette.pink.dark }}>Créer</span> : Dans l'onglet NOUVEAU CONTACT <PersonAddIcon color="primary" /> grâce à une recherche INSEE ou à partir de zéro.
                                <br />
                                Un logo par défaut s'affichera dans le tableau, en fonction du nom du contact, si vous n'en avez pas attribué un.
                            </Typography>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography
                                sx={{ textOverflow: "clip", whiteSpace: "normal" }}
                            >
                                <br />
                                <span style={{ fontWeight: "bold", color: muiTheme.palette.purple.main, fontSize: "1.2em" }}>Gérer</span> :
                            </Typography>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography
                                sx={{ textOverflow: "clip", whiteSpace: "normal" }}
                            >
                                Dans l'onglet LISTE DES CONTACTS <Diversity3Icon color="primary" /> vous pouvez <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>voir tous les contacts</span> que vous avez créés et modifier directement dans le tableau certains champs (tous sauf les textes, logo et fichiers). Ils sont tous modifiables lors de la vue d'un contact, qui s'ouvre en cliquant sur son logo dans le tableau.
                            </Typography>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography
                                sx={{ textOverflow: "clip", whiteSpace: "normal" }}
                            >
                                Dans cette onglet vous pouvez aussi <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>trier les contacts</span> par titre de colonne (nom, date...) en cliquant dessus, et faire des <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>recherches</span> selon si les contacts sont des clients / prospects, leur catégorie, ville et type (dans la recherche, les propositions seront celles que contiennent vos contacts, par exemple si vous n'avez que des contacts de Paris et Marseille, dans ville(s) vous n'aurez que ces deux propositions).
                            </Typography>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography
                                sx={{ textOverflow: "clip", whiteSpace: "normal" }}
                            >
                                Pour <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>ajouter des catégories et des fichiers</span> qui seront ensuite disponibles pour chaque contact, c'est dans l'onglet ADMIN <SettingsIcon color="primary" />.<br />
                                Vous pouvez aussi renommer les fichiers et catégories, et supprimer les catégories.
                            </Typography>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography
                                sx={{ textOverflow: "clip", whiteSpace: "normal" }}
                            >
                                Lors du clic sur le logo d'un contact dans le tableau, la VUE DU CONTACT s'ouvre <PersonIcon color="primary" /> et vous pouvez modifier toutes les informations du contact, par exemple ajouter/modifier le logo ou associer des fichiers à ce contact (fichiers qui existent déjà ou nouveaux fichiers, qui seront ensuite disponibles aussi pour les autres contacts).
                            </Typography>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography
                                sx={{ textOverflow: "clip", whiteSpace: "normal" }}
                            >
                                Grâce au CALENDRIER <CalendarMonthIcon color="primary" /> vous pouvez voir les dates de relances de vos contacts, les modifier (glisser-déposer) et voir le contact (au clic).
                            </Typography>
                        }
                    />
                </ListItem>
            </List>
        </Paper>
    )
}
