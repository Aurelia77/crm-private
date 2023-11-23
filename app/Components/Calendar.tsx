'use client'
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// function getRandomNumber(min: number, max: number) {
//   return Math.round(Math.random() * (max - min) + min);
// }
// function fakeFetch(date: Dayjs, { signal }: { signal: AbortSignal }) {
//   return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
//     const timeout = setTimeout(() => {
//       const daysInMonth = date.daysInMonth();
//       const daysToHighlight = [1, 2, 3].map(() => getRandomNumber(1, daysInMonth));

//       resolve({ daysToHighlight });
//     }, 500);

//     signal.onabort = () => {
//       clearTimeout(timeout);
//       reject(new DOMException('aborted', 'AbortError'));
//     };
//   });
// }
// function datesFetchInContacts(contacts: Contact[], date: Dayjs, { signal }: { signal: AbortSignal }) {
//   return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
//       //const daysInMonth = date.daysInMonth();
//      // console.log("daysInMonth", daysInMonth)

//       const daysToHighlight = contacts.map((contact) => {
//         console.log(contact.dateOfNextCall)
//       })
//       //[1, 2, 3].map(() => getRandomNumber(1, daysInMonth));

//       //resolve({ daysToHighlight });

//     // signal.onabort = () => {
//     //   clearTimeout(timeout);
//     //   reject(new DOMException('aborted', 'AbortError'));
//     // };
//   });
// }


// interface HighlightedDay {
//   date: Date;
//   businessName: string;
// }



function getDaysOfNextCallsForMonth(contactsList: Contact[], targetDate: Dayjs) {
  // function getDaysOfNextCallsForMonth(contactsList: Contact[], targetDate: Dayjs): Promise<{ daysToHighlight: number[] }> {
  //return Promise.resolve(
  //return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
  let contactsToCallThisMonth: Contact[]

  //console.log(contactsList)
  //console.log("targetDate", targetDate)

  contactsToCallThisMonth = contactsList
    .filter(contact => {
      const nextCallDate = contact.dateOfNextCall?.toDate()   // => on tranforme le ObjectTimestamp en Date
      return nextCallDate?.getMonth() === targetDate.month() && nextCallDate?.getFullYear() === targetDate.year();
    })
    // //.map(contact => contact.dateOfNextCall.getDate())
    // .map(contact => ({
    //   date: contact.dateOfNextCall.toDate(),
    //   businessName: contact.businessName
    // }))

  console.log(contactsToCallThisMonth)

  return contactsToCallThisMonth
}
// function getDaysOfNextCallsForMonth(contactsList: Contact[], targetDate: Dayjs) {
//     return contactsList
//         .filter(contact => {
//             let nextCallDate = contact.dateOfNextCall;
//             return nextCallDate?.getMonth() === targetDate.month() && nextCallDate?.getFullYear() === targetDate.year();
//         })
//         .map(contact => contact.dateOfNextCall.getDate());
// }

//console.log(getDaysOfNextCallsForMonth(fakeContactsData, dayjs('2023-12-17')))

type CalendarProps = {
  contacts: Contact[];
  diplayContactCardToUpdate: (contact: Contact) => void;
};

