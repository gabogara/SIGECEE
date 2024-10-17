import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Checkbox,
  Button,
  Dialog,
  IconButton,
  Paper,
  Box,
  Typography,
  AppBar,
  Divider,
  Slide,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Tooltip,
  Zoom,
} from '@mui/material'
import GridMUI from '@mui/material/Grid'
import ToolbarMUI from '@mui/material/Toolbar'
import CloseIcon from '@mui/icons-material/Close'
import { Search } from '@mui/icons-material'
import 'survey-core/defaultV2.min.css'
import {
  SelectionState,
  PagingState,
  IntegratedPaging,
  IntegratedSelection,
} from '@devexpress/dx-react-grid'
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  PagingPanel,
  SearchPanel,
  Toolbar,
} from '@devexpress/dx-react-grid-material-ui'
import { SearchState, IntegratedFiltering } from '@devexpress/dx-react-grid'
import moment from 'moment';
import { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import Api from '../../services/Api';
import ViewFromBankModal from './ViewFromBankModal'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const TableCellComponent = ({ ...props }) => (
  <Table.Cell
    {...props}
    style={{ paddingTop: 10, paddingBottom: 10 }}
  />
);

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}))

const ImportFromBank = ({ setVisible, visible, dataQuestion, setProgress, setSnackMessage,
  setOpenSnack, snackMessage, type, creator }) => {
  const [rows, setRows] = useState([])
  const [selection, setSelection] = useState([])
  const [searchValue, setSearchState] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([25, 50, 100]);
  const [activeStep, setActiveStep] = useState(0)
  const [questionData, setQuestionData] = useState({})
  const [visibleModal, setVisibleModal] = useState(false)

  useEffect(() => {
    ; (async () => {

      const setInfo = async (question_id) => {
        setProgress(true)
        await Api.get('/question/get?id=' + question_id)
          .then((res) => {
            setQuestionData(res.data.question)
            setVisibleModal(true)
          })
          .catch((error) => {
            console.error('Error:', error.message)
          })
        setProgress(false)
      }
      let questionRows = [];
      if (type === 'censo') {
        questionRows = dataQuestion.filter(item_filter => item_filter.type !== 'imagepicker' && item_filter.type !== 'file' && item_filter.type !== 'image').map((question, index) => ({
          id: index + 1,
          question_title: question.title !== undefined ? question.title : question.name,
          //question_type: question.inputType !== undefined ? question.inputType : question.type,
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
              <span>
                <BootstrapTooltip title="Ver" transitioncomponent={Zoom}>
                  <Search
                    sx={{ cursor: 'pointer', stroke: 'black', 'strokeWidth': 1 }}
                    fontSize="small"
                    onClick={() => {
                      setInfo(question._id)
                    }}
                  />
                </BootstrapTooltip>
              </span>
            </>
          )
        }))
      } else {
        questionRows = dataQuestion.map((question, index) => ({
          id: index + 1,
          question_title: question.title !== undefined ? question.title : question.name,
          //question_type: question.inputType !== undefined ? question.inputType : question.type,
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
              <span>
                <BootstrapTooltip title="Ver" transitioncomponent={Zoom}>
                  <Search
                    sx={{ cursor: 'pointer', stroke: 'black', 'strokeWidth': 1 }}
                    fontSize="small"
                    onClick={() => {
                      setInfo(question._id)
                    }}
                  />
                </BootstrapTooltip>
              </span>
            </>
          )
        }))
      }
      setRows(questionRows)
    })()
  }, [dataQuestion, selection, setProgress, setRows, type])

  const columns = [
    //{ name: 'id', title: 'Id' },
    { name: 'question_title', title: 'Pregunta' },
    //{ name: 'question_type', title: 'Tipo' },
    { name: 'question_isRequired', title: '¿Obligatoria?' },
    { name: 'question_createdBy', title: 'Creado por' },
    { name: 'actions', title: 'Acciones' },
  ]

  const [tableColumnExtensions] = useState([
    //{ columnName: 'id', align: 'left', width: '5%' },
    { columnName: 'question_title', align: 'left', width: '50%', wordWrapEnabled: true },
    { columnName: 'question_isRequired', align: 'center', width: '10%' },
    { columnName: 'question_createdBy', align: 'left', width: '20%', wordWrapEnabled: true },
    { columnName: 'actions', align: 'center' },
  ])

  const PagingPanelContainer = ({ ...props }) => <PagingPanel.Container {...props} />

  const pagingMessages = {
    info: ({ from, to, count }) => `${from}${from < to ? `-${to}` : ''} ${'de'} ${count}`,
    rowsPerPage: 'Preguntas por página',
  }

  const searchMessages = {
    searchPlaceholder: 'Buscar preguntas',
  }

  const cleanModal = () => {
    setSelection([])
    setVisible(false)
    setActiveStep(0)
  }

  const steps = [
    'Paso 1. Seleccione las preguntas del banco a importar',
    'Paso 2. Confirme las preguntas a importar',
  ]
  const maxSteps = steps.length


  function nombreYaExiste(nombre) {
    // Obtener todas las preguntas existentes en la encuesta
    var preguntasExistentes = creator.getAllQuestions();

    // Verificar si el nombre ya existe en alguna de las preguntas existentes
    for (var i = 0; i < preguntasExistentes.length; i++) {
      if (preguntasExistentes[i].name === nombre) {
        return true; // El nombre ya existe
      }
    }

    return false; // El nombre no existe
  }

  function generarNombreUnico(nombreBase, contador, names_push) {
    var nombre = nombreBase + contador;

    if (nombreYaExiste(nombre) || names_push.includes(nombre)) {
      return generarNombreUnico(nombreBase, contador + 1, names_push); // Llamada recursiva si el nombre ya existe
    }

    return nombre; // Devuelve el nombre único
  }

  const handleNext = async () => {

    if (activeStep === maxSteps - 1) {
      setProgress(true)
      let array = []
      selection.map(
        (sectionId) => (array = array.concat(dataQuestion[sectionId].data.pages.elements[0])),
      )

      var cont = 1
      var names_push = []
      for (var j = 0; j < array.length; j++) {

        var nombreFinal = generarNombreUnico("Pregunta-", cont, names_push)
        if (!names_push.includes(nombreFinal)) {
          names_push.push(nombreFinal)
        }
        array[j].name = nombreFinal
      }

      let creatorTextParse = creator.getSurveyJSON()

      if (typeof creatorTextParse.pages === "undefined") {
        creator.addPage()
        let creatorTextParse2 = creator.getSurveyJSON();
        creatorTextParse2.pages[0].elements = array
        creator.changeText(JSON.stringify(creatorTextParse2))
      } else {
        if (creatorTextParse.pages[creatorTextParse.pages.length - 1].elements) {
          let concatenacion = creatorTextParse.pages[creatorTextParse.pages.length - 1].elements.concat(array);
          creatorTextParse.pages[creatorTextParse.pages.length - 1].elements = concatenacion;
          creator.changeText(JSON.stringify(creatorTextParse));
        } else {
          creatorTextParse.pages[creatorTextParse.pages.length - 1].elements = array
          creator.changeText(JSON.stringify(creatorTextParse));
        }
      }
      setOpenSnack(true)
      setSnackMessage({ ...snackMessage, color: 'success', message: 'Importación de preguntas exitosa' })
      setProgress(false)
      cleanModal()
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <>
      <ViewFromBankModal questionData={questionData} setVisible={setVisibleModal} visible={visibleModal} type="pregunta" />
      <Dialog fullScreen open={visible} onClose={cleanModal} transitioncomponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <ToolbarMUI>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Importar preguntas desde el Banco de Preguntas
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
        <Box sx={{ width: '100%', pt: 3, minHeight: '100vh', }}>
          <GridMUI container justifyContent="center" sx={{ pb: 3 }}>
            <GridMUI item xs={12} md={8}>
              <Stepper
                activeStep={activeStep}
                sx={{ maxWidth: 800, display: 'flex', justifyContent: 'center', pb: 1 }}
              >
                {steps.map((label, index) => {
                  const stepProps = {}
                  const labelProps = {}
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            </GridMUI>
          </GridMUI>
          {activeStep === 0 && (
            <Box sx={{ p: 4 }} className="table2">
              <Paper>
                <Grid rows={rows} columns={columns}>
                  <SearchState value={searchValue} onValueChange={setSearchState} />
                  <IntegratedFiltering />
                  <SelectionState selection={selection} onSelectionChange={setSelection} />
                  <PagingState
                    currentPage={currentPage}
                    onCurrentPageChange={setCurrentPage}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                  />
                  <IntegratedSelection />
                  <IntegratedPaging />
                  <Table columnExtensions={tableColumnExtensions} cellComponent={TableCellComponent} />
                  <TableHeaderRow />
                  <Toolbar />
                  <TableSelection showSelectAll />
                  <SearchPanel messages={searchMessages} />
                  <PagingPanel
                    containerComponent={PagingPanelContainer}
                    messages={pagingMessages}
                    pageSizes={pageSizes}
                  />
                </Grid>
              </Paper>
            </Box>
          )}
          {activeStep === 1 && (
            <>
              <Box
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                }}
              >
                <GridMUI container justifyContent="center">
                  <GridMUI item xs={12} md={8}>
                    <List dense={true} fullwidth="true">
                      {selection.map((sectionId) => (
                        <li key={`section-${sectionId}`}>
                          <ul>
                            <ListItem key={`item-${sectionId}`}>
                              <ListItemText
                                primary={
                                  dataQuestion[sectionId].title !== undefined
                                    ? dataQuestion[sectionId].title
                                    : dataQuestion[sectionId].name
                                }
                                secondary={
                                  dataQuestion[sectionId].inputType !==
                                    undefined
                                    ? dataQuestion[sectionId].inputType
                                    : dataQuestion[sectionId].type
                                }
                              />
                            </ListItem>
                          </ul>
                          <Divider />
                        </li>
                      ))}
                    </List>
                  </GridMUI>
                </GridMUI>
              </Box>
            </>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'row', p: 3 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} variant="outlined">
              Regresar
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button variant="contained" onClick={handleNext} disabled={selection.length === 0} sx={{
              backgroundColor: '#0d47a1',
              ":hover": {
                boxShadow: 6,
              },
            }}>
              {activeStep === steps.length - 1 ? 'Importar' : 'Siguiente'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  )
}
export default ImportFromBank

ImportFromBank.propTypes = {
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  dataQuestion: PropTypes.array,
  setProgress: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  type: PropTypes.string,
  creator: PropTypes.object,
}
