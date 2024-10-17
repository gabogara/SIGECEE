import React, { useEffect, useState } from 'react';
import EmptyView from '../../components/common/EmptyView';
import FilterPanel from '../../components/Home/FilterPanel';
import FilterPanel2 from '../../components/Home/FilterPanel/index2'
import List from '../../components/Home/List';
import SearchBar from '../../components/Home/SearchBar';
import { Grid, Typography, Box } from "@mui/material";
//import { DataList } from '../../constants';
import './styles.css';
import Api from '../../../../../services/Api'
import PieChartIcon from '@mui/icons-material/PieChart';
import Groups2Icon from '@mui/icons-material/Groups2';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

import surveyImg from '../../../../../assets/images/surveypng.png'
import Logo2 from "../../../../../assets/images/sigecee_blue_simple.png";
import Avatar from '@mui/material/Avatar';

import ucv from "../../../../../assets/images/UCV.png";
import ciencias from "../../../../../assets/images/ciencia.png";
import computacion from "../../../../../assets/images/computacionucv.jpg";
const Home = (props) => {
  const { myRefAbout, myRefFunc, myRefPosts, myRefCredits } = props;

  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [list, setList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [resultsFound, setResultsFound] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  //console.log(DataList)

  const handleSelectCategory = (event, value) =>
    setSelectedCategory(value);

  const applyFilters = () => {
    let updatedList = list;

    // Category Filter
    if (selectedCategory !== "todos") {
      updatedList = updatedList.filter(
        (item) => item.category === selectedCategory
      );
    }

    // Search Filter
    if (searchInput) {
      updatedList = updatedList.filter(
        (item) =>
          item.title.toLowerCase().search(searchInput.toLowerCase().trim()) !==
          -1 || item.descripcion.toLowerCase().search(searchInput.toLowerCase().trim()) !==
          -1 || item.category.toLowerCase().search(searchInput.toLowerCase().trim()) !==
          -1
      );
    }

    setFilterList(updatedList);

    !updatedList.length ? setResultsFound(false) : setResultsFound(true);
  };

  useEffect(() => {
    (async () => {
      await Api.get("/blog/entriesActive").then(async (res) => {
        const rows = res.data.entry.map((entry, index) => ({
          id: index + 1,
          id_ins: entry._id,
          title: entry.title,
          descripcion: entry.description,
          category: entry.ins_type.toLowerCase(),
          bagde: entry.ins_type,
          url: "/entry?id=" + (entry.ins_type === 'Censo' ? entry.census : entry.survey) + "&type=" + entry.ins_type,
          date: entry.createdAt,
          coverSrc: entry.image //"https://source.unsplash.com/random",
        }))
        setList(rows)
        setFilterList(rows)

      }).catch((error) => {
        console.error('Error:', error.message)
      });
    })();
  }, []);

  useEffect(() => {
    if (list.length > 0) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchInput]);

  return (
    <div className='home'>
      {/* Search Bar */}

      <Grid container spacing={4} sx={{ mt: 1 }} justifyContent="center" ref={myRefAbout}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ mt: 1, fontFamily: 'Montserrat', textAlign: 'center' }}>Acerca de SIGECEE</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ textAlign: 'justify', fontFamily: 'Montserrat' }}>
            El Sistema para la Gestión de Censos, Encuestas y Estudios (SIGECEE) de la Facultad de Ciencias de la Universidad Central de Venezuela es una aplicación web que permite la gestión y ejecución de censos y encuestas en línea, es decir, los usuarios pueden crear y personalizar censos y encuestas, aplicarlos a una población específica (utilizando el correo electrónico como medio de difusión) o sin especificar (que genera un enlace único que puede ser compartido y difundido por redes sociales, mensajería instantánea, entre otros), recopilar y visualizar los datos obtenidos y posteriormente, realizarles estudios.
          </Typography>
          <Typography variant="subtitle1" sx={{ textAlign: 'justify', fontFamily: 'Montserrat', mt: 1 }}>
            SIGECEE proporciona una solución innovadora y eficaz, respaldada por tecnología y adaptada a las necesidades de la comunidad de la Facultad de Ciencias, para facilitar procesos académico-administrativos, contribuir a la toma de decisiones, desarrollo de estrategias, comprensión de las necesidades y demandas de una población, y adicionalmente, apoye las actividades y trabajos de investigación que se lleven a cabo en la Facultad.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            sx={{
              display: "block",
              width: '100%',
            }}
            alt="SIGECEE"
            src={surveyImg}
          />
        </Grid>
      </Grid>

      <Grid container spacing={6} sx={{ textAlign: 'center', mb: 5, mt: 0.5 }} ref={myRefFunc}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ mt: 1, fontFamily: 'Montserrat', textAlign: 'center' }}>Funcionalidades</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TravelExploreIcon sx={{ fontSize: 70, color: '#ffab40' }} />
          <Typography variant="h5" sx={{ mt: 1, fontFamily: 'Montserrat' }}>Gestión de poblaciones</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, fontFamily: 'Montserrat' }}>Permite almacenar poblaciones para ser utilizadas en encuestas y censos cerrados.</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <FactCheckIcon sx={{ fontSize: 70, color: '#ffab40' }} />
          <Typography variant="h5" sx={{ mt: 1, fontFamily: 'Montserrat' }}>Gestión de encuestas</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, fontFamily: 'Montserrat' }}>Este módulo permite la gestión y aplicación de encuestas en línea.</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Groups2Icon sx={{ fontSize: 70, color: '#ffab40' }} />
          <Typography variant="h5" sx={{ mt: 1, fontFamily: 'Montserrat' }}>Gestión de censos</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, fontFamily: 'Montserrat' }}>Permite la gestión y aplicación de censos en línea. Los censos generan nuevas poblaciones.</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChartIcon sx={{ fontSize: 70, color: '#ffab40' }} />
          <Typography variant="h5" sx={{ mt: 1, fontFamily: 'Montserrat' }}>Gestión de estudios</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, fontFamily: 'Montserrat' }}>Permite aplicar estudios (diferentes tipos de gráficas y operaciones aritméticas y lógicas) a los datos recolectados de encuestas y censos.</Typography>
        </Grid>
      </Grid >
      <Grid container spacing={6} sx={{ textAlign: 'center', mb: 0.5, mt: 0.5 }} ref={myRefPosts}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ mt: 1, fontFamily: 'Montserrat', textAlign: 'center' }} >Publicaciones</Typography>
        </Grid>
      </Grid>
      {list.length > 0 && <Grid container spacing={6} sx={{ mb: 5, }}>
        <Grid item xs={12}>
          <SearchBar
            value={searchInput}
            changeInput={(e) => setSearchInput(e.target.value)}
          />
          <div className='responsive'><FilterPanel2 selectedCategory={selectedCategory}
            selectCategory={handleSelectCategory}></FilterPanel2></div>

          <div className='home_panelList-wrap'>
            {/* Filter Panel */}
            <div className='home_panel-wrap2'>
              <FilterPanel
                selectedCategory={selectedCategory}
                selectCategory={handleSelectCategory}
              />
            </div>
            {/* List & Empty View */}

            <div className='home_list-wrap'>
              {resultsFound ? <List list={filterList} /> : <EmptyView />}

            </div>
          </div>
        </Grid>

      </Grid>}
      {list.length === 0 && <Grid container spacing={6} sx={{ mb: 5, }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 3, fontFamily: 'Montserrat', textAlign: 'center' }} >No hay publicaciones recientes.</Typography>
        </Grid>
      </Grid>}
      <Grid container justifyContent='center' sx={{ mb: 5 }} ref={myRefCredits}>
        <Grid item xs={12} >
          <Box>
            <Grid container spacing={6} sx={{ textAlign: 'center', mb: 0.5, mt: 0.5 }}>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{ mt: 1, fontFamily: 'Montserrat', textAlign: 'center' }} >Créditos</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center',
            }}>

              <Box
                component="img"
                sx={{
                  display: "block",
                  height: 20,
                  mt: 5,
                  verticalAlign: 'middle'
                }}
                alt="SIGECEE"
                src={Logo2}
              />

            </Grid>
            <Grid item xs={12} mt={2} sx={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 600, fontFamily: 'Montserrat' }}>
                fue desarrollada por:
              </Typography>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Typography variant="subtitle1" sx={{ textAlign: 'center', fontFamily: 'Montserrat' }}>
                Johanna Rojas y Gabriel Restrepo
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{
              mt: 3, display: 'flex', justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Typography variant="subtitle2" sx={{
                textAlign: 'center',
                width: {
                  xs: '100%',
                  lg: '50%'
                }, fontFamily: 'Montserrat'
              }}>
                Estudiantes de la Escuela de Computación, Facultad de Ciencias de la Universidad Central de Venezuela, quienes presentan SIGECEE como Trabajo Especial de Grado para optar al título de Licenciados en Computación.
              </Typography>
            </Grid>
            <Grid item xs={12} mt={3}>
              <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 600, fontFamily: 'Montserrat' }}>
                Tutoría:
              </Typography>
            </Grid>
            <Grid item xs={12} mt={1}>
              <Typography variant="subtitle1" sx={{ textAlign: 'center', fontFamily: 'Montserrat' }}>
                Profa. Yosly Hernández
              </Typography>
            </Grid>
            <Grid item xs={12} mt={3}>
              <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 600, fontFamily: 'Montserrat' }}>
                Aportes:
              </Typography>
            </Grid>
            <Grid item xs={12} mt={1}>
              <Typography variant="subtitle1" sx={{ textAlign: 'center', fontFamily: 'Montserrat' }}>
                Prof. Antonio Machado
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ textAlign: 'center', fontFamily: 'Montserrat' }}>
                Prof. Ernesto Fuenmayor
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', verticalAlign: 'middle', justifyContent: 'space-evenly', justifySelf: 'center', alignItems: 'center', mt: 4, fontFamily: 'Montserrat' }}>

              <Avatar src={ucv} sx={{ width: 90, height: 90, verticalAlign: 'middle', }} />
              <Avatar src={ciencias} sx={{ width: 75, height: 75, verticalAlign: 'middle' }} variant="rounded" />
              <Avatar src={computacion} sx={{ width: 75, height: 75, verticalAlign: 'middle' }} variant="rounded" />

            </Grid>


          </Box>
        </Grid>
      </Grid>
    </div >
  );

};

export default Home;

