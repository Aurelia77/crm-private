'use client'

import React from 'react'
import { addFakeDataWithCat, addLaurianeDataWithCat, addCategoriesOnFirebaseAndReload, getFilesFromDatabase, getCategoriesFromDatabase, storage, addFileOnFirebaseDB, addCategorieOnFirebase, updateCategorieOnFirebase, updateFileOnFirebase, deleteCategorieOnFirebase, deleteAllDatasOnFirebaseAndReload, handleOpenFile, getAllFirebaseUserDatasAndSave } from '../utils/firebase'
import { Alert, Box, Divider, ListItemText, Modal, Paper, TextField, Typography } from '@mui/material'
import { Button, FormControl, InputLabel, MenuItem, Select, Input } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import List from '@mui/material/List';
import { useTheme } from '@mui/material/styles';
import { uid } from 'uid';
import { modalStyle } from '../utils/toolbox'
import { useQuery, useMutation, QueryClient, useQueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation'


type AdminType = {
  currentUserId: string | undefined
}

export default function Admin({ currentUserId }: AdminType) {

  const [filesList, setFilesList] = React.useState<FileNameAndRefType[] | null>(null);
  const [categoriesList, setCategoriesList] = React.useState<ContactCategorieType[] | null>(null);
  const [newFileName, setNewFileName] = React.useState<string | null>(null);
  const [newCatName, setNewCatName] = React.useState<string>("");
  const [catToUpdateOrDelete, setCatToUpdateOrDelete] = React.useState<ContactCategorieType>({ id: "", label: "" });
  const [fileToUpdateOrDelete, setFileToUpdateOrDelete] = React.useState<FileNameAndRefType>({ fileName: "", fileRef: "" });
  const [progresspercentFile, setProgresspercentFile] = React.useState(0);
  const [openDeleteCatModal, setOpenDeleteCatModal] = React.useState(false);
  const [alertFileText, setAlertFileText] = React.useState("");
  const [alertCatText, setAlertCatText] = React.useState("");


  const muiTheme = useTheme();

  // const { data: contact, isLoading, isError } = useQuery({
  //   queryKey: ['contacts', contactId],
  //   queryFn: () => getContactInfoInDatabaseFromId(contactIdStr),
  //   enabled: contactIdStr !== undefined,
  // });


  React.useEffect(() => {
    getFilesFromDatabase(currentUserId).then((files: FileNameAndRefType[]) => {
      setFilesList(files);
    });

    getCategoriesFromDatabase(currentUserId).then((categories: ContactCategorieType[]) => {
      console.log("categories", categories)

      const newCategoriesList = categories.map(category => ({
        id: category.id,
        label: category.label
      }));
      setCategoriesList(newCategoriesList);
    })

  }, [currentUserId]);

  React.useEffect(() => {
    newCatName && setAlertCatText("")

  }, [newCatName])

  const handleChangeInputFile = (e: any) => {
    console.log(e.target.files[0])
    setNewFileName(e.target.files[0].name)
  }
  const handleSubmitFiles = (e: any, attribut: string) => {
    e.preventDefault()

    if (newFileName === "") {
      setAlertFileText("Le nom du fichier doit contenir au moins un caractère !")
      return
    }
    setAlertFileText("")

    const file = e.target.elements[0].files[0]
    if (!file) return;
    const storageRef = ref(storage, `${attribut}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

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
          newFileName && addFileOnFirebaseDB(currentUserId, { fileName: newFileName, fileRef: downloadURL }).then(() => {
            //setFilesList([...filesList, { fileName: file.name, fileRef: downloadURL }]);
            filesList && setFilesList([...filesList, { fileName: newFileName, fileRef: downloadURL }]);
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
    filesList && setFilesList([...filesList.filter(file => file.fileRef !== fileToUpdateOrDelete.fileRef), { ...fileToUpdateOrDelete }]);
    setFileToUpdateOrDelete({ fileName: "", fileRef: "" });
  }

  const handleAddCat = () => {
    if (newCatName === "") {
      setAlertCatText("Le nom de la catégorie doit contenir au moins un caractère !")
      return
    }
    setAlertCatText("")

    const newCatWithUpperCase: ContactCategorieType = { id: uid(), label: newCatName.charAt(0).toUpperCase() + newCatName.slice(1) }

    addCategorieOnFirebase(currentUserId, newCatWithUpperCase)
    categoriesList && setCategoriesList([...categoriesList, { ...newCatWithUpperCase }]);
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
    categoriesList && setCategoriesList([...categoriesList.filter(cat => cat.id !== catToUpdateOrDelete.id), { ...catToUpdateOrDelete }]);
    setCatToUpdateOrDelete({ id: "", label: "" });
  }

  const handleDeleteCat = () => {
    console.log("catToUpdate", catToUpdateOrDelete)

    deleteCategorieOnFirebase(catToUpdateOrDelete.id)
      .then(() => {
        categoriesList && setCategoriesList([...categoriesList.filter(cat => cat.id !== catToUpdateOrDelete.id)]);
      }).catch((error) => {
        setAlertCatText("Impossible de supprimer cette catégorie => Un ou plusieurs contact(s) y est (sont) associé(s). Veuillez d'abord modifier/supprimer leur catégorie.");
        console.log(error)
      })
    setAlertCatText("");
    setCatToUpdateOrDelete({ id: "", label: "" });
    setOpenDeleteCatModal(false);
  }

  const [url, setUrl] = React.useState("")

  const handleSaveAll = async () => {
    const data = await getAllFirebaseUserDatasAndSave(currentUserId);

    //console.log({ contacts, files, categories });

    // Convertir les données en JSON
    const dataStr = JSON.stringify(data);

    console.log("dataStr", dataStr)

    // Créer un blob à partir des données
    const blob = new Blob([dataStr], { type: 'application/json' });

    // Créer un lien de téléchargement
    setUrl(URL.createObjectURL(blob))

    console.log("url", url)

    // Créer un élément de lien
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json'; // Nom du fichier à télécharger

    // Ajouter le lien au document et le cliquer pour déclencher le téléchargement
    document.body.appendChild(link);
    link.click();

    // Supprimer le lien du document
    document.body.removeChild(link);
  }



    
  

  return (
    currentUserId
      ? <Box>
        <Box sx={{ maxWidth: "1500px", margin: "auto" }} >
          {filesList && <Box mx={5} mb={2} >
            <Typography variant="h6">Mes fichiers ({filesList.length}) <span style={{ color: 'gray', fontSize: "0.8em" }}>(1 clic pour modifier, 2 clics pour visualiser)</span>
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
                {filesList.length === 0
                  ? <ListItemText
                    sx={{
                      color: "grey",
                      pl: 1,
                    }}
                  >Aucun fichier pour l'instant</ListItemText>
                  : filesList
                  .sort((a, b) => a.fileName.localeCompare(b.fileName))
                  .map((file, index) => (
                    <ListItemText
                      key={index}
                      onDoubleClick={() => handleOpenFile(file.fileRef)}
                      onClick={() => setFileToUpdateOrDelete({ fileName: file.fileName, fileRef: file.fileRef })}
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

              <Box sx={{ width: "48%" }} >
                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
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
                      type="submit"
                      variant="contained" startIcon={<CloudUploadIcon />}
                    >
                      2-Télécharger/ajouter le fichier
                    </Button>
                    <LinearProgress
                      variant="determinate"
                      value={progresspercentFile}
                      sx={{ marginTop: "10px" }} />
                  </Box>}
                </form>

                {alertFileText && <Alert sx={{ mt: "70px" }} severity="warning">{alertFileText}</Alert>}

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
                    value={fileToUpdateOrDelete.fileName}
                    //autoComplete="off"
                    onChange={(e) => setFileToUpdateOrDelete({ ...fileToUpdateOrDelete, fileName: e.target.value })}
                    label="Fichier à modifier"
                    variant="outlined"
                    sx={{ width: "60%" }}
                  />
                  {fileToUpdateOrDelete.fileRef && <Button
                    color="ochre"
                    type="submit"
                    variant="contained"
                    onClick={handleUpdateFile}
                  >
                    Modifier le nom
                  </Button>}
                </FormControl>}
              </Box>
            </Box>
          </Box>}

          <Divider />

          {categoriesList && <Box
            m={5}
          >
            <Typography variant="h6">Mes catégories ({categoriesList.length}) {categoriesList.length > 0 && <span style={{ color: 'gray', fontSize: "0.8em" }}>(cliquer pour modifier)</span>}
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
                {categoriesList.length === 0
                  ? <ListItemText
                    sx={{
                      color: "grey",
                      pl: 1,
                    }}
                  >Aucune catégorie pour l'instant</ListItemText>
                  : categoriesList
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

              <Box sx={{ width: "48%" }}  >
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
                      color: "white"
                    }}
                    type="submit"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleAddCat}
                  >
                    Ajouter la catégorie
                  </Button>
                </FormControl>

                {alertCatText && <Alert sx={{ mt: "70px" }} severity="warning">{alertCatText}</Alert>}

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
                    //autoComplete="off"    // Marche pas !!! (Parfois le navigateur met une valeur par défaut)
                    onChange={(e) => setCatToUpdateOrDelete({ ...catToUpdateOrDelete, label: e.target.value })}
                    label="Catégorie à modifier ou supprimer"
                    variant="outlined"
                    sx={{ width: "60%" }}
                  />
                  <Button
                    color="ochre"
                    type="submit"
                    variant="contained"
                    onClick={handleUpdateCat}
                  >
                    Modifier le nom
                  </Button>
                  <Button
                    color="warning"
                    type="submit"
                    variant="contained"
                    onClick={() => setOpenDeleteCatModal(true)}
                  >
                    Supprimer
                  </Button>
                  <Modal
                    open={openDeleteCatModal}
                    onClose={() => setOpenDeleteCatModal(false)}
                  >
                    <Box sx={modalStyle} >
                      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 5 }} >
                        Supprimer la catégorie : <span style={{ fontWeight: "bold" }}>
                          {catToUpdateOrDelete.label}
                        </span> ?
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                        <Button variant="contained" color='warning' onClick={handleDeleteCat} sx={{ marginRight: "15px" }} >Oui !</Button>
                        <Button variant="contained" color='primary' onClick={() => setOpenDeleteCatModal(false)} >Non</Button>
                      </Box>
                    </Box>
                  </Modal>
                </FormControl>}
              </Box>
            </Box>
          </Box>}
        </Box>
        <Box sx={{
          padding: "10px", border: "solid 3px blue", borderRadius: "10px", marginTop: "100px", width: "calc(100vw - 200px)"
        }}>
          <Typography
            component="div"
            textAlign="center"
            style={{
              marginBottom: "50px"
            }} >Pour Version TEST</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }} >
            <Button variant="contained" color='success' onClick={() => addCategoriesOnFirebaseAndReload(currentUserId)}>1-Ajouter Catégories</Button>
            <Button variant="contained" color='ochre' onClick={() => addFakeDataWithCat(currentUserId)}>2-Ajouter Contacts Test (x7)</Button>
            {/* <Button variant="contained" color='warning' onClick={() => addLaurianeDataWithCat(currentUserId)}>Ajouter Contacts LAURIANE (x 201)</Button> */}
            <Button variant="contained" onClick={handleSaveAll}>Sauvegarder TOUTES mes données</Button>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-around", }} >
            <Button variant="contained" color='error' sx={{ width: "300px" }} onClick={() => deleteAllDatasOnFirebaseAndReload(currentUserId)
              }>Supprimer tous mes contacts</Button>
            {/* <Button variant="contained" color='warning' onClick={() => deleteAllDatasOnFirebaseAndReload()}>Supprimer TOUS les contacts de l'appli !!!</Button> */}
          </Box>
        </Box>
      </Box>
      : redirect('/')
  );
}




