import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  IconButton,
  Paper,
  Box,
  Typography,
  AppBar,
  Slide,
  TextField,
} from "@mui/material";
import GridMUI from "@mui/material/Grid";
import ToolbarMUI from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import { PagingState, IntegratedPaging } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  SearchPanel,
  Toolbar,
} from "@devexpress/dx-react-grid-material-ui";
import { SearchState, IntegratedFiltering } from "@devexpress/dx-react-grid";
import { alpha, styled } from "@mui/material/styles";

const PREFIX = "ViewPopulation";
const classes = {
  tableStriped: `${PREFIX}-tableStriped`,
};

const StyledTable = styled(Table.Table)(({ theme }) => ({
  [`&.${classes.tableStriped}`]: {
    "& tbody tr:nth-of-type(odd)": {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
  },
}));

const TableComponent = (props) => (
  <StyledTable {...props} className={classes.tableStriped} />
);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TableCellComponent = ({ ...props }) => (
  <Table.Cell
    {...props}
    style={{ paddingTop: 10, paddingBottom: 10 }}
  />
);

const initialState = {
  name: "",
  description: "",
};

const ViewPopulation = ({ populationData, setVisible, visible }) => {
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchState] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([25, 50, 100]);
  const [columns, setColumns] = useState([]);
  const [{ name, description }, setState] = useState(initialState);

  useEffect(() => {
    (async () => {
      let populationColumns = [];
      if (Object.keys(populationData).length !== 0) {
        populationData.header.forEach((item, index) => {
          populationColumns.push({ name: index, title: item });
        });
        setColumns(populationColumns);

        let aux_arr = [];
        populationData.data.forEach((population, index) => {
          let aux_obj = {};
          population.forEach((population2, index2) => {
            aux_obj[index2] = population2;
          });
          aux_arr.push(aux_obj);
        });
        setRows(aux_arr);

        setState((prevState) => ({
          ...prevState,
          name: populationData.name,
          description: populationData.description,
        }));

      }
    })();
  }, [populationData, setColumns, setRows, setState]);

  /*const [tableColumnExtensions] = useState([
    { columnName: "id", align: "left", width: "5%" },
    { columnName: "col1", align: "left", width: "25%" },
    { columnName: "col3", align: "center", width: "10%" },
    { columnName: "col4", align: "center", width: "10%" },
    { columnName: "col5", align: "center" },
  ]);*/

  const PagingPanelContainer = ({ ...props }) => (
    <PagingPanel.Container {...props} />
  );

  const pagingMessages = {
    info: ({ from, to, count }) =>
      `${from}${from < to ? `-${to}` : ""} ${"de"} ${count}`,
    rowsPerPage: "Datos de poblaciones por página",
  };

  const searchMessages = {
    searchPlaceholder: "Buscar datos en poblaciones",
  };

  const cleanModal = () => {
    setVisible(false);
  };

  return (
    <>
      <Dialog
        fullScreen
        open={visible}
        onClose={cleanModal}
        transitioncomponent={Transition}
      >
        <AppBar sx={{ position: "relative", backgroundColor: '#0d47a1' }}>
          <ToolbarMUI>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Ver población
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={cleanModal}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </ToolbarMUI>
        </AppBar>
        <Box sx={{ width: "100%" }}>
          <GridMUI
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            justifyContent="center"
            sx={{ px: 4, pt: 4 }}
          >
            <GridMUI item xs={12}>
              <TextField
                variant="standard"
                size="small"
                label="Nombre de la población"
                type="text"
                value={name}
                autoComplete="current-name"
                fullWidth
              />
            </GridMUI>
            <GridMUI item xs={12}>
              <TextField
                id="standard-multiline-static"
                label="Descripción de la población"
                multiline
                rows={2}
                fullWidth
                variant="standard"
                value={description}
              />
            </GridMUI>
          </GridMUI>
        </Box>
        <Box sx={{ width: "100%", pt: 0 }}>
          <Box sx={{ p: 4 }}>
            <Paper>
              <Grid rows={rows} columns={columns}>
                <SearchState
                  value={searchValue}
                  onValueChange={setSearchState}
                />
                <IntegratedFiltering />
                <PagingState
                  currentPage={currentPage}
                  onCurrentPageChange={setCurrentPage}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                />
                <IntegratedPaging />
                <Table
                  /*columnExtensions={tableColumnExtensions}*/
                  tableComponent={TableComponent}
                  cellComponent={TableCellComponent}
                />
                <TableHeaderRow />
                <Toolbar />
                <SearchPanel messages={searchMessages} />
                <PagingPanel
                  containerComponent={PagingPanelContainer}
                  messages={pagingMessages}
                  pageSizes={pageSizes}
                />
              </Grid>
            </Paper>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
export default ViewPopulation;

ViewPopulation.propTypes = {
  populationData: PropTypes.object,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
};
