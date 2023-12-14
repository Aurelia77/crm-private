// nextjs firebase setup => https://www.youtube.com/watch?v=bReCIxeWayw&ab_channel=BradGarropy
// On pourrait mettre ces infos dans un fichier .env.local mais avec FIREBASE pas besoin car c'est sécurisé => FIREBASE SDK s'exécute directement à partir de notre FRONT END ou WEB APP => donc on peut tout COMMITER dans GITHUB.

//import firebase from "firebase/app"
//import "firebase/firestore"


import { initializeApp } from "firebase/app";
import { getDatabase, set } from "firebase/database";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { Timestamp } from 'firebase/firestore';
import { addDoc, collection, query, where, getDocs, onSnapshot, QuerySnapshot, deleteDoc, updateDoc, doc } from "firebase/firestore";

import { uid } from 'uid';
//import { User } from "firebase/auth/cordova";
import fakeContactsData from '../utils/contactsTest'
import { contactCategories } from '../utils/toolbox'


// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import { Firestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
// console.log(app)

// Avec FireStore
const fireStoreDb = getFirestore(app);

// Ou Avec RealTime Database(pas utilisée ici => car me mettait tous les contacts 2 fois !!!)
const realtimeDb = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

const storageRef = ref(storage);
// //console.log(storageRef)
const guadeloupeRef = ref(storage, 'guadeloupe.jpg');

// uploadBytes(guadeloupeRef, file).then((snapshot) => {
//     console.log('Uploaded a blob or file!');
// });

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

const addCatToFakeContacts = async (currentUser: any, fakeContactsData: Contact[]) => {

  console.log("****start addCatToFakeContacts")
  let promises: any = [];

  for (const fakeContact of fakeContactsData) {
      for (const contactNameAndCatLabel of fakeContactsNameAndCatLabel) {

          console.log("***contact", fakeContact.businessName, " - " ,contactNameAndCatLabel.name)

          if (fakeContact.businessName === contactNameAndCatLabel.name) {

              const catId = await getCatIdFromLabel(currentUser?.uid, contactNameAndCatLabel.catLabel);                    
              console.log("***cat du contact", contactNameAndCatLabel.catLabel)
              console.log("***catId", catId)


              getContactsFromDatabase(currentUser).then((contactsList) => {
                  const updatePromises = contactsList.map((firebaseContact) => {
                      if (firebaseContact.businessName === fakeContact.businessName) {
                          console.log("***", firebaseContact, catId)
                          return updatDataOnFirebase(firebaseContact.id, { key: "businessCategoryId", value: catId })
                      }
                  });
                  promises.push((updatePromises));
                  console.log("***promises", promises)    
              })

          }
      }
  }

  Promise.all(promises)
      .then(() => { 
          console.log("***Dans le THEN du PROMISE ALL")
          console.log("!!!!!!!!! CAT ATJOUTées !!!!!")
          window.location.reload() 
      })
      .catch((error) => { console.error("Error reloading page: ", error); });
}
const addFakeDataWithCat = async(currentUser: any) => {
  await addFakeDataOnFirebase(currentUser, fakeContactsData)            
  addCatToFakeContacts(currentUser, fakeContactsData)        
}


// 1-REALTIME DB
//const [todo, setTodo] = React.useState<string>('')
// Read
// React.useEffect(() => {
//     console.log("**UseEffect**")

//     // const contactRef = ref(realtimeDb, 'contacts/');
//     const contactRef = ref(realtimeDb);
//     onValue(contactRef, (snapshot) => {
//         const data = snapshot.val();
//         //console.log("data", data)
//         console.log(typeof data)

//         Object.values(data).map((contact: any) => {     // mettre type Contact
//             console.log(contact)
//             setContacts(prev => [...prev, contact])   // Pour pas avoir l'erreur : missing dependency: 'contacts'
//             //setContacts([...contacts, contact])      // Ne met que le dernier !!!
//             setLoading(false)
//         })
//         // const contacts = Object.values(data)
//         // console.log("contacts", contacts)
//         // setContacts(contacts)
//     });       
// }, [])
// => !!! Warning: Encountered two children with the same key, `1`. !!!

