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
import { Paper,  Typography, Chip } from '@mui/material'
import { SearchState, IntegratedFiltering } from '@devexpress/dx-react-grid'
import moment from 'moment';
import { useSelector } from 'react-redux';
import Api from '../../../services/Api';
import RowMenu from '../../menus/MenuPosts'

const TableCellComponent = ({ ...props }) => (
  <Table.Cell
    {...props}
    style={{ paddingTop: 10, paddingBottom: 10 }}
  />
);

const PostTable = ({
  data,
  setInstData,
  setdataTable,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setValue,
  setVisible,
  setProgress,
  setVisibleEditEntry,
  setEntryData,
  setVisibleDelete
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

      const setInfo = async (entry_id, tab) => {
        setProgress(true)
        await Api.get("/blog/entryId?id=" + entry_id)
          .then(async (res) => {
            setEntryData(res.data.entry)
            if (tab === 1) {
              setVisibleEditEntry(true)
            } else {
              setVisibleDelete(true)
            }
          })
          .catch((error) => {
            console.error('Error:', error.message)
          })
        setProgress(false)
      }

      const changeStatus = (id, status) => {
        setProgress(true)
        var change_entry = {
          _id: id,
          status: status,
        }
          ; (async () => {
            await Api.post('/blog/change', change_entry)
              .then(async (res) => {
                if (res.data.entry) {
                  setProgress(false)
                  setOpenSnack(true)
                  setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
                  await Api.get('/blog/entries')
                    .then((res) => {
                      setdataTable(res.data.entry)
                    })
                    .catch((error) => {
                      console.error('Error:', error.message)
                    })
                } else {
                  setProgress(false)
                  console.log(res.data.message.message)
                }
              })
              .catch((error) => {
                setProgress(false)
                console.error('Error:', error.message)
              })
          })()
      }

      const postRows = (data).map((entry, index) => ({
        id: index + 1,
        entryTitle: (
          <>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{entry.title}</Typography>
            <Typography sx={{ fontSize: 12 }}>
              {entry.ins_type} {entry.ins_type === 'Censo' ? ' asociado' : ' asociada'}: {entry.instrument_name}
            </Typography>
          </>
        ),
        createdBy: (
          <>
            <Typography sx={{ fontSize: 14 }}>{typeof entry.createdBy !== "undefined" ? entry.createdBy : 'Sistema'}</Typography>
            <Typography sx={{ fontSize: 12 }}>
              Creado el: {moment(entry.createdAt).format('DD MMM YYYY')}
            </Typography>
          </>
        ),
        entryStatus: (
          <Chip
            fontSize="small"
            size="small"
            label={
              entry.status === 0
                ? 'Oculto en pág. principal'
                : 'Visible en pág. principal'
            }
            color={entry.status === 1 ? 'success' : 'warning'}
          />
        ),
        actions: (
          <>
            <RowMenu row={entry} setInfo={setInfo} reduxInfo={todos.userInfo} changeStatus={changeStatus} sx={{ cursor: "pointer" }} />
          </>
        ),
      }))
      setRows(postRows)
      setColumnWidths([
        // { columnName: 'instrumentTitle', width: 0 },
        // { columnName: 'instrumentType', width: 0 },
        // { columnName: 'colHiddenCreated', width: 0 },
        // { columnName: 'colHiddenStatus', width: 0 },
        { columnName: 'entryTitle', width: '40%' },
        // { columnName: 'entryType', width: '15%' },
        // { columnName: 'study_responses', width: '10%' },
        { columnName: 'createdBy', width: '20%' },
        { columnName: 'entryStatus', width: '25%' },
        { columnName: 'actions', width: '15%' },
      ])
    })();

  }, [data, setRows, setdataTable, setOpenSnack, setSnackMessage, snackMessage, setInstData, setValue, setVisible, setProgress, todos, setVisibleEditEntry, setEntryData, setVisibleDelete])
  //Columnas del grid
  const columns = [
    // { name: 'id', title: 'Id' },
    // { name: 'instrumentTitle', title: " " },
    // { name: 'instrumentType', title: " " },
    // { name: 'colHiddenCreated', title: " " },
    // { name: 'colHiddenStatus', title: " " },
    { name: 'entryTitle', title: 'Título de la publicación' },
    // { name: 'entryType', title: 'Tipo' },
    /*{ name: 'createdAt', title: 'Creado el' },*/
    { name: 'entryStatus', title: 'Estado' },
    { name: 'createdBy', title: 'Creado por' },
    { name: 'actions', title: 'Acciones' },
  ]

  const [tableColumnExtensions] = useState([
    // { columnName: 'id', align: 'left', width: '5%' },
    { columnName: 'entryTitle', align: 'left', wordWrapEnabled: true },
    // { columnName: 'entryType', align: 'left' },
    // { columnName: 'study_responses', align: 'center' },
    { columnName: 'createdBy', align: 'left', wordWrapEnabled: true },
    { columnName: 'entryStatus', align: 'center', wordWrapEnabled: true },
    /*{ columnName: 'createdAt', align: 'center' },*/
    { columnName: 'actions', align: 'center' },
  ])

  const PagingPanelContainer = ({ ...props }) => <PagingPanel.Container {...props} />

  const pagingMessages = {
    info: ({ from, to, count }) => `${from}${from < to ? `-${to}` : ''} ${'de'} ${count}`,
    rowsPerPage: 'Publicaciones por página',
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

PostTable.propTypes = {
  data: PropTypes.array,
  setInstData: PropTypes.func,
  setdataTable: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setValue: PropTypes.func,
  setVisible: PropTypes.func,
  setProgress: PropTypes.func,
  setVisibleEditEntry: PropTypes.func,
  setEntryData: PropTypes.func,
  setVisibleDelete: PropTypes.func,
}

export default PostTable
