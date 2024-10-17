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
import { Paper, Typography, /*Badge,*/ } from '@mui/material'
import { SearchState, IntegratedFiltering } from '@devexpress/dx-react-grid'
import moment from 'moment';
/*import Api from '../../../services/Api';*/
import Api from '../../../services/Api';
import RowMenu from '../../menus/MenuStudies'

import { useSelector } from 'react-redux';

const TableCellComponent = ({ ...props }) => (
  <Table.Cell
    {...props}
    style={{ paddingTop: 10, paddingBottom: 10 }}
  />
);

/*const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -2,
    top: 1,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 3px',
    fontSize: 10
  },
}));*/

const StudiesTable = ({
  data,
  setInstData,
  setdataTable,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setValue,
  setVisible,
  setProgress,
  setEntryData,
  setVisibleEditEntry,
}) => {
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchState] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([25, 50, 100]);
  const [columnWidths, setColumnWidths] = useState([]);
  const [defaultHiddenColumnNames] = useState([
    "instrumentTitle",
    "instrumentType",
    "colHiddenCreated",
    "colHiddenStatus",
  ]);
  const todos = useSelector((state) => state.todos);

  useEffect(() => {
    (async () => {

      const setInfo = async (type, id) => {
        setProgress(true)
        await Api.get("/blog/entry?type=" + type.toLowerCase() + "&id=" + id)
          .then(async (res) => {
            console.log(res.data.entry)
            setEntryData(res.data.entry)
            setVisibleEditEntry(true)
          })
          .catch((error) => {
            console.error('Error:', error.message)
          })
        setProgress(false)
      }
      const studiesRows = (data).map((study, index) => ({
        id: index + 1,
        instrumentTitle: study.title !== undefined ? study.title : 'Sin título',
        instrumentType: study.ins_type,
        colHiddenCreated: typeof study.createdBy !== "undefined" ? study.createdBy : 'Sistema',
        colHiddenStatus: (study.status === 0
          ? 'No publicado'
          : study.status === 1
            ? 'Publicado'
            : 'Finalizado'
        ),
        study_title:
          (
            <>
              <Typography sx={{ fontSize: 14, fontWeight: '600' }}>{study.title !== undefined ? study.title : 'Sin título'}</Typography>
            </>
          ),
        study_type:
          (
            <>
              <Typography sx={{ fontSize: 14, fontWeight: '600' }}>{study.ins_type}</Typography>
              <Typography sx={{ fontSize: 12 }}>
                Tipo {study.ins_type.toLowerCase()}: {study.type === 0 ? study.ins_type === 'Censo' ? 'abierto' : 'abierta' : study.ins_type === 'Censo' ? 'cerrado' : 'cerrada'}
              </Typography>
            </>
          ),
        study_responses: study.result_count,
        createdBy: (
          <>
            <Typography sx={{ fontSize: 14 }}>{typeof study.createdBy !== "undefined" ? study.createdBy : 'Sistema'}</Typography>
            <Typography sx={{ fontSize: 12 }}>
              Creado el: {moment(study.createdAt).format('DD MMM YYYY')}
            </Typography>
          </>
        ),
        study_status: (study.status === 0
          ? (<Typography sx={{ fontSize: 14, fontWeight: '600' }}>No publicado</Typography>)
          : study.status === 1
            ? (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: '600' }}>Publicado</Typography>
                <Typography sx={{ fontSize: 12 }}>
                  Fecha fin: {moment(study.endDate).format('DD MMM YYYY')}
                </Typography>
              </>
            )
            : (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: '600' }}>Finalizado</Typography>
                <Typography sx={{ fontSize: 12 }}>
                  Finalizó el: {moment(study.endDate).format('DD MMM YYYY')}
                </Typography>
              </>
            )
        ),
        actions: (
          <>
            <RowMenu row={study} setInfo={setInfo} reduxInfo={todos.userInfo} setInstData={setInstData} setValue={setValue} setVisible={setVisible} sx={{ cursor: "pointer" }} />
          </>
        ),
      }))
      setRows(studiesRows)
      setColumnWidths([
        { columnName: 'instrumentTitle', width: 0 },
        { columnName: 'instrumentType', width: 0 },
        { columnName: 'colHiddenCreated', width: 0 },
        { columnName: 'colHiddenStatus', width: 0 },
        { columnName: 'study_title', width: '30%' },
        { columnName: 'study_type', width: '15%' },
        { columnName: 'study_responses', width: '10%' },
        { columnName: 'createdBy', width: '15%' },
        { columnName: 'study_status', width: '15%' },
        { columnName: 'actions', width: '15%' },
      ])
    })();

  }, [data, setRows, setdataTable, setOpenSnack, setSnackMessage, snackMessage, setInstData, setValue, setVisible, setProgress, setEntryData, setVisibleEditEntry, todos])
  //Columnas del grid
  const columns = [
    // { name: 'id', title: 'Id' },
    { name: 'instrumentTitle', title: " " },
    { name: 'instrumentType', title: " " },
    { name: 'colHiddenCreated', title: " " },
    { name: 'colHiddenStatus', title: " " },
    { name: 'study_title', title: 'Título de instrumento' },
    { name: 'study_type', title: 'Tipo' },
    { name: 'study_responses', title: 'Cant. Respuestas' },
    /*{ name: 'createdAt', title: 'Creado el' },*/
    { name: 'createdBy', title: 'Creado por' },
    { name: 'study_status', title: 'Etapa' },
    { name: 'actions', title: 'Acciones' },
  ]

  const [tableColumnExtensions] = useState([
    // { columnName: 'id', align: 'left', width: '5%' },
    { columnName: 'study_title', align: 'left', wordWrapEnabled: true },
    { columnName: 'study_type', align: 'left' },
    { columnName: 'study_responses', align: 'center' },
    { columnName: 'createdBy', align: 'left', wordWrapEnabled: true },
    /*{ columnName: 'createdAt', align: 'center' },*/
    { columnName: 'actions', align: 'center' },
  ])

  const PagingPanelContainer = ({ ...props }) => <PagingPanel.Container {...props} />

  const pagingMessages = {
    info: ({ from, to, count }) => `${from}${from < to ? `-${to}` : ''} ${'de'} ${count}`,
    rowsPerPage: 'Censos/Encuestas por página',
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

StudiesTable.propTypes = {
  data: PropTypes.array,
  setInstData: PropTypes.func,
  setdataTable: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setValue: PropTypes.func,
  setVisible: PropTypes.func,
  setProgress: PropTypes.func,
  setEntryData: PropTypes.func,
  setVisibleEditEntry: PropTypes.func,
}

export default StudiesTable
