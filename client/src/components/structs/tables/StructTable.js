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
import {
  Paper, Chip,
  Typography,
} from '@mui/material'
import { SearchState, IntegratedFiltering } from '@devexpress/dx-react-grid'
import Api from '../../../services/Api'
import moment from 'moment';
import { useSelector } from "react-redux";
import RowMenu from '../../menus/MenuQuestions'


const TableCellComponent = ({ ...props }) => (
  <Table.Cell
    {...props}
    style={{ paddingTop: 10, paddingBottom: 10 }}
  />
);

const StructTable = ({
  data,
  setStructData,
  setdataTable,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setProgress,
  setVisibleView,
  setVisibleEdit,
  setVisibleDelete,
}) => {
  //Paginacion
  const [rows, setRows] = useState([])
  const [searchValue, setSearchState] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([25, 50, 100]);
  const todos = useSelector((state) => state.todos);
  const [columnWidths, setColumnWidths] = useState([]);
  const [defaultHiddenColumnNames] = useState([
    "colHiddenCreated",
    "colHiddenStatus",
  ]);

  useEffect(() => {
    //Cambio de visibilidad de estructuras
    const changeStatus = (id, status) => {
      var change_struct = {
        _id: id,
        visibility: status,
      }
        ; (async () => {
          await Api.post('/struct/change', change_struct)
            .then(async (res) => {
              if (res.data.struct) {
                setOpenSnack(true)
                setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
                await Api.get('/struct/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
                  .then((res) => {
                    setdataTable(res.data.structs)
                  })
                  .catch((error) => {
                    setSnackMessage({
                      color: 'error',
                      message: error.response.data.message,
                    })
                    setOpenSnack(true)
                  })
              } else {
                console.log(res.data.message.message)
              }
            })
            .catch((error) => {
              console.error('Error:', error.message)
            })
        })()
    }

    const setInfo = async (struct_id, tab) => {
      setProgress(true)
      await Api.get('/struct/get?id=' + struct_id)
        .then((res) => {
          setStructData(res.data.struct)
          if (tab === 2) {
            setVisibleView(true)
          } else if (tab === 3) {
            setVisibleEdit(true)
          } else if (tab === 4) {
            setVisibleDelete(true)
          }
        })
        .catch((error) => {
          console.error('Error:', error.message)
        })
      setProgress(false)
    }

    const structRows = data.map((struct, index) => ({
      id: index + 1,
      colHiddenCreated: typeof struct.createdBy !== "undefined" ? struct.createdBy : 'Sistema',
      colHiddenStatus: struct.visibility === false
        ? 'Solo para mí'
        : struct.visibility === true
          ? 'Visible'
          : 'Eliminado',
      struct_title:
        struct.title !== undefined ? struct.title : 'Sin título',
      struct_count: struct.count_questions,
      struct_status: (
        <Chip
          fontSize="small"
          size="small"
          label={
            struct.visibility === false
              ? 'Solo para mí'
              : struct.visibility === true
                ? 'Visible'
                : 'Eliminado'
          }
          color={struct.visibility === true ? 'success' : 'warning'}
        />
      ),
      createdBy: (<>
        <Typography sx={{ fontSize: 14 }}>{typeof struct.createdBy !== "undefined" ? struct.createdBy : 'Sistema'}</Typography>
        <Typography sx={{ fontSize: 12 }}>
          Creado el: {moment(struct.createdAt).format('DD MMM YYYY')}
        </Typography>
      </>),
      actions: (
        <>
          <RowMenu row={struct} setInfo={setInfo} reduxInfo={todos.userInfo} changeStatus={changeStatus} sx={{ cursor: "pointer" }} />
        </>
      ),
    }))

    setRows(structRows)

    setColumnWidths([
      { columnName: 'colHiddenCreated', width: 0 },
      { columnName: 'colHiddenStatus', width: 0 },
      { columnName: 'struct_title', width: '43%' },
      { columnName: 'struct_count', width: '15%' },
      { columnName: 'createdBy', width: '21%' },
      { columnName: 'struct_status', width: '11%' },
      { columnName: 'actions', width: '10%' },
    ])
  }, [data, setRows, setStructData, setdataTable, setOpenSnack, setSnackMessage, snackMessage, setProgress, todos, setVisibleView, setVisibleEdit, setVisibleDelete])

  //Columnas del grid
  const columns = [
    // { name: 'id', title: 'Id' },
    { name: 'colHiddenCreated', title: " " },
    { name: 'colHiddenStatus', title: " " },
    { name: 'struct_title', title: 'Título' },
    { name: 'struct_count', title: 'Cant. preguntas' },
    { name: 'createdBy', title: 'Creado por' },
    { name: 'struct_status', title: 'Visibilidad' },
    { name: 'actions', title: 'Acciones' },
  ]

  const [tableColumnExtensions] = useState([
    // { columnName: 'id', align: 'left', width: '5%' },
    { columnName: 'struct_title', align: 'left', wordWrapEnabled: true },
    { columnName: 'struct_count', align: 'center' },
    { columnName: 'struct_status', align: 'center' },
    { columnName: 'createdBy', align: 'left', wordWrapEnabled: true },
    { columnName: 'actions', align: 'center' },
  ])

  const PagingPanelContainer = ({ ...props }) => <PagingPanel.Container {...props} />

  const pagingMessages = {
    info: ({ from, to, count }) => `${from}${from < to ? `-${to}` : ''} ${'de'} ${count}`,
    rowsPerPage: 'Estructuras por página',
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

StructTable.propTypes = {
  data: PropTypes.array,
  setStructData: PropTypes.func,
  setdataTable: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setProgress: PropTypes.func,
  setVisibleView: PropTypes.func,
  setVisibleEdit: PropTypes.func,
  setVisibleDelete: PropTypes.func,
}

export default StructTable
