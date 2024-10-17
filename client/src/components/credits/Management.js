import React from "react";


/** MUI imports */
import { Grid, Typography, Card, CardContent } from "@mui/material";


import "@fontsource/montserrat/500.css";
import Breadcrumbs from '../layout/AppBreadcrumb';
import Avatar from '@mui/material/Avatar';

import ucv from "../../assets/images/UCV.png";
import ciencias from "../../assets/images/ciencia.png";
import sigecee from "../../assets/images/sigecee_blue.png";


const Credits = () => {

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 3.5 }}
      >

        <Grid item xs={12} md={10} lg={8} sx={{ justifyContent: 'center', alignItems: 'center', p: 1, mt: 4 }} >
          <Breadcrumbs />
          <Card sx={{ pt: 3.7, pb: 0.7, px: 5, boxShadow: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Grid container sx={{ display: "flex", justifyContent: "center", textAlign: 'center', mt: 1 }}>

                <Typography variant="h6" fontFamily="Montserrat" sx={{ color: '#0d47a1' }}>
                  Sobre SIGECEE
                </Typography>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Typography variant="subtitle1" sx={{ textAlign: 'justify' }}>
                  El Sistema para la Gestión de Censos, Encuestas y Estudios (SIGECEE) de la Facultad de Ciencias de la Universidad Central de Venezuela se trata de una aplicación web que permite la gestión y ejecución de censos y encuestas en línea, es decir, los usuarios pueden crear y personalizar censos y encuestas, aplicarlos a una población específica (utilizando el correo electrónico como medio de difusión) o sin especificar (que genera un enlace único que puede ser compartido y difundido por redes sociales, mensajería instantánea, entre otros), recopilar y visualizar los datos obtenidos y posteriormente, realizarles estudios.
                </Typography>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Typography variant="subtitle1" sx={{ textAlign: 'justify' }}>
                  SIGECEE proporciona una solución innovadora y eficaz, respaldada por tecnología y adaptada a las necesidades de la comunidad de la Facultad de Ciencias, para facilitar procesos académico-administrativos, contribuir a la toma de decisiones, desarrollo de estrategias, comprensión de las necesidades y demandas de una población, y adicionalmente, apoye las actividades y trabajos de investigación que se lleven a cabo en la Facultad. Además, SIGECEE resuelve la problemática relacionada a cómo se llevaban a cabo anteriormente los censos y encuestas, utilizando herramientas de terceros que presentaban muchas limitaciones.
                </Typography>

              </Grid>
              <Grid item sx={{ display: "flex", justifyContent: "center", textAlign: 'center', mt: 5 }}>
                <Typography variant="h6" fontFamily="Montserrat" sx={{ color: '#0d47a1' }}>
                  Créditos
                </Typography>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 600 }}>
                  SIGECEE fue desarrollada por:
                </Typography>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                  Johanna Rojas y Gabriel Restrepo
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                  Estudiantes de la Facultad de Ciencias de la Escuela de Computación de la Universidad Central de Venezuela, quienes presentan SIGECEE como Trabajo Especial de Grado para optar al título de Licenciados en Computación.
                </Typography>
              </Grid>
              <Grid item xs={12} mt={3}>
                <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 600 }}>
                  Tutoría:
                </Typography>
              </Grid>
              <Grid item xs={12} mt={1}>
                <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                  Profa. Yosly Hernández
                </Typography>
              </Grid>
              <Grid item xs={12} mt={3}>
                <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 600 }}>
                  Conceptualización, diagramación y contenido:
                </Typography>
              </Grid>
              <Grid item xs={12} mt={1}>
                <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                  Prof. Antonio Machado
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                  Prof. Ernesto Fuenmayor
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', verticalAlign: 'middle', justifyContent: 'space-evenly', justifySelf: 'center', alignItems: 'center', mt: 4 }}>

                <Avatar src={ucv} sx={{ width: 80, height: 80, verticalAlign: 'middle', }} />
                <Avatar src={sigecee} sx={{ width: 150, height: 70, verticalAlign: 'middle' }} variant="rounded" />
                <Avatar src={ciencias} sx={{ width: 65, height: 65, verticalAlign: 'middle' }} variant="rounded" />

              </Grid>


            </CardContent>
          </Card>
        </Grid>
      </Grid>


    </>
  );
};

export default Credits;
