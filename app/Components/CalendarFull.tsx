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



// Vidéo : https://www.youtube.com/watch?v=X2zLbKimvQQ&ab_channel=DimasArki
// (p)npm i @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/timegrid 
// => J'ai ajouté npm install @fullcalendar/react
// Pour voir plusieurs mois : npm install @fullcalendar/multimonth

// Site officiel : https://fullcalendar.io/docs/initialize-es6
// (p)npm install  @fullcalendar/core  @fullcalendar/daygrid  @fullcalendar/timegrid  @fullcalendar/list

import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar, DayHeaderContentArg } from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth'
import { Component, createElement } from '@fullcalendar/core/preact';
import listPlugin from '@fullcalendar/list';
import { title } from 'process';
import { useTheme } from '@mui/material/styles';





const CustomDayHeader = ({ text }: {text: string}) => <div>!{text}!</div>;

type CalendarProps = {
  contacts: Contact[];
  diplayContactCardToUpdate: (contact: Contact) => void;
};

export default function CalendarFull({ contacts, diplayContactCardToUpdate }: CalendarProps ) {
 

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

  const muiTheme = useTheme();

  const calendarRef = React.useRef(null);

  type eventType = {
    contact: Contact;
    title: string;
    start: string;
    end: string;
  } 

  let events: eventType[] = [] 
  
  contacts.map((contact: Contact) => {
    console.log(contact.businessName)
    console.log(contact.dateOfNextCall)
    // console.log(typeof contact.dateOfNextCall)
    
    // console.log(dayjs(contact.dateOfNextCall.toDate()))
    // console.log(typeof dayjs(contact.dateOfNextCall.toDate()))
    // console.log(dayjs(contact.dateOfNextCall.toDate()).format('YYYY-MM-DD'))
    // console.log(typeof dayjs(contact.dateOfNextCall.toDate()).format('YYYY-MM-DD'))    

    const formattedDate = contact.dateOfNextCall ? dayjs(contact.dateOfNextCall?.toDate()).format('YYYY-MM-DD') : ""
    contact.dateOfNextCall && console.log(formattedDate)
    console.log(contact.dateOfNextCall?.toDate().toLocaleDateString())    

    // console.log(contact.dateOfNextCall?.toDate().toString().substring(0, 10))
    // console.log(contact.dateOfNextCall?.toDate())
    // console.log(contact.dateOfNextCall?.toDate().toISOString())
    // console.log(contact.dateOfNextCall?.toDate().toISOString().split('T')[0])

    events.push({
      contact: contact,
      title: contact.businessName,
      start: formattedDate,
      end: formattedDate,
    })
  })

  console.log(events)

  React.useEffect(() => {
    if (!calendarRef.current) return;

    const calendar = new Calendar(calendarRef.current, {
      height: "calc(100vh - 200px)",  // pas possible de choisir la largeur ici
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, multiMonthPlugin],
      initialView: 'multiMonthSixMonth',
      initialDate: dayjs().subtract(1, 'month').toDate(), // Définit la date initiale à un mois avant le mois en cours
      views: {
        multiMonthSixMonth: {
          type: 'multiMonth',
          duration: { months: 6 }
        }
      },
      buttonText: {
        timeGridDay: 'Jour',
        timeGridWeek: 'Semaine',
        dayGridMonth: 'Mois',
        //yearGrid: 'Année',
        listWeek: 'Liste',
        multiMonthSixMonth: '6 mois' 
      },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'multiMonthSixMonth,dayGridMonth,timeGridWeek,timeGridDay,listWeek,' // marche pas : yearGrid
      },
      //initialDate: new Date().toISOString().split('T')[0],
      // initialDate: '2018-01-12',
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      dayMaxEvents: true, // allow "more" link when too many events
      dayHeaderContent(arg: DayHeaderContentArg) {
        return <CustomDayHeader text={arg.text}
        //onClick={() => {console.log("coucou")}}
         />;
      },
      events: events,
      // events: [
      //   {title: 'event 0', start: '2023/10/11', end: '2023/10/11'},
      //   {title: 'event 1', start: '2023-10-01', end: '2023-10-01'},
      //   {title: 'event 2', start: '2023-10-02', end: '2023-10-02'},
      //   {title: 'event 3', start: '2023-10-03', end: '2023-10-03'}
      // ]
      eventClick: function (info) {
        //  alert('Event: ' + info.event.title + " " + info.event.extendedProps.contact.contactEmail);        
        //console.log('Event: ' + info.event.title + " " + info.event.extendedProps.contact.contactEmail);
        diplayContactCardToUpdate(info.event.extendedProps.contact) 
      }
      // eventClick: function (info) {
      // }
    });

    calendar.render();
  }, [
    events
  ]);

 


  return (
    <Box id="calendar" ref={calendarRef} sx={{ width: "calc(100vw - 250px)", margin: "auto", marginTop:"3%", backgroundColor: muiTheme.palette.lightCyan.light }}
    ></Box>
  );
}