// const handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setTodo(event.target.value)
// }
// // Write
// function writeContactData2(
//     //contactId: string, name: string, email: string, imageUrl: string
// ) {
//     const id = uid()
//     // set(ref(db, 'contacts/' + uuid), { todo, uuid });
//     set(ref(realtimeDb, `/${id}`), { todo, id });
//     setTodo('')
// }
// function writeContactData(contact: any) {       // mettre type Contact !!!!!!
//     const id = contact.id
//     const businessName = contact.businessName
//     console.log("id", id)
//     console.log("businessName", businessName)
//     set(ref(realtimeDb, `/${id}`), { id, businessName });
// }
//writeContactData("andrew", "Andrew", "and@eee.fr", "https://blabla.com")



// 2-FIRESTORE DB

// Quand on ajoute / supprime un contact => on le fait dans la BDD firebase + on recharche la page.
// Mais quand on modifie un contact (dans ContactsTable) => on le fait dans le BDD firebase + on modifie le state contacts (pour pas recharger la page) 

//Write  

// DOC Firebase : https://firebase.google.com/docs/firestore/query-data/get-data?hl=fr
// const querySnapshot = await getDocs(collection(db, "cities"));
// querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
// });

// const readDataFromFirebaseAndSetContact = (currentUser: any, setLoading: any, setContacts: any) => {
//   // const readDataFromFirebase = (currentUser: User | null) => {
//   let contactsArr: Contact[] = []

//   const contactsCollectionRef = collection(fireStoreDb, "contacts");
//   const q =
//     //(filterName !== '')
//     //   ? query(contactsCollectionRef, where("userId", "==", currentUser?.uid ?? ""), where("businessName", ">=", filterName), where("businessName", "<=", filterName + "\uf8ff"))    // \uf8ff = "z
//     //   : 
//     query(contactsCollectionRef, where("userId", "==", currentUser?.uid ?? ""));
//   //const q = query(collection(fireStoreDb, "contacts"), where("userId", "==", currentUser?.uid ?? ""));
//   // const q = query(collection(fireStoreDb, "contacts"), where("userId", "==", currentUser?.uid ?? ""));

//   getDocs(q).then((querySnapshot) => {
//     //getDocs(collection(fireStoreDb, "contacts")).then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       //console.log(doc.data())
//     //console.log("contactsArr***", contactsArr)

//       contactsArr.push({ ...doc.data() as Contact })  // On indique que doc.data() est de type Contact           
//       //setContacts([...contacts, doc.data()])        // Non
//       //setContacts(prev => [...prev, doc.data()])    // Non
//     })
//     setLoading(false)
//     console.log("contactsArr", contactsArr)
//     setContacts(contactsArr)
//   });
//   // return () => {           // ? dans une vidéo : https://www.youtube.com/watch?v=-yrnWnN0g9o&ab_channel=DevWorld
//   //     unsub()
//   // }
// }


const getContactsFromDatabase = async (currentUser: any) => {
  // const readDataFromFirebase = (currentUser: User | null) => {
  let contactsArr: Contact[] = []
  const contactsCollectionRef = collection(fireStoreDb, "contacts");
  const q =
    //(filterName !== '')
    //   ? query(contactsCollectionRef, where("userId", "==", currentUser?.uid ?? ""), where("businessName", ">=", filterName), where("businessName", "<=", filterName + "\uf8ff"))    // \uf8ff = "z
    //   : 
    query(contactsCollectionRef, where("userId", "==", currentUser?.uid ?? ""));
  //const q = query(collection(fireStoreDb, "contacts"), where("userId", "==", currentUser?.uid ?? ""));
  // const q = query(collection(fireStoreDb, "contacts"), where("userId", "==", currentUser?.uid ?? ""));

  const querySnapshot = await getDocs(q);
  //getDocs(collection(fireStoreDb, "contacts")).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log("*/*/",doc.data())
    //console.log("contactsArr***", contactsArr)
    contactsArr.push({ ...doc.data() as Contact }); // On indique que doc.data() est de type Contact     
  });
  return contactsArr;
  // return () => {           // ? dans une vidéo : https://www.youtube.com/watch?v=-yrnWnN0g9o&ab_channel=DevWorld
  //     unsub()
  // }
}

const getFilesFromDatabase = async (currentUserId: any) => {

  console.log("getFilesFromDatabase", currentUserId)

  // const readDataFromFirebase = (currentUser: User | null) => {
  let filesArr: FileNameAndRefType[] = []
  const filesCollectionRef = collection(fireStoreDb, "files");
  const q = query(filesCollectionRef, where("userId", "==", currentUserId))

  const querySnapshot = await getDocs(q)

  querySnapshot.forEach((doc) => {

    console.log("*/*/ files - doc.data()", doc.data())

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

    console.log("*/*/ cat - doc.data()", doc.data())

    catsArr.push(doc.data())
  })
  return catsArr
}


