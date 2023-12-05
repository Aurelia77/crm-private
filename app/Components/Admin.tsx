'use client'

import React from 'react'
import { getFilesFromDatabase, getCategoriesFromDatabase, storage, addFileOnFirebaseDB, addCategorieOnFirebase } from '../utils/firebase'
import { Box, ListItemText, Paper, TextField, Typography } from '@mui/material'
import { handleOpenFile } from '../utils/firebase'
import { Button, FormControl, InputLabel, MenuItem, Select, Input } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import { useTheme } from '@mui/material/styles';




type AdminType = {
  currentUser: any
}

export default function Admin({ currentUser }: AdminType) {

  const [filesList, setFilesList] = React.useState<FileNameAndRefType[]>([]);
  const [categoriesList, setCategoriesList] = React.useState<string[]>([]);
  const [newCat, setNewCat] = React.useState<string>("");
  const [progresspercentFile, setProgresspercentFile] = React.useState(0);

  const muiTheme = useTheme();

  console.log("newCat", newCat)

  React.useEffect(() => {
    getFilesFromDatabase(currentUser.uid).then((files: FileNameAndRefType[]) => {
      setFilesList(files);
    });
    getCategoriesFromDatabase(currentUser.uid).then((categories: string[]) => {
      setCategoriesList(categories.sort((a, b) => a.localeCompare(b)));
    })
  }, [currentUser.uid]);

  const handleSubmitFiles = (e: any, attribut: string) => {
    e.preventDefault()
    console.log("e", e)
    console.log("e.target", e.target)
    console.log("e.target", e.target.elements)
    console.log("e.target", e.target.elements[0])
    console.log("e.target", e.target.elements[0].files)
    console.log("e.target", e.target.elements[0].files[0])
    //const file = e.target[0]?.files[0]
    const file = e.target.elements[0].files[0]
    if (!file) return;
    const storageRef = ref(storage, `${attribut}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    console.log(uploadTask)


    uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgresspercentFile(progress)
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          addFileOnFirebaseDB(currentUser.uid, { fileName: file.name, fileRef: downloadURL }).then(() => {
            setFilesList([...filesList, { fileName: file.name, fileRef: downloadURL }]);
            //window.location.reload();
          });
        });
      }
    );
  }

  const handleAddCat = (e: any) => {
    const newCatWithUpperCase = newCat.charAt(0).toUpperCase() + newCat.slice(1);

    addCategorieOnFirebase(currentUser.uid, newCatWithUpperCase)
    setCategoriesList([...categoriesList, newCatWithUpperCase].sort((a, b) => a.localeCompare(b)));      
  }

  return (
    <Paper elevation={3}>
      <Box sx={{ marginTop: "30px" }} >
        <Typography variant="h6">Fichiers dans ma base de données</Typography>
        <List
          sx={{
            //width: '100%',
            overflow: 'auto',
            maxHeight: "50vh",
          }}
          subheader={<li />}
        >
          {filesList.map((file, index) => (
            <ListItemText
              key={index}
              onClick={() => handleOpenFile(file.fileRef)}
              sx={{ cursor: "pointer", backgroundColor: index % 2 === 0 ? muiTheme.palette.gray.light : '' }}
            >
              {file.fileName}
            </ListItemText>
          ))}
        </List>

        <form style={{ margin: "30px" }} onSubmit={(e) => handleSubmitFiles(e, "filesSent")} >
          <Input type="file" />
          <Button
            sx={{ marginTop: "10px" }}
            //component="label"
            type="submit"
            variant="contained" startIcon={<CloudUploadIcon />}
          //onClick={handleChangeLogo}
          >
            Télécharger le fichier
          </Button>
        </form>
        <LinearProgress
          variant="determinate"
          value={progresspercentFile}
          sx={{ marginTop: "10px" }} />
      </Box>

      <Box sx={{ marginTop: "30px" }} >
        <Typography variant="h6">Catégories dans ma base de données</Typography>
        <List
          sx={{
            //width: '100%',
            overflow: 'auto',
            maxHeight: "50vh",
          }}
          subheader={<li />}
        >
          {categoriesList.map((category, index) => (
            <ListItemText
              key={index}
              sx={{ cursor: "pointer", backgroundColor: index % 2 === 0 ? muiTheme.palette.gray.light : '' }}
            >
              {category}
            </ListItemText>
          ))}
        </List>

        <FormControl sx={{ marginTop: "30px" }} >
          <TextField 
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            id="outlined-basic" 
            label="Nouvelle catégorie" 
            variant="outlined" 
          />
          <Button
            sx={{ marginTop: "10px" }}
            //component="label"
            type="submit"
            variant="contained" startIcon={<CloudUploadIcon />}
            onClick={(e) => handleAddCat(e)}
          >
            Ajouter la catégorie
          </Button>
        </FormControl>
      </Box>
    </Paper>

  );

}




