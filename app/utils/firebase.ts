import { initializeApp } from "firebase/app";
import { getDatabase, set } from "firebase/database";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Timestamp } from 'firebase/firestore';
import { addDoc, collection, query, where, getDocs, onSnapshot, QuerySnapshot, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { uid } from 'uid';
import fakeContactsData from '../utils/contactsTest'
import laurianeData from '../utils/contactsLaurianeTOUS'
import { contactCategories, emptyContact } from '../utils/toolbox'
import contactsLaurianeNameAndCatLabel from '../utils/contactsLaurianeNomEtCat'



const firebaseConfig = {
  apiKey: "AIzaSyB6NMs-i0R146R2qEVCTm9NgNSWtbZOEaI",
  authDomain: "crm-lauriane-c8084.firebaseapp.com",
  databaseURL: "https://crm-lauriane-c8084-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "crm-lauriane-c8084",
  storageBucket: "crm-lauriane-c8084.appspot.com",
  messagingSenderId: "882348983292",
  appId: "1:882348983292:web:80587c355b2aae72702879",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Avec FireStore
const fireStoreDb = getFirestore(app);

// Ou Avec RealTime Database(pas utilisée ici => car me mettait tous les contacts 2 fois !!!)
const realtimeDb = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Initialize Performance Monitoring and get a reference to the service
//const perf = getPerformance(app);

const fakeContactsNameAndCatLabel = [
  {
      name: "Camping Hyères",
      catLabel: "Camping"
  },
  {
      name: "Camping St Tropez",
      catLabel: "Camping"
  },
  {
      name: "Plongeons ensemble !",
      catLabel: "Centre de Plongée"
  },
  {
      name: "Entreprise de maquillage GLOW",
      catLabel: "Autre"
  },
  {
      name: "Pierre et vacances",
      catLabel: "Centre de Loisirs"
  },
  {
      name: "Restaurant 5* LE BONHEUR",
      catLabel: "Restaurant Plage"
  },
]

const addCatToFakeContactsAndReload = async (currentUserId: any, fakeContactsData: Contact[], fakeContactsNameAndCatLabel: any) => {

  console.log("***fakeContactsNameAndCatLabel", fakeContactsNameAndCatLabel)

  console.log("****start addCatToFakeContacts")
  let promises: any = [];

  for (const fakeContact of fakeContactsData) {
      for (const contactNameAndCatLabel of fakeContactsNameAndCatLabel) {
          if (fakeContact.businessName === contactNameAndCatLabel.name) {
              const catId = await getCatIdFromLabel(currentUserId, contactNameAndCatLabel.catLabel); 

              getUserContactsFromDatabase(currentUserId).then((contactsList) => {
                  const updatePromises = contactsList.map((firebaseContact) => {
                      if (firebaseContact.businessName === fakeContact.businessName) {
                          //console.log("***", firebaseContact, catId)
                          console.log(catId)
                          return updatDataOnFirebase(firebaseContact.id, { key: "businessCategoryId", value: catId })
                      }
                  });
                  promises.push((updatePromises)); 
              })
          }
      }
  }

  Promise.all(promises)
      .then(() => { 
          window.location.reload() 
      })
      .catch((error) => { console.error("Error reloading page: ", error); });
}
const addFakeDataWithCat = async(currentUserId: any) => {
  await addFakeDataOnFirebase(currentUserId, fakeContactsData)              
  addCatToFakeContactsAndReload(currentUserId, fakeContactsData, fakeContactsNameAndCatLabel )       
}
const addLaurianeDataWithCat = async(currentUserId: any) => {
  await addFakeDataOnFirebase(currentUserId, laurianeData)
  addCatToFakeContactsAndReload(currentUserId, laurianeData, contactsLaurianeNameAndCatLabel)        
}

const getUserContactsFromDatabase = async (currentUserId: any) => {
  let contactsArr: Contact[] = []
  const contactsCollectionRef = collection(fireStoreDb, "contacts");
  const q = query(contactsCollectionRef, where("userId", "==", currentUserId ?? ""));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    contactsArr.push({ ...doc.data() as Contact });      
  });
  return contactsArr;
}

