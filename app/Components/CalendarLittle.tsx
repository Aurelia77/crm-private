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
import { useTheme } from '@mui/material/styles';
import { Grow } from '@mui/material';




function getDaysOfNextCallsForMonth(contactsList: Contact[], targetDate: Dayjs) {
  let contactsToCallThisMonth: Contact[]

  contactsToCallThisMonth = contactsList
    .filter(contact => {
      const nextCallDate = contact.dateOfNextCall?.toDate()
      return nextCallDate?.getMonth() === targetDate.month() && nextCallDate?.getFullYear() === targetDate.year();
    })

  return contactsToCallThisMonth
}

type CalendarProps = {
  contacts: Contact[];
  displayContactCardToUpdate: (contact: Contact) => void;
};

type DayAndContactsToCallThisDayType = {
  day: Date;
  contactsToCallThisDay: Contact[];
}

export default function CalendarLittle({ contacts, displayContactCardToUpdate }: CalendarProps) {
  const [contactsToCallThisMonthAndToHighlight, setContactsToCallThisMonthAndToHighlight] = React.useState<Contact[]>([]);

  const [dateToSeeOnTheCalendar, setDateToSeeOnTheCalendar] = React.useState<Dayjs>(dayjs(new Date()))

  const [dayAndContactsToCallThisDay, setDayAndContactsToCallThisDay] = React.useState<DayAndContactsToCallThisDayType>({ day: dateToSeeOnTheCalendar.toDate(), contactsToCallThisDay: [] })

  const muiTheme = useTheme();

  const [transition, setTransition] = React.useState(false);

  const handleMonthChange = (date: Dayjs) => {
    setDateToSeeOnTheCalendar(date)
    setContactsToCallThisMonthAndToHighlight([]);
    setContactsToCallThisMonthAndToHighlight(getDaysOfNextCallsForMonth(contacts, date));
  };

  const firstTransition = (
    <DateCalendar
      value={dateToSeeOnTheCalendar}
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
  );

  const secondTransition = (
    <Box sx={{ border: '1px solid #CCC', p: 2, ml: 2, width: 300 }} >
      <Typography align="center" sx={{ mb: 2, }} >{dayAndContactsToCallThisDay.day?.toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
      <Typography sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }} >
        Contact(s) à appeler ce jour ({dayAndContactsToCallThisDay.contactsToCallThisDay.length})
      </Typography>

      {dayAndContactsToCallThisDay.contactsToCallThisDay.length === 0
        ? <Typography variant="body2" sx={{ mt: 2 }} >Aucun !</Typography>
        : dayAndContactsToCallThisDay.contactsToCallThisDay.map((contact, index) => (
          <Typography key={index} variant="body2" sx={{ mt: 2, cursor: 'pointer' }}
            onClick={() => displayContactCardToUpdate(contact)}
          >
            {contact.businessName}
          </Typography>
        ))}
    </Box>

  );

  React.useEffect(() => {
    setTransition(true);
  }, []);


  interface MarkedDayProps extends PickersDayProps<Dayjs> {
    highlightedDays?: Contact[];
  }
  function MarkedDay(props: MarkedDayProps) {
    const { highlightedDays: highlightedContactDays = [], day, outsideCurrentMonth, ...other } = props;
   
    const highlightedContacts: Contact[] = highlightedContactDays.filter((contact: Contact) => {
      return !outsideCurrentMonth && contact.dateOfNextCall.toDate().getDate() === day.date()
    })

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        onClick={() => setDayAndContactsToCallThisDay({ day: day.toDate(), contactsToCallThisDay: highlightedContacts })}
        badgeContent={
          highlightedContacts.length > 0
            ? <NotificationsIcon color="warning" fontSize="small" />
            : undefined
        }

      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    );
  }

  React.useEffect(() => {
    setContactsToCallThisMonthAndToHighlight(getDaysOfNextCallsForMonth(contacts, dateToSeeOnTheCalendar));
  }, [contacts, dateToSeeOnTheCalendar]);



  return (
    <Box style={{ display: "flex", backgroundColor: muiTheme.palette.lightCyan.light, width: "800px", margin: "auto", marginTop: "50px", padding: "20px" }} >
      <Grow in={transition}>{firstTransition}</Grow>
      <Grow
        in={transition}
        style={{ transformOrigin: '0 0 0' }}
        {...(transition ? { timeout: 1000 } : {})}
      >
        {secondTransition}
      </Grow>     
    </Box>
  );
}