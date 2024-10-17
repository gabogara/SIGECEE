import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
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
  Checkbox,
  ListSubheader,
  Tooltip,
  Zoom,
} from "@mui/material";
import GridMUI from "@mui/material/Grid";
import ToolbarMUI from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import "survey-core/defaultV2.min.css";
import {
  SelectionState,
  PagingState,
  IntegratedPaging,
  IntegratedSelection,
  TreeDataState,
  CustomTreeData,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  SearchPanel,
  Toolbar,
  TableTreeColumn,
} from "@devexpress/dx-react-grid-material-ui";
import { SearchState, IntegratedFiltering } from "@devexpress/dx-react-grid";
import moment from 'moment';
import { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { Search } from '@mui/icons-material'
import Api from '../../services/Api';
import ViewFromBankModal from './ViewFromBankModal'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getChildRows = (row, rootRows) => {
  const childRows = rootRows.filter(
    (r) => r.parentId === (row ? row.id : null)
  );
  return childRows.length ? childRows : null;
};

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

const ImportFromInstrument = ({ setVisible, visible, dataInstrument, setProgress, setSnackMessage,
  setOpenSnack, snackMessage, type, creator }) => {
  const [rows, setRows] = useState([]);
  const [selection, setSelection] = useState([]);
  const [searchValue, setSearchState] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([25, 50, 100]);
  const [activeStep, setActiveStep] = useState(0);
  const [defaultExpandedRowIds] = useState([]);
  const [result, setResult] = useState([]);
  const [instrumentData, setInstrumentData] = useState({})
  const [visibleModal, setVisibleModal] = useState(false)


  useEffect(() => {
    (async () => {
      let instrumentsRows = [];
      const setInfo = async (inst_id, ins_type) => {
        setProgress(true)
        if (ins_type.toLowerCase() === 'censo') {
          await Api.get('/census/get?id=' + inst_id)
            .then((res) => {
              setInstrumentData(res.data.census)
              setVisibleModal(true)
            })
            .catch((error) => {
              console.error('Error:', error.message)
            })
        } else {
          await Api.get('/survey/get?id=' + inst_id)
            .then((res) => {
              setInstrumentData(res.data.survey)
              setVisibleModal(true)
            })
            .catch((error) => {
              console.error('Error:', error.message)
            })
        }

        setProgress(false)
      }

      dataInstrument.forEach((instrument, index) => {
        instrumentsRows.push({
          id: index,
          parentId: null,
          index2: null,
          instrument_id: null,
          page_id: null,
          instrument_title:
            instrument.title !== undefined
              ? instrument.title
              : "Sin título",
          instrument_type: instrument.ins_type,
          count: instrument.count_questions,
          question_type: "",
          question_isRequired: "",
          question_createdBy: (<>
            <Typography sx={{ fontSize: 14 }}>{typeof instrument.createdBy !== "undefined" ? instrument.createdBy : 'Sistema'}</Typography>
            <Typography sx={{ fontSize: 12 }}>
              Creado el: {moment(instrument.createdAt).format('DD MMM YYYY')}
            </Typography>
          </>),
          actions: (
            <>
              <span>
                <BootstrapTooltip title="Ver" transitioncomponent={Zoom}>
                  <Search
                    sx={{ cursor: 'pointer', stroke: 'black', 'strokeWidth': 1 }}
                    fontSize="small"
                    onClick={() => {
                      setInfo(instrument._id, instrument.ins_type)
                      //console.log(instrument._id) 
                      //}}setInfo(struct._id)
                    }}
                  />
                </BootstrapTooltip>
              </span>
            </>
          ),
        });
        if (type === 'censo') {
          instrument.data.pages.forEach((pages, index3) => {
            pages.elements.filter(item_filter => item_filter.type !== 'imagepicker' && item_filter.type !== 'file' && item_filter.type !== 'image').forEach((question, index2) => {
              instrumentsRows.push({
                id: index + (index3 + 1) + (index2 + 1) * 0.00001,
                parentId: index,
                index2: index2,
                instrument_id: instrument._id,
                page_id: index3,
                instrument_title: question.title !== undefined ? '(' + pages.name + ') ' + question.title : '(' + pages.name + ') ' + question.name,
                instrument_type: "",
                count: "",
                question_type:
                  question.inputType !== undefined
                    ? question.inputType
                    : question.type,
                question_isRequired: (
                  <Checkbox
                    disabled
                    checked={question.isRequired !== undefined ? true : false}
                  />
                ),
                question_createdBy: "",
                actions: "",
              });
            });
          });
        } else {
          instrument.data.pages.forEach((pages, index3) => {
            pages.elements.forEach((question, index2) => {
              instrumentsRows.push({
                id: index + (index3 + 1) + (index2 + 1) * 0.00001,
                parentId: index,
                index2: index2,
                instrument_id: instrument._id,
                page_id: index3,
                instrument_title: question.title !== undefined ? '(' + pages.name + ') ' + question.title : '(' + pages.name + ') ' + question.name,
                instrument_type: "",
                count: "",
                question_type:
                  question.inputType !== undefined
                    ? question.inputType
                    : question.type,
                question_isRequired: (
                  <Checkbox
                    disabled
                    checked={question.isRequired !== undefined ? true : false}
                  />
                ),
                question_createdBy: "",
                actions: "",
              });
            });
          });
        }

      });
      setRows(instrumentsRows);
    })();
  }, [dataInstrument, setProgress, setRows, type]);

  const columns = [
    { name: "instrument_title", title: "Título" },
    { name: "instrument_type", title: "Tipo" },
    { name: "count", title: "Cant. preguntas" },
    { name: 'question_type', title: 'Tipo' },
    { name: "question_isRequired", title: "¿Obligatoria?" },
    { name: "question_createdBy", title: "Creado por" },
    { name: "actions", title: "Acciones" },
  ];

  const [tableColumnExtensions] = useState([
    { columnName: "instrument_title", align: "left", width: "35%", wordWrapEnabled: true },
    { columnName: "count", align: "center", width: "10%" },
    { columnName: "question_createdBy", align: "left", width: "20%", wordWrapEnabled: true },
    { columnName: "question_type", align: "center" },
    { columnName: "question_isRequired", align: "center" },
    { columnName: "actions", align: "center", width: "10%" },
  ]);

  const PagingPanelContainer = ({ ...props }) => (
    <PagingPanel.Container {...props} />
  );

  const pagingMessages = {
    info: ({ from, to, count }) =>
      `${from}${from < to ? `-${to}` : ""} ${"de"} ${count}`,
    rowsPerPage: "Encuestas/censos por página",
  };

  const searchMessages = {
    searchPlaceholder: "Buscar encuestas/censos",
  };

  const cleanModal = () => {
    setSelection([]);
    setVisible(false);
    setActiveStep(0);
  };

  const steps = [
    "Paso 1. Seleccione las encuestas/censos y/o preguntas a importar",
    "Paso 2. Seleccione los encuestas/censos y/o preguntas a importar",
  ];
  const maxSteps = steps.length;

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
      let array = [];
      selection.map((sectionId) => (array = array.concat(rows[sectionId])));
      let result = [];
      array.forEach((item, index) => {
        if (item.parentId !== null) {
          dataInstrument.find((item2) =>
            item2._id === item.instrument_id
              ? (result = result.concat(
                item2.data.pages[item.page_id].elements[item.index2]
              ))
              : null
          );
        }
      });

      var cont = 1
      var names_push = []
      for (var j = 0; j < result.length; j++) {
        var nombreFinal = generarNombreUnico("Pregunta-", cont, names_push)
        if (!names_push.includes(nombreFinal)) {
          names_push.push(nombreFinal)
        }
        result[j].name = nombreFinal
      }

      let creatorTextParse = creator.getSurveyJSON();

      if (typeof creatorTextParse.pages === "undefined") {
        creator.addPage()
        let creatorTextParse2 = creator.getSurveyJSON();
        creatorTextParse2.pages[0].elements = result
        creator.changeText(JSON.stringify(creatorTextParse2))
      } else {
        if (creatorTextParse.pages[creatorTextParse.pages.length - 1].elements) {
          let concatenacion = creatorTextParse.pages[creatorTextParse.pages.length - 1].elements.concat(result);
          creatorTextParse.pages[creatorTextParse.pages.length - 1].elements = concatenacion;
          creator.changeText(JSON.stringify(creatorTextParse));
        } else {
          creatorTextParse.pages[creatorTextParse.pages.length - 1].elements = result
          creator.changeText(JSON.stringify(creatorTextParse));
        }
      }
      setOpenSnack(true)
      setSnackMessage({ ...snackMessage, color: 'success', message: 'Importación de preguntas exitosa' })
      setProgress(false)
      cleanModal();
    } else {
      filtro();
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const filtro = () => {
    let selection_sort = selection;
    let array = [];

    selection_sort.forEach(
      (sectionId) => (array = array.concat(rows[sectionId]))
    );
    let parents = [];
    array.forEach((item) =>
      item.parentId !== null ? parents.push(item.parentId) : null
    );
    let uniqueParents = [...new Set(parents)];

    rows.forEach((element) => {
      uniqueParents.forEach((index) => {
        if (element.parentId === null && element.id === index) {
          array = array.concat(element);
        }
      });
    });
    let uniqueResult = [...new Set(array)];
    let final = uniqueResult.sort(function (a, b) {
      return a.id - b.id;
    });
    setResult(final);
  };

  const getChildrenIds = (rowIds, rows) => {
    return rowIds.reduce((acc, rowId) => {
      const childRows = getChildRows(rows[rowId], rows);
      if (childRows) {
        const childrenIds = childRows.map((row) => row.id);
        acc = acc.concat(childrenIds);
      }
      return acc;
    }, []);
  };

  const selectionHandler = (newSelection) => {
    if (newSelection.length > selection.length) {
      const selectedRow = newSelection.filter((id) => !selection.includes(id));
      const childrenIds = getChildrenIds(selectedRow, rows);
      let result_final = [];
      childrenIds.forEach((index) => {
        result_final = result_final.concat(
          rows.findIndex((element) => element.id === index)
        );
      });
      const result = [...new Set(newSelection.concat(result_final))];
      setSelection(result);
    } else {
      const unselectedRow = selection.filter(
        (id) => !newSelection.includes(id)
      );
      const childrenIds = getChildrenIds(unselectedRow, rows);
      let result_final = [];
      childrenIds.forEach((index) => {
        result_final = result_final.concat(
          rows.findIndex((element) => element.id === index)
        );
      });
      const result = newSelection.filter((id) => !result_final.includes(id));

      setSelection(result);
    }
  };

  return (
    <>
      <ViewFromBankModal questionData={instrumentData} setVisible={setVisibleModal} visible={visibleModal} type="instrumento" />
      <Dialog
        fullScreen
        open={visible}
        onClose={cleanModal}
        transitioncomponent={Transition}
      >
        <AppBar sx={{ position: "relative", backgroundColor: '#0d47a1' }}>
          <ToolbarMUI>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Importar preguntas desde Encuestas/Censos
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
        <Box sx={{ width: "100%", pt: 3, minHeight: '100vh', }}>
          <GridMUI container justifyContent="center" sx={{ pb: 3 }}>
            <GridMUI item xs={12} md={8}>
              <Stepper
                activeStep={activeStep}
                sx={{
                  maxWidth: 800,
                  display: "flex",
                  justifyContent: "center",
                  pb: 1,
                }}
              >
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </GridMUI>
          </GridMUI>
          {activeStep === 0 && (
            <Box sx={{ p: 3 }} className="table2">
              <Paper>
                <Grid rows={rows} columns={columns}>
                  <SearchState
                    value={searchValue}
                    onValueChange={setSearchState}
                  />
                  <SelectionState
                    selection={selection}
                    onSelectionChange={selectionHandler}
                  />
                  <PagingState
                    currentPage={currentPage}
                    onCurrentPageChange={setCurrentPage}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                  />
                  <TreeDataState
                    defaultExpandedRowIds={defaultExpandedRowIds}
                  />
                  <CustomTreeData getChildRows={getChildRows} />
                  <IntegratedFiltering />
                  <IntegratedSelection />
                  <IntegratedPaging />
                  <Table columnExtensions={tableColumnExtensions} cellComponent={TableCellComponent} />
                  <TableHeaderRow />
                  <Toolbar />
                  <SearchPanel messages={searchMessages} />
                  <TableTreeColumn
                    for="instrument_title"
                    showSelectionControls
                    showSelectAll
                  />
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
                  width: "100%",
                  bgcolor: "background.paper",
                }}
              >
                <GridMUI container justifyContent="center">
                  <GridMUI item xs={12} md={8}>
                    <List dense={true} fullwidth="true" subheader={<li />}>
                      {result.map((item, index) => (
                        <li key={`section-${index}`}>
                          <ul>
                            {item.parentId === null ? (
                              <ListSubheader>{'(' + item.instrument_type + ') ' + item.instrument_title}</ListSubheader>
                            ) : (
                              <ListItem key={`item-${index}-${item.id}`}>
                                <ListItemText
                                  primary={item.instrument_title}
                                  secondary={item.question_type}
                                />
                              </ListItem>
                            )}
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
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              variant="outlined"
            >
              Regresar
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button variant="contained" onClick={handleNext} disabled={selection.length === 0} sx={{
              backgroundColor: '#0d47a1',
              ":hover": {
                boxShadow: 6,
              },
            }}>
              {activeStep === steps.length - 1 ? "Importar" : "Siguiente"}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
export default ImportFromInstrument;

ImportFromInstrument.propTypes = {
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  dataInstrument: PropTypes.array,
  setProgress: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  type: PropTypes.string,
  creator: PropTypes.object,
};
