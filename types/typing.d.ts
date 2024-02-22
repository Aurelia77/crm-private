
type ContactTypeType = "NON DEFINI" | "Particulier" | "Entreprise" | "Partenaire";

type ContactCategorieType = {
  id: string,
  label: string
}

type NameAndCatType = {
  catLabel: CategorieType,
  name: string,
}

type FileNameAndRefType = {
  fileName: string,
  fileRef: string,
}

type Contact = {
  id: string,
  isClient: boolean,
  priority: 1 | 2 | 3 | null, // 3=very important
  logo: string,
  businessName: string,
  businessCategoryId: string,
  denominationUsuelleEtablissement: string[],
  interestGauge: 1 | 2 | 3 | 4 | 5 | null, // 5=very interested
  businessActivity: string,
  businessAddress: string,
  businessWebsite: string,
  businessPhone: string,
  businessEmail: string,
  businessCity: string,
  directorName: string,
  contactName: string,
  contactPhone: string,
  contactEmail: string,
  contactPosition: string,
  hasBeenCalled: 0 | 1 | 2,       // 0="no" | 1="yes but no answer" | 2="yes and answered",
  hasBeenSentEmailOrMeetUp: 0 | 1 | 2 | 3,  // 0="nothing" | 1="email sent" | 2="email sent and received" | 3="met up",
  filesSentRef: string[],
  tag: string[],
  dateOfFirstCall: timestamp,
  dateOfLastCall: timestamp,
  dateOfNextCall: timestamp,
  contactType: ContactTypeType,
  comments: string,
  userId: string,
}

type Query = {
  name: string,
  siret: string  // Pas un nombre car on veut garder si 0 devant 
  city: string,
  CP: string,
  businessActivity: string,
}

type UserInfos = {
  name: string;
  email: string;
  password: string;
};

type Alerts = {
  nbContactsWithDatePassed: number,
  nbContactsDateSoon: number,
}

type SearchContactCriteria = {
  isClient: "yes" | "no" | "all",
  contactTypes: ContactTypeType[],
  businessNames: string,
  businessCities: string[],
  businessCategoryIds: string[],
}