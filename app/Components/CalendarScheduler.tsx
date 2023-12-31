import React from 'react'
import { Calendar } from '@fullcalendar/core';
import adaptivePlugin from '@fullcalendar/adaptive';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth'
import { Box, Typography } from '@mui/material';
import { title } from 'process';
import dayjs, { Dayjs } from 'dayjs';
import { useTheme } from '@mui/material/styles';
import { Timestamp } from 'firebase/firestore';
import frLocale from '@fullcalendar/core/locales/fr'

import Fade from '@mui/material/Fade';


type CalendarProps = {
  contacts: Contact[];
  displayContactCardToUpdate: (contact: Contact) => void;
  updateContactInContactsAndDB: (id: string, keyAndValue: { key: string, value: Timestamp }) => void;
};


export default function CalendarScheduler({ contacts, displayContactCardToUpdate, updateContactInContactsAndDB }: CalendarProps) {

  const calendarRef = React.useRef(null);

  const muiTheme = useTheme(); 

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
    const formattedDate = contact.dateOfNextCall ? dayjs(contact.dateOfNextCall?.toDate()).format('YYYY-MM-DD') : ""
    events.push({
      contact: contact,
      title: contact.businessName,
      start: formattedDate,
      end: formattedDate,
    })
  })

  React.useEffect(() => {
    if (!calendarRef.current) return;

    const calendar = new Calendar(calendarRef.current, {
      height: "calc(100vh - 200px)",  // pas possible de choisir la largeur ici
      plugins: [adaptivePlugin, interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin, multiMonthPlugin],
      locale: frLocale,
      views: {
        multiMonthSixMonth: {
          type: 'multiMonth',
          duration: { months: 6 }
        },
      },
      selectable: true, 
      buttonText: {
        resourceTimelineDay: 'Jour',
        timeGridWeek: 'Semaine',
        dayGridMonth: 'Mois',
        //yearGrid: 'Année',
        listWeek: 'Liste semaine',
        multiMonthSixMonth: '6 mois'
      },    
      editable: true, 
      aspectRatio: 1.8,
      scrollTime: '00:00', 
      headerToolbar: {
        left: 'today prev,next',
        center: 'title',
        right: 'multiMonthSixMonth,resourceTimelineDay,dayGridMonth,listWeek'
      },     

      events: events.map(event => ({
        ...event,
        color: getPriorityColor(event.contact.priority) ?? "black"
      })),


      eventClick: function (info) {
        displayContactCardToUpdate(info.event.extendedProps.contact)
      },

      eventDrop: function (dropInfo) {
        const { event } = dropInfo;
        console.log(event)
        const start = event.start;
        const end = event.end;

        const contact = event.extendedProps.contact;

        // Mettez à jour l'événement avec les nouvelles dates de début et de fin
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
      },

 


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

   
    <Box id="calendar" ref={calendarRef} sx={{ width: "calc(100vw - 250px)", margin: "auto", marginTop: "3%", backgroundColor: muiTheme.palette.lightCyan.light }}
    ></Box>

  </Box>


};


