import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


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
              <Box
              // sx={{ p: 3 }}
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

export { StyledTableCell, StyledTableRow, TabPanel, TABS_WIDTH, deleteModalStyle }