export default function Calendar({ contacts, diplayContactCardToUpdate }: CalendarProps) {
  //const requestAbortController = React.useRef<AbortController | null>(null);
  //const [isLoading, setIsLoading] = React.useState(false);
  const [contactsToCallThisMonthAndToHighlight, setContactsToCallThisMonthAndToHighlight] = React.useState<Contact[]>([]);

  const [dateToSeeOnTheCalendar, setDateToSeeOnTheCalendar] = React.useState<Dayjs>(dayjs(new Date())) // today

  const [contactsToCallThisDay, setContactsToCallThisDay] = React.useState<Contact[]>([])


  //console.log(contacts)
  console.log(contactsToCallThisMonthAndToHighlight)
  //console.log("dateToSeeOnTheCalendar", dateToSeeOnTheCalendar)

  // const fetchHighlightedDays = (contacts: Contact[], date: Dayjs) => {
  //   //const controller = new AbortController();
  //   // const daysToHighlight = getDaysOfNextCallsForMonth(fakeContactsData, date)
  //   // setHighlightedDays(daysToHighlight);

  //   //console.log(contacts)

  //   setHighlightedDays(getDaysOfNextCallsForMonth(contacts, date));

  //   //setIsLoading(false);
  //   // fakeFetch(date, {
  //   //   signal: controller.signal,
  //   // })
  //   //   .then(({ daysToHighlight }) => {

  //   //     console.log("daysToHighlight", daysToHighlight)
  //   //     setHighlightedDays(daysToHighlight);
  //   //     setIsLoading(false);
  //   //   })
  //   //   .catch((error) => {
  //   //     // ignore the error if it's caused by `controller.abort`
  //   //     if (error.name !== 'AbortError') {
  //   //       throw error;
  //   //     }
  //   //   });

  //   // requestAbortController.current = controller;
  // };



  interface MarkedDayProps extends PickersDayProps<Dayjs> {
    highlightedDays?: Contact[];
  }
  // function MarkedDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
  //   const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  function MarkedDay(props: MarkedDayProps) {
    // function MarkedDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
    //   const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    // Bien laisse le nom highlightedDays !!!
    const { highlightedDays: highlightedContactDays = [], day, outsideCurrentMonth, ...other } = props;

    console.log("highlightedDays", highlightedContactDays)
    //console.log("day", day)


    //console.log(highlightedDays, day, outsideCurrentMonth, other)

    //   const isSelected =
    //     !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;


    // const highlightedDay = highlightedContactDays.find(
    //   (contact) => {
    //     // console.log("d.date", d.date)
    //     // console.log("d.date", d.date.getDate())
    //     // console.log("day.date()", day.date())
    //     return !outsideCurrentMonth && contact.dateOfNextCall.getDate() === day.date()
    //   }
    // );

    const highlightedContacts: Contact[] = highlightedContactDays.filter((contact: Contact) =>
      { 
        console.log(contact.dateOfNextCall.toDate().getDate())
        console.log(day.date())
        //console.log(contact.dateOfNextCall.date())
        return !outsideCurrentMonth && contact.dateOfNextCall.toDate().getDate() === day.date()
      }
    )
    console.log("highlightedContacts", highlightedContacts)

    return (
      <Badge
        //  key={props.day.toString()}
        key={day.toString()}
        overlap="circular"
        // badgeContent={isSelected ? <NotificationsIcon color='warning' fontSize='small' /> : undefined}
        // badgeContent={isSelected ? '🌚' : undefined}
        badgeContent={
          highlightedContacts.length > 0
            ?
            // <NotificationsIcon color="warning" fontSize="small" /> 
            // <Tooltip title={highlightedDayAndBusinessName?.businessName}     /////////////////////// ????????????
            // >
            <IconButton //color="primary" sx={{ padding: 0 }}       // Car les boutons ont automatiquement un padding
              onClick={() => setContactsToCallThisDay(highlightedContacts)} >
              {/* onClick={() => setContactsToCallThisDay(highlightedDay?.businessName || "")} > */}
              <NotificationsIcon color="warning" fontSize="small" />
            </IconButton>
            // </Tooltip>
            : undefined
        }

      >
        {/* <Tooltip title={highlightedDay?.businessName}>*/}
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        {/*</Tooltip> */}
      </Badge>
    );
  }
  // SANS les messages
  // function MarkedDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
  //   const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  //   const isSelected =
  //     !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  //   return (
  //     <Badge
  //       key={props.day.toString()}
  //       overlap="circular"
  //       badgeContent={isSelected ? <NotificationsIcon color='warning' fontSize='small' /> : undefined}
  //     //   badgeContent={isSelected ? '🌚' : undefined}
  //     >
  //       <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
  //     </Badge>
  //   );
  // }



  React.useEffect(() => {
    //console.log(contacts)

    //fetchHighlightedDays(contacts, dateToSeeOnTheCalendar);
    setContactsToCallThisMonthAndToHighlight(getDaysOfNextCallsForMonth(contacts, dateToSeeOnTheCalendar));

    // abort request on unmount
    //return () => requestAbortController.current?.abort();
  }, [contacts, dateToSeeOnTheCalendar]);

  const handleMonthChange = (date: Dayjs) => {
    console.log("date", date)
    //if (requestAbortController.current) {
    // make sure that you are aborting useless requests
    // because it is possible to switch between months pretty quickly
    //  requestAbortController.current.abort();
    //}
    //setIsLoading(true);

    setDateToSeeOnTheCalendar(date)

    setContactsToCallThisMonthAndToHighlight([]);

    //fetchHighlightedDays(contacts, date);
    setContactsToCallThisMonthAndToHighlight(getDaysOfNextCallsForMonth(contacts, date));
  };

  return (
    <Box style={{ display: "flex" }} >
      <DateCalendar
        //defaultValue={dateToSeeOnTheCalendar} // seulement si cette valeur ne change jamais => ici : erreur : MUI: A component is changing the default value state of an uncontrolled DateCalendar after being initialized.
        value={dateToSeeOnTheCalendar}
        //loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: MarkedDay,
        }}
        slotProps={{
          day: {
            highlightedDays: contactsToCallThisMonthAndToHighlight,
          } as any,
        }}
      />
      <Box sx={{ border: '1px solid #CCC', p: 2, ml: 2, width: 300 }} >
        <Typography align="center" sx={{ mb: 2, }} >
          {contactsToCallThisDay[0] && contactsToCallThisDay[0].dateOfNextCall.toDate().toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Typography>
        <Typography sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }} >
          Contact(s) à appeler ce jour
        </Typography>
        {contactsToCallThisDay.map((contact, index) => (
          <Typography key={index} variant="body2" sx={{ mt: 2 }}
            onClick={() => diplayContactCardToUpdate(contact) }            
          >
            {contact.businessName}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}