import React, { useState, useEffect } from 'react'
import StructTable from './tables/StructTable'
import ViewModal from './modals/ViewStruct'
import AddModal from './modals/AddStruct'
import EditModal from './modals/EditStruct'
import DeleteModal from './modals/DeleteStruct'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { Box, Tab, Tabs } from '@mui/material'
import TableRowsIcon from '@mui/icons-material/TableRows'
import AddIcon from '@mui/icons-material/Add'
import Api from '../../services/Api'
import SimpleBackdrop from '../mui/ProgressMUI'
import PropTypes from 'prop-types';
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import Breadcrumbs from '../layout/AppBreadcrumb'
import * as SurveyCreator from 'survey-creator-react';
import ImportFromBank from '../imports/ImportFromBank';
import ImportFromStruct from '../imports/ImportFromStruct';
import ImportFromInstrument from '../imports/ImportFromInstrument';
import { localization } from "survey-creator-core";
import { surveyLocalization, Serializer } from 'survey-core';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HelpModal from "../help/Help";
import Img from '../../assets/images/InfoEstructuras.png'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const CustomTab = styled(Tab)(() => ({
  minHeight: 55
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const optionsSurvey = {
  showLogicTab: true,
  showState: true,
  isAutoSave: false,
  questionTypes: [
    'text',
    'checkbox',
    'radiogroup',
    'dropdown',
    'comment',
    'rating',
    'ranking',
    'imagepicker',
    'boolean',
    'image',
    'file',
    'matrix',
    'multipletext',
    'tagbox',
  ],
  showSidebar: false,
  showToolbox: true,
  widthMode: 'responsive',
  showProgressBar: 'both',
  allowControlSurveyTitleVisibility: true,
  showSurveyTitle: true,
  pageEditMode: 'single',
  haveCommercialLicense: true,
  showJSONEditorTab: false,
  allowModifyPages: false,
  showTitlesInExpressions: true
};

const StructManagement = () => {
  let [creator, setCreator] = useState(null);
  const [dataQuestion, setdataQuestion] = useState([]);
  const [dataStruct, setdataStruct] = useState([]);
  const [dataInstrument, setdataInstrument] = useState([]);
  const [dataTable, setdataTable] = useState([])
  const [structData, setStructData] = useState({})
  const [openSnack, setOpenSnack] = useState(false)
  const [progress, setProgress] = useState(false)
  const [snackMessage, setSnackMessage] = useState({
    color: '',
    message: '',
  })
  const todos = useSelector((state) => state.todos);
  const [visibleImportBank, setVisibleImportBank] = useState(false);
  const [visibleImportStruct, setVisibleImportStruct] = useState(false);
  const [visibleImportInstrument, setVisibleImportInstrument] = useState(false);

  const [visibleView, setVisibleView] = useState(false)
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [visibleHelp, setVisibleHelp] = useState(false);

  if (!creator) {

    const deuLocale = localization.getLocale("es");
    deuLocale.ed.designer = 'Diseñador de estructura base'
    deuLocale.ed.testSurvey = 'Previsualizar estructura'
    deuLocale.ed.logic = 'Lógica de la estructura'
    deuLocale.ed.surveyPlaceHolder = "Para empezar a diseñar, selecciona un tipo de pregunta ubicado en la barra lateral izquierda"
    deuLocale.pe.isRequired = "¿Obligatoria?"
    deuLocale.pe.inputType = "Tipo de input"
    deuLocale.pe.clear = "Limpiar"
    deuLocale.pe.placeholder = "Placeholder de input"
    deuLocale.pe.indents = "Agregar identación"
    deuLocale.ed.settings = "Configuración"
    deuLocale.ed.settingsTooltip = "Abrir configuración"
    deuLocale.ed.testSurveyAgain = "Prueba de nuevo"
    deuLocale.ed.surveyTypeName = "Estructura base"
    deuLocale.pe.surveyTitlePlaceholder = "Título de la estructura base (Requerido)"
    deuLocale.pe.surveyDescriptionPlaceholder = "Ingrese una descripción para la estructura base (Requerido)"
    deuLocale.pe.pageTitlePlaceholder = "Título de la página"
    deuLocale.ed.surveySettingsTooltip = "Abrir opciones de estructura base"
    deuLocale.pe.requiredText = "Símbolo para pregunta requerida"
    deuLocale.p.pages = "Páginas"
    deuLocale.p.choices = "Opciones"
    deuLocale.p.columns = "Columnas"
    deuLocale.pe.tabs.rateValues = "Valores"
    deuLocale.pe.renderMode = "Modo de visualización"
    deuLocale.pe.maxSelectedChoices = "Cant. Máxima de opciones a seleccionar"
    deuLocale.pe.tabs.indent = "Agregar identación"
    deuLocale.p.rows = "Filas"

    deuLocale.qt.default = "Por defecto"
    deuLocale.qt.checkbox = "Selección múltiple"
    deuLocale.qt.comment = "Texto largo"
    deuLocale.qt.imagepicker = "Selección simple de imágenes"
    deuLocale.qt.ranking = "Ordenar elementos"
    deuLocale.qt.image = "Imagen de encabezado"
    deuLocale.qt.dropdown = "Selección simple (Lista desplegable)"
    deuLocale.qt.tagbox = "Selección múltiple (Lista desplegable)"
    deuLocale.qt.file = "Archivo"
    deuLocale.qt.matrix = "Matriz de selección única"
    deuLocale.qt.multipletext = "Múltiples textos"
    deuLocale.qt.radiogroup = "Selección simple"
    deuLocale.qt.rating = "Escala de valoración"
    deuLocale.qt.text = "Texto corto/números entrada única"
    deuLocale.qt.boolean = "Verdadero/Falso"
    deuLocale.qt.expression = "Encabezado"
    deuLocale.ed.lg.uncompletedRule_title = "¿Salir de la lógica de estructura base?"
    deuLocale.ed.lg.uncompletedRule_text = "Una o más reglas lógicas no están completas. Si sales de la pestaña, aquellos cambios que no se puedan aplicar desaparecerán. ¿Está seguro que quieres salir?"
    deuLocale.ed.lg.uncompletedRule_apply = "Sí"
    deuLocale.ed.lg.uncompletedRule_cancel = "No, quiero completar las reglas"


    Serializer.removeProperty("survey", "logo");
    surveyLocalization.defaultLocale = "custom"
    SurveyCreator.localization.currentLocale = 'es';
    SurveyCreator.settings.designer.showAddQuestionButton = true;
    creator = new SurveyCreator.SurveyCreator(optionsSurvey);
    creator.toolbox.forceCompact = true;
    creator.toolbox.orderedQuestions = [
      "text", "comment", "multipletext",
      "radiogroup", "dropdown",
      "checkbox", "tagbox",
      "boolean",
      "rating", "ranking",
      "panel", "paneldynamic",
      "html", "expression", "file", "image", "imagepicker", "signaturepad",
      "matrix", "matrixdropdown", "matrixdynamic",
    ];
    creator.onElementAllowOperations.add(function (sender, options) {
      options.allowAddToToolbox = true;
      options.allowChangeRequired = true;
      options.allowChangeType = true;
      options.allowCopy = false;
      options.allowDelete = true;
      options.allowDragging = true;
      options.allowEdit = true;
    });

    creator.onActiveTabChanged.add((sender, options) => {
      if (options.tabName === "test") {
        const deuLocale = localization.getLocale("custom");
        deuLocale.ed.designer = 'Diseñador de estructura base'
        deuLocale.ed.testSurvey = 'Previsualizar estructura'
        deuLocale.ed.logic = 'Lógica de la estructura'
        deuLocale.ed.surveyPlaceHolder = "Para empezar a diseñar, selecciona un tipo de pregunta ubicado en la barra lateral izquierda"
        deuLocale.pe.isRequired = "¿Obligatoria?"
        deuLocale.pe.inputType = "Tipo de input"
        deuLocale.pe.clear = "Limpiar"
        deuLocale.pe.placeholder = "Placeholder de input"
        deuLocale.pe.indents = "Agregar identación"
        deuLocale.ed.settings = "Configuración"
        deuLocale.ed.settingsTooltip = "Abrir configuración"
        deuLocale.ed.testSurveyAgain = "Prueba de nuevo"
        deuLocale.ed.surveyTypeName = "Estructura base"
        deuLocale.pe.surveyTitlePlaceholder = "Título de la estructura base (Requerido)"
        deuLocale.pe.surveyDescriptionPlaceholder = "Ingrese una descripción para la estructura base (Requerido)"
        deuLocale.pe.pageTitlePlaceholder = "Título de la página"
        deuLocale.ed.surveySettingsTooltip = "Abrir opciones de estructura base"
        deuLocale.pe.requiredText = "Símbolo para pregunta requerida"
        deuLocale.p.pages = "Páginas"
        deuLocale.p.choices = "Opciones"
        deuLocale.p.columns = "Columnas"
        deuLocale.pe.tabs.rateValues = "Valores"
        deuLocale.pe.renderMode = "Modo de visualización"
        deuLocale.pe.maxSelectedChoices = "Cant. Máxima de opciones a seleccionar"
        deuLocale.pe.tabs.indent = "Agregar identación"
        deuLocale.p.rows = "Filas"

        deuLocale.qt.default = "Por defecto"
        deuLocale.qt.checkbox = "Selección múltiple"
        deuLocale.qt.comment = "Texto largo"
        deuLocale.qt.imagepicker = "Selección simple de imágenes"
        deuLocale.qt.ranking = "Ordenar elementos"
        deuLocale.qt.image = "Imagen de encabezado"
        deuLocale.qt.dropdown = "Selección simple (Lista desplegable)"
        deuLocale.qt.tagbox = "Selección múltiple (Lista desplegable)"
        deuLocale.qt.file = "Archivo"
        deuLocale.qt.matrix = "Matriz de selección única"
        deuLocale.qt.multipletext = "Múltiples textos"
        deuLocale.qt.radiogroup = "Selección simple"
        deuLocale.qt.rating = "Escala de valoración"
        deuLocale.qt.text = "Texto corto/números entrada única"
        deuLocale.qt.boolean = "Verdadero/Falso"
        deuLocale.qt.expression = "Encabezado"
        deuLocale.ed.lg.uncompletedRule_title = "¿Salir de la lógica de estructura base?"
        deuLocale.ed.lg.uncompletedRule_text = "Una o más reglas lógicas no están completas. Si sales de la pestaña, aquellos cambios que no se puedan aplicar desaparecerán. ¿Está seguro que quieres salir?"
        deuLocale.ed.lg.uncompletedRule_apply = "Sí"
        deuLocale.ed.lg.uncompletedRule_cancel = "No, quiero completar las reglas"



        sender.locale = 'custom';
      } else {
        sender.locale = 'es';
      }
    });

    let blackList = [];

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

    function generarNombreUnico(nombreBase, contador) {
      var nombre = nombreBase + contador;

      if (nombreYaExiste(nombre)) {
        return generarNombreUnico(nombreBase, contador + 1); // Llamada recursiva si el nombre ya existe
      }

      return nombre; // Devuelve el nombre único
    }

    creator.onShowingProperty.add(function (_, options) {

      //console.log(options.property.name)
      if (options.obj.getType() === 'radiogroup') {
        /*value, text, name, title, description, isRequired, , , choices, , , choicesOrder, showOtherItem, otherText, , showNoneItem, noneText, showClearButton, , ,, , , , , , , , , , , hideNumber, , , , indent, , , , , , , , , , requiredErrorText, , otherErrorText*/
        blackList = ['validators', 'clearIfInvisible', 'useDisplayValuesInDynamicTexts', 'correctAnswer', 'defaultValue', 'valueName', 'colCount', 'maxWidth', 'minWidth', 'width', 'descriptionLocation', 'titleLocation', 'state', 'startWithNewLine', 'choicesEnableIf', 'choicesVisibleIf', 'hideIfChoicesEmpty', 'defaultValueExpression', 'visibleIf', 'enableIf', 'requiredIf', 'allowEmptyResponse', 'url', 'path', 'imageLinkName', 'titleName', 'bindings', 'choicesByUrl', 'choicesFromQuestionMode', 'choicesFromQuestion', 'name', 'readOnly', 'showCommentArea', 'commentText', 'commentPlaceholder', 'visible', 'separateSpecialChoices']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'rating') {
        /*value, text, , title, description, , isRequired, , rateValues, value, text, visibleIf, enableIf, rateMin, rateMax, rateStep, minRateDescription, maxRateDescription, , , hideNumber, , indent, , , , displayMode, , , , , , requiredErrorText, */
        blackList = ['validators', 'clearIfInvisible', 'useDisplayValuesInDynamicTexts', 'correctAnswer', 'defaultValue', 'valueName', 'maxWidth', 'minWidth', 'width', 'state', 'titleLocation', 'descriptionLocation', 'visibleIf', 'enableIf', 'requiredIf', 'bindings', 'defaultValueExpression', 'startWithNewLine', 'readOnly', 'showCommentArea', 'commentText', 'commentPlaceholder', 'name', 'visible', 'displayRateDescriptionsAsExtremeItems']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'checkbox') {
        /*value, text, title, description, isRequired choices,   choicesOrder, showOtherItem, otherText, otherPlaceholder, showNoneItem, noneText, showSelectAllItem, selectAllText, maxSelectedChoices, , , , , hideNumber, , indent, , , requiredErrorText,, otherErrorText*/
        blackList = ['validators', 'width', 'minWidth', 'maxWidth', 'colCount', 'valueName', 'defaultValue', 'correctAnswer', 'useDisplayValuesInDynamicTexts', 'clearIfInvisible', 'valuePropertyName', 'state', 'titleLocation', 'descriptionLocation', 'startWithNewLine', 'choicesByUrl', 'url', 'path', 'titleName', 'imageLinkName', 'allowEmptyResponse', 'visibleIf', 'enableIf', 'requiredIf', 'bindings', 'defaultValueExpression', 'hideIfChoicesEmpty', 'choicesVisibleIf', 'choicesEnableIf', 'separateSpecialChoices', 'choicesFromQuestion', 'choicesFromQuestionMode', 'visibleIf', 'enableIf', 'readOnly', 'showCommentArea', 'commentText', 'commentPlaceholder', 'name', 'visible']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'tagbox') {
        /*value, text, , title, description, , isRequired, placeholder, choices,  choicesOrder, showOtherItem, otherText, otherPlaceholder, showNoneItem, noneText, showSelectAllItem, selectAllText, maxSelectedChoices, , searchEnabled, hideSelectedItems, allowClear, , hideNumber,  indent,  requiredErrorText, , otherErrorText*/
        blackList = ['validators', 'width', 'minWidth', 'maxWidth', 'colCount', 'valueName', 'defaultValue', 'correctAnswer', 'useDisplayValuesInDynamicTexts', 'clearIfInvisible', 'valuePropertyName', 'state', 'titleLocation', 'descriptionLocation', 'choicesByUrl', 'url', 'path', 'titleName', 'imageLinkName', 'allowEmptyResponse', 'visibleIf', 'enableIf', 'requiredIf', 'bindings', 'defaultValueExpression', 'hideIfChoicesEmpty', 'choicesVisibleIf', 'choicesEnableIf', 'startWithNewLine', 'separateSpecialChoices', 'visibleIf', 'enableIf', 'choicesFromQuestion', 'choicesFromQuestionMode', 'readOnly', 'showCommentArea', 'commentText', 'commentPlaceholder', 'visible', 'name', 'closeOnSelect']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'boolean') {
        /*name, title, description, visible, isRequired,  labelTrue, labelFalse, , hideNumber, , , indent, , , valueTrue, valueFalse, requiredErrorText,*/
        blackList = ['validators', 'clearIfInvisible', 'width', 'minWidth', 'maxWidth', 'valueName', 'defaultValue', 'correctAnswer', 'useDisplayValuesInDynamicTexts', 'titleLocation', 'descriptionLocation', 'state', 'visibleIf', 'enableIf', 'requiredIf', 'bindings', 'defaultValueExpression', 'startWithNewLine', 'readOnly', 'showCommentArea', 'commentText', 'commentPlaceholder', 'visible', 'name']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'file') {
        /*, title, description, , isRequired, ,  allowMultiple, allowImagesPreview, acceptedTypes, showPreview, , maxSize, imageHeight, imageWidth, waitForUpload, needConfirmRemoveFile,  hideNumber, indent,  requiredErrorText*/
        blackList = ['width', 'minWidth', 'maxWidth', 'valueName', 'useDisplayValuesInDynamicTexts', 'clearIfInvisible', 'state', 'titleLocation', 'descriptionLocation', 'visibleIf', 'enableIf', 'requiredIf', 'bindings', 'defaultValueExpression', 'startWithNewLine', 'showCommentArea', 'commentText', 'commentPlaceholder', 'readOnly', 'visible', 'name', 'storeDataAsText']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'imagepicker') {
        /*value, text, imageLink, , title, description,  isRequired,  contentMode, imageFit, minImageWidth, maxImageWidth, minImageHeight, maxImageHeight, imageHeight, imageWidth, multiSelect, showLabel, choices, value, text,  imageLink,  choicesOrder, otherPlaceholder,  hideNumber,indent, requiredErrorText, */
        blackList = ['validators', 'width', 'minWidth', 'maxWidth', 'colCount', 'defaultValue', 'correctAnswer', 'useDisplayValuesInDynamicTexts', 'clearIfInvisible', 'state', 'titleLocation', 'descriptionLocation', 'choicesByUrl', 'url', 'path', 'valueName', 'titleName', 'imageLinkName', 'allowEmptyResponse', 'visibleIf', 'enableIf', 'requiredIf', 'bindings', 'defaultValueExpression', 'hideIfChoicesEmpty', 'choicesVisibleIf', 'choicesEnableIf', 'startWithNewLine', 'choicesFromQuestion', 'choicesFromQuestionMode', 'visibleIf', 'enableIf', 'readOnly', 'showCommentArea', 'commentText', 'commentPlaceholder', 'visible', 'name']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'ranking') {
        /*value, text, , title, description, , isRequired,  choices,  choicesOrder, otherPlaceholder,  hideNumber,  indent,  requiredErrorText,*/
        blackList = ['validators', 'width', 'minWidth', 'maxWidth', 'valueName', 'defaultValue', 'correctAnswer', 'useDisplayValuesInDynamicTexts', 'clearIfInvisible', 'valuePropertyName', 'state', 'titleLocation', 'descriptionLocation', 'choicesByUrl', 'url', 'path', 'titleName', 'imageLinkName', 'allowEmptyResponse', 'visibleIf', 'enableIf', 'requiredIf', 'bindings', 'defaultValueExpression', 'hideIfChoicesEmpty', 'choicesVisibleIf', 'choicesEnableIf', 'startWithNewLine', 'visibleIf', 'enableIf', 'choicesFromQuestion', 'choicesFromQuestionMode', 'readOnly', 'showCommentArea', 'commentText', 'commentPlaceholder', 'visible', 'name']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'text') {
        /*, title, description, , isRequired,  commentText, commentPlaceholder, inputType, min, max, step, placeholder,  hideNumber,indent,  size,  , requiredErrorText, , , */
        blackList = ['valueName', 'defaultValue', 'correctAnswer', 'useDisplayValuesInDynamicTexts', 'clearIfInvisible', 'width', 'minWidth', 'maxWidth', 'state', 'titleLocation', 'descriptionLocation', 'visibleIf', 'enableIf', 'requiredIf', 'bindings', 'defaultValueExpression', 'readOnly', 'visible', 'name', 'autocomplete', 'dataList', 'startWithNewLine', 'validators', 'textUpdateMode', 'maxLength', 'minValueExpression', 'maxValueExpression', 'minErrorText', 'maxErrorText'] //
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'comment') {
        /*, title, description, , isRequired, , commentText, commentPlaceholder, placeholder,  hideNumber, , indent,  rows, cols, autoGrow,  requiredErrorText, , maxLength*/
        blackList = ['validators', 'valueName', 'defaultValue', 'correctAnswer', 'useDisplayValuesInDynamicTexts', 'clearIfInvisible', 'textUpdateMode', 'width', 'minWidth', 'maxWidth', 'state', 'titleLocation', 'descriptionLocation', 'visibleIf', 'enableIf', 'requiredIf', 'bindings', 'defaultValueExpression', 'startWithNewLine', 'readOnly', 'visible', 'name']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'multipletext') {
        /*, isRequired, placeholder, inputType, title, maxLength, size, requiredErrorText, title, description, commentText, commentPlaceholder, items, placeholder, inputType, title, maxLength, size, requiredErrorText,  hideNumber,  indent,  ,  requiredErrorText, */
        blackList = ['validators', 'valueName', 'defaultValue', 'correctAnswer', 'useDisplayValuesInDynamicTexts', 'clearIfInvisible', 'width', 'minWidth', 'maxWidth', 'colCount', 'state', 'titleLocation', 'descriptionLocation', 'visibleIf', 'enableIf', 'requiredIf', 'bindings', 'defaultValueExpression', 'startWithNewLine', 'readOnly', 'visible', 'name', 'itemSize']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'multipletextitem') {
        blackList = ['validators', 'name', 'size']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'matrix') {
        /*value, text, value, text, , title, description, , isRequired,  columns, visibleIf, enableIf, rows, visibleIf, enableIf, rowsOrder,  hideNumber, indent,  showHeader, verticalAlign, alternateRows, , ,  requiredErrorText, , isAllRowRequired, cells*/
        /*value, text, value, text, name, title, description, visible, isRequired, readOnly, showCommentArea, commentText, commentPlaceholder, columns, visibleIf, enableIf, rows, visibleIf, enableIf, rowsOrder, hideIfRowsEmpty, visibleIf, enableIf, requiredIf, bindings, defaultValueExpression, columnsVisibleIf, rowsVisibleIf, startWithNewLine, hideNumber, state, titleLocation, descriptionLocation, indent, width, minWidth, maxWidth, showHeader, verticalAlign, alternateRows, columnMinWidth, rowTitleWidth, valueName, defaultValue, correctAnswer, useDisplayValuesInDynamicTexts, clearIfInvisible, requiredErrorText, validators, isAllRowRequired, cells*/
        blackList = ['validators', 'valueName', 'defaultValue', 'correctAnswer', 'useDisplayValuesInDynamicTexts', 'clearIfInvisible', 'width', 'minWidth', 'maxWidth', 'state', 'titleLocation', 'descriptionLocation', 'hideIfRowsEmpty', 'visibleIf', 'enableIf', 'requiredIf', 'bindings', 'defaultValueExpression', 'columnsVisibleIf', 'rowsVisibleIf', 'startWithNewLine', 'readOnly', 'showCommentArea', 'commentText', 'commentPlaceholder', 'visible', 'name', 'columnMinWidth', 'rowTitleWidth', 'cells']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'itemvalue') {
        blackList = ['visibleIf', 'enableIf']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'image') {
        /*  imageLink, contentMode, imageFit, imageHeight, imageWidth, altText,  , hideNumber,  indent, , */
        blackList = ['startWithNewLine', 'visibleIf', 'bindings', 'defaultValueExpression', 'commentText', 'commentPlaceholder', 'state', 'descriptionLocation', 'width', 'name', 'visible', 'minWidth', 'maxWidth']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      } else if (options.obj.getType() === 'survey') {
        /*name, expression, includeIntoResult, expression, url, expression, html, locale,  showQuestionNumbers, requiredText,  name, expression, questionErrorLocation  */
        //console.log(options) 
        blackList = ['maxTimeToFinish', 'maxTimeToFinishPage', 'showTimerPanel', 'showTimerPanelMode', 'focusOnFirstError', 'checkErrorsMode', 'storeOthersAsComment', 'sendResultOnPageNext', 'textUpdateMode', 'clearInvisibleValues', 'calculatedValues', 'triggers', 'mode', 'cookieName', 'widthMode', 'width', 'navigateToUrl', 'url', 'navigateToUrlOnCondition', 'showTOC', 'tocLocation', 'questionTitleLocation', 'questionDescriptionLocation', 'questionTitlePattern', 'questionStartIndex', 'progressBarType', /*quitar para censos y encuestas*/'logoFit', 'showPageTitles', 'showPageNumbers',/*Evaluar*/ 'completedBeforeHtml', 'loadingHtml', 'html', 'completedHtmlOnCondition', /*Cambiar*/'completedHtml', 'questionsOnPageMode', 'showCompletedPage', 'maxTextLength', 'maxOthersLength', 'firstPageIsStarted', 'goNextPageAutomatic', 'locale' /*Evaluar*/, 'showNavigationButtons', 'showPrevButton', 'showProgressBar', 'questionsOrder', 'autoGrowComment', 'pageNextText', 'previewText', 'pagePrevText', 'showPreviewBeforeComplete', 'focusFirstQuestionAutomatic', 'startSurveyText', 'editText', 'completeText', 'includeIntoResult']
        options.canShow = blackList.indexOf(options.property.name) < 0;
        //options.locale = "customlocale"
      } else if (options.obj.getType() === 'dropdown') {
        //console.log(options.property.name)
        /* title, description, isRequired, placeholder, , choices, choicesOrder, showOtherItem, otherText, otherPlaceholder, showNoneItem, noneText, choicesMin, choicesMax, choicesStep, allowClear,   page, hideNumber,  indent,   requiredErrorText, otherErrorText*/
        blackList = ['validators', 'width', 'minWidth', 'maxWidth', 'valueName', 'defaultValue', 'correctAnswer', 'useDisplayValuesInDynamicTexts', 'clearIfInvisible', 'state', 'titleLocation', 'descriptionLocation', 'startWithNewLine', 'choicesByUrl', 'visibleIf', 'enableIf', 'requiredIf', 'bindings', 'hideIfChoicesEmpty', 'choicesVisibleIf', 'choicesEnableIf', 'choicesFromQuestion', 'choicesFromQuestionMode', 'readOnly', 'showCommentArea', 'commentText', 'commentPlaceholder', 'name', 'visible', 'autocomplete', 'defaultValueExpression']
        options.canShow = blackList.indexOf(options.property.name) < 0;
      }
    });
    creator.onTestSurveyCreated.add(function (sender, options) {
      options.survey.showNavigationButtons = false;
    });

    // Variable para almacenar el contador correlativo


    // Agregar controlador de eventos para el evento "onGenerateNewName"
    creator.onGenerateNewName.add(function (sender, options) {
      var contador = 1;
      var nuevoNombre = generarNombreUnico("Pregunta-", contador)
      options.name = nuevoNombre;
    });

    creator.onConditionQuestionsGetList.add(function (sender, options) {
      options.sortOrder = "none"
    });

    setCreator(creator);
  }

  useEffect(() => {
    (async () => {
      setProgress(true);
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

      setProgress(false);
    })()
  }, [todos.userInfo._id, todos.userInfo.role.alias, todos.userInfo.school._id, todos.userInfo.school.alias])

  const [value, setValue] = useState(0)
  const handleChange = (event, newValue) => {
    if (newValue === 1) {
      setVisibleAdd(true)
    } else if (newValue === 2) {
      setVisibleHelp(true)
    }
    setValue(0)
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <SimpleBackdrop open={progress} />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnack}
        autoHideDuration={4000}
        onClose={() => setOpenSnack(false)}
      >
        <Alert
          onClose={() => setOpenSnack(false)}
          severity={snackMessage.color}
          sx={{ width: '100%' }}
        >
          {snackMessage.message}
        </Alert>
      </Snackbar>
      <ImportFromBank
        setVisible={setVisibleImportBank}
        visible={visibleImportBank}
        dataQuestion={dataQuestion}
        setProgress={setProgress}
        setSnackMessage={setSnackMessage}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        type="estructura"
        creator={creator}
      />
      <ImportFromStruct
        setVisible={setVisibleImportStruct}
        visible={visibleImportStruct}
        dataStruct={dataStruct}
        setProgress={setProgress}
        setSnackMessage={setSnackMessage}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        type="estructura"
        creator={creator}
      />
      <ImportFromInstrument
        setVisible={setVisibleImportInstrument}
        visible={visibleImportInstrument}
        dataInstrument={dataInstrument}
        setProgress={setProgress}
        setSnackMessage={setSnackMessage}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        type="estructura"
        creator={creator}
      />
      <AddModal
        visible={visibleAdd}
        setVisible={setVisibleAdd}
        setProgress={setProgress}
        setdataTable={setdataTable}
        setSnackMessage={setSnackMessage}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setVisibleImportBank={setVisibleImportBank}
        setVisibleImportStruct={setVisibleImportStruct}
        setVisibleImportInstrument={setVisibleImportInstrument}
        setdataQuestion={setdataQuestion}
        setdataStruct={setdataStruct}
        setdataInstrument={setdataInstrument}
        creator={creator}
      />
      <ViewModal
        visible={visibleView}
        setVisible={setVisibleView}
        data={structData}
        setProgress={setProgress}
        setStructData={setStructData}
        canEdit={todos.userInfo}
        creator={creator}
        setVisibleEdit={setVisibleEdit}
      />

      <EditModal
        visible={visibleEdit}
        setVisible={setVisibleEdit}
        data={structData}
        setdataTable={setdataTable}
        setSnackMessage={setSnackMessage}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setProgress={setProgress}
        setVisibleImportBank={setVisibleImportBank}
        setVisibleImportStruct={setVisibleImportStruct}
        setVisibleImportInstrument={setVisibleImportInstrument}
        setdataQuestion={setdataQuestion}
        setdataStruct={setdataStruct}
        setdataInstrument={setdataInstrument}
        creator={creator}
      />

      <DeleteModal
        visible={visibleDelete}
        setVisible={setVisibleDelete}
        data={structData}
        setdataTable={setdataTable}
        setSnackMessage={setSnackMessage}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setProgress={setProgress}
        creator={creator}
      />
      <HelpModal img={Img} setVisible={setVisibleHelp} visible={visibleHelp} title="Cómo utilizar el Módulo de Estructuras base" />
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <DrawerHeader />
        <Breadcrumbs />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="icon position tabs example"
          >
            <CustomTab icon={<TableRowsIcon />} iconPosition="start" label="Todas las estructuras" {...a11yProps(0)} />
            <CustomTab icon={<AddIcon />} iconPosition="start" label="Nueva estructura base" {...a11yProps(1)} />
            <CustomTab
              icon={<HelpOutlineIcon />}
              iconPosition="start"
              label="Ayuda"
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <StructTable
            data={dataTable}
            setStructData={setStructData}
            setdataTable={setdataTable}
            setSnackMessage={setSnackMessage}
            setOpenSnack={setOpenSnack}
            snackMessage={snackMessage}
            setProgress={setProgress}
            setVisibleView={setVisibleView}
            setVisibleEdit={setVisibleEdit}
            setVisibleDelete={setVisibleDelete}
          />
        </TabPanel>
      </Box>
    </>
  )
}

export default StructManagement
