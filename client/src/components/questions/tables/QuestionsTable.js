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
import { Paper, Chip, Checkbox, Typography } from '@mui/material'
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

const QuestionsTable = ({
  data,
  setQuestionData,
  setdataTable,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  reduxInfo,
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
  const [columnWidths, setColumnWidths] = useState([])
  const tableMessages = {
    noData: "No hay registros"
  };
  const [defaultHiddenColumnNames] = useState([
    "colHiddenCreated",
    "colHiddenStatus",
  ]);

  useEffect(() => {
    //Cambio de visibilidad de preguntas
    const changeStatus = async (id, status) => {
      setProgress(true)
      var change_question = {
        _id: id,
        visibility: status,
      }
      await Api.post('/question/change', change_question)
        .then(async (res) => {
          setOpenSnack(true)
          setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })

          await Api.get('/question/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
            setdataTable(res.data.questions)
          })
        })
        .catch((error) => {
          setOpenSnack(true)
          setSnackMessage({
            ...snackMessage,
            color: 'error',
            message: error.response.data.message,
          })
        })
      setProgress(false)
    }

    const setInfo = async (question_id, tab) => {
      setProgress(true)
      await Api.get('/question/get?id=' + question_id)
        .then((res) => {
          setQuestionData(res.data.question)
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

    const questionRows = data.map((question, index) => ({
      id: index + 1,
      colHiddenCreated: typeof question.createdBy !== "undefined" ? question.createdBy : 'Sistema',
      colHiddenStatus: question.visibility === false
        ? 'Solo para mí'
        : question.visibility === true
          ? 'Visible'
          : 'Eliminado',
      question_title: question.title !== undefined ? question.title : question.name,
      /*question_type: question.inputType !== undefined ? question.inputType : question.type,*/
      question_isRequired: (
        <Checkbox
          disabled
          checked={question.isRequired !== undefined ? true : false}
          sx={{ p: 0 }}
        />
      ),
      question_createdBy: (<>
        <Typography sx={{ fontSize: 14 }}>{typeof question.createdBy !== "undefined" ? question.createdBy : 'Sistema'}</Typography>
        <Typography sx={{ fontSize: 12 }}>
          Creado el: {moment(question.createdAt).format('DD MMM YYYY')}
        </Typography>
      </>),
      question_visibility: (
        <Chip
          fontSize="small"
          size="small"
          label={
            question.visibility === false
              ? 'Solo para mí'
              : question.visibility === true
                ? 'Visible'
                : 'Eliminado'
          }
          color={question.visibility === true ? 'success' : 'warning'}
        />
      ),
      actions: (
        <>
          <RowMenu row={question} setInfo={setInfo} reduxInfo={reduxInfo} changeStatus={changeStatus} sx={{ cursor: "pointer" }} />
        </>
      ),
    }))

    setRows(questionRows)

    setColumnWidths([
      { columnName: 'colHiddenCreated', width: 0 },
      { columnName: 'colHiddenStatus', width: 0 },
      { columnName: 'question_title', width: '43%' },
      { columnName: 'question_isRequired', width: '15%' },
      { columnName: 'question_createdBy', width: '21%' },
      { columnName: 'question_visibility', width: '11%' },
      { columnName: 'actions', width: '10%' },
    ])
  }, [data, setRows, setQuestionData, setdataTable, setOpenSnack, setSnackMessage, snackMessage, reduxInfo, todos.userInfo.role.alias, todos.userInfo.school.alias, todos.userInfo.school._id, todos.userInfo._id, setProgress, setVisibleView, setVisibleEdit, setVisibleDelete])

  //Columnas del grid
  const columns = [
    { name: 'colHiddenCreated', title: " " },
    { name: 'colHiddenStatus', title: " " },
    { name: 'question_title', title: 'Pregunta' },
    { name: 'question_isRequired', title: '¿Obligatoria?' },
    { name: 'question_createdBy', title: 'Creado por' },
    { name: 'question_visibility', title: 'Visibilidad' },
    { name: 'actions', title: 'Acciones' },
  ]

  const [tableColumnExtensions] = useState([
    // { columnName: 'id', align: 'left', width: '5%' },
    { columnName: 'question_title', align: 'left', wordWrapEnabled: true },
    { columnName: 'question_isRequired', align: 'center' },
    { columnName: 'question_visibility', align: 'center' },
    { columnName: 'question_createdBy', align: 'left', wordWrapEnabled: true },
    { columnName: 'actions', align: 'center' },
  ])

  const PagingPanelContainer = ({ ...props }) => <PagingPanel.Container {...props} />

  const pagingMessages = {
    info: ({ from, to, count }) => `${from}${from < to ? `-${to}` : ''} ${'de'} ${count}`,
    rowsPerPage: 'Preguntas por página',
  }

  const searchMessages = {
    searchPlaceholder: 'Buscar',
  }

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

QuestionsTable.propTypes = {
  data: PropTypes.array,
  setQuestionData: PropTypes.func,
  setdataTable: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  reduxInfo: PropTypes.object,
  setProgress: PropTypes.func,
  setVisibleView: PropTypes.func,
  setVisibleEdit: PropTypes.func,
  setVisibleDelete: PropTypes.func,
}

export default QuestionsTable
