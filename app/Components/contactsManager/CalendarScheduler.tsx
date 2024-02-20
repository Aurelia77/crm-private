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
import { redirect } from 'next/navigation';
import { useNavigate } from 'react-router-dom';


type CalendarProps = {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  updateContactInContactsAndDB: (id: string, keyAndValue: { key: string, value: Timestamp }) => void;
  redirectToContact: (contactId: string) => void;
};


export default function CalendarScheduler({ contacts, setContacts, redirectToContact, updateContactInContactsAndDB }: CalendarProps) {

  const calendarRef = React.useRef(null);

  const muiTheme = useTheme(); 
  //const [shouldRedirect, setShouldRedirect] = React.useState<boolean>(false)

  //console.log("shouldRedirect : ", shouldRedirect)


  //const navigate = useNavigate();

  // React.useEffect(() => {
  //   if (shouldRedirect) {
  //     setShouldRedirect(false)
  //     redirect('/')
  //   }
  // }, [shouldRedirect])


  const hightPriorityColor = muiTheme.palette.primary.main
  const mediumPriorityColor = muiTheme.palette.gray.dark
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
        color: getPriorityColor(event.contact.priority) ?? "black",
        //onClick: () => redirectToContact(event.contact.id)  // marche pas

        // Pour pouvoir voir le lien en passant la souris ou faire clic droit : ouvrir dans nouvel onglet
        url: `/gestionContacts/contact/${event.contact.id}`,
        eventContent: function (arg : any) {
          let anchor = document.createElement('a');
          anchor.href = arg.event.url;
          anchor.target = '_blank';
          anchor.innerText = arg.event.title;
          arg.el.appendChild(anchor);
          return { html: '' };
        }
      })),    

      // Fonctionne mais on pouvait pas voir le lien en passant la souris ou faire clic droit : ouvrir dans nouvel onglet
      // eventClick: function (info) {
      //   console.log("info", info)
      //   console.log("info.event", info.event)
      //   console.log("info.event.extendedProps", info.event.extendedProps)
      //   console.log("info.event.extendedProps.contact", info.event.extendedProps.contact)
      //   console.log("info.event.extendedProps.contact.id", info.event.extendedProps.contact.id)
      //   redirectToContact(info.event.extendedProps.contact.id)
      //   //redirect(`/gestionContacts/contact/${info.event.extendedProps.contact.id}`)
      // },

      eventDrop: function (dropInfo) {
        const { event } = dropInfo;
        //console.log(event)
        const start = event.start;
        const end = event.end;

        const contact = event.extendedProps.contact;

        // Mettez à jour l'événement avec les nouvelles dates de début et de fin
        start && console.log("Event dropped to " + start.toLocaleString());
        end && console.log("Event dropped to " + end.toLocaleString());

        start && updateContactInContactsAndDB(contact.id, { key: "dateOfNextCall", value: Timestamp.fromDate(start) })

        start && setContacts(contacts.map(c => c.id === contact.id ? { ...c, dateOfNextCall: Timestamp.fromDate(start) } : c));

        //setContacts([...contacts, {...contact, dateOfNextCall: Timestamp.fromDate(start)}])


        // // J'essaie de faire que quand on modifie un event, ça reste sur la VUE et la DATE !!! Mais ça revient comme au début !
        // // Sauvegardez la date et la vue actuelles
        // const currentView = calendar.view;
        // console.log("currentView.type : " + currentView.type)
        // const currentDate = calendar.getDate();
        // console.log("currentDate : " + currentDate)

        // // Restaurez la date et la vue actuelles après un délai
        // setTimeout(() => {
        //   calendar.changeView(currentView.type, currentDate);
        // }, 0);
      },
    });

    calendar.render();
  }, [events]);

  return <Box>
    <Box >
      <Typography >
        Pour modifier la date de relance d'un contact, faites glisser l'événement sur le calendrier
      </Typography>
      <Typography  >
        Un clic sur un contact pour le visualiser !
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-around", marginTop:"20px" }}>
        <Typography sx={{ p: 0.3, textAlign: "center", borderRadius: "10px", backgroundColor: hightPriorityColor, color: 'white', width: "20%" }}>
          Priorité Haute
        </Typography>
        <Typography sx={{ p: 0.3, textAlign: "center", borderRadius: "10px", backgroundColor: mediumPriorityColor, width: "20%" }}>
          Priorité Moyenne
        </Typography>
        <Typography sx={{ p: 0.3, textAlign: "center", borderRadius: "10px", backgroundColor: lowPriorityColor, color: 'white', width: "20%" }}>
          Priorité Basse
        </Typography>
        <Typography sx={{ p: 0.3, textAlign: "center", borderRadius: "10px", backgroundColor: noPriorityColor, color: 'white', width: "20%" }}>
          Aucune
        </Typography>
      </Box>
    </Box>

    <Box id="calendar" ref={calendarRef} sx={{ width: "calc(100vw - 250px)", margin: "auto", marginTop: "3%", backgroundColor: muiTheme.palette.lightCyan.light }}
    ></Box>

  </Box>


};


