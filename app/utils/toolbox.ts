import { Timestamp } from 'firebase/firestore';
import { useTheme } from '@mui/material/styles';
import { uid } from 'uid';

const emptyContact: Contact = {
    id: uid(),
    isClient: false,
    priority: null,
    contactType: "NON DEFINI",
    logo: '',
    businessName: '',
    denominationUsuelleEtablissement: [],
    businessCategoryId: "0",
    businessActivity: '',
    businessAddress: '',
    businessWebsite: '',
    businessPhone: '',
    businessEmail: '',
    businessCity: '',
    directorName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactPosition: '',
    hasBeenCalled: 0,
    hasBeenSentEmailOrMeetUp: 0,
    filesSentRef: [],
    tag: [],
    interestGauge: null,
    dateOfFirstCall: null,
    dateOfLastCall: null,
    dateOfNextCall: null,
    comments: '',
    userId: ''
}

const contactTypes: ContactTypeType[] = ["NON DEFINI", "Entreprise", "Particulier", "Partenaire"];

const timeStampObjToTimeStamp = (timeStampObj: Timestamp): number => {
    if (timeStampObj) {
        return Date.parse(timeStampObj.toDate().toString())
    }
    return 0
}

const timeStampToTimeStampObj = (timeStamp: any) => {
    if (timeStamp) {
        return Timestamp.fromDate(new Date(timeStamp))
    }
}

const isDateTimeStampObjPassed = (timeStamp: Timestamp) => {
    const timeStampNow = new Date().getTime()

    return timeStamp && (timeStampObjToTimeStamp(timeStamp) < timeStampNow)
}

const isDateTimeStampObjBeforeAWeek = (timeStamp: Timestamp) => {
    const timeStampNow = new Date().getTime()
    const timeStampInAWeek = timeStampNow + 7 * 24 * 60 * 60 * 1000

    return timeStamp && (timeStampObjToTimeStamp(timeStamp) > timeStampNow) && (timeStampObjToTimeStamp(timeStamp) < timeStampInAWeek)
}

const isDatePassed = (timeStampObj: Timestamp) => {
    const nowTimestamp = new Date().getTime()
    return timeStampObj && timeStampObjToTimeStamp(timeStampObj) < nowTimestamp
}

const isDateSoon = (timeStampObj: Timestamp | null) => {
    if (timeStampObj) {
        const date = timeStampObj?.toDate().toString()
        const timeStamp = Date.parse(date)
        const nowTimestamp = Date.parse(new Date().toString())
        const inAWeekTimeStamp = new Date().setDate(new Date().getDate() + 7)//.toString()           

        return (timeStamp > nowTimestamp) && (timeStamp < inAWeekTimeStamp)
    }
}

const countContactsByAlertDates = (contactsTab: Contact[]): Alerts => {
    let nbContactsWithDatePassed = 0
    let nbContactsWithDateSoon = 0

    contactsTab.forEach(contact => {
        if (contact.dateOfNextCall) {
            isDateTimeStampObjPassed(contact.dateOfNextCall) && nbContactsWithDatePassed++
            isDateTimeStampObjBeforeAWeek(contact.dateOfNextCall) && nbContactsWithDateSoon++
        }
    })
    return { nbContactsWithDatePassed, nbContactsDateSoon: nbContactsWithDateSoon }
}

const updatedContactsInLocalList = (contacts: Contact[], id: string, keyAndValue: { key: string, value: string | number | boolean | File[] | Timestamp | null }): Contact[] => {

    let tempUpdatedContacts: Contact[] = contacts.map(contact => {
        return contact.id === id ? { ...contact, [keyAndValue.key]: keyAndValue.value } : contact
    })
    return tempUpdatedContacts
}

const updatedContactsInLocalListWithWholeContact = (contacts: Contact[], contactToUpdate: Contact): Contact[] => {
    let tempUpdatedContacts: Contact[] = contacts.map(contact => {
        return contact.id === contactToUpdate.id ? contactToUpdate : contact
    })
    return tempUpdatedContacts
}

const getUniqueSortedValues = (contacts: Contact[], key: keyof Contact, caseSensitive: boolean = true) => {
    const allValues = caseSensitive
        ? contacts.map(contact => contact[key].trim())
        : contacts.map(contact => contact[key].trim().toUpperCase())   
    // On compte les occurrences de chaque valeur
    const counts: { [key: string]: number } = {};
    allValues.forEach(value => {
        counts[value] = (counts[value] || 0) + 1;
    });
    // On élimine les doublons et on les classe par ordre alphabétique
    const uniqueValues: { value: string, count: number }[] = Object.keys(counts).sort().map(value => ({
        value,
        count: counts[value]
    }));

    return uniqueValues
}

function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

function stringAvatar(name: string, logo: string) {
    const words = name.trim().split(' ');

    const initials = words.length > 1
        ? `${words[0][0]}${words[1][0]}`
        : words[0][0];

    return {
        sx: {
            backgroundColor: logo ? '' : stringToColor(name),
            width: 70,
            height: 70,
            //margin: "auto",
            cursor: "pointer"
        },
        children: initials,
    };
}

const TABS_WIDTH = 100

// Je ne peux pas mettre getPriorityTextAndColor ici car pour utiliser les thème on a besoin de useTheme qui est un hook => a utilisé seulement dans un composant ou un hook perso => donc je créé un hook perso
const useGetPriorityTextAndColor = () => {
    const muiTheme = useTheme();
    const getPriorityTextAndColor = (priority: number | null) => {
        switch (priority) {
            case 1: return {
                text: "Faible",
                color: muiTheme.palette.error.main,
                bgColor: "#f3d0d0"
            }
            case 2: return {
                text: "Moyenne",
                color: "lightsalmon",
                bgColor: "lightgoldenrodyellow"
            }
            case 3: return {
                text: "Haute",
                color: muiTheme.palette.primary.dark,
                bgColor: muiTheme.palette.lightCyan.light
            }
            default: return {
                text: "Aucune",
                color: muiTheme.palette.gray.dark,
                bgColor: "muiTheme.palette.gray.light  "
            }
        }
    }
    return getPriorityTextAndColor
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', 
    width: 400,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const commentsOptions = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        //[{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        //[{ 'direction': 'rtl' }],                         // text direction
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        //[{ 'font': ['comic-sans-ms', 'arial', 'courier-new', 'georgia', 'helvetica', 'lucida'] }],
        [{ 'align': [] }],
        ['clean'],                                         // remove formatting button
        ['link', 'image', 'video']                         // link and image, video
    ],
};

export {
    emptyContact,
    contactTypes,
    timeStampObjToTimeStamp,
    timeStampToTimeStampObj,
    isDateTimeStampObjPassed,
    isDateTimeStampObjBeforeAWeek,
    countContactsByAlertDates,
    updatedContactsInLocalList,
    updatedContactsInLocalListWithWholeContact,
    getUniqueSortedValues,
    isDatePassed,
    isDateSoon,
    stringAvatar,
    stringToColor,
    TABS_WIDTH,
    useGetPriorityTextAndColor,
    modalStyle,
    commentsOptions
}
