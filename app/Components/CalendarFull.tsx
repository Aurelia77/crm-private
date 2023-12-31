'use client'
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import frLocale from '@fullcalendar/core/locales/fr'
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar, DayHeaderContentArg } from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth'
import listPlugin from '@fullcalendar/list';
import { useTheme } from '@mui/material/styles';
import { Timestamp } from 'firebase/firestore';
import { Collapse } from '@mui/material';

const CustomDayHeader = ({ text }: { text: string }) => <div>!{text}!</div>;

type CalendarProps = {
  contacts: Contact[];
  displayContactCardToUpdate: (contact: Contact) => void;
  updateContactInContactsAndDB: (id: string, keyAndValue: { key: string, value: Timestamp }) => void;
};

export default function CalendarFull({ contacts, displayContactCardToUpdate, updateContactInContactsAndDB }: CalendarProps) {

  const muiTheme = useTheme();

  const [checked, setChecked] = React.useState(false);

  const calendarRef = React.useRef(null);

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
    const formattedDate = contact.dateOfNextCall ? dayjs(contact.dateOfNextCall?.toDate()).format('YYYY-MM-DD') : ""
    contact.dateOfNextCall && console.log(formattedDate)   

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
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, multiMonthPlugin],
      locale: frLocale,
      initialDate: dayjs().subtract(1, 'month').toDate(), // Définit la date initiale à un mois avant le mois en cours
      views: {
        multiMonthSixMonth: {
          type: 'multiMonth',
          duration: { months: 6 }
        }
      },
      selectable: true,

      buttonText: {
        timeGridWeek: 'Semaine',
        dayGridMonth: 'Mois',
        multiMonthSixMonth: '6 mois'
      },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'multiMonthSixMonth,dayGridMonth,timeGridWeek'
      },      
      editable: true,
      dayMaxEvents: true,
      dayHeaderContent(arg: DayHeaderContentArg) {
        return <CustomDayHeader text={arg.text}
        />;
      },
      events: events.map(event => ({
        ...event,
        color: getPriorityColor(event.contact.priority) ?? "black",
        fontWeight: 'bold'
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

        // Marche pas !!! Quand on modifie un événement, on revient sur le mois et la vue par défaut
        // Mettez à jour l'événement avec les nouvelles dates de début et de fin
        start && console.log("Event dropped to " + start.toLocaleString());
        end && console.log("Event dropped to " + end.toLocaleString());
        start && updateContactInContactsAndDB(contact.id, { key: "dateOfNextCall", value: Timestamp.fromDate(start) })
      },
    });
    calendar.render();
  }, [events]);



  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "60%", ml: "40%" }}>
        <Typography sx={{ p: 0.3, textAlign: "center", borderRadius: "10px", backgroundColor: hightPriorityColor, color: 'white', width: "20%" }}>Priorité Haute (3)</Typography>
        <Typography sx={{ p: 0.3, textAlign: "center", borderRadius: "10px", backgroundColor: mediumPriorityColor, width: "20%" }}>Priorité Moyenne (2)</Typography>
        <Typography sx={{ p: 0.3, textAlign: "center", borderRadius: "10px", backgroundColor: lowPriorityColor, color: 'white', width: "20%" }}>Priorité Basse (1)</Typography>
        <Typography sx={{ p: 0.3, textAlign: "center", borderRadius: "10px", backgroundColor: noPriorityColor, color: 'white', width: "20%" }}>Aucune</Typography>
      </Box>

      <Collapse in={checked}>
        <Box id="calendar" ref={calendarRef} sx={{ width: "calc(100vw - 250px)", margin: "auto", marginTop: "3%", backgroundColor: muiTheme.palette.lightCyan.light }}
        ></Box>
      </Collapse>
    </Box>
  );
}