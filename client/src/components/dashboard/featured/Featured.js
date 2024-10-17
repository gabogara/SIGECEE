import "./featured.scss";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PieChartIcon from "@mui/icons-material/PieChart";
import Groups2Icon from '@mui/icons-material/Groups2';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import "@fontsource/montserrat/500.css";
import QuizIcon from "@mui/icons-material/Quiz";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const Featured = ({ type }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

  const handleClick = (item) => {
    dispatch({
      type: "ADD_SELECTED",
      payload: (item === 7 ? "ddlSurvey" : (item === 6 ? "ddlCensus" : (item === 3 ? "ddlQuestion" : (item === 4 ? "ddlStruct" : (item === 5 ? "ddlPopulation" : (item === 2 ? "ddlUser" : "ddlStudies")))))),
    });
    dispatch({ type: "ADD_SELECTED_OPTION", payload: item });
  };

  let data;

  switch (type) {
    case "usuarios":
      data = {
        title: "1. Gestionar usuarios",
        descripcion: (
          <>
            <Typography sx={{ fontWeight: 500, fontSize: '12px', color: '#000', textAlign: 'center', mb: 1 }}>
              Agregar, modificar, importar, eliminar cuentas de usuario y más.
              {(todos.userInfo.role.alias === 'ADM') && ' Puede gestionar todos los usuarios del sistema.'}
            </Typography>
          </>
        ),
        boton: "/users",
        link: "Ver todos los usuarios",
        click: 2
      };
      break;
    case "pregunta":
      data = {
        title: todos.userInfo.role.alias === 'ADM' ? "2. Gestionar preguntas" : "1. Gestionar preguntas",
        descripcion: (
          <>
            <Typography sx={{ fontWeight: 500, fontSize: '12px', color: '#000', textAlign: 'center', mb: 1 }}>
              Almacenar preguntas en el sistema para posteriormente reutilizarlas en la gestión de diferentes encuestas o censos.
              {(todos.userInfo.role.alias === 'ADM' || todos.userInfo.role.alias === 'DIR') && ' Puede gestionar sus propias preguntas y las preguntas de los demás usuarios del sistema.'}
              {(todos.userInfo.role.alias === 'POD') && ' Puede gestionar sus propias preguntas y visualizar las preguntas de los demás usuarios del sistema de su misma escuela.'}
              {(todos.userInfo.role.alias === 'INV') && ' Puede visualizar y gestionar sus propias preguntas.'}
            </Typography>
          </>
        ),
        boton: "/questions",
        link: "Ver todas las preguntas",
        click: 3
      };
      break;
    case "estructura":
      data = {
        title: todos.userInfo.role.alias === 'ADM' ? "3. Gestionar estructuras base" : "2. Gestionar estructuras base",
        descripcion: (
          <>
            <Typography sx={{ fontWeight: 500, fontSize: '12px', color: '#000', textAlign: 'center', mb: 1 }}>
              Almacenar estructuras base en el sistema para posteriormente reutilizarlas en la gestión de diferentes encuestas o censos.
              {(todos.userInfo.role.alias === 'ADM' || todos.userInfo.role.alias === 'DIR') && ' Puede gestionar sus propias estructuras base y las estructuras base de los demás usuarios del sistema.'}
              {(todos.userInfo.role.alias === 'POD') && ' Puede gestionar sus propias estructuras base y visualizar las estructuras base de los demás usuarios del sistema de su misma escuela.'}
              {(todos.userInfo.role.alias === 'INV') && ' Puede visualizar y gestionar sus propias estructuras base.'}
            </Typography>
          </>
        ),
        boton: "/structs",
        link: "Ver todas las estructuras base",
        click: 4
      };
      break;
    case "poblacion":
      data = {
        title: todos.userInfo.role.alias === 'ADM' ? "4. Gestionar poblaciones" : "3. Gestionar poblaciones",
        descripcion: (
          <>
            <Typography sx={{ fontWeight: 500, fontSize: '12px', color: '#000', textAlign: 'center', mb: 1 }}>
              Importar poblaciones para aplicarles encuestas cerradas o censos cerrados en línea.
              {(todos.userInfo.role.alias === 'ADM' || todos.userInfo.role.alias === 'DIR') && ' Puede gestionar sus propias poblaciones y las poblaciones de los demás usuarios del sistema.'}
              {(todos.userInfo.role.alias === 'POD') && ' Puede gestionar sus propias poblaciones y visualizar las poblaciones de los demás usuarios del sistema de su misma escuela.'}
              {(todos.userInfo.role.alias === 'INV') && ' Puede visualizar y gestionar sus propias poblaciones.'}
            </Typography>
          </>
        ),
        boton: "/populations",
        link: "Ver todas las poblaciones",
        click: 5
      };
      break;
    case "encuesta":
      data = {
        title: todos.userInfo.role.alias === 'ADM' ? "5. Gestionar encuestas" : "4. Gestionar encuestas",
        descripcion: (
          <>
            <Typography sx={{ fontWeight: 500, fontSize: '12px', color: '#000', textAlign: 'center', mb: 1 }}>
              Diseñar y aplicar encuestas abiertas o cerradas en línea.
              {(todos.userInfo.role.alias === 'ADM' || todos.userInfo.role.alias === 'DIR') && ' Puede gestionar sus propias encuestas y las encuestas de los demás usuarios del sistema.'}
              {(todos.userInfo.role.alias === 'POD') && ' Puede gestionar sus propias encuestas y visualizar las encuestas de los demás usuarios del sistema de su misma escuela.'}
              {(todos.userInfo.role.alias === 'INV') && ' Puede visualizar y gestionar sus propias encuestas.'}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '12px', color: '#000', textAlign: 'center' }}>
              Para gestionar una encuesta cerrada, primero debe dirigirse al módulo de <Link to='/populations' style={{ textDecoration: 'none', fontWeight: 600 }}>Poblaciones</Link> e importar una población.
            </Typography>
          </>
        ),
        boton: "/surveys",
        click: 7
      };
      break;
    case "censo":
      data = {
        title: todos.userInfo.role.alias === 'ADM' ? "6. Gestionar censos" : "5. Gestionar censos",
        descripcion: (
          <>
            <Typography sx={{ fontWeight: 500, fontSize: '12px', color: '#000', textAlign: 'center', mb: 1 }}>
              Diseñar y aplicar censos abiertos o cerrados en línea.
              {(todos.userInfo.role.alias === 'ADM' || todos.userInfo.role.alias === 'DIR') && ' Puede gestionar sus propios censos y los censos de los demás usuarios del sistema.'}
              {(todos.userInfo.role.alias === 'POD') && ' Puede gestionar sus propios censos y visualizar los censos de los demás usuarios del sistema.'}
              {(todos.userInfo.role.alias === 'INV') && ' Puede visualizar y gestionar sus propios censos.'}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '12px', color: '#000', textAlign: 'center' }}>
              Para gestionar un censo cerrado, primero debe dirigirse al módulo de <Link to='/populations' style={{ textDecoration: 'none', fontWeight: 600 }}>Poblaciones</Link> e importar una población.
            </Typography>
          </>
        ),
        link: "Ver todos los censos",
        boton: "/census",
        click: 6
      };
      break;
    case "estudio":
      data = {
        title: todos.userInfo.role.alias === 'ADM' ? "7. Gestionar estudios" : "6. Gestionar estudios",
        descripcion: (
          <>
            <Typography sx={{ fontWeight: 500, fontSize: '12px', color: '#000', textAlign: 'center', mb: 1 }}>
              Aplicar estudios a encuestas o censos ya ejecutados. Puede visualizar y gestionar sus propios estudios y los estudios de los demás usuarios del sistema.
              {(todos.userInfo.role.alias === 'ADM' || todos.userInfo.role.alias === 'DIR') && ' Puede gestionar sus propios estudios y los estudios de los demás usuarios del sistema.'}
              {(todos.userInfo.role.alias === 'POD') && ' Puede gestionar sus propios estudios.'}
              {(todos.userInfo.role.alias === 'INV') && ' Puede gestionar sus propios estudios.'}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '12px', color: '#000', textAlign: 'center' }}>
              Para gestionar un estudio, primero debe dirigirse a los módulos de <Link to='/surveys' style={{ textDecoration: 'none', fontWeight: 600 }}>Encuestas</Link> ó <Link to='/census' style={{ textDecoration: 'none', fontWeight: 600 }}>Censos</Link>, debe crear y publicar en línea.
            </Typography>
          </>
        ),
        boton: "/studies",
        link: "Ver todos los estudios",
        click: 8
      };
      break;
    default:
      break;
  }

  return (

    <div className="featured">
      <Link to={data.boton} style={{ textDecoration: 'none' }} onClick={() => handleClick(data.click)}>
        <div className="top">
          <h1 className="title">{data.title}</h1>
        </div>
        <div className="bottom">
          {type === 'usuarios' && <ManageAccountsIcon sx={{ fontSize: 40, color: '#ffab40' }} />}
          {type === 'encuesta' && <FactCheckIcon sx={{ fontSize: 40, color: '#ffab40' }} />}
          {type === 'censo' && <Groups2Icon sx={{ fontSize: 40, color: '#ffab40' }} />}
          {type === 'estudio' && <PieChartIcon sx={{ fontSize: 40, color: '#ffab40' }} />}
          {type === 'pregunta' && <QuestionMarkIcon sx={{ fontSize: 40, color: '#ffab40' }} />}
          {type === 'estructura' && <QuizIcon sx={{ fontSize: 40, color: '#ffab40' }} />}
          {type === 'poblacion' && <TravelExploreIcon sx={{ fontSize: 40, color: '#ffab40' }} />}

          <p className="desc">{data.descripcion}</p>
          {/* {data.boton} */}
        </div>
      </Link>

    </div>


  );
};

export default Featured;
