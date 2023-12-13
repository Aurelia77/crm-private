'use client'

import React from 'react'
import { getFilesFromDatabase, getCategoriesFromDatabase, storage, addFileOnFirebaseDB, addCategorieOnFirebase, updateCategorieOnFirebase, updateFileOnFirebase, deleteCategorieOnFirebase } from '../utils/firebase'
import { Alert, Box, Divider, ListItemText, Modal, Paper, TextField, Typography } from '@mui/material'
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
  const [newFileName, setNewFileName] = React.useState<string | null>(null);
  const [newCatName, setNewCatName] = React.useState<string>("");
  const [catToUpdateOrDelete, setCatToUpdateOrDelete] = React.useState<ContactCategorieType>({ id: "", label: "" });
  const [fileToUpdateOrDelete, setFileToUpdateOrDelete] = React.useState<FileNameAndRefType>({ fileName: "", fileRef: "" });
  const [progresspercentFile, setProgresspercentFile] = React.useState(0);
  const [openDeleteCatModal, setOpenDeleteCatModal] = React.useState(false);
  const [alertFileText, setAlertFileText] = React.useState("");
  const [alertCatText, setAlertCatText] = React.useState("");


  //console.log("catToUpdate", catToUpdateOrDelete)
  //console.log("newCat", newCat)

  console.log("fileToUpdateOrDelete", fileToUpdateOrDelete)
  const muiTheme = useTheme();


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


  const handleChangeInputFile = (e: any) => {
    console.log(e.target.files[0])
    setNewFileName(e.target.files[0].name)
  }
  
  const handleSubmitFiles = (e: any, attribut: string) => {
    e.preventDefault()
    console.log("e", e)
    console.log("e.target", e.target)
    console.log("e.target", e.target.elements)
    console.log("e.target", e.target.elements[0])
    console.log("e.target", e.target.elements[0].files)
    console.log("e.target", e.target.elements[0].files[0])

    if (newFileName === "" ) {
      setAlertFileText("Le nom du fichier doit contenir au moins un caractère !")
      return
    }

    setAlertFileText("")

    //const file = e.target[0]?.files[0]
    const file = e.target.elements[0].files[0]
    if (!file) return;
    const storageRef = ref(storage, `${attribut}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    //console.log(uploadTask)

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
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: any) => {
          newFileName && addFileOnFirebaseDB(currentUser.uid, { fileName: newFileName, fileRef: downloadURL }).then(() => {
            //setFilesList([...filesList, { fileName: file.name, fileRef: downloadURL }]);
            setFilesList([...filesList, { fileName: newFileName, fileRef: downloadURL }]);
            //window.location.reload();
            setProgresspercentFile(0);
            setNewFileName(null);
          });
        });
      }
    );
  }


  const handleUpdateFile = () => {    
    console.log("fileToUpdate", fileToUpdateOrDelete)
    if (fileToUpdateOrDelete.fileName === "") {
      setAlertFileText("Le nom du fichier doit contenir au moins un caractère !")
      return 
    }
    setAlertFileText("")
    updateFileOnFirebase(fileToUpdateOrDelete)
    setFilesList([...filesList.filter(file => file.fileRef !== fileToUpdateOrDelete.fileRef), { ...fileToUpdateOrDelete }]);
    setFileToUpdateOrDelete({ fileName: "", fileRef: "" });
  }

  const handleAddCat = () => {
    if (newCatName === "") {
      setAlertCatText("Le nom de la catégorie doit contenir au moins un caractère !")
      return 
    }

    setAlertCatText("")

    const newCatWithUpperCase: ContactCategorieType = { id: uid(), label: newCatName.charAt(0).toUpperCase() + newCatName.slice(1) }

    addCategorieOnFirebase(currentUser.uid, newCatWithUpperCase)
    setCategoriesList([...categoriesList, { ...newCatWithUpperCase }]);
    // setCategoriesList([...categoriesList, newCatWithUpperCase].sort((a, b) => a.localeCompare(b)));
    setNewCatName("");
  }

  const handleUpdateCat = () => {
    console.log("catToUpdate", catToUpdateOrDelete)

    if (catToUpdateOrDelete.label === "") {
      setAlertCatText("Le nom de la catégorie doit contenir au moins un caractère !")
      return 
    }

    setAlertCatText("")
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
        setAlertCatText("Impossible de supprimer cette catégorie => Un ou plusieurs contact(s) y est (sont) associé(s). Veuillez d'abord modifier/supprimer leur catégorie.");
        console.log(error)
      })
    setAlertCatText("");
    setCatToUpdateOrDelete({ id: "", label: "" });
    setOpenDeleteCatModal(false);
  }




  return (
    <Box sx={{ maxWidth: "1500px", margin: "auto" }} >
      <Box mx={5} mb={2} >
        <Typography variant="h6">Mes fichiers ({filesList.length}) <span style={{ color: 'gray', fontSize: "0.8em" }}>(1 clic pour modifier, 2 clics pour visualiser)</span>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: "2%", mt: 2, }} >
          <List
            sx={{
              width: '50%',
              overflow: 'auto',
              maxHeight: "40vh",
              boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
              //backgroundColor: muiTheme.palette.lightCyan.light
            }}
            subheader={<li />}
          >
            {filesList
              .sort((a, b) => a.fileName.localeCompare(b.fileName))
              .map((file, index) => (
                <ListItemText
                  key={index}
                  onDoubleClick={() => handleOpenFile(file.fileRef)}
                  onClick={() => setFileToUpdateOrDelete({fileName: file.fileName, fileRef: file.fileRef})}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: index % 2 === 0 ? muiTheme.palette.lightCyan.light : '',
                    color: index % 2 === 1 ? muiTheme.palette.primary.dark : '',
                    pl: 1,
                  }}
                >
                  {file.fileName}
                </ListItemText>
              ))}
          </List>

          <Box sx={{width:"48%" }}  >           

            <form
              style={{
                //marginLeft: "0px",
                //margin: "5%",
                //width: "48%",
                display: "flex",
                flexDirection: "column",
                //justifyContent: "start",
                //gap: "5%",
                //maxWidth: "500px",
              }}
              onSubmit={(e) => handleSubmitFiles(e, "filesSent")}
            >
              <Input
                id="fileInput"
                type="file"
                style={{ display: 'none' }}
                onChange={handleChangeInputFile}
              />
              <label htmlFor="fileInput">
                <Button variant='contained' component="span" sx={{ color: "white", fontWeight: "bold" }}
                >
                  1- Choisir un fichier à ajouter
                </Button>
              </label>
              
              {(newFileName !== null) && <Box>
                <TextField
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  label="Fichier à ajouter"
                  variant="outlined"
                  sx={{ width: "100%", marginTop: "15px" }}
                />
                <Button
                  color="pink"
                  sx={{ fontWeight: "bold", marginTop: "15px" }}
                  //component="label"
                  type="submit"
                  variant="contained" startIcon={<CloudUploadIcon />}
                //onClick={handleChangeLogo}
                >
                  2-Télécharger/ajouter le fichier
                </Button>
                <LinearProgress
                  variant="determinate"
                  value={progresspercentFile}
                  sx={{ marginTop: "10px" }} />
              </Box>}
            </form>

            {alertFileText && <Alert sx={{ mt:"70px" }} severity="warning">{alertFileText}</Alert>}

            {fileToUpdateOrDelete.fileRef && <FormControl
              sx={{
                marginTop: "70px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "2%",
              }}
            >
              <TextField
                //disabled={fileToUpdateOrDelete.fileName === "" ? true : false}
                value={fileToUpdateOrDelete.fileName}
                //autoComplete="off"
                onChange={(e) => setFileToUpdateOrDelete({ ...fileToUpdateOrDelete, fileName: e.target.value })}
                label="Fichier à modifier"
                variant="outlined"
                sx={{ width: "60%" }}
              />
              {fileToUpdateOrDelete.fileRef && <Button
                //sx={{ marginTop: "15px", }}
                //component="label"
                color="ochre"
                type="submit"
                variant="contained" //startIcon={<CloudUploadIcon />}
                onClick={handleUpdateFile}
              >
                Modifier le nom
              </Button>  }            
            </FormControl>}
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box
        m={5}
      //sx={{ marginTop: "100px" }} 
      >
        <Typography variant="h6">Mes catégories ({categoriesList.length}) <span style={{ color: 'gray', fontSize: "0.8em" }}>(cliquer pour modifier)</span>
        </Typography>       
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: "2%", mt: 2, }} >
          <List
            sx={{
              width: '50%',
              overflow: 'auto',
              maxHeight: "40vh",
              boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
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
                    pl: 1,
                  }}
                  onClick={() => setCatToUpdateOrDelete(cat)}
                >
                  {cat.label}
                </ListItemText>
              ))}
          </List>

          <Box sx={{width:"48%" }}  >   
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "2%",
                //alignItems: ""
              }} >
              <TextField
                value={newCatName}
                autoComplete="off"
                onChange={(e) => setNewCatName(e.target.value)}
                id="outlined-basic"
                label="Nouvelle catégorie"
                variant="outlined"
                sx={{ width: "60%" }}
              />
              <Button
                sx={{ 
                  //width: "30%", 
                  color:"white" }}
                //component="label"
                type="submit"
                variant="contained" 
                startIcon={<CloudUploadIcon />}
                onClick={handleAddCat}
              >
                Ajouter la catégorie
              </Button>
            </FormControl>
            
            {alertCatText && <Alert sx={{ mt:"70px" }} severity="warning">{alertCatText}</Alert>}

            {catToUpdateOrDelete.id && <FormControl
              sx={{
                marginTop: "70px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "2%",
              }}
            >
              <TextField
                disabled={catToUpdateOrDelete.id === "" ? true : false}
                value={catToUpdateOrDelete.label}
                //autoComplete="off"    // Marche pas !!!
                onChange={(e) => setCatToUpdateOrDelete({ ...catToUpdateOrDelete, label: e.target.value })}
                label="Catégorie à modifier ou supprimer"
                variant="outlined"
                sx={{ width: "60%" }}
              />
              <Button
                //sx={{ width: "20%" }}
                //component="label"
                color="ochre"
                type="submit"
                variant="contained" //startIcon={<CloudUploadIcon />}
                onClick={handleUpdateCat}
              >
                Modifier le nom
              </Button>
              <Button
                //sx={{ width: "20%" }}
                //component="label"
                color="warning"
                type="submit"
                variant="contained" //startIcon={<CloudUploadIcon />}
                onClick={() => setOpenDeleteCatModal(true)}
              >
                Supprimer
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
          </Box>
        </Box>
      </Box>
    </Box>

  );

}




