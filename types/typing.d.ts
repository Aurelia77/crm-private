
type BusinessCatType = "NON DEFINI" | "Camping" | "Hôtel" | "Congiergerie" | "Agence Event" | "Agence Artistique" | "Mairie" | "Lieu de réception" | "Wedding Planer" | "Restaurant Plage" | "Piscine Municipale" | "Yacht" | "Plage Privée" | "Agence Location Villa Luxe" | "Aquarium" | "Centre de Loisirs" | "Centre de Plongée" | "Agence Communication Audio Visuel" | "Autre";

type ContactTypeType= "NON DEFINI" | "Particulier" | "Entreprise" | "Partenaire";

type Contact = {
  id: string,
  isClient: boolean,
  contactType: ContactTypeType,
  logo: string,
  businessName: string,
  denominationUsuelleEtablissement: string[],
  businessCategory: BusinessCatType,
  interestGauge: 1 | 2 | 3 | 4 | 5 | null, // 5=very interested  // Marche ps ???1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, 
  businessActivity: string,
  businessAddress: string,
  businessWebsite: string,
  businessPhone: string,
  businessEmail: string,
  businessCity: string,
  contactName: string,
  contactPhone: string,
  contactEmail: string,
  contactPosition: string,
  hasBeenCalled: 0 | 1 | 2,       // 0="no" | 1="yes but no answer" | 2="yes and answered",
  hasBeenSentEmailOrMeetUp: 0 | 1 | 2 | 3,  // 0="nothing" | 1="email sent" | 2="email sent and received" | 3="met up",
  filesSent: File[] | [],
  //fileSent: File | null,
  tag: string[],
  dateOfFirstCall: timestamp,
  dateOfLastCall: timestamp,
  dateOfNextCall: timestamp,
  comments: string,
  userId: string,
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

type UserInfos = {
  //id: string;
  name: string;
  email: string;
  password: string;
  //picture: string;
  //provider: string;
  //isAdmin: boolean;
};

type Alerts = {
  nbContactsWithDatePassed: number,
  nbContactsWithDateSoon: number,
}

type SearchContactCriteria = {
  isClient: "yes" | "no" | "all",
  contactType : ContactTypeType[],
  businessName: string,
  businessCity: string[],
  businessCategory: string[],
}