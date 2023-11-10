import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';


const StyledTableCell = styled(TableCell)(({ theme }) => ({

  border: '1px solid #CCC',

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
  className: "tableRowSelected",

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

export { StyledTableCell, StyledTableRow }