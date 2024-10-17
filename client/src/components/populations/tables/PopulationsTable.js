import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  SearchPanel,
  Toolbar,
  TableColumnVisibility,
  TableColumnResizing,
} from "@devexpress/dx-react-grid-material-ui";
import { PagingState, IntegratedPaging } from "@devexpress/dx-react-grid";
import { Paper, Chip, Typography } from "@mui/material";
import { SearchState, IntegratedFiltering } from "@devexpress/dx-react-grid";
import Api from "../../../services/Api";
import { utils, writeFile } from "xlsx";
import moment from 'moment';
import { useSelector } from "react-redux";
import RowMenu from '../../menus/MenuPopulations'

const TableCellComponent = ({ ...props }) => (
  <Table.Cell
    {...props}
    style={{ paddingTop: 10, paddingBottom: 10 }}
  />
);

const PopulationsTable = ({
  data,
  setPopulationData,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setVisibleView,
  setVisibleEdit,
  setVisibleDelete,
  setResult,
  setProgress
}) => {
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchState] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([25, 50, 100]);
  const todos = useSelector((state) => state.todos);
  const [columnWidths, setColumnWidths] = useState([])
  const [defaultHiddenColumnNames] = useState([
    "colHiddenCreated",
    "colHiddenStatus",
  ]);


  const tableMessages = {
    noData: "No hay registros",
  };

  useEffect(() => {

    const populationExport = async (population, name) => {
      var export_population = {
        _id: population,
      };

      await Api.post("/population/export", export_population).then(async (res) => {
        var wb = utils.book_new(),
          ws = utils.json_to_sheet(res.data.population)

        utils.book_append_sheet(wb, ws, "Sheet1");
        writeFile(wb, "Population-" + name + moment().format("DD MM YYYY HH:mm:ss") + ".xlsx")

        setOpenSnack(true);
        setSnackMessage({
          ...snackMessage,
          color: "success",
          message: res.data.message,
        });

      }).catch((error) => {
        console.log(error)
        setOpenSnack(true);
        setSnackMessage({
          ...snackMessage,
          color: "error",
          message: error.response.data.message,
        });
      });
    }

    const changeStatus = async (id, status) => {
      setProgress(true)
      var change_population = {
        _id: id,
        isActive: status,
      }
      await Api.post('/population/change', change_population)
        .then(async (res) => {
          setOpenSnack(true)
          setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
          await Api.get("/population/all?roleA=" + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
            .then((res) => {
              setResult(res.data.populations);
            })
            .catch((error) => {
              setSnackMessage({
                color: "error",
                message: error.response.data.message,
              });
              setOpenSnack(true);
            });
          setProgress(false);
        })
        .catch((error) => {
          setProgress(false)
          console.error('Error:', error.message)
        })
    }

    const setInfo = async (population_id, action) => {
      setProgress(true)
      await Api.get('/population/get?id=' + population_id)
        .then((res) => {
          setPopulationData(res.data.population)
          if (action === 'v') {
            setVisibleView(true);
          } else if (action === 'e') {
            setVisibleEdit(true);
          } else if (action === 'd') {
            setVisibleDelete(true);
          }
        })
        .catch((error) => {
          console.error('Error:', error.message)
        })
      setProgress(false)
    }

    const populationsRows = data.map((population, index) => ({
      id: index + 1,
      colHiddenCreated: typeof population.createdBy !== "undefined" ? population.createdBy : 'Sistema',
      colHiddenStatus: population.isActive === false
        ? 'Solo para mí'
        : population.isActive === true
          ? 'Visible'
          : 'Eliminado',
      population_title: population.name,
      //col2: population.description,
      population_origin: population.origin === "I" ? 'Importación por Excel' : (population.origin === "P" ? 'Portafolio Digital UCV' : "Proveniente de censo"),
      population_count: population.count,
      createdBy: (<>
        <Typography sx={{ fontSize: 14 }}>{typeof population.createdBy !== "undefined" ? population.createdBy : 'Sistema'}</Typography>
        <Typography sx={{ fontSize: 12 }}>
          Creado el: {moment(population.createdAt).format('DD MMM YYYY')}
        </Typography>
      </>),
      population_status: (
        <Chip
          fontSize="small"
          size="small"
          label={
            population.isActive === false
              ? 'Solo para mí'
              : population.isActive === true
                ? 'Visible'
                : 'Eliminado'
          }
          color={population.isActive === true ? 'success' : 'warning'}
        />
      ),
      actions: (
        <>
          <RowMenu row={population} setInfo={setInfo} reduxInfo={todos.userInfo} changeStatus={changeStatus} populationExport={populationExport} sx={{ cursor: "pointer" }} />
        </>
      ),
    }));

    setRows(populationsRows);

    setColumnWidths([
      { columnName: 'colHiddenCreated', width: 0 },
      { columnName: 'colHiddenStatus', width: 0 },
      { columnName: 'population_title', width: '30%' },
      { columnName: 'population_origin', width: '20%' },
      { columnName: 'population_count', width: '10%' },
      { columnName: 'createdBy', width: '15%' },
      { columnName: 'population_status', width: '10%' },
      { columnName: 'actions', width: '15%' },
    ])
  }, [data, setRows, setOpenSnack, setSnackMessage, snackMessage, setPopulationData, setVisibleView, setVisibleEdit, setVisibleDelete, setProgress, setResult, todos]);

  //Columnas del grid
  const columns = [
    { name: 'colHiddenCreated', title: " " },
    { name: 'colHiddenStatus', title: " " },
    { name: "population_title", title: "Nombre" },
    { name: "population_origin", title: "Origen de los datos" },
    { name: "population_count", title: "Cant. registros" },
    { name: "createdBy", title: "Creado por" },
    { name: "population_status", title: "Visibilidad" },
    { name: "actions", title: "Acciones" },
  ];

  const [tableColumnExtensions] = useState([
    { columnName: "population_title", align: "left", wordWrapEnabled: true },
    { columnName: "population_origin", align: "center", wordWrapEnabled: true },
    { columnName: "population_count", align: "center" },
    { columnName: "population_status", align: "center" },
    { columnName: 'createdBy', align: 'left', wordWrapEnabled: true },
    { columnName: "actions", align: "center" },
  ]);

  const PagingPanelContainer = ({ ...props }) => (
    <PagingPanel.Container {...props} />
  );

  const pagingMessages = {
    info: ({ from, to, count }) =>
      `${from}${from < to ? `-${to}` : ""} ${"de"} ${count}`,
    rowsPerPage: "Poblaciones por página",
  };

  const searchMessages = {
    searchPlaceholder: "Buscar",
  };



  return (
    <>
      <Paper className="table1">
        <Grid rows={rows} columns={columns}>
          <SearchState value={searchValue} onValueChange={setSearchState} />
          <IntegratedFiltering />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
          <IntegratedPaging />
          <Table
            columnExtensions={tableColumnExtensions}
            messages={tableMessages}
            cellComponent={TableCellComponent}
          />
          <TableColumnResizing columnWidths={columnWidths} onColumnWidthsChange={setColumnWidths} resizingMode={"nextColumn"} />
          <TableColumnVisibility
            defaultHiddenColumnNames={defaultHiddenColumnNames}
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
    </>
  );
};

PopulationsTable.propTypes = {
  data: PropTypes.array,
  setPopulationData: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setVisibleView: PropTypes.func,
  setVisibleDelete: PropTypes.func,
  setResult: PropTypes.func,
  setProgress: PropTypes.func,
};

export default PopulationsTable;
