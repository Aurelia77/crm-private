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
    //backgroundColor: theme.palette.common.black,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    // Centrer le texte horizontalement
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    //fontWeight: 700,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    //border: 1,
    //alignContent: 'center',   // Marche pas 
  },
}));


const StyledTableRow = styled(TableRow)(({ theme } : any) => ({
  //className: "tableRowSelected",

  '&:nth-of-type(odd)': {
    //backgroundColor: theme.palette.action.hover,
    backgroundColor: theme.palette.gray.light,
    //backgroundColor: theme.palette.secondary.light,  
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    // border: 0,       // ???
  },
  "&:hover": {
    backgroundColor: theme.palette.gray.main,
  },
  "&.Mui-selected": {
    "backgroundColor": theme.palette.lightCyan.light, 
    "color": "#CCC",                         // Marche pas non plus
    "border": "2px solid #CCC",
  },
  //"&.Mui-selected.Mui-focusVisible": { background: "green" },   // change rien !!!
  "&.Mui-selected:hover": { background: theme.palette.lightCyan.main,  },  
  // tableRowSelected: {    // Marche pas !!!
  //   backgroundColor: theme.palette.ochre.main
  // },

}));

const TABS_WIDTH = 100

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`vertical-tabpanel-${index}`}
          aria-labelledby={`vertical-tab-${index}`}
          style={{ width: `calc(100vw - ${TABS_WIDTH}px)` }}
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
// function a11yProps(index: number) {
//   return {
//       id: `vertical-tab-${index}`,
//       'aria-controls': `vertical-tabpanel-${index}`,
//   };
// }

const deleteModalStyle = {
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
    color: theme.palette.primary.main, 
  },
}));

// Pour les ETOILES de la PRIORITY
// const StyledRatingStars = styled(Rating)({
//   '& .MuiRating-iconFilled': {
//     color: '#ff6d75',
//   },
//   '& .MuiRating-iconHover': {
//     color: 'cyan',
//   },
// });

// Pour les smileys du RATING 
// => (dans le composant car besoin de connaitre la donnée pour ajuster la taille en fonction)  NON car sinon il faut cliquer 2 fois pour que ça valide !!!  
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
      icon: <SentimentVeryDissatisfiedIcon color="error" sx={{fontSize:"2.5rem"}}
      // fontSize="large"
      //fontSize={contact.interestGauge === 1 ? 'large' : 'small'} 
      />,
      //emptyIcon:<SentimentVeryDissatisfiedIcon fontSize="small" />,
      label: 'Very Dissatisfied',
  },
  2: {
      icon: <SentimentDissatisfiedIcon color="warning" sx={{fontSize:"2.5rem"}}
      //fontSize={contact.interestGauge === 2 ? 'large' : 'small'} 
      />,
      label: 'Dissatisfied',
  },
  3: {
      icon: <SentimentSatisfiedIcon color="secondary" sx={{fontSize:"2.5rem"}}
      //fontSize={contact.interestGauge === 3 ? 'large' : 'small'} 
      />,
      label: 'Neutral',
  },
  4: {
      icon: <SentimentSatisfiedAltIcon color="success" sx={{fontSize:"2.5rem"}}
      //fontSize={contact.interestGauge === 4 ? 'large' : 'small'} 
      />,
      label: 'Satisfied',
  },
  5: {
      icon: <SentimentVerySatisfiedIcon color="primary" sx={{fontSize:"2.5rem"}}
      //icon: <EmojiEmotionsIcon  color="success"
      //fontSize={contact.interestGauge === 5 ? 'large' : 'small'} 
      />,
      label: 'Very Satisfied',
  },
};
function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

export { StyledTableCell, StyledTableRow, TabPanel, TABS_WIDTH, deleteModalStyle, StyledRatingStars, StyledRating, customIcons, IconContainer }