// Bien mettre ASYNC / AWAIT sinon return catId sera exécuté avant que getDocs(q) ait terminé
const getCatIdFromLabel = async (currentUserId: any, catLabel: string) => {
  console.log("catLabel FIREBASE", catLabel)
  console.log(currentUserId)

  const filesCollectionRef = collection(fireStoreDb, "categories");
  const q = query(filesCollectionRef, where("userId", "==", currentUserId), where("label", "==", catLabel))

  const querySnapshot = await getDocs(q);

  console.log(querySnapshot)

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

const addFakeDataOnFirebaseAndReload = (currentUser: any, fakeContactsData: Contact[]) => {
  // fakeContactsData.map((contact: Contact) => {
  //   console.log(contact)
  //   console.log({
  //     ...contact, id: uid(), userId: currentUser?.uid
  //   })
  const promises = fakeContactsData.map((contact: Contact) => {
    return addDoc(collection(fireStoreDb, "contacts"), { ...contact, id: uid(), userId: currentUser?.uid })
      //addDoc(collection(fireStoreDb, "contacts"), {contact})
      .then((docRef) => { console.log("Document written with ID: ", docRef.id); })
      //.then(() => { window.location.reload() })     // NON ! Va pas recharcger à chaque fois
      .catch((error) => { console.error("Error adding document: ", error); });
  })
  //window.location.reload()    // On rafraichit => re-render => useEffect avec la lecture des données        // n'enregistre pas les données à chaque fois si je le mets ici !!!
  Promise.all(promises)
    .then(() => { window.location.reload() })
    .catch((error) => { console.error("Error reloading page: ", error); });
}

const addFakeDataOnFirebase = (currentUser: any, fakeContactsData: Contact[]) => {
  // fakeContactsData.map((contact: Contact) => {
  //   console.log(contact)
  //   console.log({
  //     ...contact, id: uid(), userId: currentUser?.uid
  //   })
  const promises = fakeContactsData.map((contact: Contact) => {
    return addDoc(collection(fireStoreDb, "contacts"), { ...contact, id: uid(), userId: currentUser?.uid })
      //addDoc(collection(fireStoreDb, "contacts"), {contact})
      .then((docRef) => { console.log("***Document written with ID: ", docRef.id); })
      //.then(() => { window.location.reload() })     // NON ! Va pas recharcger à chaque fois
      .catch((error) => { console.error("***Error adding document: ", error); });
  })

  return Promise.all(promises);
}


const addContactOnFirebaseAndReload = async (currentUser: any, contact: Contact) => {
  console.log("add contact", contact)
  console.log({ ...contact, id: uid() })

  try {
    const docRef = await addDoc(collection(fireStoreDb, "contacts"), { ...contact, userId: currentUser.uid });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }

  console.log("****************//////////////FINI ///////////**********")

  window.location.reload()    // On rafraichit => re-render => useEffect avec la lecture des données
}

const addFileOnFirebaseDB = async (currentUserId: any, file: FileNameAndRefType) => {

  console.log(file.fileName)

  try {
    const docRef = await addDoc(collection(fireStoreDb, "files"), { ...file, userId: currentUserId });
    console.log("File written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding file: ", error);
  }

  console.log("****************//////////////FINI ///////////**********")

  //alert("Fichier ajouté !")

  //window.location.reload()    // On rafraichit => re-render => useEffect avec la lecture des données
}

const addCategorieOnFirebase = (currentUserId: any, category: ContactCategorieType) => {
  console.log("add categorie", category)

  // Il faut bien mettre un RETURN ici sinon qd on appelle cette fonction dans addCategoriesOnFirebaseAndReload ça n'attend pas la fin du chargement
  return addDoc(collection(fireStoreDb, "categories"), { id: uid(), label: category.label, userId: currentUserId })
    .then((docRef) => { console.log("Document written with ID: ", docRef.id); })
    .catch((error) => { console.error("Error adding document: ", error); });
}


const addCategoriesOnFirebaseAndReload = (currentUser: any) => {

  const promises = contactCategories.map((cat: ContactCategorieType) => {
    console.log("cat", cat)
    return addCategorieOnFirebase(currentUser?.uid, cat)
  })

  // const promises = categories.map((cat: ContactCategorieType) => {
  //   console.log("cat", cat)

  //   return addDoc(collection(fireStoreDb, "categories"), {id: uid(), label: cat.label, userId: currentUser?.uid })
  //     .then((docRef) => { console.log("Document written with ID: ", docRef.id); })
  //     .catch((error) => { console.error("Error adding document: ", error); });
  // })

  Promise.all(promises)
    .then(() => { window.location.reload() })
    .catch((error) => { console.error("Error reloading page: ", error); });
}




// const addContactOnFirebase = (currentUser: any, contact: Contact) => {
//   console.log("add contact", contact)
//   console.log({ ...contact, id: uid() })

//   return addDoc(collection(fireStoreDb, "contacts"), { ...contact, userId: currentUser?.uid })
//     .then((docRef) => { console.log("Document written with ID: ", docRef.id); })
//     .catch((error) => { console.error("Error adding document: ", error); });
// }

// const addContactOnFirebaseAndReload = async (currentUser: any, contact: Contact) => {
//   console.log("add contact", contact)
//   console.log({ ...contact, id: uid() })

//   await addContactOnFirebase(currentUser, contact)
//   window.location.reload()
// }







// //moi
// const addContactOnFirebase = async (currentUser: any, contact: Contact) => {
//   console.log("add contact", contact)
//   console.log({ ...contact, id: uid() })

//   // addDoc(collection(fireStoreDb, "contacts"), { ...contact, id: uid(), userId: currentUser?.uid })
//   try {
//     const docRef = await addDoc(collection(fireStoreDb, "contacts"), { ...contact, userId: currentUser?.uid });
//     console.log("Document written with ID: ", docRef.id);
//   } catch (error) {
//     console.error("Error adding document: ", error);
//   }
//   //window.location.reload()    // On rafraichit => re-render => useEffect avec la lecture des données
// }

// const addContactOnFirebaseAndReload = async (currentUser: any, contact: Contact) => {
//   console.log("add contact", contact)
//   console.log({ ...contact, id: uid() })

//   await addContactOnFirebase(currentUser, contact)
//   window.location.reload()
// }







// const addContactOnFirebaseAndReload = (currentUser: any, contact: Contact) => {
//   console.log("add contact", contact)
//   console.log({ ...contact, id: uid() })

//   addContactOnFirebase(currentUser, contact)
//   window.location.reload()    // On rafraichit => re-render => useEffect avec la lecture des données
// }



// const updateContactInContactsAndDB = (updatingContact: Contact) => {     // ou selectedContact
//     console.log("updatingContact", updatingContact)
//
//     // if (movieEdited.name === '') {
//     //     alert("Ajouter un nom de film")
//     // }
//     // else if (movieEdited.category === '') {
//     //     alert("Ajouter une catégorie de film")
//     // }
//     // else if (movieEdited.year === 0) {
//     //     alert("Ajouter une année de visionnage")
//     // }
//     // else {
//
//     // On met à jour le tableau en remplaçant le contact qui a le même id que celui qu'on a sélectionné par le film sélectionné
//     let updatedContacts = contacts.map(contact => contact.id === updatingContact.id ? updatingContact : contact)
//     //setmoviesList(sortArrayBy(updatedMovies, orderedBy))
//     setContacts(updatedContacts)

//     //writeContactData(updatingContact)
//     // On met à jour le contact dans la BDD fireStore : firestoreDB
//     const q = query(collection(fireStoreDb, "contacts"), where("id", "==", updatingContact.id));
//     let docID = '';
//
//     getDocs(q).then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             console.log(doc.data())
//             console.log(doc.ref)
//
//             docID = doc.id;
//             //set(doc.ref, updatingContact)
//         })
//         const contact = doc(fireStoreDb, "contacts", docID);
//
//         // Set the "capital" field of the city 'DC'
//         updateDoc(contact, {
//             ...updatingContact
//         });
//     })   
// }

// 2 fonctions pour mettre à jour le contact dans le tableau contacts et dans la BDD fireStore : firestoreDB



const updatDataOnFirebase = async (id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }) => {
  // const contactToUpdateRef = doc(fireStoreDb, "contacts", id);
  console.log("***Contact to update", id, keyAndValue.key, keyAndValue.value)

  // updateDoc(contactToUpdateRef, {
  //     [keyAndValue.key]: keyAndValue.value
  // });
  const q = query(collection(fireStoreDb, "contacts"), where("id", "==", id));

  const querySnapshot = await getDocs(q);
  //getDocs(q).then((querySnapshot) => {    // A la place de la ligne ci-dessus si on vt fonction NON Async !
  querySnapshot.forEach((doc) => {        // besoin du FOREACH alors qu'il n'y en a qu'un ???
    //console.log(doc.data())
    //console.log(doc.ref)
    //console.log(doc.id)
    console.log("FIREBASE", keyAndValue.key, keyAndValue.value)
    //docID = doc.id;
    updateDoc(doc.ref, {        // doc.ref est une ref à chaque enregistrement dans FIREBASE
      [keyAndValue.key]: keyAndValue.value
    });
    //set(doc.ref, updatingContact)
  })
  // })
}

