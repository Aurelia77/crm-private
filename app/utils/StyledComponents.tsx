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


const StyledTableRow = styled(TableRow)(({ theme } : any) => ({

  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.gray.light,
  },
  "&:hover": {
    backgroundColor: theme.palette.gray.main,
  },
  "&.Mui-selected:hover": { background: theme.palette.lightCyan.main,  }, 
}));

const TABS_WIDTH = 100

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

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',     // ???
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Pour les ETOILES de la PRIORITY
const StyledRatingStars = styled(Rating)(({ theme, color }) => ({
  '& .MuiRating-iconFilled': {
    color: color 
  },
  '& .MuiRating-iconHover': {
    color: color//theme.palette.primary.main, 
  },
}));

// Pour les smileys du RATING  
const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
      color: theme.palette.action.disabled,
      fontSize: '1.5rem'
  },
}))
const customIcons: {
  [index: string]: { icon: React.ReactElement; label: string;  };
} = {
  1: {
      icon: <SentimentVeryDissatisfiedIcon color="error" sx={{fontSize:"2.5rem"}}  />,
      label: 'Very Dissatisfied',
  },
  2: {
      icon: <SentimentDissatisfiedIcon color="warning" sx={{fontSize:"2.5rem"}}
      />,
      label: 'Dissatisfied',
  },
  3: {
      icon: <SentimentSatisfiedIcon color="secondary" sx={{fontSize:"2.5rem"}}
      />,
      label: 'Neutral',
  },
  4: {
      icon: <SentimentSatisfiedAltIcon color="success" sx={{fontSize:"2.5rem"}}
      />,
      label: 'Satisfied',
  },
  5: {
      icon: <SentimentVerySatisfiedIcon color="primary" sx={{fontSize:"2.5rem"}}
      />,
      label: 'Very Satisfied',
  },
};
function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

export { StyledTableCell, StyledTableRow, TabPanel, TABS_WIDTH, modalStyle, StyledRatingStars, StyledRating, customIcons, IconContainer }