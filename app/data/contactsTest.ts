import { emptyContact } from '../utils/toolbox'

const contacts : Contact[] = [
    {
        ...emptyContact,
        isClient : false,
        contactType : "Entreprise",
        logo : "",
        businessName: "Camping Hyères",
        denominationUsuelleEtablissement : [],
        interestGauge: 4,
        businessActivity: "55.3",
        businessPhone: "06.12.15.12.15",
        businessEmail: "",
        businessAddress: "2 rue de la paix 83000 Hyères",
        businessWebsite : "https://www.pierreetvacances.com/fr", 
        businessCity: "Hyères",
        directorName: 'Mr LE CHEF',
        contactName: "Mathieu BLANC",
        contactPhone: "",
        contactEmail: "mblanc@gmail.com",
        contactPosition: "Animateur",
        hasBeenCalled: 1,
        hasBeenSentEmailOrMeetUp: 1,
        filesSentRef: [],
        tag: ["camping", "client"],
        dateOfFirstCall: new Date("2023-10-10"),
        dateOfLastCall: new Date("2023-10-24"),
        dateOfNextCall: new Date("2024-02-29"),
        comments: `2023-10-10 : Appel mais pas de réponse. Il faut rappeler dans 2 semaines. 
        2023-10-24 : Je leur ai parlé longuement. Ils ont l'air très intéressés par mes prestations. Vont en parler au responsable et me recontactent bientôt.
        A voir si pas de rappel dans 1 semaine, les recontacter ! `,
        userId: "",
    },
    {
        ...emptyContact,
        isClient : true,
        priority: 3,
        contactType : "Entreprise",
        logo : "",
        businessName: "Camping St Tropez",
        denominationUsuelleEtablissement : [],
        interestGauge: 5,
        businessActivity: "55.3",
        businessPhone: "06.12.15.12.15",
        businessEmail: "",
        businessAddress: "6 rue de la paix 83000 Hyères",
        businessWebsite : "https://www.pierreetvacances.com/fr", 
        businessCity: "St Tropez",
        contactName: "Mr Martin",
        contactPhone: "06.12.34.56.78",
        contactEmail: "martin@gmail.com",
        contactPosition: "Responsable des animations",
        hasBeenCalled: 1,
        hasBeenSentEmailOrMeetUp: 3,
        filesSentRef: [ ],
        tag: ["camping", "client"],
        dateOfFirstCall: new Date("2023-05-01"),
        dateOfLastCall: new Date("2023-08-01"),
        dateOfNextCall: new Date("2024-03-07"),
        comments: "Très bons clients, prestation à refaire !",
        userId: "",
    },  
    {
        ...emptyContact,
        isClient : true,
        priority: 2,
        logo : "",
        businessName: "Entreprise de maquillage GLOW",
        denominationUsuelleEtablissement : [],
        interestGauge: null,
        businessActivity: "",
        businessPhone: "06.12.15.12.15",
        businessEmail: "",
        businessAddress: "1 rue de la paix 83000 Hyères",
        businessWebsite : "https://www.pierreetvacances.com/fr", 
        businessCity: "Hyères",
        contactName: "Mélanie la maquilleuse",
        contactPhone: "06.12.34.56.78",
        contactEmail: "melanie@glow.com",
        contactPosition: "",
        hasBeenCalled: 0,
        hasBeenSentEmailOrMeetUp: 1,
        filesSentRef: [],
        tag: ["camping", "client"],
        dateOfFirstCall: null,
        dateOfLastCall: null,
        dateOfNextCall: new Date("2024-03-04"),
        comments: "",
        userId: "",
    },
    {
        ...emptyContact,
        isClient : false,
        priority: 2,
        contactType : "Partenaire",
        logo : "",
        businessName: "Les Trésors de Lily",
        denominationUsuelleEtablissement : [],
        interestGauge: 5,
        businessActivity: "90.0",
        businessPhone: "06.12.15.12.15",
        businessEmail: "",
        businessAddress: "4 rue de la paix",
        businessWebsite : "", 
        businessCity: "Grenoble",
        contactName: "Lily",
        contactPhone: "06.12.34.56.78 ou 06.06.06.06.06",
        contactEmail: "contact@lily.com",
        contactPosition: "Gérante",
        hasBeenCalled: 1,
        hasBeenSentEmailOrMeetUp: 0,
        filesSentRef: [],
        tag: ["client", "partenaire"],
        dateOfFirstCall: new Date("2021-05-01"),
        dateOfLastCall: new Date("2023-05-01"),
        dateOfNextCall: new Date("2024-03-18"),
        comments: "Très intéressant, à rappeler ! ",
        userId: "",
    },
    {
        ...emptyContact,
        isClient: false,
        priority: 3,
        contactType : "Entreprise",
        logo : "",
        businessName: "Pierre et vacances",
        denominationUsuelleEtablissement : [],
        interestGauge: 3,
        businessActivity: "", 
        businessAddress: "1 rue de la paix Paris 75000",
        businessWebsite : "https://www.pierreetvacances.com/fr",        
        businessPhone: "06.12.15.12.15",
        businessEmail: "pierre&vacances@gmail.com",
        businessCity: "Paris",
        directorName: 'Idem',
        contactName: "Yves Morel",
        contactPhone: "06.12.34.56.78",
        contactEmail: "ymorel-pierre&vacances@gmail.com",
        contactPosition: "Directeur",
        hasBeenCalled: 1,
        hasBeenSentEmailOrMeetUp: 2,
        tag: ["prospect", "évènementiel"],
        dateOfFirstCall: new Date("2023-06-30"),  
        dateOfLastCall: new Date("2024-01-05"),
        dateOfNextCall: new Date("2024-03-01"),
        comments: `Ont l'air pas sympa, mais très indécis
        on m'a dit de les relancer souvent pour qu'ils finissent par dire oui.`,
        userId: "",
    },   
    {
        ...emptyContact,
        isClient : false,
        priority: 2,
        contactType : "Partenaire",
        logo : "",
        businessName: "Plongeons ensemble !",
        denominationUsuelleEtablissement : [],
        interestGauge: null,
        businessActivity: "93.12",
        businessPhone: "A demander !",
        businessEmail: "",
        businessAddress: "3 rue de la paix St Tropez 83990 ",
        businessWebsite : "", 
        businessCity: "St Tropez",
        directorName: 'Mme BOSS',
        contactName: "Aristide DUC",
        contactPhone: "",
        contactEmail: "duc-aristide@gmail.com",
        contactPosition: "Secrétaire",
        hasBeenCalled: 1,
        hasBeenSentEmailOrMeetUp: 0,
        filesSentRef: [],
        tag: ["client", "partenaire"],
        dateOfFirstCall: new Date("2023-10-11"),
        dateOfLastCall: null,
        dateOfNextCall: new Date("2024-02-28"),
        comments: "Très gentils, Nous envisageons de conclure un partenariat. A recontacter dans 1 mois pour voir où ils en sont.",
        userId: "",
    }, 
    {
        ...emptyContact,
        isClient : true,
        contactType : "Entreprise",
        logo : "",
        businessName: "Restaurant 5* LE BONHEUR",
        denominationUsuelleEtablissement : [],
        interestGauge: 5,
        businessActivity: "90.01Z",
        businessPhone: "06.12.15.12.15",
        businessEmail: "",
        businessAddress: "5 rue de la paix",
        businessWebsite : "", 
        businessCity: "Marseille",
        contactName: "Jean Green",
        contactPhone: "06.12.34.56.78",
        contactEmail: "jgreen@gmail.com",
        contactPosition: "?",
        hasBeenCalled: 1,
        hasBeenSentEmailOrMeetUp: 3,
        filesSentRef: [],
        tag: ["client", "partenaire"],
        dateOfFirstCall: new Date("2023-05-01"),
        dateOfLastCall: new Date("2023-05-01"),
        dateOfNextCall: new Date("2024-03-03"),
        comments: "Super !!! Prestation faite chez eux et ils sont ravis. Ils veulent me recommander à leurs clients. ",
        userId: "",
    },    
];

export default contacts;
