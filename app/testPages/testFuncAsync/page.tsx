'use client'

import { Box, Button } from '@mui/material';
import React from 'react'
import { addDoc, collection, query, where, getDocs, onSnapshot, QuerySnapshot, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

export default function TestAsync() {

  ///////////// TEST PROMESSES   
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


  console.log("0000000")

  const isOk: boolean = false

  
  
  console.log('%c Fonction ASYNCHRONE', 'color: tomato')
  console.log('%c callFunctAsyncReturnPromise', 'color: MediumTurquoise')
  console.log('%c callFunctAsyncReturnRESULT', 'color: MediumSpringGreen')
  console.log('%c    color: LightCoral', 'color: LightCoral')
console.log('%c    color: HotPink', 'color: HotPink')


  //Pas une fonct ASYNC
  const functNonAsync = () => {
    console.log("111-START Fonction NON ASYNC")

    // Funct ASYNC
    setTimeout(() => {
      console.log("333-TimeOut (ASYNC) FINI !!!")
    }, 3000)

    console.log("222-Pendant la fonct NON ASYNC, qui contient le TimeOut (ASYNC) => s'affiche avant la FIN !")
  }


  //Fonct ASYNC
    //const functAsync = async () => {// On peut ajouter ASYNC / AWAIT (await avant new Promise) => mais pas obligatoire
  const functAsync = () => {
    console.log('%c 111-START Fonction ASYNC', 'color: tomato');


    // On demande d'ATTENDRE que la PROMESSE soit RESOLUE pour faire des choses
    // MAIS LA PROMESSE EST RETOURNée de suite ! C'est le résultat qui sera retourné PLUS TARD !!!!
    return new Promise<string>((resolve, reject) => { // TS: <string> => On indique le type de la PROMESSE (si resolve() alors on aurait mis <viod>)
      console.log("%c 1212-début PROMESSE", 'color: tomato');

      setTimeout(() => {
        console.log("%c 222-PLUS TARD : TimeOut (ASYNC) FINI !!! Le résultat est :", 'color: tomato');

        //isOk ? resolve("OK") : reject("NOT OK")
        if (isOk) {
          console.log("%c 333-RESOLVE", 'color: tomato');
          resolve("OK")
        } else {
          console.log("%c 333-REJECT", 'color: tomato');
          reject("NOT OK")
        }
      }, 3000);
    })
  }

  //Fonct qui appelle une FONCT ASYNC et retourne une PROMESSE
  const callFunctAsyncReturnPromise = () => {
    console.log("%c 111-START Fonction qui appelle une FONCT ASYNC", 'color: MediumTurquoise')

    const result = functAsync()

    console.log("%c 222-S'affiche AVANT le résultat de la FONCT ASYNC car la PROMESSES est retourné de suite, le RESULTAT plus tard", 'color: MediumTurquoise', result)  // RESULT est une PROMESSE (avec un State, un Result : pending, fulfilled, ou rejected)         
  }


  //Fonct qui appelle une FONCT ASYNC et retourne le RESULTAT de la promesse
  const callFunctAsyncReturnRESULT = async () => {
    console.log("111-START Fonction qui appelle une FONCT ASYNC", 'color: MediumSpringGreen')

    functAsync().then((result) => {
      console.log("%c 333-S'affiche APRES le résultat de la FONCT ASYNC => le résultat est :", 'color: MediumSpringGreen', result)  // RESULT est une PROMESSE (avec un State, un Result : pending, fulfilled, ou rejected) 
    })
    // Si on met pas le CATCH et que c'est un REJECT => erreur en rouge dans la console.
    .catch((error) => {
      console.log("%c 333-erreur : ", 'color: MediumSpringGreen', error)
    })

    console.log("%c 222- S'affiche AVANT ", 'color: MediumSpringGreen')
  }

  
  const getCategoriesFromDatabase = async () => {
    console.log('%c 111-START Fonction ASYNC getCategoriesFromDatabase', 'color: tomato');

    const userA_Id = "9toBAMERXdV9TTGHZDSt6qJoxvf2"    
    let catsArr: any[] = []

    const catsCollectionRef = collection(fireStoreDb, "categories");
    const q =  query(catsCollectionRef, where("userId", "==", userA_Id))  
    const querySnapshot = await getDocs(q)
  
    querySnapshot.forEach((doc) => {      
      //console.log(doc.data())         // Données d'une cat (ex: {id: '6ef4ff40702', label: 'Plage Privée', userId: '9toBAMERXdV9TTGHZDSt6qJoxvf2'})
      
      catsArr.push(doc.data()) 
    })

    console.log("%c 222-RESULTATS ", 'color: tomato', catsArr)   // Toutes les cats

    return catsArr
  }

  const displayCat = async () => {
    console.log("%c 111-START Fonction displayCat qui appelle FONCT ASYNC", 'color: MediumTurquoise')

    const catsArr = await getCategoriesFromDatabase()
    console.log("%c 222-catsArr", 'color: MediumTurquoise', catsArr)
  }





  return (
    <Box>
      <Button
        onClick={functNonAsync}
        sx={{ margin: "30px 0 0 500px" }}
        variant="contained" > TEST funct NON ASYNC</Button>
      <Button
        color="secondary"
        onClick={functAsync}
        sx={{ margin: "30px 0 0 500px" }}
        variant="contained" > TEST funct ASYNC</Button>
      <Button
        color="success"
        onClick={callFunctAsyncReturnPromise}
        sx={{ margin: "30px 0 0 500px" }}
        variant="contained" > Appelle funct ASYNC + retourn PROMISE</Button>
      <Button
        color="warning"
        onClick={callFunctAsyncReturnRESULT}
        sx={{ margin: "30px 0 0 500px" }}
        variant="contained" > Appelle funct ASYNC et retourne le RESULTAT</Button>
      <Button
        onClick={displayCat}
        sx={{ margin: "30px 0 0 500px" }}
        variant="contained" >displayCat</Button>
    </Box>

  )
}
