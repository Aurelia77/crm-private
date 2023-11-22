'use client'
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tooltip from '@mui/material/Tooltip';

import fakeContactsData from '../utils/contacts'


function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

function fakeFetch(date: Dayjs, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();
      const daysToHighlight = [1, 2, 3].map(() => getRandomNumber(1, daysInMonth));

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}
function datesFetchInContacts(contacts: Contact[], date: Dayjs, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
      //const daysInMonth = date.daysInMonth();
     // console.log("daysInMonth", daysInMonth)

      const daysToHighlight = contacts.map((contact) => {
        console.log(contact.dateOfNextCall)
      })
      //[1, 2, 3].map(() => getRandomNumber(1, daysInMonth));

      //resolve({ daysToHighlight });

    // signal.onabort = () => {
    //   clearTimeout(timeout);
    //   reject(new DOMException('aborted', 'AbortError'));
    // };
  });
}



const initialValue = dayjs(new Date());
//dayjs('2022-04-17');


interface HighlightedDay {
  date: number;
  businessName: string;
}
interface MarkedDayProps extends PickersDayProps<Dayjs> {
  highlightedDays?: HighlightedDay[];
}
function MarkedDay(props: MarkedDayProps) {
  // function MarkedDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
//   const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  //console.log(highlightedDays, day, outsideCurrentMonth, other)

  //   const isSelected =
//     !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;


  const highlightedDay = highlightedDays.find(
    (d) => !outsideCurrentMonth && d.date === day.date()
  );

  //console.log("highlightedDay", highlightedDay)

  return (
    <Badge
//       key={props.day.toString()}
      key={day.toString()}
      overlap="circular"
      //       badgeContent={isSelected ? <NotificationsIcon color='warning' fontSize='small' /> : undefined}
//     //   badgeContent={isSelected ? '🌚' : undefined}
      badgeContent={
        highlightedDay ? (
          <NotificationsIcon color="warning" fontSize="small" />
        ) : undefined
      }
    >
      <Tooltip title={highlightedDay?.businessName || ''}>
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Tooltip>
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


function getDaysOfNextCallsForMonth(contactsList: Contact[], targetDate: Dayjs) {
  // function getDaysOfNextCallsForMonth(contactsList: Contact[], targetDate: Dayjs): Promise<{ daysToHighlight: number[] }> {
  //return Promise.resolve(
  //return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
  let daysInMonthAndText: HighlightedDay[]

  daysInMonthAndText = contactsList
    .filter(contact => {
      let nextCallDate = contact.dateOfNextCall;
      return nextCallDate?.getMonth() === targetDate.month() && nextCallDate?.getFullYear() === targetDate.year();
    })
    //.map(contact => contact.dateOfNextCall.getDate())
    .map(contact => ({
      date: contact.dateOfNextCall.getDate(),
      businessName: contact.businessName
    }))

  console.log(daysInMonthAndText)
  
  return daysInMonthAndText
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

export default function Calendar({contacts}: {contacts: Contact[]}) {
  //const requestAbortController = React.useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState<HighlightedDay[]>([]);
  //const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);

  const fetchHighlightedDays = (date: Dayjs) => {
    //const controller = new AbortController();
    // const daysToHighlight = getDaysOfNextCallsForMonth(fakeContactsData, date)
    // setHighlightedDays(daysToHighlight);
    setHighlightedDays(getDaysOfNextCallsForMonth(fakeContactsData, date));
    setIsLoading(false);
    // fakeFetch(date, {
    //   signal: controller.signal,
    // })
    //   .then(({ daysToHighlight }) => {

    //     console.log("daysToHighlight", daysToHighlight)
    //     setHighlightedDays(daysToHighlight);
    //     setIsLoading(false);
    //   })
    //   .catch((error) => {
    //     // ignore the error if it's caused by `controller.abort`
    //     if (error.name !== 'AbortError') {
    //       throw error;
    //     }
    //   });

    // requestAbortController.current = controller;
  };



  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    //return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date: Dayjs) => {
    //if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
    //  requestAbortController.current.abort();
    //}
    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: MarkedDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          } as any,
        }}
      />
    </LocalizationProvider>
  );
}