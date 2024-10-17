import "./widget.scss";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PieChartIcon from "@mui/icons-material/PieChart";
import Groups2Icon from "@mui/icons-material/Groups2";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Widget = ({ type, count, countActive }) => {
  let data;
  const amount = count;
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const handleClick = (item) => {
    dispatch({ type: "TAB_ADD_SELECTED" });
    dispatch({
      type: "ADD_SELECTED",
      payload: (item === 7 ? "ddlSurvey" : (item === 6 ? "ddlCensus" : "ddlStudies")),
    });
    dispatch({ type: "ADD_SELECTED_OPTION", payload: item });
  };

  switch (type) {
    case "encuesta":
      data = {
        title: (todos.userInfo.role.alias === 'ADM' || todos.userInfo.role.alias === 'DIR' ? "ENCUESTAS" : 'MIS ENCUESTAS'),
        link: <Link to="/surveys" onClick={() => handleClick(7)}>Ver todas las encuestas</Link>,
        activas: "Activas: " + countActive,
        icon: (
          <FactCheckIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "censo":
      data = {
        title: (todos.userInfo.role.alias === 'ADM' || todos.userInfo.role.alias === 'DIR' ? "CENSOS" : 'MIS CENSOS'),
        link: <Link to="/census" onClick={() => handleClick(6)}>Ver todos los censos</Link>,
        activas: "Activos: " + countActive,
        icon: (
          <Groups2Icon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "estudio":
      data = {
        title: (todos.userInfo.role.alias === 'ADM' || todos.userInfo.role.alias === 'DIR' ? "ESTUDIOS" : 'MIS CONFIGURACIONES DE ESTUDIOS'),
        link: <Link to="/studies" onClick={() => handleClick(8)}>Ver todos los estudios</Link>,
        activas: "",
        icon: (
          <PieChartIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{amount}</span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">{data.activas}</div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
