import { Timestamp } from 'firebase/firestore';
// MUI
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import MailIcon from '@mui/icons-material/Mail';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';
import { useTheme } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: '1px solid #CCC',
  padding: "7px",
  maxWidth: "150px",
  overflow: "hidden",

  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }: any) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.gray.light,
  },
  "&:hover": {
    backgroundColor: theme.palette.gray.main,
  },
  "&.Mui-selected:hover": { background: theme.palette.lightCyan.main, },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  width?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, width, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ width: width }}
      {...other}
    >
      {value === index && (
        <Box m={1}
        >
          <Typography component={"div"}
          >{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// ETOILES de la PRIORITY
const StyledRatingStars = styled(Rating)(({ theme, color }) => ({
  '& .MuiRating-iconFilled': {
    color: color
  },
  '& .MuiRating-iconHover': {
    color: color
  },
}));

// Smileys du RATING  
const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
    fontSize: '1.5rem'
  },
}))

const customIcons: {
  [index: string]: { icon: React.ReactElement; label: string; };
} = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" sx={{ fontSize: "2.5rem" }} />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="warning" sx={{ fontSize: "2.5rem" }}
    />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="secondary" sx={{ fontSize: "2.5rem" }}
    />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" sx={{ fontSize: "2.5rem" }}
    />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="primary" sx={{ fontSize: "2.5rem" }}
    />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

// GESTION DES ICONES MAIL ET TELEPHONE
// hasBeenCalled => 0="no" | 1="yes but no answer" | 2="yes and answered",
// hasBeenSentEmailOrMeetUp =>  0="nothing" | 1="email sent" | 2="email sent and received" | 3="met up",
const useRightMailIcon = () => {
  const muiTheme = useTheme();

  const RightMailIcon = ({ hasBeenSentEmailOrMeetUp }: { hasBeenSentEmailOrMeetUp: 0 | 1 | 2 | 3 }) => {
    switch (hasBeenSentEmailOrMeetUp) {
      case 1: return <MailIcon sx={{ color: muiTheme.palette.ochre.main }} />
      case 2: return <MarkEmailReadIcon color='success' />
      case 3: return <HandshakeTwoToneIcon color="success" />
      default: return <MailOutlineIcon sx={{
        color: "black"
      }} />
    }
  }
  return RightMailIcon
}

const useIconUtilities = () => {
  const muiTheme = useTheme();

  const getPhoneIconColor = (hasBeenCalled: 0 | 1 | 2) => {
    switch (hasBeenCalled) {
      case 1:
        return muiTheme.palette.success.main;
      case 2:
        return muiTheme.palette.ochre.main;
      default:
        return "black"
    }
  };

  const getEmailIconColor = (hasBeenSentEmailOrMeetUp: 0 | 1 | 2 | 3) => {
    switch (hasBeenSentEmailOrMeetUp) {
      case 2:
      case 3:
        return muiTheme.palette.success.main;
      case 1:
        return muiTheme.palette.ochre.main;
      default:
        return "black"
    }
  };

  const getEmailIconText = (hasBeenSentEmailOrMeetUp: 0 | 1 | 2 | 3) => {
    switch (hasBeenSentEmailOrMeetUp) {
      case 1:
        return "Mail envoyé"
      case 2:
        return "Mail reçu"
      case 3:
        return "Rencontre physique"
      default:
        return "Mail non envoyé"
    }
  };

  const getPhoneIconText = (hasBeenCalled: 0 | 1 | 2) => {
    switch (hasBeenCalled) {
      case 1:
        return "J'ai parlé à quelqu'un"
      case 2:
        return "J'ai appélé mais pas de réponse"
      default:
        return "Pas appelé"
    }
  };
  return { getPhoneIconColor, getEmailIconColor, getEmailIconText, getPhoneIconText };
}

const useHandleClickHasBeenCalledAndHasBeenSentEmailOrMeetUp = (
  contact: Contact,
  handleUpdateContact?: (id: string, keyAndValue: { key: string; value: string | number | boolean | Timestamp | File[] | null; }) => void, // modif contact
  setContact?: React.Dispatch<React.SetStateAction<Contact>>, // modif juste pour le state
) => {
  const handleClickHasBeenCalled = () => {
    handleUpdateContact && handleUpdateContact(contact.id, {
      key: "hasBeenCalled", value: contact.hasBeenCalled === 0
        ? 1
        : contact.hasBeenCalled === 1
          ? 2
          : 0
    })
    setContact && setContact({
      ...contact, hasBeenCalled: contact.hasBeenCalled === 0
        ? 1
        : contact.hasBeenCalled === 1
          ? 2
          : 0
    })
  }

  const handleClickhasBeenSentEmailOrMeetUp = () => {
    handleUpdateContact && handleUpdateContact(contact.id, {
      key: "hasBeenSentEmailOrMeetUp", value: contact.hasBeenSentEmailOrMeetUp === 0
        ? 1
        : contact.hasBeenSentEmailOrMeetUp === 1
          ? 2
          : contact.hasBeenSentEmailOrMeetUp === 2
            ? 3
            : 0
    })
    setContact && setContact({
      ...contact, hasBeenSentEmailOrMeetUp: contact.hasBeenSentEmailOrMeetUp === 0
        ? 1
        : contact.hasBeenSentEmailOrMeetUp === 1
          ? 2
          : contact.hasBeenSentEmailOrMeetUp === 2
            ? 3
            : 0
    })
  }
  return { handleClickHasBeenCalled, handleClickhasBeenSentEmailOrMeetUp }
}

export {
  StyledTableCell,
  StyledTableRow,
  TabPanel,
  StyledRatingStars,
  StyledRating,
  customIcons,
  IconContainer,
  useRightMailIcon,
  useIconUtilities,
  useHandleClickHasBeenCalledAndHasBeenSentEmailOrMeetUp,
}