import React from 'react'
import { Calendar } from '@fullcalendar/core';
import adaptivePlugin from '@fullcalendar/adaptive';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import multiMonthPlugin from '@fullcalendar/multimonth'
import { Box } from '@mui/material';
import { title } from 'process';
import dayjs, { Dayjs } from 'dayjs';
import { useTheme } from '@mui/material/styles';


// pnpm i (en + des autres dans CalendarFull)   @fullcalendar/premium-common @fullcalendar/resource @fullcalendar/resource-timeline @fullcalendar/timeline @fullcalendar/adaptive

type CalendarProps = {
    contacts: Contact[];
    diplayContactCardToUpdate: (contact: Contact) => void;
  };
  

export default function CalendarScheduler({ contacts, diplayContactCardToUpdate }: CalendarProps ) {
    
    const calendarRef = React.useRef(null);

    const muiTheme = useTheme();

   

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
        plugins: [ adaptivePlugin, interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin, resourceTimelinePlugin, multiMonthPlugin ],
        //initialView: 'resourceTimelineDay',
        initialView: 'multiMonthSixMonth',
        initialDate: dayjs().subtract(1, 'month').toDate(), // Définit la date initiale à un mois avant le mois en cours
        // initialDate: new Date().toISOString().split('T')[0],
        views: {
          multiMonthSixMonth: {
            type: 'multiMonth',
            duration: { months: 6 }
          }
        },
        buttonText: {
          resourceTimelineDay: 'Jour',
          timeGridWeek: 'Semaine',
          dayGridMonth: 'Mois',
          //yearGrid: 'Année',
          listWeek: 'Liste',
          multiMonthSixMonth: '6 mois' 
        },
        // views: {
        //   resourceTimelineThreeDays: {
        //     type: 'resourceTimeline',
        //     duration: { days: 3 },
        //     buttonText: '3 day'
        //   }
        // },
        schedulerLicenseKey: 'XXX',
        //now: '2023-02-07',
        editable: true, // enable draggable events
        aspectRatio: 1.8,
        scrollTime: '00:00', // undo default 6am scrollTime
        headerToolbar: {
          left: 'today prev,next',
          center: 'title',
          right: 'multiMonthSixMonth,resourceTimelineDay,timeGridWeek,dayGridMonth,listWeek'   // marche pas : yearGrid, resourceTimelineThreeDays
        },
        resourceAreaHeaderContent: 'Rooms',
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

        events: events,eventClick: function (info) {
          //  alert('Event: ' + info.event.title + " " + info.event.extendedProps.contact.contactEmail);        
          //console.log('Event: ' + info.event.title + " " + info.event.extendedProps.contact.contactEmail);
          diplayContactCardToUpdate(info.event.extendedProps.contact) 
        }
      });

      calendar.render();
    }, [events]);
  
    return <Box id="calendar" ref={calendarRef} sx={{ width: "calc(100vw - 250px)", margin: "auto", marginTop:"3%", backgroundColor: muiTheme.palette.lightCyan.light }}
    ></Box>
  };


