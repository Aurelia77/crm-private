'use client'

import React from 'react'
import { getFilesFromDatabase, getCategoriesFromDatabase, storage, addFileOnFirebaseDB, addCategorieOnFirebase, updateCategorieOnFirebase, deleteCategorieOnFirebase } from '../utils/firebase'
import { Box, Divider, ListItemText, Modal, Paper, TextField, Typography } from '@mui/material'
import { handleOpenFile } from '../utils/firebase'
import { Button, FormControl, InputLabel, MenuItem, Select, Input } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import { useTheme } from '@mui/material/styles';
import { uid } from 'uid';

import { deleteModalStyle } from '../utils/StyledComponents'


import { addDoc, collection, query, where, getDocs, onSnapshot, QuerySnapshot, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { fireStoreDb } from '../utils/firebase';



type AdminType = {
  currentUser: any
}

export default function Admin({ currentUser }: AdminType) {

  const [filesList, setFilesList] = React.useState<FileNameAndRefType[]>([]);
  const [categoriesList, setCategoriesList] = React.useState<ContactCategorieType[]>([]);
  const [newCat, setNewCat] = React.useState<string>("");
  const [catToUpdateOrDelete, setCatToUpdateOrDelete] = React.useState<ContactCategorieType>({ id: "", label: "" });
  const [progresspercentFile, setProgresspercentFile] = React.useState(0);

  const [openDeleteCatModal, setOpenDeleteCatModal] = React.useState(false);


  const [isFileChoosen, setIsFileChoosen] = React.useState(false);

  console.log("catToUpdate", catToUpdateOrDelete)

  const muiTheme = useTheme();

  console.log("newCat", newCat)

  React.useEffect(() => {
    getFilesFromDatabase(currentUser.uid).then((files: FileNameAndRefType[]) => {
      setFilesList(files);
    });

    getCategoriesFromDatabase(currentUser.uid).then((categories: ContactCategorieType[]) => {
      console.log("categories", categories)

      // Pas besoin de l'attribut userId donc on garde juste ce qu'on veut
      const newCategoriesList = categories.map(category => ({
        id: category.id,
        label: category.label
      }));
      setCategoriesList(newCategoriesList);
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
            setIsFileChoosen(false);
            setProgresspercentFile(0);
          });
        });
      }
    );
  }

  const handleAddCat = () => {
    const newCatWithUpperCase: ContactCategorieType = { id: uid(), label: newCat.charAt(0).toUpperCase() + newCat.slice(1) }

    addCategorieOnFirebase(currentUser.uid, newCatWithUpperCase)
    setCategoriesList([...categoriesList, { ...newCatWithUpperCase }]);
    // setCategoriesList([...categoriesList, newCatWithUpperCase].sort((a, b) => a.localeCompare(b)));
  }

  const handleUpdateCat = () => {
    console.log("catToUpdate", catToUpdateOrDelete)
    updateCategorieOnFirebase(catToUpdateOrDelete)
    setCategoriesList([...categoriesList.filter(cat => cat.id !== catToUpdateOrDelete.id), { ...catToUpdateOrDelete }]);
    setCatToUpdateOrDelete({ id: "", label: "" });
  }

  // const handleDeleteCat = async () => {
  //   console.log("catToUpdate", catToUpdateOrDelete)

  //   try {
  //     await deleteCategorieOnFirebase(catToUpdateOrDelete.id);

  //     console.log("OKKKKKKKKKKKK")

  //     setCategoriesList([...categoriesList.filter(cat => cat.id !== catToUpdateOrDelete.id)]);
  //   } catch (error) {

  //     console.log("NONNNNNNNNN")

  //     console.log(error)
  //   }

  //   setCatToUpdateOrDelete({ id: "", label: "" });
  // }



  // const deleteCategorieOnFirebase2 = (catId: string) => {
  //   console.log("catId", catId) 

  //   const q = query(collection(fireStoreDb, "contacts"), where("businessCategoryId", "==", catId));

  //   return getDocs(q).then((querySnapshot) => {
  //     console.log("querySnapshot", querySnapshot.docs)

  //     if (!querySnapshot.empty) {
  //       throw new Error("Un contact est associé à cette catégorie.");
  //     } else {
  //       const q = query(collection(fireStoreDb, "categories"), where("id", "==", catId));
  //       return getDocs(q).then((querySnapshot) => {
  //         return querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  //         // Marche aussi mais pas besoin de Promise.all car une seule cat à supp !
  //         // const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  //         // return Promise.all(deletePromises);
  //       })
  //       // Chat copilote : mais marche pas !!! :
  //       // const docRef = doc(fireStoreDb, "categories", catId);
  //       // return deleteDoc(docRef);
  //     }
  //   }).catch((error) => {
  //     console.error("Erreur lors de la suppression de la catégorie : ", error);
  //   });
  // }

  // const handleDeleteCat = () => {
  //   console.log("catToUpdate", catToUpdateOrDelete)

  //   deleteCategorieOnFirebase2(catToUpdateOrDelete.id)
  //     .then(() => {
  //     console.log("ok !!!!!!!!!")
  //   }).catch((error) => {
  //     console.log("non", error)
  //   })
  // }






  const handleDeleteCat = () => {
    console.log("catToUpdate", catToUpdateOrDelete)

    deleteCategorieOnFirebase(catToUpdateOrDelete.id)
      .then(() => {
        setCategoriesList([...categoriesList.filter(cat => cat.id !== catToUpdateOrDelete.id)]);
      }).catch((error) => {
        alert("Impossible de supprimer cette catégorie => Un ou plusieurs contact(s) y est (sont) associé(s). Veuillez d'abord modifier/supprimer leur catégorie.");
        console.log(error)
      })
    setCatToUpdateOrDelete({ id: "", label: "" });     
    setOpenDeleteCatModal(false);     
  }


  return (
    <Paper elevation={3}>
      <Box 
        m={3} mt={5}
        //sx={{ marginTop: "30px" }} 
      >
        <Typography variant="h6">Mes fichiers ({filesList.length}) </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }} >
          <List
            sx={{
              //width: '100%',
              overflow: 'auto',
              maxHeight: "50vh",
              mt: 2,
              //backgroundColor: muiTheme.palette.lightCyan.light
            }}
            subheader={<li />}
          >
            {filesList              
              .sort((a, b) => a.fileName.localeCompare(b.fileName))
              .map((file, index) => (
              <ListItemText
                key={index}
                onClick={() => handleOpenFile(file.fileRef)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: index % 2 === 0 ? muiTheme.palette.lightCyan.light : '',
                  color: index % 2 === 1 ? muiTheme.palette.primary.dark : '',
                }}
              >
                {file.fileName}
              </ListItemText>
            ))}
          </List>

          <form
            style={{
              margin: "5%",
              width: "80%",
              display: "flex",
              gap: "5%"
            }}
            onSubmit={(e) => handleSubmitFiles(e, "filesSent")}
          >
            <Input
              id="fileInput"
              type="file"
              style={{ display: 'none' }}
              onChange={() => setIsFileChoosen(true)}
            />
            <label htmlFor="fileInput">
              <Button variant='contained' component="span">
                Choisir un fichier à ajouter
              </Button>
            </label>

            {isFileChoosen && <Box>
              <Button
                color="pink"
                //sx={{ marginTop: "10px" }}
                //component="label"
                type="submit"
                variant="contained" startIcon={<CloudUploadIcon />}
              //onClick={handleChangeLogo}
              >
                Télécharger/ajouter le fichier
              </Button>
              <LinearProgress
                variant="determinate"
                value={progresspercentFile}
                sx={{ marginTop: "10px" }} />
            </Box>}
          </form>
        </Box>
      </Box>

      

      <Divider />

      <Box  
        m={3} mt={5}
        //sx={{ marginTop: "100px" }} 
        >
        <Typography variant="h6">Mes catégories ({categoriesList.length}) </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }} >
          <List
            sx={{
              width: '50%',
              overflow: 'auto',
              maxHeight: "50vh",
              mt: 2,
            }}
            subheader={<li />}
          >
            {categoriesList
              .sort((a, b) => a.label.localeCompare(b.label))
              .map((cat, index) => (
                <ListItemText
                  key={index}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: index % 2 === 0 ? muiTheme.palette.lightCyan.light : '',
                    color: index % 2 === 1 ? muiTheme.palette.primary.dark : '',
                  }}
                  onClick={() => setCatToUpdateOrDelete(cat)}
                >
                  {cat.label}
                </ListItemText>
              ))}
          </List>

          <Box>
            {categoriesList.length > 0  && <FormControl 
              sx={{ 
                padding: "2%", 
                display: "flex", 
                flexDirection: "row", 
                justifyContent: "space-around" }} 
            >
              <TextField
                disabled={catToUpdateOrDelete.id === "" ? true : false}
                value={catToUpdateOrDelete.label}
                //autoComplete="off"
                onChange={(e) => setCatToUpdateOrDelete({ ...catToUpdateOrDelete, label: e.target.value })}
                id="outlined-basic"
                label="Catégorie à modifier ou supprimer"
                variant="outlined"
                sx={{ width: "40%" }}
              />
              <Button
                sx={{ width: "20%" }}
                //component="label"
                color="ochre"
                type="submit"
                variant="contained" //startIcon={<CloudUploadIcon />}
                onClick={handleUpdateCat}
              >
                Modifier la catégorie
              </Button>
              <Button
                sx={{ width: "20%" }}
                //component="label"
                color="warning"
                type="submit"
                variant="contained" //startIcon={<CloudUploadIcon />}
                onClick={() => setOpenDeleteCatModal(true)}
              >
                Supprimer la catégorie
              </Button>
              <Modal
                open={openDeleteCatModal}
                onClose={() => setOpenDeleteCatModal(false)}
              >
                <Box sx={deleteModalStyle} >
                  <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 5 }} >
                    Supprimer la catégorie : <span style={{ fontWeight: "bold" }}>
                      {catToUpdateOrDelete.label}
                    </span> ?
                  </Typography>
                  {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</Typography> */}
                  <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                    <Button variant="contained" color='warning' onClick={handleDeleteCat} sx={{ marginRight: "15px" }} >Oui !</Button>
                    <Button variant="contained" color='primary' onClick={() => setOpenDeleteCatModal(false)} >Non</Button>
                  </Box>
                </Box>
              </Modal>
            </FormControl>}

            <FormControl 
              sx={{ 
                mt:3, 
                padding: "2%", 
                display: "flex", 
                flexDirection: "row", 
                justifyContent: "space-around" 
              }} >
              <TextField
                value={newCat}
                autoComplete="off"
                onChange={(e) => setNewCat(e.target.value)}
                id="outlined-basic"
                label="Nouvelle catégorie"
                variant="outlined"
                sx={{ width: "40%" }}
              />
              <Button
                sx={{ width: "40%" }}
                //component="label"
                type="submit"
                variant="contained" startIcon={<CloudUploadIcon />}
                onClick={handleAddCat}
              >
                Ajouter la catégorie
              </Button>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Paper>

  );

}