const updatDataWholeContactOnFirebase = (contactToUpdate: Contact) => {
  // const contactToUpdateRef = doc(fireStoreDb, "contacts", id);
  // console.log(contactToUpdateRef)

  // // Set the "capital" field of the city 'DC'
  // updateDoc(contactToUpdateRef, {
  //     [keyAndValue.key]: keyAndValue.value
  // });
  const q = query(collection(fireStoreDb, "contacts"), where("id", "==", contactToUpdate.id));

  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {        // besoin du FOREACH alors qu'il n'y en a qu'un ???
      //console.log(doc.data())
      //console.log(doc.ref)
      //console.log(doc.id)
      // console.log("FIREBASE", keyAndValue.key, keyAndValue.value)
      //docID = doc.id;

      updateDoc(doc.ref, {        // doc.ref est une ref à chaque enregistrement dans FIREBASE
        ...contactToUpdate
      });

      // updateDoc(doc.ref, {        // doc.ref est une ref à chaque enregistrement dans FIREBASE
      //   [keyAndValue.key]: keyAndValue.value
      // });
      //set(doc.ref, updatingContact)
    })
  })
}

const updateCategorieOnFirebase = (cat: ContactCategorieType) => {

  const q = query(collection(fireStoreDb, "categories"), where("id", "==", cat.id));

  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {        // besoin du FOREACH alors qu'il n'y en a qu'un ???

      updateDoc(doc.ref, {        // doc.ref est une ref à chaque enregistrement dans FIREBASE
        label: cat.label
      });
      //set(doc.ref, updatingContact)
    })
  })
}

