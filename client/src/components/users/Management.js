import React, { useState, useEffect } from "react";
import ViewModal from "./modals/ViewUser";
import AddModal from "./modals/AddUser";
import EditModal from "./modals/EditUser";
import DeleteModal from "./modals/DeleteUser";
import ModalRecoverPassUser from "./modals/RecoverPassUser";
import ChangeStatusModal from "./modals/ChangeStatusUser";
import UsersTable from "./tables/UsersTable";
import SimpleBackdrop from "../mui/ProgressMUI";
import CustomizedSnackbars from "../mui/SnackbarMUI";
import Api from "../../services/Api";
import { Box, Tab, Tabs } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TableRowsIcon from "@mui/icons-material/TableRows";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ImportUsers from "./modals/ImportUsers";
import Breadcrumbs from "../layout/AppBreadcrumb";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HelpModal from "../help/Help";
import Img from '../../assets/images/InfoUsuarios.png'

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
  minHeight: 55,
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const UserManagement = () => {
  const [result, setResult] = useState([]);
  const [visibleView, setVisibleView] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleChange, setVisibleChange] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleRecover, setVisibleRecover] = useState(false);
  const [visibleImport, setVisibleImport] = useState(false);
  const [userData, setUserData] = useState({});
  const [accionChangeStatus, setAccionChangeStatus] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState({
    color: "",
    message: "",
  });
  const [roles, setRoles] = useState([]);
  const [schools, setSchools] = useState([]);
  const [progress, setProgress] = useState(false);
  const [visibleHelp, setVisibleHelp] = useState(false);

  useEffect(() => {
    (async () => {
      setProgress(true);
      await Api.get("/user/all")
        .then((res) => {
          setResult(res.data.users);
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
  }, []);

  const [value, setValue] = useState(0);
  const handleChange = async (event, newValue) => {
    if (newValue === 1) {
      setValue(0);
      setProgress(true)
      await Api.get('/user/onlyDetails')
        .then(async (res) => {
          setRoles(res.data.res.roles);
          setSchools(res.data.res.schools);
        })
        .catch((error) => {
          setSnackMessage({
            color: "error",
            message: error.response.data.message,
          });
          setOpenSnack(true);
        })
      setProgress(false)
      setVisibleAdd(true);
    } else if (newValue === 2) {
      setValue(0);
      setVisibleImport(true);
    } else if (newValue === 3) {
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
      <ViewModal
        data={userData}
        roles={roles}
        schools={schools}
        setVisible={setVisibleView}
        visible={visibleView}
      />
      <AddModal
        roles={roles}
        schools={schools}
        visible={visibleAdd}
        setVisible={setVisibleAdd}
        setResult={setResult}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setSnackMessage={setSnackMessage}
        setProgress={setProgress}
      />
      <ModalRecoverPassUser
        data={userData}
        setVisible={setVisibleRecover}
        visible={visibleRecover}
        setResult={setResult}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setSnackMessage={setSnackMessage}
        setProgress={setProgress}
      />
      <EditModal
        data={userData}
        roles={roles}
        schools={schools}
        setVisible={setVisibleEdit}
        visible={visibleEdit}
        setResult={setResult}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setSnackMessage={setSnackMessage}
        setProgress={setProgress}
      />
      <ChangeStatusModal
        setVisible={setVisibleChange}
        visible={visibleChange}
        setResult={setResult}
        data={userData}
        accion={accionChangeStatus}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setSnackMessage={setSnackMessage}
        setProgress={setProgress}
        roles={roles}
        schools={schools}
      />
      <DeleteModal
        setVisible={setVisibleDelete}
        visible={visibleDelete}
        setResult={setResult}
        data={userData}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setSnackMessage={setSnackMessage}
        setProgress={setProgress}
        roles={roles}
        schools={schools}
      />
      <ImportUsers
        visible={visibleImport}
        setVisible={setVisibleImport}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setSnackMessage={setSnackMessage}
        setProgress={setProgress}
        setResult={setResult}
      />
      <HelpModal img={Img} setVisible={setVisibleHelp} visible={visibleHelp} title="Cómo utilizar el Módulo de Usuarios" />
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
              label="Todos los usuarios"
            />
            <CustomTab
              icon={<AddIcon />}
              iconPosition="start"
              label="Crear usuario"
            />
            <CustomTab
              icon={<FileUploadIcon />}
              iconPosition="start"
              label="Importar usuarios masivo"
            />
            <CustomTab
              icon={<HelpOutlineIcon />}
              iconPosition="start"
              label="Ayuda"
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <UsersTable
            data={result}
            setUserData={setUserData}
            setAccionChangeStatus={setAccionChangeStatus}
            setVisibleEdit={setVisibleEdit}
            setVisibleChange={setVisibleChange}
            setVisibleDelete={setVisibleDelete}
            setOpenSnack={setOpenSnack}
            snackMessage={snackMessage}
            setSnackMessage={setSnackMessage}
            setVisibleView={setVisibleView}
            setVisibleRecover={setVisibleRecover}
            setProgress={setProgress}
            setRoles={setRoles}
            setSchools={setSchools}
          />
        </TabPanel>
        <TabPanel value={value} index={1}></TabPanel>
      </Box>
    </>
  );
};

export default UserManagement;
