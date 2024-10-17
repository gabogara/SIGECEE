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

const SurveysTable = ({
  data,
  setVisiblePublish,
  setSurveyData,
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
}) => {
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchState] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([25, 50, 100]);
  const todos = useSelector((state) => state.todos);
  const [columnWidths, setColumnWidths] = useState([]);
  const [defaultHiddenColumnNames] = useState([
    "surveyTitle",
    "surveyType",
    "colHiddenCreated",
    "colHiddenVisibility",
    "colHiddenStatus",
  ]);

  useEffect(() => {
    (async () => {
      const changeStatus = async (id, status) => {
        setProgress(true)
        var change_survey = {
          _id: id,
          visibility: status,
        }
        await Api.post('/survey/change', change_survey)
          .then(async (res) => {
            if (res.data.survey) {
              setOpenSnack(true)
              setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
              await Api.get('/survey/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
                .then((res) => {
                  setdataTable(res.data.survey)
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

      const setInfo = async (survey_id, tab) => {
        setProgress(true)
        await Api.get('/survey/get?id=' + survey_id)
          .then(async (res) => {
            setSurveyData(res.data.survey)
            if (tab === 2) {
              setVisibleView(true)
            } else if (tab === 3) {
              setVisibleEdit(true)
            } else if (tab === 4) {
              setProgress(true)
              var obj_result = {
                _id: survey_id
              }

              await Api.post('/survey/getResults', obj_result)
                .then((res) => {
                  setResult(res.data.results);
                })
                .catch((error) => {
                  console.error('Error:', error.message);
                });
              setVisibleResult(true)
              setProgress(false)
            } else if (tab === 5) {
              setVisibleDelete(true)
            }
          })
          .catch((error) => {
            console.error('Error:', error.message)
          })
        setProgress(false)
      }

      const setPublish = async (survey_id, tab) => {
        await setInfo(survey_id, tab).then(async () => {
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

      const surveyRows = (data).map((survey, index) => ({
        id: index + 1,
        surveyTitle: survey.title !== undefined ? survey.title : '-',
        surveyType: survey.type === 0 ? 'Tipo encuesta: abierta' : survey.type === 1 ? (survey.anonymous === true ? 'Tipo encuesta: cerrada y respuestas anónimas' : 'Tipo encuesta: cerrada') : '',
        colHiddenCreated: typeof survey.createdBy !== "undefined" ? survey.createdBy : 'Sistema',
        colHiddenVisibility: survey.visibility === false
          ? 'Solo para mí'
          : survey.visibility === true
            ? 'Visible'
            : 'Eliminado',
        colHiddenStatus: (survey.status === 0
          ? 'No publicado'
          : survey.status === 1
            ? 'Publicado'
            : 'Finalizado'
        ),
        survey_title:
          (
            <>
              <Typography sx={{ fontSize: 14, fontWeight: '600' }}>{survey.title !== undefined ? survey.title : '-'}</Typography>
              <Typography sx={{ fontSize: 12 }}>
                {survey.type === 0 ? 'Tipo encuesta: abierta' : survey.type === 1 ? (survey.anonymous === true ? 'Tipo encuesta: cerrada y respuestas anónimas' : 'Tipo encuesta: cerrada') : ''}
              </Typography>
            </>
          ),
        survey_elements: survey.count_questions,
        createdBy: (
          <>
            <Typography sx={{ fontSize: 14 }}>{typeof survey.createdBy !== "undefined" ? survey.createdBy : 'Sistema'}</Typography>
            <Typography sx={{ fontSize: 12 }}>
              Creado el: {moment(survey.createdAt).format('DD MMM YYYY')}
            </Typography>
          </>
        ),
        survey_visibility: (
          <Chip
            fontSize="small"
            size="small"
            label={
              survey.visibility === false
                ? 'Solo para mí'
                : survey.visibility === true
                  ? 'Visible'
                  : 'Eliminado'
            }
            color={survey.visibility === true ? 'success' : 'warning'}
          />
        ),
        survey_status: (survey.status === 0
          ? (<Typography sx={{ fontSize: 14, fontWeight: '600' }}>No publicado</Typography>)
          : survey.status === 1
            ? (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: '600' }}>Publicado</Typography>
                <Typography sx={{ fontSize: 12 }}>
                  Fecha fin: {moment(survey.endDate).format('DD MMM YYYY')}
                </Typography>
              </>
            )
            : (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: '600' }}>Finalizado</Typography>
                <Typography sx={{ fontSize: 12 }}>
                  Finalizó el: {moment(survey.endDate).format('DD MMM YYYY')}
                </Typography>
              </>
            )
        ),
        actions: (
          <>
              <RowMenu row={survey} setInfo={setInfo} reduxInfo={todos.userInfo} changeStatus={changeStatus} sx={{ cursor: "pointer" }} setPublish={setPublish} />
          </>
        ),
      }))
      setRows(surveyRows)
      setColumnWidths([
        { columnName: 'surveyTitle', width: 0 },
        { columnName: 'surveyType', width: 0 },
        { columnName: 'colHiddenCreated', width: 0 },
        { columnName: 'colHiddenVisibility', width: 0 },
        { columnName: 'colHiddenStatus', width: 0 },
        { columnName: 'survey_title', width: '30%' },
        { columnName: 'survey_elements', width: '15%' },
        { columnName: 'createdBy', width: '15%' },
        { columnName: 'survey_visibility', width: '10%' },
        { columnName: 'survey_status', width: '15%' },
        { columnName: 'actions', width: '15%' },
      ])
    })();

  }, [data, setSurveyData, setOpenSnack, setPopulation, setProgress, setSnackMessage, setVisiblePublish, setdataTable, snackMessage, todos, setVisibleView, setVisibleEdit, setVisibleResult, setVisibleDelete, setResult])

  //Columnas del grid
  const columns = [
    { name: 'surveyTitle', title: " " },
    { name: 'surveyType', title: " " },
    { name: 'colHiddenCreated', title: " " },
    { name: 'colHiddenVisibility', title: " " },
    { name: 'colHiddenStatus', title: " " },
    { name: 'survey_title', title: 'Título' },
    { name: 'survey_elements', title: 'Cant. preguntas' },
    /*{ name: 'createdAt', title: 'Creado el' },*/
    { name: 'createdBy', title: 'Creado por' },
    { name: 'survey_visibility', title: 'Visibilidad' },
    { name: 'survey_status', title: 'Etapa' },
    { name: 'actions', title: 'Acciones' },
  ]

  const [tableColumnExtensions] = useState([
    // { columnName: 'id', align: 'left', width: '5%' },
    { columnName: 'survey_title', align: 'left', wordWrapEnabled: true },
    { columnName: 'survey_elements', align: 'center' },
    { columnName: 'survey_visibility', align: 'center' },
    { columnName: 'createdBy', align: 'left', wordWrapEnabled: true },
    /*{ columnName: 'createdAt', align: 'center' },*/
    { columnName: 'actions', align: 'center' },
  ])

  const PagingPanelContainer = ({ ...props }) => <PagingPanel.Container {...props} />

  const pagingMessages = {
    info: ({ from, to, count }) => `${from}${from < to ? `-${to}` : ''} ${'de'} ${count}`,
    rowsPerPage: 'Encuestas por página',
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

SurveysTable.propTypes = {
  data: PropTypes.array,
  setVisiblePublish: PropTypes.func,
  setSurveyData: PropTypes.func,
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
}

export default SurveysTable
