import { Timestamp } from 'firebase/firestore';


const timeStampObjToTimeStamp = (timeStampObj: Timestamp): number => {
    if (timeStampObj) {
        // console.log(timeStampObj)                           // Timestamp {seconds: 1700147570, nanoseconds: 377000000} 
        // // Date format Objet       
        // console.log(timeStampObj.toDate())                  // Thu Nov 16 2023 16:12:50 GMT+0100 (heure normale d’Europe centrale)
        // console.log(typeof timeStampObj.toDate());          // object
        // console.log(timeStampObj.toDate().getTime())        // 1698710400000 (timestamp)
        // // Date format string
        // console.log(timeStampObj.toDate().toString())       // Thu Nov 16 2023 16:12:50 GMT+0100 (heure normale d’Europe centrale)
        // console.log(typeof timeStampObj.toDate().toString()); // string
        // console.log(Date.parse(timeStampObj.toDate().toString()))     // 1698710400000 (timestamp)
        return Date.parse(timeStampObj.toDate().toString())
    }
    return 0   
}
const timeStampToTimeStampObj = (timeStamp: any) => {
    if (timeStamp) {
        // console.log(timeStamp)                         // 1701388800000
        // console.log(new Date (timeStamp))             // Fri Dec 01 2023 01:00:00 GMT+
        // console.log(typeof new Date (timeStamp))      // object
        // console.log(Timestamp.fromDate(new Date (timeStamp)))   // Timestamp {seconds: 1701388800, nanoseconds: 0}      
        return Timestamp.fromDate(new Date (timeStamp))
    }   
}

const isDateTimeStampObjPassed = (timeStamp: Timestamp) => {
    const timeStampNow = new Date().getTime()

    return timeStamp && (timeStampObjToTimeStamp(timeStamp) < timeStampNow) 
}
const isDateTimeStampObjBeforeAWeek = (timeStamp: Timestamp) => {
    const timeStampNow = new Date().getTime()
    const timeStampInAWeek = timeStampNow + 7 * 24 * 60 * 60 * 1000

    return timeStamp && (timeStampObjToTimeStamp(timeStamp) > timeStampNow) &&  (timeStampObjToTimeStamp(timeStamp) < timeStampInAWeek)   
}

const countContactsByAlertDates = (contactsTab: Contact[]) => {
    let nbContactWithDatePassed = 0
    let nbContactWithDateSoon = 0

    contactsTab.forEach(contact => {
        if (contact.dateOfNextCall) {
            isDateTimeStampObjPassed(contact.dateOfNextCall) && nbContactWithDatePassed++
            isDateTimeStampObjBeforeAWeek(contact.dateOfNextCall) && nbContactWithDateSoon++
        }              
    })
    return { nbContactWithDatePassed, nbContactWithDateSoon }
}

const updateContactsInLocalList = (contacts: Contact[], id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }): Contact[] => {
    console.log("xxxLOCAL", keyAndValue.key, keyAndValue.value)

    let tempUpdatedContacts: Contact[] = contacts.map(contact => {
        return contact.id === id ? { ...contact, [keyAndValue.key]: keyAndValue.value } : contact
    })

    return tempUpdatedContacts
}

const getUniqueSortedValues = (contacts: Contact[], key: keyof Contact) => {

    const allValues = contacts.map(contact => contact[key])

    // On élimine les doublons
    const uniqueValues = allValues.filter((value, index, self) => self.indexOf(value) === index);

    // On les classe par ordre alphabétique
    uniqueValues.sort((a, b) => {
        if (a < b) return -1
        if (a > b) return 1
        return 0;
    })

    return uniqueValues
}


export { 
    timeStampObjToTimeStamp,
    //timeStampToTimeStampObj,
    isDateTimeStampObjPassed,
    isDateTimeStampObjBeforeAWeek,
    countContactsByAlertDates,
    updateContactsInLocalList,
    getUniqueSortedValues
 }
