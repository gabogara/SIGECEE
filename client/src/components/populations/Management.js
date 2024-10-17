import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, Tab, Tabs } from "@mui/material";
import SimpleBackdrop from "../mui/ProgressMUI";
import CustomizedSnackbars from "../mui/SnackbarMUI";
import Breadcrumbs from "../layout/AppBreadcrumb";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ImportModal from "./modals/ImportPopulation";
import ViewModal from "./modals/ViewPopulation";
import EditModal from "./modals/EditPopulation";
import DeleteModal from "./modals/DeletePopulation";
import PopulationTable from "./tables/PopulationsTable";
import Api from "../../services/Api";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useSelector } from "react-redux";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HelpModal from "../help/Help";
import Img from '../../assets/images/InfoPoblaciones.png'

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

const CustomTab = styled(Tab)(() => ({
  minHeight: 55
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const PopulationManagement = () => {
  const [value, setValue] = useState(0);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState({
    color: "",
    message: "",
  });
  const [progress, setProgress] = useState(false);
  const [result, setResult] = useState([]);
  const [populationData, setPopulationData] = useState({});
  const [visibleView, setVisibleView] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const todos = useSelector((state) => state.todos);
  const [visibleHelp, setVisibleHelp] = useState(false);

  useEffect(() => {
    (async () => {
      setProgress(true);

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
    })();
  }, [todos]);

  const handleChange = (event, newValue) => {
    if (newValue === 1) {
      setValue(0);
      setVisibleAdd(true);
    } else if (newValue === 2) {
      setValue(0);
      setVisibleHelp(true);
    } else {
      setValue(newValue);
    }
  };
  return (
    <>
      <SimpleBackdrop open={progress} />
      <CustomizedSnackbars
        open={openSnack}
        setOpenSnack={setOpenSnack}
        message={snackMessage.message}
        color={snackMessage.color}
      />
      <ImportModal
        visible={visibleAdd}
        setVisible={setVisibleAdd}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setSnackMessage={setSnackMessage}
        setProgress={setProgress}
        setResult={setResult}
      />
      <EditModal
        populationData={populationData}
        visible={visibleEdit}
        setVisible={setVisibleEdit}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setSnackMessage={setSnackMessage}
        setProgress={setProgress}
        setResult={setResult}
      />
      <DeleteModal
        populationData={populationData}
        visible={visibleDelete}
        setVisible={setVisibleDelete}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setSnackMessage={setSnackMessage}
        setProgress={setProgress}
        setResult={setResult}
      />
      <ViewModal populationData={populationData} setVisible={setVisibleView} visible={visibleView} />
      <HelpModal img={Img} setVisible={setVisibleHelp} visible={visibleHelp} title="Cómo utilizar el Módulo de Poblaciones" />
      <Box sx={{ width: "100%", typography: "body1" }}>
        <DrawerHeader />
        <Breadcrumbs />
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Poblaciones"
          >
            <CustomTab
              icon={<TableRowsIcon />}
              iconPosition="start"
              label="Todas las poblaciones"
            />
            <CustomTab
              icon={<FileUploadIcon />}
              iconPosition="start"
              label="Importar nueva población"
            />
            <CustomTab
              icon={<HelpOutlineIcon />}
              iconPosition="start"
              label="Ayuda"
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <PopulationTable
            data={result}
            setPopulationData={setPopulationData}
            setOpenSnack={setOpenSnack}
            snackMessage={snackMessage}
            setSnackMessage={setSnackMessage}
            setVisibleView={setVisibleView}
            setVisibleEdit={setVisibleEdit}
            setVisibleDelete={setVisibleDelete}
            setResult={setResult}
            setProgress={setProgress}
          />
        </TabPanel>
        <TabPanel value={value} index={1}></TabPanel>
      </Box>
    </>
  );
};

export default PopulationManagement;