const updateFileOnFirebase = (file: FileNameAndRefType) => {

  const q = query(collection(fireStoreDb, "files"), where("fileRef", "==", file.fileRef));

  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {        // besoin du FOREACH alors qu'il n'y en a qu'un ???

      updateDoc(doc.ref, {        // doc.ref est une ref à chaque enregistrement dans FIREBASE
        fileName: file.fileName
      });
      //set(doc.ref, updatingContact)
    })
  })
}



const deleteAllDatasOnFirebaseAndReload = (currentUser: any = null,) => {

  const contactsCollection = collection(fireStoreDb, "contacts");
  const q = (currentUser)
    ? query(contactsCollection, where("userId", "==", currentUser.uid))
    : query(contactsCollection);

  // const q = onlyFromConnectedUser ? query(collection(fireStoreDb, "contacts"), where("userId", "==", currentUser?.uid ?? ""))
  //             : query(collection(fireStoreDb, "contacts"));

  getDocs(q).then((querySnapshot) => {

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    return Promise.all(deletePromises);

    // 2 lignes ci-dessus au lieu de ça => a l'air de fonctionné à chaque fois... Sinon pas tjs ! (donné par GitCopilot)
    // querySnapshot.forEach((doc) => {
    //     console.log(doc.data())
    //     console.log(doc.ref)
    //     deleteDoc(doc.ref)
    // })
  }).then(() => {
    console.log("fin de la suppression")
    window.location.reload()    // On rafraichit => re-render => useEffect avec la lecture des données
  })

  //Marche pas !!!
  // fireStoreDb.collection("contacts").document("DC").delete() { err in
  //     if let err = err {
  //         print("Error removing document: \(err)")
  //     } else {
  //         print("Document successfully removed!")
  //     }
  // }

  // collection(fireStoreDb, "contacts").get().then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //         deleteDoc(doc.ref)
  //     });
  // });
}

const deleteDataOnFirebaseAndReload = (contactId: string) => {
  const q = query(collection(fireStoreDb, "contacts"), where("id", "==", contactId));
  getDocs(q).then((querySnapshot) => {
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    return Promise.all(deletePromises);

    // 2 lignes ci-dessus au lieu de ça => a l'air de fonctionné à chaque fois... Sinon pas tjs ! (donné par GitCopilot) => Pourtant qu'un seul doc à supprimer donc nécessaire d'avoir Promise.all ????
    // querySnapshot.forEach((doc) => {
    //     console.log(doc.data())
    //     console.log(doc.ref)
    //     deleteDoc(doc.ref)
    // })
  }).then(() => {
    window.location.reload()    // On rafraichit => re-render => useEffect avec la lecture des données
  })
}

