// nextjs firebase setup => https://www.youtube.com/watch?v=bReCIxeWayw&ab_channel=BradGarropy
// On pourrait mettre ces infos dans un fichier .env.local mais avec FIREBASE pas besoin car c'est sécurisé => FIREBASE SDK s'exécute directement à partir de notre FRONT END ou WEB APP => donc on peut tout COMMITER dans GITHUB.

//import firebase from "firebase/app"
//import "firebase/firestore"


import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getFirestore } from 'firebase/firestore';


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
  appId: "1:882348983292:web:80587c355b2aae72702879"
};

//export default firebaseConfig


// Initialize Firebase
const app = initializeApp(firebaseConfig); 
// console.log(app)

// Avec RealTime Database
export const realtimeDb = getDatabase(app);

// Ou avec FireStore
export const fireStoreDb = getFirestore(app);

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