const getContactInfoInDatabaseFromId = async (contactId: string) => {
  let contact: Contact | null = null//= emptyContact

  const q = query(collection(fireStoreDb, "contacts"), where("id", "==", contactId));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    contact = { ...doc.data() as Contact };      
  });

  console.log("contact", contact)

  return contact
}




const getFilesFromDatabase = async (currentUserId: any) => {
  let filesArr: FileNameAndRefType[] = []
  const filesCollectionRef = collection(fireStoreDb, "files");
  const q = query(filesCollectionRef, where("userId", "==", currentUserId))

  const querySnapshot = await getDocs(q)

  querySnapshot.forEach((doc) => {
    filesArr.push({ ...doc.data() as FileNameAndRefType })
  });
  return filesArr
}

const getCategoriesFromDatabase = async (currentUserId: any) => {
  let catsArr: any[] = []
  const catsCollectionRef = collection(fireStoreDb, "categories");
  const q = query(catsCollectionRef, where("userId", "==", currentUserId))
  const querySnapshot = await getDocs(q)

  querySnapshot.forEach((doc) => {
    catsArr.push(doc.data())
  })
  return catsArr
}


// Bien mettre ASYNC / AWAIT sinon return catId sera exécuté avant que getDocs(q) ait terminé
const getCatIdFromLabel = async (currentUserId: any, catLabel: string) => {
  const filesCollectionRef = collection(fireStoreDb, "categories");
  const q = query(filesCollectionRef, where("userId", "==", currentUserId), where("label", "==", catLabel))

  const querySnapshot = await getDocs(q);
  let catId = ''
  querySnapshot.forEach((doc) => {
    catId = doc.data().id
  })
  return catId
}

const getCatLabelFromId = async (catId: string) => {
  const q = query(collection(fireStoreDb, "categories"), where("id", "==", catId));

  const querySnapshot = await getDocs(q);

  let label = ''
  querySnapshot.forEach((doc) => {
    label = doc.data().label
  })

  return label !== ""
    ? label
    : "NON DEFINIE"
}

const addFakeDataOnFirebaseAndReload = (currentUserId: any, fakeContactsData: Contact[]) => {
  const promises = fakeContactsData.map((contact: Contact) => {
    return addDoc(collection(fireStoreDb, "contacts"), { ...contact, id: uid(), userId: currentUserId })
      .then((docRef) => { console.log("Document written with ID: ", docRef.id); })
      .catch((error) => { console.error("Error adding document: ", error); });
  })
  return Promise.all(promises)
    .then(() => { window.location.reload() })
    .catch((error) => { console.error("Error reloading page: ", error); });
}

const addFakeDataOnFirebase = (currentUserId: any, fakeContactsData: Contact[]) => {
  const promises = fakeContactsData.map((contact: Contact) => {
    return addDoc(collection(fireStoreDb, "contacts"), { ...contact, id: uid(), userId: currentUserId })
      .then((docRef) => { console.log("***Document written with ID: ", docRef.id); })
      .catch((error) => { console.error("***Error adding document: ", error); });
  })
  return Promise.all(promises);
}


const addContactOnFirebaseAndReload = async (currentUserId: any, contact: Contact) => {
  try {
    const docRef = await addDoc(collection(fireStoreDb, "contacts"), { ...contact, userId: currentUserId });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
  window.location.reload()  
}

const addFileOnFirebaseDB = async (currentUserId: any, file: FileNameAndRefType) => {
  try {
    const docRef = await addDoc(collection(fireStoreDb, "files"), { ...file, userId: currentUserId });
    console.log("File written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding file: ", error);
  }
}

const addCategorieOnFirebase = (currentUserId: any, category: ContactCategorieType) => {
  console.log("add categorie", category)
  // Il faut bien mettre un RETURN ici sinon qd on appelle cette fonction dans addCategoriesOnFirebaseAndReload ça n'attend pas la fin du chargement
  return addDoc(collection(fireStoreDb, "categories"), { id: uid(), label: category.label, userId: currentUserId })
    .then((docRef) => { console.log("Document written with ID: ", docRef.id); })
    .catch((error) => { console.error("Error adding document: ", error); });
}


const addCategoriesOnFirebaseAndReload = (currentUserId: any) => {
  const promises = contactCategories.map((cat: ContactCategorieType) => {
    return addCategorieOnFirebase(currentUserId, cat)
  })
  Promise.all(promises)
    .then(() => { window.location.reload() })
    .catch((error) => { console.error("Error reloading page: ", error); });
}

const updatDataOnFirebase = async (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => {
  const q = query(collection(fireStoreDb, "contacts"), where("id", "==", id));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => { 
    updateDoc(doc.ref, {      
      [keyAndValue.key]: keyAndValue.value
    });
  })
}

const updatDataWholeContactOnFirebase = (contactToUpdate: Contact) => {
  const q = query(collection(fireStoreDb, "contacts"), where("id", "==", contactToUpdate.id));

  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {  
      updateDoc(doc.ref, {        // doc.ref est une ref à chaque enregistrement dans FIREBASE
        ...contactToUpdate
      });
    })
  })
}

