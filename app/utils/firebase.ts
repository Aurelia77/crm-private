import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Timestamp } from 'firebase/firestore';
import { addDoc, collection, query, where, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";

import { uid } from 'uid';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Google Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Avec FireStore
const fireStoreDb = getFirestore(app);

// Ou Avec RealTime Database(pas utilisée ici => car me mettait tous les contacts 2 fois !!!) (utilise databaseURL de firebaseConfig)
//const realtimeDb = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
// Initialize Performance Monitoring and get a reference to the service
//const perf = getPerformance(app);

const getUserContactsFromDatabase = async (currentUserId: string | undefined) => {
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
  let contact: Contact | null = null
  const q = query(collection(fireStoreDb, "contacts"), where("id", "==", contactId));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    contact = { ...doc.data() as Contact };
  });

  return contact
}

const getFileNameFromRef = async (fileRef: string) => {
  let fileName = ""
  const q = query(collection(fireStoreDb, "files"), where("fileRef", "==", fileRef));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    fileName = doc.data().fileName
  });

  return fileName
}

const getFilesFromDatabase = async (currentUserId: string | undefined) => {
  let filesArr: FileNameAndRefType[] = []
  const filesCollectionRef = collection(fireStoreDb, "files");
  const q = query(filesCollectionRef, where("userId", "==", currentUserId))

  const querySnapshot = await getDocs(q)

  // Seulement les fichiers (pas les logo !)
  const fileRefPath = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/filesSent`

  querySnapshot.forEach((doc) => {
    if (doc.data().fileRef.startsWith(fileRefPath)) {
      filesArr.push(doc.data() as FileNameAndRefType)
    }
  });

  return filesArr
}

const getCategoriesFromDatabase = async (currentUserId: string | undefined) => {
  let catsArr: any[] = []
  const catsCollectionRef = collection(fireStoreDb, "categories");
  const q = query(catsCollectionRef, where("userId", "==", currentUserId))
  const querySnapshot = await getDocs(q)

  querySnapshot.forEach((doc) => {
    catsArr.push(doc.data())
  })

  return catsArr
}

// Bien mettre ASYNC / AWAIT sinon return catId=... sera exécuté avant que getDocs(q) ait terminé
const getCatIdFromLabel = async (currentUserId: string | undefined, catLabel: string) => {
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

const addContactOnFirebaseAndReload = async (currentUserId: string | undefined, contact: Contact) => {
  try {
    const docRef = await addDoc(collection(fireStoreDb, "contacts"), { ...contact, userId: currentUserId });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
  window.location.reload()
}

const addFileOnFirebaseDB = async (currentUserId: string | undefined, file: FileNameAndRefType) => {
  try {
    const docRef = await addDoc(collection(fireStoreDb, "files"), { ...file, userId: currentUserId });
    console.log("File written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding file: ", error);
  }
}

const addCategorieOnFirebase = (currentUserId: string | undefined, category: ContactCategorieType) => {
  // Il faut bien mettre un RETURN ici sinon qd on appelle cette fonction dans addCategoriesOnFirebaseAndReload ça n'attend pas la fin du chargement
  return addDoc(collection(fireStoreDb, "categories"), { id: uid(), label: category.label, userId: currentUserId })
    .then((docRef) => { console.log("Document written with ID: ", docRef.id); })
    .catch((error) => { console.error("Error adding document: ", error); });
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
      updateDoc(doc.ref, {  // doc.ref : ref à chaque enregistrement dans FIREBASE
        ...contactToUpdate
      });
    })
  })
}

const updateCategorieOnFirebase = (cat: ContactCategorieType) => {
  const q = query(collection(fireStoreDb, "categories"), where("id", "==", cat.id));

  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {  
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

const deleteAllDatasOnFirebaseAndReload = (currentUserId: any,) => {
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

const deleteAllMyCatsOnFirebase = (currentUserId: any,) => {
  const catsCollection = collection(fireStoreDb, "categories");
  const q = currentUserId
    ? query(catsCollection, where("userId", "==", currentUserId))
    : query(catsCollection);

  getDocs(q).then((querySnapshot) => {
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));

    return Promise.all(deletePromises);
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

const getAllFirebaseUserDatasAndSave = async (currentUserId: string | undefined) => {
  const contacts = await getUserContactsFromDatabase(currentUserId)
  const files = await getFilesFromDatabase(currentUserId)
  const categories = await getCategoriesFromDatabase(currentUserId)

  return { contacts, files, categories }
}

export {
  fireStoreDb,
  auth,
  storage,
  getUserContactsFromDatabase,
  getContactInfoInDatabaseFromId,
  getFileNameFromRef,
  getFilesFromDatabase,
  getCategoriesFromDatabase,
  addContactOnFirebaseAndReload,
  addFileOnFirebaseDB,
  addCategorieOnFirebase,
  updatDataOnFirebase,
  updatDataWholeContactOnFirebase,
  updateCategorieOnFirebase,
  updateFileOnFirebase,
  deleteAllDatasOnFirebaseAndReload,
  deleteAllMyCatsOnFirebase,
  deleteDataOnFirebaseAndReload,
  deleteCategorieOnFirebase,
  handleOpenFile,
  getCatLabelFromId,
  getCatIdFromLabel,
  getAllFirebaseUserDatasAndSave,
}