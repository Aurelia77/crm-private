'use client'

import React from 'react'
import { getFilesFromDatabase } from '../utils/firebase'
import { Box, ListItemText, Paper, Typography } from '@mui/material'
import { handleOpenFile } from '../utils/firebase'
import { Button, FormControl, InputLabel, MenuItem, Select, Input } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, addFileOnFirebaseDB } from '../utils/firebase'





type AdminType = {
  currentUser: any
}

export default function Admin({ currentUser }: AdminType) {


  const [filesList, setFilesList] = React.useState<FileNameAndRefType[]>([]);
  const [progresspercentFile, setProgresspercentFile] = React.useState(0);


  React.useEffect(() => {
    getFilesFromDatabase(currentUser.uid).then((files: FileNameAndRefType[]) => {
      setFilesList(files);
    });
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
                  window.location.reload();
                });               
            });
        }
    );
}

  return (
    <Paper elevation={3}>
      <Typography variant="h6">Fichiers dans ma base de données</Typography>

      <Box sx={{ marginTop: "30px" }} >
        {filesList.map((file, index) => (
          <ListItemText
            key={index}
            onClick={() => handleOpenFile(file.fileRef)}
            sx={{ cursor: "pointer" }}
          >
            {file.fileName}
          </ListItemText>
        ))}
      </Box>

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
    </Paper>

  );

}




