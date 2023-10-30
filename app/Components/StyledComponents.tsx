import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    //backgroundColor: theme.palette.common.black,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    fontWeight: 700,
    fontSize: 15,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    //alignContent: 'center',
  },
}));


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    //backgroundColor: theme.palette.action.hover,
    //backgroundColor: theme.palette.grey[200],
    //backgroundColor: theme.palette.secondary.light,   // Pas possible car écrase la couleur de fond de la ligne sélectionnée !
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    // border: 0,       // ???
  },
  tableRowSelected: {
    backgroundColor: theme.palette.primary.main
  },
  // RIEN NE MARCHE !!!???
  // "&.Mui-selected": {
  //   "backgroundColor": "secondary.main",    // Marche pas, utilise tout le temps la couleur primaire très claire
  //   "color": "#CCC"                         // Marche pas non plus
  //   border: "2px solid #CCC",
  // },
}));

export { StyledTableCell, StyledTableRow }