const updateCategorieOnFirebase = (cat: ContactCategorieType) => {
  const q = query(collection(fireStoreDb, "categories"), where("id", "==", cat.id));

  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {     
      updateDoc(doc.ref, {        // doc.ref est une ref à chaque enregistrement dans FIREBASE
        label: cat.label
      });
    })
  })
}

const updateFileOnFirebase = (file: FileNameAndRefType) => {
  const q = query(collection(fireStoreDb, "files"), where("fileRef", "==", file.fileRef));

  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {    
      updateDoc(doc.ref, {       
        fileName: file.fileName
      });
    })
  })
}

const deleteAllDatasOnFirebaseAndReload = (currentUserId: any = null,) => {
  const contactsCollection = collection(fireStoreDb, "contacts");
  const q = currentUserId
    ? query(contactsCollection, where("userId", "==", currentUserId))
    : query(contactsCollection);

  getDocs(q).then((querySnapshot) => {

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    return Promise.all(deletePromises);

  }).then(() => {
    console.log("fin de la suppression")
    window.location.reload()  
  }) 
}

const deleteDataOnFirebaseAndReload = (contactId: string) => {
  const q = query(collection(fireStoreDb, "contacts"), where("id", "==", contactId));
  getDocs(q).then((querySnapshot) => {
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    return Promise.all(deletePromises);

  }).then(() => {
    window.location.reload()   
  })
}



const deleteCategorieOnFirebase = (catId: string) => {
  const q = query(collection(fireStoreDb, "contacts"), where("businessCategoryId", "==", catId));

  return getDocs(q).then((querySnapshot) => {

    if (!querySnapshot.empty) {
      throw new Error("Un contact est associé à cette catégorie.");
    } else {
      const q = query(collection(fireStoreDb, "categories"), where("id", "==", catId));
      return getDocs(q).then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      })
    }
  })
}

const handleOpenFile = async (file: any) => {

  const fileRef = ref(storage, `${file}`);

  const url = await getDownloadURL(fileRef);
  window.open(url, '_blank');
};


const getAllFirebaseUserDatasAndSave = async (currentUserId: any) => {  
    const contacts = await getUserContactsFromDatabase(currentUserId)
    const files = await getFilesFromDatabase(currentUserId)
    const categories = await getCategoriesFromDatabase(currentUserId)
  
    return { contacts, files, categories }
  }

export {
  fireStoreDb,
  realtimeDb,
  auth,
  storage,
  addFakeDataWithCat,
  addLaurianeDataWithCat,
  getUserContactsFromDatabase,
  getContactInfoInDatabaseFromId,
  getFilesFromDatabase,
  getCategoriesFromDatabase,
  addFakeDataOnFirebaseAndReload,
  addFakeDataOnFirebase,
  addContactOnFirebaseAndReload,
  addFileOnFirebaseDB,
  addCategoriesOnFirebaseAndReload,
  addCategorieOnFirebase,
  updatDataOnFirebase,
  updatDataWholeContactOnFirebase,
  updateCategorieOnFirebase,
  updateFileOnFirebase,
  deleteAllDatasOnFirebaseAndReload,
  deleteDataOnFirebaseAndReload,
  deleteCategorieOnFirebase,
  handleOpenFile,
  getCatLabelFromId,
  getCatIdFromLabel,
  getAllFirebaseUserDatasAndSave
}