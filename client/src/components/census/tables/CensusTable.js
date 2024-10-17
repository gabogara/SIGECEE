import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  SearchPanel,
  Toolbar,
  TableColumnResizing,
  TableColumnVisibility,
} from '@devexpress/dx-react-grid-material-ui'
import { PagingState, IntegratedPaging } from '@devexpress/dx-react-grid'
import { Paper, Typography, Chip } from '@mui/material'
import { SearchState, IntegratedFiltering } from '@devexpress/dx-react-grid'
import Api from '../../../services/Api';
import moment from 'moment';
import { useSelector } from 'react-redux';
import RowMenu from '../../menus/MenuInstrument'

const TableCellComponent = ({ ...props }) => (
  <Table.Cell
    {...props}
    style={{ paddingTop: 10, paddingBottom: 10 }}
  />
);

const CensusTable = ({
  data,
  setVisiblePublish,
  setCensusData,
  setdataTable,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setProgress,
  setPopulation,
  setVisibleView,
  setVisibleEdit,
  setVisibleDelete,
  setVisibleResult,
  setResult,
  creator
}) => {
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchState] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([25, 50, 100]);
  const todos = useSelector((state) => state.todos);
  const [columnWidths, setColumnWidths] = useState([]);
  const [defaultHiddenColumnNames] = useState([
    "censusTitle",
    "censusType",
    "colHiddenCreated",
    "colHiddenVisibility",
    "colHiddenStatus",
  ]);

  useEffect(() => {
    (async () => {
      const changeStatus = async (id, status) => {
        setProgress(true)
        var change_census = {
          _id: id,
          visibility: status,
        }
        await Api.post('/census/change', change_census)
          .then(async (res) => {
            if (res.data.census) {
              setOpenSnack(true)
              setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
              await Api.get('/census/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
                setdataTable(res.data.census)
              })
                .catch((error) => {
                  console.error('Error:', error.message)
                })
            } else {
              console.log(res.data.message.message)
            }
          })
          .catch((error) => {
            console.error('Error:', error.message)
          })
        setProgress(false)
      }

      const setInfo = async (census_id, tab) => {
        setProgress(true)
        await Api.get('/census/get?id=' + census_id)
          .then(async (res) => {
            creator.JSON = {}
            creator.text = ''
            creator.activeTab = "designer"
            setCensusData(res.data.census)
            if (tab === 2) {
              setVisibleView(true)
            } else if (tab === 3) {
              setVisibleEdit(true)
            } else if (tab === 4) {
              setProgress(true)
              var obj_result = {
                _id: census_id
              }

              await Api.post('/census/getResults', obj_result)
                .then((res) => {
                  setResult(res.data.results);
                })
                .catch((error) => {
                  console.error('Error:', error.message);
                });
              setProgress(false)
              setVisibleResult(true)
            } else if (tab === 5) {
              setVisibleDelete(true)
            }
          })
          .catch((error) => {
            console.error('Error:', error.message)
          })
        setProgress(false)
      }

      const setPublish = async (census_id, tab) => {
        await setInfo(census_id, tab).then(async () => {
          await Api.get("/population/all/data?roleA=" + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
            .then(async (res) => {
              await setPopulation(res.data.populations);
              setVisiblePublish(true)
            })
            .catch((error) => {
              console.log('Error:', error.message);
            });
        });
      }

      const censusRows = (data).map((census, index) => ({
        id: index + 1,
        censusTitle: census.title !== undefined ? census.title : '-',
        censusType: census.type === 0 ? 'Tipo censo: abierto' : census.type === 1 ? (census.anonymous === true ? 'Tipo censo: cerrado y respuestas anónimas' : 'Tipo censo: cerrado') : '',
        colHiddenCreated: typeof census.createdBy !== "undefined" ? census.createdBy : 'Sistema',
        colHiddenVisibility: census.visibility === false
          ? 'Solo para mí'
          : census.visibility === true
            ? 'Visible'
            : 'Eliminado',
        colHiddenStatus: (census.status === 0
          ? 'No publicado'
          : census.status === 1
            ? 'Publicado'
            : 'Finalizado'
        ),
        census_title:
          (
            <>
              <Typography sx={{ fontSize: 14, fontWeight: '600' }}>{census.title !== undefined ? census.title : '-'}</Typography>
              <Typography sx={{ fontSize: 12 }}>
                {census.type === 0 ? 'Tipo censo: abierto' : census.type === 1 ? (census.anonymous === true ? 'Tipo censo: cerrado y respuestas anónimas' : 'Tipo censo: cerrado') : ''}
              </Typography>
            </>
          ),
        // census_description:
        //   census.description !== undefined ? (
        //     <>
        //       <div className="small text-medium-emphasis">{census.description}</div>
        //     </>
        //   ) : (
        //     <>
        //       <div className="small text-medium-emphasis">-</div>
        //     </>
        //   ),
        census_elements: census.count_questions,
        createdBy: (
          <>
            <Typography sx={{ fontSize: 14 }}>{typeof census.createdBy !== "undefined" ? census.createdBy : 'Sistema'}</Typography>
            <Typography sx={{ fontSize: 12 }}>
              Creado el: {moment(census.createdAt).format('DD MMM YYYY')}
            </Typography>
          </>
        ),
        census_visibility: (
          <Chip
            fontSize="small"
            size="small"
            label={
              census.visibility === false
                ? 'Solo para mí'
                : census.visibility === true
                  ? 'Visible'
                  : 'Eliminado'
            }
            color={census.visibility === true ? 'success' : 'warning'}
          />
        ),
        census_status: (census.status === 0
          ? (<Typography sx={{ fontSize: 14, fontWeight: '600' }}>No publicado</Typography>)
          : census.status === 1
            ? (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: '600' }}>Publicado</Typography>
                <Typography sx={{ fontSize: 12 }}>
                  Fecha fin: {moment(census.endDate).format('DD MMM YYYY')}
                </Typography>
              </>
            )
            : (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: '600' }}>Finalizado</Typography>
                <Typography sx={{ fontSize: 12 }}>
                  Finalizó el: {moment(census.endDate).format('DD MMM YYYY')}
                </Typography>
              </>
            )
        ),
        actions: (
          <>
              <RowMenu row={census} setInfo={setInfo} reduxInfo={todos.userInfo} changeStatus={changeStatus} sx={{ cursor: "pointer" }} setPublish={setPublish} />
          </>
        ),
      }))
      setRows(censusRows)

      setColumnWidths([
        { columnName: 'censusTitle', width: 0 },
        { columnName: 'censusType', width: 0 },
        { columnName: 'colHiddenCreated', width: 0 },
        { columnName: 'colHiddenVisibility', width: 0 },
        { columnName: 'colHiddenStatus', width: 0 },
        { columnName: 'census_title', width: '30%' },
        { columnName: 'census_elements', width: '15%' },
        { columnName: 'createdBy', width: '15%' },
        { columnName: 'census_visibility', width: '10%' },
        { columnName: 'census_status', width: '15%' },
        { columnName: 'actions', width: '15%' },
      ])
    })();

  }, [creator, data, setCensusData, setOpenSnack, setPopulation, setProgress, setResult, setSnackMessage, setVisibleDelete, setVisibleEdit, setVisiblePublish, setVisibleResult, setVisibleView, setdataTable, snackMessage, todos])

  //Columnas del grid
  const columns = [
    { name: 'censusTitle', title: " " },
    { name: 'censusType', title: " " },
    { name: 'colHiddenCreated', title: " " },
    { name: 'colHiddenVisibility', title: " " },
    { name: 'colHiddenStatus', title: " " },
    { name: 'census_title', title: 'Título' },
    //{ name: 'census_description', title: 'Descripción' },
    { name: 'census_elements', title: 'Cant. preguntas' },
    /*{ name: 'createdAt', title: 'Creado el' },*/
    { name: 'createdBy', title: 'Creado por' },
    { name: 'census_visibility', title: 'Visibilidad' },
    { name: 'census_status', title: 'Etapa' },
    { name: 'actions', title: 'Acciones' },
  ]

  const [tableColumnExtensions] = useState([
    // { columnName: 'id', align: 'left', width: '5%' },
    { columnName: 'census_title', align: 'left', wordWrapEnabled: true },
    //{ columnName: 'census_description', align: 'left', width: '15%' },
    { columnName: 'census_elements', align: 'center' },
    { columnName: 'census_visibility', align: 'center' },
    { columnName: 'createdBy', align: 'left', wordWrapEnabled: true },
    /*{ columnName: 'createdAt', align: 'center' },*/
    { columnName: 'actions', align: 'center' },
  ])

  const PagingPanelContainer = ({ ...props }) => <PagingPanel.Container {...props} />

  const pagingMessages = {
    info: ({ from, to, count }) => `${from}${from < to ? `-${to}` : ''} ${'de'} ${count}`,
    rowsPerPage: 'Censos por página',
  }

  const searchMessages = {
    searchPlaceholder: 'Buscar',
  }

  const tableMessages = {
    noData: "No hay registros",
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
          <Table columnExtensions={tableColumnExtensions} messages={tableMessages} cellComponent={TableCellComponent} />
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
  )
}

CensusTable.propTypes = {
  data: PropTypes.array,
  setVisiblePublish: PropTypes.func,
  setCensusData: PropTypes.func,
  setdataTable: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setProgress: PropTypes.func,
  setPopulation: PropTypes.func,
  setVisibleView: PropTypes.func,
  setVisibleEdit: PropTypes.func,
  setVisibleDelete: PropTypes.func,
  setVisibleResult: PropTypes.func,
  setResult: PropTypes.func,
  creator: PropTypes.object,
}

export default CensusTable
