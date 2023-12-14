import React from 'react'
import { Calendar } from '@fullcalendar/core';
import adaptivePlugin from '@fullcalendar/adaptive';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
//import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import multiMonthPlugin from '@fullcalendar/multimonth'
import { Box, Typography } from '@mui/material';
import { title } from 'process';
import dayjs, { Dayjs } from 'dayjs';
import { useTheme } from '@mui/material/styles';
import { Timestamp } from 'firebase/firestore';
import frLocale from '@fullcalendar/core/locales/fr'

import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';

// pnpm i (en + des autres dans CalendarFull)   @fullcalendar/premium-common @fullcalendar/resource @fullcalendar/resource-timeline @fullcalendar/timeline @fullcalendar/adaptive




type CalendarProps = {
  contacts: Contact[];
  diplayContactCardToUpdate: (contact: Contact) => void;
  updateContactInContactsAndDB: (id: string, keyAndValue: { key: string, value: Timestamp }) => void;
};


export default function CalendarScheduler({ contacts, diplayContactCardToUpdate, updateContactInContactsAndDB }: CalendarProps) {

  const calendarRef = React.useRef(null);

  const muiTheme = useTheme();

  const [transition, setTransition] = React.useState(false);



  React.useEffect(() => {
    setTransition(true);
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
    //contact.dateOfNextCall && console.log(formattedDate)
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

  //console.log(events)

  React.useEffect(() => {
    if (!calendarRef.current) return;

    const calendar = new Calendar(calendarRef.current, {
      height: "calc(100vh - 200px)",  // pas possible de choisir la largeur ici
      plugins: [adaptivePlugin, interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin, multiMonthPlugin],
      locale: frLocale,
      //initialView: 'resourceTimelineDay',
      //initialView: 'multiMonthSixMonth',
      //initialDate: dayjs().subtract(1, 'month').toDate(), // Définit la date initiale à un mois avant le mois en cours
      // initialDate: new Date().toISOString().split('T')[0], // !!! toISOString => 1h avant !!! Mettre plutôt toLocaleDateString !!!
      views: {
        multiMonthSixMonth: {
          type: 'multiMonth',
          duration: { months: 6 }
        },
      },
      //weekNumbers: true,
      selectable: true, // marche pas, mais dans FullCalendar oui
      buttonText: {
        resourceTimelineDay: 'Jour',
        timeGridWeek: 'Semaine',
        dayGridMonth: 'Mois',
        //yearGrid: 'Année',
        listWeek: 'Liste semaine',
        multiMonthSixMonth: '6 mois'
      },
      // views: {
      //   resourceTimelineThreeDays: {
      //     type: 'resourceTimeline',
      //     duration: { days: 3 },
      //     buttonText: '3 day'
      //   }
      // },
      //now: '2023-02-07',
      editable: true, // enable draggable events
      aspectRatio: 1.8,
      scrollTime: '00:00', // undo default 6am scrollTime
      headerToolbar: {
        left: 'today prev,next',
        center: 'title',
        right: 'multiMonthSixMonth,resourceTimelineDay,dayGridMonth,listWeek'
        // timeGridWeek ,  // Pas besoin 
        // marche pas : yearGrid, resourceTimelineThreeDays
      },
      //resourceAreaHeaderContent: 'Rooms',

      // resources: [
      //   { id: 'a', title: 'Auditorium A' },
      //   { id: 'b', title: 'Auditorium B', eventColor: 'green' },
      //   { id: 'c', title: 'Auditorium C', eventColor: 'orange' },
      // ],

      // events: [
      //     { start: '2023-11-30', end: '2023-11-30', title: 'event 1' },
      //     { start: '2023-11-30', end: '2023-11-30', title: 'event 22' },
      //     { start: '2023-11-30', end: '2023-11-30', title: 'event 33' },
      //     { id: '2', start: '2023-02-07T05:00:00', end: '2023-02-07T22:00:00', title: 'event 2' },
      //     { id: '3', start: '2023-02-06', end: '2023-02-08', title: 'event 3' },
      //     { id: '4', start: '2023-02-07T03:00:00', end: '2023-02-07T08:00:00', title: 'event 4' },
      //     { id: '5', start: '2023-02-07T00:30:00', end: '2023-02-07T02:30:00', title: 'event 5' }
      //   ]


      //events: events,
      // events: events.map(event => ({
      //   console.log(event.contact.priority)
      //   ...event,
      //   //color: getPriorityColor(event.contact.priority) ?? "black"
      // })),

      events: events.map(event => ({
        ...event,
        color: getPriorityColor(event.contact.priority) ?? "black"
      })),


      eventClick: function (info) {
        //  alert('Event: ' + info.event.title + " " + info.event.extendedProps.contact.contactEmail);        
        //console.log('Event: ' + info.event.title + " " + info.event.extendedProps.contact.contactEmail);
        diplayContactCardToUpdate(info.event.extendedProps.contact)
      },

      eventDrop: function (dropInfo) {
        const { event } = dropInfo;
        console.log(event)
        const start = event.start;
        const end = event.end;

        const contact = event.extendedProps.contact;

        // Mettez à jour l'événement avec les nouvelles dates de début et de fin
        // Vous pouvez également envoyer une requête à votre serveur ici pour mettre à jour l'événement dans votre base de données
        start && console.log("Event dropped to " + start.toLocaleString());
        end && console.log("Event dropped to " + end.toLocaleString());

        start && updateContactInContactsAndDB(contact.id, { key: "dateOfNextCall", value: Timestamp.fromDate(start) })

        // J'essaie de faire que quand on modifie un event, ça reste sur la VUE et la DATE !!! Mais ça revient comme au début !
        // Sauvegardez la date et la vue actuelles
        const currentView = calendar.view;
        console.log("currentView.type : " + currentView.type)
        const currentDate = calendar.getDate();
           console.log("currentDate : " + currentDate)

        // Restaurez la date et la vue actuelles après un délai
        setTimeout(() => {
          calendar.changeView(currentView.type, currentDate);
        }, 0);
        // Restaurez la date et la vue actuelles
        //calendar.changeView(currentView.type, currentDate);
      },

      // eventResize: function(resizeInfo) {
      //   const { event } = resizeInfo;
      //   const start = event.start;
      //   const end = event.end;

      //   // Mettez à jour l'événement avec les nouvelles dates de début et de fin
      //   // Vous pouvez également envoyer une requête à votre serveur ici pour mettre à jour l'événement dans votre base de données
      //   console.log("Event resized to " + start.toLocaleString() + " to " + end.toLocaleString());
      // },


    });

    calendar.render();
  }, [events]);

  return <Box>

    <Box sx={{ display: "flex", justifyContent: "space-between", width: "60%", ml: "40%" }}>
      <Typography sx={{ p: 0.3, textAlign: "center", borderRadius: "10px", backgroundColor: hightPriorityColor, color: 'white', width: "20%" }}>Priorité Haute (3)</Typography>
      <Typography sx={{ p: 0.3, textAlign: "center", borderRadius: "10px", backgroundColor: mediumPriorityColor, width: "20%" }}>Priorité Moyenne (2)</Typography>
      <Typography sx={{ p: 0.3, textAlign: "center", borderRadius: "10px", backgroundColor: lowPriorityColor, color: 'white', width: "20%" }}>Priorité Basse (1)</Typography>
      <Typography sx={{ p: 0.3, textAlign: "center", borderRadius: "10px", backgroundColor: noPriorityColor, color: 'white', width: "20%" }}>Aucune</Typography>
    </Box>

    <Fade
      in={transition}
      timeout={2000}
    >
      <Box id="calendar" ref={calendarRef} sx={{ width: "calc(100vw - 250px)", margin: "auto", marginTop: "3%", backgroundColor: muiTheme.palette.lightCyan.light }}
      ></Box>
    </Fade>
    {/* <Collapse in={checked}>{icon}</Collapse> */}

    {/* <Box id="calendar" ref={calendarRef} sx={{ width: "calc(100vw - 250px)", margin: "auto", marginTop: "3%", backgroundColor: muiTheme.palette.lightCyan.light }}
      ></Box> */}
  </Box>


};


