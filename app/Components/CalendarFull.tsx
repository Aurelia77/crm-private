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
import frLocale from '@fullcalendar/core/locales/fr'



// Vidéo : https://www.youtube.com/watch?v=X2zLbKimvQQ&ab_channel=DimasArki
// (p)npm i @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/timegrid 
// => J'ai ajouté npm install @fullcalendar/react
// Pour voir plusieurs mois : npm install @fullcalendar/multimonth

// Site officiel : https://fullcalendar.io/docs/initialize-es6
// (p)npm install  @fullcalendar/core  @fullcalendar/daygrid  @fullcalendar/timegrid  @fullcalendar/list

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar, DayHeaderContentArg } from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth'
import { Component, createElement } from '@fullcalendar/core/preact';
import listPlugin from '@fullcalendar/list';
import { title } from 'process';
import { useTheme } from '@mui/material/styles';
import { Timestamp } from 'firebase/firestore';
import { Collapse } from '@mui/material';


const CustomDayHeader = ({ text }: {text: string}) => <div>!{text}!</div>;

type CalendarProps = {
  contacts: Contact[];
  diplayContactCardToUpdate: (contact: Contact) => void;
  updateContactInContactsAndDB: (id: string, keyAndValue: { key: string, value: Timestamp }) => void;
};

export default function CalendarFull({ contacts, diplayContactCardToUpdate, updateContactInContactsAndDB }: CalendarProps ) {
 

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

  const [checked, setChecked] = React.useState(false);

  const calendarRef = React.useRef(null);

  const icon = (
    <Box id="calendar" ref={calendarRef} sx={{ width: "calc(100vw - 250px)", margin: "auto", marginTop: "3%", backgroundColor: muiTheme.palette.lightCyan.light }}
    ></Box>
  );

  React.useEffect(() => {  
    setChecked(true);
  }, []);

  const hightPriorityColor = muiTheme.palette.primary.main
  const mediumPriorityColor = muiTheme.palette.gray.main
  const lowPriorityColor = muiTheme.palette.error.main
  const noPriorityColor = "black"

  const getPriorityColor = (priority: number | null) => {
    switch (priority) {
        case 1: return lowPriorityColor
        case 2: return mediumPriorityColor
        case 3: return hightPriorityColor
        default: return noPriorityColor
    }
}


  type eventType = {
    contact: Contact;
    title: string;
    start: string;
    end: string;
  } 

  let events: eventType[] = [] 
  
  contacts.map((contact: Contact) => {
    //console.log(contact.businessName)
    //console.log(contact.dateOfNextCall)
    // console.log(typeof contact.dateOfNextCall)
    
    // console.log(dayjs(contact.dateOfNextCall.toDate()))
    // console.log(typeof dayjs(contact.dateOfNextCall.toDate()))
    // console.log(dayjs(contact.dateOfNextCall.toDate()).format('YYYY-MM-DD'))
    // console.log(typeof dayjs(contact.dateOfNextCall.toDate()).format('YYYY-MM-DD'))    

    const formattedDate = contact.dateOfNextCall ? dayjs(contact.dateOfNextCall?.toDate()).format('YYYY-MM-DD') : ""
    contact.dateOfNextCall && console.log(formattedDate)
    //console.log(contact.dateOfNextCall?.toDate().toLocaleDateString())    

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
      //initialView: 'multiMonthSixMonth',      
      locale:frLocale,
      initialDate: dayjs().subtract(1, 'month').toDate(), // Définit la date initiale à un mois avant le mois en cours
      views: {
        multiMonthSixMonth: {
          type: 'multiMonth',
          duration: { months: 6 }
        }
      },

      //weekNumbers: true,
      selectable: true,

      buttonText: {
        //timeGridDay: 'Jour',
        timeGridWeek: 'Semaine',
        dayGridMonth: 'Mois',
        //yearGrid: 'Année',
        //listWeek: 'Liste',
        multiMonthSixMonth: '6 mois' 
      },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'multiMonthSixMonth,dayGridMonth,timeGridWeek'
        //timeGridDay,listMonth,'     // Pas besoin
        // yearGrid   // marche pas
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
      //events: events,
      // events: [
      //   {title: 'event 0', start: '2023/10/11', end: '2023/10/11'},
      //   {title: 'event 1', start: '2023-10-01', end: '2023-10-01'},
      //   {title: 'event 2', start: '2023-10-02', end: '2023-10-02'},
      //   {title: 'event 3', start: '2023-10-03', end: '2023-10-03'}
      // ]

      events: events.map(event => ({
        ...event,
        color: getPriorityColor(event.contact.priority) ?? "black",
        fontWeight: 'bold' 
      })),

      eventClick: function (info) {
        //  alert('Event: ' + info.event.title + " " + info.event.extendedProps.contact.contactEmail);        
        //console.log('Event: ' + info.event.title + " " + info.event.extendedProps.contact.contactEmail);
        diplayContactCardToUpdate(info.event.extendedProps.contact) 
      },
      // eventClick: function (info) {
      // }
      eventDrop: function(dropInfo) {
        const { event } = dropInfo;
        console.log(event)
        const start = event.start;
        const end = event.end;

        const contact = event.extendedProps.contact;

        // Mettez à jour l'événement avec les nouvelles dates de début et de fin
        // Vous pouvez également envoyer une requête à votre serveur ici pour mettre à jour l'événement dans votre base de données
        start && console.log("Event dropped to " + start.toLocaleString());
        end && console.log("Event dropped to " + end.toLocaleString());

        start && updateContactInContactsAndDB(contact.id, {key: "dateOfNextCall", value: Timestamp.fromDate(start)}) 
      },
    
    });

    calendar.render();
  }, [
    events
  ]);

 


  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "60%", ml:"40%" }}>
        <Typography sx={{ p:0.3, textAlign:"center", borderRadius: "10px", backgroundColor: hightPriorityColor, color: 'white', width:"20%" }}>Priorité Haute (3)</Typography>
        <Typography sx={{ p:0.3, textAlign:"center", borderRadius: "10px", backgroundColor: mediumPriorityColor, width:"20%" }}>Priorité Moyenne (2)</Typography>
        <Typography sx={{ p:0.3, textAlign:"center", borderRadius: "10px", backgroundColor: lowPriorityColor, color: 'white', width:"20%" }}>Priorité Basse (1)</Typography>
        <Typography sx={{ p:0.3, textAlign:"center", borderRadius: "10px", backgroundColor: noPriorityColor, color: 'white', width:"20%" }}>Aucune</Typography>
      </Box>

      <Collapse in={checked}>{icon}</Collapse>
      {/* <Box id="calendar" ref={calendarRef} sx={{ width: "calc(100vw - 250px)", margin: "auto", marginTop: "3%", backgroundColor: muiTheme.palette.lightCyan.light }}
      ></Box> */}
    </Box>
  );
}