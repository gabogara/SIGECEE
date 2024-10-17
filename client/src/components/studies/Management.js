import React, { useState, useEffect } from "react";
import SimpleBackdrop from "../mui/ProgressMUI";
import CustomizedSnackbars from "../mui/SnackbarMUI";
import Api from "../../services/Api";
import { Box, Tab, Tabs } from "@mui/material";
import TableRowsIcon from "@mui/icons-material/TableRows";
import PreviewIcon from "@mui/icons-material/Preview";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import StudiesTable from "./tables/StudiesTable";
import Breadcrumbs from "../layout/AppBreadcrumb";
import ViewModal from "./modals/ViewStudyChart";
import PostModal from "./modals/AddPost";
import EditPostModal from "./modals/EditPost";
import DeletePostModal from "./modals/DeletePost";
import PostTable from "./tables/PostTable";
import { useSelector, useDispatch } from 'react-redux';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HelpModal from "../help/Help";
import Img from '../../assets/images/InfoEstudios.png'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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

const StudyManagement = () => {
  const [openSnack, setOpenSnack] = useState(false);
  const [dataTable, setdataTable] = useState([]);
  const [dataTable2, setdataTable2] = useState([]);
  const [snackMessage, setSnackMessage] = useState({
    color: "",
    message: "",
  });
  const [progress, setProgress] = useState(false);
  const [instData, setInstData] = useState({});
  const [entryData, setEntryData] = useState({});
  const [visible, setVisible] = useState(false);
  const [visibleEditEntry, setVisibleEditEntry] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [visibleHelp, setVisibleHelp] = useState(false);

  useEffect(() => {
    (async () => {
      setProgress(true);
      if (todos.tab_add) {
        dispatch({ type: 'TAB_ADD_SELECTED_REMOVE' });
      }
      await Api.get('/study/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
        .then((res) => {
          setdataTable(res.data.studies)
        })
        .catch((error) => {
          console.error('Error:', error.message)
        })
      setProgress(false);
    })();
  }, [dispatch, todos]);

  const [value, setValue] = useState(0);
  const handleChange = async (event, newValue) => {

    if (newValue === 1) {
      setProgress(true);
      await Api.get('/blog/entries')
        .then((res) => {
          setdataTable2(res.data.entry)
          setValue(newValue);
        })
        .catch((error) => {
          console.error('Error:', error.message)
        })
      setProgress(false);
    } else if (newValue === 3) {
      setValue(0)
      setVisibleHelp(true)
    } else {
      setValue(newValue);
    }
  };

  return (
    <>
      <SimpleBackdrop open={progress} />
      <PostModal
        data={instData}
        setVisible={setVisible}
        visible={visible}
        setSnackMessage={setSnackMessage}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setProgress={setProgress}
        setdataTable={setdataTable}
        setValue={setValue}
        setdataTable2={setdataTable2}
      />
      <EditPostModal
        data={entryData}
        setVisible={setVisibleEditEntry}
        visible={visibleEditEntry}
        setSnackMessage={setSnackMessage}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setProgress={setProgress}
        setdataTable={setdataTable}
        setValue={setValue}
        setdataTable2={setdataTable2}
      />
      <DeletePostModal
        data={entryData}
        setVisible={setVisibleDelete}
        visible={visibleDelete}
        setSnackMessage={setSnackMessage}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setProgress={setProgress}
        setdataTable={setdataTable}
        setValue={setValue}
        setdataTable2={setdataTable2}
      />
      <CustomizedSnackbars
        open={openSnack}
        setOpenSnack={setOpenSnack}
        message={snackMessage.message}
        color={snackMessage.color}
      />
      <HelpModal img={Img} setVisible={setVisibleHelp} visible={visibleHelp} title="Cómo utilizar el Módulo de Estudios" />
      <Box sx={{ width: "100%", typography: "body1" }}>
        <DrawerHeader />
        <Breadcrumbs />
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="icon position tabs example"
          >
            <CustomTab
              icon={<TableRowsIcon />}
              iconPosition="start"
              label="Todos los estudios"
            />
            <CustomTab icon={<NewspaperIcon />} iconPosition="start" label="Publicaciones" {...a11yProps(1)} sx={{ display: (todos.userInfo.role.alias !== 'INV' ? 'inline-flex' : 'none') }} />
            <CustomTab icon={<PreviewIcon />} iconPosition="start" label="Configuración de estudio" sx={{ display: value === 2 ? 'inline-flex' : 'none', minHeight: 0 }} {...a11yProps(2)} />
            <CustomTab
              icon={<HelpOutlineIcon />}
              iconPosition="start"
              label="Ayuda"
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <StudiesTable
            data={dataTable}
            setInstData={setInstData}
            setdataTable={setdataTable}
            setSnackMessage={setSnackMessage}
            setOpenSnack={setOpenSnack}
            snackMessage={snackMessage}
            setValue={setValue}
            setVisible={setVisible}
            setProgress={setProgress}
            setEntryData={setEntryData}
            setVisibleEditEntry={setVisibleEditEntry}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PostTable
            data={dataTable2}
            setInstData={setInstData}
            setdataTable={setdataTable2}
            setSnackMessage={setSnackMessage}
            setOpenSnack={setOpenSnack}
            snackMessage={snackMessage}
            setValue={setValue}
            setVisible={setVisible}
            setProgress={setProgress}
            setVisibleEditEntry={setVisibleEditEntry}
            setEntryData={setEntryData}
            setVisibleDelete={setVisibleDelete}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ViewModal
            data={instData}
            setSnackMessage={setSnackMessage}
            setOpenSnack={setOpenSnack}
            snackMessage={snackMessage}
            setProgress={setProgress}
            progress={progress}
            setdataTable={setdataTable}
            setValue={setValue}
          />
        </TabPanel>
      </Box>
    </>
  );
};

export default StudyManagement;
