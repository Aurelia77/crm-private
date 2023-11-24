const contacts : Contact[] = [
    {
        id: "1",
        isClient : true,
        // logo : "https://www.pierreetvacances.com/medias/sys_master/images/images/hf1/hf7/8805202177566.jpg",
        logo : "https://logo.clearbit.com/pierreetvacances.com",
        businessName: "Pierre et vacances",
        denominationUsuelleEtablissement : [],
        businessType : "Centre de Loisirs",
        interestGauge: 5,
        businessActivity: "", //"55.2",
        businessAddress: "1 rue de la paix Paris 75000",
        businessWebsite : "https://www.pierreetvacances.com/fr",        
        businessPhone: "06.12.15.12.15",
        businessEmail: "1pierre&vacances@gmail.com",
        businessCity: "Paris",
        contactName: "1Laurent Dupond",
        contactPhone: "06.12.34.56.78",
        contactEmail: "dupond-pierre&vacances@gmail.com",
        contactPosition: "Directeur",
        hasBeenCalled: 0,
        hasBeenSentEmailOrMeetUp: 2,
        filesSent: [],
        tag: ["prospect", "évènementiel"],
        dateOfFirstCall: new Date("2023-10-31"),        // Ou new Date(2021, 5, 1, 14, 30)  => !!! janvier = 0
        // dateOfFirstCall: new Date("2023-10-31T14:33"),        // Ou new Date(2021, 5, 1, 14, 30)  => !!! janvier = 0
        dateOfLastCall: new Date("2022-05-01"),
        dateOfNextCall: new Date("2023-10-31"),
        comments: "Ont l'air pas sympa  \n mais j'ai entendu qu'il fallait leur parler longtemps pour les mettre en confiance. S'en rappeler ! Car parfois il faut insister etc... j'écris pour avoir une longue phrase...!!!",
        userId: "",
    },
    {
        id: "2",
        isClient : true,
        logo : "https://logo.clearbit.com/pierreetvacances.com",
        businessName: "Camping Hyères",
        denominationUsuelleEtablissement : [],
        businessType : "Camping",
        interestGauge: 3,
        businessActivity: "55.3",
        businessPhone: "06.12.15.12.15",
        businessEmail: "",
        businessAddress: "2 rue de la paix 83000 Hyères",
        businessWebsite : "https://www.pierreetvacances.com/fr", 
        businessCity: "Hyères",
        contactName: "2Mathieu BLANC",
        contactPhone: "06.12.34.56.78",
        contactEmail: "2blanc@gmail.com",
        contactPosition: "Homme de ménage",
        hasBeenCalled: 1,
        hasBeenSentEmailOrMeetUp: 3,
        filesSent: [],
        tag: ["camping", "client"],
        dateOfFirstCall: new Date("2023-05-01"),
        dateOfLastCall: new Date("2023-08-01"),
        dateOfNextCall: null,
        comments: "",
        userId: "",

    },
    {
        id: "3",
        isClient : false,
        logo : "https://logo.clearbit.com/pierreetvacances.com",
        businessName: "Centre de plongée",
        denominationUsuelleEtablissement : [],
        businessType : "Centre de Plongée",
        interestGauge: null,
        businessActivity: "93.12",
        businessPhone: "06.12.15.12.15",
        businessEmail: "",
        businessAddress: "3 rue de la paix St Tropez 83990 ",
        businessWebsite : "", 
        businessCity: "St Tropez",
        contactName: "3 Aristide DUC",
        contactPhone: "06.12.34.56.78",
        contactEmail: "3duc-pierre&vacances@gmail.com",
        contactPosition: "Secrétaire",
        hasBeenCalled: 2,
        hasBeenSentEmailOrMeetUp: 0,
        filesSent: [],
        tag: ["client", "partenaire"],
        dateOfFirstCall: new Date("2023-10-11"),
        dateOfLastCall: new Date("2023-10-11"),
        dateOfNextCall: new Date("2023-11-19"),
        comments: "Très gentils",
        userId: "",
    },
    {
        id: "4",
        isClient : false,
        logo : "https://logo.clearbit.com/pierreetvacances.com",
        businessName: "Les Trésors de Lily",
        denominationUsuelleEtablissement : [],
        businessType : "",
        interestGauge: 2,
        businessActivity: "90.0",
        businessPhone: "06.12.15.12.15",
        businessEmail: "",
        businessAddress: "4 rue de la paix",
        businessWebsite : "", 
        businessCity: "Paris",
        contactName: "Laurent Dupond",
        contactPhone: "06.12.34.56.78",
        contactEmail: "dupond-pierre&vacances@gmail.com",
        contactPosition: "Directeur",
        hasBeenCalled: 2,
        hasBeenSentEmailOrMeetUp: 0,
        filesSent: [],
        tag: ["client", "partenaire"],
        dateOfFirstCall: new Date("2021-05-01"),
        dateOfLastCall: new Date("2021-05-01"),
        dateOfNextCall: new Date("2023-12-03"),
        comments: "",
        userId: "",
    },
    {
        id: "5",
        isClient : false,
        logo : "https://logo.clearbit.com/pierreetvacances.com",
        businessName: "Restaurant de 5*",
        denominationUsuelleEtablissement : [],
        businessType : "Restaurant Plage",
        interestGauge: 5,
        businessActivity: "90.01Z",
        businessPhone: "06.12.15.12.15",
        businessEmail: "",
        businessAddress: "5 rue de la paix",
        businessWebsite : "https://www.pierreetvacances.com/fr", 
        businessCity: "Paris",
        contactName: "Laurent Dupond",
        contactPhone: "06.12.34.56.78",
        contactEmail: "dupond-pierre&vacances@gmail.com",
        contactPosition: "Directeur",
        hasBeenCalled: 2,
        hasBeenSentEmailOrMeetUp: 0,
        filesSent: [],
        tag: ["client", "partenaire"],
        dateOfFirstCall: new Date("2021-05-01"),
        dateOfLastCall: new Date("2021-05-01"),
        dateOfNextCall: new Date("2023-12-01"),
        comments: "Super !!!",
        userId: "",
    }, 
    {
        id: "6",
        isClient : true,
        logo : "https://logo.clearbit.com/pierreetvacances.com",
        businessName: "Camping St Tropez",
        denominationUsuelleEtablissement : [],
        businessType : "Camping",
        interestGauge: 5,
        businessActivity: "55.3",
        businessPhone: "06.12.15.12.15",
        businessEmail: "",
        businessAddress: "6 rue de la paix 83000 Hyères",
        businessWebsite : "https://www.pierreetvacances.com/fr", 
        businessCity: "St Tropez",
        contactName: "6Mr Martin",
        contactPhone: "06.12.34.56.78",
        contactEmail: "6martin@gmail.com",
        contactPosition: "Responsable des animations",
        hasBeenCalled: 1,
        hasBeenSentEmailOrMeetUp: 3,
        filesSent: [],
        tag: ["camping", "client"],
        dateOfFirstCall: new Date("2023-05-01"),
        dateOfLastCall: new Date("2023-08-01"),
        dateOfNextCall: null,
        comments: "",
        userId: "",

    },  
    // {
    //     id: "6",
    //     logo : "https://logo.clearbit.com/pierreetvacances.com",
    //     businessName: "6Camping Hyères",
    //     denominationUsuelleEtablissement : [],
    //     interestGauge: 6,
    //     businessActivity: "55.3",
    //     businessPhone: "06.12.15.12.15",
    //     businessEmail: "",
    //     businessAddress: "1 rue de la paix 83000 Hyères",
    //     businessWebsite : "https://www.pierreetvacances.com/fr", 
    //     businessCity: "Hyères",
    //     contactName: "Laurent Dupond2",
    //     contactPhone: "06.12.34.56.78",
    //     contactEmail: "dupond2-pierre&vacances@gmail.com",
    //     contactPosition: "Directeur",
    //     hasBeenCalled: false,
    //     hasBeenSentEmailOrMeetUp: false,
    //     hasReceivedEmail: false,
    //     filesSent: [],
    //     tag: ["camping", "client"],
    //     dateOfFirstCall: new Date("2023-05-01"),
    //     dateOfLastCall: new Date("2023-08-01"),
    //     dateOfNextCall: new Date("2023-11-01"),
    //     comments: "",
    // },
    // {
    //     id: "7",
    //     logo : "https://logo.clearbit.com/pierreetvacances.com",
    //     businessName: "7Centre de plongée",
    //     denominationUsuelleEtablissement : [],
    //     interestGauge: 8,
    //     businessActivity: "93.12",
    //     businessPhone: "06.12.15.12.15",
    //     businessEmail: "",
    //     businessAddress: "1 rue de la paix St Tropez 83990 ",
    //     businessWebsite : "https://www.pierreetvacances.com/fr", 
    //     businessCity: "St Tropez",
    //     contactName: "Laurent Dupond3",
    //     contactPhone: "06.66.55.66.55",
    //     contactEmail: "dupond3-pierre&vacances@gmail.com",
    //     contactPosition: "Directeur",
    //     hasBeenCalled: false,
    //     hasBeenSentEmailOrMeetUp: false,
    //     hasReceivedEmail: false,
    //     filesSent: [],
    //     tag: ["client", "partenaire"],
    //     dateOfFirstCall: new Date("2023-10-11"),
    //     dateOfLastCall: new Date("2023-10-11"),
    //     dateOfNextCall: new Date("2023-11-11"),
    //     comments: "",
    // },
    // {
    //     id: "8",
    //     logo : "https://logo.clearbit.com/pierreetvacances.com",
    //     businessName: "8Les Trésors de Lily",
    //     denominationUsuelleEtablissement : [],
    //     interestGauge: 10,
    //     businessActivity: "90.0",
    //     businessPhone: "06.12.15.12.15",
    //     businessEmail: "",
    //     businessAddress: "1 rue de la paix",
    //     businessWebsite : "https://www.pierreetvacances.com/fr", 
    //     businessCity: "Paris",
    //     contactName: "Laurent Dupond",
    //     contactPhone: "06.66.55.66.55",
    //     contactEmail: "dupond-pierre&vacances@gmail.com",
    //     contactPosition: "Directeur",
    //     hasBeenCalled: false,
    //     hasBeenSentEmailOrMeetUp: false,
    //     hasReceivedEmail: false,
    //     filesSent: [],
    //     tag: ["client", "partenaire"],
    //     dateOfFirstCall: new Date("2021-05-01"),
    //     dateOfLastCall: new Date("2021-05-01"),
    //     dateOfNextCall: new Date("2021-05-01"),
    //     comments: "Ne surtout pas rappeler ! :(",
    // },
    // {
    //     id: "9",
    //     businessName: "9",
    //     logo : "https://logo.clearbit.com/pierreetvacances.com",
    //     denominationUsuelleEtablissement : [],
    //     interestGauge: 9,
    //     businessActivity: "90.01Z",
    //     businessPhone: "06.12.15.12.15",
    //     businessEmail: "",
    //     businessAddress: "1 rue de la paix",
    //     businessWebsite : "https://www.pierreetvacances.com/fr", 
    //     businessCity: "Paris",
    //     contactName: "Laurent Dupond",
    //     contactPhone: "06.66.55.66.55",
    //     contactEmail: "dupond-pierre&vacances@gmail.com",
    //     contactPosition: "Directeur",
    //     hasBeenCalled: false,
    //     hasBeenSentEmailOrMeetUp: false,
    //     hasReceivedEmail: false,
    //     filesSent: [],
    //     tag: ["client", "partenaire"],
    //     dateOfFirstCall: new Date("2021-05-01"),
    //     dateOfLastCall: new Date("2021-05-01"),
    //     dateOfNextCall: new Date("2021-05-01"),
    //     comments: "Très gentils",
    // },
    // {
    //     id: "10",
    //     // logo : "https://www.pierreetvacances.com/medias/sys_master/images/images/hf1/hf7/8805202177566.jpg",
    //     logo : "https://logo.clearbit.com/pierreetvacances.com",
    //     businessName: "10Pierre et vacances",
    //     denominationUsuelleEtablissement : [],
    //     interestGauge: 8,
    //     businessActivity: "", //"55.2",
    //     businessAddress: "1 rue de la paix Paris 75000",
    //     businessWebsite : "https://www.pierreetvacances.com/fr",        
    //     businessPhone: "06.12.15.12.15",
    //     businessEmail: "pierre&vacances@gmail.com",
    //     businessCity: "Paris",
    //     contactName: "Laurent Dupond",
    //     contactPhone: "06.66.55.66.55",
    //     contactEmail: "dupond-pierre&vacances@gmail.com",
    //     contactPosition: "Directeur",
    //     hasBeenCalled: false,
    //     hasBeenSentEmailOrMeetUp: false,
    //     hasReceivedEmail: false,
    //     filesSent: [],
    //     tag: ["prospect", "évènementiel"],
    //     dateOfFirstCall: new Date("2021-05-01"),        // Ou new Date(2021, 5, 1)
    //     dateOfLastCall: new Date("2022-05-01"),
    //     dateOfNextCall: new Date("2023-05-01"),
    //     comments: "Ont l'air pas sympa mais j'ai entendu qu'il fallait leur parler longtemps pour les mettre en confiance. S'en rappeler !",
    // },





];

export default contacts;