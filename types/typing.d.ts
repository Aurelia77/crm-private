type Contact = {
    id : string,
    isClient : boolean,
    logo : string,
    businessName : string,
    denominationUsuelleEtablissement  : string[],
    businessActivity : string,
    businessAddress : string,
    businessWebsite : string,
    businessPhone : string,
    businessEmail : string,
    businessCity : string,
    contactName : string,
    contactPhone : string,
    contactEmail : string,
    contactPosition : string,
    hasBeenCalled: 0 | 1 | 2,       // "no" | "yes but no answer" | "yes and answered",
    hasBeenSentEmail: 0 | 1 | 2,       // "no" | "yes" | "yes and received",
    filesSent: File[] | [],
    //fileSent: File | null,
    tag : string[],
    interestGauge : number | null, // Marche ps ???1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, 
    dateOfFirstCall : timestamp,
    dateOfLastCall : timestamp,
    dateOfNextCall : timestamp,
    comments : string,
}

type Query = {
    name: string,
    siret: string     // number | null, Pas un nombre car on veut garder si y'a un 0 devant 
    city: string,
    CP: string,
    businessActivity: string,
}

type CodeNaf = {
    id: string;
    label: string;
  };