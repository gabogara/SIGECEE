import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  SearchPanel,
  Toolbar,
  TableColumnVisibility,
  TableColumnResizing,
} from "@devexpress/dx-react-grid-material-ui";
import { PagingState, IntegratedPaging } from "@devexpress/dx-react-grid";
import {
  Paper,
  Chip,
  Typography,
} from "@mui/material";
import { SearchState, IntegratedFiltering } from "@devexpress/dx-react-grid";
import moment from 'moment';
import Api from '../../../services/Api';
import RowMenu from './RowMenu'

const UsersTable = ({
  data,
  setUserData,
  setAccionChangeStatus,
  setVisibleEdit,
  setVisibleChange,
  setVisibleDelete,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setVisibleView,
  setVisibleRecover,
  setProgress,
  setRoles,
  setSchools,
}) => {
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchState] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([25, 50, 100]);
  const [defaultHiddenColumnNames] = useState([
    "colHiddenName",
    "colHiddenRol",
    "colHiddenSchool",
    "colHiddenStatus",
  ]);
  const [columnWidths, setColumnWidths] = useState([])

  const tableMessages = {
    noData: "No hay registros",
  };

  const noColumnsMessage = {
    noColumns: "",
  };

  useEffect(() => {
    (async () => {
      const setInfo = async (id, action) => {
        setProgress(true)
        await Api.get('/user/details?_id=' + id)
          .then(async (res) => {
            setUserData(res.data.res.users);
            setRoles(res.data.res.roles);
            setSchools(res.data.res.schools);
            if (action === 'view') {
              setVisibleView(true);
            } else if (action === 'edit') {
              setVisibleEdit(true);
            } else if (action === 'recover') {
              setVisibleRecover(true);
            } else if (action === 'change') {
              setVisibleChange(true);
            } else if (action === 'delete') {
              setVisibleDelete(true);
            }
          })
          .catch((error) => {
            setSnackMessage({
              color: "error",
              message: error.response.data.message,
            });
            setOpenSnack(true);
          })
        setProgress(false)
      }

      const usersRows = data.map((user, index) => ({
        id: index + 1,
        colHiddenName: user.name,
        colHiddenRol: user.role,
        colHiddenSchool: user.school ? user.school : "",
        colHiddenStatus: user.status === 0
          ? "Bloqueado"
          : user.status === 1
            ? "Activo"
            : "Eliminado",
        user_name: (
          <>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{user.name}</Typography>
            <Typography sx={{ fontSize: 12 }}>
              Registro: {moment(user.createdAt).format('DD MMM YYYY hh:mm a')}
            </Typography>
          </>
        ),
        user_email: user.email,
        user_school: (
          <>
            <Typography sx={{ fontSize: 14 }}>{user.role}</Typography>
            <Typography sx={{ fontSize: 12 }}>
              Escuela: {user.school ? user.school : "-"}
            </Typography>
          </>
        ),
        /*col4: <Checkbox disabled checked={user.isAdmin} sx={{ p: 0 }} />,*/
        created_by: user.createdBy ? user.createdBy : "Sistema",
        user_status: (
          <Chip
            fontSize="small"
            size="small"
            label={
              user.status === 0
                ? "Bloqueado"
                : user.status === 1
                  ? "Activo"
                  : "Eliminado"
            }
            color={
              user.status === 0
                ? "error"
                : user.status === 1
                  ? "success"
                  : "error"
            }
          />
        ),
        actions: (
          <>
            <RowMenu row={user} setInfo={setInfo} setAccionChangeStatus={setAccionChangeStatus} sx={{ cursor: "pointer" }} />
          </>
        ),
      }));

      setRows(usersRows);

      setColumnWidths([
        { columnName: "colHiddenName", width: 0 },
        { columnName: "colHiddenRol", width: 0 },
        { columnName: "colHiddenSchool", width: 0 },
        { columnName: "colHiddenStatus", width: 0 },
        { columnName: 'user_name', width: '28%' },
        { columnName: 'user_email', width: '22%' },
        { columnName: 'user_school', width: '15%' },
        { columnName: 'created_by', width: '15%' },
        { columnName: 'user_status', width: '10%' },
        { columnName: 'actions', width: '10%' },
      ])
    })();
  }, [data, setRows, setVisibleDelete, setVisibleEdit, setOpenSnack, setSnackMessage, snackMessage, setUserData, setVisibleChange, setAccionChangeStatus, setVisibleView, setVisibleRecover, setProgress, setRoles, setSchools]);

  //Columnas del grid
  const columns = [
    // { name: 'id', title: 'Id' },
    { name: "colHiddenName", title: " " },
    { name: "colHiddenRol", title: " " },
    { name: "colHiddenSchool", title: " " },
    { name: "colHiddenStatus", title: " " },
    { name: "user_name", title: "Nombre" },
    { name: "user_email", title: "Correo" },
    { name: "user_school", title: "Rol/Escuela" },
    /*{ name: "col4", title: "¿Admin?" },*/
    { name: "created_by", title: "Creado por" },
    { name: "user_status", title: "Estado" },
    { name: "actions", title: "Acciones" },
  ];

  const [tableColumnExtensions] = useState([
    // { columnName: 'id', align: 'left', width: '5%' },
    { columnName: "user_name", align: "left", width: "25%", wordWrapEnabled: true },
    { columnName: "user_email", align: "left", width: "20%", wordWrapEnabled: true },
    { columnName: "created_by", align: "center", wordWrapEnabled: true },
    /*{ columnName: "col4", align: "center", width: "10%" },*/
    { columnName: "user_school", align: "left", wordWrapEnabled: true },
    { columnName: "user_status", align: "center" },
    { columnName: "actions", align: "center" },
  ]);

  const PagingPanelContainer = ({ ...props }) => (
    <PagingPanel.Container {...props} />
  );

  const pagingMessages = {
    info: ({ from, to, count }) =>
      `${from}${from < to ? `-${to}` : ""} ${"de"} ${count}`,
    rowsPerPage: "Usuarios por página",
  };

  const searchMessages = {
    searchPlaceholder: "Buscar",
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
          <Table
            columnExtensions={tableColumnExtensions}
            messages={tableMessages}
          />
          <TableColumnResizing columnWidths={columnWidths} onColumnWidthsChange={setColumnWidths} resizingMode={"nextColumn"} />
          <TableColumnVisibility
            defaultHiddenColumnNames={defaultHiddenColumnNames}
            messages={noColumnsMessage}
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
  );
};

UsersTable.propTypes = {
  data: PropTypes.array,
  setUserData: PropTypes.func,
  setAccionChangeStatus: PropTypes.func,
  setVisibleEdit: PropTypes.func,
  setVisibleChange: PropTypes.func,
  setVisibleDelete: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setVisibleView: PropTypes.func,
  setVisibleRecover: PropTypes.func,
  setProgress: PropTypes.func,
  setRoles: PropTypes.func,
  setSchools: PropTypes.func,
};

export default UsersTable;