// const deleteCategorieOnFirebase = async (catId: string) => {
//   if (catId === 'invalid') {
//     throw new Error('Une erreur est survenue');
//   }

//   // Reste de la logique de la fonction
// };

const deleteCategorieOnFirebase2 = (catId: string) => {
  return new Promise((resolve, reject) => {
    // Simuler une opération asynchrone
    setTimeout(() => {
      if (catId !== 'invalid') {
        reject('Une erreur est survenue');
      } else {
        resolve('Succès');
      }
    }, 1000);
  });
};



const deleteCategorieOnFirebase = (catId: string) => {
  console.log("catId", catId)

  const q = query(collection(fireStoreDb, "contacts"), where("businessCategoryId", "==", catId));

  return getDocs(q).then((querySnapshot) => {
    console.log("querySnapshot", querySnapshot.docs)

    if (!querySnapshot.empty) {
      throw new Error("Un contact est associé à cette catégorie.");
    } else {
      const q = query(collection(fireStoreDb, "categories"), where("id", "==", catId));
      return getDocs(q).then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
        // Marche aussi mais pas besoin de Promise.all car une seule cat à supp !
        // const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
        // return Promise.all(deletePromises);
      })
      // Chat copilote : mais marche pas !!! :
      // const docRef = doc(fireStoreDb, "categories", catId);
      // return deleteDoc(docRef);
    }
  })
  // Ne pas mettre le CATCH ici sinon si on ut cette fonction ailleurs, on ne pourra pas gérer l'erreur => il faut mettre le CATCH dans l'autre fonciton !!!
  //.catch((error) => {
  //   console.error("Erreur lors de la suppression de la catégorie : ", error);
  // });
}








const handleOpenFile = async (file: any) => {

  // console.log(file)
  // const segments = file.split('/');
  // const fileName = segments[segments.length - 1];

  // console.log('File name:', fileName);

  // const nameParts = fileName.split('.');
  // const extension = nameParts[nameParts.length - 1];

  // console.log('File extension:', extension);

  const fileRef = ref(storage, `${file}`);

  const url = await getDownloadURL(fileRef);
  window.open(url, '_blank');
};


const getAllFirebaseUserDatasAndSave = async (currentUser: any) => {
  
    const contacts = await getContactsFromDatabase(currentUser)
    const files = await getFilesFromDatabase(currentUser.uid)
    const categories = await getCategoriesFromDatabase(currentUser.uid)
  
    return { contacts, files, categories }
  }






export {
  fireStoreDb,
  realtimeDb,
  auth,
  storage,
  addFakeDataWithCat,
  //readDataFromFirebaseAndSetContact,
  getContactsFromDatabase,
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



// function writeContactData(contactId: string, name: string, email: string, imageUrl: string) {
//   const db = getDatabase()
//   console.log(db)
//   //const db = getFirestore(app);
//   const reference = ref(db, 'contacts/' + contactId)
//   console.log(reference)

//   set(reference, {
//     username: name,
//     email: email,
//     profile_picture: imageUrl
//   });
// }

// export default writeContactData



//async function getContacts(db: Firestore) {
//   const contactsCol = collection(db, 'contacts');
//   console.log(contactsCol)
//   const contactSnapshot = await getDocs(contactsCol);
//   console.log(contactSnapshot)
//   const contactList = contactSnapshot.docs.map(doc => doc.data());
//   console.log(contactList)
//   return contactList;
// }

// console.log(getContacts(db))

// export default getContacts
// Get a list of cities from your database
//






// Dans vidéo (on initialise l'app de firebase si il n'y en a pas déja) => apps = liste des app qui sont initialisées
// if (!firebase.getApps.length) {
//     firebase.initializeApp(firebaseConfig)
// }
// const firestore = firebase.firestore()

// export { firestore }

// A mettre dans CONTACT.js (???, vidéo)
// const getContacts = async () => {       // Asynchrone car on va chercher sur le réseau des données dans la base de données FIRESTORE
//   const contacts = await firestore.collection("contacts").get()   // On va chercher le COLLECTION Contacts
//   contacts.docs.forEach(contact => {
//       console.log(contact)
//   });
// }
