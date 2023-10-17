type Contact = {
    id : number,
    businessName : string,
    activity : string,
    businessPhone : string,
    businessEmail : string,
    businessAddress : string,
    businessCity : string,
    contactName : string,
    contactPhone : string,
    contactEmail : string,
    contactPosition : string,
    tag : string[],
    interestGauge : number, // Marche ps ???1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, 
    dateOfFirstCall : Date,
    dateOfLastCall : Date,
    dateOfNextCall : Date,
    comments : string,
}

type Query = {
    name: string,
    siret: string     // number | null, Pas un nombre car on veut garder si y'a un 0 devant 
    city: string,
    CP: string,
}

type CodeNaf = {
    id: string;
    label: string;
  };